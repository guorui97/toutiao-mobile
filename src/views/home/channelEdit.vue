<template>
  <div class="channel-edit">
    <!-- 当前登陆用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
      <!--
        editing = !editing
        把右边的值存到左边。
        右边是取反。每点击一次，就是取反一次，并保存
       -->
          <van-button  size="mini" type="info" @click="editing=!editing">
          {{editing ? '取消':'编辑'}}
          </van-button>
      </van-cell>
      <van-grid>
        <van-grid-item
        v-for="(item,idx) in channels"
        :key="item.id"
        @click="hClickMyChannel(item)"
        :class="{'cur':idx===activeIndex}"
        >
          <span>{{item.name}}</span>
          <!-- 推荐 这个频道是不能删除的  -->
          <van-icon name="cross" class="btn" v-show="editing && idx!==0"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
     <!-- 当前登陆用户没有订阅的频道 -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item v-for="item in recommendChannels" :key="item.id"
        @click="hAddChannel(item)">
          <span>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>

import { getAllChannels, addChannel, deleteChannels } from '@/api/channel'
export default {
  name: 'ChannelEdit',
  props: {
    // 从父组件中传入一个对象数组
    channels: { // 当前用户订阅的频道列表
      type: Array, // 一定要传入数组
      required: true // 不传就报错。
    },
    // 当前父组件中选中的那个频道的下标,在显示时，它应该要高亮
    activeIndex: {
      type: Number,
      required: true
    }
  },
  created () {
    this.getAllChannels()
  },
  data () {
    return {
      allChannels: [], // 所有的频道列表
      editing: false // 是否处于编辑状态
    }
  },
  computed: {
    // 新增一个计算属性来表示当前可选的频道列表
    recommendChannels () {
      // return this.allChannels.filter(channel => this.channels.findIndex(item => item.id === channel.id) === -1)

      // return this.allChannels.filter((channel) => {
      //   return this.channels.findIndex(item => item.id === channel.id) === -1
      // })

      // this.allChannels - this.channels
      // 可选频道的数据 = 所有频道中 除去已订阅频道中的数据
      //                 在所有频道中去过滤一下，选出那些没有在 已订阅频道 中出现频道
      // 数组的过滤filter会产生新数组
      return this.allChannels.filter((channel) => {
        // 要留下 在已订阅频道中不存在的频道
        // 对于每一个频道，过滤的条件是：你不能在 已订阅频道中出现
        // 如何去判断在已订阅频道中是否包含 当前的channel ?
        const idx = this.channels.findIndex(item => item.id === channel.id)
        // 如果找到(idx不会=-1），说明当前频道在已订阅频道中已经存在了
        // 如果找不到（idx:-1)，说明当前频道channel并没有在已订阅频道中出现，应该过滤出来
        return idx === -1
      })
    }
  },
  methods: {
    // 把item这个频道添加到我的频道中
    async hAddChannel (item) {
      // todo: 先去已有频道去检查一下，是否当前频道已经存在。

      // channels表示此时所有的频道信息
      const allChannelNow = [...this.channels, item]
      // 改成接口中需要格式
      const channels = allChannelNow.map((it, idx) => {
        return {
          id: it.id,
          seq: idx
        }
      })
      // 在调用这个接口时，不要把推荐频道也传进去了。
      channels.splice(0, 1) // 删除第一个元素
      // 在调用这个接口时，不要把推荐频道也传进去了。
      console.log(allChannelNow, channels)
      // [{id:1,seq:0},{id:2,seq:1}]
      // /// [{id:1,seq:1},{id:10,seq:2}]
      const result = await addChannel(channels)
      // 调用接口修改后端数据，如上操作没有报错误，则说明操作成功
      console.log(result)

      // 直接修改父级组件中的频道列表
      this.channels.push(item)
      // 1.它会引起可选频道中的数据少一个（计算属性）
      // 2.它会引起我的频道中的数据多一个
      // 3.直接修改父级组件中的频道列表. 父组件中把channels是当作prop传入的，按官方推荐，我不应该
      // 去直接修改prop，或者是，它不允许直接去修改这个prop。
      // 这里有不同之处：
      // channels是一个数组，它不是一个基本数据类型。所以，我们可以在子组件内部去修改父组件的数据
    },
    async getAllChannels () {
      // 1. 取回所有的频道
      const result = await getAllChannels()
      console.log(result)
      this.allChannels = result.data.data.channels
    },
    async hClickMyChannel (channel) {
      // 在我的频道上点击一下
      // 目标：
      //    如果当前是非编辑状态：修改父组件index.vue中当前频道项
      //    如果当前是正编辑状态：要做删除频道
      if (this.editing) {
        console.log('删除频道 channel')
        // 参数是：当前频道的id
        const result = await deleteChannels([channel.id])
        console.log(result)
        // 如果上面的操作没有错误，则说明已经成功地在服务器上删除了，接下来
        // 更新视图
        // 从当前频道中删除它
        // 1.找出当前的下标
        const idx = this.channels.findIndex(it => it.id === channel.id)
        // 2.删除它
        if (idx !== -1) {
          this.channels.splice(idx, 1)
        }
        // 如果当前删除的频道在 活动频道之前 ，则要把活动频道的下标-1。
        if (idx < this.activeIndex) {
          // 要把父组件中的activeIndex - 1
          this.$emit('updateCurIndex', this.activeIndex - 1)
        }
      } else {
        this.$emit('updateCurChannel', channel)
        //    关闭弹层
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .channel{
    padding:15px;
    font-size:14px;
  }
  .btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 24px;
  }
  // 高亮显示
  .cur{
    color:red;
    font-weight:bold;
  }
</style>
