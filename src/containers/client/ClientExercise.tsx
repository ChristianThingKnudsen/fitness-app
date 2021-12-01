import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl, Exercise, isAuthenticated, UserDecoded } from "../../env";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { ClientNavBar } from "../../NavBars/ClientNavBar";

export function ClientExercise() {
  const [exercise, setExercise]: any = useState("");

  const { eid } = useParams();
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
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

    if (eid) {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      };
      fetch(baseUrl + "api/Exercises/" + eid, requestOptions)
        .then((res) => res.json())
        .then(
          (exercise: Exercise) => {
            setExercise(exercise);
          },
          (error) => {
            console.error(JSON.stringify(error));
          }
        );
    }
  }, [authenticated, eid, jwt, navigate]);

  if (jwt && user && exercise) {
    return (
      <>
        <div>
          <ClientNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Exercise</h1>
          <Form>
            <div>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size="lg"
                  autoFocus
                  type="text"
                  value={exercise.name}
                  disabled={true}
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
                  value={exercise.exerciseId}
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
                  value={exercise.description}
                  disabled={true}
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
                  value={exercise.sets}
                  disabled={true}
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
                  value={exercise.repetitions}
                  disabled={true}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="time">
                <Form.Label>Time</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  value={exercise.time}
                  disabled={true}
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
                  value={exercise.workoutProgramId}
                  disabled={true}
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
                  value={exercise.personalTrainerId}
                  disabled={true}
                />
              </Form.Group>
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
        <ClientNavBar name={"Loading..."} />
        <h1>Exercise</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
