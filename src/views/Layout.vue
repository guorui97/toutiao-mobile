<template>
  <div class="container">
  <!--如果当前是/user，则要隐藏van-nav-bar -->
    <van-nav-bar
      v-show="$route.path!=='/user'"
      title="黑马头条"
      right-text="搜索"
      fixed
      @click-right="hRearch"
    />
    <router-view>
    </router-view>
    <van-tabbar route>
    <!-- 标签栏支持路由模式，用于搭配vue-router使用。
    路由模式下会匹配页面路径和标签的to属性，并自动选中对应的标签-->
      <van-tabbar-item icon="home-o" to='/'>主页</van-tabbar-item>
      <van-tabbar-item icon="search" to='/question'>问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to='/video'>视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to='/user'>我的</van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {

    }
  },
  methods: {
    hRearch () {
      // 跳入搜索页
      this.$router.push('/search')
    }
  }
}
</script>

<style lang="" scoped>

</style>
