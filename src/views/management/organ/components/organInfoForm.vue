<template>
  <div>
    <el-form
      ref="organInfoData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="125px"
    >
      <el-form-item prop="name" label="机构名">
        <el-input v-model="data.name"/>
      </el-form-item>
      <el-form-item v-if="isCreated" prop="uuid" label="机构ID">
        <el-input v-model="data.uuid" disabled/>
      </el-form-item>
      <el-form-item prop="localtion" label="所在地">
        <el-input v-model="data.localtion"/>
      </el-form-item>
      <el-form-item prop="registrationTime" label="成立时间">
        <!-- <el-input v-model="data.registrationTime"/> -->
        <el-date-picker
              v-model="data.registrationTime"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
              style="float:left">
            </el-date-picker>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '机构名为必填项', trigger: 'blur' }],
        localtion: [
          { required: true, message: '所在地为必填项', trigger: 'blur' }
        ],
        registrationTime: [
          { required: true, message: '成立时间为必填项', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    isCreated: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    confirm() {
      if (this.isCreated) {
        this.$emit('update', this.data)
      } else {
        this.$emit('add', this.data)
      }
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
