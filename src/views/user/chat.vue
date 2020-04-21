<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="list">
      <div class="chat-item"
        v-for="(item,idx) in list"
        :key="idx"
        :class="item.name==='xz'?'left':'right'">
          <van-image v-if="item.name === 'xz'"  fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg" />

          <div class="chat-pao">{{item.msg}}</div>

          <van-image v-if="item.name === 'me'"  fit="cover"
            round
            :src="$store.state.photo" />
      </div>
      <!-- 左侧是机器人小智
      <div class="chat-item left">
        <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <div class="chat-pao">hi，你好！</div>
      </div>
      -->
      <!-- 右侧是当前用户
      <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="$store.state.photo" />
      </div>
      -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <span  @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
// 引入socket.io-client这个包提供的websocket功能
import io from 'socket.io-client'

// 1. 建立与接口的连接
// 2. 向服务器发消息
//    emit('消息名',内容)
// 3. 接收服务器的消息
//    on('消息名',function(){
//
//    })

export default {
  name: 'UserChat',
  data () {
    return {
      // 设计聊天记录
      list: [
        // { name: 'xz', msg: '今天天不好，我是小智', timestamp: Date.now() },
        // { name: 'me', msg: '我是编程小王子，我这里好的很！', timestamp: Date.now() },
        // { name: 'xz', msg: '你以会在网上抄代码，就是程序员了吗？', timestamp: Date.now() }
      ], // 聊天记录
      word: '' // 你说话的内容

    }
  },
  created () {
    // io(服务器地址 ，其它的参数)
    // 按接口文档的要求，写入地址，及token
    // this.socket = io() 是给当前的组件对象添加一个属性，属性名是socket。
    // 如果把socket这个属性定义在了data(){} 中，则它会具有响应式的功能。
    // 在这里，我并不需要socket具备响应式的效果，所以不需要在data(){}中去定义。

    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.$store.state.user.token
      }
    })
    // on是监听事件,connect是固定名称，就表示与服务器连接成功
    this.socket.on('connect', () => {
      console.log('与websocket服务器连接成功')

      this.list.push({ name: 'xz', msg: '我是小智，你有什么可以告诉我的？', timestamp: Date.now() })

      this.toBottom()
    })
    // 收到服务器的回复
    this.socket.on('message', (data) => {
      console.log(data)

      // 修改了数据之后，页页重新渲染是延迟的。 换句话说，数据的响应式是异步的！！！！
      // this.list.push会向list中添加一条记录
      // 整个的高度会增加
      // 问:
      //  list.push会导致整体列表中元素添加一条，会导致高度变高，
      //  这个变高的过程和this.toBottom()谁先，谁后？
      // 答： this.toBottom()先执行，而后才会有  高度变高
      console.log(this.$refs.list.scrollHeight)
      // 添加数据到list
      this.list.push({
        name: 'xz',
        msg: data.msg,
        timestamp: data.timestamp
      })
      console.log(this.$refs.list.scrollHeight)

      this.toBottom()
    })
  },
  methods: {
    // 让滚动条到达底部
    toBottom () {
      // dom
      //     document.querySelector('.chat-list').scrollTop = document.querySelector('.chat-list').scrollHeight
      // 在vue中通过$refs这个方式来获取对dom的引用

      // 让这个代码在整体list的高度变高之后再去执行

      // this.$nextTick是vue的一个api
      // 格式： this.$nextTick(()=>{})
      // 作用:让修改数据到dom结构渲染有一个同步的执行效果
      //   本质：让其中中回调函数等着当前数据变化而导致的dom变化完成之后，才去执行
      //        类似于setTimeout()的效果
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
      // setTimeout(() => {
      //   this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      // }, 1000)
    },
    send () {
      // 向服务器发消息
      console.log(this.word)
      if (!this.word) {
        return
      }

      // 1. 向服务器发消息
      const obj = {
        msg: this.word,
        timestamp: Date.now()

      }
      this.socket.emit('message', obj)

      // 2. 把消息添加到list中
      this.list.push({
        name: 'me',
        msg: obj.msg,
        timestamp: obj.timestamp
      })

      // 滚动条到底部
      this.toBottom()

      // 3. 清空留言区
      this.word = ''
    }
  },
  // 这个钩子函数在组件销毁前执行
  beforeDestroy () {
    // alert('beforeDestroy')
    // 断开连接
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
