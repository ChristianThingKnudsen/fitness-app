import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../env";
import { ManagerNavBar } from "../NavBars/ManagerNavBar";

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
        <div>
          {allTrainers.map(function (item: any) {
            return (
              <li key={item.userId}>
                {item.firstName} {item.lastName}
                <button onClick={() => deleteUser(item.userId)}>Delete</button>
                <button onClick={() => editUser(item.userId)}>Edit</button>
              </li>
            );
          })}
        </div>
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
