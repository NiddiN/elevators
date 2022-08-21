<template>
  <div
    class="elevator"
    :class="{ ['elevator_' + status]: true }"
    :style="styles"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";

import { EElevatorStatus } from "@/core/enums";
import { IDestinationInfo } from "@/core/interfaces";
import { FLOOR_HEIGHT } from "@/core/constants";

export interface IElevatorComponent extends IElevatorData {
  addToQueue(destinationInfo: IDestinationInfo): void;
  setDestinationInfo(): void;
  removeDestinationInfo(destinationInfo: IDestinationInfo | null): void;
  moveElevator(): void;
  setWaitTimeout(callback: () => void): void;
  isPassingPassengersStop(): boolean;
}

interface IElevatorData {
  currentFloor: number;
  destinationInfo: IDestinationInfo | null;
  direction: string;
  status: EElevatorStatus;
  queue: IDestinationInfo[];
}

export default Vue.extend({
  name: "ElevatorComponent",

  data: (): IElevatorData => ({
    currentFloor: 1,
    destinationInfo: null,
    direction: "",
    status: EElevatorStatus.IDLE,
    queue: [],
  }),

  methods: {
    addToQueue(destinationInfo: IDestinationInfo) {
      this.queue.push(destinationInfo);

      if (this.status === EElevatorStatus.IDLE) {
        this.startElevator();
      }
    },

    setDestinationInfo() {
      if (!this.queue.length) {
        this.status = EElevatorStatus.IDLE;
        return;
      }

      // NOTE: Getting closest request from the queue
      this.destinationInfo = this.queue.sort(
        (a, b) =>
          Math.abs(a.startFloor - this.currentFloor) -
          Math.abs(b.startFloor - this.currentFloor)
      )[0];

      this.moveElevator();
    },

    removeDestinationInfo(destinationInfo: IDestinationInfo | null) {
      if (this.destinationInfo === destinationInfo) {
        this.destinationInfo = null;
      }

      this.queue = this.queue.filter((request) => request !== destinationInfo);
    },

    startElevator() {
      this.status = EElevatorStatus.MOVING;

      this.setDestinationInfo();
    },

    moveElevator() {
      if (!this.destinationInfo) {
        return;
      }

      // NOTE: Getting the current destination floor. If passengers picked up then an elevator moves to the destination floor.
      const destinationFloor = this.destinationInfo.passengersPickedUp
        ? this.destinationInfo.destinationFloor
        : this.destinationInfo.startFloor;

      if (this.isPassingPassengersStop()) {
        return;
      }

      if (destinationFloor !== this.currentFloor) {
        if (destinationFloor > this.currentFloor) {
          this.direction = "up";
          this.currentFloor++;
        } else {
          this.direction = "down";
          this.currentFloor--;
        }
      }

      setTimeout(() => this.moveElevator(), 500);
    },

    setWaitTimeout(callback: () => void) {
      setTimeout(() => {
        this.status = EElevatorStatus.MOVING;
        callback();
      }, 2000);
    },

    isPassingPassengersStop(): boolean {
      const sameDirectionRequests = this.queue;

      let isElevatorStopped = false;

      sameDirectionRequests.forEach((request) => {
        // NOTE: This condition checks that current floor is a start floor of any request
        // and request's direction equal to an elevator direction.
        // Also condition (this.destinationInfo?.startFloor === this.currentFloor && this.destinationInfo.direction === request.direction)
        // solves and issue when an elevator doesn't passing passengers when there is a change of direction on the current floor
        if (
          !request.passengersPickedUp &&
          request.startFloor === this.currentFloor &&
          (this.destinationInfo?.direction === request.direction ||
            (this.destinationInfo?.startFloor === this.currentFloor &&
              this.destinationInfo.direction === request.direction))
        ) {
          request.passengersPickedUp = true;
          isElevatorStopped = true;
        } else if (
          request.passengersPickedUp &&
          request.destinationFloor === this.currentFloor &&
          this.direction === request.direction
        ) {
          isElevatorStopped = true;
          this.removeDestinationInfo(request);
        }
      });

      if (isElevatorStopped) {
        this.status = EElevatorStatus.WAITING;

        if (!this.destinationInfo) {
          this.setWaitTimeout(this.setDestinationInfo.bind(this));
        } else {
          this.setWaitTimeout(this.moveElevator.bind(this));
        }

        return true;
      }

      return false;
    },
  },

  computed: {
    styles() {
      return { bottom: FLOOR_HEIGHT * (this.currentFloor - 1) + "px" };
    },
  },
});
</script>

<style lang="scss">
.elevator {
  bottom: 0px;
  height: 30px;
  opacity: 0.7;
  position: absolute;
  transition: bottom 0.5s linear;
  width: 40px;
  z-index: -1;

  &_idle {
    background-color: red;
  }

  &_waiting {
    background-color: yellow;
  }

  &_moving {
    background-color: green;
  }
}
</style>
