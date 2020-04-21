/**
 * 文章搜索
 */
import request from '@/utils/request'

/**
 * 获取系统提示的搜索建议
 * @param {*} keyword 关键字
 */
export function getSearchSuggestions (keyword) {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'GET',
    // 它是一个get类型的接口，所以是params
    params: {
      q: keyword
    }
  })
}

/**
 * 获取搜索结果
 * @param {*} params ｛page,per_page,qs｝
 */
export function getSearch (params) {
  return request({
    url: '/app/v1_0/search',
    method: 'GET',
    // 它是一个get类型的接口，所以是params
    params
  })
}
