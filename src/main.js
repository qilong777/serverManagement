import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import api from 'api'

import './icons' // icon
import './permission' // permission control

Vue.use(Element)
Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
