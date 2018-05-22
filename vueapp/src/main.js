import Vue from 'vue'
import App from './App.vue' 
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router/index.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Hamburgers from '../dist/hamburgers/dist/hamburgers.css'
import { store }  from './store' 
window.$ = window.jQuery = require('jquery')

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios, Hamburgers)
Vue.config.productionTip = false;

var vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
