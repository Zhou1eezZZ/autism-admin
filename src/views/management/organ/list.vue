<template>
  <div class="page-container">
    <el-card>
      <el-button v-if="$store.state.user.type==='0'" type="primary" @click="handleAdd">
        <i class="el-icon-plus"></i> 新增
      </el-button>
      <el-table v-loading="listLoading" :data="organList" fit style="margin-top:20px">
        <el-table-column label="序号" align="center" width="65px">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构名" align="center" width="280px">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="机构ID" align="center" width="280px">
          <template slot-scope="scope">
            <span>{{scope.row.uuid}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="所在地" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.localtion}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成立时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.registrationTime*1000|formatDate('yyyy')}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="$store.state.user.type==='0'" label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" class="danger" @click="deleteOrgan(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
        style="margin-top:20px"
      />
    </el-card>
    <el-dialog
      :visible.sync="showDialog"
      :title="dialogTitle"
      :before-close="handleClose"
      style="text-align:center"
    >
      <organ-info-form
        ref="organForm"
        :data="tmpData"
        :is-created="dialogTitle!=='新增机构'"
        @add="addOrgan"
        @update="updateOrgan"
        @close="handleClose"
       />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import DeptAPI from '@/api/dept'
import OrganInfoForm from './components/organInfoForm'
export default {
  data() {
    return {
      organList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listLoading: false,
      dialogTitle: '',
      showDialog: false,
      tmpData: {}
    }
  },
  components: { Pagination, OrganInfoForm },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const vm = this
      await DeptAPI.getDept(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.organList = res.data.data.list
          this.total = res.data.data.total
          // vm.$message({
          //   type: 'success',
          //   message: '机构表加载成功'
          // })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.listLoading = false
    },
    handleAdd() {
      this.dialogTitle = '新增机构'
      this.showDialog = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑机构'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
      this.tmpData.registrationTime *= 1000
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.organForm.$refs.organInfoData.resetFields()
    },
    async addOrgan(data) {
      const vm = this
      data.registrationTime /= 1000
      await DeptAPI.addDept(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '机构新增成功'
          })
          vm.getList()
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.handleClose()
    },
    async updateOrgan(data) {
      const vm = this
      data.registrationTime /= 1000
      await DeptAPI.updateDept(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '机构更新成功'
          })
          vm.getList()
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.handleClose()
    },
    deleteOrgan(row) {
      const vm = this
      this.$confirm('是否确认删除该机构', '提示', {
        type: 'warning'
      }).then(() => {
        DeptAPI.delDept(row).then(res => {
          if (res && res.data && res.data.successful) {
            vm.$message({
              type: 'success',
              message: '删除机构成功'
            })
            vm.getList()
          } else {
            vm.$message({
              type: 'error',
              message: res.data.statusMessage
            })
          }
        })
      }).catch()
    }
  }
}
</script>
<style scoped>
.danger {
  color: #f56c6c;
}
</style>