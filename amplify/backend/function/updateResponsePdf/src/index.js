const aws = require("aws-sdk");

exports.handler = async (event) => {
  const inputParam = event.pathParameters.id;
  const id = inputParam.split("-")[1];
  const fileName = inputParam;

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
    let query = "";

    query = fileName.includes("Attorney")
      ? "UPDATE Cases SET ResponseAttorneyFileName=@fileName WHERE Id=@id"
      : "UPDATE Cases SET ResponseFileName=@fileName WHERE Id=@id";

    sql.connect(config, (err) => {
      if (err) {
        reject(err);
      } else {
        const request = new sql.Request();
        request.input("fileName", sql.NVarChar, fileName);
        request.input("id", sql.Int, id);

        request.query(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });

  try {
    const result = await promise;
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
      body: JSON.stringify(e.message),
    };
  }
};
