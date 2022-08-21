import { EElevatorDirection } from "../enums";

export interface IDestinationInfo {
  destinationFloor: number;
  direction: EElevatorDirection;
  startFloor: number;
  passengersPickedUp: boolean;
}
