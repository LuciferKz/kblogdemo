<template>
  <div class="custom-form-item member-discount-price">
    <el-input-number v-model.number="currentValue.memberDiscount" :controls="false"></el-input-number>折或者
    <el-input-number v-model.number="currentValue.memberDicountPrice" :controls="false"></el-input-number>元
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