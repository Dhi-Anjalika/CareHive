// src/components/AppointmentsTable.jsx
import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer, Chip } from "@mui/material";

export default function AppointmentsTable({ appointments = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map(a => (
            <TableRow key={a.id}>
              <TableCell>{a.date}</TableCell>
              <TableCell>{a.note}</TableCell>
              <TableCell>
                <Chip label={a.status} color={a.status === 'done' ? 'success' : 'primary'} size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
