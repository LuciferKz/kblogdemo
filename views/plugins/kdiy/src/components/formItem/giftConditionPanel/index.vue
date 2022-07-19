/**
 * @author liFeng
 * @email feng.li@arvato.com
 */
<template>
  <ax-form
    @submit.native.prevent
    class="form"
    :model="data"
    size="small"
    label-width="110px"
    label-position="left"
    hide-required-asterisk
    ref="form"
    :disabled="disabled"
  >
    <div class="condition-panel">
      <div class="fork-edit">
        <el-row type="flex" align="middle">
          <el-col :span="6">
            <el-row type="flex" align="middle">
              <el-form-item
                :label="model[ prop.keyword1 ].label"
                :rules="model[ prop.keyword1 ].rules"
                :prop="prop.keyword1"
              >
                <el-select
                  v-model="data[ prop.keyword1 ]"
                  :disabled="isSelect"
                  placeholder="请选择"
                  clearable
                  style="width: 90px"
                >
                  <el-option
                    v-for="opts in model[ prop.keyword1 ].options"
                    :key="opts.value"
                    :label="opts.text"
                    :value="opts.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :offset="2" :span="9">
            <el-row type="flex" align="middle">
              <div class="is-center">
                <el-checkbox style="margin:0 5px 18px 0" v-model="keyword2_checkbox_model"></el-checkbox>
                <el-form-item
                  label-width="55px"
                  :label="model[ prop.keyword2 ].label"
                  :rules="model[ prop.keyword2 ].rules"
                  :prop="prop.keyword2"
                >
                  <el-input
                    v-model="data[ prop.keyword2 ]"
                    :disabled="keyword2_input_disabled"
                    placeholder="请输入金额"
                    clearable
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row type="flex" align="middle">
              <div class="is-center">
                <el-checkbox style="margin:0 5px 18px 0" v-model="keyword3_checkbox_model"></el-checkbox>
                <el-form-item
                  label-width="55px"
                  :label="model[ prop.keyword3 ].label"
                  :rules="model[ prop.keyword3 ].rules"
                  :prop="prop.keyword3"
                >
                  <el-input
                    v-model="data[ prop.keyword3 ]"
                    :disabled="keyword3_input_disabled"
                    placeholder="请输入件数"
                    clearable
                  >
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="fork-line"></div>
    </div>
  </ax-form>
</template>

<script>
import quickFormItem from "@/components/quickFormItem";

export default {
  name: "giftConditionPanel",
  // props: ["value", "prop", "options", "config", "disabled"],
  props: {
    value: Object,
    prop: Object,
    options: Array,
    config: Object,
    disabled:{
      default: false,
    }
  },
  data() {
    const vm = this,
      r = this.$rules;

    return {
      isSelect: false,
      keyword2_checkbox_model: true,
      keyword3_checkbox_model: true,
      keyword2_input_disabled: false,
      keyword3_input_disabled: false,
      model: {}
    };
  },
  computed: {
    data: {
      set(v) {
        this.$emit("input", v);
      },
      get() {
        return this.value;
      }
    }
  },
  created() {
    const { keyword1, keyword2, keyword3 } = this.prop;
    const { value } = this;

    this.model = this.getOrderlyList([
      value[keyword1],
      value[keyword2],
      value[keyword3]
    ]);

    if (!value[keyword2]) {
      this.keyword2_checkbox_model = false;
    }
    if (!value[keyword3]) {
      this.keyword3_checkbox_model = false;
    }
  },
  watch: {
    keyword2_checkbox_model: {
      handler(v) {
        const r = this.$rules;
        const { keyword1, keyword2, keyword3 } = this.prop;
        const status = !!!(v && this.keyword3_checkbox_model);

        this.keyword2_input_disabled = !v;
        this.isSelect = status;
        this.model[keyword1].rules = status ? [] : [r.required()];

        if (v) {
          this.model[keyword2].rules.splice(3, 3, r.required(), r.greater(0));
        } else {
          this.model[keyword2].rules.splice(3, 3);
        }

        if (status) {
          this.data = {
            [keyword1]: null,
            [keyword2]: v ? this.value[keyword2] : "",
            [keyword3]: this.value[keyword3]
          };
        }
      }
    },
    keyword3_checkbox_model: {
      handler(v) {
        const r = this.$rules;
        const { keyword1, keyword2, keyword3 } = this.prop;
        const status = !!!(v && this.keyword2_checkbox_model);

        this.keyword3_input_disabled = !v;
        this.isSelect = status;
        this.model[keyword1].rules = status ? [] : [r.required()];

        if (v) {
          this.model[keyword3].rules.splice(2, 2, r.required());
        } else {
          this.model[keyword3].rules.splice(2, 1);
        }

        if (status) {
          this.data = {
            [keyword1]: null,
            [keyword2]: this.value[keyword2],
            [keyword3]: v ? this.value[keyword3] : ""
          };
        }
      }
    }
  },
  methods: {
    getOrderlyList(values = []) {
      const { options } = this;

      const { keyword1, keyword2, keyword3 } = this.prop;

      const {
        keyword1: keyword1_config = {},
        keyword2: keyword2_config = {},
        keyword3: keyword3_config = {}
      } = this.config || {};

      const [v1 = "", v2 = 0, v3 = 0] = values;

      const r = this.$rules;

      const TODOLIST_TEMPLATE = {
        [keyword1]: {
          options,
          label: "条件",
          value: v1,
          rules: [r.required()],
          ...keyword1_config
        },
        [keyword2]: {
          label: "消费满",
          value: v2,
          rules: [r.number(), r.maxFloat(), r.length(0, 10)],
          ...keyword2_config
        },
        [keyword3]: {
          label: "购买满",
          rules: [r.nInt(), r.length(0, 10)],
          value: v3,
          ...keyword3_config
        }
      };

      return TODOLIST_TEMPLATE;
    },
    validate() {
      return this.$refs.form.validate.apply( this , arguments );
    },
    getFormData() {
      return this.data;
    }
  },
  components: {
    quickFormItem
  }
};
</script>

<style lang="scss" scoped>
.condition-panel {
  position: relative;
  margin-bottom: 20px;

  .fork-edit {
    position: relative;
    z-index: 1;
  }

  .fork-line {
    position: absolute;
    width: 74px;
    border: 1px solid #ccc;
    border-right: 0;
    top: 15px;
    bottom: 30px;
    left: 150px;
    z-index: 0;
  }
}

.is-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>