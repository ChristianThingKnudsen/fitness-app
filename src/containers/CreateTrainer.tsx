import Button from "react-bootstrap/Button";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { baseUrl } from "../env";
import jwt_decode from "jwt-decode";
import { ManagerNavBar } from "../NavBars/ManagerNavBar";

export function CreateTrainer() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const jwt = localStorage.getItem("jwt");
  var user: any;
  if (jwt != null) {
    user = jwt_decode(jwt);
  }

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
          //TODO Show that you are done
        },
        (error) => {
          console.log(JSON.stringify(error));
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

  return (
    <div className="createTrainer">
      <ManagerNavBar name={user.Name} />
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
        <Button size="lg" type="submit" disabled={!validateForm()}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
