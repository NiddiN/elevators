<template>
  <div class="wrapper" v-if="floorsAmount">
    <div class="building">
      <div
        class="column"
        :key="'elevator' + key"
        v-for="key in elevatorsAmount"
      >
        <ElevatorComponent
          ref="elevators"
          :key="key"
          @queueUpdated="onQueueUpdated($event, key)"
        />
        <div class="floor" v-for="key in floorsAmount" :key="'floor' + key">
          {{ key }}
        </div>
      </div>
    </div>
    <FloorsPanel :floorsAmount="floorsAmount" @floorChanged="onFloorChanged" />
    <div class="call-stacks" v-if="elevatorsCallStacks.length">
      <CallStack
        v-for="(queue, index) in elevatorsCallStacks"
        :key="index"
        :queue="queue"
        :number="index"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { IDestinationInfo } from "../../core/interfaces";
import { EElevatorStatus, EElevatorDirection } from "../../core/enums";

import FloorsPanel from "../FloorsPanel/FloorsPanel.vue";
import ElevatorComponent, {
  IElevatorComponent,
} from "../ElevatorComponent/ElevatorComponent.vue";
import CallStack from "../CallStack/CallStack.vue";

export default Vue.extend({
  name: "BuildingComponent",

  props: {
    elevatorsAmount: Number,
    floorsAmount: Number,
  },

  components: {
    FloorsPanel,
    ElevatorComponent,
    CallStack,
  },

  data(): { elevatorsCallStacks: IDestinationInfo[][] } {
    return {
      elevatorsCallStacks: [],
    };
  },

  methods: {
    onFloorChanged(destinationInfo: IDestinationInfo) {
      const elevators = (this.$refs.elevators ||
        []) as unknown as IElevatorComponent[];
      const freeElevators = elevators.filter(
        (elevator) =>
          elevator.status !== EElevatorStatus.MOVING || !elevator.queue.length
      );
      const passingElevator = this.getPassingElevator(
        elevators,
        destinationInfo
      );
      let elevator;

      if (freeElevators.length) {
        elevator = this.getClosestByCurrentFloor(
          freeElevators,
          destinationInfo.startFloor
        );
      } else if (passingElevator) {
        elevator = passingElevator;
      } else {
        elevator = this.getClosestByDestinationFloor(
          elevators.slice(),
          destinationInfo.startFloor
        );
      }

      elevator.addToQueue(destinationInfo);
    },

    getPassingElevator(
      elevators: IElevatorComponent[],
      newRequest: IDestinationInfo
    ): IElevatorComponent | undefined {
      const isPassingDirection = (
        direction: EElevatorDirection | null,
        floor: number,
        destinationDirection: EElevatorDirection | null,
        destinationFloor: number,
        isElevatorMoving = false
      ): boolean => {
        return (
          direction === destinationDirection &&
          ((direction === EElevatorDirection.UP &&
            floor <= destinationFloor &&
            !isElevatorMoving) ||
            (direction === EElevatorDirection.DOWN &&
              floor >= destinationFloor &&
              !isElevatorMoving))
        );
      };

      return elevators.find(
        ({ direction, destinationInfo, currentFloor, status }) =>
          isPassingDirection(
            direction,
            currentFloor,
            newRequest.direction,
            newRequest.startFloor
          ) ||
          (isPassingDirection(
            newRequest.direction,
            newRequest.startFloor,
            destinationInfo?.direction || null,
            destinationInfo?.destinationFloor || 0
          ) &&
            isPassingDirection(
              destinationInfo?.direction || null,
              destinationInfo?.startFloor || 0,
              newRequest.direction,
              newRequest.startFloor,
              status === EElevatorStatus.MOVING
            ))
      );
    },

    getClosestByCurrentFloor(
      elevators: IElevatorComponent[],
      startFloor: number
    ) {
      return elevators.sort(
        (a, b) =>
          Math.abs(a.currentFloor - startFloor) -
          Math.abs(b.currentFloor - startFloor)
      )[0];
    },

    getClosestByDestinationFloor(
      elevators: IElevatorComponent[],
      startFloor: number
    ) {
      return elevators.sort(
        (a, b) =>
          Math.abs(b.queue[b.queue.length - 1]?.destinationFloor - startFloor) -
          Math.abs(a.queue[a.queue.length - 1]?.destinationFloor - startFloor)
      )[0];
    },

    onQueueUpdated(queue: IDestinationInfo[], index: number) {
      this.elevatorsCallStacks = this.elevatorsCallStacks.slice();
      this.elevatorsCallStacks[index - 1] = queue;
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

.call-stacks {
  display: flex;
  gap: 10px;
}
</style>
