import { Button } from "@mui/material";
import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl, Exercise, isAuthenticated, UserDecoded } from "../../env";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";

export function ExercisePage() {
  const [exerciseId, setExerciseId] = useState("");
  const [eName, setEName] = useState("");
  const [description, setDescription] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [time, setTime] = useState("");
  const [workoutProgramId, setWorkoutProgramId] = useState("");
  const [personalTrainerId, setPersonalTrainerId] = useState("");
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
      fetch(baseUrl + "api/Exercises/" + id, requestOptions)
        .then((res) => res.json())
        .then(
          (exercise: Exercise) => {
            setEName(exercise.name);
            setExerciseId(exercise.exerciseId.toString());
            setDescription(exercise.description);
            setSets(exercise.sets.toString());
            setRepetitions(exercise.repetitions.toString());
            setTime(exercise.time ? exercise.time : "");
            setWorkoutProgramId(
              exercise.workoutProgramId?.toString()
                ? exercise.workoutProgramId?.toString()
                : ""
            );
            setPersonalTrainerId(exercise.personalTrainerId.toString());
          },
          (error) => {
            console.error(JSON.stringify(error));
          }
        );
    }
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
        exerciseId: id,
        name: eName,
        description: description,
        sets: Number(sets),
        repetitions: Number(repetitions),
        time: time ? time : null,
        workoutProgramId:
          Number(workoutProgramId) === 0 ? null : Number(workoutProgramId),
        personalTrainerId: Number(personalTrainerId),
      }),
    };
    fetch(baseUrl + "api/Exercises/" + id, requestOptions).then(
      () => {
        navigate("/personal-trainer/exercises");
      },
      (error) => {
        console.error(JSON.stringify(error));
        alert(error);
      }
    );
  }

  function validateForm() {
    return (
      eName.length > 0 &&
      exerciseId.length > 0 &&
      description.length > 0 &&
      sets.length > 0 &&
      repetitions.length > 0 &&
      personalTrainerId.length > 0
    );
  }
  if (jwt && user) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Exercise</h1>
          <Form onSubmit={handleSubmit}>
            <div>
              <Form.Group controlId="eName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size="lg"
                  autoFocus
                  type="text"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="exerciseId">
                <Form.Label>Exercise id</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="0"
                  value={exerciseId}
                  onChange={(e) => setExerciseId(e.target.value)}
                  disabled={formDisabled}
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
              <Form.Group controlId="sets">
                <Form.Label>Sets</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="repetitions">
                <Form.Label>Repetitions</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="1"
                  value={repetitions}
                  onChange={(e) => setRepetitions(e.target.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="time">
                <Form.Label>Time</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target?.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="workoutProgramId">
                <Form.Label>Workout programe id</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="0"
                  value={workoutProgramId}
                  onChange={(e) => setWorkoutProgramId(e.target?.value)}
                  disabled={formDisabled}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="personalTrainerId">
                <Form.Label>Personal trainer id</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="0"
                  value={personalTrainerId}
                  onChange={(e) => setPersonalTrainerId(e.target.value)}
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
      <div className="showExercise">
        <TrainerNavBar name={"Loading..."} />
        <h1>Exercise</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
