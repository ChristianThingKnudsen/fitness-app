import jwt_decode from "jwt-decode";

export const baseUrl: string = "https://afe2021fitness.azurewebsites.net/";

// Types
export type AccountType = "Client" | "PersonalTrainer" | "Manager";
export type UserDecoded = {
  Name: string;
  Role: AccountType;
  UserId: number;
  nbf: string;
  exp: string;
};
export type User = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  personalTrainerId: number;
  accountType: AccountType;
};
export type Users = User[];
export type Exercise = {
  exerciseId: number;
  name: string;
  description: string;
  sets: number;
  repetitions: number;
  time: string;
  workoutProgramId: number;
  personalTrainerId: number;
};
export type Exercises = Exercise[];

export type Program = {
  exerciseId: number;
  name: string;
  description: string;
  sets: number;
  repetitions: number;
  time: string;
  workoutProgramId: number;
  personalTrainerId: number;
};

export type WorkoutProgram = {
  workoutProgramId: number;
  name: string;
  description: string;
  exercises: Exercises;
  personalTrainerId: number;
  clientId: number;
};
export type WorkoutPrograms = WorkoutProgram[];

export function isAuthenticated(accountType: AccountType): boolean {
  const jwt = localStorage.getItem("jwt");
  let user: UserDecoded;
  if (jwt != null) {
    user = jwt_decode(jwt);
    if (user.Role === accountType) {
      return true;
    } else {
      console.log(
        `User ${user.Name} is not authenticated. Redirecting to login`
      );
      return false;
    }
  }
  return false;
}
