import { Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  baseUrl,
  Exercise,
  isAuthenticated,
  UserDecoded,
  WorkoutProgram,
} from "../../env";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { ClientNavBar } from "../../NavBars/ClientNavBar";

export function ClientProgram() {
  const [program, setProgram]: any = useState("");

  const { id } = useParams();
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
            setProgram(program);
          },
          (error) => {
            console.error(JSON.stringify(error));
          }
        );
    }
  }, [authenticated, id, jwt, navigate]);

  if (jwt && user && program) {
    return (
      <>
        <div>
          <ClientNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Program</h1>
          <Form>
            <div>
              <Form.Group controlId="eName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size="lg"
                  autoFocus
                  type="text"
                  value={program.name}
                  disabled={true}
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
                  value={program.workoutProgramId}
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
                  value={program.description}
                  disabled={true}
                />
              </Form.Group>
            </div>
            <div>
              <Form.Label>Exercises</Form.Label>
              <CreatableSelect
                isMulti
                isValidNewOption={() => false}
                value={program.exercises.map((exercise: Exercise) => ({
                  label: exercise.name,
                  value: exercise,
                }))}
                isDisabled={true}
              />
            </div>
            <div>
              <Form.Group controlId="clientId">
                <Form.Label>Client Id</Form.Label>
                <Form.Control
                  size="lg"
                  type="number"
                  min="1"
                  value={program.clientId}
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
      <div className="showProgram">
        <ClientNavBar name={"Loading..."} />
        <h1>Program</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
