// src/components/ProfileCard.jsx
import React from "react";
import { Card, CardContent, Typography, Avatar, Chip, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function ProfileCard({ patient }) {
  if (!patient) return null;

  return (
    <Card sx={{ minHeight: 180 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "secondary.main", width: 72, height: 72 }}><PersonIcon /></Avatar>
          <div>
            <Typography variant="h6">{patient.name}</Typography>
            <Typography color="textSecondary">Age: {patient.age} • Blood: {patient.bloodGroup}</Typography>
            <Typography color="textSecondary">Contact: {patient.phone}</Typography>
          </div>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
          {patient.allergies.map((a,i) => <Chip key={i} label={`Allergy: ${a}`} color="error" size="small" sx={{ mr: 1, mb: 1 }} />)}
          {patient.conditions.map((c,i) => <Chip key={i} label={c} color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />)}
        </Stack>
      </CardContent>
    </Card>
  );
}
