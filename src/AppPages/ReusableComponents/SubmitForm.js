import React, { useState } from "react";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { API, Auth } from "aws-amplify";
import Loading from "./Loading"; // Ensure this imports your custom Loading component correctly

const SubmitForm = ({ myAPI, myConstClass, state, setParentState }) => {
  const [loadingState, setLoadingState] = useState({
    value: 0,
    loadingText: "",
    isLoading: false,
  });

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
      loadingText: "Creating case...",
    });

    try {
      console.log(state.caseNumber);
      const user = await Auth.currentAuthenticatedUser();

      // Populate formData
      const formData = new FormData();
      formData.append("loggedInuser", user.username);
      formData.append("loggedInuseremail", user.attributes.email);
      formData.append("FirstName", state.firstName);
      formData.append("LastName", state.lastName);
      formData.append("MiddleName", state.middleName);
      formData.append("PhoneNumber", state.phoneNumber);
      formData.append("EmailId", state.emailAddress);
      formData.append("CaseId", state.caseNumber);
      formData.append("serviceFileData",state.serviceFileData);
      formData.append("s3BucketFileName", state.s3bucketfileName);
      formData.append("s3BucketServiceFileName", state.s3BucketServiceFileName);
      formData.append("Status", myConstClass.STATUS_NEW);
      formData.append("selectedLawyerId", state.selectedLawyer);

      // Step 1: Submit case
      const response = await API.post(myAPI, "/submitcase", { body: formData });
      console.log(response); 
      const insertedId = response.caseId;
      setLoadingState({
        isLoading: true,
        value: 40,
        loadingText: "Inserting questions...",
      });

      // Step 2: Insert questions
      const insertObj = state.questions.map((question, index) => [
        insertedId,
        question,
        index+1,
      ]);
      formData.append("insertObj", JSON.stringify(insertObj));
      await API.post(myAPI, "/insertquestions", { body: formData });

      setLoadingState({
        isLoading: true,
        value: 70,
        loadingText: "Retrieving questions...",
      });

      // Step 3: Get questions
      const resultset = await API.get(myAPI, `/getQuestions/${insertedId}`);
      const insertedQuestions = resultset.recordsets[1];

      setLoadingState({
        isLoading: true,
        value: 90,
        loadingText: "Performing ChatGPT call...",
      });

      // Step 4: Call ChatGPT asynchronously
      API.get(myAPI, `/Chatgptcall/${insertedId}`);

      resetLoadingState();

      setParentState({
        insertedQuestions: insertedQuestions,
        questionTable: insertedQuestions,
        showTable: true,
        insertedId: insertedId,
        caseId: insertedId,
        status: myConstClass.STATUS_NEW,
      });
    } catch (error) {
      console.error("Error during submission:", error);
      resetLoadingState(); // Ensure loading state is reset on error
    }
  };
  const styles = {
    container: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 7000, // Ensure the CircularProgress is above other elements
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the opacity
        zIndex: 6999, // Set a lower z-index for the backdrop
        backdropFilter: 'blur(5px)', // Apply blur effect here
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
          <Typography variant="body2" style={{ marginTop: '10px', color: 'black' }}>
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
