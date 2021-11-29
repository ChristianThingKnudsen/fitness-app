import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { baseUrl, isAuthenticated, UserDecoded } from "../../env";
import jwt_decode from "jwt-decode";
import { ManagerNavBar } from "../../NavBars/ManagerNavBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../Form.css";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";

export function CreateExercise() {
  const [eName, setEName] = useState("");
  const [description, setDescription] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [time, setTime] = useState("");

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
        navigate("/");
      }
    } else {
      console.log("Not auth");
      navigate("/");
    }
  });

  function handleSubmit(event: any) {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: eName,
        description: description,
        sets: sets,
        repetitions: repetitions,
        time: time,
        personalTrainerId: user?.UserId,
      }),
    };
    fetch(baseUrl + "api/Exercises", requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          console.log(JSON.stringify(response));
          navigate("/personal-trainer/exercises");
        },
        (error) => {
          console.log(JSON.stringify(error));
          //TODO display error
        }
      );
  }

  function validateForm() {
    return (
      eName.length > 0 &&
      description.length > 0 &&
      sets.length > 0 &&
      repetitions.length > 0 &&
      time.length > 0
    );
  }

  if (jwt && user) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Create exercise</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="Name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="name"
                value={eName}
                onChange={(e) => setEName(e.target.value)}
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
            <Form.Group controlId="Sets">
              <Form.Label>Sets</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="Repetitions">
              <Form.Label>Repetitions</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="number"
                min="1"
                value={repetitions}
                onChange={(e) => setRepetitions(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="Time">
              <Form.Label>Time</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Form.Group>
            {/* <Button size="lg" type="submit" disabled={!validateForm()}>
      Submit
    </Button> */}
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
