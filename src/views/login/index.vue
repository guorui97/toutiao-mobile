<template>
  <div>
    <van-nav-bar
      title="登陆"
    />
    <!-- 用van-form中提供的rules来做检验
    validate-first：是否在某一项校验不通过时停止校验
    -->
    <van-form validate-first  @submit="hLogin">
      <van-cell-group>
        <van-field
          label="手机号"
          v-model.trim="user.mobile"
          required
          clearable
          :rules="[{ pattern, message: '请输入正确的手机号！！！！' }]"
          placeholder="请输入手机号" />

        <van-field
          type="password"
          v-model.trim="user.code"
          :error-message="errInfo.code"
          required
          clearable
          label="密码"
          placeholder="请输入密码"
        />
      </van-cell-group>
      <div class="btn-wrap">
        <van-button type="primary" native-type="submit" class="btn">登陆</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// import request from '@/utils/request'
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      pattern: /^1\d{10}$/, // 正则表达式  以1开头的11数字。 \d: 表示数字。{10} 表示10位数字
      user: {
        // 用这个帐号去登陆是有数据的
        mobile: '13911111111', // 手机
        code: '246810'
      },
      // 保存错误信息
      errInfo: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setUser']),

    /**
    用于对用户信息进行验证
    如果通过验证，则返回true
     */
    checkInfo (user) {
      if (user.mobile === '') {
        this.errInfo.mobile = '手机号不能为空'
        return false
      } else {
        this.errInfo.mobile = ''
      }

      if (user.code === '') {
        this.errInfo.code = '密码不能为空'
        return false
      } else {
        this.errInfo.code = ''
      }

      return true
    },
    async hLogin () {
      // 1. 对用户的信息进行验证
      if (!this.checkInfo(this.user)) {
        return
      }

      // 2. loading
      this.$toast.loading({
        message: '登陆中....',
        duration: 0, // 会一直存在,如果有下一个this.$toast被调用，它就会被覆盖，也就消失了
        mask: true // 整体加一个遮罩
      })

      // 3. 调用接口 ,成功失败要给提示
      try {
        // 如果 login这个操作没有错误，则不会进入catch
        const result = await login(this.user)
        // 分析result中的结构，真实数据就是result.data.data
        // console.log(result.data.data)
        this.$toast.success('登陆成功')
        // 1. 保存信息到vuex中user
        // 如何在组件内部去调用mutation?
        // 方式一：this.$store.commit
        // this.$store.commit('setUser', result.data.data)
        // 方式二：mapMutations
        this.setUser(result.data.data)

        // 用户跳转
        const to = this.$route.query.from || '/'
        this.$router.push(to)
      } catch (err) {
        // 有错误，就会到这里来
        // err这个错误是 axios给出来了。它表示通过axios发请求时，请求出错了
        console.dir(err)
        const errMsg = err.response.data.message
        if (errMsg) {
          if (errMsg.mobile) {
            // 说明手机号错误
            this.$toast.fail('手机号错误')
          }
          if (errMsg.code) {
            // 说明手机号错误
            this.$toast.fail('密码错误')
          }
        } else {
          this.$toast.fail('登陆出错')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-wrap{
  padding:20px;
  .btn {
    width: 100%;
    background-color: #6db4fb;
    color:#fff;
  }
}
</style>
