import { Login } from "./containers/Login";
import { HomeManager } from "./containers/manager/HomeManager";
import { CreateTrainer } from "./containers/manager/CreateTrainer";
import "./App.css";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { ChangeInfo } from "./containers/trainer/ChangeInfo";
import { HomeTrainer } from "./containers/trainer/HomeTrainer";
import { CreateClient } from "./containers/trainer/CreateClient";
import { HomeClient } from "./containers/client/HomeClient";

function App() {
  return (
    <BrowserRouter>
      <div className="FitnessApp">
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          {/* Manager */}
          <Route path="/manager" element={<HomeManager />} />
          <Route path="/manager/create-trainer" element={<CreateTrainer />} />
          {/* <Route path="/manager/edit-trainer/:id" element={<EditTrainer />} /> */}
          {/* Personal trainer */}
          <Route path="/personal-trainer" element={<HomeTrainer />} />
          <Route
            path="/personal-trainer/create-client"
            element={<CreateClient />}
          />
          <Route
            path="/personal-trainer/change-info"
            element={<ChangeInfo />}
          />
          {/* Client */}
          <Route path="/client" element={<HomeClient />} />
          {/* </Route> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
