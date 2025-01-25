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
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ViewQuestions = ({ open, onClose, questions }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Questions from File
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText 
                  primary={`${index + 1}) ${question.question || question}`}
                  sx={{ fontWeight: 'bold' }}
                />
              </ListItem>
              {question.subQuestions && question.subQuestions.length > 0 && (
                <List sx={{ pl: 4 }}>
                  {question.subQuestions.map((subQ, subIndex) => (
                    <ListItem key={`${index}-${subIndex}`}>
                      <ListItemText 
                        primary={`${String.fromCharCode(97 + subIndex)}) ${subQ}`}
                        sx={{ fontSize: '0.9em' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
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
