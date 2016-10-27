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
