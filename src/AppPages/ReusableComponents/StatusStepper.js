import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import * as myConstClass from "../../Util/Constants";

export default function StatusStepper(props) {
  let steps = [
    myConstClass.STATUS_NEW,
    myConstClass.STATUS_ATTESTED,
    myConstClass.STATUS_AWAITING,
    myConstClass.STAUS_COMPLETE,
  ];
  let activeStep = 0;
  if (props.cancelQueue !== "" && props.cancelQueue !== undefined) {
    steps = props.cancelQueue.split(",");
    activeStep = steps.length - 1;
  } else {
    console.log("STATUS" + props.status);
    switch (props.status) {
      case myConstClass.STATUS_NEW:
        activeStep = 0;
        break;
      case myConstClass.STATUS_ATTESTED:
        activeStep = 1;
        break;
      case myConstClass.STATUS_AWAITING:
        activeStep = 2;
        break;
      case myConstClass.STAUS_COMPLETE:
        activeStep = 3;
        break;
    }
  }

  const getLabel = (label) => {
    console.log(label);
    switch(label){
      case myConstClass.STATUS_AWAITING:
        return "QUESTIONS SENT";
      case myConstClass.STATUS_ATTESTED:
        return "QUESTIONS SELECTED";
      default:
        return label;
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{getLabel(label)}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
