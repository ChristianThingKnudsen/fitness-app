import { Box, Button, List, ListItem, ListItemText } from "@mui/material";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl, isAuthenticated, UserDecoded } from "../../env";
import { TrainerNavBar } from "../../NavBars/TrainerNavBar";

export function HomeTrainer() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  var user: UserDecoded;
  if (jwt != null) {
    user = jwt_decode(jwt);
    const authenticated: boolean = isAuthenticated(user!.Role);
    if (!authenticated) {
      navigate("/");
    }
  }

  const [allClients, setAllClients]: any = useState("");

  useEffect(() => {
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
          // const result = response.filter((obj: { accountType: string }) => {
          //   return obj.accountType == "Client";
          // });

          setAllClients(response);
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
        const newList = allClients.filter((item: any) => {
          return item.userId !== uid;
        });
        setAllClients(newList);
      },
      (error) => {
        console.log("Error delete: " + error);
      }
    );
  }
  function editUser(uid: number) {
    return "lol";
  }

  if (allClients != null && allClients != "") {
    return (
      <div className="HomeTrainerr">
        <TrainerNavBar name={user!.Name} />
        <h1>Home Trainer</h1>
        <div>Here are all your clients: </div>
        <Box
          // alignItems="center"
          // display="flex"
          width={500}
          height={80}

          // sx={{ width: "100%", maxWidth: 500, bgcolor: "red" }}
        >
          {/* disablePadding */}
          <List>
            {allClients.map(function (item: any) {
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
      <div className="HomeTrainer">
        <TrainerNavBar name={user!.Name} />
        <h1>Home Trainer</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
