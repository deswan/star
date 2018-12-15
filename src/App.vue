<template>
  <div id="app">
    <!-- Router View -->
    <router-view />
  </div>
</template>

<script>
import ErrorPage from "./components/ErrorPage.vue";
export default {
  components: {
    ErrorPage
  },
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;

}
</style>

