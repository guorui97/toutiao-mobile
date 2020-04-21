// 把所有用户操作的功能，全写在这里
// import XXXX from "另一个模块a"： 要求在这个模块a中一定要有export default
import request from '@/utils/request'

/**
 * 由于这个接口需要token，所以我们去vuex中取出来，并
 * 传入参数
 * 获取用户信息
 */
export function getProfile () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'

  })
}

/**
 * 获取用户自已的信息
 */
export function getInfo () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
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

/**
 * 关注指定用户
 * @param {数值} userId 用户编号
 */
export function followUser (userId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取关指定用户
 * @param {数值} userId 用户编号
 */
export function unFollowUser (userId) {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/user/followings/' + userId
  })
}

/**
 * 修改用户信息
 * @param {*} data
 * 请求的字段参数 发送几个保存几个，不发送的不修改
 */
export function updateUserInfo (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}

/**
 * 修改用户的头像
 * @param {*} formData  参数是formData格式
 */
export function updatePhoto (formData) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data: formData
  })
}
