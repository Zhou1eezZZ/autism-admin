<template>
  <div class="page-container">
    <el-card>
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-plus"></i> 新增
      </el-button>
      <el-table v-loading="listLoading" :data="gameList" fit style="margin-top:20px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left">
              <el-form-item label="游戏 ID">
                <span>{{ props.row.uuid }}</span>
              </el-form-item>
              <el-form-item label="游戏简介">
                <span>{{ props.row.summary }}</span>
              </el-form-item>
              <el-form-item label="链接地址">
                <span>{{ props.row.url }}</span>
              </el-form-item>
              <el-form-item label="图片地址">
                <span>{{ props.row.img }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="65px">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="游戏名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="开发者" align="center" width="280px">
          <template slot-scope="scope">
            <span>{{scope.row.createUser.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div v-if="$store.state.user.type==='0' || scope.row.devId === $store.state.user.uuid">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" class="danger" @click="deleteGame(scope.row)">删除</el-button>
            </div>
            <el-button v-else type="text" disabled>无权限</el-button>
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
      <game-info-form
        ref="gameForm"
        :data="tmpData"
        :is-created="dialogTitle!=='新增游戏'"
        @add="addGame"
        @update="updateGame"
        @close="handleClose"
       />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import GameAPI from '@/api/game'
import GameInfoForm from './components/gameInfoForm'
export default {
  data() {
    return {
      gameList: [],
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
  components: { Pagination, GameInfoForm },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const vm = this
      await GameAPI.getGames(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.gameList = res.data.data.list
          this.total = res.data.data.total
          // vm.$message({
          //   type: 'success',
          //   message: '游戏表加载成功'
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
      this.dialogTitle = '新增游戏'
      this.showDialog = true
      this.$set(this.tmpData, 'devId', this.$store.state.user.uuid)
    },
    handleEdit(row) {
      this.dialogTitle = '编辑游戏'
      this.showDialog = true
      this.tmpData = Object.assign({}, row)
    },
    handleClose() {
      this.tmpData = {}
      this.showDialog = false
      // debugger
      this.$refs.gameForm.$refs.gameInfoData.resetFields()
    },
    async addGame(data) {
      const vm = this
      await GameAPI.addGame(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '游戏新增成功'
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
    async updateGame(data) {
      const vm = this
      await GameAPI.updateGame(data).then(res => {
        if (res && res.data && res.data.successful) {
          vm.$message({
            type: 'success',
            message: '游戏更新成功'
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
    deleteGame(row) {
      const vm = this
      this.$confirm('是否确认删除该游戏', '提示', {
        type: 'warning'
      }).then(() => {
        GameAPI.delGame(row).then(res => {
          if (res && res.data && res.data.successful) {
            vm.$message({
              type: 'success',
              message: '删除游戏成功'
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