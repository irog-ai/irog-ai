import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import { API, Storage } from "aws-amplify";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const DocumentGenerator = (props) => {
  const myAPI = "api";
  const generateDocument = () => {
    let wordText = [];
    props.questionTable.forEach((element) => {
      wordText.push(
        new Paragraph({
          text: "Interrogatory " + element.SequenceNumber,
          heading: HeadingLevel.HEADING_1,
        })
      );
      wordText.push(
        new Paragraph({
          text: props.isAttorneyDoc
            ? element.OriginalQuestion
            : element.StandardQuestion,
        })
      );
      wordText.push(
        new Paragraph({
          text: "Response ",
          heading: HeadingLevel.HEADING_1,
        })
      );
      wordText.push(
        new Paragraph({
          text: props.isAttorneyDoc
            ? element.OriginalAnswer
            : element.StandardAnswer,
        })
      );
    });
    if (props.isAttorneyDoc) {
      createFile(wordText, props.responseFileName);
    } else {
      createFile(wordText, props.responseFileName);
    }
  };

  const createFile = (wordText, file) => {
    if (file === "" || file === null) {
      props.changeIsLoading();
      let path = "/updateResponsePdf";
      const doc = new Document({
        sections: [
          {
            children: wordText,
          },
        ],
      });
      const filename = props.isAttorneyDoc
        ? "Attorney" + Date.now() + "-" + props.caseid
        : "" + Date.now() + "-" + props.caseid;
      Packer.toBlob(doc).then((blob) => {
        // Upload the blob to AWS S3
        uploadToS3(blob, filename);
      });
      API.get(myAPI, path + "/" + filename).then(() => {
        props.handleDownload(filename, true, props.isAttorneyDoc);
      });
      props.changeIsLoading();
    } else {
      props.handleDownload(file, false, props.isAttorneyDoc);
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
