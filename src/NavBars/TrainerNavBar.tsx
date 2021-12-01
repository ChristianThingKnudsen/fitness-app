import { AppBar, Button, Toolbar, Typography } from "@mui/material";
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
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          sx={{
            mr: 3,
          }}
        >
          {"Signed in as trainer: " + props.name}
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            mx: 1,
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
            mx: 1,
          }}
          component={Link}
          to="/personal-trainer/create-client"
        >
          Create client
        </Button>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            mx: 1,
          }}
          component={Link}
          to="/personal-trainer/change-info"
        >
          Change info
        </Button>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            mx: 1,
          }}
          component={Link}
          to="/personal-trainer/exercises"
        >
          Exercises
        </Button>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            mx: 1,
          }}
          component={Link}
          to="/personal-trainer/workout-programs"
        >
          Programs
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            ml: 4,
          }}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
