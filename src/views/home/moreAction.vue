<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
    <!-- 不做具体的工作，把事件抛给父组件 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 点击事件，向父组件抛出事件 -->
      <van-cell
        v-for="item in reports"
        :key="item.value"
        @click="$emit('report',item.value)">
        {{item.label}}
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/utils/constants.js'
export default {
  name: 'MoreAction',
  data () {
    return {
      isReport: false,
      reports: reports // 只有定义了数据项，才能用v-for
    }
  }
}
</script>

<style lang="less" scoped>
.more-action{
  border-radius:10px;
}
</style>
