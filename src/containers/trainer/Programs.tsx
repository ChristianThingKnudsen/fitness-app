import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  baseUrl,
  isAuthenticated,
  UserDecoded,
  WorkoutProgram,
  WorkoutPrograms,
} from "../../env";
import jwt_decode from "jwt-decode";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";
import { Box, Button, List, ListItem, ListItemText } from "@mui/material";
import "../List.css";

export function Programs() {
  const [allPrograms, setAllPrograms]: any = useState("");

  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: UserDecoded | null;
  var authenticated: boolean = false;

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated("PersonalTrainer");
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
    fetch(baseUrl + "api/WorkoutPrograms", requestOptions)
      .then((res) => res.json())
      .then(
        (programs: WorkoutPrograms) => {
          setAllPrograms(programs);
        },
        (error) => {
          console.error(JSON.stringify(error));
        }
      );
  }, [authenticated, jwt, navigate]);

  function deleteProgram(uid: number) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/WorkoutPrograms/" + uid, requestOptions).then(
      (response) => {
        const newList = allPrograms.filter((program: WorkoutProgram) => {
          return program.workoutProgramId !== uid;
        });
        setAllPrograms(newList);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  if (allPrograms && jwt && user) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="list">
          <h1>Programs</h1>
          <h2>Here are all your programs </h2>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              color="primary"
              variant="contained"
              sx={{
                boxShadow: 7,
                borderRadius: 1,
                mx: 5,
              }}
              component={Link}
              to="/personal-trainer/workout-programs/create"
            >
              Create program
            </Button>
          </Box>
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
              {allPrograms.map(function (program: WorkoutProgram) {
                return (
                  <Box
                    key={program.workoutProgramId}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ListItem
                      key={program.workoutProgramId}
                      sx={{
                        bgcolor: "white",
                        boxShadow: 7,
                        borderRadius: 4,
                        p: 2,
                        maxWidth: "800px",
                        my: 2,
                      }}
                    >
                      <ListItemText primary={program.name} />
                      <Button
                        variant="contained"
                        component={Link}
                        to={
                          "/personal-trainer/workout-programs/" +
                          program.workoutProgramId
                        }
                        sx={{
                          mx: 2,
                        }}
                      >
                        Show
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => deleteProgram(program.workoutProgramId)}
                      >
                        Delete
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
  } else {
    return (
      <div className="programs">
        <TrainerNavBar name={"Loading..."} />
        <h1>Workout programs</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
