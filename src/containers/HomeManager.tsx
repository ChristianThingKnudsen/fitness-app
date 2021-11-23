import Button from "react-bootstrap/Button";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { baseUrl } from "../env";
import jwt_decode from "jwt-decode";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { ManagerNavBar } from "../NavBars/ManagerNavBar";

export function HomeManager() {
  const jwt = localStorage.getItem("jwt");
  var user: any;
  if (jwt != null) {
    user = jwt_decode(jwt);
  }

  return (
    <div className="HomeManager">
      <ManagerNavBar name={user.Name} />
      <h1>Create trainer</h1>
    </div>
  );
}
