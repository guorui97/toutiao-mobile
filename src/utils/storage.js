// 封装一个模块，来使用localStorage

/**
 * 获取storage
 */
export const getItem = (name) => {
  return JSON.parse(localStorage.getItem(name))
}

/**
   * 设置storage
   * @param {*} name
   * @param {*} data
   */
export const setItem = (name, data) => {
  return localStorage.setItem(name, JSON.stringify(data))
}

/**
   * 删除storage
   * @param {*} name
   */
export const removeItem = (name) => {
  localStorage.removeItem(name)
}
