<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading class="article-loading" v-if="loading" />
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relativeTime}}</p>
        </div>
        <van-button
         @click="hFollow"
          round
          size="small"
          type="info"
        >{{ article.is_followed ? '取消关注' : '+ 关注一下'}}</van-button>
      </div>
      <div class="content">
        <div v-html="article.content">
        </div>
      </div>
      <van-divider>END</van-divider>
      <div class="zan">
        <van-button
        round
        size="small"
        hairline
        type="primary"
        plain
        @click="hLike"
        :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'">
        {{ article.attitude === 1 ? "取消点赞" : "+点赞"}}
        </van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
    <!-- /文章详情 -->

    <article-comment
      :articleId="$route.params.id">
    </article-comment>

  </div>
</template>

<script>
import { getArticle, addLike, deleteLike } from '@/api/article'
import { unFollowUser, followUser } from '@/api/user'

// 引入文章评论组件
import ArticleComment from './comment.vue'
export default {
  name: 'ArticleIndex',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: false, // 控制加载中的 loading 状态
      article: {}
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    // 获取文章详情
    async loadArticle () {
      this.loading = true

      const result = await getArticle(this.$route.params.id)
      console.log(result)
      this.article = result.data.data

      // 取消加载状态
      this.loading = false
    },
    // 是否关注
    async hFollow () {
      if (this.article.is_followed) {
        // 为真，说明你是要 取关
        await unFollowUser(this.article.aut_id)
      } else {
        // 为假，说明你是要 加关
        await followUser(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
    },
    // 是否点赞
    async hLike () {
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 1) {
        // 为真，说明你是要 取消点赞
        await deleteLike(articleId)
        this.article.attitude = -1
      } else {
        // 为假，说明你是要 添加点赞
        await addLike(articleId)
        this.article.attitude = 1
      }
    }

  }
}
</script>

<style scoped lang='less'>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    font-size:14px;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
