const LOGIN_URL = '/auth'
const REFRESH_TOKEN_URL = '/auth'
const CLIENT_SECRET = 'ZGVtb2FwcDpkZW1vcGFzcw==' // <-- Base64(client_id:client_secret) "demoapp:demopass"

import Vue from 'vue'

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
        // TODO: The demo Oauth2 server we are using requires this param, but normally you only
        // set the header as shown above. You should delete this line below in your own project:
        request.params.access_token = vue.$store.state.auth.accessToken
      }

      next()
    })

    // Attempts to refresh the token
    Vue.http.interceptors.push((request, next) => {
      next((response) => {
        if (response.status === 401 && response.data.error === 'invalid_token') {
          const refreshTokenRequest = Auth.buildRefreshTokenRequest()

          return Vue.http.post(REFRESH_TOKEN_URL, refreshTokenRequest.body, refreshTokenRequest.options)
            .then((result) => {
              // Store the token
              Auth.storeToken(result)

              // Set auth header
              request.headers.set('Authorization', 'Bearer ' + vue.$store.state.auth.accessToken)
              // TODO: The demo Oauth2 server we are using requires this param, but normally you only
              // set the header as shown above. You should delete this line below in your own project:
              request.params.access_token = vue.$store.state.auth.accessToken

              // Retry the original request
              return Auth.retry(request)
            })
            .catch((errorResponse) => {
              if (errorResponse.status === 401 && errorResponse.data.error === 'invalid_token') {
                Auth.logout()
              }
              return errorResponse
            })
        }
      })
    })
  }

  static login (creds, redirect) {
    const request = Auth.buildLoginRequest(creds.username, creds.password)

    return vue.$http
      .post(LOGIN_URL, request.body, request.options)
      .then((response) => {
        Auth.storeToken(response)

        if (redirect) {
          vue.$router.push({ name: redirect })
        }

        return response
      })
      .catch((errorResponse) => {
        return errorResponse
      })
  }

  static storeToken (response) {
    const auth = vue.$store.state.auth
    const user = vue.$store.state.user

    auth.isLoggedIn = true
    auth.accessToken = response.body.access_token
    auth.refreshToken = response.body.refresh_token
    // TODO: get user's name from response from Oauth server.
    // For now, we'll just manually insert one for demo purposes.
    user.name = 'John Smith'

    vue.$store.commit('UPDATE_AUTH', auth)
    vue.$store.commit('UPDATE_USER', user)
  }

  static signup (creds, redirect) {
    // TODO
    // Probably should be handled in another class.
  }

  static logout () {
    vue.$store.commit('CLEAR_ALL_DATA')
    vue.$router.push({ name: 'login' })
  }

  static buildLoginRequest (username, password) {
    return {
      options: {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + CLIENT_SECRET
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

  static buildRefreshTokenRequest () {
    return {
      options: {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + CLIENT_SECRET
        },
        emulateJSON: true
      },
      body: {
        'grant_type': 'refresh_token',
        'refresh_token': vue.$store.state.auth.refreshToken
      }
    }
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
