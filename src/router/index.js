import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    roles: ['0', '1', '2', '3', '4'],
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { roles: ['0', '1', '2', '3', '4'] }
    }]
  },

  {
    path: '/user',
    component: Layout,
    roles: ['0'],
    children: [
      {
        path: 'userList',
        name: '用户列表',
        component: () => import('@/views/management/user/list'),
        meta: { title: '用户列表', icon: 'user', roles: ['0'] }
      }
    ]
  },

  {
    path: '/game',
    component: Layout,
    roles: ['0', '1', '2', '3', '4'],
    children: [
      {
        path: 'gameList',
        name: '游戏列表',
        component: () => import('@/views/management/game/list'),
        meta: { title: '游戏列表', icon: 'form', roles: ['0', '1', '2', '3', '4'] }
      }
    ]
  },

  {
    path: '/organ',
    component: Layout,
    roles: ['0', '1', '2', '3', '4'],
    children: [
      {
        path: 'organList',
        name: '机构列表',
        component: () => import('@/views/management/organ/list'),
        meta: { title: '机构列表', icon: 'nested', roles: ['0', '1', '2', '3', '4'] }
      }
    ]
  },

  {
    path: '/intervention',
    component: Layout,
    roles: ['0', '4'],
    children: [
      {
        path: 'interventionList',
        name: '干预日志列表',
        component: () => import('@/views/management/intervention/list'),
        meta: { title: '干预日志列表', icon: 'link', roles: ['0', '4'] }
      }
    ]
  },

  {
    path: '/gameLog',
    component: Layout,
    roles: ['0', '4'],
    children: [
      {
        path: 'gameLogList',
        name: '用户游戏日志列表',
        component: () => import('@/views/management/gameLog/list'),
        meta: { title: '用户游戏日志列表', icon: 'link', roles: ['0', '4'] }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
