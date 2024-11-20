import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { Storage } from "aws-amplify";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const ServiceFileGenerator = ({ formData, handleDownload }) => {
  const generateDocument = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: formData.courtName || "",
              heading: HeadingLevel.HEADING_3,
              color: "000000",
              alignment: "center",
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
              text: "Plaintiffs",
              spacing: { before: 400, after: 400 },
              alignment: "left",
              children: [
                new TextRun({
                  text: formData.plaintiffs || "not found",
                  break: 1,
                  bold: true,
                  heading: HeadingLevel.HEADING_5,
                  color: "000000",
                }),
              ],
            }),
            new Paragraph({
              text: "vs.",
              alignment: "center",
            }),
            new Paragraph({
              text: "Defendants",
              spacing: { before: 400, after: 400 },
              alignment: "left",
              children: [
                new TextRun({
                  text: formData.defendants || "not found",
                  break: 1,
                  bold: true,
                  heading: HeadingLevel.HEADING_5,
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
                  size: 1, // Adjust the thickness
                },
              },
              spacing: { after: 400 }, // Add spacing before and after the line
            }),
            new Paragraph({
              text: formData.noticeHeading || "not found",
              heading: HeadingLevel.HEADING_3,
              color: "000000",
              spacing: { before: 400, after: 400 },
              alignment: "center",
              underline: {
                type: "single", // Underline type
                color: "000000", // Optional: specify color
              },
            }),
            new Paragraph({
              text: formData.noticeMatter || "not found",
              spacing: { line: 276 }, // 1.5 line spacing
            }),
            new Paragraph({
                border: {
                  bottom: {
                    color: "000000", // Black color
                    space: 1,
                    value: "single",
                    size: 6, // Adjust the thickness
                    alignment:"right"
                  },
                },
                spacing: { before: 600, after: 400 }, // Add spacing before and after the line
              }),
            new Paragraph({
              text: formData.signature1 || "",
              spacing: { before: 600, after: 400 },
              alignment: "right",
            }),

            new Paragraph({
                text: "CERTIFICATE OF SERVICE",
                heading: HeadingLevel.HEADING_3,
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
            // new Paragraph({
            //   text: formData.signature2 || "",
            //   spacing: { before: 400, after: 400 },
            //   alignment: "right",
            // }),
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
