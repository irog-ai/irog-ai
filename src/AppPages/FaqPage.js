import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

export default function Faq() {
  return (
    <div>
        <Typography style={{textAlign:"center", color:"#1b597c", fontFamily:"Catamaran", marginTop:"20px"}} variant="h3" gutterBottom>
        Frequently asked Questions
      </Typography>
    <Box component="section" style={{margin:"3%"}} sx={{ p: 2 }}>
      
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Question 1
        </AccordionSummary>
        <AccordionDetails>Answer 1</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          Question 2
        </AccordionSummary>
        <AccordionDetails>Answer 2</AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          Question 3
        </AccordionSummary>
        <AccordionDetails>Answer 3</AccordionDetails>
      </Accordion>
    </Box>
    </div>
  );
}
