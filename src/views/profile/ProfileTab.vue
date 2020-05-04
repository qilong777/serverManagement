<template>
  <div class="profile-tab">
    <h2>个人信息</h2>
    <hr>
    <div class="headImg-wrapper">
      <el-avatar :size="80" src="/logo.png" />
    </div>
    <div class="info">
      <p>
        <span>职工号：</span>{{ userInfo.id }}
      </p>
      <p>
        <span>姓名：</span>{{ userInfo.name }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ProfileTab',
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['userInfo'])

  },
  created() {

  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.profile-tab{
  h2{
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .headImg-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  .info{
    width: 200px;
    margin: 0 auto;
    font-size: 16px;
    p{
      margin: 10px 0;
    }
    span{
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }

}
</style>
