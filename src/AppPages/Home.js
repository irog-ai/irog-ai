 import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { fetchWithAuth } from "../Util/fetchWithAuth";
import { json, useLocation, useNavigate } from "react-router-dom";

// Material-UI Components
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DoneIcon from "@mui/icons-material/Done";
import Slide from "@mui/material/Slide";
import Paper from "@mui/material/Paper";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import ViewQuestions from "./ReusableComponents/ViewQuestionsFromFile";
import SubmitForm from "./ReusableComponents/SubmitForm";
import ServiceDialog from "./ReusableComponents/ServiceDialog";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  TextField,
  FormControl,
  Checkbox,
} from "@mui/material";

// AWS Amplify
import { API, Storage, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import AWS from "aws-sdk";
import config from "../aws-exports";

// Utility Constants
import * as myConstClass from "../Util/Constants";

// Custom Components
import AttestDialog from "./ReusableComponents/AttestDialog";
import ChatDialog from "./ReusableComponents/ChatDialog";
import Breadcrumb from "./ReusableComponents/Breadcrumb";
import WebllinkDialog from "./ReusableComponents/Weblinkdialog";
import ViewResponseDialog from "./ReusableComponents/ViewResponseDialog";
import QuestionsTable from "./ReusableComponents/QuestionsTable";
import Loading from "./ReusableComponents/Loading";
import StatusStepper from "./ReusableComponents/StatusStepper";
import CancelDialog from "./ReusableComponents/CancelDialog";
import CompleteDialog from "./ReusableComponents/CompleteDialog";
import DocumentGenerator from "./ReusableComponents/WordGenerator";
import ShowExceptionDialog from "./ReusableComponents/UIComponents/ErrorComponent";
import ServiceFileGenerator from "./ReusableComponents/ServiceFileWordGenerator";
import { RttRounded } from "@mui/icons-material";

const myAPI = "api";
const apipath = process.env.REACT_APP_API_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function Home({ signOut }) {
  const location = useLocation();
  const selectedRow = location.state !== null ? location.state : null;

  let initialState = {
    question: "",
    phoneNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddress: "",
    LawyerId: "",
    LawyersList: [],
    inpFile: "",
    serviceFile: "",
    serviceFileName: "",
    s3BucketServiceFileName: "",
    inpFileName: "",
    questions: [],
    isLoading: false,
    serviceFileData: {
      courtName: "",
      caseNumber: "",
      propundingPartyRole: "",
      propundingPartyNames: [],
      respondingPartyRole: "",
      respondingPartyNames: [],
      division: "",
      noticeHeading: "",
      noticeMatter: "",
      lawyersJson: {},
      certificateText: "",
      interrogatoryFileTitle: "",
    },
    cancelQueue: "",
    emailSent: false,
    insertedQuestions: [],
    showTable: false,
    insertedId: 0,
    createCasePage: true,
    openViewQuestions: false,
    questionTable: [],
    chatInitiatedForCase: false,
    caseId: "",
    caseNumber: "",
    status: "",
    showResponsesDialog: false,
    showSendWebLinkDialog: false,
    standardAnswer: "",
    viewresponserow: {},
    originalAnswer: "",
    s3bucketfileName: "",
    isNewLoading: false,
    value: 0,
    loadingtext: "",
    showAttestDialog: false,
    emailChannelInitiated: false,
    showCancelDialog: false,
    cancelConfirmation: false,
    showCompleteDialog: false,
    completeConfirmation: false,
    showChatDiaolog: false,
    responseFileName: "",
    responseAttorneyFileName: "",
    serviceDialogOpen: false,
    showExceptionDialog: false,
  };
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if location.state and location.state.selectedRow are defined.
    if (
      location.state !== undefined &&
      location.state !== null &&
      location.state.selectedRow !== null &&
      selectedRow !== null
    ) {
      // Destructure selectedRow from location.state.
      let { selectedRow } = location.state;
      setState({ ...state, isLoading: true });

      // Define API paths.
      const getCaseDetailsPath = `cases/getCaseById/${selectedRow.id}`;
      const getQuestionsPath = `questions/getQuestions/${selectedRow.id}`;

      // Async function to fetch data.
      async function fetchData() {
        try {
          // Fetch the latest case details.
          //const caseResponse = await axios.get(`${apipath}${getCaseDetailsPath}`);
          const caseResponse = await fetchWithAuth(getCaseDetailsPath);
          const latestCaseDetails = caseResponse;

          // Fetch the questions based on the latest case details.
          const questionsResponse = await fetchWithAuth(getQuestionsPath);
          console.log(questionsResponse);
          const tableData = questionsResponse;

          // Create menu items based on the latest data.
          let menuItemList = [];
          menuItemList.push(
            <MenuItem
              key={latestCaseDetails.LawyerId}
              value={latestCaseDetails.LawyerId}
            >
              {latestCaseDetails.lawyerFirstName +
                latestCaseDetails.lawyerLastName}
            </MenuItem>
          );

          // Update the state with the latest data.
          setState({
            ...state,
            questionTable: tableData,
            firstName: latestCaseDetails.FirstName,
            lastName: latestCaseDetails.LastName,
            middleName: latestCaseDetails.MiddleName,
            phoneNumber: latestCaseDetails.PhoneNumber,
            emailAddress: latestCaseDetails.EmailId,
            s3bucketfileName: latestCaseDetails.s3BucketFileName,
            createCasePage: false,
            caseId: latestCaseDetails.id,
            caseNumber: latestCaseDetails.caseNumber,
            serviceFileData:
              latestCaseDetails.ServiceFileData !== undefined
                ? JSON.parse(latestCaseDetails.ServiceFileData)
                : state.serviceFileData,
            isLoading: false,
            status: latestCaseDetails.Status.includes(",")
              ? myConstClass.STATUS_CANCEL
              : latestCaseDetails.Status,
            cancelQueue: latestCaseDetails.Status.includes(",")
              ? latestCaseDetails.Status
              : "",
            emailChannelInitiated:
              latestCaseDetails.EmailInitiated === null ? false : true,
            chatInitiatedForCase:
              latestCaseDetails.ChatInitiated === null ? false : true,
            responseFileName: latestCaseDetails.ResponseFileName,
            responseAttorneyFileName:
              latestCaseDetails.ResponseAttorneyFileName,
            LawyerId: latestCaseDetails.LawyerId,
            LawyersList: menuItemList,
          });
        } catch (error) {
          console.log(error);
          setState({ ...state, isLoading: false, showExceptionDialog: true });
        }
      }

      // Call the fetch data function.
      fetchData();
    } else {
      getLawyersList();
    }
  }, []);

  const showExceptionOnPage = () => {
    setState({ ...state, showExceptionDialog: true });
  };

  const getLawyersList = async () => {
    let menuItemList = [];
    let data = [];
    const apiFunctionPath = "lawyers/getLawyers";
    try {
      const response = await fetchWithAuth(apiFunctionPath);
      data = response;
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      setState({ ...state, isLoading: false, showExceptionDialog: true });
      //throw(error);
    }
    menuItemList = data.length ? (
      data.map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.firstName + " " + x.lastName}
        </MenuItem>
      ))
    ) : (
      <MenuItem value="" disabled>
        No options available
      </MenuItem>
    );

    //console.log(menuItemList);
    setState((prevState) => ({
      ...prevState,
      LawyersList: menuItemList,
    }));
  };

  const viewResponse = async (row) => {
    setState({
      ...state,
      isLoading: false,
      showResponsesDialog: true,
      standardAnswer: row.StandardAnswer,
      originalAnswer: row.OriginalAnswer,
      viewresponserow: row,
    });
  };

  const SendWebLink = async () => {
    setState({ ...state, isLoading: true });

    try {
      const apiFunctionPath = "email/sendWebLink"; // Path to your express API method

      const requestBody = {
        caseId: state.caseId || state.insertedId,
        caseNumber: state.caseNumber,
        emailAddress: state.emailAddress,
        emailChannelInitiated: state.emailChannelInitiated,
      };

      // Send POST request to the Node.js API
      // const result = await axios.post(`${apipath}${path}`, requestBody, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      const result = await fetchWithAuth(apiFunctionPath, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: requestBody, // Assuming `form` is the data to be sent
      });

      if (result) {
        // Assuming your API returns a success message
        console.log(result.message);
      }

      setState({
        ...state,
        emailSent: true,
        isLoading: false,
        status: myConstClass.STATUS_AWAITING,
        emailChannelInitiated: true,
      });
    } catch (error) {
      console.error("Error sending web link:", error);
      setState({ ...state, isLoading: false, showExceptionDialog: true });
    }
  };

  // const SendWebLink = async () => {
  //   setState({ ...state, isLoading: true });
  //   let subject = "ACTION REQUIRED: " + state.caseNumber + " Response form";
  //   console.log(state.caseId);
  //   console.log(state.caseNumber);
  //   const key =
  //     (state.caseId !== null && state.caseId !== ""
  //       ? state.caseId
  //       : state.insertedId) +
  //     "-" +
  //     state.caseNumber.split(" ").join("");
  //   console.log(process.env.FORM_LINK);
  //   const body = `https://main.d2juc4bptwol87.amplifyapp.com/submit/${key}`;
  //   console.log(body);
  //   const path = "/email";
  //   const formData = new FormData();
  //   formData.append("emailAddress", state.emailAddress);
  //   formData.append("subject", subject);
  //   formData.append("message", body.toString());
  //   formData.append("usebody", false);

  //   const result = await API.post(myAPI, path, {
  //     headers: {
  //       "content-type": "multipart/form-data",
  //     },
  //     body: formData,
  //   }).then(async () => {
  //     if (!state.emailChannelInitiated) {
  //       //const path = "/caseStatusUpdate";
  //       await axios
  //         .put(
  //           `${apipath}cases/updateCase/${state.caseId}/${myConstClass.STATUS_AWAITING}`
  //         )
  //         .catch((error) => {
  //           console.log(error);
  //           setState({ ...state, isLoading: true, showExceptionDialog: true });
  //         });
  //     }
  //   });
  //   setState({
  //     ...state,
  //     emailSent: true,
  //     isLoading: false,
  //     status: myConstClass.STATUS_AWAITING,
  //     emailChannelInitiated: true,
  //   });
  // };

  const refresh = async () => {
    setState({ ...state, isLoading: true });
    const formData = new FormData();
    let path = "questions/getQuestions";
    formData.append(
      "insertedId",
      state.insertedId === 0 ? state.caseId : state.insertedId
    );
    console.log(state.insertedId === 0 ? state.caseId : state.insertedId);
    let questions = [];
    let id = state.insertedId === 0 ? state.caseId : state.insertedId;
    const apiFunctionPath = `${path}/${id}`;
    await fetchWithAuth(apiFunctionPath)
      .then(async (response) => {
        questions = await response;
      })
      .catch((error) => {
        console.log(error);
        setState({ ...state, isLoading: false, showExceptionDialog: true });
      });
    setState({ ...state, questionTable: questions, isLoading: false });
  };

  const startConversation = async () => {
    setState({ ...state, isLoading: true });
    const path = "/initiateSms";
    const emailPath = "/email";
    const formData = new FormData();
    const question = state.questionTable.filter(
      (x) => x.SequenceNumber === 1
    )[0];
    let message =
      "Your case is being looked into. Here is your first query. Please respond. \n " +
      question.StandardQuestion;
    console.log(question);
    formData.append("emailAddress", state.emailAddress);
    formData.append("usebody", true);
    formData.append("subject", "Please respond to below question");
    formData.append("message", message);
    const result = await API.post(myAPI, emailPath, {
      headers: {
        "content-type": "multipart/form-data",
      },
      body: formData,
    }).then(async () => {
      await API.post(myAPI, path + "/" + state.caseId + "-" + question.Id);
    });
    let questionTemp = [...state.questionTable];
    questionTemp.filter((x) => x.SequenceNumber === 1)[0].MsgSent = 1;
    setState({
      ...state,
      chatInitiatedForCase: true,
      isLoading: false,
      questionTable: questionTemp,
      status: myConstClass.STATUS_AWAITING,
    });
  };

  const handleChange = (e) => {
    let newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
    console.log(state);
  };

  const uploadFile = async (file, filename) => {
    try {
      await Storage.put(filename, file);
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const deleteFile = async (file, filename) => {
    try {
      await Storage.remove(filename, file);

      console.log("File removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  const handleDownload = async (filename, updateState, docType) => {
    try {
      const response = await Storage.get(filename);
      console.log(response);
      if (updateState) {
        switch (docType) {
          case "AttorneyResponsesDoc":
            setState({ ...state, responseAttorneyFileName: filename });
            break;
          case "ClientResponsesDoc":
            setState({ ...state, responseFileName: filename });
            break;
          case "ServiceFile":
            setState({ ...state, serviceFileName: filename });
        }
      }
      window.open(response); // Open the file URL in a new tab for download
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  const setPartyRolesNames = (json) => {
    // Initialize arrays to hold names for each role
    const propoundingPartyNames = [];
    const respondingPartyNames = [];
  
    // Determine the roles
    const propoundingRole = json.propoundingPartyRole.toLowerCase();
    const respondingRole = json.respondingPartyRole.toLowerCase();
  
    // Iterate over the style array to extract names based on roles
    json.style.forEach(party => {
      if (party.role.toLowerCase() === propoundingRole) {
        propoundingPartyNames.push(party.name);
      }
      if (party.role.toLowerCase() === respondingRole) {
        respondingPartyNames.push(party.name);
      }
    });
  
    // Update the JSON object with comma-separated names
    json.propoundingPartyNames = propoundingPartyNames.join(', ');
    json.respondingPartyNames = respondingPartyNames.join(', ');
  
    return json;
  };
  

  const handleServiceFileChange = async (event) => {
    if (state.serviceFile !== "") {
      deleteFile(state.serviceFile, state.s3BucketServiceFileName);
      setState({
        ...state,
        serviceFile: "",
        s3BucketServiceFileName: "",
        serviceFileName: "",
        serviceFileData: "",
        caseNumber: "",
      });
    }
    if (event.target.files.length === 0) return;
    const path = "/getfilecontent";
    const file = event.target.files[0];

    let resp;
    const filename = Date.now() + "-" + file.name.replace(/ /g, "");
    setState({ ...state, isLoading: true });

    await uploadFile(file, filename).then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 2-second delay
      const functionpath = `file/processPdf/${filename + "IsServiceFile"}`;
      await fetchWithAuth(functionpath)
        //.get(`${apipath}file/processPdf/${filename + "IsServiceFile"}`)
        .then((response) => {
          console.log(response);
          let jsonResponse = response.questions;
          jsonResponse = jsonResponse.replace("```json", "");
          jsonResponse = jsonResponse.replace("```", "");
          jsonResponse = JSON.parse(jsonResponse);
          jsonResponse = setPartyRolesNames(jsonResponse)
          jsonResponse = {
            ...jsonResponse,
            interrogatoryFileTitle:
              state.serviceFileData.interrogatoryFileTitle,
            remainingContent: state.serviceFileData.remainingContent,
          };
          console.log(JSON.stringify(jsonResponse));
          setState({
            ...state,
            serviceFile: file,
            s3BucketServiceFileName: filename,
            serviceFileName: file.name,
            caseNumber:
              jsonResponse.caseNumber === "not found"
                ? ""
                : jsonResponse.caseNumber,
            isLoading: false,
            serviceFileData: jsonResponse,
          });
        })
        .catch((error) => {
          console.log(error);
          setState({ ...state, isLoading: false, showExceptionDialog: true });
        });
    });
  };

  const removeFile = (type) => {
    if (type === "Interrogatory") {
      if (state.inpFile !== "") {
        deleteFile(state.inpFile, state.s3bucketfileName);
      }
      setState({
        ...state,
        inpFile: "",
        s3bucketfileName: "",
        inpFileName: "",
        questions: "",
        serviceFileData: { ...state.serviceFileData },
      });
    } else if (type === "Servicefile") {
      if (state.serviceFile !== "") {
        deleteFile(state.serviceFile, state.s3BucketServiceFileName);
      }
      setState({
        ...state,
        serviceFile: "",
        s3BucketServiceFileName: "",
        serviceFileName: "",
        serviceFileData: "",
        caseNumber: "",
      });
    }
  };

  const handleFileChange = async (event) => {
    if (state.inpFile !== "") {
      deleteFile(state.inpFile, state.s3bucketfileName);
      setState((prevState) => ({
        ...prevState,
        inpFile: null,
        inpFileName: "",
        serviceFileData: { ...state.serviceFileData },
        questions: [],
      }));
    }

    if (event.target.files.length === 0) return;

    const file = event.target.files[0];
    let resp;
    let serviceFileData = {};
    const filename = Date.now() + "-" + file.name.replace(/ /g, "");
    setState({ ...state, isLoading: true });

    await uploadFile(file, filename).then(async () => {
      // Adding a delay to ensure the file is available in the S3 bucket
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 2-second delay
      const myArray = [];
      const functionPath = `file/processPdf/${filename}`;
      await fetchWithAuth(functionPath)
        .then((response) => {
          //console.log(response);
          //resp = response.questions;
          let jsonData = response.questions.replace("```json", "");
          jsonData = jsonData.replace("```", "");
          console.log(jsonData);
          resp = JSON.parse(jsonData);
          console.log(resp);
          serviceFileData = {
            ...state.serviceFileData,
            interrogatoryFileTitle: resp.fileTitle,
            remainingContent: resp.remainingContent,
          };
          const questionPattern = /^(\d{1,2}[).]\s)?(.*)/;
          const questionsArray = resp.questions;

          questionsArray.forEach((question) => {
            const match = questionPattern.exec(question);
            if (match) {
              myArray.push((match[2] || match[0]).trim());
            } else {
              console.warn(`Unexpected question format: ${question}`);
              myArray.push(question.trim());
            }
          });

          console.log(myArray);
        })
        .catch((error) => {
          console.log(error);
          setState({ ...state, showExceptionDialog: true, isLoading: false });
        });

      setState({
        ...state,
        questions: myArray,
        inpFile: file,
        inpFileName: file.name,
        s3bucketfileName: filename,
        isLoading: false,
        serviceFileData: serviceFileData,
      });
    });
  };

  const canelCaseCreation = () => {
    navigate("/Landingpage");
  };

  const setParentState = ({ insertedQuestions, insertedId }) => {
    setState({
      ...state,
      insertedQuestions: insertedQuestions,
      questionTable: insertedQuestions,
      showTable: true,
      insertedId: insertedId,
      caseId: insertedId,
      status: myConstClass.STATUS_NEW,
      caseNumber: state.caseNumber ? state.caseNumber : `CA-00${insertedId}`,
    });
  };

  const handleCheckboxChange = (value, changedRow) => {
    let tempTabledata = [...state.questionTable];
    const row = tempTabledata.find(
      (row) => row.SequenceNumber === changedRow.SequenceNumber
    );
    row.IsActive = value;
    setState({ ...state, questionTable: tempTabledata });
  };

  const handleAttestation = async () => {
    try {
      setState({ ...state, isLoading: true });
      const formData = { data: JSON.stringify(state.questionTable) };
      const apiFunctionPath = `questions/updateQuestionsAndCase/${state.caseId}/${myConstClass.STATUS_ATTESTED}`;

      await fetchWithAuth(apiFunctionPath, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: formData, // Assuming `form` is the data to be sent
      });

      //console.log(response.data);

      // Optionally update state based on response
      setState({
        ...state,
        showAttestDialog: false,
        isLoading: false,
        status: myConstClass.STATUS_ATTESTED,
      });
    } catch (error) {
      console.error("Error:", error);
      setState({ ...state, isLoading: false, showExceptionDialog: true });
    }
  };

  const handleComplete = async () => {
    setState({ ...state, isLoading: true });
    const apiFuntionpath = `cases/updateCase/${state.caseId}/${myConstClass.STAUS_COMPLETE}`;

    await fetchWithAuth(apiFuntionpath, { method: "put" }).catch((error) => {
      console.error("Error:", error);
      setState({ ...state, isLoading: false, showExceptionDialog: true });
    });
    setState({
      ...state,
      completeConfirmation: false,
      isLoading: false,
      status: myConstClass.STAUS_COMPLETE,
    });
  };

  const changeIsLoading = () => {
    setState({ ...state, isLoading: !state.isLoading });
  };

  const handleCancel = async () => {
    setState({ ...state, isLoading: true });
    let cancelQueue = "";
    switch (state.status) {
      case myConstClass.STATUS_NEW:
        cancelQueue =
          myConstClass.STATUS_NEW + "," + myConstClass.STATUS_CANCEL;
        break;
      case myConstClass.STATUS_ATTESTED:
        cancelQueue =
          myConstClass.STATUS_NEW +
          "," +
          myConstClass.STATUS_ATTESTED +
          "," +
          myConstClass.STATUS_CANCEL;
      case myConstClass.STATUS_AWAITING:
        cancelQueue =
          myConstClass.STATUS_NEW +
          "," +
          myConstClass.STATUS_ATTESTED +
          "," +
          myConstClass.STATUS_AWAITING +
          "," +
          myConstClass.STATUS_CANCEL;
    }
    const apiFunctionPath = `cases/updateCase/${state.caseId}/${cancelQueue}`;
    await fetchWithAuth(apiFunctionPath, { method: "put" }).catch((error) => {
      console.error("Error:", error);
      setState({ ...state, isLoading: false, showExceptionDialog: true });
    });
    setState({
      ...state,
      cancelConfirmation: false,
      isLoading: false,
      status: myConstClass.STATUS_CANCEL,
      cancelQueue: cancelQueue,
    });
  };

  const showAttestDialog = () => {
    setState({
      ...state,
      showAttestDialog: true,
    });
  };

  const handleServiceDialogOpen = () => {
    setState({
      ...state,
      serviceDialogOpen: true,
    });
  };

  const handleServiceDialogClose = () => {
    setState({ ...state, serviceDialogOpen: false });
  };

  const handleDialogClose = () => {
    setState({
      ...state,
      showAttestDialog: false,
      showSendWebLinkDialog: false,
      emailSent: false,
      showResponsesDialog: false,
      showCancelDialog: false,
      cancelConfirmation: false,
      showCompleteDialog: false,
      completeConfirmation: false,
      showChatDiaolog: false,
    });
  };

  const chatDialog = () => {
    setState({ ...state, showChatDiaolog: true });
  };

  const cancelDialog = () => {
    setState({
      ...state,
      showCancelDialog: true,
      cancelConfirmation: true,
    });
  };

  const completeDialog = () => {
    setState({
      ...state,
      showCompleteDialog: true,
      completeConfirmation: true,
    });
  };

  const OpenWebLinkDialog = () => {
    setState({
      ...state,
      showSendWebLinkDialog: true,
    });
  };

  const handleViewQuestionsDialog = (isOpen) => {
    setState({
      ...state,
      openViewQuestions: !isOpen,
    });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {state.showExceptionDialog && <ShowExceptionDialog />}
      
      {state.isLoading && <Loading />}
      <ViewResponseDialog
        open={state.showResponsesDialog}
        Transition={Transition}
        handleDialogClose={handleDialogClose}
        row={state.viewresponserow}
      />

      <WebllinkDialog
        open={state.showSendWebLinkDialog}
        Transition={Transition}
        handleClose={handleDialogClose}
        emailAddress={state.emailAddress}
        SendWebLink={SendWebLink}
        emailSent={state.emailSent}
      />
      <AttestDialog
        open={state.showAttestDialog}
        handleClose={handleDialogClose}
        handleAttestation={handleAttestation}
      />
      <CancelDialog
        open={state.showCancelDialog}
        cancelConfirmation={state.cancelConfirmation}
        handleClose={handleDialogClose}
        handleCancel={handleCancel}
      />
      <CompleteDialog
        open={state.showCompleteDialog}
        completeConfirmation={state.completeConfirmation}
        handleClose={handleDialogClose}
        handleComplete={handleComplete}
      />
      <ChatDialog
        open={state.showChatDiaolog}
        chatInitiatedForCase={state.chatInitiatedForCase}
        startConversation={startConversation}
        handleClose={handleDialogClose}
        phoneNumber={state.phoneNumber}
      />

      <React.Fragment>
        {((!state.createCasePage && state.questionTable.length > 0) ||
          state.showTable) && (
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Breadcrumb caseNumber={state.caseNumber} />
            </Grid>
            <Grid item xs={12}>
              <StatusStepper
                status={state.status}
                cancelQueue={state.cancelQueue}
              />
            </Grid>
          </Grid>
        )}

        <Typography variant="h6" gutterBottom style={{ marginTop: "10px" }}>
          Client Details
        </Typography>
        <Paper style={{ marginTop: "30px", textAlign: "center" }}>
          <Grid container rowSpacing={3}>
            <Grid item xs={4}>
              <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                onChange={handleChange}
                value={state.firstName}
                disabled={
                  !state.createCasePage ||
                  (state.showTable && state.questionTable.length > 0)
                }
                style={{ width: "90%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="middleName"
                name="middleName"
                label="Middle Name"
                variant="outlined"
                onChange={handleChange}
                value={state.middleName ? state.middleName : ""}
                disabled={
                  !state.createCasePage ||
                  (state.showTable && state.questionTable.length > 0)
                }
                style={{ width: "90%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                onChange={handleChange}
                value={state.lastName}
                disabled={
                  !state.createCasePage ||
                  (state.showTable && state.questionTable.length > 0)
                }
                style={{ width: "90%" }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                variant="outlined"
                onChange={handleChange}
                value={state.phoneNumber}
                disabled={
                  !state.createCasePage ||
                  (state.showTable && state.questionTable.length > 0)
                }
                style={{ width: "90%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="emailAddress"
                name="emailAddress"
                label="Email Address"
                variant="outlined"
                onChange={handleChange}
                value={state.emailAddress}
                disabled={
                  !state.createCasePage ||
                  (state.showTable && state.questionTable.length > 0)
                }
                style={{ width: "90%" }}
              />
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ minWidth: 120, marginLeft: "20px" }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="lawyer-select-label">Lawyer</InputLabel>
                  <Select
                    labelId="lawyer-select-label"
                    id="LawyerId"
                    name="LawyerId"
                    value={state.LawyerId}
                    onChange={handleChange}
                    label="Lawyer" // Ensures the label is associated with the Select component
                    displayEmpty
                    sx={{ width: "95%" }}
                    disabled={
                      !state.createCasePage ||
                      (state.showTable && state.questionTable.length > 0)
                    }
                  >
                    {state.LawyersList}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            {((!state.createCasePage && state.questionTable.length > 0) ||
              state.showTable) && (
              <React.Fragment>
                <Grid
                  item
                  xs={12}
                  style={{
                    marginBottom: "20px",
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                >
                  {state.questionTable.length > 0 && (
                    <Button
                      variant="outlined"
                      onClick={showAttestDialog}
                      disabled={
                        !state.questionTable.every(
                          (x) => x.subQuestions && x.subQuestions.length > 1
                        ) || 
                        state.questionTable.every(
                          (x) => !x.IsActive
                        ) ||
                        state.status !== myConstClass.STATUS_NEW
                      }
                      startIcon={
                        state.status !== myConstClass.STATUS_NEW && (
                          <DoneIcon
                            fontSize="small"
                            style={{ color: "green" }}
                          ></DoneIcon>
                        )
                      }
                    >
                      {state.status === myConstClass.STATUS_NEW
                        ? "Select Questions"
                        : "Questions Selected"}
                    </Button>
                  )}
                  {((!state.createCasePage && state.questionTable.length > 0) ||
                    (state.showTable && state.questionTable.length > 0)) && (
                    <Button
                      variant="outlined"
                      style={{ marginLeft: "20px" }}
                      onClick={chatDialog}
                      disabled={
                        state.status === myConstClass.STATUS_NEW ||
                        state.status === myConstClass.STATUS_CANCEL ||
                        state.status === myConstClass.STAUS_COMPLETE ||
                        state.chatInitiatedForCase
                      }
                      startIcon={
                        state.chatInitiatedForCase && (
                          <DoneIcon
                            fontSize="small"
                            style={{ color: "green" }}
                          ></DoneIcon>
                        )
                      }
                    >
                      {!state.chatInitiatedForCase
                        ? "Send by text"
                        : "Text Sent"}
                    </Button>
                  )}

                  {state.questionTable.length > 0 && (
                    <Button
                      style={{ marginLeft: "20px" }}
                      variant="outlined"
                      onClick={OpenWebLinkDialog}
                      disabled={
                        state.status === myConstClass.STATUS_NEW ||
                        state.status === myConstClass.STATUS_CANCEL ||
                        state.status === myConstClass.STAUS_COMPLETE
                      }
                      startIcon={
                        state.emailChannelInitiated && (
                          <DoneIcon
                            fontSize="small"
                            style={{ color: "green" }}
                          ></DoneIcon>
                        )
                      }
                    >
                      {!state.emailChannelInitiated
                        ? "Send by WebLink"
                        : "Re-send Weblink"}
                    </Button>
                  )}

                  {state.questionTable.length > 0 && (
                    <Button
                      style={{ marginLeft: "20px" }}
                      variant="outlined"
                      onClick={cancelDialog}
                      disabled={
                        state.status === myConstClass.STATUS_CANCEL ||
                        state.status === myConstClass.STAUS_COMPLETE
                      }
                    >
                      Cancel
                    </Button>
                  )}

                  {state.questionTable.length > 0 && (
                    <Button
                      style={{ marginLeft: "20px" }}
                      variant="outlined"
                      onClick={completeDialog}
                      disabled={
                        state.questionTable.filter(
                          (x) =>
                            x.OriginalAnswer === null && x.IsActive === true
                        ).length > 0 ||
                        state.status === myConstClass.STATUS_CANCEL ||
                        state.status === myConstClass.STAUS_COMPLETE
                      }
                    >
                      COMPLETE
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    marginBottom: "20px",
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                ></Grid>
              </React.Fragment>
            )}
            {state.createCasePage && !state.showTable && (
              <React.Fragment>
                <Grid
                  item
                  xs={12}
                  alignItems="left"
                  style={{
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                >
                  <input
                    accept="pdf/*"
                    //className={classes.input}
                    style={{ display: "none" }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                    disabled={!state.createCasePage}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      //className={classes.button}
                    >
                      Upload Interogatories file
                    </Button>
                  </label>
                  <label style={{ marginLeft: "10px" }}>
                    {state.inpFileName ? state.inpFileName + " uploaded" : ""}
                  </label>
                  {state.inpFileName && state.questions.length > 0 && (
                    <React.Fragment>
                      <Button
                        variant="text"
                        color="primary"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          handleViewQuestionsDialog(state.openViewQuestions)
                        }
                      >
                        Show Questions
                      </Button>
                      <ViewQuestions
                        open={state.openViewQuestions}
                        onClose={() =>
                          handleViewQuestionsDialog(state.openViewQuestions)
                        }
                        questions={state.questions}
                      />
                    </React.Fragment>
                  )}
                  {state.inpFileName && (
                    <Button
                      variant="text"
                      color="primary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => removeFile("Interrogatory")}
                    >
                      CLEAR FILE
                    </Button>
                  )}
                </Grid>
                {state.inpFileName && state.questions.length === 0 && (
                  <Typography
                    style={{ marginLeft: "10px", color: "orangered" }}
                  >
                    There seem to be no questions in the file you uploaded.
                    Please verify and upload the file again.
                  </Typography>
                )}
                <Grid
                  item
                  xs={12}
                  alignItems="left"
                  style={{
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                >
                  <input
                    accept="pdf/*"
                    //className={classes.input}
                    style={{ display: "none" }}
                    id="raised-button-file1"
                    multiple
                    type="file"
                    onChange={handleServiceFileChange}
                    disabled={!state.createCasePage}
                  />
                  <label htmlFor="raised-button-file1">
                    <Button
                      variant="contained"
                      component="span"
                      //className={classes.button}
                    >
                      Upload Notice Of Service file
                    </Button>
                  </label>
                  <label style={{ marginLeft: "10px" }}>
                    {state.serviceFileName
                      ? state.serviceFileName + " uploaded"
                      : ""}
                  </label>
                  {state.serviceFileName && (
                    <Button
                      variant="text"
                      color="primary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => removeFile("Servicefile")}
                    >
                      CLEAR FILE
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    marginBottom: "20px",
                    textAlign: "left",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <SubmitForm
                      myAPI={myAPI}
                      apipath={apipath}
                      myConstClass={myConstClass}
                      state={state}
                      setParentState={setParentState} // Pass the state updater function to update parent's state
                    />
                    {state.createCasePage && (
                      <Button
                        style={{ marginLeft: "10px" }}
                        variant="text"
                        onClick={canelCaseCreation} // Ensure the method name is correctly spelled
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </Paper>

        {((!state.createCasePage && state.questionTable.length > 0) ||
          state.showTable) && (
          <React.Fragment>
            <Grid container alignItems="center" style={{ marginTop: "20px" }}>
              <Grid item xs={3}>
                <Typography variant="h6" gutterBottom>
                  Irog List{" "}
                </Typography>
              </Grid>
              <Grid
                item
                xs={9}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {state.questionTable.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() =>
                      handleDownload(state.s3bucketfileName, false, "")
                    }
                    startIcon={<DownloadIcon />}
                  >
                    Questionnaire
                  </Button>
                )}
                {state.status === myConstClass.STAUS_COMPLETE && (
                  <React.Fragment>
                    <ServiceFileGenerator
                      formData={state.serviceFileData}
                      handleDownload={handleDownload}
                      lawyerId={state.LawyerId}
                      serviceFileName={state.serviceFileName}
                      caseid={state.caseId}
                      showExceptionOnPage={showExceptionOnPage}
                    />
                  </React.Fragment>
                )}
                {state.status === myConstClass.STAUS_COMPLETE && (
                  <DocumentGenerator
                    formData={state.serviceFileData}
                    caseid={state.caseId}
                    handleDownload={handleDownload}
                    responseFileName={state.responseFileName}
                    questionTable={state.questionTable}
                    changeIsLoading={changeIsLoading}
                    isAttorneyDoc={false}
                    showExceptionOnPage={showExceptionOnPage}
                  />
                )}

                {state.status === myConstClass.STAUS_COMPLETE && (
                  <DocumentGenerator
                    formData={state.serviceFileData}
                    caseid={state.caseId}
                    handleDownload={handleDownload}
                    responseFileName={state.responseAttorneyFileName}
                    questionTable={state.questionTable}
                    changeIsLoading={changeIsLoading}
                    isAttorneyDoc={true}
                    showExceptionOnPage={showExceptionOnPage}
                  />
                )}
                <IconButton variant="contained" onClick={refresh}>
                  <RefreshIcon />
                </IconButton>
              </Grid>

              <Grid item xs={12} style={{ marginTop: "10px" }}>
                <QuestionsTable
                  rows={state.questionTable}
                  viewResponse={viewResponse}
                  emailChannelInitiated={state.emailChannelInitiated}
                  status={state.status}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </React.Fragment>
    </Box>
  );
}

export default Home;


