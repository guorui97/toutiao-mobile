// 对axios进行二次封装
import axios from 'axios'

// 如何在.js模块中去使用vuex中的数据
import store from '@/store/index.js'

// 引入路由
import router from '@/router/index.js'
// 处理大数
import JSONBig from 'json-bigint'

const request123 = axios.create({
  // 基地址
  baseURL: 'http://ttapi.research.itcast.cn',
  // 收到了后端回来的数据可以在这里用JSONbig来处理一下大数 问题
  transformResponse: [function (data) {
    return data ? JSONBig.parse(data) : {}
  }]

})

// 请求拦截器
// 只是axios请求，在发出去之前都要到这里来执行一下
request123.interceptors.request.use(function (config) {
  // config这个参数在拦截器工作时，会自动传入值，它的值就是当前请求的配置
  // 如果想在这里加toke，怎么办？
  // 只需给config中的headers中补充一个属性:Authorization: "Bearer XXXXXXXX"
  const user = store.state.user
  // 如果当前没有user,有就带上它的token
  if (user) {
    console.log('请求拦截器', Date.now())
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.dir(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// Add a 响应拦截器 interceptor
request123.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, async function (error) {
  // 有错误到这里来,只处理401错误(是由token过期，错误导致)。
  if (error.response.status === 401) {
    if (store.state.user && store.state.user.refresh_token) {
      try {
        // 用refresh_token去求一个特殊的接口以获取新的token
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })

        // 从接口返加值中去取出新token，更新到当前的vuex中
        // mutations去改token
        store.commit('updateToken', result.data.data.token)
        console.log('更新token ok')
        // console.log(result)
        // error.config 就是当前错误发生时，axios中的配置

        // 更新了token请求重发一次
        return request123(error.config)
        // store.state.user.token = result.data.data.token
      } catch (e) {
        console.log('更新token，refresh_token 失败')
        // 消除vuex的token
        store.commit('setUser', null)
        // 必须要重新登陆
        router.push({
          path: '/login',
          query: {
            // router中有一个属性currentRoute
            from: router.currentRoute.fullPath
          }
        })
      }
    } else {
      console.log('没有refresh token,准备去重新登陆吧')
      router.push({
        path: '/login',
        query: {
          // router中有一个属性currentRoute
          from: router.currentRoute.fullPath
        }
      })
    }
    console.log('响应拦截器')
    console.dir(error)
  } else {
    return Promise.reject(error)
  }
})

// const request2 = axios.create({
//   // 基地址
//   baseURL: 'http://ttapi.research.itcast.cn/XXXX'
// })

export default request123
