import { Login } from "./containers/Login";
import { HomeManager } from "./containers/manager/HomeManager";
import { CreateTrainer } from "./containers/manager/CreateTrainer";
import "./App.css";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { ChangeInfo } from "./containers/ChangeInfo";
import { HomeTrainer } from "./containers/trainer/HomeTrainer";
import { CreateClient } from "./containers/trainer/CreateClient";
import { HomeClient } from "./containers/client/HomeClient";
import { ExercisesPage } from "./containers/trainer/ExercisesPage";
import { CreateExercise } from "./containers/trainer/CreateExercise";
import { ExercisePage } from "./containers/trainer/ExercisePage";

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
          <Route
            path="/personal-trainer/exercises"
            element={<ExercisesPage />}
          />
          <Route
            path="/personal-trainer/exercises/create"
            element={<CreateExercise />}
          />
          <Route path="personal-trainer/exercises/:id" element={<ExercisePage />} />
          {/* Client */}
          <Route path="/client" element={<HomeClient />} />
          <Route path="/client/change-info" element={<ChangeInfo />} />
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
