<template>
  <div class="student">
    <div class="select">
      <span>请选择班级</span>
      <el-cascader
        v-model="data"
        :options="options"
        :props="props"
        collapse-tags
        clearable
      />
      <el-button type="primary" @click="searchStudent">查询</el-button>
      <el-upload
        class="upload"
        action="/api/teacher/importStudent"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="success">导入学生信息</el-button>
      </el-upload>
    </div>
    <el-table
      v-loading="loading"
      class="student-table"
      :data="studentList"
      style="width: 900px;margin:0 auto"
      border
    >
      <el-table-column
        prop="id"
        label="学号"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        label="性别"
        width="180"
      >
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.sex === 1?'男':'女' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="className"
        label="班级"
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
            @onConfirm="removeError(scope.$index)"
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
      title="学生信息"
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
          <el-form-item prop="id" label="学号">
            <el-input v-model="form.id" placeholder="请输入学号" disabled />
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="name" label="姓名">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item prop="sex" label="性别">
            <el-radio-group v-model="form.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="classId" label="班级">
            <el-cascader
              v-model="form.classId"
              :options="options"
              :props="props1"
              collapse-tags
              clearable
            />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogShow = false">取 消</el-button>
        <el-button :loading="changing" type="warning" @click="changeStudent()">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Student',
  data() {
    return {
      dialogShow: false,
      changing: false,
      data: [],
      props: {
        multiple: true,
        label: 'name',
        value: 'id'
      },
      props1: {
        multiple: false,
        label: 'name',
        value: 'id'
      },
      options: [],
      studentList: [],
      page: 1,
      pageSize: 8,
      total: 0,
      loading: false,
      form: {
        id: '',
        name: '',
        sex: '',
        classId: ''
      },
      // 登录表单验证规则
      formRules: {
        // 验证用户名
        id: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ],
        // 验证密码
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        // 验证验证码
        classId: [
          { required: true, message: '请选择班级', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    classIds() {
      return this.data.map(ele => {
        return ele[2]
      })
    }
  },
  created() {
    this.getClassTree()
    this.searchStudent()
  },
  methods: {
    async getClassTree() {
      const res = await this.$api.getClassTree()
      if (res.status === 1) {
        this.options = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async searchStudent() {
      this.loading = true
      const res = await this.$api.getStudentByClassId({ ids: this.classIds.join(','), page: this.page, pageSize: this.pageSize })
      if (res.status === 1) {
        this.studentList = res.data.studentList
        this.total = res.data.total
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    pageChange(page) {
      this.page = page
      this.searchStudent()
    },
    handleEdit(index) {
      const studentInfo = this.studentList[index]
      this.form.id = studentInfo.id
      this.form.name = studentInfo.name
      this.form.sex = studentInfo.sex
      this.form.classId = [studentInfo.academyId, studentInfo.professionId, studentInfo.classId]
      this.dialogShow = true
    },
    async removeError(index) {
      const id = this.studentList[index].id
      console.log(id)
      const res = await this.$api.removeStudent(id)
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchStudent()
      } else {
        // this.$message.error(res.msg)
      }
    },
    changeStudent() {
      if (this.form.classId.length === 0) {
        this.$message.error('请选择班级')
        return
      }
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.changing = true
          const res = await this.$api.changeStudent({
            id: this.form.id,
            name: this.form.name,
            sex: this.form.sex,
            classId: this.form.classId[2]
          })
          if (res.status === 1) {
            this.$message.success(res.msg)
            this.searchStudent()
            this.dialogShow = false
          } else {
            this.$message.error(res.msg)
          }
          this.changing = false
        }
      })
    },
    uploadSuccess(res) {
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchStudent()
      } else {
        this.$message.error(res.msg)
      }
    },
    beforeUpload(file) {
      const isXLS = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isXLS) {
        this.$message.error('上传格式只能是Excel表格!')
        return false
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
.student{
  padding: 20px;
  .select{
    width: 400px;
    margin: 0 auto;
    .upload{
      margin: 20px 80px;
    }
  }
  .student-table{
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
