<template>
  <div class="page-container">
    <el-card>
      <el-button type="primary">
        <i class="el-icon-plus"></i> 新增
      </el-button>
      <el-table v-loading="listLoading" :data="userList" fit style="margin-top:20px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" >
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
        <el-table-column label="邮箱" align="center">
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text">编辑</el-button>
            <el-button
              type="text"
              :class="{danger:scope.row.type!=='0'}"
              :disabled="scope.row.type==='0'"
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
  </div>
</template>

<script>
import UserAPI from '@/api/user'
import Pagination from '@/components/Pagination'
import userDic from '@/utils/dic/user'
import sexDic from '@/utils/dic/sex'
import nationDic from '@/utils/dic/nation'
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
      nationDic: nationDic
    }
  },
  components: { Pagination },
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
          vm.$message({
            type: 'success',
            message: '用户表加载成功'
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
