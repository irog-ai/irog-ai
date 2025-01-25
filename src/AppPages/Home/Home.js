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
import ViewQuestions from "./ReusableComponents/ViewQuestionsFromFile";
import SubmitForm from "./ReusableComponents/SubmitForm";
import ServiceDialog from "./ReusableComponents/ServiceDialog";
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

// Additional Components from second snippet
import ClientDetails from './components/ClientDetails';
import ActionButtons from './components/ActionButtons';
import QuestionsList from './components/QuestionsList';
import Dialogs from './components/Dialogs';

// Backend URL Configuration
const myAPI = "api";
const apipath = process.env.REACT_APP_API_URL;


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function Home({ signOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useHomeState();
  const selectedRow = location.state !== null ? location.state : null;

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && location.state.selectedRow !== null && selectedRow !== null) {
      let { selectedRow } = location.state;
      setState({ ...state, isLoading: true });

      async function fetchData() {
        try {
          const getCaseDetailsPath = `cases/getCaseById/${selectedRow.id}`;
          const getQuestionsPath = `questions/getQuestions/${selectedRow.id}`;

          const caseResponse = await fetchWithAuth(getCaseDetailsPath);
          const latestCaseDetails = caseResponse;

          const questionsResponse = await fetchWithAuth(getQuestionsPath);
          const tableData = questionsResponse;

          let menuItemList = [];
          menuItemList.push(
            <MenuItem key={latestCaseDetails.LawyerId} value={latestCaseDetails.LawyerId}>
              {latestCaseDetails.lawyerFirstName + latestCaseDetails.lawyerLastName}
            </MenuItem>
          );

          setState({
            ...state,
            questionTable: tableData,
            firstName: latestCaseDetails.FirstName,
            lastName: latestCaseDetails.LastName,
            // ... rest of the state updates
          });
        } catch (error) {
          console.log(error);
          setState({ ...state, isLoading: false, showExceptionDialog: true });
        }
      }

      fetchData();
    } else {
      getLawyersList();
    }
  }, []);

  // Handler Methods
  const handleChange = (e) => {
    let newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
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

  const handleAttestation = async () => {
    try {
      setState({ ...state, isLoading: true });
      const formData = { data: JSON.stringify(state.questionTable) };
      const apiFunctionPath = `questions/updateQuestionsAndCase/${state.caseId}/${myConstClass.STATUS_ATTESTED}`;

      await fetchWithAuth(apiFunctionPath, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        data: formData,
      });

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

  // File handling methods
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
      window.open(response);
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  // ... Add all other handler methods from the original Home component

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {state.showExceptionDialog && <ShowExceptionDialog />}
      {state.isLoading && <Loading />}
      
      <Dialogs 
        state={state}
        handleDialogClose={handleDialogClose}
        handleAttestation={handleAttestation}
        handleCancel={handleCancel}
        handleComplete={handleComplete}
        startConversation={startConversation}
        SendWebLink={SendWebLink}
        Transition={Transition}
      />

      <React.Fragment>
        <Typography variant="h6" gutterBottom style={{ marginTop: "10px" }}>
          Client Details
        </Typography>
        
        <Paper style={{ marginTop: "30px", textAlign: "center" }}>
          <ClientDetails 
            state={state}
            handleChange={handleChange}
            isDisabled={!state.createCasePage || (state.showTable && state.questionTable.length > 0)}
          />
          
          {((!state.createCasePage && state.questionTable.length > 0) || state.showTable) && (
            <ActionButtons 
              state={state}
              showAttestDialog={showAttestDialog}
              chatDialog={chatDialog}
              OpenWebLinkDialog={OpenWebLinkDialog}
              cancelDialog={cancelDialog}
              completeDialog={completeDialog}
              myConstClass={myConstClass}
            />
          )}
        </Paper>

        {((!state.createCasePage && state.questionTable.length > 0) || state.showTable) && (
          <QuestionsList 
            state={state}
            handleDownload={handleDownload}
            refresh={refresh}
            viewResponse={viewResponse}
            handleCheckboxChange={handleCheckboxChange}
            changeIsLoading={changeIsLoading}
            showExceptionOnPage={showExceptionOnPage}
            myConstClass={myConstClass}
          />
        )}
      </React.Fragment>
    </Box>
  );
}

export default Home; 