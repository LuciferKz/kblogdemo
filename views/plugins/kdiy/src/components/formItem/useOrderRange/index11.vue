/**
 * @author FENG LI
 * @email feng.li@arvato.cn
 * @create date 2020-04-17 14:32:15
 */
<template>
  <div>
    <el-radio-group v-model="currentValue.orderRange">
      <el-radio v-for="item,index in options" :key="item.value" :label="item.value">{{ item.text }}</el-radio>
    </el-radio-group>
    <quick-form style="margin-top:10px" :model="form" ref="form"></quick-form>
  </div>
</template>

<script>
import quickForm from "@/components/quickForm";

export default {
  props: {
    value: {
      type: Object,
      default: {
        orderRange: "ALL",
        orderProducts: [],
        orderProductCategorys: []
      }
    },
    options: Array,
    data: Array
  },
  data() {
    const vm = this;
    const r = this.$rules;

    return {
      form: {
        orderProducts: {
          custom: true,
          label: "商品SKU",
          type: "selector",
          hide: true,
          value: [],
          props: {
            label: "添加商品",
            type: "product"
          },
          rules: [r.required()]
        },
        orderProductCategorys: {
          value: [],
          label: "商品分类",
          type: "treeSelect",
          layout: { xs : 24, sm : 24, md : 12, lg : 12, xl : 12 },
          hide: true,
          data: this.data,
          props: {
            nodeKey: "id",
            showCheckbox: true,
            props: {
              label: "name",
              value: "id",
              children: "childCategory"
            }
          },
          rules: [r.required()]
        }
      }
    };
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
  created() {
    this.form.orderProducts.value = this.value.orderProducts || [];
    this.form.orderProductCategorys.value =
      this.value.orderProductCategorys || [];
  },
  watch: {
    "currentValue.orderRange": {
      handler(v) {
        this.form.orderProducts.hide = v != "SINGLE";
        this.form.orderProductCategorys.hide = v != "CATEGORY";
      },
      immediate: true
    },
    "form.orderProducts.value": {
      handler(v) {
        this.$emit("input", {
          ...this.value,
          orderProducts: v
        });
      }
    },
    "form.orderProductCategorys.value": {
      handler(v) {
        this.$emit("input", {
          ...this.value,
          orderProductCategorys: v
        });
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

      const { orderRange } = this.value;

      if (orderRange == "ALL") {
        callback(true);
        return promise;
      }

      return this.$refs.form.validate();
    }
  },
  components: {
    quickForm
  }
};
</script>
