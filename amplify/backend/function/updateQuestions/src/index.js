const aws = require("aws-sdk");

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let input= event.body;
  if(!event.body.indexOf("WebKitFormBoundary")>0)
    input = Buffer.from(event.body, "base64").toString("ascii");
  const boundaryRegex = /^--([^\r\n]+)/;
  const boundaryMatch = input.match(boundaryRegex);
  const boundary = boundaryMatch ? boundaryMatch[1] : null;
  const formdata = {};
  if (boundary) {
    // Split the string into separate key-value pairs
    const keyValuePairs = input
      .split(`${boundary}--`)[0]
      .split(`${boundary}\r\n`)
      .slice(1);

    // Extract the data for each key-value pair

    keyValuePairs.forEach((pair) => {
      const match = pair.match(/name="([^"]+)"\r\n\r\n(.+)\r\n/);
      if (match) {
        const name = match[1];
        const value = match[2];
        formdata[name] = value;
      }
    });

    console.log(formdata);
  }


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

    sql.connect(config).then((pool) => {
      const request = new sql.Request();      
      

      // Define the table and column names
      const tableName = "questions";
      const idColumnName = "Id";
      const nameColumnName = "IsActive";
      let tabledata = JSON.parse(formdata.data);
      //const request = new sql.Request();

      // Generate bulk update query
      let query = `UPDATE ${tableName} SET ${nameColumnName} = CASE `;
      let params = [];
      //console.log(tabledata.filter((row) => row.StandardAnswerWeb !== null));
      const filteredTableData = tabledata.filter(
        (row) => row.IsQuestionActive === false
      );
      console.log(filteredTableData);
      filteredTableData.forEach((row) => {
        //console.log(row.StandardAnswerWeb);
        query += `WHEN ${idColumnName} = @id${row.Id} THEN @name${row.Id} `;
        request.input(`id${row.Id}`, sql.Int, row.Id);
        request.input(`name${row.Id}`, sql.Bit, row.IsQuestionActive);
      });
      query += `END WHERE ${idColumnName} IN (`;
      query += filteredTableData.map((row) => `@id${row.Id}`)
        .join(",");
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
