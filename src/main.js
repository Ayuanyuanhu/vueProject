// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/themes/default/css/main.css'
import './assets/themes/default/css/app.css'
import './assets/fonts/icon.css'
import config from './assets/config/env-config.json'
import { windowTypes, dialogTypes } from './types'

Vue.config.productionTip = false

Vue.prototype.CONFIG = config

// window窗口变化，记录窗口大小
window.onresize = () => {
  store.commit(windowTypes.REFRESH)
}

// 打开一个dialog,返回promise, resolve的参数是弹框内组件的试图模型
Vue.prototype.$openDialog = options => {
  return new Promise((resolve, reject) => {
    const promise = store.dispatch(dialogTypes.OPEN_DIALOG, options)
    promise.then(vm => {
      resolve(vm)
    }).catch(err => {
      console.err('Dialog Error: ' + err)
    })
  })
}
// 关闭一个dialog
Vue.prototype.$closeDialog = name => {
  store.commit(dialogTypes.CLOASE_DIALOG, name)
}

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  render: h => h(App),
  components: { App }
})
