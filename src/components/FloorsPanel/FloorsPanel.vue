<template>
  <div>
    <select v-model="startFloor">
      <option v-for="key in floorsAmount" :key="key">{{ key }}</option>
    </select>
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
  data() {
    return {
      startFloor: 1,
    };
  },
  methods: {
    onFloorClicked(endFloor: number) {
      const { startFloor } = this;
      const payload = {
        startFloor: +startFloor,
        endFloor,
      };

      this.$emit("floorChanged", payload);
    },
  },
});
</script>

<style lang="css">
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
</style>
