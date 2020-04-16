<template>
  <div>
    <van-pull-refresh v-model="isLoadingNew" @refresh="onRefresh">
      <!--van-list:自带有下拉加载更多的效果-->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="讨厌，人家被你看完了"
        @load="onLoad"
      >
        <van-cell v-for="(item,index) in list" :key="index" :title="item.title">
          <!--
            label是一个插槽名，是van-cell组件中提供的。它的作用是让元素在标题的正下方
            -->
          <div slot="label">
            <!--
              图片
              有几张图，分成几列

              van-grid： 宫格。
            -->
            <van-grid :column-num="item.cover.images.length">
              <van-grid-item v-for="(img,idx) in item.cover.images" :key="idx">
                <van-image lazy-load :src="img" />
              </van-grid-item>
            </van-grid>

            <!-- 文字说明 -->
            <div class="meta">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <!-- relativeTime成为一个全局过滤器来使用
                这里的结果就是：relativeTime(item.pubdate)的返回值
               -->
              <span>{{item.pubdate | relativeTime}}</span>

              <!--
                登陆用户可以看见 X
                依据：只有登陆用户才有vuex 中 user
               -->
              <span class="close" v-if="$store.state.user" @click="hMoreAction(item.art_id)">
                <van-icon name="cross"></van-icon>
              </span>

            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script>
// 引入接口
import { getArticles } from '@/api/article'

export default {
  name: 'ArticleList',
  props: {
    // 从父组件中获取当前的频道信息
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 文章列表数据
      isLoadingNew: false, // 是否正在下拉刷新
      loading: false, // 当前是否正在取数据，它来控制菊花
      finished: false, // 控制当手指向上滑时，是否再去触发loading
      timestamp: null // 保存本次请求数据要用到的时间戳
    }
  },
  created () {
    console.log(`创建articleList,当前是${this.channel.id}频道`)
    // 在创建articleList时去监听
    // 监听事件总线上的delArticle事件
    // 当事件发生时，去执行第二个参数（就是这个函数）
    // obj就是在$emit()时，传过来的参数。
    this.$eventBus.$on('delArticle', (obj) => {
      console.log(`收到了delArticle事件，当前是${this.channel.id}频道`)
      console.log('参数是', obj)
      // 判断是不是要在我这个列表中删除？
      // 是不是当前频道？
      if (obj.channelId === this.channel.id) {
        // 在list中找到id为 obj.articleId的文章，并删除
        const idx = this.list.findIndex(it => it.art_id.toString() === obj.articleId)
        if (idx !== -1) {
          // 找到了
          this.list.splice(idx, 1)
        }
      }
    })
  },
  methods: {
    hMoreAction (bigintObj) {
      // 在request中封装了对大数的处理，所以这里的article_artId不是一个数值
      // 而是一个bigint对象，要获取它真正的数据，要通过toString

      // 在文章列表上 点击某个文章的 X
      // 预期的目标是：在index.vue中弹出 更多操作。
      //              就是要去修改index.uve中showMoreAction设为true

      // 通过自定义事件，告诉父组件去弹窗

      this.$emit('showMoreAction', bigintObj.toString())
    },
    // 下拉加载的具体代码
    async onRefresh () {
      // 1. 发请求，取回最新的文章
      console.log('上拉刷新加载新数据.....')
      const result = await getArticles({
        channel_id: this.channel.id, // 当前的频道ID
        timestamp: Date.now(), // 请求最新的推荐数据传当前的时间戳
        with_top: 1
      })
      // 2. 添加到list中,是加在list数组的头部还是尾部？
      // 确定是要放在头部
      const arr = result.data.data.results
      this.list.unshift(...arr)

      const msg = arr.length ? `刷新成功${arr.length}` : '没有最新数据'
      this.$toast(msg)

      // 3.修改下拉刷新的状态
      this.isLoadingNew = false
    },
    // onLoad:执行时机：
    // 1. 页面打开，van-list内容不足一屏，则会自动调用
    // 2. 手动上拉，也会执行
    async onLoad () {
      console.log('加载新数据.....')
      const result = await getArticles({
        channel_id: this.channel.id, // 当前的频道ID
        timestamp: this.timestamp || Date.now(),
        // 请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1
      })
      // 把取回来的数据放在 data中的数据项中
      const arr = result.data.data.results
      // 1.1 把取回来的数组arr中的数据放入 this.list中。
      //    相当于是要把数组arr中的内容 填充到数组this.list.
      this.list.push(...arr)

      // 1.2 更新一下，下一次请求时发的时间戳
      this.timestamp = result.data.data.pre_timestamp

      // 2. 加载状态结束
      this.loading = false

      // 3.判断是否全部的数据已经加载完成
      if (arr.length === 0) {
        this.finished = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.meta {
  display:flex;
  span {
    margin-right:10px;
  }
  .close{
    // 让它在最右边
    // 它的父级容器是flex的，给当前元素设置左外边距为auto，会让这个元素在父级容器
    // 的最右边
    margin-left:auto;
  }
}
</style>
