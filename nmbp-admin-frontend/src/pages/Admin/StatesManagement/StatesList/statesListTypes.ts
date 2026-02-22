import { MenuAccess } from "../../../../enums";
import { StatesStatus } from "./statesListEnum";

export interface UsersListProps {
  access: MenuAccess;
  handleUpdateUser: (user_id: number) => void;
}

export interface IState {}
