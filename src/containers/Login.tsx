import React, { useEffect, useState } from "react";
import { baseUrl } from "../env";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import jwt_decode from "jwt-decode";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log("Submit:" + email + " " + password);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    };
    fetch(baseUrl + "api/Users/login", requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          console.log(JSON.stringify(response));
          localStorage.setItem("jwt", response.jwt);
          console.log(
            "JWT decoded: " + JSON.stringify(jwt_decode(response.jwt))
          );
          var decoded: any = jwt_decode(response.jwt);
          var accountType: string = decoded["Role"];
          console.log("AccountType: " + accountType);
          switch (accountType) {
            case "Manager":
              navigate("/manager/home");
              break;
            case "PersonalTrainer":
              navigate("/personal-trainer/home");
              break;
            case "Client":
              navigate("/client/home");
              break;
            default:
              console.log("ERROR: Could not find account type: " + accountType);
          }
        },
        (error) => {
          console.log(JSON.stringify(error));
        }
      );
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            size="lg"
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            size="lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}
