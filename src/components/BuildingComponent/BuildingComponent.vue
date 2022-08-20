<template>
  <div class="wrapper" v-if="floorsAmount">
    <div class="building">
      <div
        class="column"
        :key="'elevator' + elevator.id"
        v-for="elevator in elevators"
      >
        <div
          class="elevator"
          :class="{ [elevator.status]: true }"
          :id="elevator.id.toString()"
        ></div>
        <div class="floor" v-for="key in floorsAmount" :key="'floor' + key">
          {{ key }}
        </div>
      </div>
    </div>
    <FloorsPanel :floorsAmount="floorsAmount" @floorChanged="onFloorChanged" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { IDestinationFloor } from "../../core/interfaces";
import { EElevatorStatus } from "../../core/enums";
import { Elevator } from "../../core/models";

import FloorsPanel from "../FloorsPanel/FloorsPanel.vue";

export default Vue.extend({
  name: "BuildingComponent",
  props: {
    elevatorsAmount: Number,
    floorsAmount: Number,
  },
  data(): { elevators: Elevator[] } {
    return {
      elevators: [],
    };
  },
  mounted() {
    this.createElevetors();
  },
  methods: {
    createElevetors() {
      this.elevators.length = 0;

      new Array(this.elevatorsAmount)
        .fill(1)
        .forEach((item, index) => this.elevators.push(new Elevator(index + 1)));
    },
    onFloorChanged(destinationFloor: IDestinationFloor) {
      const freeElevators = this.elevators.filter(
        (elevator) => elevator.status === EElevatorStatus.idle
      );
      const elevator = freeElevators.length
        ? this.getClosestByCurrentFloor(
            freeElevators,
            destinationFloor.startFloor
          )
        : this.getClosestByEndFloor(
            this.elevators.slice(),
            destinationFloor.startFloor
          );

      elevator.addDestinationFloor(destinationFloor);
    },
    getClosestByCurrentFloor(elevators: Elevator[], startFloor: number) {
      return elevators
        .reverse()
        .sort((a, b) =>
          Math.abs(a.currentFloor - startFloor) >
          Math.abs(b.currentFloor - startFloor)
            ? 1
            : -1
        )[0];
    },
    getClosestByEndFloor(elevators: Elevator[], startFloor: number) {
      return elevators
        .reverse()
        .sort((a, b) =>
          Math.abs(a.destinationFloor.endFloor - startFloor) >
          Math.abs(b.destinationFloor.endFloor - startFloor)
            ? 1
            : -1
        )[0];
    },
  },
  watch: {
    elevatorsAmount(newValue) {
      if (!newValue || newValue === this.elevators.length) {
        return;
      }

      this.createElevetors();
    },
  },
  components: {
    FloorsPanel,
  },
});
</script>

<style lang="css">
.wrapper {
  display: flex;
  gap: 40px;
}

.building {
  border: 1px solid #c2c2c2;
  display: flex;
  gap: 10px;
  padding: 10px;
  width: min-content;
}

.column {
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}

.floor,
.elevator {
  align-items: center;
  display: flex;
  height: 30px;
  justify-content: center;
  width: 40px;
}

.elevator {
  background-color: red;
  bottom: 0px;
  opacity: 0.7;
  position: absolute;
  transition: bottom 0.5s linear;
  z-index: -1;
}

.waiting {
  background-color: yellow;
}

.moving {
  background-color: green;
}
</style>
