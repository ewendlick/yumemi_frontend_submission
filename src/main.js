import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.prototype.$resas = axios.create({
  baseURL: 'https://opendata.resas-portal.go.jp/',
  timeout: 3000,
  headers: { 'X-API-KEY': 'P3WnKW86UFdPZ4fwNYFZU0C9pCnmkZmUlnQUuyOB' } // TODO: API key in .env file
})

new Vue({
  render: h => h(App)
}).$mount('#app')
