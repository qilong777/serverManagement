<template>
  <div class="exam">
    <div class="select">
      <el-cascader
        v-model="data"
        :options="options"
        :props="props"
        collapse-tags
        clearable
      />
      <el-button type="primary" @click="searchExam">查询</el-button>
      <div class="upload"> <el-button size="small" type="success" @click="handleImport">导入考试数据</el-button></div>

    </div>
    <el-table
      v-loading="loading"
      class="exam-table"
      :data="examList"
    >
      <el-table-column
        prop="subjectName"
        label="科目"
        width="180"
      />
      <el-table-column
        label="考试时长"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.time+'分钟' }}
        </template>
      </el-table-column>
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
            @onConfirm="removeExam(scope.$index)"
          >
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
          <el-button
            type="success"
            size="mini"
            @click="handleEdit(scope.$index)"
          >预览</el-button>

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
      title="练习信息"
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
        >
          <el-form-item label="科目">
            <el-cascader
              v-model="form.subjectId"
              :options="options1"
              :props="props1"
              collapse-tags
              clearable
            />
          </el-form-item>
          <!-- 问题 -->
          <el-form-item label="考试班级">
            <el-cascader
              v-model="form.classIds"
              :options="options"
              :props="props"
              collapse-tags
              clearable
            />
          </el-form-item>
          <el-form-item label="考试时长">
            <el-input v-model="form.time" placeholder="请输入考试时长" />
          </el-form-item>
          <!-- 选项 -->
          <el-form-item label="试题文件">
            <el-upload
              ref="upload"
              class="upload"
              :multiple="false"
              :action="action"
              :limit="1"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
              :data="updata"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogShow = false">取 消</el-button>
        <el-button :loading="changing" type="warning" @click="submit">{{ isUpdate?'修 改':'上 传' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Exam',
  data() {
    return {
      isUpdate: false,
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
      options1: [],
      examList: [],
      page: 1,
      pageSize: 5,
      total: 100,
      loading: false,
      form: {
        id: '',
        subjectId: '',
        classIds: [],
        time: 0
      },
      fileList: [],
      updata: {

      }
    }
  },
  computed: {
    classIds() {
      return this.data.map(ele => {
        return ele[2]
      })
    },
    action() {
      return this.isUpdate ? '/api/teacher/changeExam' : '/api/teacher/addExam'
    }
  },
  created() {
    this.getClassTree()
    this.getSubjects()
    this.searchExam()
  },
  methods: {
    async getSubjects() {
      const res = await this.$api.getSubjects()
      if (res.status === 1) {
        this.options1 = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async getClassTree() {
      const res = await this.$api.getClassTree()
      if (res.status === 1) {
        this.options = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async searchExam() {
      this.loading = true
      const res = await this.$api.getExamByClassIds({ ids: this.classIds.join(','), page: this.page, pageSize: this.pageSize })
      if (res.status === 1) {
        this.examList = res.data.examList
        this.total = res.data.total
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    pageChange(page) {
      this.page = page
      this.searchExam()
    },
    handleEdit(index) {
      this.isUpdate = true
      const examInfo = this.examList[index]

      this.form.id = examInfo.id
      this.form.subjectId = [examInfo.subjectId]
      this.form.subjectName = examInfo.subjectName
      this.form.classIds = this.getClassIds(examInfo.classIds)
      this.form.time = examInfo.time
      this.fileList = []
      this.dialogShow = true
    },
    handleImport() {
      this.isUpdate = false
      this.fileList = []
      this.form.id = ''
      this.form.subjectId = []
      this.form.classIds = []
      this.form.time = ''
      this.dialogShow = true
    },
    async removeExam(index) {
      const id = this.examList[index].id
      const res = await this.$api.removeExam(id)
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchExam()
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadSuccess(res) {
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchExam()
      } else {
        this.$message.error(res.msg)
      }
      this.changing = false
      this.dialogShow = false
      this.searchExam()
    },
    beforeUpload(file) {
      const isXLS = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isXLS) {
        this.$message.error('上传格式只能是Excel表格!')
        return false
      }
      return true
    },
    getType(type) {
      if (type === 1) {
        return '单选题'
      } else if (type === 2) {
        return '多选题'
      } else {
        return '填空题'
      }
    },
    // 可递归，懒了
    getClassIds(ids) {
      const idsArr = ids.split(',')

      const res = []
      const options = this.options
      for (let i = 0, len = options.length; i < len; i++) {
        const ele = options[i]
        if (!ele.children) { continue }
        let arr = [ele.id]
        for (let j = 0; j < ele.children.length; j++) {
          const item = ele.children[j]
          if (!item.children) { continue }
          arr = [arr[0], item.id]
          for (let k = 0; k < item.children.length; k++) {
            const item1 = item.children[k]
            if (idsArr.indexOf(item1.id + '') !== -1) {
              arr = [arr[0], arr[1], item1.id]
              res.push(arr)
            }
          }
        }
      }
      return res
    },
    async submit() {
      this.changing = true
      let classIds = this.form.classIds.map(ele => ele[2])
      const id = this.form.id
      const subjectId = this.form.subjectId[0]
      const time = this.form.time
      classIds = classIds.join(',')

      if (this.isUpdate) {
        this.updata = Object.assign(this.updata, { id, subjectId, classIds, time })
        if (this.$refs.upload.uploadFiles.length === 0) {
          const res = await this.$api.changeExam(this.updata)
          if (res.status === 1) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
          this.changing = false
          this.dialogShow = false
          this.searchExam()
          return
        }
      } else {
        this.updata = Object.assign(this.updata, { subjectId, classIds, time })
        if (this.$refs.upload.uploadFiles.length === 0) {
          this.changing = false
          this.$message.error('文件不能为空')
          return
        }
      }
      this.$refs.upload.submit()
    }
  }
}
</script>

<style lang='scss' scoped>
.exam{
  padding: 20px;
  .select{
    width: 300px;
    margin: 0 auto;
    .upload{
      margin: 20px 80px;
    }
  }
  .exam-table{
    height: 500px;
    width: 600px;
    margin: 0 auto;
  }
  .page-list-wrapper{
    display: flex;
    justify-content: center;
    align-content: center;
    height: 60px;
    margin-top: 10px;
  }
  .info-wrapper{
    .el-cascader{
      width: 80%;
    }
    .upload{
      padding-left: 150px;
    }
  }
}
</style>
