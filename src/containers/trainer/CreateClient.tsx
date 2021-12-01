import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { baseUrl, isAuthenticated, UserDecoded } from "../../env";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";
import "../Form.css";

export function CreateClient() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!jwt || !authenticated) {
      console.error("Not authenticated redirecting to login");
      return navigate("/");
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
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        accountType: "Client",
        personalTrainerId: user?.UserId,
      }),
    };
    fetch(baseUrl + "api/Users", requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          navigate("/personal-trainer");
        },
        (error) => {
          console.error(JSON.stringify(error));
        }
      );
  }

  function validateForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0
    );
  }

  if (jwt && user) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Create Client</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="FirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="LastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="Password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
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
      <div className="createClient">
        <TrainerNavBar name={"Loading..."} />
        <h1>Create client</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
