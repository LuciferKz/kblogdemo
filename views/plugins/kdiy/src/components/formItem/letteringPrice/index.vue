<template>
    <div class="custom-form-item member-discount-price">
        <el-checkbox v-model="currentValue.isFull">满额免费</el-checkbox>
        满<el-input v-model="currentValue.fullPrice"></el-input>元免费
    </div>
</template>
<script>
export default {
  props: ['value'],
  data () {
    return {
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
</style>