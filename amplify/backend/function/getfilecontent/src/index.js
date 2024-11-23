const AWS = require("aws-sdk");
const PDFParser = require("pdf-parse");
const s3 = new AWS.S3();
const axios = require("axios");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff(fn, retries = 5, delayMs = 1000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        attempt++;
        const backoffDelay = delayMs * Math.pow(2, attempt);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await delay(backoffDelay);
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

async function callChatGpt(apiUrl, headers, data) {
  return await axios.post(apiUrl, data, { headers });
}

exports.handler = async (event) => {
  const { Parameters } = await new AWS.SSM()
    .getParameters({
      Names: ["ChagptKey"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();
  console.log(Parameters);
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + Parameters[0].Value,
  };
  let isServiceFile = event.pathParameters.key.includes("IsServiceFile");
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    const fileKey =
      "public/" + event.pathParameters.key.replace("IsServiceFile", ""); // the key used to store the file in S3, e.g., 'myFile.pdf'
    console.log(fileKey.replace("IsServiceFile", ""));
    const params = {
      Bucket: "irogbucket6152b-staging",
      Key: fileKey,
    };

    const fileData = await s3.getObject(params).promise();
    const fileContent = fileData.Body.toString("utf-8"); // assuming the PDF contains plain text
    const pdfBuffer = Buffer.from(fileData.Body);

    const options = {}; // You can customize the options if needed
    const data = await PDFParser(pdfBuffer, options);
    const plainText = data.text; // Extract plain text from the PDF file

    //const plainText = pdf.text; // Extract plain text from the PDF file

    // Prepare the prompt for ChatGPT
    const prompt = isServiceFile
      ? process.env.SERIVE_FILE_PROMPT +"---"+ plainText
      : process.env.INTERROGATORY_PROMPT+"---"+plainText;

    // Call OpenAI's ChatGPT API
    const chatgptdata = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    let questions = null;

    try {
      const res = await retryWithBackoff(() =>
        callChatGpt(apiUrl, headers, chatgptdata)
      );
      questions = res.data.choices[0].message.content;
    } catch (error) {
      console.error("Error making chatgpt call", error);
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: questions,
    };
  } catch (error) {
    console.error("Error processing file:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: error.message,
    };
  }
};
