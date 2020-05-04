<template>
  <div class="change-pwd">
    <h2>修改密码</h2>
    <hr>
    <el-form
      ref="form"
      label-width="80px"
      :model="pwdForm"
      :rules="pwdFormRules"
    >
      <el-form-item prop="nowPwd" label="新密码">
        <el-input v-model="pwdForm.nowPwd" type="password" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item prop="checkPwd" label="确认密码">
        <el-input v-model="pwdForm.checkPwd" type="password" placeholder="请确认新密码" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="changing" style="width:100%" type="success" @click="change">立即修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ChangePwd',
  data() {
    return {
      pwdForm: {
        nowPwd: '',
        checkPwd: ''
      },
      pwdFormRules: {
        // 验证密码
        nowPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        // 验证验证码
        checkPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ]
      },
      changing: false
    }
  },
  methods: {
    async change() {
      if (this.pwdForm.nowPwd !== this.pwdForm.checkPwd) {
        this.$message.error('前后密码不一致')
        return
      }
      this.changing = true
      const res = await this.$api.changePwd(this.pwdForm.nowPwd)
      if (res.status === 1) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.pwdForm.nowPwd = ''
        this.pwdForm.checkPwd = ''
      } else {
        this.$message.error(res.msg)
      }
      this.changing = false
    }
  }
}
</script>

<style lang='scss' scoped>
.change-pwd{
  h2{
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .el-form{
    width: 400px;
    margin: 20px auto;
  }
}
</style>
