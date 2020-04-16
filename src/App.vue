<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'APP'
}
// 引入axios:
// import request from './utils/request'
// export default {
//   created () {
//     // 测试一下request能不能发请求
//     request.get('/app/v1_0/user/channels').then(res => {
//       console.log(res)
//     })
//   }
// }
</script>
<style lang="less">
</style>
