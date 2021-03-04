<template>
  <div>
    <el-form
      ref="userInfoData"
      :rules="rules"
      :model="data"
      label-position="right"
      label-width="125px"
    >
    <el-form-item v-if="isCreated" prop="uuid" label="用户ID">
        <el-input v-model="data.uuid" disabled/>
      </el-form-item>
      <el-form-item prop="name" label="用户名">
        <el-input v-model="data.name"/>
      </el-form-item>
      <el-form-item prop="type" label="用户类型">
        <el-select v-model="data.type" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in userDic"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <div v-if="data.type === '4'">
        <el-form-item prop="deptId" label="所属机构">
          <el-input v-model="data.deptId"/>
        </el-form-item>
        <el-form-item prop="qualificationNumber" label="干预师资格认证号">
          <el-input v-model="data.qualificationNumber"/>
        </el-form-item>
        <el-form-item prop="workTime" label="从业时间">
          <el-date-picker
              v-model="data.workTime"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
              style="float:left">
            </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item prop="phone" label="手机号">
       <el-input v-model="data.phone" :disabled="isCreated"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="data.email"/>
      </el-form-item>
      <el-form-item prop="realName" label="真实姓名">
        <el-input v-model="data.realName"/>
      </el-form-item>
      <el-form-item prop="sex" label="性别">
        <el-select v-model="data.sex" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in sexDic"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="nation" label="民族">
        <el-select v-model="data.nation" placeholder="请选择" style="float:left">
          <el-option
            v-for="item in nationDic"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="address" label="地址">
        <el-input v-model="data.address"/>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import userDic from '@/utils/dic/user'
import sexDic from '@/utils/dic/sex'
import nationDic from '@/utils/dic/nation'
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '用户名为必填项', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号为必填项', trigger: 'blur' }],
        uuid: [{ required: true, message: 'ID为必填项', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱为必填项', trigger: 'blur' },
          {
            pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            message: '邮箱格式有误',
            trigger: 'blur'
          }
        ]
      },
      sexDic: sexDic,
      nationDic: nationDic,
      userDic: userDic
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
        !this.data.deptId&&(this.data.deptId=0)
        this.$emit('add', this.data)
      }
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
