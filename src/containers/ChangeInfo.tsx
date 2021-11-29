import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ManagerNavBar } from "../NavBars/ManagerNavBar";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl, isAuthenticated, UserDecoded } from "../env";
import { TrainerNavBar } from "../NavBars/TrainerNavBar";
import "./Form.css";
import { Button } from "@mui/material";
import { ClientNavBar } from "../NavBars/ClientNavBar";
import { AnyMxRecord } from "dns";

export function ChangeInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  // const { id } = useParams();
  let id: any = null;
  var user: UserDecoded | null;
  var authenticated: boolean;
  var header: string;

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated(user!.Role);
    id = user!.UserId;
    header = "Edit " + user!.Role;
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

    if (id) {
      console.log("Edit ID: " + id);

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
          },
          (error) => {
            console.log(JSON.stringify(error));
          }
        );
    }
  }, []);

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log("ID: " + id);

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        userId: id,
        // password: "aQ",
        // personalTrainerId: 0, //TODO Maybe change this
        firstName: firstName,
        lastName: lastName,
        email: email,
        accountType: user!.Role,
      }),
    };
    fetch(baseUrl + "api/Users/" + id, requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          console.log(JSON.stringify(response));
          user!.Role == "PersonalTrainer"
            ? navigate("/personal-trainer")
            : user!.Role == "Client"
            ? navigate("/client")
            : navigate("/");
        },
        (error) => {
          console.log(JSON.stringify(error));
          //TODO display error
        }
      );
  }

  function validateForm() {
    return email.length > 0 && firstName.length > 0 && lastName.length > 0;
  }

  function NavBar(props: any) {
    if (props.role == "Client") {
      return (
        <div>
          <ClientNavBar name={user!.Name} />
        </div>
      );
    } else if (props.role == "PersonalTrainer") {
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
          <h1>Edit trainer</h1>
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
