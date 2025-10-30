// src/components/DoctorNotes.jsx
import React, { useState } from "react";
import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import AddNoteModal from "./AddNoteModal";

export default function DoctorNotes({ initialNotes = [] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [open, setOpen] = useState(false);

  const handleSave = (note) => {
    setNotes(prev => [{ ...note }, ...prev]);
    setOpen(false);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Doctor Notes</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Note</Button>
      </Box>
      <List>
        {notes.map((n, i) => (
          <ListItem key={i} divider>
            <ListItemText primary={n.text} secondary={new Date(n.createdAt || Date.now()).toLocaleString()} />
          </ListItem>
        ))}
      </List>

      <AddNoteModal open={open} onClose={()=>setOpen(false)} onSave={handleSave} />
    </Paper>
  );
}
