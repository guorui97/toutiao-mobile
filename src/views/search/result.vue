<template>
  <div class="serach-result">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$route.query.keyword+'的搜索结果'"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 文章列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,idx) in list"
        :key="idx"
        :title="item.title"
         @click="$router.push('/article/'+item.art_id)"
      />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
// 获取当前传递的参数，并访问接口，获取数据，渲染页面
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 当前要查询的页数
      per_page: 10 // 每页 10条
    }
  },

  methods: {
    async onLoad () {
      const result = await getSearch({
        page: this.page,
        per_page: this.per_page,
        q: this.$route.query.keyword
      })
      console.log(result)

      // 把结果添加到list中
      this.list.push(...result.data.data.results)
      // 页码+1
      this.page++

      this.loading = false
      if (result.data.data.results.length === 0) {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #3196fa;
  .van-nav-bar__title {
    color: #fff;
  }
  // 搜索结果页 后退按钮为白色
  .van-icon{
    color:#fff;
  }
}
</style>
