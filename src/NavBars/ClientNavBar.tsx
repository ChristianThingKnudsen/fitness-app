import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { BrowserRouter, NavLink, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function ClientNavBar(props: any) {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div" sx={{ mr: 3 }}>
          {"Signed in as client: " + props.name}
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
          to="/client"
        >
          Home
        </Button>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            mx: 2,
          }}
          component={Link}
          to="/client/change-info"
        >
          Change info
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            ml: 22,
          }}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
