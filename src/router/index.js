import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'
import SupervisorTreeList from './router-modules/monitorLogin-router.js'

Vue.use(Router)

const rootRouter = [{
  path: '/',
  name: 'root',
  redirect: '/supervisor-treeList'
}]

var route = _.concat(rootRouter, SupervisorTreeList)

export default new Router({
  routes: route
})
