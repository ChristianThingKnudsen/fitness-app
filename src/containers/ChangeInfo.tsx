import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ManagerNavBar } from "../NavBars/ManagerNavBar";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { baseUrl, isAuthenticated, UserDecoded } from "../env";
import { TrainerNavBar } from "../NavBars/TrainerNavBar";
import "./Form.css";
import { Button } from "@mui/material";
import { ClientNavBar } from "../NavBars/ClientNavBar";

export function ChangeInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [personalTrainerId, setPersonalTrainerId] = useState("");
  const jwt = localStorage.getItem("jwt");
  const password = localStorage.getItem("password");
  const navigate = useNavigate();
  let id: any = null;
  var user: UserDecoded | null;
  var authenticated: boolean = false;

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated(user!.Role);
    id = user!.UserId;
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
      fetch(baseUrl + "api/Users/" + id, requestOptions)
        .then((res) => res.json())
        .then(
          (response) => {
            setFirstName(response.firstName);
            setLastName(response.lastName);
            setEmail(response.email);
            setNewPassword(password!);
            setPersonalTrainerId(response.personalTrainerId);
          },
          (error) => {
            console.error(JSON.stringify(error));
          }
        );
    }
  }, [authenticated, id, jwt, navigate, password]);

  function handleSubmit(event: any) {
    event.preventDefault();

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        userId: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        accountType: user!.Role,
        personalTrainerId: personalTrainerId,
      }),
    };
    fetch(baseUrl + "api/Users/" + id, requestOptions).then(
      () => {
        user!.Role === "PersonalTrainer"
          ? navigate("/personal-trainer")
          : user!.Role === "Client"
          ? navigate("/client")
          : navigate("/");
      },
      (error) => {
        console.error(JSON.stringify(error));
      }
    );
  }

  function validateForm() {
    return (
      email.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      newPassword.length > 0
    );
  }

  function NavBar(props: any) {
    if (props.role === "Client") {
      return (
        <div>
          <ClientNavBar name={user!.Name} />
        </div>
      );
    } else if (props.role === "PersonalTrainer") {
      return (
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
      );
    } else {
      return (
        <div>
          <ManagerNavBar name={user!.Name} />
        </div>
      );
    }
  }

  if (jwt && user) {
    return (
      <>
        <NavBar role={user!.Role} />
        <div className="form">
          <h1>Edit user</h1>
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
            <Form.Group controlId="NewPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                size="lg"
                autoFocus
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <br />
            <Button
              variant="contained"
              sx={{
                boxShadow: 7,
                borderRadius: 1,
              }}
              type="submit"
              disabled={!validateForm()}
            >
              Submit
            </Button>
          </Form>
        </div>
      </>
    );
  } else {
    return (
      <div className="changeInfo">
        <TrainerNavBar name={"Loading..."} />
        <h1>Change info</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
