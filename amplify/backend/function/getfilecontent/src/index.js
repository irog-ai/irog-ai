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
      ? `Please extract the following details from the provided text and format the output in JSON:

1. Court Name: Look for the name of the court.
2. Case Number: Find the line containing 'CASE NO' and extract the case number.
3. Division: Look for the 'DIVISION' section and extract its value.
4. Plaintiffs: Identify and extract the names listed under plaintiffs.
5. Defendants: Identify and extract the names listed under defendants.
6. Notice Heading: Locate and extract the heading of the notice.
7. Notice Matter: Extract the full text of the notice matter.
8. Signature and Lawyers (Signature 1): Extract the signatures and lawyer details.
9. Certificate of Service Matter: Extract the full certificate of service text.
10. Signature 2: Find and extract the second signature field.

If any information is not found, return 'not found' for that field.

Output:

{
  "courtName": "<court_name_here>",
  "caseNumber": "<case_number_here>",
  "division": "<division_here>",
  "plaintiffs": "<plaintiffs_here>",
  "defendants": "<defendants_here>",
  "noticeHeading": "<notice_heading_here>",
  "noticeMatter": "<notice_matter_here>",
  "signature1": "<signature_and_lawyers_here>",
  "certificateText": "<certificate_of_service_here>",
  "signature2": "<signature_2_here>"
}
\n${plainText}`
      : `Extract and give me the list of questions from the following text:\n${plainText}`;

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
