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
        >
        <van-icon name="close" @click="hRemoveHistory(idx)" />
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
    // 在搜索建议上点击
    hClickSuggestion (idx) {
      // 取出原数据
      const str = this.searchSuggestions[idx]
      this.addSearchHistory(str)
    },
    // 点击 搜索按钮
    hClickSearchInput () {
      if (this.keyword) {
        this.addSearchHistory(this.keyword)
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
    async hSearch () {
      // 用户没有输入内容
      if (!this.keyword) {
        return
      }
      // 调接口，取回搜索建议
      const result = await getSearchSuggestions(this.keyword)
      console.log(result)
      // 后端返回的数据
      // 在此基础上，把关键字 高亮出来
      // "javascript"
      //   java高亮
      //  "javascript"   ------>    "<span style="color:red">java</span>cript"
      //  本质：字符串替换： 把java   -----> <span style="color:red">java</span>
      // 这个数据是没有高亮的，不能直接在视图上使用，所以我们去创建一个计算属性
      this.searchSuggestions = result.data.data.options
    }
  },
  watch: {
    // 当searchHistories变化时，它会执行
    searchHistories (newVal, oldVal) {
      // console.log(newVal, oldVal)
      // 保存到localstorage
      setItem('searchHistories', newVal)
    }
  }
}
</script>

<style lang="" scoped>

</style>
