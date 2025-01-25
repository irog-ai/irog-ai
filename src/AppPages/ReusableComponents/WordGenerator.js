// import { API } from "aws-amplify";
// import Button from "@mui/material/Button";
// import DownloadIcon from "@mui/icons-material/Download";
// import axios from "axios";

// const DocumentGenerator = (props) => {
//   const myAPI = "api";
//   const apipath = process.env.REACT_APP_API_URL;

//   const generateDocument = async () => {
//     props.changeIsLoading();

//     try {
//       // Set the path to the API endpoint; include the caseId if applicable
//       const caseId = props.caseid; // Assume you get the caseId from props
//       const apiFunctionPath = `document/generateResponseDocument/${caseId}`;

//       // Make an API call to generate the document
//       //const response = await axios.get(myAPI, path, { responseType: 'blob' });
//       const response = await axios.get(apipath + apiFunctionPath, { responseType: 'blob' });

//       // Create a Blob object to handle the download
//       const blob = new Blob([response], {
//         type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       });

//       // Create a download link and trigger the download
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', props.isAttorneyDoc ? `Attorney-${caseId}.docx` : `Client-${caseId}.docx`);

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Optionally, you can handle any post-download processing here
//       //props.handleDownload(apiFunctionPath, true, props.isAttorneyDoc);

//     } catch (error) {
//       console.error("Error generating or downloading the document:", error);
//     } finally {
//       props.changeIsLoading(); // Ensure loading state is cleared
//     }
//   };

//   return (
//     <Button
//       startIcon={<DownloadIcon />}
//       onClick={generateDocument}
//       variant="outlined"
//       style={{ marginLeft: "20px" }}
//     >
//       {props.isAttorneyDoc ? "Attorney Responses" : "Client Responses"}
//     </Button>
//   );
// };

// export default DocumentGenerator;

import {
  Document,
  Packer,
  Paragraph,
  AlignmentType,
  TextRun,
  BorderStyle,
  WidthType,
} from "docx";
import { API, Storage } from "aws-amplify";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { fetchWithAuth } from "../../Util/fetchWithAuth";

const DocumentGenerator = (props) => {
  //const apipath = process.env.REACT_APP_API_URL;
  const toCamelCase = (str) => {
    if (str === "") return "";
    return str
    .toLowerCase() // Convert the entire string to lowercase
    .split(' ')    // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ');     // Join the words back into a single string
  };
  const generateDocument = () => {
    let wordText = [];

    props.questionTable.forEach((element, index) => {
      wordText.push(
        new Paragraph({
          text: "",
        })
      );
      wordText.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `            ${index+1}.    `
            }),
            new TextRun({
              text: `Interrogatory:`,
              bold: true,
              underline:true
            }),
            new TextRun({
              text: props.isAttorneyDoc
                ? ` ${element.OriginalQuestion}`
                : ` ${element.StandardQuestion}`,
            }),
          ],
          style:"NormalStyle"
        })
      );
      wordText.push(
        new Paragraph({
          text: "",
        })
      );
      wordText.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Response:`,
              bold: true,
              underline: true
            }),
            new TextRun({
              text: props.isAttorneyDoc
                ? ` ${element.OriginalAnswer}`
                : ` ${element.StandardAnswer}`,
            }),
          ],
          style:"NormalStyle",
          indent: {
            left: 1152, // Indent in twentieths of a point (e.g., 720 equates to 0.5 inch)
          },
        })
      );
    });

    createFile(wordText, props.responseFileName);
  };

  const createFile = (wordText, file) => {
    const formData = props.formData;
    console.log(formData.remainingContent.split("\n"));
    const paragraphs = (formData.remainingContent ? formData.remainingContent.split('\n') : ['']).map(line =>
      new Paragraph({
        children: [
          new TextRun({
            text: line, // Text for the current line
            // You may include any additional formatting options here as needed
          })
        ],
        style: "LeftAligned"
      })
    );

    const respondingArray = formData.respondingPartyNames.split(",");
    const propoundingArray = formData.propoundingPartyNames.split(",");
    let respondingPartyRoleName = formData.respondingPartyRole;
    let propundingPartyRoleName = formData.propoundingPartyRole;
    const respondingPartyNames =
      respondingArray.length > 1
        ? respondingArray.join(" and ")
        : respondingArray[0];
    const propoundingPartyNames =
      propoundingArray.length > 1
        ? propoundingArray.join(" and ")
        : propoundingArray[0];
    let title = `${respondingPartyRoleName}’S ANSWERS TO ${propundingPartyRoleName}, ${propoundingArray[0]}, ${formData.interrogatoryFileTitle}`;
    let titleSubText = `${respondingPartyRoleName}, ${respondingArray[0]}, serves his answers, responses and/or objections to ${propundingPartyRoleName}, ${propoundingArray[0]},`;

    if (file === "" || file === null) {
      props.changeIsLoading();
      let path = "cases/updateResponseFile";
      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "NormalStyle",
              name: "Normal",
              run: {
                font: "Times New Roman",
                size: 24, // 12pt
              },
            },
            {
              id: "HeadingBoldUnderline",
              name: "Heading Bold Underline",
              run: {
                bold: true,
                underline: { type: "single", color: "000000" },
                font: "Times New Roman",
                size: 24, // 12pt
              },
              paragraph: {
                alignment: AlignmentType.CENTER,
              },
            },
            {
              id: "CenterAligned",
              name: "Center Aligned",
              run: {
                font: "Times New Roman",
                size: 24, // 12pt
              },
              paragraph: {
                alignment: AlignmentType.CENTER,
              },
            },
            {
              id: "LeftAligned",
              name: "Left Aligned",
              run: {
                font: "Times New Roman",
                size: 24, // 12pt
              },
              paragraph: {
                alignment: AlignmentType.LEFT,
              },
            },
            {
              id: "Justified",
              name: "Justified",
              run: {
                font: "Times New Roman",
                size: 24, // 12pt
              },
              paragraph: {
                alignment: AlignmentType.JUSTIFIED,
              },
            },
            {
              id: "RightAligned",
              name: "Right Aligned",
              run: {
                font: "Times New Roman",
                size: 24, // 12pt
              },
              paragraph: {
                alignment: AlignmentType.RIGHT,
              },
            },
          ],
        },
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: formData.courtName,
                style: "CenterAligned",
              }),
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                text: `CASE NO: ${formData.caseNumber || "not found"}`,
                style: "CenterAligned",
              }),
              new Paragraph({
                text: `DIVISION: ${formData.division || "not found"}`,
                style: "CenterAligned",
              }),
              new Paragraph({
                text: "",
              }),              
              new Paragraph({
                children: [
                  new TextRun({
                    text: respondingPartyNames ? respondingPartyNames.toUpperCase().replace("AND", "and") + "," : "",
                    bold: true,
                  }),
                ],
                indent: {
                  right: 5000, // Indent in twentieths of a point (e.g., 720 equates to 0.5 inch)
                },
                style: "LeftAligned",
              }),
              new Paragraph({
                text:
                  respondingArray.length > 1
                    ? respondingPartyRoleName + "s,"
                    : respondingPartyRoleName+",",
                style: "LeftAligned",
              }),
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                text: "vs.",
                style: "LeftAligned",
              }),
              new Paragraph({
                text: "",
              }),              
              new Paragraph({
                children: [
                  new TextRun({
                    text: propoundingPartyNames ? propoundingPartyNames.toUpperCase().replace("AND", "and") + "," : "",
                    bold: true,
                  }),
                ],
                indent: {
                  right: 5000, // Indent in twentieths of a point (e.g., 720 equates to 0.5 inch)
                },
                style: "LeftAligned",
              }),
              new Paragraph({
                text:
                  propoundingArray.length > 1
                    ? propundingPartyRoleName + "s,"
                    : propundingPartyRoleName+",",
                style: "LeftAligned",
              }),
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                style: "LeftAligned",
                children: [new TextRun("_____________________________/")], // Ensure an invisible character for border rendering
                border: {
                  bottom: {
                    color: "000000",
                    space: 1,
                    value: BorderStyle.SINGLE,
                    size: 12,
                  },
                },
              }),
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${title.toUpperCase()}`,
                    bold: true,
                  }),
                ],
                style: "HeadingBoldUnderline",
              }),
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${titleSubText} `
                  }),
                  new TextRun({
                    text: toCamelCase(formData.interrogatoryFileTitle) + ".",
                    italics: true,
                  }),
                ],
                
              }),
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `SPECIFIC ANSWERS AND RESPONSES`,
                    bold: true,
                  }),
                ],
                style: "HeadingBoldUnderline",
              }),              
              ...wordText,
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                text: "",
              }),
              new Paragraph({
                text: "",
              }),
              ...paragraphs,
            ],
          },
        ],
      });
      const filename = props.isAttorneyDoc
        ? "Attorney" + Date.now() + "-" + props.caseid
        : "" + Date.now() + "-" + props.caseid;
      Packer.toBlob(doc).then((blob) => {
        const functionPath = `${path}/${filename}`;
        // Upload the blob to AWS S3
        uploadToS3(blob, filename)
          .then(() => {
            fetchWithAuth(functionPath)
              .then(() => {
                props.handleDownload(
                  filename,
                  true,
                  props.isAttorneyDoc
                    ? "AttorneyResponsesDoc"
                    : "ClientResponsesDoc"
                );
                props.changeIsLoading();
              })
              .catch((error) => {
                console.log(error);
                Storage.remove(filename);
                props.showExceptionOnPage(true);
              });
          })
          .catch((error) => {
            console.log(error);
            props.showExceptionOnPage(true);
          });
      });
      //API.get(myAPI, path + "/" + filename)
    } else {
      props.handleDownload(file, false, "");
    }
  };

  const uploadToS3 = async (blob, filename) => {
    // Use the Amplify Storage API to upload the blob to S3
    await Storage.put(filename, blob, {
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
      .then((result) => {
        console.log("File uploaded to S3:", result.key);
      })
      .catch((error) => {
        console.error("Error uploading file to S3:", error);
        throw error;
      });
  };

  return (
    <Button
      startIcon={<DownloadIcon />}
      onClick={generateDocument}
      variant="outlined"
      style={{ marginLeft: "20px" }}
    >
      {props.isAttorneyDoc ? "Attorney Responses" : "Client Responses"}
    </Button>
    // <button onClick={generateDocument}>Generate .docx and Upload to S3</button>
  );
};

export default DocumentGenerator;
