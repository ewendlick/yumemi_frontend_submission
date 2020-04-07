<template>
  <div id="app">
    <div class="background">
      <b-row>
        <b-col lg="6" offset-lg="3" md="8" offset-md="2" sm="10" offset-sm="1" cols="12">
          <PrefecturePopulations class="mt-4" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import PrefecturePopulations from './components/PrefecturePopulations.vue'

export default {
  name: 'App',
  components: {
    PrefecturePopulations
  }
}
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;

  // OVERRIDES
  .row {
    margin-left: 0;
    margin-right: 0;
  }
}

.background {
  background: linear-gradient(to right bottom, #90b44b, #33a6b8);
  background-image: url(/bg-texture.png);
  background-image: url(/bg-texture.png), linear-gradient(to right bottom, #90b44b, #33a6b8);
  height: 100%;
}
</style>
