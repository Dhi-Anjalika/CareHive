// src/pages/PatientDashboard.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import ProfileCard from "../components/ProfileCard";
import ReportsTable from "../components/ReportsTable";
import AppointmentsTable from "../components/AppointmentsTable";
import Timeline from "../components/Timeline";
import DoctorNotes from "../components/DoctorNotes";
import TrendsChart from "../components/TrendsChart";
import { Grid, Box } from "@mui/material";
import { patient } from "../data/mockPatient";

const menu = ["Profile", "Reports", "Appointments", "Timeline", "Doctor Notes"];

export default function PatientDashboard() {
  const [section, setSection] = useState("Profile");

  return (
    <Layout menuItems={menu} onMenuSelect={setSection} selected={section}>
      <Box sx={{ mb: 2 }}>
        {/* Header summary row */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><ProfileCard patient={patient} /></Grid>
          <Grid item xs={12} md={8}><TrendsChart data={patient.trends} /></Grid>
        </Grid>
      </Box>

      {/* Section content */}
      <Box>
        {section === "Profile" && <ProfileCard patient={patient} compact={false} />}
        {section === "Reports" && <ReportsTable reports={patient.reports} />}
        {section === "Appointments" && <AppointmentsTable appointments={patient.appointments} />}
        {section === "Timeline" && <Timeline events={patient.timeline} />}
        {section === "Doctor Notes" && <DoctorNotes initialNotes={patient.notes} />}
      </Box>
    </Layout>
  );
}
