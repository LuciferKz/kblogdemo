<template>
  <div>
    <el-radio-group v-model="currentValue.selector" :disabled="disabled">
      <el-radio label="no">无使用限制</el-radio>
      <el-radio label="yes">不与其他营销规则同时使用</el-radio>
    </el-radio-group>
    <div class="coupon__warpper" v-show="currentValue.selector == 'yes'">
      <p>选择不与优惠券同时共享得营销规则：(即优先享有如下优惠规则，将不能再使用优惠券优惠)</p>
      <el-row v-for="(child,index) in options" :key="child.label">
        <el-col :span="3">
          <el-checkbox
           :disabled="disabled"
            :indeterminate="child.isIndeterminate"
            v-model="child.model"
            @change="onCheckBoxChange($event, index)"
          >{{ child.label }}</el-checkbox>
        </el-col>
        <el-col :span="21">
          <el-checkbox-group v-model="child.value" :disabled="disabled"  @change="onCheckBoxGroupChange($event, index)">
            <el-checkbox
              v-for="item in child.options"
              :label="item.value"
              :key="item.value"
            >{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
const keyMaps = {
  0: "excludeType"
};

const VALIDATE_TEXT = "【使用限制】优惠使用限制不能为空";

export default {
  props: {
    value: {
      type: Object
    },
    disabled: {
      default: false
    },
    options: Array
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      valueMaps: {}
    };
  },
  created() {
    const { value, options } = this;

    options.forEach((item, index) => {
      const currentValue = this.value[keyMaps[index]];

      item.isIndeterminate = false;
      item.model = false;

      item.value =
        typeof currentValue === "string" && currentValue
          ? currentValue.split(",")
          : currentValue || [];

      this.valueMaps[index] = item.options.map(item => item.value);

      this.onCheckBoxGroupChange(item.value, index);
    });
  },
  watch: {
    "value.excludeType": {
      handler(v) {
        // this.$nextTick(() => {
        //   this.$forceUpdate();
        // });
      },
      immediate: true
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      }
    }
  },
  methods: {
    onCheckBoxChange(v, idx) {
      const vm = this.options[idx];

      this.$set(vm, "value", v ? this.valueMaps[idx] : []);
      this.$set(vm, "isIndeterminate", false);
      this.$emit("input", {
        ...this.value,
        [keyMaps[idx]]: v ? this.valueMaps[idx] : []
      });
    },
    onCheckBoxGroupChange(v, idx) {
      const vm = this.options[idx];
      const len = this.valueMaps[idx].length;
      const vlen = v.length;

      this.$set(vm, "model", vlen === len);
      this.$set(vm, "isIndeterminate", vlen > 0 && v.length < len);

      this.$emit("input", {
        ...this.value,
        [keyMaps[idx]]: v
      });
    },
    getFormData() {
      const { selector, excludeType } = this.currentValue;

      let data = {};
      if (selector == "yes") {
        data.excludeType = excludeType;
      }

      return data;
    },
    validate(callback) {
      let promise;

      if (!callback) {
        promise = new Promise(function(resolve, reject) {
          callback = function(valid) {
            valid === true ? resolve(valid) : reject(valid);
          };
        });
      }

      const { selector, excludeType } = this.currentValue;

      let status = false;

      switch (selector) {
        case "no":
          status = true;
          break;
        case "yes":
          const v = !!excludeType.length;
          status = v ? v : { msg: VALIDATE_TEXT };
          break;
        default:
          status = { msg: VALIDATE_TEXT };
          break;
      }

      callback(status);

      return promise;
    }
  },
  components: {}
};
</script>