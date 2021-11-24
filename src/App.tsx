import { Login } from "./containers/Login";
import { HomeManager } from "./containers/HomeManager";
import { CreateTrainer } from "./containers/CreateTrainer";
import "./App.css";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { EditTrainer } from "./containers/EditTrainer";

function App() {
  return (
    <BrowserRouter>
      <div className="FitnessApp">
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={<HomeManager />} />
          <Route path="/manager/create-trainer" element={<CreateTrainer />} />
          <Route path="/manager/edit-trainer/:id" element={<EditTrainer />} />
          {/* </Route> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
