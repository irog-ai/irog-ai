import React, { useState } from "react";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { API, Auth } from "aws-amplify";
import Loading from "./Loading"; // Ensure this imports your custom Loading component correctly
import { fetchWithAuth } from "../../Util/fetchWithAuth";
import { useNavigate } from "react-router-dom";

const SubmitForm = ({ apipath, myConstClass, state, setParentState }) => {
  const [loadingState, setLoadingState] = useState({
    value: 0,
    loadingText: "",
    isLoading: false,
  });

  const navigate = useNavigate();

  const resetLoadingState = () => {
    setLoadingState({
      isLoading: false,
      value: 0,
      loadingText: "",
    });
  };

  const handleSubmit = async () => {
    setLoadingState({
      isLoading: true,
      value: 10,
      loadingText: "Submitting case...",
    });

    try {
      const user = await Auth.currentAuthenticatedUser();
      const apiFunctionPath = "cases/submitcase";
      const formData = {
        LoggedInUser: user.username,
        LoggedInUserEmail: user.attributes.email,
        FirstName: state.firstName,
        LastName: state.lastName,
        MiddleName: state.middleName,
        PhoneNumber: state.phoneNumber,
        EmailId: state.emailAddress,
        caseNumber: state.caseNumber==""?"test":state.caseNumber,
        ServiceFileData: JSON.stringify(state.serviceFileData),
        ServiceFileName: state.s3BucketFileName,
        s3BucketServiceFileName: state.s3BucketServiceFileName,
        Status: myConstClass.STATUS_NEW,
        LawyerId: state.LawyerId,
        questions: state.questions,
      };
      console.log(formData);
      //const response = await axios.post(`${apipath}${apiFunctionPath}`, formData);
      const response =  await fetchWithAuth(apiFunctionPath, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: formData, // Assuming `form` is the data to be sent
      });
      console.log(response); // Ensure you log the correct response object
      const insertedId = response.caseId || response.insertedId;
      const questions = response.insertedQuestions || [];

      //Assume the ChatGPT call is done asynchronously in the backend.
      setParentState({
        insertedQuestions: questions,
        questionTable: questions,
        showTable: true,
        insertedId: insertedId,
        caseId: insertedId,
        status: myConstClass.STATUS_NEW,
      });

      navigate("/Case", {
        state: { selectedRow: { id: insertedId } },
      });

      

      resetLoadingState();
    } catch (error) {
      console.error("Error during submission:", error);
      resetLoadingState();
    }
  };

  const styles = {
    container: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 7000, // Ensure the CircularProgress is above other elements
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Adjust the opacity
      zIndex: 6999, // Set a lower z-index for the backdrop
      backdropFilter: "blur(5px)", // Apply blur effect here
    },
  };

  return (
    <Box>
      {loadingState.isLoading && (
        <Box>
          <div style={styles.backdrop} />
          <div style={styles.container}>
            <CircularProgress
              variant="determinate"
              value={loadingState.value}
            />
            <Typography
              variant="body2"
              style={{ marginTop: "10px", color: "black" }}
            >
              {loadingState.loadingText}
            </Typography>
          </div>
        </Box>
      )}
      <Button
        variant="contained"
        style={{ marginLeft: "20px" }}
        onClick={handleSubmit}
        disabled={
          !state.createCasePage ||
          !(
            state.firstName !== "" &&
            state.lastName !== "" &&
            state.phoneNumber !== "" &&
            state.emailAddress !== "" &&
            state.inpFile !== "" &&
            state.selectedLawyer !== ""
          )
        }
      >
        Submit
      </Button>
    </Box>
  );
};

export default SubmitForm;