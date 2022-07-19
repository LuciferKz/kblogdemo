<template>
  <div class="coupon__warpper">
    <el-row>
      <el-col :span="3">
        <el-checkbox  v-model="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
      </el-col>
      <el-checkbox-group v-model="currentValue">
        <el-checkbox v-for="(item,index) in options" :label="item.id" :key="index">{{item.text}}</el-checkbox>
      </el-checkbox-group>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array
    },
    options: Array
  },
  computed: {
    checkAll: {
      get() {
        return this.value.length == this.options.length;
      },
      set(val) {
        this.currentValue = val ? this.options.map(item => item.id) : [];
      }
    },
    currentValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      }
    },
    isIndeterminate () {
      return this.currentValue.length > 0 && this.currentValue.length < this.options.length;
    }
  },
};
</script>