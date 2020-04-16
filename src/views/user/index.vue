<template>
  <div>
    {{$store.state.user}}
    我的-测试提交新代码
  </div>
</template>

<script>
import { getInfo } from '@/api/user.js'
console.log(getInfo)
export default {
  name: '',
  data () {
    return {

    }
  },
  created () {
  // 在user/index.vue中调用user.js/getInfo
    getInfo()
  }

}
</script>

<style lang="" scoped>

</style>
