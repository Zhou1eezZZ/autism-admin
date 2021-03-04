<template>
  <div class="page-container">
    <el-card>
      <el-button v-if="$store.state.user.type==='0'||$store.state.user.type==='4'" type="primary"  @click="handleAdd">
        <i class="el-icon-plus"></i> 新增
      </el-button>
      <el-table v-loading="listLoading" :data="interventionList" fit style="margin-top:20px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline label-width="100%">
              <el-form-item label="干预日志">
                <span>{{ props.row.blog }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="65px">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.patient.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="治疗师" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.docter.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="干预状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '2'">
              <span>{{filterByDic(scope.row.state,interventionDic)}}</span>
            </el-tag>
            <el-tag v-if="scope.row.state === '1'" type="info">
              <span>{{filterByDic(scope.row.state,interventionDic)}}</span>
            </el-tag>
            <el-tag v-if="scope.row.state === '3'" type="success">
              <span>{{filterByDic(scope.row.state,interventionDic)}}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="干预开始时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.startTime|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="干预结束时间" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state === '3' && scope.row.endTime!==0">{{scope.row.endTime|formatDate('yyyy-MM-dd')}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <div v-if="$store.state.user.uuid === scope.row.interventionistId || $store.state.user.type === '0'">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" class="danger" @click="deleteInter(scope.row)">删除</el-button>
            </div>
            <span v-else>无权限</span>
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
      <inter-info-form
        ref="interForm"
        :data="tmpData"
        :is-created="dialogTitle!=='新增干预报告'"
        @add="addInter"
        @update="updateInter"
        @close="handleClose"
       />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AsscessAPI from '@/api/asscess'
import interventionDic from '@/utils/dic/interventionState'
import InterInfoForm from './components/interInfoForm'
export default {
  data() {
    return {
      interventionList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listLoading: false,
      interventionDic: interventionDic,
      dialogTitle: '',
      showDialog: false,
      tmpData: {}
    }
  },
  components: { Pagination, InterInfoForm },
  filters: {},
  created() {
    this.getList()
  },
  methods: {
    filterByDic(val, dic) {
      return val === '0' ? '-' : dic.find(e => e.value === val).label
    },
    async getList() {
      this.listLoading = true
      const vm = this
      await AsscessAPI.getAsscess(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.interventionList = res.data.data.list
          this.total = res.data.data.total
          // vm.$message({
          //   type: 'success',
          //   message: '干预报告表加载成功'
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
      this.dialogTitle = '新增干预报告'
      this.showDialog = true
      this.$set(this.tmpData, 'interventionistId', this.$store.state.user.uuid)
    },
    handleEdit(row) {
      this.dialogTitle = '编辑干预报告'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.interForm.$refs.interInfoData.resetFields()
    },
    async addInter(data) {
      const vm = this
      data.startTime = data.startTime/1000
      data.endTime = data.endTime/1000
      await AsscessAPI.addAsscess(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '干预报告新增成功'
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
    async updateInter(data) {
      const vm = this
      await AsscessAPI.updateAsscess(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '干预报告更新成功'
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
    deleteInter(row) {
      const vm = this
      this.$confirm('是否确认删除该干预报告', '提示', {
        type: 'warning'
      }).then(() => {
        AsscessAPI.delAsscess(row).then(res => {
          if (res && res.data && res.data.successful) {
            vm.$message({
              type: 'success',
              message: '删除干预报告成功'
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