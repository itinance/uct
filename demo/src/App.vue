<template>
  <div id="app">
    <DemoApp/>
  </div>
</template>

<script>
import DemoApp from './components/DemoApp.vue'

export default {
  name: 'App',
  components: {
    DemoApp
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
