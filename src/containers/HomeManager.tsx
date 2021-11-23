import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { baseUrl } from "../env";
import { ManagerNavBar } from "../NavBars/ManagerNavBar";

export function HomeManager() {
  const jwt = localStorage.getItem("jwt");
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

  useEffect(() => {
    console.log("All trainers: " + JSON.stringify(allTrainers));
  }, [allTrainers]);

  if (allTrainers != null && allTrainers != "") {
    console.log("Not null");
    console.log("All trainers: " + JSON.stringify(allTrainers[0]));
    return (
      <div className="HomeManager">
        <ManagerNavBar name={user.Name} />
        <h1>Home Manager</h1>
        <div>Here are all the trainers: </div>
        <div>
          {allTrainers.map(function (item: any) {
            return (
              <li>
                {item.firstName} {item.lastName}
              </li>
            );
          })}
        </div>
      </div>
    );
  } else {
    console.log("Null");
    console.log("All trainers: " + JSON.stringify(allTrainers[0]));
    return (
      <div className="HomeManager">
        <ManagerNavBar name={user.Name} />
        <h1>Home Manager</h1>
        <div>Loading...</div>
      </div>
    );
  }
}
