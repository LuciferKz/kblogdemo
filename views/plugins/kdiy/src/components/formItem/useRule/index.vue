<template>
  <div>
    <el-radio-group v-model="currentValue.rangeType" :disabled="disabled">
      <el-radio :label="'NUM'">无使用条件</el-radio>
      <el-radio :label="'PRICE'">有使用条件</el-radio>
    </el-radio-group>
    <gift-condition-panel
      ref="panel"
      style="width: 700px;padding-left:0px"
      v-show="currentValue.rangeType=='PRICE'"
      v-model="currentValue"
      :prop="prop"
      :disabled="disabled"
      :options="options"
    ></gift-condition-panel>
  </div>
</template>

<script>
import giftConditionPanel from "../giftConditionPanel";
const VALIDATE_TEXT = "【使用规则】使用条件不能为空";

export default {
  props: {
    value: {
      type: Object,
      default: {
        rangeType: "NUM",
        orderAmount: 0,
        orderNum: 0,
        andOr: ""
      }
    },
    disabled: {
      default: false
    },
    options: Array
  },
  data() {
    return {
      prop: {
        keyword1: "andOr",
        keyword2: "orderAmount",
        keyword3: "orderNum"
      }
    };
  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(v) {
        v.rangeType = this.value.rangeType;
        this.$emit("input", v);
      }
    }
  },
  methods: {
    validate(callback) {
      let promise;

      if (!callback) {
        promise = new Promise(function(resolve, reject) {
          callback = function(valid) {
            valid === true ? resolve(valid) : reject(valid);
          };
        });
      }
      const { rangeType } = this.currentValue;

      let status = false;

      switch (rangeType) {
        case "NUM":
          status = true;
          break;
        case "PRICE":
          this.$refs.panel.validate(valid => {
            status = valid ? valid : { msg: VALIDATE_TEXT };
          });
          break;
        default:
          status = { msg: VALIDATE_TEXT };
          break;
      }

      callback(status);

      return promise;
    },
    getFormData() {
      return this.currentValue.rangeType == "PRICE"
        ? this.$refs.panel.getFormData()
        : {};
    }
  },
  components: {
    giftConditionPanel
  }
};
</script>