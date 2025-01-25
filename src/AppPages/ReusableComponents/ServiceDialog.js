import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import ServiceFileGenerator from "./ServiceFileWordGenerator";

const ServiceDialog = ({ open, handleClose, data, handleDownload, lawyerId }) => {
  //   let data = {
  //     courtName: "",
  //     caseNumber: "",
  //     division: "",
  //     plaintiffs: "",
  //     defendants: "",
  //     noticeHeading: "",
  //     noticeMatter: "",
  //     signature1: "",
  //     signature2: "",
  //     lawyers: "",
  //     certificateText: "",
  //   };

  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Document Details</DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: 3, textAlign: "center" }}>
          <Grid container justifyContent="space-between">
            <Grid item xs={2} />
            <Grid item xs={8}>
              <TextField
                variant="outlined"
                margin="normal"
                name="courtName"
                label="Court Name"
                fullWidth
                value={formData.courtName || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <Grid container justifyContent="space-between">
            <Grid item xs={8} />
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                margin="normal"
                name="caseNumber"
                label="Case No."
                fullWidth
                value={formData.caseNumber || ""}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                name="division"
                label="Division"
                fullWidth
                value={formData.division || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6} sx={{ paddingRight: 2 }}>
              <TextField
                variant="outlined"
                margin="normal"
                name="plaintiffs"
                label="Plaintiffs"
                fullWidth
                size="small"
                value={formData.plaintiffs || ""}
                onChange={handleChange}
              />
              <Typography variant="body2">Plaintiffs</Typography>
              <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                vs
              </Typography>
              <TextField
                variant="outlined"
                margin="normal"
                name="defendants"
                label="Defendants"
                fullWidth
                size="small"
                value={formData.defendants || ""}
                onChange={handleChange}
              />
              <Typography variant="body2">Defendants</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          {/* <Typography variant="h6" align="center">
            Notice
          </Typography> */}
          <TextField
            variant="outlined"
            margin="normal"
            name="noticeHeading"
            label="Notice Heading"
            fullWidth
            value={formData.noticeHeading || ""}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="noticeMatter"
            label="Notice Matter"
            multiline
            rows={4}
            fullWidth
            value={formData.noticeMatter || ""}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} />
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                name="signature1"
                label="Signature 1"
                fullWidth
                value={formData.signature1 || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                name="lawyers"
                label="Lawyers"
                fullWidth
                multiline
                rows={4}
                value={formData.lawyers || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h6" align="center">
            CERTIFICATE OF SERVICE
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            name="certificateText"
            label="Certificate of Service Matter"
            multiline
            rows={4}
            fullWidth
            value={formData.certificateText || ""}
            onChange={handleChange}
          />
        </Box>
        <Box>
          <Grid container justifyContent="space-between">
            <Grid item xs={6} />
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                name="signature2"
                label="Signature 2"
                fullWidth
                value={
                  formData.signature2 === "not found" ? "" : formData.signature2
                }
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" style={{ marginLeft: "20px" }}>
          Cancel
        </Button>
        {/* Uncomment and implement download functionality */}
        {/* <Button onClick={() => handleDownload(formData)} color="primary">
          Download
        </Button> */}
        <ServiceFileGenerator formData={formData} handleDownload={handleDownload} lawyerId={lawyerId} />
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDialog;
