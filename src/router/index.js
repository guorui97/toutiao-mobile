import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'

// 就是把store/index.js中的export default 的内容
// 保存在store中，store这个名，是可以改的。
import store from '@/store/index.js'

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
      // meta就是定义路由时一个特殊的设置项，名就是meta,它的值是一个自定义的对象，其中可以放一些数据信息
      { path: '', name: 'Home', component: () => import('../views/home/index.vue'), meta: { isKeepAlive: true } },
      { path: '/question', name: 'Question', component: () => import('../views/question/index.vue') },
      { path: '/video', name: 'Video', component: () => import('../views/video/index.vue') },
      { path: '/user', name: 'User', component: () => import('../views/user/index.vue') }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue'),
    meta: { isKeepAlive: true }
  },
  {
    path: '/search/result',
    name: 'searchResult',
    component: () => import('../views/search/result.vue')
  },
  {
    // 定义路由时，写的是:id
    // 则在路由接收参数时，也要写params.id
    path: '/article/:id',
    name: 'articleDetail',
    component: () => import('../views/article/index.vue')
  },
  {
    // 修改用户资料
    path: '/user/profile',
    name: 'userProfile',
    component: () => import('../views/user/profile.vue')
  },
  {
    // 小智同学聊天机器人
    path: '/user/chat',
    name: 'userChat',
    component: () => import('../views/user/chat.vue')
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

// beforeEach是由VueRouter提供的
// 每当路由变化 时，在跳入到目标路由之前就会执行这个函数
// A ---> B
router.beforeEach(function (to, from, next) {
  // to   : 目地 B
  // from : 从哪里 A
  // next ：是一个函数，可以用来做路由的跳转
  console.log(to, from, next)
  if (isOk(to)) {
    next() // 不加参数，就是允许进入到to路由
  } else {
    // 回到登陆页
    // 不忘初心。
    // 如果用户没有登陆，他现在的路由是 "/a1/b"
    //   它要访问的是 "/user"
    //   它就被路由守卫跳转到了 "/login"
    // 问:当它在/login中成功登陆之后，应该要跳回到哪里去？
    // A: 主页
    // B: /user (正解)
    next({
      path: '/login',
      query: {
        from: to.fullPath // 让它可以找到来时的路 /user
      }
    })
  }
})

// 写具体的规则
// 如何在index.js文件中，得知当前用户是否有登陆？
// 答：通过vuex中的store来判定

// 在组件内部，可以通过this.$store来访问vuex
// 在一个普通的js文件中，如何去获取vuex中的数据？
// import XXXX from "@/store/index.js"

function isOk (to) {
  // 检查是否允许访问
  // 如果你访问的路由是以"/user"开头，则一定要是登陆状态，否则不允许
  if (to.path.startsWith('/user') && !store.state.user) {
    // console.log(to)
    return false
  } else {
    return true
  }
}

export default router
