// src/pages/PatientSearch.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PatientSearch() {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <Paper sx={{ p: 4, width: 520 }}>
        <Typography variant="h5" gutterBottom>Patient Access</Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          Enter Patient ID shared by patient or scan QR code
        </Typography>

        <TextField label="Enter Patient ID" value={id} onChange={(e)=>setId(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={() => navigate("/dashboard")}>
          Search
        </Button>

        <Button variant="outlined" fullWidth>Scan QR Code (placeholder)</Button>
      </Paper>
    </Box>
  );
}
