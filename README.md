# VueJS 2.0 Example Project

## Table of Contents
1. [Install Node](#install-node)
2. [Install Vue-CLI](#install-vue-cli)
3. [Add Dependencies](#add-dependencies)
4. [Configure JQuery](#configure-jquery)
5. [Configure Sublime Text 3](#configure-sublime-text-3)
6. [Configure ESLint](#configure-eslint)
7. [Setup Main and Routes](#setup-main-and-routes)
8. [Run the Dev Server](#run-the-dev-server)

## Install Node

#### Install Node and NPM (Using PPA to get latest version)

Get the setup script:

```shell
$ cd ~
$ curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
```

Inspect that you have the script, then run with `sudo`:

    $ vim nodesource_setup.sh
    $ sudo bash nodesource_setup.sh

Now install Nodejs:

    $ sudo apt-get install nodejs

The nodejs package contains the nodejs binary as well as npm, so you don't need to install npm separately. However, in order for some npm packages to work (such as those that require compiling code from source), you will need to install the build-essential package:

    $ sudo apt-get install build-essential

## Install Vue-CLI

Change directory to the directory where you want this example project to reside:

    # an example folder will be created here on the next step...
    $ cd ~
    
Install Vue-cli with webpack:


    $ sudo npm install -g vue-cli
    $ vue init webpack example-vue-project

You'll get some output like this:

    ? Project name: example-vue-project
    ? Project description: A Vue.js project
    ? Author: Your Name <your-name@email.com>
    ? Vue comes in two build versions, which do you want to use? Standalone
    ? Use ESLint to lint your code? Y
    ? Pick an ESLint preset (Feross/Standard or AirBnB or none) none # we'll use a vue specific preset based on Standard
    ? Setup unit tests with Karma + Mocha? Y
    ? Setup e2e tests with Nightwatch? Y

    vue-cli Generated "example-vue-project"

Install dependencies in `package.json`:

    $ cd my-project 
    $ npm install

## Add Dependencies

Install Vuex, Vue Router, and Vue Resource

    $ npm install vuex vue-router vue-resource --save
    
Install jQuery, Bootstrap and Font-Awesome

    $ npm install jquery bootstrap-sass font-awesome --save-dev

Install Vue ESLint plugin

    $ npm install eslint-config-vue eslint-plugin-vue --save-dev

 Install sass builders:
 
    npm install sass-loader node-sass --save-dev
    
 *(This concludes all extra dependencies, however feel free to check the `package.json` in the Github repo)*

## Configure JQuery

#### Option #1: Use ProvidePlugin

Add the [ProvidePlugin](https://webpack.github.io/docs/list-of-plugins.html#provideplugin) to the plugins array in both `build/webpack.dev.conf.js` and `build/webpack.prod.conf.js` so that jQuery becomes globally available to all your modules:

    plugins: [

      // ...

      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })
    ]

#### Option #2: Use Expose Loader module for webpack

Alternatively you can add the [Expose Loader](https://www.npmjs.com/package/expose-loader)  package:

    npm install expose-loader --save-dev

Use in your entry point `main.js` like this:

    import 'expose?$!expose?jQuery!jquery'

    // ...

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

#### /eslintrc.js

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

## Setup Main and Routes

#### src/main.js

```js
import Vue from 'vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import './assets/app.scss'  // <-- create this file and you can put some global styles there
import App from './components/App.vue'  // <-- or you could just keep your global styles here instead

Vue.use(VueResource)

new Vue({
  router,
  store,  // inject store to all children
  render: h => h(App)
}).$mount('#app')

```
#### src/routes.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Signup from './components/Signup.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/signup', name: 'signup', component: Signup },
    { path: '/', name: 'dashboard', component: Dashboard, beforeEnter: guardRoute }
  ]
})

function guardRoute (to, from, next) {
  // work-around to get to the Vuex store (as of Vue 2.0)
  var auth = router.app.$options.store.state.auth

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

    $ mkdir store
    
Now let's create the following files that will comprise our central Vuex storage.

#### Vuex State

Let's setup the state of our central data storage, which will consist of Authentication data and User data. Also, when the app bootstraps, we want to first check in the browser's localStorage and retrieve all of our previously stored data.

#### /src/store/state.js

```js
/* globals localStorage */
export const STORAGE_KEY = 'example-vue-project'

var initialState = {
  'auth': {
    'isLoggedIn': false
  }
}

if (localStorage.getItem(STORAGE_KEY)) {
  initialState = JSON.parse(localStorage.getItem(STORAGE_KEY))
}

export const state = initialState
```

#### Vuex Mutations, Getters, and Actions

Now create a file to hold all the methods that will change the state in our Vuex store:

#### /src/store/mutations.js

```js
export const updateAuth = (state, auth) => {
  state.auth = auth
}
```

And some getters (although you can accesss the Vuex state directly as we'll see shortly):

#### /src/store/getters.js

```js
export const user = state => state.user
```

We'll also go ahead and add an actions file (but leave it empty for this project since we don't need it):

#### /src/store/actions

```js
// Here is where you can put async operations.
// See the Vuex official docs for more information.

// ...

```

#### Vuex Plugins
Plugins offer a nice approach to hook into mutations and do things like logging or syncing with another store such as `localStorage` or `websockets`:

#### /src/store/plugins.js

```js
/* globals localStorage */
import { STORAGE_KEY } from './state'

const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  })
}

export default [localStoragePlugin]
```

#### Vuex index.js

And bring it all together in the index.js file:

#### /src/store/index.js

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
#### Auth Script

Now let's add our auth script:

#### /src/auth.js

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


## Proxy Api Calls in Webpack Dev Server

When using Webpack for Hot Reloading, we'll need to tell the webpack dev server that `/api` calls need to be reverse proxied to another server (ie. running on node express, nginx, or some embedded server in your backend IDE).

Notice in `build/dev-server.js` this line:

    // proxy api requests
    Object.keys(proxyTable).forEach(function (context) {
      var options = proxyTable[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(context, options))
    })
    
In this setup we are using: https://github.com/chimurai/http-proxy-middleware (you can see examples there). So let's add options to our config to make this work:

In `config/index.js`, update the *proxyTable* object to look like this:

    dev:  {
    
        // ...
        
        proxyTable: {
          '/auth': {
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
            target: 'http://localhost:8081',  // api server
            changeOrigin: true,               // needed for virtual hosted sites
            ws: true,                         // proxy websockets
            pathRewrite: {
              '^/api': '/backend-service'     // rewrite path localhost:8080/api to localhost:8081/backend-service
            },
            router: {
              // when request.headers.host == 'dev.localhost:3000',
              // override target 'http://www.example.org' to 'http://localhost:8000'
              // 'dev.localhost:3000': 'http://localhost:8000'
            }
          }
        },
        
## Components

Delete the `App.vue` file located in /src folder:

    $ rm App.vue        
    
In the `/src/components` folder create the following vue files (just copy these directly from the repo on Github):

    /src
        /components
            - App.vue
            - AppFooter.vue
            - AppTitle.vue
            - Dashboard.vue
            - Login.vue
            - Navbar.vue
            - Signup.vue

Take a look through these components and see how they interact with each other.

## Bootstrap & FontAwesome

To configure Bootstrap, add a folder `style` to your `/assets` directory and create the following sass files:

#### /src/assets/style/_variables.scss

    $bootstrap-sass-asset-helper: true !default;
    
    //== Iconography
    //
    //## Specify custom location and filename of the included Glyphicons icon font. Useful for those including Bootstrap via Bower.
    
    //** Load fonts from this directory.
    
    // [converter] If $bootstrap-sass-asset-helper if used, provide path relative to the assets load path.
    // [converter] This is because some asset helpers, such as Sprockets, do not work with file-relative paths.
    $icon-font-path: '../../../../node_modules/bootstrap-sass/assets/fonts/bootstrap/';
    
    //== Footer
    $footer-padding-vertical:   60px !default;
    $footer-height:             260px !default;

#### /src/assets/style/bootstrap/_bootstrap.scss

    @import './variables';
    @import '../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap';
    @import '../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/theme';

Create another folder called `font-awesome` and add this file:

#### /src/assets/style/font-awesome/_font-awesome.scss

    $fa-font-path:"../../node_modules/font-awesome/fonts";
    @import "../../../../node_modules/font-awesome/scss/font-awesome";
    .icon-user {
      @extend .fa;
      @extend .fa-user;
    }

Now you are ready to import and use Bootstrap and FontAwesome in your components!

## Images and Other Assets

Create an images folder at `src/assets/images` then cut an paste the Vue `logo.png` file that resides in the assets folder by default. The Navbar component uses a relative link to this image, which Webpack will resolve for us automatically.

You can read more about static assets here: https://vuejs-templates.github.io/webpack/static.html

## Run the Dev Server

Run the dev server:

    cd ~/my-project 
    npm run dev

Open your browser and visit http://localhost:8080 . You should see something like this:
    
          
<img src="images/screenshot1.png" width=800" />  