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
              <img class="img-responsive" src="../assets/images/logo.png" alt="logo">
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
import Auth from '../auth'

export default {
  name: 'Navbar',
  data () {
    return {
      auth: this.$store.state.auth
    }
  },
  methods: {
    logout () {
      Auth.logout()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/variables';
@import '../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins';

//
// Navbar
// --------------------------------------------------

// Default navbar
.navbar-default {
  @include gradient-vertical($start-color: lighten($navbar-default-bg, 10%), $end-color: $navbar-default-bg);
  @include reset-filter; // Remove gradient in IE<10 to fix bug where dropdowns don't get triggered
  border-radius: $navbar-border-radius;
  $shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
  @include box-shadow($shadow);

  .navbar-nav > .open > a,
  .navbar-nav > .active > a {
    @include gradient-vertical($start-color: darken($navbar-default-link-active-bg, 5%), $end-color: darken($navbar-default-link-active-bg, 2%));
    @include box-shadow(inset 0 3px 9px rgba(0,0,0,.075));
  }
}

// Undo rounded corners in static and fixed navbars
.navbar-static-top,
.navbar-fixed-top,
.navbar-fixed-bottom {
  border-radius: 0;
}

// Fix active state of dropdown items in collapsed mode
@media (max-width: $grid-float-breakpoint-max) {
  .navbar .navbar-nav .open .dropdown-menu > .active > a {
    &,
    &:hover,
    &:focus {
      color: #fff;
      @include gradient-vertical($start-color: $dropdown-link-active-bg, $end-color: darken($dropdown-link-active-bg, 5%));
    }
  }
}

/*-- Logo --*/

.navbar-header{
  z-index: 9999;
}

.navbar-brand,
.navbar-nav > li > a {
  text-shadow: 0 1px 0 rgba(255,255,255,.25);
}

.navbar-brand.navbar-bg{
  left: 0;
  padding: 3px 15px 10px;
  height: 62px;
  line-height: 62px;
}

.navbar-brand img{
  float: right;
  padding: 5px 5px;
  height: 55px;
}

/* Main navigation */

.navbar{
  border-radius: 0;
  border: 0;
  margin-bottom: 0;
}

.navbar-fixed-top > .container {
  width: auto;
}

.navbar-right{
  padding-right: 0;
}

.navbar-right .dropdown-menu {
  right: auto;
  left: 0;
}

.navbar-toggle{
  border-radius: 0;
  margin-right: 5px;
}

.navbar-toggle .icon-bar{
  background: #fff;
}

ul.navbar-nav > li > a{
  font-family: 'LatoWebBlack';
  text-transform: uppercase;
  font-size: 14px;
  color: #fff;
  padding-top: 22px;
  padding-bottom: 20px;
  line-height: 20px;
}

ul.navbar-nav > li:last-child a{
  padding-right: 0;
}

ul.navbar-nav .dropdown-menu > li > a{
  padding-right: 20px;
}

.nav > li > a:hover, .nav > li > a:focus {
  background: transparent;
}

ul.navbar-nav > li.active > a,
ul.navbar-nav > li > a:hover{
  background: transparent;
}

ul.navbar-nav > li > a i{
  font-weight: 700;
}

.nav .open>a, .nav .open>a:hover, 
.nav .open>a:focus{
  background: transparent;
  border:0;
}

</style>
