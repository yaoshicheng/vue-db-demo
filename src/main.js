import Vue from 'vue'
import VCharts from 'v-charts'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import { getToken,setToken } from '@/utils/auth'

// import './mock' // simulation data

import * as filters from './filters' // global filters

let search = window.location.search;
let access_token = (search.indexOf("=")>-1)? search.split('=')[1]:null;
access_token = access_token || getToken();
if(access_token){
  setToken(access_token);
  let url = `${location.protocol}//${location.host}/${location.hash}`;
  location.href = url.replace(location.search,'');
}else{
  const hostStr = window.location.host;
  let uriStr = "https://dev-sso.deepblueai.com";
  if(hostStr){
    if(hostStr.toLowerCase().startsWith("localhost")){
      uriStr = "https://dev-sso.deepblueai.com";
    }else if(hostStr.toLowerCase().startsWith("dev-")){
      uriStr = "https://dev-sso.deepblueai.com";
    }else if(hostStr.toLowerCase().startsWith("test-")){
      uriStr = "https://test-sso.deepblueai.com";
    }else if(hostStr.toLowerCase().startsWith("uat-")){
      uriStr = "https://uat-sso.deepblueai.com";
    }else{
      uriStr = "https://sso.deepblueai.com";
    }
  }
  window.location.href = `${uriStr}/api/auth/login?redirect_to=${location.protocol}//${location.host}/${location.hash}`;
}

import './permission' // permission control

Vue.use(VCharts);

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Element)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
