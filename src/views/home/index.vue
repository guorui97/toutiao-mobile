<template>
  <div class="index">
    <van-tabs v-model="activeIndex">
      <van-tab v-for="(item,index) in channels" :title="item.name" :key="index">
        <!-- 要把当前的频道的信息给给子组件ArticleList -->
        <ArticleList
        :channel="item"
        @showMoreAction="hMoreAction"
        ></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 频道列表 开关 通过定位 -->
    <div class="bar-btn" @click="showChannelEdit=true">
        <van-icon name="wap-nav" size="24" />
    </div>
    <!-- 频道列表 -->

    <!-- 文章更多操作：反馈，举报.....
       第一次进来，showMoreAction是false,所以其下的 more-action 就不会创建出来
    -->
    <van-popup ref="vanPopup" :style="{width:'80%'}" v-model="showMoreAction">
        <!--
          监听不喜欢事件
          监听举报事件
          -->
      <more-action
        ref="refMoreAction"
        @dislike="hDislike"
        @report="hReport"></more-action>
    </van-popup>

     <!-- 频道列表
       - 传入父组件index.uve中的channels给子组件channel-edit显示
       - 传入父组件中当前频道的下标
     -->
    <van-action-sheet title="编辑频道" v-model="showChannelEdit">
      <!--
        channels  这是一个数组，
        在子组件内部，如果通过push来给这个数组添加了元素，
        则父组件中的值也受影响。
      -->
      <channel-edit
       :activeIndex="activeIndex"
       :channels="channels"
       @updateCurIndex="hUpdateCurIndex"
       @updateCurChannel="hUpdateCurChannel"
       @close="hCloseChannelEdit"
        >
     </channel-edit>
    </van-action-sheet>

  </div>
</template>

<script>
// 导入接口
import { getChannels } from '@/api/channel.js'
import { dislikeArticle, reportArticle } from '@/api/article.js'
// 引入更多操作 组件
import MoreAction from './moreAction.vue'

// 引入编辑频道 组件
import ChannelEdit from './channelEdit.vue'

// 引入文章列表组件
import ArticleList from './articleList.vue'
export default {
  name: 'HomeIndex',
  data () {
    return {
      // 申明数据
      activeIndex: 0, // 当前活动频道的下标(不是频道的编号)
      channels: [], // 我订阅的频道
      showMoreAction: false, // 控制显示弹层
      articleId: null, // 当前要操作的文章编号
      showChannelEdit: false // 控制频道编辑显示弹层
    }
  },
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
  },
  created () {
    this.getChannels123()
  },
  methods: {
    // 关闭编辑频道弹层
    hCloseChannelEdit () {
      this.showChannelEdit = false
    },
    // 更新当前选中频道下标
    hUpdateCurIndex (index) {
      this.activeIndex = index
    },
    // 把当前的传的channel处于 选中状态
    hUpdateCurChannel (channel) {
      // 计算 channel 在当前频道列表中的下标
      this.activeIndex = this.channels.findIndex(it => it.id === channel.id)
    },
    delArticle () {
      //  去articleList中删除对应的文章
      // 通过事件总线发布事件,传递参数

      // 参数中，只传要删除的文章编号是不够，还要传入当前的频道编号
      // 因为在多个频道中 可能有共同的文章。
      this.$eventBus.$emit('delArticle', {
        articleId: this.articleId,
        channelId: this.channels[this.activeIndex].id// 当前频道编号
      })
    },
    async hReport (typeId) {
      // typeId就是在moreAction组件中抛出来的举报类型
      // 1. 调用接口
      const result = await reportArticle(this.articleId, typeId)
      console.log(result)
      // 2. 退出弹层
      this.showMoreAction = false

      // happy
      this.$toast.success('操作成功')
      // 3. 删除对应的文章
      this.delArticle()
    },
    async hDislike () {
      // 收到moreAction中的点击动作， 不喜欢文章

      // 1. 调用接口
      const result = await dislikeArticle(this.articleId)
      console.log(result)
      // 2. 退出弹层
      this.showMoreAction = false

      // happy
      this.$toast.success('操作成功')

      // 3.删除对应的文章
      this.delArticle()
    },
    hMoreAction (articleId) {
      // 处理子组件articleList中的点击 X 事件
      // 1. 显示弹窗，确保它的isReport是flase
      console.log('从子组件articleList中传递要删除的文章编号是', articleId)
      this.showMoreAction = true

      // 确保它的isReport是flase
      if (this.$refs.refMoreAction) {
        // 在父组件中去修改子组件的数据
        // this.$refs.refMoreAction就是子组件
        this.$refs.refMoreAction.isReport = false
      }
      // console.log(this.$refs.refMoreAction)
      // 2.保存当前要操作的文章编号，备用
      this.articleId = articleId
    },
    async getChannels123 () {
      const result = await getChannels()
      console.log(result)
      // 把接口返回的数据保存在channels数据项中
      this.channels = result.data.data.channels
    }
  }
}
</script>
<style lang="less" scoped>
// 如果样式加了scoped（作用域）,则会变成私有的
// 实现私有样式的原理：
// 1.给dom添加data-v-XXXXXXX属性名
// 2.给选择器的末尾补上这个属性选择器
// .index[data-v-5954443c] {
//   padding-top: 1.33333rem;
// }
// .index .van-tabs__wrap[data-v-5954443c] {
//   position: fixed;
//   top: 1.22667rem;
//   left: 0;
//   right: 0;
// }
// .index .van-tabs--line[data-v-5954443c] {
//   padding-top: 1.33333rem;
// }

// 由于是在 选择器的末尾补上这个属性选择器 ，所以它不能去覆盖子组件中的样式
// 如果一定要父组件中去覆盖子组件的样式：
// 方法一： 不要写成scoped. 此时，样式就是全局的。
// 方法二： 在保持scoped的情况下，还可以使用/deep/
// 主页
.index{
    padding-top:50px; // 让出layout组件中title的高度
    margin-bottom: 50px; // 让出layout组件中底部固定路导航的高度
    /deep/ .van-tabs__wrap {
      position:fixed;
      top:46px;
      left:0px;
      right:30px;
      z-index: 1;

    }
    /deep/ .van-tabs--line{
        padding-top:50px; // 让出van-tabs的高度
    }

    .bar-btn{
      position: fixed;
      right: 5px;
      top: 52px;
      display: flex;
      align-items: center;
      background-color: #fff;
      opacity: 0.8;
      z-index:1
  }
  }

</style>
