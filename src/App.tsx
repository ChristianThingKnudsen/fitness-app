import { Login } from "./containers/Login";
import { HomeManager } from "./containers/HomeManager";
import { CreateTrainer } from "./containers/CreateTrainer";
import "./App.css";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="FitnessApp">
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={<HomeManager />} />
          <Route path="/manager/create-trainer" element={<CreateTrainer />} />
          {/* </Route> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
