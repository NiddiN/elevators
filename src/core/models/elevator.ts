import { FLOOR_HEIGHT } from "../constants/floorHeight";
import { EElevatorStatus } from "../enums/elevatorStatus.enum";
import { IDestinationFloor } from "../interfaces";

export class Elevator {
  private _id: number;
  get id(): number {
    return this._id;
  }

  private _currentFloor = 1;
  get currentFloor(): number {
    return this._currentFloor;
  }

  private _destinationFloors: IDestinationFloor[] = [];
  get destinationFloors(): IDestinationFloor[] {
    return this._destinationFloors;
  }

  private _destinationFloor: IDestinationFloor | null = null;
  get destinationFloor(): IDestinationFloor {
    return this._destinationFloor as IDestinationFloor;
  }

  private _status = EElevatorStatus.idle;
  get status(): EElevatorStatus {
    console.log(this._status);
    return this._status;
  }

  constructor(id: number) {
    this._id = id;
  }

  addDestinationFloor(destinationFloor: IDestinationFloor) {
    this.destinationFloors.push(destinationFloor);

    if (this._status === EElevatorStatus.idle) {
      this.startElevator();
    }
  }

  private setDestinationFloor() {
    if (!this.destinationFloors.length) {
      this._status = EElevatorStatus.idle;
      return;
    }

    this._destinationFloor = this.destinationFloors.sort((a, b) =>
      Math.abs(a.startFloor - this.currentFloor) >
      Math.abs(b.startFloor - this.currentFloor)
        ? 1
        : -1
    )[0];

    this.moveElevator();
  }

  private removeDestinationFloor() {
    this.destinationFloors.shift();
  }

  private startElevator() {
    this._status = EElevatorStatus.moving;

    this.setDestinationFloor();
  }

  private moveElevator() {
    if (!this.destinationFloor) {
      return;
    }

    const destinationFloor =
      this.destinationFloor.startFloor || this.destinationFloor.endFloor;

    if (destinationFloor === this.currentFloor) {
      this._status = EElevatorStatus.waiting;

      if (destinationFloor === this.destinationFloor?.startFloor) {
        this.destinationFloor.startFloor = 0;
        this.setWaitTimeout(this.moveElevator.bind(this));

        return;
      } else {
        this.removeDestinationFloor();
        this.setWaitTimeout(this.setDestinationFloor.bind(this));

        return;
      }
    }

    if (destinationFloor > this.currentFloor) {
      this._currentFloor++;
    } else {
      this._currentFloor--;
    }

    this.changeElevatorPosition();

    setTimeout(() => this.moveElevator(), 500);
  }

  private changeElevatorPosition() {
    const elevatorElement = document.getElementById(this._id.toString());

    if (elevatorElement) {
      elevatorElement.style.bottom = `${
        FLOOR_HEIGHT * (this.currentFloor - 1)
      }px`;
    }
  }

  private setWaitTimeout(callback: () => void) {
    setTimeout(() => {
      this._status = EElevatorStatus.moving;
      callback();
    }, 2000);
  }
}
