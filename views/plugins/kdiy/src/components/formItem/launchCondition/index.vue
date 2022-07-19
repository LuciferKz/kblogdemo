<template>
  <div class="product-price">
    好友助力满 <el-input-number size="small" 
    v-model="currentValue.helpNumber" :disabled="disabled" :controls="false" >
    </el-input-number> 次,即可获赠 <el-input-number
    v-model="currentValue.giftNumber"  :disabled="disabled" :controls="false" ></el-input-number> 件奖品
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