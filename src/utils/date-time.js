// 提供用来处理日期时间的工具模块
import dayjs from 'dayjs'

// 引入中文语言包
import 'dayjs/locale/zh-cn'

// 引入插件 dayjs/plugin/relativeTime
// 具备计算相对时间的功能
import rTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')
dayjs.extend(rTime)

export const relativeTime = function (yourTime) {
  // 使用dayjs提供的api对用户传入的时间 yourTime
  // 进行格式化，以返回一个相对时间
  return dayjs().to(dayjs(yourTime))
  // console.log(yourTime)
  // return dayjs(yourTime).format('DD/MM/YYYY')
}
