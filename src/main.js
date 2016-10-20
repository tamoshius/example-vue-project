/* Twitter Bootstrap JS/Sass */
require('bootstrap-sass')

/* Vue */
import Vue from 'vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
Vue.use(VueResource)

import './assets/style/app.scss'
import App from './components/App.vue'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
