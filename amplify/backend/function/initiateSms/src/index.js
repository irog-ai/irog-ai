// /*
// Use the following code to retrieve configured secrets from SSM:

const aws = require("aws-sdk");
//const app = express();
//const cors = require("cors");
//app.use(cors());

exports.handler =async (event) => {
  const caseId  = event.pathParameters.id.split("-")[0]
  const questionId = event.pathParameters.id.split("-")[1];
//   const { Parameters } = await new aws.SSM()
//     .getParameters({
//       Names: ["DB_USERNAME", "DB_PASS"].map(
//         (secretName) => process.env[secretName]
//       ),
//       WithDecryption: true,
//     })
//     .promise();

//   console.log(Parameters);

  const promise = new Promise((resolve, reject) => {
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
        request.input("caseId", sql.Int, caseId);
        request.input("questionId", sql.Int, questionId);
        let query = `update cases set ChatInitiated = getdate(), status='AWAITING' where Id=@caseId; 
         update questions set MsgSent = 1,MsgSentDateTime=getdate() where id=@questionId`;
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
    console.log("Step-1");
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        'Content-Type':'text/plain'
      },
      body: JSON.stringify(result),
    };
    return response;
  } catch(e) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        'Content-Type':'text/plain'
      },
      body: JSON.stringify(e.message),
    };
  }
};