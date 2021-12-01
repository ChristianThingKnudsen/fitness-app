import { Box, Button, List, ListItem, ListItemText } from "@mui/material";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl, isAuthenticated, UserDecoded } from "../../env";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";
import "../List.css";

export function HomeTrainer() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: UserDecoded | null;
  var authenticated: boolean = false;
  const [allClients, setAllClients]: any = useState("");

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

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/Users/Clients", requestOptions)
      .then((res) => res.json())
      .then(
        (response) => {
          setAllClients(response);
        },
        (error) => {
          console.error(JSON.stringify(error));
        }
      );
  }, [authenticated, jwt, navigate]);

  function deleteUser(uid: string) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/Users/" + uid, requestOptions).then(
      (response) => {
        const newList = allClients.filter((item: any) => {
          return item.userId !== uid;
        });
        setAllClients(newList);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  if (allClients && jwt && user) {
    return (
      <>
        <div>
          <TrainerNavBar name={user!.Name} />
        </div>
        <div className="list">
          <h1>Home Trainer</h1>
          <h2>Here are all your clients</h2>
          <Box display="flex" justifyContent="center" alignItems="center">
            <List
              sx={{
                bgcolor: "white",
                boxShadow: 7,
                borderRadius: 4,
                p: 2,
                my: 2,
                width: "75%",
                height: "50%",
              }}
              style={{
                maxHeight: "450px",
                overflow: "auto",
              }}
            >
              {allClients.map(function (item: any) {
                return (
                  <Box
                    key={item.userId}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ListItem
                      key={item.userId}
                      sx={{
                        bgcolor: "white",
                        boxShadow: 7,
                        borderRadius: 4,
                        p: 2,
                        maxWidth: "800px",
                        my: 2,
                      }}
                    >
                      <ListItemText
                        primary={item.firstName + " " + item.lastName}
                      />

                      <Button
                        variant="contained"
                        onClick={() => deleteUser(item.userId)}
                      >
                        Delete
                      </Button>
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          </Box>
        </div>
      </>
    );
  } else {
    return (
      <div className="HomeTrainer">
        <TrainerNavBar name={"Loading..."} />
        <h1>Home Trainer</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
