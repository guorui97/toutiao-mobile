import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { relativeTime } from '@/utils/date-time'
// 引入Vant所有的组件
// 在vant这模块中如下两种导出模块的方式同时存在:
// export default  默认导出
// export {Lazyload}  普通导出
//
// 在导入的时，XXX ---> Vant
//            Lazyload 就是 普通导出 Lazyload
// import Vant, { Lazyload } from 'vant'

// 按需引入在项目中用到组件
import {
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Button,
  NavBar,
  Toast,
  Tabs,
  Tab,
  List,
  Lazyload,
  CellGroup,
  Cell,
  Icon,
  Grid,
  GridItem,
  Popup,
  Row,
  Col,
  Tag,
  Image,
  PullRefresh,
  ActionSheet,
  Dialog,
  Search,
  DatetimePicker

} from 'vant'

// 用它的样式
import 'vant/lib/index.css'

// 它会根据的手机尺寸来调整rem的基准值：html标签上的font-size。
import 'amfe-flexible'

// 引入项目中全局样式
import './styles/index.less'

// 用一下组件
// Vue.use(Vant)

Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
Vue.use(NavBar)
Vue.use(Toast)
Vue.use(Tabs)
Vue.use(Tab)
Vue.use(List)
Vue.use(Lazyload)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Icon)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Popup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Image)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Dialog)
Vue.use(Search)
Vue.use(DatetimePicker)

// 使用懒加载
// Vue.use(Lazyload)

// 挂载事件总线
// prototype是构造器的原型对象。
// Vue是构造器。
// 给Vue这个构造器的原型上添加一个属性：
//     名为$eventBus(名字可以更改)
//     值为new Vue()

// 则在所有组件内部，可以通过this.$eventBus来访问这个事件总线

Vue.prototype.$eventBus = new Vue()

// 定义一个全局过滤器
// relativeTime是在/utils/date-time.js中定义的
Vue.filter('relativeTime', relativeTime)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
console.log(1)
