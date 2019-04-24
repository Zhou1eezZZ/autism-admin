<template>
  <div class="dashboard-container">
    <el-card style="text-align:center">
      <div slot="header" style="text-align:left;">
        <span style="font-size:1.8rem;font-weight:bold">我的信息</span>
      </div>
      <transition name="fade" mode="out-in" appear>
        <user-form :is-editable.sync="editable" @changeEditState="changeEditState"/>
      </transition>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userForm from './components/UserForm'

export default {
  name: 'Dashboard',
  data() {
    return {
      editable: false
    }
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  components: {
    userForm
  },
  methods: {
    changeEditState(state) {
      this.editable = state
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
