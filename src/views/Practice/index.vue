<template>
  <div class="practice">
    <div class="select">
      <span>请选择科目</span>
      <el-cascader
        v-model="data"
        :options="options"
        :props="props"
        collapse-tags
        clearable
      />
      <el-button type="primary" @click="searchPractice">查询</el-button>
      <el-upload
        class="upload"
        action="/api/teacher/importPractice"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="success">导入习题数据</el-button>
      </el-upload>
    </div>
    <el-table
      v-loading="loading"
      class="student-table"
      :data="practiceList"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="ID"
        width="180"
      />
      <el-table-column
        prop="subjectName"
        label="科目"
        width="180"
      />
      <el-table-column
        label="题目类型"
        width="180"
      >
        <template slot-scope="scope">
          <el-tag size="medium">{{ getType(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="question"
        label="问题"
        width="180"
      />
      <el-table-column
        prop="answer"
        label="答案"
        width="180"
      />
      <el-table-column
        prop="analysis"
        label="解析"
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
            @onConfirm="removePractice(scope.$index)"
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
          :rules="formRules"
        >
          <el-form-item prop="type" label="题目类型">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">单选题</el-radio>
              <el-radio :label="2">多选题</el-radio>
              <el-radio :label="3">填空题</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="subjectId" label="科目">
            <el-cascader
              v-model="form.subjectId"
              :options="options"
              :props="props1"
              collapse-tags
              clearable
            />
          </el-form-item>
          <!-- 问题 -->
          <el-form-item prop="question" label="问题">
            <el-input v-model="form.question" placeholder="请输入问题" />
          </el-form-item>
          <!-- 选项 -->
          <div v-if="form.type!==3">
            <el-form-item
              v-for="(item,index) in form.options"
              :key="index"
              eslint-disable-next-line
              vue
              no-use-v-if-with-v-for
              :label="'选项'+String.fromCharCode(65+index)"
            >
              <el-input
                v-model="form.options[index]"
                placeholder="请输入选项"
              />
            </el-form-item>
          </div>

          <el-form-item label="答案">
            <el-select
              v-if="form.type===1"
              v-model="form.answer"
              placeholder="请选择答案"
            >
              <el-option
                v-for="(item,index) in form.options"
                :key="index"
                :label="String.fromCharCode(65+index)"
                :value="String.fromCharCode(65+index)"
              />
            </el-select>
            <el-select
              v-else-if="form.type===2"
              key="1"
              v-model="form.answer1"
              placeholder="请选择答案"
              multiple
            >
              <el-option
                v-for="(item,index) in form.options"
                :key="index"
                :label="String.fromCharCode(65+index)"
                :value="String.fromCharCode(65+index)"
              />
            </el-select>
            <el-input v-else v-model="form.answer" placeholder="请输入答案" />
          </el-form-item>
          <el-form-item prop="analysis" label="解析">
            <el-input
              v-model="form.analysis"
              type="textarea"
              placeholder="请输入解析"
              maxlength="200"
              show-word-limit
              resize="none"
            />
          </el-form-item>

        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogShow = false">取 消</el-button>
        <el-button :loading="changing" type="warning" @click="changePractice">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Practice',
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
      practiceList: [],
      page: 1,
      pageSize: 5,
      total: 100,
      loading: false,
      form: {
        id: '',
        type: '',
        subjectId: '',
        question: '',
        options: [],
        answer: '',
        answer1: [],
        analysis: ''
      },
      // 登录表单验证规则
      formRules: {
        question: [
          { required: true, message: '请输入问题', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    subjectIds() {
      return this.data.map(ele => {
        return ele[0]
      })
    }
  },
  created() {
    this.getSubjects()
    this.searchPractice()
  },
  methods: {
    async getSubjects() {
      const res = await this.$api.getSubjects()
      if (res.status === 1) {
        this.options = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async searchPractice() {
      this.loading = true
      const res = await this.$api.getPracticeBySubjectId({ ids: this.subjectIds.join(','), page: this.page, pageSize: this.pageSize })
      if (res.status === 1) {
        this.practiceList = res.data.practiceList
        this.total = res.data.total
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    pageChange(page) {
      this.page = page
      this.searchPractice()
    },
    handleEdit(index) {
      const practiceInfo = this.practiceList[index]
      this.form.id = practiceInfo.id
      this.form.type = practiceInfo.type
      this.form.subjectId = [practiceInfo.subjectId]
      this.form.question = practiceInfo.question
      this.form.options = practiceInfo.options.split('$$')
      if (practiceInfo.type === 2) {
        this.form.answer1 = practiceInfo.answer.split('')
        this.form.answer = ''
      } else {
        this.form.answer = practiceInfo.answer
        this.form.answer1 = []
      }

      this.form.analysis = practiceInfo.analysis
      this.dialogShow = true
    },
    async removePractice(index) {
      const id = this.practiceList[index].id
      const res = await this.$api.removePractice(id)
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchPractice()
      } else {
        // this.$message.error(res.msg)
      }
    },
    changePractice() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.changing = true
          const answer = this.form.type === 2 ? this.form.answer1.join('') : this.form.answer
          const res = await this.$api.changePractice(this.form.id, {
            type: this.form.type,
            subjectId: this.form.subjectId,
            question: this.form.question,
            options: this.form.options.join('$$'),
            answer,
            analysis: this.form.analysis

          })
          if (res.status === 1) {
            this.$message.success(res.msg)
            this.searchPractice()
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
        this.searchPractice()
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
    },
    getType(type) {
      if (type === 1) {
        return '单选题'
      } else if (type === 2) {
        return '多选题'
      } else {
        return '填空题'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.practice{
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
