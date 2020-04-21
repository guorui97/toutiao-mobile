import request from '@/utils/request'

/**
 * 添加评论 (也可以用来添加对文章评论的回复)
 * target integer 必须  评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
   content string 必须  评论内容
  art_id integer 非必须  文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。
对文章进行评论，不要传此参数。
 */
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}

/**
 * 获取文章评论（也可以获取评论回复）
 *  * @param {*} params
 * type 是 a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
   source 是 源id，文章id或评论id
   offset 否 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
   limit 否 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
 */
export const getComments = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}
