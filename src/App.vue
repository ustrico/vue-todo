<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  * {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  html {
    font: 14px monospace;
    background: #1e282b;
    color: #fff;
  }
  .show-leave, .show-enter-to {
    max-height: 100vh;
    opacity: 1;
    transform: scaleY(1);
  }
  .show-enter, .show-leave-to {
    max-height: 0;
    opacity: 0;
    transform: scaleY(.1);
  }
</style>
