import {
  Document,
  Packer,
  Paragraph,
  AlignmentType,
  TextRun,
  BorderStyle,
  WidthType,
} from "docx";
import { Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { fetchWithAuth } from "../../Util/fetchWithAuth";

const ServiceFileGenerator = ({ formData, handleDownload, lawyerId, serviceFileName, caseid, showExceptionOnPage }) => {
  const [lawyerData, setLawyerData] = useState(null);
  //const apipath = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    const fetchLawyerData = async () => {
      
      
      const apiFunctionPath = "lawyers/getLawyerById";
      const apiPath = `${apiFunctionPath}/${lawyerId}`
      try {
        const response = await fetchWithAuth(apiPath);
        setLawyerData(response);
      } catch (error) {
        console.error("Error fetching lawyer data for service file:", error);
      }
    };

    fetchLawyerData();
  }, [lawyerId]);
  const formatPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters from the input
  const cleanNumber = phoneNumber.replace(/\D/g, '');

  // Ensure the number has exactly 10 digits to apply the format
  if (cleanNumber.length !== 10) {
    return phoneNumber;
  }

  // Format the number
  const formattedNumber = `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6, 10)}`;
  return formattedNumber;

  };

  const toCamelCase = (str) => {
    if (str === "") return "";
    return str
    .toLowerCase() // Convert the entire string to lowercase
    .split(' ')    // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ');     // Join the words back into a single string
  };

  const generateDocument = async () => {
    console.log(formData);
    const date = new Date("2022-07-01");
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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

    let noticeHeading = "NOTICE OF SERVICE OF ";
    noticeHeading += "";

    noticeHeading +=
      formData.respondingPartyRole +
      "'s " +
      respondingArray[0] +
      " Answers to ";
    let noticeHeading1 =
      formData.propoundingPartyRole +
      "'s " +
      propoundingArray[0] +
      ", " +
      formData.interrogatoryFileTitle;
    let noticeMatter = `          ${formData.respondingPartyRole}, ${respondingArray[0]} (“${formData.respondingPartyRole}”), hereby gives notice that ${formData.respondingPartyRole} has served his answers, responses and/or objection to - `;
    let noticeMatteritalics = `${formData.propoundingPartyRole}, ${toCamelCase(propoundingArray[0])}’s, ${toCamelCase(formData.interrogatoryFileTitle)}`;
    let noticeMatterDate = ` on ${formattedDate}.`;
    let certificateOfServiceText = `         I certify that a copy of the foregoing document was furnished to ${
      formData.lawyersJson.length > 0
        ? formData.lawyersJson[0].name + ", " + formData.lawyersJson[0].address
        : "<Lawyer Name & address here>"
    }, by eservice to ${
      formData.lawyersJson.length > 0
        ? formData.lawyersJson[0].primary_email
        : "<email id here>"
    } on the following date: ${formattedDate}.`;

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
            id:"Justified",
            name:"Justified",
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
            // Setup different parts of the document
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
                  text: `${noticeHeading.toUpperCase()}`,
                  bold: true,
                }),
                new TextRun({
                  text: noticeHeading1.toUpperCase(),
                  italics: true,
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
                  text: noticeMatter,
                }),
                new TextRun({
                  text: noticeMatteritalics,
                  italics: true,
                }),
                new TextRun({
                  text: noticeMatterDate,
                }),
              ],
              style: "Justified",
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "RESPECTFULLY SUBMITTED",
                  bold: true,
                }),
              ],
              indent: {
                left: 4500, // Indent in twentieths of a point (e.g., 720 equates to 0.5 inch)
              },
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [new TextRun("________________________")],
              indent: {
                left: 4500, // Indent in twentieths of a point (e.g., 720 equates to 0.5 inch)
              },
            }),

            ...(lawyerData && [
              new Paragraph({
                text: `${lawyerData.firstName} ${lawyerData.middleName} ${lawyerData.lastName}`,
                indent: {
                  left: 4500, // Indent in twentieths
                },
              }),
              ...lawyerData.pleadingBarNumbers.map(
                (bar) =>
                  new Paragraph({
                    text: `${bar.state} Bar Number: ${bar.barNumber}`,
                    indent: {
                      left: 4500, // Indent in twentieths
                    },
                  })
              ),
              new Paragraph({
                text: `${lawyerData.pleadingAddress.street1}, ${lawyerData.pleadingAddress.street2}, ${lawyerData.pleadingAddress.state}, ${lawyerData.pleadingAddress.zipCode}`,
                indent: {
                  left: 4500, // Indent in twentieths
                },
              }),
              new Paragraph({
                text: `Telephone: ${formatPhoneNumber(
                  lawyerData.pleadingPhone
                )}`,
                indent: {
                  left: 4500, // Indent in twentieths
                },
              }),
              new Paragraph({
                text: `Fax: ${formatPhoneNumber(lawyerData.pleadingFax)}`,
                indent: {
                  left: 4500, // Indent in twentieths
                },
              }),
              new Paragraph({
                text: `E-Service Primary: ${lawyerData.pleadingEmails}`,
                indent: {
                  left: 4500, // Indent in twentieths
                },
              }),
              new Paragraph({
                text: `E-Service Secondary: ${lawyerData.documentReviewEmails}`,
                indent: {
                  left: 4500, // Indent in twentieths
                },
              }),
            ]),

            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "CERTIFICATE OF SERVICE",
                  bold: true,
                  underline: { type: "single", color: "000000" },
                }),
              ],
              style: "CenterAligned",
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text: certificateOfServiceText,
              style: "Justified",
            }),
            new Paragraph({
              text: "",
            }),
            new Paragraph({
              text:"_____________________",
              indent: {
                left: 5500, // Indent in twentieths
              },
            }),
            new Paragraph({
              text:lawyerData.firstName +" "+lawyerData.middleName+" "+lawyerData.lastName,              
              indent: {
                left: 5500, // Indent in twentieths
              },
            }),
            new Paragraph({
              text: "Attorney",
              indent: {
                left: 5500, // Indent in twentieths
              },
            }),
          ],
        },
      ],
    });

    
    createFile(doc,serviceFileName)
    // Packer.toBlob(doc).then((blob) => {
    //   uploadToS3(blob, fileName).then(() => {
    //     handleDownload(fileName, false, false);
    //   });
    // });
  };

  const createFile = (doc, file) => {
    let fileName = `ServiceDocument-${caseid}`;
    if (file === "" || file === null) {
      let path = "cases/updateServiceFilename"; 
      let apiFunctionPath = `${path}/${fileName}`;
      Packer.toBlob(doc).then((blob) => {
        // Upload the blob to AWS S3
        uploadToS3(blob, fileName).then(() => {
          fetchWithAuth(apiFunctionPath).then(() => {
            handleDownload(fileName, true, "ServiceFile");
          }).catch((error)=>{
            console.log(error);
            Storage.remove(fileName);
            showExceptionOnPage(true);
          });
        }).catch(error => {
          console.log(error);
          showExceptionOnPage(true);
        });
      });
      //API.get(myAPI, path + "/" + filename)
    } else {
      handleDownload(file, false,"");
    }
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
        throw(error);
      });
  };

  return (
    <Button
      startIcon={<DownloadIcon />}
      onClick={generateDocument}
      variant="outlined"
      style={{ marginLeft: "20px" }}
    >
      Generate Service file
    </Button>
  );
};

export default ServiceFileGenerator;
