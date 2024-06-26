import React from "react";
import { Box, CircularProgress } from "@mui/material";

function Loading() {
  const styles = {
    container: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 7000, // ensure CircularProgress is above other elements
    },
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Adjust the opacity to make the background content visible
      zIndex: 6999, // set a lower z-index for the backdrop
    },
  };

  return (
    <Box>
      <div style={styles.backdrop} />
      <div style={styles.container}>
        <CircularProgress />
      </div>
    </Box>
  );
}

export default Loading