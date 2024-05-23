import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { API } from "aws-amplify"; 

const myAPI = "api";
const path = "/getLawyers";

const LawyerInfo = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lawyerData, setLawyerData] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.get(myAPI, path);
      setLawyerData(response.recordset);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const createLawyer = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("FirstName", form.firstName);
      formData.append("LastName", form.lastName);
      formData.append("EmailId", form.email);

      await API.post(myAPI, "/addLawyer", {
        body: formData,
      });

      fetchData();
      setForm({ firstName: "", lastName: "", email: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteLawyer = async () => {
    try {
      setIsLoading(true);
      await API.post(myAPI, `/deleteLawyer/${selectedLawyer.Id}`, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      fetchData();
      closeDeleteConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirm = (lawyer) => {
    setSelectedLawyer(lawyer);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setSelectedLawyer(null);
    setDeleteConfirmOpen(false);
  };

  return (
    <Box >
        
      <form autoComplete="off" style={{ marginBottom: 20 }}>
        <TextField
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          sx={{ marginRight: 1 }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          sx={{ marginRight: 1 }}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          sx={{ marginRight: 1 }}
        />
        <Button variant="contained" onClick={createLawyer}>
          Create Lawyer
        </Button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lawyerData.map((lawyer) => (
                <TableRow key={lawyer.Id}>
                  <TableCell>{lawyer.FirstName}</TableCell>
                  <TableCell>{lawyer.LastName}</TableCell>
                  <TableCell>{lawyer.Email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openDeleteConfirm(lawyer)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this lawyer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm}>Cancel</Button>
          <Button onClick={confirmDeleteLawyer} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LawyerInfo;