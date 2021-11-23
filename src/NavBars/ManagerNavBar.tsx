import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

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
        <Button color="inherit">
          <NavLink to="/manager">Home</NavLink>
        </Button>
        <Button color="inherit">
          <NavLink to="create-trainer">Create trainer</NavLink>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
