<template>
  <div id="app">
    <Index />
  </div>
</template>

<script>
import Index from './page/Index.vue'

export default {
  name: 'App',
  components: {
    Index
  },
  created() {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt', event)      
    })
  }
}
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
