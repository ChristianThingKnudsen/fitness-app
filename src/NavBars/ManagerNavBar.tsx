import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { BrowserRouter, NavLink, Link } from "react-router-dom";

export function ManagerNavBar(props: any) {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        ></IconButton>
        <Typography variant="h6" color="inherit" component="div">
          {"Signed in as manager: " + props.name}
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            mx: 2,
          }}
          component={Link}
          to="/manager"
        >
          Home
        </Button>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
          }}
          component={Link}
          to="create-trainer"
        >
          Create trainer
        </Button>
      </Toolbar>
    </AppBar>
  );
}
