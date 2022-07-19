<template>
  <div class="product-price">
    <el-input-number size="small" v-model="currentValue.presentPrice" :disabled="disabled" :controls="false" :min="0" :precision="2"></el-input-number>元,
    原价<el-input-number v-model="currentValue.originalPrice" :disabled="disabled" :controls="false" :min="0" :precision="2"></el-input-number>,
    成本价<el-input-number v-model="currentValue.costPrice" :disabled="disabled" :controls="false" :min="0" :precision="2"></el-input-number>元
  </div>
</template>

<script>
export default {
  props: ['value','disabled'],
  data () {
    return {
      // currentValue: {
      //   presentPrice: '',
      //   originalPrice: '',
      //   costPrice: '',
      // }
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
  .product-price {
    color: #888;
  }
  .product-price .el-input {
    margin: 0 10px;
    width: auto;
  }
  .product-price .el-input:first-child {
    margin-left: 0;
  }
</style>