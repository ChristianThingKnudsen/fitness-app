import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  baseUrl,
  Exercise,
  Exercises,
  isAuthenticated,
  UserDecoded,
} from "../../env";
import jwt_decode from "jwt-decode";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";
import { Box, Button, List, ListItem, ListItemText } from "@mui/material";
import "../List.css";

export function ExercisesPage() {
  const [allExercises, setAllExercises]: any = useState("");

  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: UserDecoded | null;
  var authenticated: boolean;

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated("PersonalTrainer");
  } else {
    user = null;
  }

  useEffect(() => {
    if (jwt) {
      if (!authenticated) {
        console.log("auth");
        return navigate("/");
      }
    } else {
      console.log("Not auth");
      return navigate("/");
    }

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/Exercises", requestOptions)
      .then((res) => res.json())
      .then(
        (exercises: Exercises) => {
          setAllExercises(exercises);
        },
        (error) => {
          console.log(JSON.stringify(error));
        }
      );
  }, []);

  function deleteExercise(uid: number) {
    console.log("URL delete: " + baseUrl + "api/Exercises/" + uid);

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/Exercises/" + uid, requestOptions).then(
      (response) => {
        console.log("Response delete: " + JSON.stringify(response));
        const newList = allExercises.filter((exercise: Exercise) => {
          return exercise.exerciseId !== uid;
        });
        setAllExercises(newList);
      },
      (error) => {
        console.log("Error delete: " + error);
      }
    );
  }

  if (allExercises && jwt && user) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="list">
          <h1>Exercises</h1>
          <h2>Here are all the exercises </h2>
          <Button
            color="primary"
            variant="contained"
            sx={{
              boxShadow: 7,
              borderRadius: 1,
              mx: 5,
            }}
            component={Link}
            to="/personal-trainer/exercises/create"
          >
            Create exercise
          </Button>
          <List
            sx={{
              bgcolor: "white",
              boxShadow: 7,
              borderRadius: 4,
              p: 2,
              my: 2,
            }}
            style={{ maxHeight: "1000px", overflow: "auto" }}
          >
            {allExercises.map(function (exercise: Exercise) {
              return (
                <ListItem
                  key={exercise.exerciseId}
                  sx={{
                    bgcolor: "white",
                    boxShadow: 7,
                    borderRadius: 4,
                    p: 2,
                    maxWidth: "800px",
                    my: 2,
                  }}
                >
                  <ListItemText primary={exercise.name} />
                  <Button
                    variant="contained"
                    component={Link}
                    to={"/personal-trainer/exercises/" + exercise.exerciseId}
                    sx={{
                      mx: 2,
                    }}
                  >
                    Show
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => deleteExercise(exercise.exerciseId)}
                  >
                    Delete
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </div>
      </>
    );
  } else {
    return (
      <div className="exercises">
        <TrainerNavBar name={"Loading..."} />
        <h1>Exercises</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
