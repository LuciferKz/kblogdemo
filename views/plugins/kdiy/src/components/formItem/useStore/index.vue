<template>
  <quick-form :label-width="'0'" :model="form" ref="form"></quick-form>
</template>

<script>
import quickForm from "@/components/quickForm";

// import { zCategoryTransfer } from "@/utils";

export default {
  props: {
    value: {
      type: Object,
      default: {
        orderProductCategorys: [],
        orderProducts: []
      }
    },
    data: Array,
    options: Array
  },
  inject: ["useRulePage"],
  data() {
    const vm = this;
    const r = this.$rules;

    return {
      form: {
        selector: {
          type: "radio",
          label: "",
          value: "ALL",
          props: {
            props: {
              label: "text"
            }
          },
          events: {
            change(v) {
              const exOrderRange =
                vm.useRulePage[0].items[
                  "couponVerify.orderRangeInfo.exOrderRange"
                ].props.options;

              exOrderRange.forEach(item => {
                item.disabled = v == "ALL" || v == "" ? false : true;
              });
            }
          },
          rules: [r.required()],
          options: vm.options
        },
        orderProductCategorys: {
          value: "",
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
            },
            placeholder: "无"
          },
          rules: [r.required()]
        },
        orderProducts: {
          custom: true,
          label: "",
          type: "selector",
          hide: true,
          value: [],
          props: {
            label: "添加商品",
            type: "product"
          },
          rules: [r.required()]
        }
      }
    };
  },
  created() {},
  watch: {
    "form.selector.value": {
      handler(v) {
        this.form.orderProducts.hide = v != "SINGLE";
        this.form.orderProductCategorys.hide = v != "CATEGORY";
      },
      immediate: true
    },
    value: {
      handler(v) {
        const {
          orderRange = "",
          orderProducts = [],
          orderProductCategorys = []
        } = v;

        this.form.selector.value = orderRange;

        if (orderRange == "SINGLE") {
          this.form.orderProducts.value = orderProducts;
        } else if (orderRange == "CATEGORY") {
          this.form.orderProductCategorys.value = orderProductCategorys;
        }

        this.$nextTick(() => {
          this.form.selector.events.change(orderRange);
        });
      },
      immediate: true
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    getFormData() {
      const {
        selector,
        orderProductCategorys,
        orderProducts
      } = this.$refs.form.getFormData();

      const fresh = {
        orderRange: selector
      };

      if (selector == "SINGLE") {
        fresh.orderProducts = orderProducts;
      } else if (selector == "CATEGORY") {
        fresh.orderProductCategorys = orderProductCategorys;
      }

      this.$emit("input", fresh);
      return fresh;
    }
  },
  components: {
    quickForm
  }
};
</script>
