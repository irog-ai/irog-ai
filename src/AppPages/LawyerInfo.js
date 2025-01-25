import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import {
  AddCircleOutline,
  Edit,
  Delete,
  RemoveCircleOutline,
} from "@mui/icons-material";
import ShowExceptionDialog from "./ReusableComponents/UIComponents/ErrorComponent";
import { fetchWithAuth } from "../Util/fetchWithAuth";

import { usStates } from "../Util/Constants";

const LawyerInfo = () => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    documentReviewEmails: "",
    pleadingEmails: "",
    pleadingPhone: "",
    pleadingFax: "",
    pleadingBarNumbers: [{ state: "", barNumber: "" }],
    pleadingAddress: {
      street1: "",
      street2: "",
      city: "",
      zipCode: "",
      state: "",
    },
  });

  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    documentReviewEmails: '',
    pleadingEmails: '',
    pleadingPhone: '',
    pleadingFax: '',
    pleadingBarNumbers: [],
    pleadingAddress: {
      street1: '',
      street2: '',
      city: '',
      zipCode: '',
      state: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lawyerData, setLawyerData] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showExceptionDialog, setShowExceptionDialog] = useState(false);
  const [editingLawyerId, setEditingLawyerId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state to toggle form visibility

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    setIsLoading(true);
    const apiFunctionPath = "lawyers/getLawyers";
    try {
      const response = await fetchWithAuth(apiFunctionPath);
      setLawyerData(response);
    } catch (error) {
      setShowExceptionDialog(true);
      console.error("Error fetching lawyers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, prefix = "") => {
    const { name, value } = e.target;
    const fieldName = prefix ? `${prefix}.${name}` : name;
    if (name.includes("pleadingAddress")) {
      setForm((prev) => ({
        ...prev,
        pleadingAddress: {
          ...prev.pleadingAddress,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    validateField(fieldName, value);
  };

  const handleBarNumberChange = (index, field, value) => {
    const newBarNumbers = form.pleadingBarNumbers.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setForm({ ...form, pleadingBarNumbers: newBarNumbers });
  };

  const addBarNumber = () => {
    setForm((prev) => ({
      ...prev,
      pleadingBarNumbers: [
        ...prev.pleadingBarNumbers,
        { state: "", barNumber: "" },
      ],
    }));
  };

  const removeLastBarNumber = () => {
    setForm((prev) => {
      // Ensure there is at least one item to remove
      if (prev.pleadingBarNumbers.length > 1) {
        return {
          ...prev,
          pleadingBarNumbers: prev.pleadingBarNumbers.slice(0, -1), // Remove the last item
        };
      }
      return prev; // Do nothing if there's only one item left
    });
  };

  const validateField = (name, value, index = null) => {
    const newErrors = { ...errors }; // Copy current errors state
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numericRegex = /^\d+$/;
  
    switch (name) {
      case "firstName":
      case "middleName":
      case "lastName":
        newErrors[name] = nameRegex.test(value)
          ? ""
          : "Only letters and spaces allowed";
        break;
      case "documentReviewEmails":
      case "pleadingEmails":
        // Split the input by commas and validate each email
        const emails = value.split(',').map(email => email.trim());
        const invalidEmail = emails.find(email => !emailRegex.test(email));
        newErrors[name] = invalidEmail ? "One or more emails are invalid" : "";
        break;
      case "pleadingPhone":
        newErrors[name] =
          numericRegex.test(value) && value.length === 10
            ? ""
            : "Must be a 10-digit number";
        break;
      case "pleadingFax":
        newErrors[name] =
          numericRegex.test(value) || value === "" ? "" : "Must be a number";
        break;
      case "pleadingBarNumbers":
        if (index !== null) {
          if (!value.state.trim()) {
            newErrors.pleadingBarNumbers[index] = "State is required";
          } else if (!numericRegex.test(value.barNumber) || !value.barNumber.trim()) {
            newErrors.pleadingBarNumbers[index] = "Must be a numeric value";
          } else {
            newErrors.pleadingBarNumbers[index] = "";
          }
        }
        break;
      case "pleadingAddress.street1":
      case "pleadingAddress.city":
      case "pleadingAddress.state":
        newErrors.pleadingAddress[name.split(".")[1]] = value.trim()
          ? ""
          : "This field is required";
        break;
      case "pleadingAddress.zipCode":
        newErrors.pleadingAddress.zipCode =
          numericRegex.test(value) && value.length === 5
            ? ""
            : "Must be a 5-digit number";
        break;
      // Add more cases if needed
      default:
        break;
    }
  
    setErrors(newErrors); // Update errors state
  };
  

  const createOrUpdateLawyer = async () => {
    setIsLoading(true);
    const apiFunctionPath = editingLawyerId
      ? `lawyers/updateLawyer/${editingLawyerId}`
      : "lawyers/addLawyer";

    try {
      const method = editingLawyerId ? "put" : "post"; // Determine HTTP method
      console.log(editingLawyerId ? "edit method" : "add method");

      // Use fetchWithAuth for API requests with appropriate method and data
      await fetchWithAuth(apiFunctionPath, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        data: form, // Assuming `form` is the data to be sent
      });

      await fetchLawyers(); // Call to refresh the list of lawyers
      resetForm(); // Reset form state
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating or updating lawyer:", error);
      setShowExceptionDialog(true); // Display an error dialog or message
    } finally {
      setIsLoading(false);
      setEditingLawyerId(null);
    }
  };

  const startEditingLawyer = (lawyer) => {
    setEditingLawyerId(lawyer.id);
    setForm(lawyer);
    setIsEditing(true); // Show the form for editing
  };

  const startAddingLawyer = () => {
    resetForm();
    setEditingLawyerId(0); // Indicate a new lawyer is being added
    setIsEditing(true); // Show the form for adding
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      middleName: "",
      documentReviewEmails: "",
      pleadingEmails: "",
      pleadingPhone: "",
      pleadingFax: "",
      pleadingBarNumbers: [{ state: "", barNumber: "" }],
      pleadingAddress: {
        street1: "",
        street2: "",
        city: "",
        zipCode: "",
        state: "",
      },
    });
  };

  const confirmDeleteLawyer = async () => {
    if (!selectedLawyer) return; // Ensure there is a lawyer selected for deletion
    setIsLoading(true);
    const apiFunctionPath = "lawyers/deleteLawyer";

    try {
      // Use fetchWithAuth for the DELETE request
      await fetchWithAuth(`${apiFunctionPath}/${selectedLawyer.id}`, {
        method: "delete",
      });

      await fetchLawyers(); // Refresh the list of lawyers
      closeDeleteConfirm(); // Close the delete confirmation dialog
      resetForm(); // Reset form state if necessary
    } catch (error) {
      setShowExceptionDialog(true); // Display an error dialog
      console.error("Error deleting lawyer:", error);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const isFormValid = () => {
    const noErrors = Object.values(errors).every(err => {
      if (typeof err === 'string') {
        return err === '';
      }
      // For nested error fields, like pleadingAddress
      return Object.values(err).every(nestedErr => nestedErr === '');
    });
  
    const allFieldsFilled =
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.pleadingEmails.trim() &&
      form.pleadingPhone.trim() &&
      // Check bar numbers (each should have a state and numeric barNumber)
      form.pleadingBarNumbers.every(
        entry => entry.state.trim() && entry.barNumber.trim()
      ) &&
      form.pleadingAddress.street1.trim() &&
      form.pleadingAddress.city.trim() &&
      form.pleadingAddress.zipCode.trim() && 
      form.pleadingAddress.state.trim();
  
    return noErrors && allFieldsFilled;
  };
  

  const openDeleteConfirm = (lawyer) => {
    setSelectedLawyer(lawyer);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setSelectedLawyer(null);
    setDeleteConfirmOpen(false);
  };

  const displayLawyerDetails = (lawyer) => {
    setForm(lawyer);
  };

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
      {showExceptionDialog && <ShowExceptionDialog />}
      {isEditing ? (
        // <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Lawyer Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.firstName} // Boolean for error prop
                  helperText={errors.firstName} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Middle Name"
                  name="middleName"
                  value={form.middleName}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.middleName} // Boolean for error prop
                  helperText={errors.middleName} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.lastName} // Boolean for error prop
                  helperText={errors.lastName} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Document-review Emails"
                  name="documentReviewEmails"
                  value={form.documentReviewEmails}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.documentReviewEmails} // Boolean for error prop
                  helperText={errors.documentReviewEmails??"Comma-separated"} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pleading-eService Emails"
                  name="pleadingEmails"
                  value={form.pleadingEmails}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingEmails} // Boolean for error prop
                  helperText={errors.pleadingEmails??"Comma-separated"} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pleading Phone"
                  name="pleadingPhone"
                  value={form.pleadingPhone}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingPhone} // Boolean for error prop
                  helperText={errors.pleadingPhone??"10 digits"} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pleading Fax"
                  name="pleadingFax"
                  value={form.pleadingFax}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingFax} // Boolean for error prop
                  helperText={errors.pleadingFax} // Display error message
                />
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Bar Numbers
          </Typography>
          {form.pleadingBarNumbers.map((pbn, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="State"
                  value={pbn.state}
                  onChange={(e) =>
                    handleBarNumberChange(index, "state", e.target.value)
                  }
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                >
                  {usStates.map((state, idx) => (
                    <MenuItem key={idx} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Bar Number"
                  value={pbn.barNumber}
                  onChange={(e) =>
                    handleBarNumberChange(index, "barNumber", e.target.value)
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingBarNumbers[index]} // Set error prop
                  helperText={errors.pleadingBarNumbers[index]} // Display error message
                />
              </Grid>
            </Grid>
          ))}
          <IconButton onClick={addBarNumber} color="primary" sx={{ mt: 2 }}>
            <AddCircleOutline />
          </IconButton>
          <IconButton
            disabled={form.pleadingBarNumbers.length < 2}
            onClick={removeLastBarNumber}
            color="primary"
            sx={{ mt: 2 }}
          >
            <RemoveCircleOutline />
          </IconButton>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Pleading Address</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Street 1"
                  name="pleadingAddress.street1"
                  value={form.pleadingAddress.street1}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingAddress.street1} // Boolean for error prop
                  helperText={errors.pleadingAddress.street1} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Street 2"
                  name="pleadingAddress.street2"
                  value={form.pleadingAddress.street2}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingAddress.street2} // Boolean for error prop
                  helperText={errors.pleadingAddress.street2} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="City"
                  name="pleadingAddress.city"
                  value={form.pleadingAddress.city}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingAddress.city} // Boolean for error prop
                  helperText={errors.pleadingAddress.city} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Zip Code"
                  name="pleadingAddress.zipCode"
                  value={form.pleadingAddress.zipCode}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingAddress.zipCode} // Boolean for error prop
                  helperText={errors.pleadingAddress.zipCode??"5 digits"} // Display error message
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="State"
                  name="pleadingAddress.state"
                  value={form.pleadingAddress.state}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  size="small"
                  disabled={editingLawyerId === null}
                  error={!!errors.pleadingAddress.state} // Boolean for error prop
                  helperText={errors.pleadingAddress.state} // Display error message
                >
                  {usStates.map((state, idx) => (
                    <MenuItem key={idx} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button
              onClick={createOrUpdateLawyer}
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
              disabled={!isFormValid()}
            >
              Save
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      ) : (
        //</Grid>
        // </Grid>
        <>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={startAddingLawyer}
          >
            Add Lawyer
          </Button>
          {/* Render Grid */}
          <Grid item xs={12}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                List of Lawyers
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lawyerData.map((lawyer) => (
                      <TableRow key={lawyer.id}>
                        <TableCell>
                          <Button
                            color="primary"
                            onClick={() => startEditingLawyer(lawyer)}
                          >
                            {lawyer.firstName +
                              " " +
                              lawyer.middleName +
                              " " +
                              lawyer.lastName}
                          </Button>
                        </TableCell>
                        <TableCell>{lawyer.pleadingEmails}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => startEditingLawyer(lawyer)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => openDeleteConfirm(lawyer)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </>
      )}

      <Dialog open={deleteConfirmOpen} onClose={closeDeleteConfirm}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this lawyer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteLawyer} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LawyerInfo;
