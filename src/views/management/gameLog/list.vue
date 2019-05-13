<template>
  <div class="page-container">
    <el-card>
      <el-button v-if="$store.state.user.type==='0'" type="primary">
        <i class="el-icon-plus"></i> 新增
      </el-button>
      <el-table v-loading="listLoading" :data="gameLogList" fit style="margin-top:20px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline label-width="100%">
              <el-form-item label="游戏日志">
                <span>{{ props.row.gameLog }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="65px">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户游戏日志ID" align="center" width="280px">
          <template slot-scope="scope">
            <span>{{scope.row.uuid}}</span>
          </template>
        </el-table-column>
        <el-table-column label="游戏" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.game.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="玩家" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.user.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime*1000|formatDate('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column> -->
        <el-table-column v-if="$store.state.user.type==='0'" label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text">编辑</el-button>
            <el-button type="text" class="danger">删除</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import GameLogAPI from '@/api/gameLog'
export default {
  data() {
    return {
      gameLogList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      listLoading: false
    }
  },
  components: { Pagination },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const vm = this
      await GameLogAPI.getGameRelation(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.gameLogList = res.data.data.list
          this.total = res.data.data.total
          vm.$message({
            type: 'success',
            message: '用户游戏日志列表加载成功'
          })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.statusMessage
          })
        }
      })
      this.listLoading = false
    }
  }
}
</script>
<style scoped>
.danger {
  color: #f56c6c;
}
</style>