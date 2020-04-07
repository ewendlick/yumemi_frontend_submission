<template>
  <div id="app">
    <PrefecturePopulations />
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
