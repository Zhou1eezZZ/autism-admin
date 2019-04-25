<template>
  <div>
    <el-form
      ref="interInfoData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="125px"
    >
      <el-form-item prop="interventionId" label="患者ID">
        <el-input v-model="data.interventionId"/>
      </el-form-item>
      <el-form-item prop="interventionistId" label="治疗师ID">
        <el-input v-model="data.interventionistId" disabled/>
      </el-form-item>
      <el-form-item prop="state" label="干预状态">
        <!-- <el-input v-model="data.state"/> -->
        <el-select v-model="data.state" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in interDic"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="startTime" label="开始时间">
        <el-date-picker
              v-model="data.startTime"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
              style="float:left">
            </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime" label="结束时间">
        <el-date-picker
              v-model="data.endTime"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
              style="float:left">
            </el-date-picker>
      </el-form-item>
      <el-form-item prop="blog" label="干预日志">
        <el-input  type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="data.blog"/>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import interDic from '@/utils/dic/interventionState'
export default {
  data() {
    return {
      rules: {
        interventionId: [{ required: true, message: '患者ID为必填项', trigger: 'blur' }],
        interventionistId: [
          { required: true, message: '治疗师ID为必填项', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '干预状态为必填项', trigger: 'blur' }
        ]
      },
      interDic: interDic
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
