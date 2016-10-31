<template>
  <div class="dashboard">

    <div class="container">

      <page-title titleIcon="fa-bar-chart" title="My Dashboard"></page-title>

      <div class="panel panel-default">
        <div class="panel-body">
          <strong>You've reached the dashboard!</strong><br><br>

          See <code>/config/index.js</code> to change the OAuth server proxy and 
          also the API proxy to point to your own. Currently, this project uses an 
          online OAuth2 demo located <a href="http://brentertainment.com/oauth2/">here</a>
          by Brent Shaffer. I hope to update this soon with a Node Express OAuth server.<br><br>

          See also comments marked with "TODO" in <code>src/auth.js</code>.<br><br>

          <button class="btn btn-primary" v-on:click="getTestData()">Get some data from backend api</button>
          <br><br>
          <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
          </div>          
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
      testdata: '',
      error: ''
    }
  },
  methods: {
    getTestData () {
      this.$http
        // automatically authorized, thanks to our interceptors in auth.js
        .get('/api/resource')
        .then((response) => {
          this.testdata = response.body
        })
        .catch((errorResponse) => {
          this.error = errorResponse.statusText
          if (errorResponse.body.hasOwnProperty('error_description')) {
            this.error += ': ' + errorResponse.body.error_description
          }
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
