// import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { baseUrl, isAuthenticated, UserDecoded } from "../../env";
import jwt_decode from "jwt-decode";
import { ManagerNavBar } from "../../NavBars/ManagerNavBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../Form.css";

export function CreateTrainer() {
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
    authenticated = isAuthenticated("Manager");
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

    console.log(
      "Submit:" +
        firstName +
        " " +
        lastName +
        " " +
        email +
        " " +
        password +
        " " +
        jwt
    );
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
        accountType: "PersonalTrainer",
      }),
    };
    fetch(baseUrl + "api/Users", requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          console.log(JSON.stringify(response));
          navigate("/manager");
        },
        (error) => {
          console.log(JSON.stringify(error));
          //TODO display error
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
          <ManagerNavBar name={user!.Name} />
        </div>
        <div className="form">
          <h1>Create trainer</h1>
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
      <div className="createTrainer">
        <ManagerNavBar name={"Loading..."} />
        <h1>Create trainer</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
