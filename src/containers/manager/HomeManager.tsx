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
import {
  List,
  ListItem,
  Box,
  IconButton,
  Button,
  ListItemText,
  makeStyles,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { isTemplateTail } from "typescript";
import "../List.css";

export function HomeManager() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: UserDecoded | null;
  var authenticated: boolean;
  const [allTrainers, setAllTrainers]: any = useState("");

  if (jwt) {
    user = jwt_decode(jwt);
    authenticated = isAuthenticated("Manager");
  } else {
    user = null;
  }

  useEffect(() => {
    if (jwt) {
      if (!authenticated) {
        console.log("Not auth");
        return navigate("/");
      }
    } else {
      console.log("Not jwt");
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
              return user.accountType == "PersonalTrainer";
            }
          );

          setAllTrainers(personalTrainers);
        },
        (error) => {
          console.log(JSON.stringify(error));
        }
      );
  }, []);

  function deleteUser(uid: string) {
    console.log("URL delete: " + baseUrl + "api/Users/" + uid);

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };
    fetch(baseUrl + "api/Users/" + uid, requestOptions).then(
      (response) => {
        console.log("Response delete: " + JSON.stringify(response));
        const newList = allTrainers.filter((item: any) => {
          return item.userId !== uid;
        });
        setAllTrainers(newList);
      },
      (error) => {
        console.log("Error delete: " + error);
      }
    );
  }

  if (allTrainers != null && allTrainers != "" && jwt && user) {
    return (
      <>
        <div>
          <ManagerNavBar name={user!.Name} />
        </div>
        <div className="list">
          <h1>Home Manager</h1>
          <h2> All trainers</h2>
          <List
            sx={{
              bgcolor: "white",
              boxShadow: 7,
              borderRadius: 4,
              p: 2,
              my: 2,
            }}
            style={{ maxHeight: "1000px", overflow: "auto" }}
          >
            {allTrainers.map(function (item: any) {
              return (
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
              );
            })}
          </List>
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
