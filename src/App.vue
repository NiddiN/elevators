<template>
  <div id="app">
    <div class="input">
      <label for="floorsAmount">Floors amount: </label>
      <input name="floorsAmount" type="number" v-model="floorsAmount" />
    </div>
    <div class="input">
      <label for="elevatorsAmount">Elevators amount: </label>
      <input name="elevatorsAmount" type="number" v-model="elevatorsAmount" />
    </div>

    <BuildingComponent
      :elevatorsAmount="+elevatorsAmount"
      :floorsAmount="+floorsAmount"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BuildingComponent from "./components/BuildingComponent/BuildingComponent.vue";

export default Vue.extend({
  name: "App",

  data() {
    return {
      elevatorsAmount: 1,
      floorsAmount: 15,
    };
  },

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
  color: #2c3e50;
  margin-top: 60px;
}

.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 160px;
}
</style>
