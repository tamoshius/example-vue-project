<template>
  <div id="app">
    <navbar></navbar>
    <div class="app-content">
      <router-view></router-view>
    </div>
    <app-footer></app-footer>
  </div>

</template>

<script>
import Navbar from './Navbar.vue'
import AppFooter from './AppFooter.vue'

export default {
  name: 'App',
  components: { Navbar, AppFooter },
  data () {
    return {
    }
  }
}
</script>


<style lang="scss">

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.app-content {
  flex: 1;
  color: black;
  padding-top: 80px;
  padding-bottom: 45px;
}

</style>
