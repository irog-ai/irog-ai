import React from 'react';
import { Button, Grid } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

const ActionButtons = ({
  state,
  showAttestDialog,
  chatDialog,
  OpenWebLinkDialog,
  cancelDialog,
  completeDialog,
  myConstClass
}) => {
  return (
    <Grid item xs={12} style={{ marginBottom: "20px", textAlign: "left", marginLeft: "20px" }}>
      {state.questionTable.length > 0 && (
        <Button
          variant="outlined"
          onClick={showAttestDialog}
          disabled={
            !state.questionTable.every(x => x.subQuestions && x.subQuestions.length > 1) ||
            state.questionTable.every(x => !x.IsActive) ||
            state.status !== myConstClass.STATUS_NEW
          }
          startIcon={
            state.status !== myConstClass.STATUS_NEW && (
              <DoneIcon fontSize="small" style={{ color: "green" }} />
            )
          }
        >
          {state.status === myConstClass.STATUS_NEW ? "Select Questions" : "Questions Selected"}
        </Button>
      )}

      {state.questionTable.length > 0 && (
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
              <DoneIcon fontSize="small" style={{ color: "green" }} />
            )
          }
        >
          {!state.chatInitiatedForCase ? "Send by text" : "Text Sent"}
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
              <DoneIcon fontSize="small" style={{ color: "green" }} />
            )
          }
        >
          {!state.emailChannelInitiated ? "Send by WebLink" : "Re-send Weblink"}
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
              x => x.OriginalAnswer === null && x.IsActive === true
            ).length > 0 ||
            state.status === myConstClass.STATUS_CANCEL ||
            state.status === myConstClass.STAUS_COMPLETE
          }
        >
          COMPLETE
        </Button>
      )}
    </Grid>
  );
};

export default ActionButtons; 