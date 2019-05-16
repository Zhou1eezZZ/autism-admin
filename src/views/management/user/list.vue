<template>
  <div class="page-container">
    <el-card>
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-plus"></i> 新增
      </el-button>
      <el-table v-loading="listLoading" :data="userList" fit style="margin-top:20px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
              <el-form-item label="用户 ID">
                <span>{{ props.row.uuid }}</span>
              </el-form-item>
              <el-form-item label="真实姓名">
                <span v-if="props.row.realName">{{ props.row.realName }}</span>
                <span v-else>未填写</span>
              </el-form-item>
              <el-form-item label="地址">
                <span v-if="props.row.address">{{ props.row.address }}</span>
                <span v-else>未填写</span>
              </el-form-item>
              <div v-if="props.row.type === '4'">
                <el-form-item label="所属机构">
                  <span>{{ props.row.deptId }}</span>
                </el-form-item>
                <el-form-item label="从业时间">
                  <span>{{ props.row.workTime|formatDate('yyyy-MM-dd') }}</span>
                </el-form-item>
                <el-form-item label="干预师资格认证号">
                  <span>{{ props.row.qualificationNumber }}</span>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="65px">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.type|filterByDic(userDic)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.email}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sex|filterByDic(sexDic)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="民族" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.nation|filterByDic(nationDic)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="130" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="resetPsw(scope.row)">重置密码</el-button>
            <el-button
              type="text"
              :class="{danger:scope.row.type!=='0'}"
              :disabled="scope.row.type==='0'"
              @click="deleteUser(scope.row)"
            >删除</el-button>
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
      style="text-align:center;padding: 0 20px"
    >
      <user-info-form
        ref="userForm"
        :data="tmpData"
        :is-created="dialogTitle!=='新增用户'"
        @add="addUser"
        @update="updateUser"
        @close="handleClose"
      />
    </el-dialog>
  </div>
</template>

<script>
import UserAPI from '@/api/user'
import Pagination from '@/components/Pagination'
import userDic from '@/utils/dic/user'
import sexDic from '@/utils/dic/sex'
import nationDic from '@/utils/dic/nation'
import UserInfoForm from './components/userInfoForm'
export default {
  data() {
    return {
      userList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listLoading: false,
      userDic: userDic,
      sexDic: sexDic,
      nationDic: nationDic,
      dialogTitle: '',
      showDialog: false,
      tmpData: {}
    }
  },
  components: { Pagination, UserInfoForm },
  filters: {
    filterByDic(val, dic) {
      // debugger
      if (val && dic) {
        return dic.find(e => e.value === val).label
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const vm = this
      await UserAPI.getUserInfo(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.userList = res.data.data.list
          this.total = res.data.data.total
          // vm.$message({
          //   type: 'success',
          //   message: '用户表加载成功'
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
      this.dialogTitle = '新增用户'
      this.showDialog = true
      this.$set(this.tmpData, 'type', '1')
    },
    handleEdit(row) {
      this.dialogTitle = '编辑用户'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.userForm.$refs.userInfoData.resetFields()
    },
    // TODO addUser
    async addUser(data) {
      const vm = this
      this.$set(data, 'password', '123456')
      await UserAPI.userSignUp(data).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          vm.$message({
            type: 'success',
            message: '添加用户成功'
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
    async updateUser(data) {
      const vm = this
      this.$delete(data, 'updateTime')
      this.$delete(data, 'phone')
      await UserAPI.userUpdate(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '用户信息更新成功'
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
    deleteUser(row) {
      const vm = this
      this.$confirm('是否确认删除该用户', '提示', {
        type: 'warning'
      })
        .then(() => {
          // debugger
          UserAPI.userDelete(row).then(res => {
            if (res && res.data && res.data.successful) {
              vm.$message({
                type: 'success',
                message: '删除用户成功'
              })
              vm.getList()
            } else {
              vm.$message({
                type: 'error',
                message: res.data.statusMessage
              })
            }
          })
        })
        .catch()
    },
    resetPsw(row) {
      const vm = this
      this.$confirm('是否将该用户密码重置为123456', '提示', {
        type: 'warning'
      }).then(() => {
        const data = {
          uuid: row.uuid,
          newPsd: '123456',
          updateUserType: this.$store.state.user.type
        }
        UserAPI.pswUpdate(data).then(res => {
          if (res && res.data && res.data.successful) {
            vm.$message({
              type: 'success',
              message: '重置密码成功'
            })
            vm.getList()
          } else {
            vm.$message({
              type: 'error',
              message: res.data.statusMessage
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.danger {
  color: #f56c6c;
}
</style>
