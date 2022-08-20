<template>
  <div id="app">
    <BuildingComponent :elevatorsAmount="3" :floorsAmount="15" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BuildingComponent from "./components/BuildingComponent/BuildingComponent.vue";

export default Vue.extend({
  name: "App",
  components: {
    BuildingComponent,
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
