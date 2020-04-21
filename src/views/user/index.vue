<template>
  <div class="container">
    <!-- 用户个人资料 -->
    <div class="user-profile">
      <div class="info">
        <van-image round :src="user.photo" />
        <h3 class="name">
          {{user.name}}
          <br />
          <van-tag size="mini">申请认证</van-tag>
        </h3>
      </div>
      <van-row>
        <van-col span="8">
          <p>{{user.art_count}}</p>
          <p>动态</p>
        </van-col>
        <van-col span="8">
          <p>{{user.follow_count}}</p>
          <p>关注</p>
        </van-col>
        <van-col span="8">
          <p>{{user.fans_count}}</p>
          <p>粉丝</p>
        </van-col>
      </van-row>
    </div>

    <!-- 操作链接 -->
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="newspaper-o" color="#7af" />我的作品
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" color="#f00" />我的收藏
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" color="#fa0" />阅读历史
      </van-col>
    </van-row>

    <!-- 编辑入口 -->
    <van-cell-group class="user-group">
      <van-cell icon="edit" title="编辑资料" to="/user/profile" is-link />
      <van-cell icon="chat-o" title="小智同学" to="/user/chat" is-link />
      <van-cell icon="setting-o" title="系统设置" is-link />
      <!-- 你再玩一会吧，大爷-->
      <van-cell icon="warning-o" title="退出登录" @click="hLogout" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getInfo } from '@/api/user.js'
import { mapMutations } from 'vuex'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {

      }
    }
  },
  created () {
  // 在user/index.vue中调用user.js/getInfo
    this.getInfo()
  },
  methods: {
    ...mapMutations(['delUser']),
    async getInfo () {
      const result = await getInfo()
      this.user = result.data.data

      // 把头像保存在vuex中
      this.$store.commit('updatePhoto', this.user.photo)
    },
    hLogout () {
      // 1. 让他不要走
      this.$dialog.confirm({
        title: '提示',
        message: '走了就不要回来！！！'
      }).then(() => {
        // on confirm
        // alert('真走了')
        // 2.  他一定要走，删除vuex
        // 在组件中调用mutations
        // 方法一：mapMutations
        this.delUser()
        // 方法二：
        // this.$store.commit('delUser')

        // 3，跳回登陆
        this.$router.push('/login')
      })
        .catch(() => {
          // on cancel
        })
    }
  }

}
</script>

<style lang="less" scoped>
.user {
  &-profile {
    width: 100%;
    height: 200px;
    display: block;
    background: #3296fa;
    color: #fff;
    .info {
      display: flex;
      padding: 20px;
      align-items: center;
      .van-image{
        width: 64px;
        height: 64px;
      }
      .name {
        font-size: 16px;
        font-weight: normal;
        margin-left: 10px;
      }
      .van-tag {
        background: #fff;
        color: #3296fa;
      }
    }
    p{
      margin: 0;
      text-align: center;
    }
  }
  &-group {
    margin-bottom: 15px;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      padding-bottom: 5px;
    }
  }
}
</style>
