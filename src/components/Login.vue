<template>
  <div class="col-sm-4 col-sm-offset-4">

    <app-title fontawesome="fa-lock" title="Login"></app-title>

    <p>Log in to your account to access your dashboard.</p>
    <div class="alert alert-danger" v-if="error">
      <p>{{ error }}</p>
    </div>
    <div class="form-group">
      <input 
        type="text" 
        class="form-control"
        placeholder="Enter your username"
        v-model="credentials.username"
      >
    </div>
    <div class="form-group">
      <input
        type="password"
        class="form-control"
        placeholder="Enter your password"
        v-model="credentials.password"
      >
    </div>
    <button class="btn btn-primary solid blank" @click="submit()">Login &nbsp; <i class="fa fa-arrow-circle-o-right"></i></button>
    <br><br><br>
    <a href="#">Forgot your password?</a><br>
    Don’t have an account? &nbsp;<a href="#">Sign up here.</a>

  </div>
</template>

<script>
import Auth from '../auth'
import AppTitle from './AppTitle.vue'

export default {
  name: 'login',
  components: { AppTitle },
  beforeCreate () {
    this.auth = new Auth({ 'vue': this })
  },
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    submit () {
      var credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      this.auth.login(credentials, '/')
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
