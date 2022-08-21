<template>
  <div>
    <div>Elevator {{ number + 1 }}</div>
    <div v-for="(info, index) in queue" :key="index">
      <span :class="{ green: info.passengersPickedUp }">{{
        info.startFloor
      }}</span>
      -> {{ info.destinationFloor }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import { IDestinationInfo } from "@/core/interfaces";

export default Vue.extend({
  name: "CallStack",

  props: {
    queue: Array as PropType<IDestinationInfo[]>,
    number: Number,
  },
});
</script>

<style lang="scss">
.green {
  color: green;
}
</style>
