import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

function SideLabelTextField({
  label,
  helperText,
  error,
  sx = {},
  labelPosition = "top",
  fullWidth = true, // Ensure fullWidth property is set
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: labelPosition === "top" ? 'column' : 'row',
        alignItems: labelPosition === "top" ? 'flex-start' : 'center',
        width: fullWidth ? '100%' : 'auto', // Set full width by default
        ...sx,
        mb: 2, // Apply consistent margin-bottom
      }}
    >
      <Typography
        variant="body1"
        sx={{
          marginRight: labelPosition === "side" ? 2 : 0,
          marginBottom: labelPosition === "top" ? 1 : 0,
        }}
      >
        {label}
      </Typography>
      <TextField
        {...props}
        helperText={helperText}
        error={error}
        fullWidth
        sx={{
          flexGrow: labelPosition === "side" ? 1 : 'unset',
          ...sx,
        }}
        size="small"
      />
    </Box>
  );
}

export default SideLabelTextField;
