import Vue from 'vue'

/**
* Auth
*
* Handle login and token authentication using OAuth2.
*
* public methods: initialize, login. logout
*/
export default {

  /**
   *
   * @var{string} LOGIN_URL The endpoint for logging in. This endpoint should be proxied by Webpack dev server
   *    and maybe nginx in production (cleaner calls and avoids CORS issues).
   */
  LOGIN_URL: '/auth',

  /**
   *
   * @var{string} REFRESH_TOKEN_URL The endpoint for refreshing an access_token. This endpoint should be proxied
   *    by Webpack dev server and maybe nginx in production (cleaner calls and avoids CORS issues).
   */
  REFRESH_TOKEN_URL: 'auth',

  /**
   * TODO: This is here temporarily because we are using an OAuth server and backend we don't own in this example.
   * Ultimately you want your real project backend take the request and add the client secret on the server-side
   * and forward the request onto an OAuth server. Your backend acts as a middle-man in the process, which
   * is better for situations like ddos attacks and so on.
   *
   * @var{string} CLIENT_SECRET Base64(client_id:client_secret) "demoapp:demopass"
   */
  CLIENT_SECRET: 'ZGVtb2FwcDpkZW1vcGFzcw==',

  /**
   * Initializes the Auth class.
   *
   * Creates a Vue-resource http interceptor to handle automatically adding auth headers
   * and refreshing tokens.
   *
   * @return {void}
   */
  initialize () {
    Vue.http.interceptors.push((request, next) => {
      const token = window.vue.$store.state.auth.accessToken
      const hasAuthHeader = request.headers.has('Authorization')

      if (token && !hasAuthHeader) {
        this.setAuthHeader(request)
      }

      next((response) => {
        if (this._isInvalidToken(response)) {
          return this._refreshToken(request)
        }
      })
    })
  },

  /**
   * Login
   *
   * @param {Object.<string>} creds The username and password for logging in.
   * @param {string|null} redirect The name of the Route to redirect to.
   * @return {Promise}
   */
  login (creds, redirect) {
    return window.vue.$http.post(this.LOGIN_URL, this._getLoginBody(creds), this._getLoginOptions())
      .then((response) => {
        this._storeToken(response)

        if (redirect) {
          window.vue.$router.push({ name: redirect })
        }

        return response
      })
      .catch((errorResponse) => {
        return errorResponse
      })
  },

  /**
   * Logout
   *
   * Clear all data in our Vuex store (which resets logged-in status) and redirect back
   * to login form.
   *
   * @return {void}
   */
  logout () {
    window.vue.$store.commit('CLEAR_ALL_DATA')
    window.vue.$router.push({ name: 'login' })
  },

  /**
   * Set the Authorization header on a Vue-resource Request.
   *
   * @param {Request} request The Vue-Resource Request instance to set the header on.
   * @return {void}
   */
  setAuthHeader (request) {
    request.headers.set('Authorization', 'Bearer ' + window.vue.$store.state.auth.accessToken)
    // The demo Oauth2 server we are using requires this param, but normally you only set the header.
    request.params.access_token = window.vue.$store.state.auth.accessToken
  },

  /**
   * Retry a request.
   *
   * @param {Request} request The Vue-resource Request instance to use to repeat an http call.
   * @return {Promise}
   */
  _retry (request) {
    return Vue.http(request)
      .then((response) => {
        return response
      })
      .catch((response) => {
        return response
      })
  },

  /**
   * Refresh the access token
   *
   * Make an ajax call to the OAuth2 server to refresh the access token (using our refresh token).
   *
   * @private
   * @param {Request} request Vue-resource Request instance, the original request that we'll retry.
   * @return {Promise}
   */
  _refreshToken (request) {
    return Vue.http.post(this.REFRESH_TOKEN_URL, this._getRefreshTokenBody(), this._getRefreshTokenOptions())
      .then((result) => {
        this._storeToken(result)
        this.setAuthHeader(request)

        // Retry the original request
        return this._retry(request)
      })
      .catch((errorResponse) => {
        if (this._isInvalidToken(errorResponse)) {
          this.logout()
        }
        return errorResponse
      })
  },

  /**
   * Store tokens
   *
   * Update the Vuex store with the access/refresh tokens received from the response from
   * the Oauth2 server.
   *
   * @private
   * @param {Response} response Vue-resource Response instance from an OAuth2 server.
   *      that contains our tokens.
   * @return {void}
   */
  _storeToken (response) {
    const auth = window.vue.$store.state.auth
    const user = window.vue.$store.state.user

    auth.isLoggedIn = true
    auth.accessToken = response.body.access_token
    auth.refreshToken = response.body.refresh_token
    // TODO: get user's name from response from Oauth server.
    user.name = 'John Smith'

    window.vue.$store.commit('UPDATE_AUTH', auth)
    window.vue.$store.commit('UPDATE_USER', user)
  },

  /**
   * Get the login options (including headers) to use in a Vue-resource http call.
   *
   * @private
   * @return {Object}
   */
  _getLoginOptions () {
    return {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + this.CLIENT_SECRET
      },
      emulateJSON: true
    }
  },

  /**
   * Get the login body (including username/password) to use in a Vue-resource http call.
   *
   * @private
   * @return {Object}
   */
  _getLoginBody (creds) {
    return {
      'grant_type': 'password',
      'username': creds.username,
      'password': creds.password
    }
  },

  /**
   * Get the refresh token options to use in a Vue-resource http call.
   *
   * @private
   * @return {Object}
   */
  _getRefreshTokenOptions () {
    // same as login options
    return this._getLoginOptions()
  },

  /**
   * Get the refresh token body to use in a Vue-resource http call.
   *
   * @private
   * @return {Object}
   */
  _getRefreshTokenBody () {
    return {
      'grant_type': 'refresh_token',
      'refresh_token': window.vue.$store.state.auth.refreshToken
    }
  },

  /**
   * Check if the Vue-resource Response is an invalid token response.
   *
   * @private
   * @param {Response} response The Vue-resource Response instance received from an http call.
   * @return {boolean}
   */
  _isInvalidToken (response) {
    return (response.status === 401 && response.data.error === 'invalid_token')
  }
}
