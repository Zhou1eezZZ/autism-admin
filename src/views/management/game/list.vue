<template>
  <div class="page-container">
    <el-card>
      <el-button type="primary">
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
        <el-table-column label="开发者ID" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.devId}}</span>
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
              <el-button type="text">编辑</el-button>
              <el-button type="text" class="danger">删除</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import GameAPI from '@/api/game'
export default {
  data() {
    return {
      gameList: [],
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
      await GameAPI.getGames(this.listQuery).then(res => {
        if (res && res.data && res.data.successful) {
          // debugger
          this.gameList = res.data.data.list
          this.total = res.data.data.total
          vm.$message({
            type: 'success',
            message: '游戏表加载成功'
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