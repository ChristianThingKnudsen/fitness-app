import { Button } from "@mui/material";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  baseUrl,
  Exercise,
  Exercises,
  isAuthenticated,
  UserDecoded,
  WorkoutProgram,
} from "../../env";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";
import CreatableSelect from "react-select/creatable";

export function Program() {
  const [workoutProgramId, setWorkoutProgramId] = useState("");
  const [pName, setPName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [programExercises, setProgramExercises]: any = useState("");
  const [oldProgramExercises, setOldProgramExercises]: any = useState("");
  const [allExercises, setAllExercises]: any = useState("");

  const [formDisabled, setFormDisabled] = useState(true);

  const { id } = useParams();
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

    if (id) {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      };
      fetch(baseUrl + "api/WorkoutPrograms/" + id, requestOptions)
        .then((res) => res.json())
        .then(
          (program: WorkoutProgram) => {
            setPName(program.name);
            setWorkoutProgramId(program.workoutProgramId.toString());
            setDescription(program.description);
            setClientId(program.clientId.toString());
            setProgramExercises(program.exercises);
            setOldProgramExercises(program.exercises);
          },
          (error) => {
            console.error(JSON.stringify(error));
          }
        );
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
  }, [authenticated, id, jwt, navigate]);

  function handleSubmit(event: any) {
    event.preventDefault();

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        workoutProgramId: id,
        name: pName,
        description: description,
        exercises: programExercises,
        personalTrainerId: user?.UserId,
        clientId: clientId,
      }),
    };
    fetch(baseUrl + "api/WorkoutPrograms/" + id, requestOptions).then(
      () => {
        for (const exercise of programExercises) {
          if (
            !oldProgramExercises.some(
              (e: Exercise) => e.exerciseId === exercise.exerciseId
            )
          ) {
            const requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({
                name: exercise.name,
                description: exercise.description,
                sets: exercise.sets,
                repetitions: exercise.repetitions,
                time: exercise.time,
              }),
            };
            fetch(baseUrl + "api/Exercises/Program/" + id, requestOptions).then(
              () => {
                console.log("Added exercise");
              },
              (error) => {
                alert(error);
              }
            );
          }
        }

        for (const exercise of oldProgramExercises) {
          if (
            !programExercises.some(
              (e: Exercise) => e.exerciseId === exercise.exerciseId
            )
          ) {
            const requestOptions = {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
            };
            fetch(
              baseUrl + "api/Exercises/" + exercise.exerciseId,
              requestOptions
            ).then(
              () => {
                console.log("Deleted exercise");
              },
              (error) => {
                alert(error);
              }
            );
          }
        }

        navigate("/personal-trainer/workout-programs");
      },
      (error) => {
        alert(error);
      }
    );
  }

  function handleChangeExercises(newValue: any, actionMetaData: any) {
    var tempExercises: Exercises = [];

    for (const item of newValue) {
      item.value.workoutProgramId = workoutProgramId;
      tempExercises.push(item.value);
    }

    setProgramExercises(tempExercises);
  }

  function validateForm() {
    return (
      pName.length > 0 &&
      workoutProgramId.length > 0 &&
      description.length > 0 &&
      clientId.length > 0 &&
      programExercises.length > 0
    );
  }
  if (jwt && user && allExercises && programExercises) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Program</h1>
          <Form onSubmit={handleSubmit}>
            <div>
              <Form.Group controlId="eName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size="lg"
                  autoFocus
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="programId">
                <Form.Label>Workout program Id</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="0"
                  value={workoutProgramId}
                  onChange={(e) => setWorkoutProgramId(e.target.value)}
                  disabled={true}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Label>Exercises</Form.Label>
              <CreatableSelect
                isMulti
                isValidNewOption={() => false}
                onChange={handleChangeExercises}
                value={programExercises.map((exercise: Exercise) => ({
                  label: exercise.name,
                  value: exercise,
                }))}
                isDisabled={formDisabled}
                options={allExercises.map((exercise: Exercise) => ({
                  label: exercise.name,
                  value: exercise,
                }))}
              />
            </div>
            <div>
              <Form.Group controlId="clientId">
                <Form.Label>Client Id</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="1"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <br />
            <div className="btn-group">
              <Button
                id="btn1"
                variant="contained"
                sx={{
                  boxShadow: 7,
                  borderRadius: 1,
                  mx: 2,
                }}
                type="submit"
                onClick={() => handleSubmit}
                disabled={!validateForm() || formDisabled}
              >
                Update
              </Button>
              <Button
                id="btn2"
                variant="contained"
                sx={{
                  boxShadow: 7,
                  borderRadius: 1,
                  mx: 2,
                }}
                onClick={() => setFormDisabled(!formDisabled)}
              >
                Edit
              </Button>
            </div>
          </Form>
          <br />
          <br />
        </div>
      </>
    );
  } else {
    return (
      <div className="showProgram">
        <TrainerNavBar name={"Loading..."} />
        <h1>Program</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
