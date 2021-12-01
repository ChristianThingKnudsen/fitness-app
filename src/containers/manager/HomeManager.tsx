import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountType,
  baseUrl,
  isAuthenticated,
  UserDecoded,
  Users,
} from "../../env";
import { ManagerNavBar } from "../../NavBars/ManagerNavBar";
import { List, ListItem, Box, Button, ListItemText } from "@mui/material";
import "../List.css";

export function HomeManager() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: UserDecoded | null;
  var authenticated: boolean = false;
  const [allTrainers, setAllTrainers]: any = useState("");

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated("Manager");
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
    fetch(baseUrl + "api/Users", requestOptions)
      .then((res) => res.json())
      .then(
        (users: Users) => {
          const personalTrainers: Users = users.filter(
            (user: { accountType: AccountType }) => {
              return user.accountType === "PersonalTrainer";
            }
          );

          setAllTrainers(personalTrainers);
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
        const newList = allTrainers.filter((item: any) => {
          return item.userId !== uid;
        });
        setAllTrainers(newList);
      },
      (error) => {
        console.error("Error delete: " + error);
      }
    );
  }

  if (allTrainers != null && allTrainers !== "" && jwt && user) {
    return (
      <>
        <div>
          <ManagerNavBar name={user!.Name} />
        </div>
        <div className="list">
          <h1>Home Manager</h1>
          <h2> All trainers</h2>
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
              {allTrainers.map(function (item: any) {
                return (
                  <Box
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
      <div className="HomeManager">
        <ManagerNavBar name={"Loading..."} />
        <h1>Home Manager</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
