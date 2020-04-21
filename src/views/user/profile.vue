<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料"></van-nav-bar>

    <!--

      文件域：用来选中本地文件
      change事件：当用户选中文件时，它会触发。
      hidden: 隐藏自己，只是不可见，不占空间，但它的功能还是在嘀。
    -->
    <input type="file" hidden @change="hFileChange" ref="file"/>
    <van-cell-group>
      <van-cell is-link title="头像"  center @click="hShowImage">
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="姓名" :value="user.name" @click="showName=true"/>
      <van-cell is-link title="性别" :value="user.gender === 1?'男':'女'" @click="showGender=true"/>
      <van-cell is-link title="生日" :value="user.birthday" @click="showBirthday=true"/>
    </van-cell-group>

    <!-- 编辑区域 姓名
    confirm:是dialog组件提供的事件，用来做保存
    -->
    <van-dialog @confirm="hSaveName" v-model="showName" title="修改名字" show-cancel-button>
      <van-field type="text" focus v-model.trim="newName" placeholder="请输入名字" />
    </van-dialog>

    <van-popup v-model="showGender" position="bottom">
      <van-nav-bar
          title="修改性别"
          left-text="取消"
          @click-left="showGender=false"
      >
      </van-nav-bar>
        <van-cell is-link title="男" @click="hChangeGender(1)" />
        <van-cell is-link title="女" @click="hChangeGender(0)" />
    </van-popup>

    <van-popup v-model="showBirthday" position="bottom">
      <van-nav-bar
        title="修改生日"
      >
      </van-nav-bar>
      <van-datetime-picker
        v-model="newDate"
        @confirm="hSaveBirthday"
        @cancel="showBirthday=false"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { getProfile, updateUserInfo, updatePhoto } from '@/api/user.js'
import dayjs from 'dayjs'
export default {
  name: 'userProfile',
  created () {
    this.getInfo()
  },
  data () {
    return {
      // 控制弹层
      showName: false,
      showGender: false,
      showBirthday: false,

      // 当前用户的信息
      user: {},

      // 修改后的新名字
      newName: '',
      // 修改后新生日
      newDate: new Date(),
      minDate: new Date(1965, 0, 10), // dateTime-picker中最小时间
      maxDate: new Date() // 当前时间
    }
  },
  methods: {
    // 在头像上单击了
    hShowImage () {
      // alert(1)
      // 手动去触发input的点击事件
      this.$refs.file.click()
    },

    // 文件域中用户选择文件
    //  change 变化
    // （1） 从有图片1  --> 没有图片（用户没有选 中）
    // （2） 从有图片1  --> 有图片2
    // （2） 从没有图片 --> 有图片1
    async hFileChange () {
      console.log('hFileChange')
      // 1. 找到用户选中的头像文件
      // this.$refs.file 就是当前的<input type="file">
      // files[0] 是用户选中的文件
      const file = this.$refs.file.files[0]
      if (!file) {
        // 只有用户选择头像文件，才向下走
        return
      }
      console.dir(file)
      // 2. 调用接口
      // 按接口要求，要创建一个formData对象
      const fd = new FormData()
      // 补充一个参数
      fd.append('photo', file)
      const result = await updatePhoto(fd)
      // 3. 如果成功，则更新本地数据
      console.log(result)
      this.user.photo = result.data.data.photo
    },
    // 获取用户档案
    async getInfo () {
      const result = await getProfile()
      console.log(result)

      // 保存数据
      this.user = result.data.data
    },
    async hSaveName () {
      console.log(this.newName)
      if (!this.newName) {
        this.showName = false
        return
      }
      // 1. 调用接口，保存新名字
      const result = await updateUserInfo({
        name: this.newName
      })
      console.log(result)
      // 2. 关闭弹层
      this.showName = false
      // 3. 修改本地信息
      this.user.name = this.newName
    },
    async hChangeGender (g) {
      console.log(g)
      // 1. 调用接口，保存性别
      const result = await updateUserInfo({
        gender: g
      })
      console.log(result)
      // 2. 关闭弹层
      this.showGender = false
      // 3. 修改本地信息
      this.user.gender = g
    },
    async hSaveBirthday () {
      // 保存生日
      // 由于后端接口需要的格式是 '2018-12-20'，而我们取到的数据是一个Date对象
      // 所以在传给后端之前要做一下格式化。
      // 在项目中已经引入了dayjs，所以，这里直接拿来用一下
      console.log(this.newDate)
      const birthday = dayjs(this.newDate).format('YYYY-MM-DD')

      // 1. 调用接口，保存性别
      // birthday 生日，格式'2018-12-20'
      const result = await updateUserInfo({
        birthday
      })
      console.log(result)
      // 2. 关闭弹层
      this.showBirthday = false
      // 3. 修改本地信息
      this.user.birthday = birthday
    }
  }
}
</script>

<style lang="less">
.van-nav-bar__text{
  color:#fff;
}
</style>
