import { EElevatorStatus } from "../enums/elevatorStatus.enum";
import { IDestinationFloor } from "./destinationFloor.interface";

export interface IElevator {
  id(): number;
  currentFloor(): number;
  destinationFloors(): IDestinationFloor[];
  destinationFloor(): IDestinationFloor | null;
  status(): EElevatorStatus;
  addDestinationFloor(destinationFloor: IDestinationFloor): void;
  setDestinationFloor: () => void;
  removeDestinationFloor: () => void;
  startElevator: () => void;
  moveElevator: () => void;
  changeElevatorPosition: () => void;
  setWaitTimeout: (callback: () => void) => void;
}
