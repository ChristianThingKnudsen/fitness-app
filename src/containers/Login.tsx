import { useEffect, useState } from "react";
import { AccountType, baseUrl, UserDecoded } from "../env";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button } from "@mui/material";
import "./Form.css";
import jwt_decode from "jwt-decode";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const jwt: any = localStorage.getItem("jwt");
  var user: UserDecoded;
  if (jwt) {
    user = jwt_decode(jwt);
  }

  function completeLogin(accountType: AccountType) {
    switch (accountType) {
      case "PersonalTrainer": {
        navigate("/personal-trainer");
        break;
      }
      case "Manager": {
        navigate("/manager");
        break;
      }
      case "Client": {
        navigate("/client");
        break;
      }
      default: {
        console.error("ERROR: Could not find account type: " + accountType);
        break;
      }
    }
  }

  useEffect(() => {
    if (jwt) {
      completeLogin(user.Role);
    }
  });

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    };
    fetch(baseUrl + "api/Users/login", requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          localStorage.setItem("jwt", response.jwt);
          localStorage.setItem("password", password);
          var user: UserDecoded = jwt_decode(response.jwt);
          var accountType: AccountType = user.Role;
          completeLogin(accountType);
        },
        (error) => {
          console.error(JSON.stringify(error));
          localStorage.clear();
        }
      )
      .catch((error) => {
        console.error(error);
        localStorage.clear();
        setPassword("");
        alert(error);
      });
  }

  return (
    <div className="form">
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <div>
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
        </div>
        <div>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </div>
        <br />
        <Button
          variant="contained"
          sx={{
            boxShadow: 7,
            borderRadius: 1,
            mx: 2,
          }}
          type="submit"
          disabled={!validateForm()}
        >
          Login
        </Button>
      </Form>
    </div>
  );
}
