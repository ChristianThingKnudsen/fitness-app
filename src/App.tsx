import React from "react";
import { Login } from "./containers/Login";
import { HomeManager } from "./containers/HomeManager";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CreateTrainer } from "./containers/CreateTrainer";

function App() {
  return (
    <Router>
      <div className="FitnessApp">
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={<HomeManager />}>
            {/* <Route path="/manager/home" element={<HomeManager />} /> */}
            <Route path="manager/create-trainer" element={<CreateTrainer />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
