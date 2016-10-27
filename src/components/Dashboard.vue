<template>
  <div class="dashboard">

    <div class="container">

      <page-title titleIcon="fa-bar-chart" title="My Dashboard"></page-title>

      <div class="panel panel-default">
        <div class="panel-body">
          <strong>You've reached the dashboard!</strong><br><br>

          You need to have your backend respond to 
          <a href="http://localhost:8081/backend-service/users/test">http://localhost:8081/backend-service/users/test</a>
          before clicking the button below.<br>
          See <code>/config/index.js</code> to change this endpoint.<br><br>

          You will also need to add the refresh token endpoint for your OAuth2 server in <code>src/auth.js</code>. When access tokens expire,
          they are automatically refreshed behind the scenes. The Vue-resource interceptors are already setup for you, just
          provide your refresh token endpoint.
          See comments marked with "TODO" in <code>src/auth.js</code>.<br><br>

          <button class="btn btn-primary" v-on:click="getTestData()">Get some data from backend api</button>
          <div class="testdata-area" v-if="testdata">
            <h2><blockquote>{{ testdata }}</blockquote></h2>      
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue'

export default {
  name: 'dashboard',
  components: { PageTitle },
  data () {
    return {
      testdata: ''
    }
  },
  methods: {
    getTestData () {
      this.$http
        // automatically authorized, thanks to our interceptors in auth.js
        .get('http://localhost:8080/api/users/test')
        .then((response) => {
          this.testdata = response.body
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  /*
  route: {
    activate () {
      return this.$store.state.auth.isLoggedIn
    }
  }
  */
}
</script>

<style lang="scss" scoped>

</style>
