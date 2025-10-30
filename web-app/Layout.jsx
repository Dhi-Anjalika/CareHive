// src/components/Layout.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItemButton, Box, Avatar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 220;

export default function Layout({ children, menuItems = [], onMenuSelect, selected }) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1300, bgcolor: "primary.main" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit"><MenuIcon /></IconButton>
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>Family Medical Tracker</Typography>
          <Typography sx={{ mr: 2 }}>Dr. Smith</Typography>
          <Avatar sx={{ bgcolor: "secondary.main" }}>D</Avatar>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{ width: drawerWidth, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", pt: 8 } }}
      >
        <List>
          {menuItems.map((m) => (
            <ListItemButton key={m} selected={selected === m} onClick={() => onMenuSelect(m)}>
              {m}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
