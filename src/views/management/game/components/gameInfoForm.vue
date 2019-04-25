<template>
  <div>
    <el-form
      ref="gameInfoData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="125px"
    >
      <el-form-item prop="name" label="游戏名">
        <el-input v-model="data.name"/>
      </el-form-item>
      <el-form-item prop="devId" label="开发者ID">
        <el-input v-model="data.devId" disabled/>
      </el-form-item>
      <el-form-item prop="summary" label="游戏简介">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model="data.summary"/>
      </el-form-item>
      <el-form-item prop="url" label="游戏链接地址">
        <el-input v-model="data.url"/>
      </el-form-item>
      <el-form-item prop="img" label="图片链接地址">
        <el-input v-model="data.img"/>
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
        name: [{ required: true, message: '游戏名为必填项', trigger: 'blur' }],
        devId: [
          { required: true, message: '开发者ID为必填项', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '游戏简介为必填项', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '游戏链接地址为必填项', trigger: 'blur' }
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
