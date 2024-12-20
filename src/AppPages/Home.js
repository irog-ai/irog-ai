import * as React from "react";
import { useState, useEffect } from "react";
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
import WordGenerator from "./ReusableComponents/WordGenerator";

const myAPI = "api";

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
    selectedLawyer: "",
    LawyersList: [],
    inpFile: "",
    serviceFile: "",
    serviceFileName: "",
    s3BucketServiceFileName: "",
    inpFileName: "",
    questions: [],
    isLoading: false,
    serviceFileData:{
      courtName: "",
      caseNumber: "",
      propundingPartyRole:"",
      propundingPartyNames:[],
      respondingPartyRole:"",
      respondingPartyNames:[],
      division: "",
      noticeHeading: "",
      noticeMatter: "",
      lawyersJson:{},
      certificateText: "",
      interrogatoryFileTitle:""
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
    serviceDialogOpen:false,
  };
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.state !== undefined &&
      location.state !== null &&
      location.state.selectedRow !== null &&
      selectedRow !== null
    ) {
      let { selectedRow } = location.state;
      setState({ ...state, isLoading: true });
      let path = "/getQuestions";
      let tableData = [];
      let menuItemList = [];
      menuItemList.push(
        <MenuItem value={selectedRow.LawyerId}>{selectedRow.Lawyer}</MenuItem>
      );

      console.log(selectedRow); // output: "the-page-id"
      async function getData() {
        const formData = new FormData();
        console.log(selectedRow.Id);
        formData.append("insertedId", selectedRow.Id.toString());
        await API.get(myAPI, path + "/" + selectedRow.Id, {
          headers: {
            "Content-Type": "text/plain",
          },
        }).then(async (response) => {
          console.log(response);
          tableData = await response.recordsets[1];
          selectedRow = response.recordsets[0][0];
        });
        console.log(selectedRow.ServiceFileData);
        setState({
          ...state,
          questionTable: tableData,
          firstName: selectedRow.FirstName,
          lastName: selectedRow.LastName,
          middleName: selectedRow.MiddleName,
          phoneNumber: selectedRow.PhoneNumber,
          emailAddress: selectedRow.EmailId,
          s3bucketfileName: selectedRow.s3BucketFileName,
          createCasePage: false,
          caseId: selectedRow.Id,
          caseNumber: selectedRow.CaseId,
          serviceFileData: selectedRow.ServiceFileData!==undefined?JSON.parse(selectedRow.ServiceFileData):state.serviceFileData,
          isLoading: false,
          status: selectedRow.Status.includes(",")
            ? myConstClass.STATUS_CANCEL
            : selectedRow.Status,
          cancelQueue: selectedRow.Status.includes(",")
            ? selectedRow.Status
            : "",
          emailChannelInitiated:
            selectedRow.EmailInitiated === null ? false : true,
          chatInitiatedForCase:
            selectedRow.ChatInitiated === null ? false : true,
          responseFileName: selectedRow.ResponseFileName,
          responseAttorneyFileName: selectedRow.ResponseAttorneyFileName,
          selectedLawyer: selectedRow.LawyerId,
          LawyersList: menuItemList,
        });
      }
      getData();
    } else {
      getLawyersList();
    }
  }, []);

  const getLawyersList = async () => {
    console.log("Lawyers method");
    let menuItemList = [];
    // menuItemList.push(
    //   <MenuItem value="">
    //     <em>None</em>
    //   </MenuItem>
    // );
    const path = "/getLawyers";
    const response = await API.get(
      myAPI,
      path + "/" + state.caseId + "-" + myConstClass.STATUS_AWAITING
    );
    //.then(async (response) => {
    console.log(response);
    const data = await response.recordsets[0];
    console.log(data);
    menuItemList = data.length ? (
      data.map((x) => (
        <MenuItem key={x.Id} value={x.Id}>
          {x.FirstName + " " + x.LastName}
        </MenuItem>
      ))
    ) : (
      <MenuItem value="" disabled>
        No options available
      </MenuItem>
    );

    console.log(menuItemList);
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
    let subject = "ACTION REQUIRED: " + state.caseNumber + " Response form";
    console.log(state.caseId);
    console.log(state.caseNumber);
    const key =
      (state.caseId !== null && state.caseId !== ""
        ? state.caseId
        : state.insertedId) +
      "-" +
      state.caseNumber.split(" ").join("");
    console.log(process.env.FORM_LINK);
    const body = `https://main.d2juc4bptwol87.amplifyapp.com/submit/${key}`;
    console.log(body);
    const path = "/email";
    const formData = new FormData();
    formData.append("emailAddress", state.emailAddress);
    formData.append("subject", subject);
    formData.append("message", body.toString());
    formData.append("usebody", false);

    const result = await API.post(myAPI, path, {
      headers: {
        "content-type": "multipart/form-data",
      },
      body: formData,
    }).then(async () => {
      if (!state.emailChannelInitiated) {
        const path = "/caseStatusUpdate";
        await API.get(
          myAPI,
          path + "/" + state.caseId + "-" + myConstClass.STATUS_AWAITING
        ).then(async (response) => {
          console.log(response);
          const result = await response;
        });
      }
    });
    setState({
      ...state,
      emailSent: true,
      isLoading: false,
      status: myConstClass.STATUS_AWAITING,
      emailChannelInitiated: true,
    });
  };

  const refresh = async () => {
    setState({ ...state, isLoading: true });
    const formData = new FormData();
    let path = "/getQuestions";
    formData.append(
      "insertedId",
      state.insertedId === 0 ? state.caseId : state.insertedId
    );
    console.log(state.insertedId === 0 ? state.caseId : state.insertedId);
    let questions = [];

    await API.get(
      myAPI,
      path + "/" + (state.insertedId === 0 ? state.caseId : state.insertedId),
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    ).then(async (response) => {
      console.log(response);
      questions = await response.recordsets[1];
      console.log(questions);
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

  const handleDownload = async (filename, updateState, isAttorneyDoc) => {
    try {
      const response = await Storage.get(filename);
      console.log(response);
      if (updateState) {
        if (isAttorneyDoc) {
          setState({ ...state, responseAttorneyFileName: filename });
        } else {
          setState({ ...state, responseFileName: filename });
        }
      }
      window.open(response); // Open the file URL in a new tab for download
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  const handleServiceFileChange = async (event) => {
    if (state.serviceFile !== "") {
      deleteFile(state.serviceFile, state.s3BucketServiceFileName);
    }

    const path = "/getfilecontent";
    const file = event.target.files[0];
    let resp;
    const filename = Date.now() + "-" + file.name.replace(/ /g, "");
    setState({ ...state, isLoading: true });

    await uploadFile(file, filename).then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
      await API.get(myAPI, path + "/" + filename + "IsServiceFile", {
        headers: {
          "Content-Type": "text/plain",
        },
      }).then((response) => {
        console.log(response);
        let jsonResponse = response;
        jsonResponse={...jsonResponse,interrogatoryFileTitle:state.serviceFileData.interrogatoryFileTitle }
        
        setState({
          ...state,
          serviceFile: file,
          s3BucketServiceFileName: filename,
          serviceFileName: file.name,
          caseNumber: jsonResponse.caseNumber === 'not found' ? "" : jsonResponse.caseNumber,
          isLoading: false,
          serviceFileData : jsonResponse
        });
      });
    });
  };

  const handleFileChange = async (event) => {
    if (state.inpFile !== "") {
      deleteFile(state.inpFile, state.s3bucketfileName);
    }

    const path = "/getfilecontent";
    const file = event.target.files[0];
    let resp;
    let  serviceFileData={...state.serviceFileData};
    const filename = Date.now() + "-" + file.name.replace(/ /g, "");
    setState({ ...state, isLoading: true });


    await uploadFile(file, filename).then(async () => {
      console.log(file);

      // Adding a delay to ensure the file is available in the S3 bucket
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
      const myArray = [];
      await API.get(myAPI, path + "/" + filename, {
        headers: {
          "Content-Type": "text/plain",
        },
      }).then((response) => {
        console.log(response);
        resp = response.questions;
        serviceFileData={...state.serviceFileData,interrogatoryFileTitle:resp.fileTitle};
        const questionPattern = /(\d{1,2}[).]\s)((?:(?!\d{1,2}[).]\s).|\n)+)/g;
        let match;
        while ((match = questionPattern.exec(resp)) !== null) {
          myArray.push(match[2].trim()); // Only push the question text without the number
        }
        console.log(myArray);
      });

      setState({
        ...state,
        questions: myArray,
        inpFile: file,
        inpFileName: file.name,
        s3bucketfileName: filename,
        isLoading: false,
        serviceFileData: serviceFileData
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
    row.IsQuestionActive = value;
    setState({ ...state, questionTable: tempTabledata });
  };

  const handleAttestation = async () => {
    setState({ ...state, isLoading: true });
    const path = "/caseStatusUpdate";
    await API.get(
      myAPI,
      path + "/" + state.caseId + "-" + myConstClass.STATUS_ATTESTED
    ).then(async (response) => {
      console.log(response);
      const inactiveQuestionsCount = state.questionTable.filter(
        (question) => !question.IsQuestionActive
      ).length;
      if (inactiveQuestionsCount) {
        const path1 = "/updateQuestions";
        const formData = new FormData();
        formData.append("data", JSON.stringify(state.questionTable));
        await API.post(myAPI, path1, { body: formData }).then(() => {});
      }
    });
    setState({
      ...state,
      showAttestDialog: false,
      isLoading: false,
      status: myConstClass.STATUS_ATTESTED,
    });
  };

  const handleComplete = async () => {
    setState({ ...state, isLoading: true });
    const path = "/caseStatusUpdate";
    await API.get(
      myAPI,
      path + "/" + state.caseId + "-" + myConstClass.STAUS_COMPLETE
    ).then(async (response) => {
      console.log(response);
      const result = await response;
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
    const path = "/caseStatusUpdate";
    await API.get(myAPI, path + "/" + state.caseId + "-" + cancelQueue).then(
      async (response) => {
        console.log(response);
        const result = await response;
      }
    );
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
    setState({...state, serviceDialogOpen:false});
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
      {/* <Sidebar signOut={signOut} /> */}
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
                    id="lawyerId"
                    name="selectedLawyer"
                    value={state.selectedLawyer}
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
                        state.questionTable.filter(
                          (x) => x.StandardQuestion === null
                        ).length > 0 || state.status !== myConstClass.STATUS_NEW
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
                            x.OriginalAnswer === null &&
                            x.IsQuestionActive === true
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
                </Grid>
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
                      handleDownload(state.s3bucketfileName, false, false)
                    }
                    startIcon={<DownloadIcon />}
                  >
                    Questionnaire
                  </Button>
                )}
                {state.status === myConstClass.STAUS_COMPLETE && (
                  <React.Fragment>
                  <ServiceDialog handleDownload={handleDownload} data={state.serviceFileData} open={state.serviceDialogOpen} handleClose={handleServiceDialogClose}  />
                  <Button
                    variant="outlined"
                    style={{ marginLeft: "20px" }}
                    onClick={handleServiceDialogOpen}
                    startIcon={<DownloadIcon />}
                  >
                    Generate Service file
                  </Button>
                  </React.Fragment>
                )}
                {state.status === myConstClass.STAUS_COMPLETE && (
                  <WordGenerator
                    caseid={state.caseId}
                    handleDownload={handleDownload}
                    responseFileName={state.responseFileName}
                    questionTable={state.questionTable}
                    changeIsLoading={changeIsLoading}
                    isAttorneyDoc={false}
                  />
                )}

                {state.status === myConstClass.STAUS_COMPLETE && (
                  <WordGenerator
                    caseid={state.caseId}
                    handleDownload={handleDownload}
                    responseFileName={state.responseAttorneyFileName}
                    questionTable={state.questionTable}
                    changeIsLoading={changeIsLoading}
                    isAttorneyDoc={true}
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
