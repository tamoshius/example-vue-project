# VueJS 2.0 Example Project (and Tutorial)

A scalable Single Page Application (SPA) example. This example uses Vue-cli, VueRouter, Vuex, VueResource and more. Clone the repo, do `npm install`, and use right away or read through this tutorial below to get an idea of how to build the project from scratch and setup Sublime Text.

## Table of Contents
1. [Todo](#todo)
1. [Install Node](#install-node)
2. [Install Vue-CLI](#install-vue-cli)
3. [Add Dependencies](#add-dependencies)
4. [Configure JQuery and Lodash](#configure-jquery-and-lodash)
5. [Global Utilities](#global-utilities)
6. [Configure Sublime Text 3](#configure-sublime-text-3)
7. [Configure ESLint](#configure-eslint)
8. [Setup Main and Routes](#setup-main-and-routes)
9. [Setup Authentication (OAuth2), User Profile, and Vuex](#setup-authentication-user-profile-and-vuex)
10. [Proxy Api Calls in Webpack Dev Server](#proxy-api-calls-in-webpack-dev-server)
11. [Components](#components)
12. [Twitter Bootstrap Configuration](#twitter-bootstrap-configuration)
13. [Fonts and Font-Awesome](#fonts-and-font-awesome)
14. [Images and Other Assets](#images-and-other-assets)
15. [App.scss](#app-scss)
16. [Unit Testing and End-to-End Testing](#unit-testing-and-end-to-end-testing)
17. [Run the Dev Server](#run-the-dev-server)
18. [Vue Dev Tools](#vue-dev-tools)

## Todo

- Currently, remote calls are made to an online example OAuth2 demo server [here](http://brentertainment.com/oauth2/) by Brent Shaffer. We can remove this and instead setup up a Node.js Express OAuth2. 
- Add a section in this tutorial about working in a production environment.

## Install Node

#### Install Node and NPM (Using PPA to get latest version)

Get the setup script:

```shell
$ cd ~
$ curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
```

Inspect that you have the script, then run with `sudo`:

```shell
$ vim nodesource_setup.sh
$ sudo bash nodesource_setup.sh
```

Now install Nodejs:

```shell
$ sudo apt-get install nodejs
```

The nodejs package contains the nodejs binary as well as npm, so you don't need to install npm separately. However, in order for some npm packages to work (such as those that require compiling code from source), you will need to install the build-essential package:

```shell
$ sudo apt-get install build-essential
```

## Install Vue-CLI

Change directory to the directory where you want this example project to reside:

```shell
# an example folder will be created here on the next step...
$ cd ~
``` 
  
Install Vue-cli with webpack:

```shell
$ sudo npm install -g vue-cli
$ vue init webpack example-vue-project
```

You'll get some output like this:

```
? Project name: example-vue-project
? Project description: A Vue.js project
? Author: Your Name <your-name@email.com>
? Vue comes in two build versions, which do you want to use? Standalone
? Use ESLint to lint your code? Y
? Pick an ESLint preset (Feross/Standard or AirBnB or none) none # we'll use a vue specific preset based on Standard
? Setup unit tests with Karma + Mocha? Y
? Setup e2e tests with Nightwatch? Y

vue-cli Generated "example-vue-project"
```

Install dependencies in `package.json`:

```shell
$ cd my-project 
$ npm install
```

## Add Dependencies

Install Vuex, Vue Router, and Vue Resource

```shell
$ npm install vuex vue-router vue-resource --save
``` 

Install jQuery, Bootstrap, Font-Awesome, and Lodash

```shell
$ npm install jquery bootstrap-sass font-awesome lodash --save-dev
```

Install Vue ESLint plugin

```shell
$ npm install eslint-config-vue eslint-plugin-vue --save-dev
```

Install babel-polyfill (for example, transpiling es6 promises, so that tests will work in testing browsers...see section on "Unit Testing and End-to-End Testing" further down).

```shell
npm install babel-polyfill --save-dev 
```

 Install sass builders:

```shell
$ npm install sass-loader node-sass --save-dev
```
  
 *(This concludes all extra dependencies, however feel free to check the `package.json` in the Github repo)*

## Configure JQuery and Lodash

#### Option #1: Use ProvidePlugin

Add the [ProvidePlugin](https://webpack.github.io/docs/list-of-plugins.html#provideplugin) to the plugins array in both `build/webpack.dev.conf.js` and `build/webpack.prod.conf.js` so that jQuery and Lodash become globally available to all your modules:

```js
  plugins: [
    
    // ...
      
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery',
      '_': 'lodash',
      utils: 'utils'
    })
  ]
```

*Note: The `utils` property is for a set of utility functions we want global to all modules. See the section [Global Utilities](#global-utilities) for more information on how this is set up.*

#### Option #2: Use Expose Loader module for webpack

Alternatively you can add the [Expose Loader](https://www.npmjs.com/package/expose-loader)  package:

```shell
npm install expose-loader --save-dev
```

Use in your entry point `main.js` like this:

```shell
import 'expose?$!expose?jQuery!jquery'

// ...
```
## Global Utilities

Using the `ProvidePlugin` in the previous section, we were able to include jQuery and Lodash in all modules that used it. But these were from node_modules. What if we want to do this with one of our own modules from our project. In the previous section you can see we added `utils` to the ProvidePlugin. Now let's actually create a module (in the Node form) in our `src/` directory for keeping these utilities we want globally:

#### src/utils.js

```js

module.exports = {

  /**
   * A simple example to handle the error from a response.
   *
   * @param {Object} context The Vue component with an error data property we can set.
   * @param {Response} response The Vue-resource Response that we will try to get errors from.
   */
  handleError: function (context, response) {
    if (context.hasOwnProperty('error') && response.body.hasOwnProperty('error_description')) {
      context.error = response.body.error_description
    }
  }
}

``` 

In the section [Configure ESLint](#configure-eslint) you will notice we have added **utils** to the globals so that the linter will not complain when we use it. 

For the `utils` to work in the ProvidePlugin you could just require it directly, but it gives a warning and build fails (because it's an expression). So let's work around this by adding it to the set of aliases in `webpack.base.conf.js`:

#### build/webpack.base.conf.js

```js

module.exports = {
  
  // ...
  
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue': 'vue/dist/vue',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      // alias so we can use the ProvidePlugin to make utils available to each module using them
      'utils': path.resolve(__dirname, '../src/utils')
    }
  },

  // ...
  
 }
```
Take a look in the `Login.vue` component to see how we use this utility to display an error message (when login credentials are invalid).

## Configure Sublime Text 3

#### Install Package Control
https://packagecontrol.io/installation

#### Install Babel syntax definitions for ES6 JavaScript

 * Go to `Preferences > Package Control > Install Package` or press `ctrl+shift+p` (Win, Linux) or `cmd+shift+p` (OS X) and  search for "Package Control: Install Package".
 * Search for the package "Babel" and install it.
 * Open any .js file in Sublime. Then go to `View > Syntax > Open all with current extension as... > Babel > Javascript (Babel)`.

#### Install a theme that works well with Babel. 
For example, here's how you can install the **Oceanic Next** theme:

 * Try the Oceanic Next theme: `Open Package Control -> Install Package` and search for Oceanic Next color theme.
 * Go to `Preferences > Oceanic Next Color theme > Oceanic next`.

#### Setup soft tabs and 2 space indention

 * Open any .js file. Go to `Preferences > Settings - More > Syntax Specific - User`.
 * It should open a file like `JavaScript (Babel).sublime-settings`
 * Add these parameters to the file:  

```
{
  "extensions":
  [
    "js"
  ],
  "tab_size": 2,
    "translate_tabs_to_spaces": true
}

```
 * Open any .vue file and repeat this process.


#### Install Sublime-linter and ESLinter

 * Open `Package Control: Install Package` and search for `SublimeLinter` and install it.
 * Search for `SublimeLinter-contrib-eslint` and install it as well.
 * Restart Sublime.

## Configure ESLint

Let's configure eslint. You'll need to restart Sublime each time you makes changes to this file. One thing to point out is the `env` and `globals` properties. These are necessary so eslint doesn't complain about use of these globals in our JS files (and so we don't have to add something like `/* globals localStorage */` to the top of those files to suppress the errors). See other sections in this tutorial, [Configure JQuery](#configure-jquery) and [Global Helpers](#global-helpers) for information about working in a global context in Webpack.

#### eslintrc.js

```js
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'vue',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
```

## Setup Main and Routes

#### src/main.js

```js
/* Twitter Bootstrap JS/Sass */
require('bootstrap-sass')

/* Vue */
import Vue from 'vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
Vue.use(VueResource)

/* App sass */
import './assets/style/app.scss'

/* App component */
import App from './components/App.vue'

/* Create and Mount our Vue instance */
new Vue({
  // Attach the Vue instance to the window,
  // so it's available globally.
  created: function () {
    window.vue = this
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/* Auth initialize */
import Auth from './auth'
Auth.initialize()

```
#### src/routes.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    // Each of these routes are loaded asynchronously, when a user first navigates to each corresponding endpoint.
    // The route will load once into memory, the first time it's called, and no more on future calls.
    // This behavior can be observed on the network tab of your browser dev tools.
    {
      path: '/login',
      name: 'login',
      component: function (resolve) {
        require(['./components/Login.vue'], resolve)
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: function (resolve) {
        require(['./components/Signup.vue'], resolve)
      }
    },
    {
      path: '/',
      name: 'dashboard',
      component: function (resolve) {
        require(['./components/Dashboard.vue'], resolve)
      },
      beforeEnter: guardRoute
    }
  ]
})

function guardRoute (to, from, next) {
  // work-around to get to the Vuex store (as of Vue 2.0)
  const auth = router.app.$options.store.state.auth

  if (!auth.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default router

```

## Setup Authentication, User Profile, and Vuex

Create a folder called `store` in the `src` directory:

```shell
$ mkdir store
``` 
  
Now let's create the following files that will comprise our central Vuex storage.

### Vuex State

Let's setup the state of our central data storage, which will consist of Authentication data and User data. Also, when the app bootstraps, we want to first check in the browser's localStorage and retrieve all of our previously stored data.

#### src/store/state.js

```js
/* globals localStorage */

// Set the key we'll use in local storage.
// Go to Chrome dev tools, application tab, click "Local Storage" and "http://localhost:8080"
// and you'll see this key set below (if logged in):
export const STORAGE_KEY = 'example-vue-project'

let initialState = {
  'auth': {
    'isLoggedIn': false,
    'accessToken': null,
    'refreshToken': null
  },
  'user': {
    'name': null
    // ...more user profile properties can go here.
  }
}

// Check local storage for our key and retrieve the data, if it exists,
// otherwise use defaults.
if (localStorage.getItem(STORAGE_KEY)) {
  initialState = JSON.parse(localStorage.getItem(STORAGE_KEY))
}

export const state = initialState

```

### Vuex Mutations, Getters, and Actions

Now create a file to hold all the methods that will change the state in our Vuex store:

#### src/store/mutations.js

```js
export const UPDATE_AUTH = (state, auth) => {
  state.auth = auth
}

export const UPDATE_USER = (state, user) => {
  state.user = user
}

/**
 * Clear each property, one by one, so reactivity still works.
 *
 * (ie. clear out state.auth.isLoggedIn so Navbar component automatically reacts to logged out state,
 * and the Navbar menu adjusts accordingly)
 *
 * TODO: use a common import of default state to reset these values with.
 */
export const CLEAR_ALL_DATA = (state) => {
  // Auth
  state.auth.isLoggedIn = false
  state.auth.accessToken = null
  state.auth.refreshToken = null

  // User
  state.user.name = ''
}


```

And some getters (although you can accesss the Vuex state directly as we'll see shortly):

#### src/store/getters.js

```js
export const user = state => state.user
```

We'll also go ahead and add an actions file (but leave it empty for this project since we don't need it):

#### src/store/actions.js

```js
// Here is where you can put async operations.
// See the Vuex official docs for more information.

// ...

```

### Vuex Plugins
Plugins offer a nice approach to hook into mutations and do things like logging or syncing with another store such as `localStorage` or `websockets`:

#### src/store/plugins.js

```js
/* globals localStorage */
import { STORAGE_KEY } from './state'

const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

    if (mutation.type === 'CLEAR_ALL_DATA') {
      localStorage.removeItem(STORAGE_KEY)
    }
  })
}

export default [localStoragePlugin]

```

### Vuex index.js

And bring it all together in the index.js file:

#### src/store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import { state } from './state'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import plugins from './plugins'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins
})

export default store
```
### Auth Script

Now let's add our auth script. Here we handle getting **OAuth2** access_tokens and automatically refreshing them.

#### src/auth.js

```js
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

```

Checkout out `Login.vue` component to see how we use `Auth`. Also take a look at `Dashboard.vue` component, you can see the Vue-resource http interceptors let us not worry about including authorization headers in our AJAX calls. The interceptors also take care of refreshing tokens behind the scenes. See the comments marked "TODO" for some caveats with this demo and your own project. I hope to update this demo using a Node Express OAuth2 server for better demonstration of Auth flow. 

## Proxy Api Calls in Webpack Dev Server

When using Webpack for Hot Reloading, we'll need to tell the webpack dev server that `/api` calls need to be reverse proxied to another server (ie. running on node express, nginx, or some embedded server in your backend IDE). For production you would just use nginx to do the proxying. The big advantage is we don't have to worry about CORS and also we don't expose the true API endpoints to the client.

Notice in `build/dev-server.js` this line:

```js
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})
```
  
In this setup we are using: https://github.com/chimurai/http-proxy-middleware (you can see examples there). So let's add options to our config to make this work:

In `config/index.js`, update the *proxyTable* object to look like this:

```js
dev:  {

    // ...
    
    proxyTable: {
      '/auth': {
        // TODO: Update to use node express oauth2 server for better example.
        target: 'http://brentertainment.com/oauth2/lockdin/token',  // <-- demo oauth2 server, https://github.com/bshaffer/oauth2-demo-php
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/auth': ''
        },
        router: {
        }
      },
      '/api': {
        target: 'http://brentertainment.com/oauth2',  // api server
        changeOrigin: true,               // needed for virtual hosted sites
        ws: true,                         // proxy websockets
        pathRewrite: {
          '^/api': '/lockdin'     // rewrite path localhost:8080/api to http://brentertainment.com/oauth2/lockdin
        },
        router: {
          // when request.headers.host == 'dev.localhost:3000',
          // override target 'http://www.example.org' to 'http://localhost:8000'
          // 'dev.localhost:3000': 'http://localhost:8000'
        }
      }
    },
    
    // ...
}
```
      
## Components

Delete the `App.vue` file located in /src folder:

```shell
$ rm App.vue
```
  
In the `/src/components` folder create the following vue files (just copy these directly from this repo):

```
/src
  /components
    - App.vue
    - AppFooter.vue
    - PageTitle.vue
    - Dashboard.vue
    - Login.vue
    - Navbar.vue
    - Signup.vue
```

Take a look through these components and see how they interact with each other.

## Twitter Bootstrap Configuration

To configure Bootstrap, add a folder `style` to your `/assets` directory and create the following sass files:

#### src/assets/style/_bootstrap.scss

```scss
@import './variables';
@import '../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap';
@import '../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/theme';
```

#### src/assets/style/_variables.scss

```scss
$bootstrap-sass-asset-helper: true !default;

$icon-font-path: '../../../../node_modules/bootstrap-sass/assets/fonts/bootstrap/';

// copy and paste here everything else from the original Bootstrap _variables.scss

```

Take a look at some of the components (ie. `PageTitle` component). You'll see we import these variablese so we can use them in our component styling.

## Fonts and Font-Awesome

Create a folder `fonts` and add your font files there:



```
/src
   /assets
      /fonts
	     /lato
		    Lato-Black.eot
		    Lato-Black.ttf
		    Lato-Black.woff
		    Lato-Black.woff2
		   
		   // etc. more fonts
```

Then back in your style folder, add a `_fonts.scss` stylesheet. We'll setup your fonts and also `font-awesome` here:

#### src/assets/style/_fonts.scss

```scss
/* Font Awesome */
$fa-font-path:"../../../node_modules/font-awesome/fonts";
@import "../../../node_modules/font-awesome/scss/font-awesome";

/* Webfont: Lato-Black */
@font-face {
    font-family: 'LatoWebBlack';
    src: url('../fonts/lato/Lato-Black.eot'); /* IE9 Compat Modes */
    src: url('../fonts/lato/Lato-Black.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
         url('../fonts/lato/Lato-Black.woff2') format('woff2'), /* Modern Browsers */
         url('../fonts/lato/Lato-Black.woff') format('woff'), /* Modern Browsers */
         url('../fonts/lato/Lato-Black.ttf') format('truetype');
    font-style: normal;
    font-weight: normal;
    text-rendering: optimizeLegibility;
}
```

## Images and Other Assets

Create an images folder at `src/assets/images` then cut an paste the Vue `logo.png` file that resides in the assets folder by default. The Navbar component uses a relative link to this image, which Webpack will resolve for us automatically.

You can read more about static assets here: https://vuejs-templates.github.io/webpack/static.html

## App scss

Bring everything to together into an `app.scss` file that we import in our main entry:

#### src/assets/style/app.scss

```
@import './bootstrap';
@import './fonts';

html, body, #app {
  height: 100%;
  margin: 0;
  background-color: #F5F5F5;
  font-family: $font-family-sans-serif;
  font-size: 16px;
  color: #000;
}

/* Input form */

.form-control{
  box-shadow: none;
  border: 1px solid #dedede;
  padding: 6px 20px;
  height: 50px;
  background: none;
  color: #282828;
  border-radius: 0;
}

.form-control:focus{
  box-shadow: none;
}
```

Of course if this file gets too big, you can break it up into different supporting files: `_forms.scss`, `_blah-blah.scss`, etc. And import each of them as you do with the bootstrap and font files.

## Unit Testing and End-to-End Testing

Make sure you installed `babel-polyfill` earlier in this tutorial. If you didn't, you can install it with:  

```shell
npm install babel-polyfill --save-dev 
```

A unit test is included from the Webpack template already. It's a simple example that tests the content outputted from the Hello vue component:

#### test/unit/specs/Hello.spec.js

```js
import Vue from 'vue'
import Hello from 'src/components/Hello'

describe('Hello.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(Hello)
    })
    expect(vm.$el.querySelector('.hello h1').textContent).to.equal('Hello Vue!')
  })
})
```

#### End-to-End Testing with Nightwatch.js and Selenium server

I find End-to-End testing and Integration testing even more beneficial. Vue-cli has put together a nice setup that includes Nightwatch.js (which uses Selenium and a Chrome driver) for e2e testing right out of the box. Let's remove the existing test located at `test/e2e/specs/test.js` since it will no longer work with the changes we have made. Let's add a new test that tests that our login form works and that we can reach the dashboard:

#### test/e2e/specs/loginTest.js

```js
// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

/**
 * Test that user can login and see dashboard.
 */
module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)

      // Assert that user can see login.
      .assert.elementPresent('.login')
      .setValue('.js-login__username', 'demouser')
      .setValue('.js-login__password', 'testpass')
      .click('.js-login__submit')
      .pause(1000)

      // Assert that user can see dashboard.
      .assert.containsText('.page-title h2', 'MY DASHBOARD')
      .pause(2000)
      .end()
  }
}

```

*Note: You may wish to add another `assert` that asserts the dashboard is unreachable when a user is logged out.*

#### Running the Tests

Now let's run both the unit test and the e2e test. Make sure you are in your project directory, then:

```shell
npm run test
```

You should see some output initially showing the results of each unit test ran:

> Hello.vue
    ✓ should render correct contents  
    ...  
    PhantomJS 2.1.1 (Linux 0.0.0): Executed 1 of 1 SUCCESS (0.018 secs / 0.004 secs)
TOTAL: 1 SUCCESS  
    
Then the Selenium server will fire up Chrome browser and run the e2e tests to see if those pass:

>  ✔ Element <#app> was visible after 43 milliseconds.  
 ✔ Testing if element <.login> is present.  
 ✔ Testing if element <.page-title h2> contains text: "MY DASHBOARD".  
 ...  
OK. 3 assertions passed. (18.522s)  

You can of course run unit tests and e2e tests seperately with: `npm run unit` and `npm run e2e`.

## Run the Dev Server

Run the dev server:

```shell
$ cd ~/example-vue-project 
$ npm run dev
```

Open your browser and visit http://localhost:8080 . You should see something like this:
    
          
<img src="docs/images/home-page.png" width=1200" />  

## Vue Dev Tools

Visit the Chrome Web Store to get the [Vue Dev Tools extension](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)  for helping debug Vue.js applications.

Once installed, Open Chrome dev tools and go to the "Vue" tab.

#### Vuex Tab
If you click on the "Vuex" tab, you can see all data from the store in the right pane. Click the `export button` to copy the data to the clipboard. Click the `import button` and paste the clipboard data there. 

For example, you can alter the *accessToken* to something invalid (to simulate an expired *oauth access_token* without waiting on actual expiration) in the pasted data. Then click the `import button` again and the Vuex store will live update. Now you can confirm that the automatic refreshToken interceptor works.