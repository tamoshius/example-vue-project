<template>
  <div id="app">
    <navbar></navbar>
    <div class="app-content">
      <router-view></router-view>
      <div class="push-footer"></div>
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
@import '../assets/style/bootstrap/bootstrap';
@import '../assets/style/font-awesome/font-awesome';

html, body, #app {
  height: 100%;
  margin: 0;
}

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
