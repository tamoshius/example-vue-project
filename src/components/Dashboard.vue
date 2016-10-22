<template>
  <div class="dashboard">

    <div class="container">

      <page-title titleIcon="fa-bar-chart" title="My Dashboard"></page-title>

      <div class="panel panel-default">
        <div class="panel-body">
          <strong>You've reached the dashboard!</strong><br><br>

          You need to have your backend respond to 
          <a href="http://localhost:8081/backend-service/users/test">http://localhost:8081/backend-service/users/test</a>.
          <br>
          See <code>/config/index.js</code> to change this endpoint.<br><br>
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
import Auth from '../auth'
import PageTitle from './PageTitle.vue'

export default {
  name: 'dashboard',
  components: { PageTitle },
  created () {
    this.auth = new Auth({ 'vue': this })
  },
  data () {
    return {
      testdata: ''
    }
  },
  methods: {
    getTestData () {
      this.$http
        .get('http://localhost:8080/api/users/test', { headers: this.auth.getAuthHeader() })
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
