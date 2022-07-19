<template>
    <div class="custom-form-item member-discount-price">
        <div>
            <el-button type="primary" icon="el-icon-plus"  @click="handleAdd">新增</el-button>
        </div>
        <div class="item-box" v-for="(item,index) in value" :key="index">
            <el-checkbox v-model="item.required">是否必填</el-checkbox>
            <el-select v-model="item.promptType" placeholder="请选择" style="width:120px;margin-left: 15px">
                <el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="item.promptContent" maxlength="30" placeholder="请输入文本提示内容"></el-input>
            <el-button type="text" @click="handleDelete(index)">删除</el-button>
        </div>
    </div>
</template>
<script>
export default {
  props: ['value','options'],
  data () {
    return {
    }
  },
  created(){
      console.log('11111111111111', this.value)
  },
  methods: {
      handleAdd(){
        this.value.push({
          required: false,
          promptType: '',
          promptContent: '',
          // promptValue: '',
        })
      },
      handleDelete(i){
          this.value.splice(i,1)
      }
  },
  computed: {
    currentValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  }
}
</script>

<style lang="">
  .custom-form-item {
    color: #888;
  }
  .custom-form-item .el-input {
    margin: 0 10px;
    width: auto;
  }
  .custom-form-item .el-input:first-child {
    margin-left: 0;
  }
  .item-box{
      margin: 15px 0;
  }
</style>