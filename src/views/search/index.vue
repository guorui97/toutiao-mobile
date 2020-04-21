<template>
<div>
    <!-- 搜索组件一级路由   $router.back()返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 当用户在输入框中写入内容时去调用接口 -->
    <van-search
      show-action
      placeholder="请输入搜索关键词"
      shape="round"
      @input="hSearch"
      v-model.trim="keyword"
      >
      <div slot="action" @click="hClickSearchInput">搜索</div>
    </van-search>

    <!-- 联想建议 与 搜索历史记录互斥
      如果用户在搜索框中输入了内容，则显示联想建议，
      否则，显示搜索历史
    -->
    <van-cell-group v-if="keyword">
      <van-cell
      v-for="(item,idx) in cSearchSuggestions"
      :key="idx"
      @click="hClickSuggestion(idx)"
      icon="search">
        <div v-html="item"></div>
      </van-cell>

    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
      </van-cell>
      <van-cell
        v-for="(item,idx) in searchHistories"
        :title="item"
        :key="idx"
        @click="hClickHistory(item)"
        >
        <!-- 阻止在关闭图标上的点击事件冒泡给父元素 -->
        <van-icon name="close" @click.stop="hRemoveHistory(idx)" />
      </van-cell>

    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
// 实现搜索记录持久化
// 在添加，或者删除searchHistories时，要同时保存到localstroage
import { getItem, setItem } from '@/utils/storage'
import { getSearchSuggestions } from '@/api/search'
export default {
  name: 'Search',
  data () {
    return {
      timer: null, // 计时器
      keyword: '', // 搜索关键字
      searchSuggestions: [], // 搜索建议列表
      searchHistories: getItem('searchHistories') || [] // 搜索历史记录
    }
  },
  computed: {
    // 补充一个计算属性对searchSuggestions中的数据做高亮
    cSearchSuggestions () {
      // 创建正则表达式
      const reg = new RegExp(this.keyword, 'gi')
      return this.searchSuggestions.map(str => {
        // 原来是：str
        // 替换成:对关键字进行高亮之后的字符串
        const str1 = str.replace(reg, function (obj) {
          return `<span style="color:red">${obj}</span>`
        })
        return str1
      })
    }
  },
  methods: {
    // 在历史记录上点击
    hClickHistory (str) {
      this.addSearchHistory(str)
      // 跳入搜索结果页，并传入参数
      // http://localhost:8080/#/search/result?keyword=abc
      setTimeout(() => {
        this.$router.push({
          name: 'searchResult',
          query: {
            keyword: str
          }
        })
      })
    },
    // 在搜索建议上点击
    hClickSuggestion (idx) {
      // 取出原数据
      const str = this.searchSuggestions[idx]
      // 当我们修改了搜索历史之后，watch不是立即执行的,watch是一个异步的
      this.addSearchHistory(str)
      // this.$nextTick(callback)
      // 跳入搜索结果页，并传入参数
      // http://localhost:8080/#/search/result?keyword=abc
      setTimeout(() => {
        // 过一会再去跳转路由，因为要让watch先去执行
        this.$router.push({
          name: 'searchResult',
          query: {
            keyword: str
          }
        })
      // alert('2.hClickSuggestion')
      })
    },
    // 点击 搜索按钮
    hClickSearchInput () {
      if (this.keyword) {
        this.addSearchHistory(this.keyword)

        // 跳入搜索结果页，并传入参数
        // http://localhost:8080/#/search/result?keyword=abc
        setTimeout(() => {
          // 过一会再去跳转路由，因为要让watch先去执行
          this.$router.push({
            name: 'searchResult',
            query: {
              keyword: this.keyword
            }
          })
        })
      }
    },
    // 删除指定位置的记录记录
    hRemoveHistory (idx) {
      this.searchHistories.splice(idx, 1)
    },
    // 添加历史记录
    addSearchHistory (str) {
      // 1.添加历史记录
      // 1.1不要有重复项
      // 1.2最近搜索的记录应该在最上面
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        // 说明当前的搜索关键字，已经在前面的搜索记录存在了
        // 要调整顺序：把它放在最前面
        // 删除它
        this.searchHistories.splice(index, 1)
      }
      // unshift是在头部添加
      this.searchHistories.unshift(str)
    },
    // 搜索联想提示
    // async hSearch () {
    //   // 用户没有输入内容
    //   if (!this.keyword) {
    //     return
    //   }
    //   // 调接口，取回搜索建议
    //   const result = await getSearchSuggestions(this.keyword)
    //   console.log(result)
    //   // 后端返回的数据
    //   // 在此基础上，把关键字 高亮出来
    //   // "javascript"
    //   //   java高亮
    //   //  "javascript"   ------>    "<span style="color:red">java</span>cript"
    //   //  本质：字符串替换： 把java   -----> <span style="color:red">java</span>
    //   // 这个数据是没有高亮的，不能直接在视图上使用，所以我们去创建一个计算属性
    //   this.searchSuggestions = result.data.data.options
    // }

    // 防抖：抖:高频的运动。不要让你抖，抖也没有用。
    // 思路：
    //   当这个函数被调用时，不立刻执行，而是延迟10秒执行。
    //   如果在这10秒内再次调用了这个函数，则从当前被调用的时间开始算，
    //      再延迟10秒。 (整个10秒内，不能被打断,一旦打断，就要重新计时)。
    //   如果在这10秒内没有再次调用这个函数，10秒后执行代码。
    //  (等电梯)
    // hSearch () {
    //   console.log(this.keyword)
    //   console.log(`当前的定时器是${this.timer}`)
    //   if (this.timer) {
    //     console.log(`消除当前的定时器${this.timer}`)
    //     clearTimeout(this.timer)
    //   }
    //   this.timer = setTimeout(async () => {
    //     // 用户没有输入内容
    //     if (!this.keyword) {
    //       return
    //     }
    //     // 调接口，取回搜索建议
    //     const result = await getSearchSuggestions(this.keyword)
    //     console.log(result)

    //     this.searchSuggestions = result.data.data.options
    //   }, 0.3 * 1000)
    //   console.log(`开启10s执行的定时器是${this.timer}`)
    // }

    // 节流：水龙头。把水龙头关到最小，让它一滴一滴向下滴水。效果就是降低了水流的频率。
    // 思路是：
    //     如果这个函数距离上一次被调用的时间之间相隔不到10秒，则本次调用，不执行代码
    //     两次有效调用时间，并且至少相隔10秒。
    // 搜索联想提示
    hSearch () {
      console.log(this.keyword)
      // 只有this.timer是null，才会去开启下一个定时器
      if (!this.timer) {
        // 只要setTimeout一执行，this.timer就有值了
        this.timer = setTimeout(async () => {
          this.timer = null

          // 用户没有输入内容
          if (!this.keyword) {
            return
          }
          // 调接口，取回搜索建议
          const result = await getSearchSuggestions(this.keyword)

          this.searchSuggestions = result.data.data.options
        }, 0.3 * 1000)
      }
    }
  },
  watch: {
    // 当searchHistories变化时，它会执行
    searchHistories (newVal, oldVal) {
      alert('1.watch')
      // alert('保存搜索记录')
      // console.log(newVal, oldVal)
      // 保存到localstorage
      setItem('searchHistories', newVal)
    }
  }
}
</script>

<style lang="" scoped>

</style>
