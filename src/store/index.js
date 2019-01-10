import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import vehicleManage from './modules/vehicleManage'
import accountManage from './modules/accountManage'
import moduleManage from './modules/moduleManage'
import adManage from './modules/adManage'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    vehicleManage,
    accountManage,
    adManage,
    moduleManage,
  },
  getters
})

export default store
