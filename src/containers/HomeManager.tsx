import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../env";
import { ManagerNavBar } from "../NavBars/ManagerNavBar";
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

export function HomeManager() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: any;
  if (jwt != null) {
    user = jwt_decode(jwt);
  }
  const [allTrainers, setAllTrainers]: any = useState("");

  useEffect(() => {
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
        (response) => {
          const result = response.filter((obj: { accountType: string }) => {
            return obj.accountType == "PersonalTrainer";
          });

          setAllTrainers(result);
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

  function editUser(userId: string) {
    navigate("/manager/edit-trainer/" + userId);
  }

  if (allTrainers != null && allTrainers != "") {
    return (
      <div className="HomeManager">
        <ManagerNavBar name={user.Name} />
        <h1>Home Manager</h1>
        <div>Here are all the trainers: </div>
        <Box sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}>
          <List disablePadding>
            {allTrainers.map(function (item: any) {
              return (
                <ListItem
                  key={item.userId}
                  sx={{
                    bgcolor: "white",
                    boxShadow: 7,
                    borderRadius: 4,
                    p: 2,
                    mx: 5,
                    my: 2,
                  }}
                  // bgcolor="primary.main"
                  // secondaryAction={
                  //   <IconButton edge="end" aria-label="edit">
                  //     <EditIcon />
                  //   </IconButton>
                  // }
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
                  <Button
                    variant="contained"
                    sx={{
                      boxShadow: 7,
                      borderRadius: 1,
                      mx: 2,
                    }}
                    onClick={() => editUser(item.userId)}
                  >
                    Edit
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </div>
    );
  } else {
    return (
      <div className="HomeManager">
        <ManagerNavBar name={user.Name} />
        <h1>Home Manager</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
