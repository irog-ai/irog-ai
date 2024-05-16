const axios = require("axios");
const aws = require("aws-sdk");

exports.handler = async (event) => {
  const isQuestion = true;
  console.log(event.pathParameters.question);
  const caseId = event.pathParameters.question;
  let questions = [];
  //   const { Parameters } = await new aws.SSM()
  //     .getParameters({
  //       Names: ["DB_USERNAME", "DB_PASS", "key"].map(
  //         (secretName) => process.env[secretName]
  //       ),
  //       WithDecryption: true,
  //     })
  //     .promise();

  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["ChagptKey"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();
  console.log(Parameters);

  let promise = new Promise((resolve, reject) => {
    let sql = require("mssql");

    const config = {
      user: "admin",
      password: "Admin123",
      server: "irog-db.cv62ee6awzrf.us-east-2.rds.amazonaws.com",
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

        const selectQuery = `select q.Id, q.SequenceNumber,q.MsgSentDateTime,  q.CaseId, q.MsgSent, q.MsgReceived, q.OriginalQuestion ,q.StandardQuestion,q.StandardAnswer as StandardAnswerWeb,  r.StandardAnswer, r.OriginalAnswer from questions q 
        left outer join webresponses r on q.Id = r.QuestionId
        where q.CaseId=@caseId order by q.SequenceNumber asc`;
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

  //console.log(`EVENT: ${JSON.stringify(event)}`);
  let resp = "";
  try {
    questions = await promise;
    //console.log(questions);
    //console.log(result.recordset);
    await Promise.all(
      questions.recordset.map(async (element) => {
        //console.log(element.OriginalQuestion)
        const chatgptPrompt =
          (isQuestion
            ? process.env.CHATGPT_PROMPT
            : process.env.CHATGPT_PROMPT_ANSWER) +
          ":" +
          element.OriginalQuestion;
        const res = await axios.post(
          `https://api.openai.com/v1/chat/completions`,
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: chatgptPrompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + Parameters[0].Value,
            },
          }
        );
        //console.log(res);
        element.StandardQuestion = res.data.choices[0].message.content;
        //console.log(element.StandardQuestion);
      })
    );

    //console.log(result);
    //console.log(resp.data.choices[0].message.content);

    //return resp.data.choices[0].text;
    // return {
    //   statusCode: 200,
    //   //Uncomment below to enable CORS requests
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Headers": "*",
    //   },
    //   body: JSON.stringify(result),
    // };
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

  promise = new Promise((resolve, reject) => {
    let sql = require("mssql");

    const config = {
        user: "admin",
        password: "Admin123",
        server: "irog-db.cv62ee6awzrf.us-east-2.rds.amazonaws.com",
        port: 1433,
        options: {
          database: "irog",
          encrypt: false,
        },
      };
    console.log("UPDATE QUERY");
    sql.connect(config).then((pool) => {
      const request = new sql.Request();

      // Define the table and column names
      const tableName = "questions";
      const idColumnName = "Id";
      const nameColumnName = "StandardQuestion";
      let tabledata = questions.recordset;
      //const request = new sql.Request();

      // Generate bulk update query
      let query = `UPDATE ${tableName} SET ${nameColumnName} = CASE `;
      let params = [];
      console.log(tabledata.filter((row) => row.StandardQuestion !== null));
      const filteredTableData = tabledata.filter(
        (row) => row.StandardQuestion !== null
      );

      filteredTableData.forEach((row) => {
        console.log(row.StandardQuestion);
        query += `WHEN ${idColumnName} = @id${row.Id} THEN @name${row.Id} `;
        request.input(`id${row.Id}`, sql.Int, row.Id);
        request.input(`name${row.Id}`, sql.NVarChar, row.StandardQuestion);
      });
      query += `END WHERE ${idColumnName} IN (`;
      query += filteredTableData.map((row) => `@id${row.Id}`).join(",");
      query += ")";

      console.log(query);

      // Execute the bulk update query
      const result = request.query(query);

      //console.log(`Rows affected: ${result.rowsAffected}`);
      resolve(result);
    });
  });

  try {
    const result = await promise;
    console.log("Step-1");
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(result),
    };
    return response;
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
