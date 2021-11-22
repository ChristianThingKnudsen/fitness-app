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

function App() {
  return (
    <Router>
      <div className="FitnessApp">
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homeManager" element={<HomeManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
