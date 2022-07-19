<template>
  <quick-form :label-width="'0'" :model="form" ref="form"></quick-form>
</template>

<script>
import quickForm from "@/components/quickForm";

// import { zCategoryTransfer } from "@/utils";

const VALIDATE_TEXT = "不使用优惠券的商品不能为空";

export default {
  props: {
    value: {
      type: Object,
      default: {
        exOrderProductCategorys: [],
        exOrderProducts: []
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
              const orderRange =
                vm.useRulePage[0].items[
                  "couponVerify.orderRangeInfo.orderRange"
                ].props.options;

              orderRange.forEach(item => {
                item.disabled = v == "ALL" || v == "" ? false : true;
              });
            }
          },
          rules: [r.required()],
          options: vm.options
        },
        exOrderProductCategorys: {
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
        exOrderProducts: {
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
        this.form.exOrderProducts.hide = v != "SINGLE";
        this.form.exOrderProductCategorys.hide = v != "CATEGORY";
      },
      immediate: true
    },
    value: {
      handler(v) {
        const {
          exOrderRange = "",
          exOrderProducts = [],
          exOrderProductCategorys = []
        } = v;

        this.form.selector.value = exOrderRange;

        if (exOrderRange == "SINGLE") {
          this.form.exOrderProducts.value = exOrderProducts;
        } else if (exOrderRange == "CATEGORY") {
          this.form.exOrderProductCategorys.value = exOrderProductCategorys;
        }

        this.$nextTick(() => {
          this.form.selector.events.change(exOrderRange);
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
        exOrderProductCategorys,
        exOrderProducts
      } = this.$refs.form.getFormData();

      const fresh = {
        exOrderRange: selector
      };

      if (selector == "SINGLE") {
        fresh.exOrderProducts = exOrderProducts;
      } else if (selector == "CATEGORY") {
        fresh.exOrderProductCategorys = exOrderProductCategorys;
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
