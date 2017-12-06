import { windowTypes } from '@/types'

const state = {
  windowHeight: window.innerHeight,
  windowWidth: window.innerWidth
}

const getters = {
  [windowTypes.WINDOW_SIZE]: state => {
    return {
      width: state.windowWidth,
      height: state.windowHeight
    }
  }
}

const mutations = {
  [windowTypes.REFRESH] (state) {
    state.windowHeight = window.innerHeight
    state.windowWidth = window.innerWidth
  }
}

export default {
  state,
  getters,
  mutations
}
