// 对axios进行二次封装
import axios from 'axios'

// 如何在.js模块中去使用vuex中的数据
import store from '@/store/index.js'

// 处理大数
import JSONBig from 'json-bigint'
const request = axios.create({
  // 基地址
  baseURL: 'http://ttapi.research.itcast.cn',
  // 收到了后端回来的数据可以在这里用JSONbig来处理一下大数 问题
  transformResponse: [function (data) {
    return data ? JSONBig.parse(data) : {}
  }]

})

// 请求拦截器
// 只是axios请求，在发出去之前都要到这里来执行一下
request.interceptors.request.use(function (config) {
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

// const request2 = axios.create({
//   // 基地址
//   baseURL: 'http://ttapi.research.itcast.cn/XXXX'
// })

export default request
