// 把所有用户操作的功能，全写在这里
// import XXXX from "另一个模块a"： 要求在这个模块a中一定要有export default
import request from '@/utils/request'

/**
 * 由于这个接口需要token，所以我们去vuex中取出来，并
 * 传入参数
 * 获取用户信息
 */
export function getInfo () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'

  })
}

/**
 * 用户登陆
 * @param {Object} user 用户信息
 */
export function login (user) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: user
  })
}

/**
 * 退出
 * @param {*} user
 */
export function logout (user) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: user
  })
}

// 修改个人信息
