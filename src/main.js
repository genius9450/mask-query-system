import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueGeolocation from 'vue-browser-geolocation'
import 'element-ui/lib/theme-chalk/display.css'
import './registerServiceWorker'
import VueInstall from "vue-pwa-install"

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(axios)
Vue.use(VueGeolocation)
Vue.use(VueInstall)

new Vue({
  render: h => h(App),
}).$mount('#app')
