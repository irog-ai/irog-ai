const axios = require("axios");
const aws = require("aws-sdk");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
    throw new Error('Max retries exceeded');
}

async function callChatGpt(apiUrl, headers, data) {
    return await axios.post(apiUrl, data, { headers });
}

exports.handler = async (event) => {
    const isQuestion = true;
    console.log(event.pathParameters.question);
    const caseId = event.pathParameters.question;
    let questions = [];

    const { Parameters } = await new aws.SSM()
        .getParameters({
            Names: ["ChagptKey"].map(secretName => process.env[secretName]),
            WithDecryption: true,
        })
        .promise();
    console.log(Parameters);

    const promise = new Promise((resolve, reject) => {
        let sql = require("mssql");

        const config = {
            user: "admin",
            password: "Admin123",
            server: "irog-ai-db.cv62ee6awzrf.us-east-2.rds.amazonaws.com",
            port: 1433,
            options: {
                database: "irog",
                encrypt: false,
            },
        };

        sql.connect(config, (err) => {
            if (err) {
                reject(err);
            } else {
                const request = new sql.Request();
                request.input("caseId", sql.NVarChar, caseId);

                const selectQuery = `SELECT q.Id, q.SequenceNumber, q.MsgSentDateTime, q.CaseId, q.MsgSent, q.MsgReceived, q.OriginalQuestion, q.StandardQuestion, q.StandardAnswer AS StandardAnswerWeb, r.StandardAnswer, r.OriginalAnswer FROM questions q
                    LEFT OUTER JOIN webresponses r ON q.Id = r.QuestionId
                    WHERE q.CaseId=@caseId ORDER BY q.SequenceNumber ASC`;
                request.query(selectQuery, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });

    let resp = "";
    try {
        questions = await promise;

        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Parameters[0].Value,
        };

        await Promise.all(
            questions.recordset.map(async (element) => {
                const chatgptPrompt = (isQuestion ? process.env.CHATGPT_PROMPT : process.env.CHATGPT_PROMPT_ANSWER) + ":" + element.OriginalQuestion;

                const data = {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: chatgptPrompt }],
                    temperature: 0.7,
                    max_tokens: 1000,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                };

                try {
                    const res = await retryWithBackoff(() => callChatGpt(apiUrl, headers, data));
                    element.StandardQuestion = res.data.choices[0].message.content;
                } catch (error) {
                    console.error("Error making chatgpt call", error);
                    element.StandardQuestion = null;
                }

                // Adding delay to handle rate limiting
                await delay(100); // Adjust the delay as needed based on your rate limit
            })
        );

    } catch (error) {
        console.error("Error making chatgpt call", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: error.message,
        };
    }

    const updatePromise = new Promise((resolve, reject) => {
        let sql = require("mssql");

        const config = {
            user: "admin",
            password: "Admin123",
            server: "irog-ai-db.cv62ee6awzrf.us-east-2.rds.amazonaws.com",
            port: 1433,
            options: {
                database: "irog",
                encrypt: false,
            },
        };

        console.log("UPDATE QUERY");
        sql.connect(config).then((pool) => {
            const request = new sql.Request();

            const tableName = "questions";
            const idColumnName = "Id";
            const nameColumnName = "StandardQuestion";
            let tabledata = questions.recordset;
            const filteredTableData = tabledata.filter(row => row.StandardQuestion !== null);

            let query = `UPDATE ${tableName} SET ${nameColumnName} = CASE `;
            filteredTableData.forEach((row) => {
                query += `WHEN ${idColumnName} = @id${row.Id} THEN @name${row.Id} `;
                request.input(`id${row.Id}`, sql.Int, row.Id);
                request.input(`name${row.Id}`, sql.NVarChar, row.StandardQuestion);
            });
            query += `END WHERE ${idColumnName} IN (${filteredTableData.map(row => `@id${row.Id}`).join(",")})`;

            console.log(query);

            request.query(query)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    });

    try {
        const result = await updatePromise;
        console.log("Step-1");
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(result),
        };
    } catch (e) {
        console.log("*****" + e);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(e),
        };
    }
};