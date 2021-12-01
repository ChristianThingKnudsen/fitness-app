import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  baseUrl,
  Exercise,
  Exercises,
  isAuthenticated,
  User,
  UserDecoded,
} from "../../env";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../Form.css";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, OnChangeValue } from "react-select";

export function CreateProgram() {
  const [pName, setPName] = useState("");
  const [description, setDescription] = useState("");

  const [allExercises, setAllExercises]: any = useState("");
  const [programExercises, setProgramExercises]: any = useState("");

  const [allClients, setAllClients]: any = useState("");
  const [programClientId, setProgramClientId]: any = useState("");

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

    const requestOptionsExercises = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/Exercises", requestOptionsExercises)
      .then((res) => res.json())
      .then(
        (exercises: Exercises) => {
          setAllExercises(exercises);
        },
        (error) => {
          console.error(JSON.stringify(error));
        }
      );

    const requestOptionsClients = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/Users/Clients", requestOptionsClients)
      .then((res) => res.json())
      .then(
        (response) => {
          setAllClients(response);
        },
        (error) => {
          console.error(JSON.stringify(error));
        }
      );
  }, [authenticated, jwt, navigate]);

  function handleChangeExercises(
    newValue: OnChangeValue<any, true>,
    actionMetaData: ActionMeta<Exercise>
  ) {
    var tempExercises: Exercises = [];

    for (const item of newValue) {
      item.value.exerciseId = 0;
      tempExercises.push(item.value);
    }
    setProgramExercises(tempExercises);
  }

  function handleChangeClient(newValue: any, actionMetaData: any) {
    setProgramClientId(newValue.value);
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: pName,
        description: description,
        exercises: programExercises,
        personalTrainerId: Number(user?.UserId),
        clientId: programClientId,
      }),
    };
    fetch(baseUrl + "api/WorkoutPrograms", requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          navigate("/personal-trainer/workout-programs");
        },
        (error) => {
          console.error(JSON.stringify(error));
        }
      );
  }

  function validateForm() {
    return (
      pName.length > 0 &&
      description.length > 0 &&
      programExercises.length > 0 &&
      programClientId.toString().length > 0
    );
  }

  if (jwt && user && allExercises && allClients) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Create workout program</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="Name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="name"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="Description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Label>Exercises</Form.Label>
            <CreatableSelect
              isMulti
              isValidNewOption={() => false}
              onChange={handleChangeExercises}
              options={allExercises.map((exercise: Exercise) => ({
                label: exercise.name,
                value: exercise,
              }))}
            />
            <Form.Label>Client</Form.Label>
            <CreatableSelect
              isValidNewOption={() => false}
              onChange={handleChangeClient}
              options={allClients.map((client: User) => ({
                label: client.firstName + " " + client.lastName,
                value: client.userId,
              }))}
            />
            <br />
            <Button
              variant="contained"
              type="submit"
              disabled={!validateForm()}
              sx={{
                boxShadow: 7,
                borderRadius: 1,
                mx: 2,
              }}
            >
              Submit
            </Button>
          </Form>
        </div>
      </>
    );
  } else {
    return (
      <div className="createExecise">
        <TrainerNavBar name={"Loading..."} />
        <h1>Create exercise</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
