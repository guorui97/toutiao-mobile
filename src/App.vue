<template>
  <div id="app">
  <!--
    keep-alive:它是一个特别的组件，
    作用：把它其中组件进行缓存

    如果路由容器外有keep-alive，则组件会缓存
    如果路由容器外有没有keep-alive，则组件不会缓存

    可以自己定义路由组件时，给路由添加meta，
    设置isKeepAlive是否为true来约定指定要缓存是哪些组件

    $route:路由对象 meta元信息 isKeepAlive（可以改名） 缓存依据

  -->
    <keep-alive>
       <router-view v-if="$route.meta.isKeepAlive"/>
    </keep-alive>
     <router-view v-if="!$route.meta.isKeepAlive"/>
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
