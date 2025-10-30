// src/components/AddNoteModal.jsx
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function AddNoteModal({ open, onClose, onSave }) {
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (note.trim() !== "") {
      onSave({ text: note, createdAt: new Date().toISOString() });
      setNote("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Doctor Note</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Note"
          fullWidth
          multiline
          minRows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
