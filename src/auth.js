import Vue from 'vue'
const LOGIN_URL = 'http://localhost:8080/auth'
const REFRESH_TOKEN_URL = 'http://localhost:8080'  // <-- TODO: replace with your refresh token oauth2 endpoint
let vue = {}

class Auth {

  static initialize () {
    vue = window.vue

    // Attach the token on every request
    Vue.http.interceptors.push((request, next) => {
      const token = vue.$store.state.auth.accessToken

      // Set the Authorization header if user is logged in.
      if (token && !request.headers.has('Authorization')) {
        request.headers.set('Authorization', 'Bearer ' + vue.$store.state.auth.accessToken)
      }

      next()
    })

    // Attempts to refresh the token
    Vue.http.interceptors.push((request, next) => {
      next((response) => {
        // TODO: check for expired token more specifically, limit retries
        if (response.status === 401 && response.data.error === 'invalid_token') {
          return Auth.refreshToken().then((result) => {
            const token = result.body.access_token

            Auth.storeToken(token)
            request.headers.set('Authorization', 'Bearer ' + token)

            return Auth.retry(request)
          }).catch(() => {
            Auth.logout()
            return vue.$router.push({ name: 'login' })
          })
        }
      })
    })
  }

  static login (creds, redirect) {
    const request = this.buildLoginRequest(creds.username, creds.password)

    return vue.$http
      .post(LOGIN_URL, request.body, request.options)
      .then((response) => {
        Auth.storeToken(response.body.access_token)
        // need to also store response.body.refresh_token

        if (redirect) {
          vue.$router.push(redirect)
        }
      })
      .catch((error) => {
        vue.error = error
      })
  }

  static storeToken (token) {
    const auth = vue.$store.state.auth
    const user = vue.$store.state.user

    auth.accessToken = token
    auth.isLoggedIn = true

    // TODO: get user's name from response from Oauth server
    user.name = 'John Smith'

    vue.$store.commit('UPDATE_AUTH', auth)
    vue.$store.commit('UPDATE_USER', user)
  }

  static signup (creds, redirect) {
    // TODO
  }

  static logout () {
    vue.$store.commit('CLEAR_ALL_DATA')
    vue.$router.push('/login')
  }

  static buildLoginRequest (username, password) {
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

  static refreshToken () {
    // TODO: Need to replace with a call to refresh token oauth2 endpoint
    return Vue.http.post(REFRESH_TOKEN_URL)
  }

  static retry (request) {
    return Vue
            .http(request)
            .then((data) => {
              return data
            })
  }
}

export default Auth
