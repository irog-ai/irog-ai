import React from 'react';
import { Grid, TextField, Box, FormControl, InputLabel, Select } from '@mui/material';

const ClientDetails = ({ state, handleChange, isDisabled }) => {
  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={4}>
        <TextField
          id="firstName"
          name="firstName"
          label="First Name"
          variant="outlined"
          onChange={handleChange}
          value={state.firstName}
          disabled={isDisabled}
          style={{ width: "90%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="middleName"
          name="middleName"
          label="Middle Name"
          variant="outlined"
          onChange={handleChange}
          value={state.middleName ? state.middleName : ""}
          disabled={isDisabled}
          style={{ width: "90%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="lastName"
          name="lastName"
          label="Last Name"
          variant="outlined"
          onChange={handleChange}
          value={state.lastName}
          disabled={isDisabled}
          style={{ width: "90%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          variant="outlined"
          onChange={handleChange}
          value={state.phoneNumber}
          disabled={isDisabled}
          style={{ width: "90%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="emailAddress"
          name="emailAddress"
          label="Email Address"
          variant="outlined"
          onChange={handleChange}
          value={state.emailAddress}
          disabled={isDisabled}
          style={{ width: "90%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ minWidth: 120, marginLeft: "20px" }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="lawyer-select-label">Lawyer</InputLabel>
            <Select
              labelId="lawyer-select-label"
              id="LawyerId"
              name="LawyerId"
              value={state.LawyerId}
              onChange={handleChange}
              label="Lawyer"
              displayEmpty
              sx={{ width: "95%" }}
              disabled={isDisabled}
            >
              {state.LawyersList}
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ClientDetails; 