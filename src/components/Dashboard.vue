<template>
  <div class="dashboard">
    <h1>You reached the dashboard</h1>
    <button class="btn btn-warning" v-on:click="getTestData()">Get some protected data</button>
    <div class="testdata-area" v-if="testdata">
      <h2><blockquote>{{ testdata }}</blockquote></h2>      
    </div>
  </div>
</template>

<script>
import Auth from '../auth'
export default {
  name: 'dashboard',
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