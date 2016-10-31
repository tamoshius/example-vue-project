const LOGIN_URL = '/auth'
const REFRESH_TOKEN_URL = '/auth'
const CLIENT_SECRET = 'ZGVtb2FwcDpkZW1vcGFzcw==' // <-- Base64(client_id:client_secret) "demoapp:demopass"

import Vue from 'vue'

let vue = {}

/**
* Class for handling login and token authentication using OAuth2.
*/
class Auth {

  /**
   * Initializes the Auth class.
   *
   * Gets the root Vue instance set on the window.
   * Creates a Vue-resource http interceptor to handle automatically adding auth headers
   * and refreshing tokens.
   *
   * @return {void}
   */
  static initialize () {
    vue = window.vue

    Vue.http.interceptors.push((request, next) => {
      const token = vue.$store.state.auth.accessToken
      const hasAuthHeader = request.headers.has('Authorization')

      if (token && !hasAuthHeader) {
        Auth.setAuthHeader(request)
      }

      next((response) => {
        if (Auth.isInvalidToken(response)) {
          return Auth.refreshToken(request)
        }
      })
    })
  }

  /**
   * Login
   *
   * @param {Object.<string>} creds The username and password for logging in.
   * @param {string|null} redirect The name of the Route to redirect to.
   * @return {Promise}
   */
  static login (creds, redirect) {
    return vue.$http.post(LOGIN_URL, Auth.getLoginBody(creds), Auth.getLoginOptions())
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

  /**
   * Refresh the access token
   *
   * Make an ajax call to the OAuth2 server to refresh the access token (using our refresh token).
   *
   * @param {Request} request Vue-resource Request instance, the original request that we'll retry.
   * @return {Promise}
   */
  static refreshToken (request) {
    return Vue.http.post(REFRESH_TOKEN_URL, Auth.getRefreshTokenBody(), Auth.getRefreshTokenOptions())
      .then((result) => {
        Auth.storeToken(result)
        Auth.setAuthHeader(request)

        // Retry the original request
        return Auth.retry(request)
      })
      .catch((errorResponse) => {
        if (Auth.isInvalidToken(errorResponse)) {
          Auth.logout()
        }
        return errorResponse
      })
  }

  /**
   * Store tokens
   *
   * Update the Vuex store with the access/refresh tokens received from the response from
   * the Oauth2 server.
   *
   * @param {Response} response Vue-resource Response instance from an OAuth2 server.
   *      that contains our tokens.
   * @return {void}
   */
  static storeToken (response) {
    const auth = vue.$store.state.auth
    const user = vue.$store.state.user

    auth.isLoggedIn = true
    auth.accessToken = response.body.access_token
    auth.refreshToken = response.body.refresh_token
    // TODO: get user's name from response from Oauth server.
    user.name = 'John Smith'

    vue.$store.commit('UPDATE_AUTH', auth)
    vue.$store.commit('UPDATE_USER', user)
  }

  /**
   * Logout
   *
   * Clear all data in our Vuex store (which resets logged-in status) and redirect back
   * to login form.
   *
   * @return {void}
   */
  static logout () {
    vue.$store.commit('CLEAR_ALL_DATA')
    vue.$router.push({ name: 'login' })
  }

  /**
   * Get the login options (including headers) to use in a Vue-resource http call.
   *
   * @return {Object}
   */
  static getLoginOptions () {
    return {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + CLIENT_SECRET
      },
      emulateJSON: true
    }
  }

  /**
   * Get the login body (including username/password) to use in a Vue-resource http call.
   *
   * @return {Object}
   */
  static getLoginBody (creds) {
    return {
      'grant_type': 'password',
      'username': creds.username,
      'password': creds.password
    }
  }

  /**
   * Get the refresh token options to use in a Vue-resource http call.
   *
   * @return {Object}
   */
  static getRefreshTokenOptions () {
    // same as login options
    return Auth.getLoginOptions()
  }

  /**
   * Get the refresh token body to use in a Vue-resource http call.
   *
   * @return {Object}
   */
  static getRefreshTokenBody () {
    return {
      'grant_type': 'refresh_token',
      'refresh_token': vue.$store.state.auth.refreshToken
    }
  }

  /**
   * Check if the Vue-resource Response is an invalid token response.
   *
   * @param {Response} response The Vue-resource Response instance received from an http call.
   * @return {boolean}
   */
  static isInvalidToken (response) {
    return (response.status === 401 && response.data.error === 'invalid_token')
  }

  /**
   * Set the Authorization header on a Vue-resource Request.
   *
   * @param {Request} request The Vue-Resource Request instance to set the header on.
   * @return {void}
   */
  static setAuthHeader (request) {
    request.headers.set('Authorization', 'Bearer ' + vue.$store.state.auth.accessToken)
    // The demo Oauth2 server we are using requires this param, but normally you only set the header.
    request.params.access_token = vue.$store.state.auth.accessToken
  }

  /**
   * Retry a request.
   *
   * @param {Request} request The Vue-resource Request instance to use to repeat an http call.
   * @return {Promise}
   */
  static retry (request) {
    return Vue.http(request)
      .then((response) => {
        return response
      })
      .catch((response) => {
        return response
      })
  }
}

export default Auth
