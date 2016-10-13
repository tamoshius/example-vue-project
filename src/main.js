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
