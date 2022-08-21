<template>
  <div class="wrapper" v-if="floorsAmount">
    <div class="building">
      <div
        class="column"
        :key="'elevator' + key"
        v-for="key in elevatorsAmount"
      >
        <ElevatorComponent ref="elevators" :key="key" />
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

import { IDestinationInfo } from "../../core/interfaces";
import { EElevatorStatus } from "../../core/enums";
import { Elevator } from "../../core/models";

import FloorsPanel from "../FloorsPanel/FloorsPanel.vue";
import ElevatorComponent, {
  IElevatorComponent,
} from "../ElevatorComponent/ElevatorComponent.vue";

export default Vue.extend({
  name: "BuildingComponent",
  props: {
    elevatorsAmount: Number,
    floorsAmount: Number,
  },
  components: {
    FloorsPanel,
    ElevatorComponent,
  },
  methods: {
    onFloorChanged(destinationInfo: IDestinationInfo) {
      const elevators = (this.$refs.elevators ||
        []) as unknown as IElevatorComponent[];
      const freeElevators = elevators.filter(
        (elevator) => elevator.status === EElevatorStatus.IDLE
      );
      let elevator;

      if (freeElevators.length) {
        elevator = this.getClosestByCurrentFloor(
          freeElevators,
          destinationInfo.startFloor
        );
      } else {
        elevator = this.getClosestByDestinationFloor(
          elevators.slice(),
          destinationInfo.startFloor
        );
      }

      elevator.addToQueue(destinationInfo);
    },

    getClosestByCurrentFloor(elevators: Elevator[], startFloor: number) {
      return elevators.sort(
        (a, b) =>
          Math.abs(a.currentFloor - startFloor) -
          Math.abs(b.currentFloor - startFloor)
      )[0];
    },

    getClosestByDestinationFloor(elevators: Elevator[], startFloor: number) {
      return elevators.sort(
        (a, b) =>
          Math.abs(b.queue[b.queue.length - 1]?.destinationFloor - startFloor) -
          Math.abs(a.queue[a.queue.length - 1]?.destinationFloor - startFloor)
      )[0];
    },
  },
});
</script>

<style lang="scss">
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

.floor {
  align-items: center;
  display: flex;
  height: 30px;
  justify-content: center;
  width: 40px;
}
</style>
