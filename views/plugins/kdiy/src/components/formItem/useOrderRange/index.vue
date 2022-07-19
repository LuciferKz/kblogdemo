/**
 * @author FENG LI
 * @email feng.li@arvato.cn
 * @create date 2020-04-17 14:32:15
 */
<template>
  <div>
    <!-- <el-button @click="test">按钮</el-button> -->
    <ax-form
      @submit.native.prevent
      class="form"
      :model="currentModel"
      size="small"
      label-position="left"
      :disabled="disabled"
      hide-required-asterisk
      ref="form"
    >
      <quick-form-item v-for="item,prop,itemIndex in model" :key="prop" :model="item" :prop="prop"></quick-form-item>
    </ax-form>
  </div>
</template>

<script>
import quickFormItem from "@/components/quickFormItem";

const orderRangeMap = {
  SINGLE: "orderProducts",
  CATEGORY: "orderProductCategorys"
};
const exOrderRangeMap = {
  orderProducts: "exOrderProducts",
  orderProductCategorys: "exOrderProductCategorys"
};

export default {
  props: {
    value: Object,
    orderRange: Object,
    exOrderRange: Object,
    data: Array,
    disabled: {
      default: false
    }
  },
  data() {
    const vm = this;
    const r = this.$rules;

    return {
      flag: false,
      model: {
        range: {
          type: "select",
          label: "",
          value: "",
          rules: [r.required()],
          options: [
            {
              label: "全部商品",
              value: 1
            },
            {
              label: "指定商品",
              value: 2
            },
            {
              label: "不参与商品",
              value: 3
            }
          ],
          events: {
            change: this.rangeOnChange
          }
        },
        orderRange: {
          type: "radio",
          label: "",
          value: "",
          hide: true,
          props: {
            props: {
              label: "text"
            }
          },
          rules: [r.required()],
          events: {
            change: this.orderRangeOnChange
          },
          options: this.orderRange.options
        },
        exOrderRange: {
          type: "radio",
          label: "",
          value: "",
          hide: true,
          props: {
            props: {
              label: "text"
            }
          },
          rules: [r.required()],
          events: {
            change: this.exOrderRangeOnChange
          },
          options: this.exOrderRange.options
        },
        orderProducts: {
          custom: true,
          label: "",
          type: "selector",
          hide: true,
          value: [],
          props: {
            label: "添加商品",
            type: "product",
            filter: {
              selectOnShelf: true,
              excludedTypes: 3,
            }
          },
          rules: [r.required()]
        },
        orderProductCategorys: {
          value: [],
          label: "",
          type: "treeSelect",
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
    currentModel() {
      let data = {};
      for (let key in this.model) {
        data[key] = this.model[key].value;
      }
      return data;
    }
  },
  watch: {
    value: {
      handler(v) {
        const {
          range = "",
          orderRange = "",
          exOrderRange = "",
          orderProducts = [],
          orderProductCategorys = [],
          exOrderProducts = [],
          exOrderProductCategorys = []
        } = v;

        if (range) {
          this.model.range.value = range;
          this.rangeOnChange(range);
        }

        if (range == 2) {
          this.model.orderRange.value = orderRange;
          if (orderRange) {
            this.orderRangeOnChange(orderRange);
            this.model[orderRangeMap[orderRange]].value =
              v[orderRangeMap[orderRange]];
          }
        } else if (range == 3) {
          this.model.exOrderRange.value = exOrderRange;
          if (exOrderRange) {
            this.exOrderRangeOnChange(exOrderRange);
            this.model[orderRangeMap[exOrderRange]].value =
              v[exOrderRangeMap[orderRangeMap[exOrderRange]]];
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // test() {
    //   this.validate()
    //     .then(() => {
    //       const data = this.getFormData();

    //       console.log(data);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       const { msg } = err || {};
    //       this.$message.warning(msg || this.$tips.form_validate_fail());
    //     });
    // },
    rangeOnChange(v) {
      this.model.orderRange.hide = v != 2;
      this.model.exOrderRange.hide = v != 3;

      if (v == 1 || v == 2 || v == 3 || !v) {
        this.model.orderProducts.hide = true;
        this.model.orderProductCategorys.hide = true;
      }

      if (v == 2 || v == 3) {
        this.model.orderProducts.value = [];
        this.model.orderProductCategorys.value = [];
      }

      if (v == 2) {
        this.model.orderRange.value = "";
      }
      if (v == 3) {
        this.model.exOrderRange.value = "";
      }
    },
    orderRangeOnChange(v) {
      this.model.orderProducts.hide = v != "SINGLE";
      this.model.orderProductCategorys.hide = v != "CATEGORY";
    },
    exOrderRangeOnChange(v) {
      this.model.orderProducts.hide = v != "SINGLE";
      this.model.orderProductCategorys.hide = v != "CATEGORY";
    },
    getFormData() {
      const form = this.$refs.form.getFormData();
      const {
        exOrderRange,
        orderRange,
        orderProducts,
        orderProductCategorys,
        range
      } = form;

      const fresh = {
        range
      };

      switch (range) {
        case 2:
          const k2 = orderRangeMap[orderRange];
          fresh[k2] = form[k2];
          fresh.orderRange = orderRange;
          break;
        case 3:
          const k3 = orderRangeMap[exOrderRange];
          fresh[exOrderRangeMap[k3]] = form[k3];
          fresh.exOrderRange = exOrderRange;
          break;
      }

      return fresh;
    },
    validate() {
      return this.$refs.form.validate.apply(this, arguments);
    }
  },
  components: {
    quickFormItem
  }
};
</script>
