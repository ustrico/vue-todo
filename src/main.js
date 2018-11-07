import Vue from 'vue'
import App from './App'
import router from './router'
import Vuels from 'vue-ls'
require('es6-object-assign').polyfill()

Vue.use(Vuels, { namespace: 'vue__' })
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
