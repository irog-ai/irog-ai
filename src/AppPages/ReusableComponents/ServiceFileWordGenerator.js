import { Document, Packer, Paragraph, AlignmentType, TextRun , BorderStyle} from "docx";
import { Storage } from "aws-amplify";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const ServiceFileGenerator = ({ formData, handleDownload }) => {
  const generateDocument = () => {
    console.log(formData);
    const date = new Date("2022-07-01"); // Create a Date object for July 1, 2022
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let respondingArray = formData.respondingPartyNames.split(",");
    let propoundingArray = formData.propoundingPartyNames.split(",");
    let respondingPartyRoleName = "";
    let propundingPartyRoleName = "";
    let respondingPartyNames = "not found";
    let propoundingPartyNames = "not found";
    let noticeMatter = "";
    const noticeHeading = "NOTICE OF SERVICE OF ";
    let noticeHeading1 = "";
    noticeHeading1 +=
      formData.respondingPartyRole +
      "'s " +
      respondingArray[0] +
      " Answers to " +
      formData.propoundingPartyRole +
      "'s " +
      propoundingArray[0] +
      ", " +
      formData.interrogatoryFileTitle;

    const noticeHeadingtextRun1 = new TextRun({
      text: noticeHeading.toUpperCase(),
      bold: true,
      underline: { type: "single", color: "000000" },
    });

    noticeMatter += `COMES NOW ${formData.respondingPartyRole}, ${respondingArray[0]} (“${formData.respondingPartyRole}”), and hereby gives notice that
 ${formData.respondingPartyRole} has served his answers, responses and/or objection to 
 ${formData.propoundingPartyRole}, ${propoundingArray[0]}’S, 
 ${formData.interrogatoryFileTitle} on ${formattedDate}.`;

    const noticeHeadingtextRun2 = new TextRun({
      text: noticeHeading1.toUpperCase(),
      bold: true,
      italic: true,
      underline: { type: "single", color: "000000" },
    });

    if (Array.isArray(respondingArray)) {
      if (respondingArray.length === 1) {
        respondingPartyNames = respondingArray[0];
        respondingPartyRoleName = formData.respondingPartyRole;
      } else if (respondingArray.length > 1) {
        respondingPartyNames = respondingArray.join(" and ");
        respondingPartyRoleName = formData.respondingPartyRole + "s";
      }
    }

    if (Array.isArray(propoundingArray)) {
      if (propoundingArray.length === 1) {
        propoundingPartyNames = propoundingArray[0];
        propundingPartyRoleName = formData.propoundingPartyRole;
      } else if (propoundingArray.length > 1) {
        propoundingPartyNames = propoundingArray.join(" and ");
        propundingPartyRoleName = formData.propoundingPartyRole + "s";
      }
    }
    const createLawyerParagraph = (lawyer) => {
      return new Paragraph({
        //alignment: "right",
        children: [
          new TextRun({
            text: `${lawyer.name}`,
            bold: true,
            break:1
          }),
          new Paragraph({
            border: {
              bottom: {
                color: "000000", // Black color
                space: 1,
                value: BorderStyle.SINGLE, // Single line border style
                size: 6, // Adjust the thickness
              },
            },
            spacing: {
              before: 200, // Add space before the line
              after: 200, // Add space after the line
            },
            text: "", // Ensure no text appears over the line
          }),          
          new TextRun({
            text: `\n${lawyer.BarNumber.BarName} Number: ${lawyer.BarNumber.BarNumber}`,break:1
          }),
          new TextRun({
            text: `\n${lawyer.address}`, break:1
          }),
          new TextRun({
            text: `\nTelephone: ${lawyer.phoneNumber}`, break:1
          }),
          new TextRun({
            text: `\nFacsimile: ${lawyer.fax}`,break:1
          }),
          new TextRun({
            text: `\nE-Service Primary: ${lawyer.primary_email}`, break:1
          }),
          ...(lawyer.secondary_emails 
            ? lawyer.secondary_emails.split(",").map(
                (email, index) => new TextRun({ text: `${index === 0 ? '\nE-Service Secondary: ' : ''}${email.trim()}`, break:1 })
              )
            : []),
        ],
        alignment: AlignmentType.RIGHT,// Ensure alignment to the right       
        
      });
    };
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ 
                  text: formData.courtName,
                  color: "000000", // Set text color to blue
                  size: 24, // Set font size to 24 points
                }),
              ],
              spacing: {
                line: 320, // Set line spacing to 320 twips (default is 240)
              },
            }),
            new Paragraph({
              text: `CASE NO: ${formData.caseNumber || "not found"}`,
              alignment: "right",
            }),
            new Paragraph({
              text: `DIVISION: ${formData.division || "not found"}`,
              alignment: "right",
            }),
            new Paragraph({
              text: respondingPartyRoleName,
              spacing: { before: 400, after: 400 },
              alignment: "left",
              children: [
                new TextRun({
                  text: respondingPartyNames,
                  break: 1,
                  bold: true,
                  color: "000000",
                }),
              ],
            }),
            new Paragraph({
              text: "vs.",
              alignment: "center",
            }),
            new Paragraph({
              text: propundingPartyRoleName,
              spacing: { before: 400, after: 400 },
              alignment: "left",
              children: [
                new TextRun({
                  text: propoundingPartyNames,
                  break: 1,
                  bold: true,
                  color: "000000",
                }),
              ],
            }),
            new Paragraph({
              border: {
                bottom: {
                  color: "000000", // Black color
                  space: 1,
                  value: "single",
                  size: 2, // Adjust the thickness
                },
              },
              spacing: { after: 400 }, // Add spacing before and after the line
            }),
            new Paragraph({
              children: [noticeHeadingtextRun1, noticeHeadingtextRun2],
              //heading: HeadingLevel.HEADING_3,
              color: "000000",
              alignment: "center",
              spacing: { before: 400, after: 400 },
            }),
            new Paragraph({
              text: noticeMatter,
              spacing: { line: 276 }, // 1.5 line spacing
            }),
            ...formData.lawyersJson.map((lawyer) =>
              createLawyerParagraph(lawyer)
            ),

            new Paragraph({
              text: "CERTIFICATE OF SERVICE",
              //heading: HeadingLevel.HEADING_3,
              color: "000000",
              spacing: { before: 400, after: 400 },
              alignment: "center",
              underline: {
                type: "single", // Underline type
                color: "000000", // Optional: specify color
              },
            }),
            new Paragraph({
              text: formData.certificateText || "not found",
              spacing: { line: 276 }, // 1.5 line spacing
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      uploadToS3(blob, "GeneratedDocument.docx").then(() => {
        handleDownload("GeneratedDocument.docx", false, false);
      });
    });
  };

  const uploadToS3 = async (blob, filename) => {
    await Storage.put(filename, blob, {
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
      .then((result) => {
        console.log("File uploaded to S3:", result.key);
      })
      .catch((error) => {
        console.error("Error uploading file to S3:", error);
      });
  };

  return (
    <Button
      startIcon={<DownloadIcon />}
      onClick={generateDocument}
      variant="outlined"
      style={{ marginLeft: "20px" }}
    >
      Download Document
    </Button>
  );
};

export default ServiceFileGenerator;
