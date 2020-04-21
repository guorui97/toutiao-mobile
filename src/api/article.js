// 所有与文章相关的操作
import request from '@/utils/request'

/**
 * 获取文章列表信息
 * @param {*} data
 *
 * {
 *   channel_id: 频道ID,
 *   timestamp: 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
 *   with_top:1
 * }
 */
export const getArticles = (data) => {
  return request({
    url: '/app/v1_1/articles',
    method: 'GET',
    params: data
  })
}

/**
 * 不喜欢指定的文章
 * @param {*} articleId 文章
 */
export const dislikeArticle = (articleId) => {
  return request({
    url: '/app/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: articleId
    }
  })
}

/**
 * 举报文章
 * @param {*} articleId 编号
 * @param {*} type 类型编号
 */
export const reportArticle = (articleId, type) => {
  return request({
    url: '/app/v1_0/article/reports',
    method: 'POST',
    data: {
      target: articleId,
      type: type
    }
  })
}

/**
 * 获取文章详情
 * @param {*} articleId 文章编号
 */
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/articles/' + articleId
  })
}

/**
 * 取消点赞
 * @param {*} articleId 文章编号
 */
export const deleteLike = (articleId) => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/article/likings/' + articleId
  })
}

/**
 * 给文章点赞
 * @param {*} articleId 文章编号
 */
export const addLike = (articleId) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}
