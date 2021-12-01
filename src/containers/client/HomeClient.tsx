import {
  baseUrl,
  isAuthenticated,
  UserDecoded,
  WorkoutProgram,
  WorkoutPrograms,
} from "../../env";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClientNavBar } from "../../NavBars/ClientNavBar";
import { Box, Button, List, ListItem, ListItemText } from "@mui/material";

export function HomeClient() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const [allWorkouts, setAllWorkouts]: any = useState("");
  var user: UserDecoded | null;
  var authenticated: boolean = false;

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated("Client");
  } else {
    user = null;
  }

  useEffect(() => {
    if (!jwt || !authenticated) {
      console.error("Not authenticated redirecting to login");
      return navigate("/");
    }

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
          console.error(JSON.stringify(error));
        }
      );
  }, [authenticated, jwt, navigate, user]);

  if (allWorkouts && jwt && user) {
    if (allWorkouts.length === 1) {
      navigate("/client/workout-programs/" + allWorkouts[0].workoutProgramId);
      return <div></div>;
    } else {
      return (
        <>
          <div>
            <ClientNavBar name={user!.Name} />
          </div>
          <div className="list">
            <h1>Home client</h1>
            <h2>Here are your workouts: </h2>
            <Box display="flex" justifyContent="center" alignItems="center">
              <List
                sx={{
                  bgcolor: "white",
                  boxShadow: 7,
                  borderRadius: 4,
                  p: 2,
                  my: 2,
                  width: "75%",
                  height: "50%",
                }}
                style={{
                  maxHeight: "450px",
                  overflow: "auto",
                }}
              >
                {allWorkouts.map(function (workoutProgram: WorkoutProgram) {
                  return (
                    <Box
                      key={workoutProgram.workoutProgramId}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
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
                          component={Link}
                          to={
                            "/client/workout-programs/" +
                            workoutProgram.workoutProgramId
                          }
                        >
                          Show
                        </Button>
                      </ListItem>
                    </Box>
                  );
                })}
              </List>
            </Box>
          </div>
        </>
      );
    }
  } else {
    return (
      <div className="Clientanager">
        <ClientNavBar name={"Loading..."} />
        <h1>Home Client</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
