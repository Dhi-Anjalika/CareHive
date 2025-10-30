// src/components/Timeline.jsx
import React from "react";
import { List, ListItem, ListItemText, Paper } from "@mui/material";

export default function Timeline({ events = [] }) {
  return (
    <Paper sx={{ p: 2 }}>
      <List>
        {events.map((e, i) => (
          <ListItem key={i}>
            <ListItemText primary={e.text} secondary={e.date} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
