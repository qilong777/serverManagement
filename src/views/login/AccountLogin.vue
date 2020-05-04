<template>
  <div class="tab-content">
    <el-form
      ref="loginFormRef"
      class="login-form"
      label-width="100px"
      :model="loginForm"
      :rules="loginFormRules"
    >
      <!-- 用户名 -->
      <el-form-item prop="id" label="教工号">
        <el-input v-model="loginForm.id" placeholder="请输入教工号" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password" label="密码">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="verify" label="验证码">
        <el-input v-model="loginForm.verify" placeholder="请输入验证码" style="width:55%" />
        <img :src="verifySrc" style="width:40%" alt="" @click="changeVerify">
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item class="btns" label-width="0px">
        <el-button :loading="loginLoading" type="success" class="login-btn" @click="login">{{ loginTx }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { verifySrc } from '@/baseConst'
import { mapMutations } from 'vuex'
export default {
  name: 'AccountLogin',
  data() {
    return {
      verifySrc,
      // 登录表单对应的数据对象
      loginForm: {
        id: '10086',
        password: '123456',
        verify: ''
      },
      // 登录表单验证规则
      loginFormRules: {
        // 验证用户名
        id: [
          { required: true, message: '请输入教工号', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        // 验证验证码
        verify: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      loginLoading: false
    }
  },
  computed: {
    loginTx() {
      if (this.loginLoading) {
        return '登录中'
      } else {
        return '立即登录'
      }
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    changeVerify() {
      this.verifySrc = verifySrc + Date.now()
    },
    // 登录按钮点击事件
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          this.loginLoading = true
          const res = await this.$api.login(this.loginForm)
          this.loginLoading = false
          if (res.status === 1) {
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            this.setUserInfo(res.data.userInfo)
            this.$router.push('/')
          } else {
            this.changeVerify()
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
