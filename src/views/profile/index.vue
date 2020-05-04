<template>
  <div class="profile">
    <el-tabs :stretch="true" class="profile-wrapper" tab-position="left" type="border-card">
      <el-tab-pane label="个人信息">
        <ProfileTab />
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <ChangePwd />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const ProfileTab = () => import('./ProfileTab')
const ChangePwd = () => import('./ChangePwd')
export default {
  name: 'Profile',
  components: {
    ProfileTab,
    ChangePwd
  },
  data() {
    return {
    }
  }
}
</script>

<style lang='scss'>
.profile{
  height: 500px;
  .profile-wrapper{
    height: 100%;
    width: 900px;
    margin: 0 auto;
    .el-tabs__header{
      margin-right: 0;
      padding-top: 50px;
      height: 100%;
    }
  }
}
</style>
