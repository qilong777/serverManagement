<template>
  <div class="score">
    <div class="select">
      <span>请选择班级</span>
      <el-cascader
        v-model="data1"
        :options="options1"
        :props="props"
        collapse-tags
        clearable
      />
      <span>请选择科目</span>
      <el-cascader
        v-model="data2"
        :options="options2"
        :props="props"
        collapse-tags
        clearable
      />
      <el-button type="primary" @click="searchScore">查询</el-button>
    </div>
    <el-table
      v-loading="loading"
      class="score-table"
      :data="scoreList"
      style="width: 1100px;margin:0 auto"
      border
    >
      <el-table-column
        prop="className"
        label="班级"
        width="180"
      />
      <el-table-column
        prop="studentId"
        label="学号"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        prop="subjectName"
        label="科目"
        width="180"
      />
      <el-table-column
        prop="score"
        label="成绩"
        width="180"
      />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="mini"
            @click="handleEdit(scope.$index)"
          >编辑</el-button>
          <el-popconfirm
            icon="el-icon-info"
            icon-color="red"
            title="确定要删除吗？"
            @onConfirm="removeScore(scope.$index)"
          >
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <div class="page-list-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="pageChange"
      />
    </div>
    <el-dialog
      title="学生成绩"
      :visible.sync="dialogShow"
      width="60%"
      center
    >
      <div class="info-wrapper">
        <el-form
          ref="formRef"
          class="form"
          label-width="100px"
          :model="form"
          :rules="formRules"
        >
          <!-- 用户名 -->
          <el-form-item label="班级">
            <el-input v-model="form.className" disabled />
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="form.studentId" disabled />
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="姓名">
            <el-input v-model="form.name" disabled />
          </el-form-item>
          <el-form-item label="科目">
            <el-input v-model="form.subjectName" disabled />
          </el-form-item>
          <el-form-item label="成绩" prop="score">
            <el-input v-model="form.score" />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogShow = false">取 消</el-button>
        <el-button :loading="changing" type="warning" @click="changeScore()">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Score',
  data() {
    return {
      dialogShow: false,
      changing: false,
      loading: false,
      data1: [],
      data2: [],
      props: {
        multiple: true,
        label: 'name',
        value: 'id'
      },
      options1: [],
      options2: [],
      scoreList: [],
      page: 1,
      pageSize: 8,
      total: 0,
      form: {
        className: '',
        studentId: '',
        examId: '',
        name: '',
        subjectName: '',
        score: ''
      },
      // 登录表单验证规则
      formRules: {
        // 验证用户名
        score: [
          { required: true, message: '请输入成绩', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    classIds() {
      return this.data1.map(ele => {
        return ele[2]
      })
    },
    subjectIds() {
      return this.data2.map(ele => {
        return ele[0]
      })
    }
  },
  created() {
    this.getClassTree()
    this.getSubjects()
    this.searchScore()
  },
  methods: {
    async getClassTree() {
      const res = await this.$api.getClassTree()
      if (res.status === 1) {
        this.options1 = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async getSubjects() {
      const res = await this.$api.getSubjects()
      if (res.status === 1) {
        this.options2 = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async searchScore() {
      this.loading = true
      const res = await this.$api.getScore({
        classIds: this.classIds.join(','),
        subjectIds: this.subjectIds.join(','),
        page: this.page,
        pageSize: this.pageSize
      })
      if (res.status === 1) {
        this.scoreList = res.data.scoreList
        this.total = res.data.total
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    pageChange(page) {
      this.page = page
      this.searchScore()
    },
    handleEdit(index) {
      const scoreInfo = this.scoreList[index]
      // this.form.className = scoreInfo.className
      // this.form.studentId = scoreInfo.studentId
      // this.form.name = scoreInfo.name
      // this.form.subjectName = scoreInfo.subjectName
      // this.form.score = scoreInfo.score
      Object.assign(this.form, scoreInfo)
      this.dialogShow = true
    },
    async removeScore(index) {
      const studentId = this.scoreList[index].studentId
      const examId = this.scoreList[index].examId
      const res = await this.$api.removeScore({ studentId, examId })
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchScore()
      } else {
        this.$message.error(res.msg)
      }
    },
    changeScore() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.changing = true
          const res = await this.$api.changeScore({
            studentId: this.form.studentId,
            examId: this.form.examId,
            score: this.form.score
          })
          if (res.status === 1) {
            this.$message.success(res.msg)
            this.searchScore()
            this.dialogShow = false
          } else {
            this.$message.error(res.msg)
          }
          this.changing = false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.score{
  padding: 20px;
  .select{
    width: 700px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .score-table{
    min-height: 500px;
  }
  .page-list-wrapper{
    display: flex;
    justify-content: center;
    align-content: center;
    height: 60px;
    margin-top: 10px;
  }
}
</style>
