import Vue from 'vue'
import Vuex from 'vuex'

import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 保存公共数据
    // vuex的初始值从localStorage中去取
    user: getItem('user')
  },
  mutations: {
    // 补充一个mutation来设置 user
    // vuex中的要求： 只有通过mutation才能去修改state
    setUser (state, obj) {
      state.user = obj

      // 把这个信息做持久化
      setItem('user', obj)
    }
  },
  actions: {
  },
  modules: {
  }
})
