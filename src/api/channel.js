// 把所有与频道操作有关的代码全写在这里

import request from '@/utils/request'

/**
 * 获取当前的频道
 */
export const getChannels = () => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'GET'
  })
}

/**
 * 获取系统所有的频道
 */
export const getAllChannels = () => {
  // 默认请求类型就是get
  return request({
    url: '/app/v1_0/channels'
  })
}

/**
 * 间接实现添加频道的功能：把当前的，用户选中的所有频道列表传入
 * channels:[]
 *    [{id:1,seq:1},{id:10,seq:2}]
 *
 * 不要 传入 推荐频道 。
 *  不要 传入 推荐频道
 *  不要 传入 推荐频道
 */
export const addChannel = (channels) => {
  // 默认请求类型就是get
  return request({
    url: '/app/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
}

/**
 * 删除频道
 * @param {*} channels  [1,16,9] 要删除的频道的编号
 */
export const deleteChannels = (channels) => {
  // 默认请求类型就是get
  return request({
    url: '/app/v1_0/user/channels',
    method: 'DELETE',
    data: {
      channels
    }
  })
}
