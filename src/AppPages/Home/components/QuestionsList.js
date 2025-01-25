import React from 'react';
import { Grid, Typography, Button, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import QuestionsTable from '../../ReusableComponents/QuestionsTable';
import ServiceFileGenerator from '../../ReusableComponents/ServiceFileWordGenerator';
import DocumentGenerator from '../../ReusableComponents/WordGenerator';

const QuestionsList = ({
  state,
  handleDownload,
  refresh,
  viewResponse,
  handleCheckboxChange,
  changeIsLoading,
  showExceptionOnPage,
  myConstClass
}) => {
  return (
    <Grid container alignItems="center" style={{ marginTop: "20px" }}>
      <Grid item xs={3}>
        <Typography variant="h6" gutterBottom>
          Irog List
        </Typography>
      </Grid>
      <Grid item xs={9} style={{ display: "flex", justifyContent: "flex-end" }}>
        {state.questionTable.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => handleDownload(state.s3bucketfileName, false, "")}
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
  );
};

export default QuestionsList; 