import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ManagerNavBar } from "../../NavBars/ManagerNavBar";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl, isAuthenticated, UserDecoded } from "../../env";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";

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

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated(user!.Role);
    id = user!.UserId;
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
        // personalTrainerId: 0,
        firstName: firstName,
        lastName: lastName,
        email: email,
        accountType: "PersonalTrainer",
      }),
    };
    fetch(baseUrl + "api/Users/" + id, requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          console.log(JSON.stringify(response));
          navigate("/personal-trainer");
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

  if (jwt && user) {
    return (
      <div className="editTrainer">
        <ManagerNavBar name={user!.Name} />
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
          <Button size="lg" type="submit" disabled={!validateForm()}>
            Submit
          </Button>
        </Form>
      </div>
    );
  } else {
    return (
      <div className="editTrainer">
        <TrainerNavBar name={"Loading..."} />
        <h1>Change info</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
