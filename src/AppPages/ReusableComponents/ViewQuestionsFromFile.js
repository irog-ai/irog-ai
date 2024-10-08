import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const ViewQuestions = ({ open, onClose, questions }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="questions-dialog-title"
    >
      <DialogTitle id="questions-dialog-title">Questions List</DialogTitle>
      <DialogContent>
        <List>
          {questions.map((question, index) => (
            <ListItem key={index}>
              <ListItemText primary={index+1 + ")  " + question} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Button onClick={onClose} color="primary">
        Close
      </Button>
    </Dialog>
  );
};

// Define prop types for better clarity and type-checking
ViewQuestions.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ViewQuestions;
