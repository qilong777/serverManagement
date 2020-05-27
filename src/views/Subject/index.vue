<template>
  <div class="subject">
    <div class="select">
      <span>请选择专业</span>
      <el-cascader
        v-model="data"
        :options="options"
        :props="props"
        collapse-tags
        clearable
      />
      <el-button type="primary" @click="searchSubject">查询</el-button>
      <el-button size="small" type="success" @click="toAddSubject">添加科目</el-button>
    </div>

    <el-table
      v-loading="loading"
      class="subject-table"
      :data="subjectList"
      border
    >
      <el-table-column
        prop="id"
        label="ID"
        width="180"
      />
      <el-table-column
        prop="name"
        label="科目"
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
            @onConfirm="removeSubject(scope.$index)"
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
          <el-form-item v-show="!isAdd" prop="id" label="ID">
            <el-input v-model="form.id" disabled />
          </el-form-item>
          <el-form-item prop="name" label="科目">
            <el-input v-model="form.name" placeholder="请输入科目名字" />
          </el-form-item>
          <el-form-item prop="professionIds" label="专业">
            <el-cascader
              v-model="form.professionIds"
              :options="options"
              :props="props"
              collapse-tags
              clearable
            />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogShow = false">取 消</el-button>
        <el-button v-if="isAdd" :loading="changing" type="success" @click="AddSubject">添 加</el-button>
        <el-button v-else :loading="changing" type="warning" @click="changeSubject">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Subject',
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
      options: [],
      subjectList: [],
      page: 1,
      pageSize: 8,
      total: 100,
      loading: false,
      form: {
        id: '',
        name: '',
        professionIds: []
      },
      // 登录表单验证规则
      formRules: {
        name: [
          { required: true, message: '请输入科目名', trigger: 'blur' }
        ]
      },
      isAdd: false
    }
  },
  computed: {
    professionIds() {
      return this.data.map(ele => {
        return ele[0]
      })
    }
  },
  created() {
    this.getProfessions()
    this.searchSubject()
  },
  methods: {
    async getProfessions() {
      const res = await this.$api.getProfessions()
      if (res.status === 1) {
        this.options = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async searchSubject() {
      this.loading = true
      const res = await this.$api.getSubjectByProfessionIds({ ids: this.professionIds.join(','), page: this.page, pageSize: this.pageSize })
      if (res.status === 1) {
        this.subjectList = res.data.subjectList
        this.total = res.data.total
      } else {
        this.$message.error(res.msg)
      }
      this.loading = false
    },
    pageChange(page) {
      this.page = page
      this.searchSubject()
    },
    toAddSubject() {
      this.isAdd = true
      this.form.name = ''
      this.form.professionIds = []
      this.dialogShow = true
    },
    async AddSubject() {
      const res = await this.$api.addSubject({
        name: this.form.name,
        professionIds: this.form.professionIds
      })
      this.dialogShow = false
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchSubject()
      } else {
        this.$message.error(res.msg)
      }
    },
    handleEdit(index) {
      const subjectInfo = this.subjectList[index]
      this.form.id = subjectInfo.id
      this.form.name = subjectInfo.name
      this.form.professionIds = subjectInfo.professionIds.split(',')
      this.dialogShow = true
    },
    async removeSubject(index) {
      const id = this.subjectList[index].id
      const res = await this.$api.removeSubject(id)
      if (res.status === 1) {
        this.$message.success(res.msg)
        this.searchSubject()
      } else {
        this.$message.error(res.msg)
      }
    },
    changeSubject() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.changing = true
          const res = await this.$api.changeSubject(this.form.id, {
            name: this.form.name,
            professionIds: this.form.professionIds.join(',')
          })
          if (res.status === 1) {
            this.$message.success(res.msg)
            this.searchSubject()
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
.subject{
  padding: 20px;
  .select{
    width: 500px;
    margin: 0 auto;
    .upload{
      margin: 20px 80px;
    }
  }
  .subject-table{
    min-height: 500px;
    width: 500px;
    margin: 20px auto 0;
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
