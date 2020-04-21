<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,idx) in list"
        :key="idx"
        :title="item.content"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime}}</span>
            <van-button size="mini" type="default" @click="hReplay(item)">{{item.reply_count}}回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model.trim="commentText"
      >
        <van-button
        slot="button"
        size="mini"
        type="info"
        @click="hAddComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      round
      position="bottom"
      :style="{height:'85%'}"
    >
       <!--在父组件中把数据传给子组件 -->
      <comment-reply
        v-if="isReplyShow"
        @close="isReplyShow=false"
        :comment="currentComment">
      </comment-reply>
    </van-popup>
     <!-- 评论回复 -->

  </div>
</template>

<script>
import { addComment, getComments } from '@/api/comment'
import CommentReply from './commentReply.vue'
export default {
  name: 'ArticleComment',
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  components: {
    CommentReply
  },
  data () {
    return {
      isReplyShow: false, // 是否显示评论回复
      currentComment: {}, // 当要去回复评论
      commentText: '', // 当前评论的内容
      list: [], // 评论列表
      offset: null, // 列表数据的偏移量，实现类似分页的效果，要传给后端
      loading: false, // 上拉加载更多的 loading
      finished: false // 是否加载结束
    }
  },

  methods: {
    // 在某一条评论的 回复 按钮上点击
    hReplay (item) {
      // 展示回复组件
      this.isReplyShow = true

      // 更新当前 正在回复的评论
      this.currentComment = item
    },
    // 给文章添加评论
    async hAddComment () {
      // 1. 获取当前评论的内容
      if (!this.commentText) {
        return
      }

      // 2. 调用接口，实现添加评论的功能
      const result = await addComment({
        target: this.articleId, // 文章编号
        content: this.commentText
      })
      // 把从接口中返回的数据，添加到评论列表中
      // 3. 最加入的评论应该在数组头部
      this.list.unshift(result.data.data.new_obj)

      // 4. 文本框清空
      this.commentText = ''
    },
    async onLoad () {
      //    type 是 a或c 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      //    source 是 源id，文章id或评论id
      //    offset 否 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据

      // 1. 请求数据
      const result = await getComments({
        type: 'a', // 对文章(article)的评论
        source: this.articleId, // 文章id
        offset: this.offset
      })

      // 2. 将数据添加到列表中
      this.list.push(...result.data.data.results)

      // 加载状态结束
      this.loading = false

      if (result.data.data.results.length) {
        // 更新一下offset
        // 这个值是后端要求的，用来作分页效的
        // 在发下一次时，要把上一次请求回的来最后一个id传入
        this.offset = result.data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
// 发表评论的区域是固定在下端的
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
// 给发表评论区空出地方
.van-list {
  margin-bottom: 45px;
}
</style>
