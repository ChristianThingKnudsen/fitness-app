import {
  baseUrl,
  isAuthenticated,
  UserDecoded,
  WorkoutProgram,
  WorkoutPrograms,
} from "../../env";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientNavBar } from "../../NavBars/ClientNavBar";
import { Box, Button, List, ListItem, ListItemText } from "@mui/material";

export function HomeClient() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: UserDecoded;
  if (jwt != null) {
    user = jwt_decode(jwt);
    const authenticated: boolean = isAuthenticated(user!.Role);
    if (!authenticated) {
      navigate("/");
    }
  }
  const [allWorkouts, setAllWorkouts]: any = useState("");

  function show(id: number) {
    // TODO: Add some code here for  showing workout program.
  }

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(
      baseUrl + "api/WorkoutPrograms/client/" + user!.UserId,
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (workoutPrograms: WorkoutPrograms) => {
          setAllWorkouts(workoutPrograms);
        },
        (error) => {
          console.log(JSON.stringify(error));
        }
      );
  }, []);

  if (allWorkouts != null && allWorkouts != "") {
    return (
      <div className="HomeClient">
        <ClientNavBar name={user!.Name} />
        <h1>Home Manager</h1>
        <div>Here are all your workouts: </div>
        <Box
          // alignItems="center"
          // display="flex"
          width={500}
          height={80}

          // sx={{ width: "100%", maxWidth: 500, bgcolor: "red" }}
        >
          {/* disablePadding */}
          <List>
            {allWorkouts.map(function (workoutProgram: WorkoutProgram) {
              return (
                <ListItem
                  key={workoutProgram.workoutProgramId}
                  sx={{
                    bgcolor: "white",
                    boxShadow: 7,
                    borderRadius: 4,
                    p: 2,
                    mx: 5,
                    my: 2,
                  }}
                >
                  <ListItemText primary={workoutProgram.name} />
                  <Button
                    variant="contained"
                    sx={{
                      boxShadow: 7,
                      borderRadius: 1,
                      mx: 2,
                    }}
                    onClick={() => show(workoutProgram.workoutProgramId)}
                  >
                    Show
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </div>
    );
  } else {
    return (
      <div className="Clientanager">
        <ClientNavBar name={user!.Name} />
        <h1>Home Client</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
