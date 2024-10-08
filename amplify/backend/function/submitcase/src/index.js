const aws = require("aws-sdk");
const sql = require("mssql");

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let input = event.body;

  if (!input.includes("WebKitFormBoundary")) {
    input = Buffer.from(event.body, "base64").toString("ascii");
  }

  const boundaryRegex = /^--([^\r\n]+)/;
  const boundaryMatch = input.match(boundaryRegex);
  const boundary = boundaryMatch ? boundaryMatch[1] : null;
  const formdata = {};

  if (boundary) {
    const keyValuePairs = input
      .split(`${boundary}--`)[0]
      .split(`${boundary}\r\n`)
      .slice(1);

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

  const config = {
    user: "admin",
    password: "Admin123", // Securely manage your credentials
    server: "irog-ai-db.cv62ee6awzrf.us-east-2.rds.amazonaws.com",
    port: 1433,
    options: {
      database: "irog",
      encrypt: false,
    },
  };

  let insertedId;
  try {
    await sql.connect(config);

    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);

      request.input("FirstName", sql.NVarChar, formdata.FirstName);
      request.input("LastName", sql.NVarChar, formdata.LastName);
      request.input("PhoneNumber", sql.NVarChar, formdata.PhoneNumber); // Use NVarChar if you expected text input
      request.input("EmailId", sql.NVarChar, formdata.EmailId);
      request.input("MiddleName", sql.NVarChar, formdata.MiddleName);
      request.input("s3BucketFileName", sql.NVarChar, formdata.s3BucketFileName);
      request.input("ServiceFileName", sql.NVarChar, formdata.ServiceFileName);
      request.input("Status", sql.NVarChar, formdata.Status);
      request.input("LoggedInUser", sql.NVarChar, formdata.loggedinuser);
      request.input("LoggedInUserEmail", sql.NVarChar, formdata.loggedInuseremail);
      request.input("LawyerId", sql.Int, formdata.selectedLawyerId);

      const insertionQuery = `
        INSERT INTO [Cases] (FirstName, MiddleName, LastName, PhoneNumber, EmailId, s3BucketFileName, ServiceFileName, Status, LoggedInUser, LoggedInUserEmail, CreateTimeStamp, LawyerId)
        VALUES (@FirstName, @MiddleName, @LastName, @PhoneNumber, @EmailId, @s3BucketFileName, @ServiceFileName, @Status, @LoggedInUser, @LoggedInUserEmail, GETDATE(), @LawyerId);
        SELECT SCOPE_IDENTITY() as id;
      `;

      const result = await request.query(insertionQuery);
      insertedId = result.recordset[0].id;
      const generatedCaseId = formdata.CaseId || `CA-00${insertedId}`;

      const updateRequest = new sql.Request(transaction);
      await updateRequest
        .input("GeneratedCaseId", sql.NVarChar, generatedCaseId)
        .input("NewId", sql.Int, insertedId)
        .query(`
          UPDATE [Cases]
          SET CaseId = @GeneratedCaseId
          WHERE Id = @NewId;
        `);

      await transaction.commit();

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({ caseId: generatedCaseId }),
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  } finally {
    await sql.close();
  }
};
