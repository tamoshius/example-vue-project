// This is a public oauth test server
const LOGIN_URL = 'http://localhost:8080/auth'

var vue

class Auth {

  constructor (options) {
    vue = options.vue
    this.isLoggedIn = vue.$store.state.auth.isLoggedIn
    this.accessToken = vue.$store.state.auth.accessToken
  }

  login (creds, redirect) {
    var request = this.buildLoginRequest(creds.username, creds.password)

    var auth = vue.$store.state.auth
    console.log(request.body)
    return vue.$http
      .post(LOGIN_URL, request.body, request.options)
      .then((response) => {
        auth.accessToken = response.body.access_token
        // auth.refreshToken = response.body.refresh_token
        auth.isLoggedIn = true
        vue.$store.commit('updateAuth', auth)

        if (redirect) {
          vue.$router.push(redirect)
        }
      })
      .catch((error) => {
        vue.error = error
      })
  }

  signup (creds, redirect) {
    // TODO
  }

  logout () {
    var auth = vue.$store.state.auth

    auth.accessToken = null
    auth.isLoggedIn = false
    vue.$store.commit('updateAuth', auth)
    vue.$router.push('/login')
  }

  buildLoginRequest (username, password) {
    return {
      options: {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + 'ZGVtb2FwcDpkZW1vcGFzcw=='  // <-- Base64(client_id:client_secret) "demoapp:demopass"
        },
        emulateJSON: true
      },
      body: {
        'grant_type': 'password',
        'username': username,
        'password': password
      }
    }
  }

  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + vue.$store.state.auth.accessToken
    }
  }
}

export default Auth
