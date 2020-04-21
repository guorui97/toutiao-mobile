import Vue from 'vue'
import Vuex from 'vuex'

import { setItem, getItem, removeItem } from '@/utils/storage'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 保存公共数据
    // vuex的初始值从localStorage中去取
    user: getItem('user'),
    photo: getItem('photo') // 用户头像的地址
  },
  mutations: {
    // 修改头像
    updatePhoto (state, photo) {
      state.photo = photo
      // 把这个信息做持久化
      setItem('photo', photo)
    },
    // 更新用户token
    updateToken (state, newToken) {
      // 只是更新了vuex中的数据token
      state.user.token = newToken

      // 把这个信息做持久化
      setItem('user', state.user)
    },
    // vuex中的要求： 只有通过mutation才能去修改state
    setUser (state, obj) {
      state.user = obj

      // 把这个信息做持久化
      setItem('user', obj)
    },
    delUser (state) {
      state.user = null
      // 在本地存储中删除vuex
      removeItem('user')
    }
  },
  actions: {
  },
  modules: {
  }
})
