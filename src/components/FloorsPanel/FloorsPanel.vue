<template>
  <div>
    <div class="input">
      <label for="currentFloor">Your floor: </label>
      <select v-model="startFloor">
        <option name="currentFloor" v-for="key in floorsAmount" :key="key">
          {{ key }}
        </option>
      </select>
    </div>
    <div class="panel">
      <div
        class="button"
        v-for="key in floorsAmount"
        :key="'button' + key"
        @click="onFloorClicked(key)"
      >
        {{ key }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FloorsPanel",

  props: {
    floorsAmount: Number,
  },

  data: () => ({
    startFloor: 1,
  }),

  methods: {
    onFloorClicked(destinationFloor: number) {
      const { startFloor } = this;
      const payload = {
        startFloor: +startFloor,
        destinationFloor,
        direction: startFloor > destinationFloor ? "down" : "up",
        passengersPickedUp: false,
      };

      this.$emit("floorChanged", payload);
    },
  },
});
</script>

<style lang="scss" scoped>
.panel {
  border: 1px solid #c2c2c2;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 122px;
}

.button {
  align-items: center;
  border: 1px solid;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 2em;
  justify-content: center;
  width: 2em;
}

.input {
  width: 122px !important;
}
</style>
