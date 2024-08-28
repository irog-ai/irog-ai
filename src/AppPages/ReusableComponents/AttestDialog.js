import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AttestDialog(props) {
  let date = new Date().toLocaleDateString("en-US");
  return (
    <React.Fragment>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Select Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please confirm that you have selected the interrogatories you want your client to respond to before proceeding as of:
          </DialogContentText>
          {/* <DialogContentText>
            Yes I attest all the interrogatories have been selected correctl
            date as of:
          </DialogContentText> */}

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Date"
            type="text"
            fullWidth
            variant="standard"
            disabled={true}
            value={date}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleAttestation}>Continue</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
