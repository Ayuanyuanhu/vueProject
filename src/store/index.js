import Vuex from 'vuex'
import Vue from 'vue'

import windowStore from './modules/window-store'
import dialogPoolStore from './modules/dialog-pool-store'

Vue.use(Vuex)

const _opt = {
  modules: {
    windowStore,
    dialogPoolStore
  }
}

export default new Vuex.Store(_opt)
