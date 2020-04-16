import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // // 后面接一个箭头函数。
    // const f = () =>  {
    //   return import('../views/login/index.vue')
    // }
    // 它的返回就是import进来这个组件
    // 组件懒加载 ：只有当你访问这个路由时，它才会去加载这个组件
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'Home', component: () => import('../views/home/index.vue') },
      { path: '/question', name: 'Question', component: () => import('../views/question/index.vue') },
      { path: '/video', name: 'Video', component: () => import('../views/video/index.vue') },
      { path: '/user', name: 'User', component: () => import('../views/user/index.vue') }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue')
  },
  {
    path: '/search/result',
    name: 'searchResult',
    component: () => import('../views/search/result.vue')
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
