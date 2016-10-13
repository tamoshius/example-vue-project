<template>
  <div class="Navbar">

    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <div class="navbar-brand navbar-bg">
            <router-link :to="{ name: 'dashboard' }">
              <img class="navbar-brand__image img-responsive" src="../assets/images/logo.png" alt="logo">
            </router-link>
          </div>      
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-left">
          <li><a href="http://www.google.com">Back to Website</a></li>
          <li><router-link v-if="!auth.isLoggedIn" :to="{ name: 'login' }">Login</router-link></li>
          <li><router-link v-if="!auth.isLoggedIn" :to="{ name: 'signup' }">Signup</router-link></li>
          <li><router-link v-if="auth.isLoggedIn" :to="{ name: 'dashboard' }">Dashboard</router-link></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li class="dropdown-header">Nav header</li>
                <li><a href="#">Separated link</a></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#" v-if="auth.isLoggedIn" @click="logout()">Logout</a></li>
            <li></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div><!--/.container-fluid -->
    </div>
  </div>
</template>

<script>
import Authenticate from '../auth'
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown'

export default {
  name: 'Navbar',
  beforeCreate () {
    this.authenticate = new Authenticate({ 'vue': this })
  },
  data () {
    return {
      auth: this.$store.state.auth
    }
  },
  methods: {
    logout () {
      this.authenticate.logout()
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar-brand__image {
    height: 23px;
  }
</style>
