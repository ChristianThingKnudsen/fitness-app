import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function TrainerNavBar(props: any) {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }
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
          {"Signed in as trainer: " + props.name}
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
          to="/personal-trainer"
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
          to="create-client"
        >
          Create client
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
          to="change-info"
        >
          Change info
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            ml: 2,
          }}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
