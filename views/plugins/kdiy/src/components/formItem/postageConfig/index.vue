<template>
  <el-col>
    <el-row>
      <el-radio v-model="currentValue.postageType" label="1">运费模板</el-radio>
      <el-select v-model="currentValue.postageTemplateId">
        <el-option></el-option>
      </el-select>
    </el-row>
    <div class="hint">如果开启了同城配送，系统优先使用同城配送方式，如果未开启同城配送或者超出同城配送范围则使用普通快递方式计算运费</div>
    <el-row>
      <el-radio v-model="currentValue.postageType" label="2">统一邮费</el-radio>
      <div class="uniform-postage-input"><el-input v-model="currentValue.uniformPostage" width="200"><span slot="append">元</span></el-input></div>
    </el-row>
    <div class="hint">如果开启了同城配送，同城运费根据统一邮费进行计算( * 付邮试用商品必须设置邮费 )</div>
  </el-col>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: {
        uniformPostage: 0,
        postageTemplateId: 0,
        postageType: 0,
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    currentValue: {
      get () {
        return this.value;
      },
      set (v) {
        this.$emit('input', v);
      }
    }
  }
}
</script>

<style scoped>
  .uniform-postage-input {
    display: inline-block;
    width: 200px;
  }
  .hint {
    font-size: 12px;
    color: #888;
  }
</style>