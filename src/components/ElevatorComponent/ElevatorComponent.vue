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

interface IElevatorData {
  currentFloor: number;
  destinationInfo: IDestinationInfo | null;
  queue: IDestinationInfo[];
  status: EElevatorStatus;
}

export default Vue.extend({
  name: "ElevatorComponent",
  data: (): IElevatorData => ({
    currentFloor: 1,
    destinationInfo: null,
    queue: [],
    status: EElevatorStatus.IDLE,
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

      this.destinationInfo = this.queue.sort(
        (a, b) =>
          Math.abs(a.startFloor - this.currentFloor) -
          Math.abs(b.startFloor - this.currentFloor)
      )[0];

      this.moveElevator();
    },

    removeDestinationInfo() {
      this.queue.shift();
    },

    startElevator() {
      this.status = EElevatorStatus.MOVING;

      this.setDestinationInfo();
    },

    moveElevator() {
      if (!this.destinationInfo) {
        return;
      }

      const destinationInfo =
        this.destinationInfo.startFloor ||
        this.destinationInfo.destinationFloor;

      if (destinationInfo === this.currentFloor) {
        this.status = EElevatorStatus.WAITING;

        if (destinationInfo === this.destinationInfo?.startFloor) {
          this.destinationInfo.startFloor = 0;
          this.setWaitTimeout(this.moveElevator.bind(this));

          return;
        } else {
          this.removeDestinationInfo();
          this.setWaitTimeout(this.setDestinationInfo.bind(this));

          return;
        }
      }

      if (destinationInfo > this.currentFloor) {
        this.currentFloor++;
      } else {
        this.currentFloor--;
      }

      setTimeout(() => this.moveElevator(), 500);
    },

    setWaitTimeout(callback: () => void) {
      setTimeout(() => {
        this.status = EElevatorStatus.MOVING;
        callback();
      }, 2000);
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
