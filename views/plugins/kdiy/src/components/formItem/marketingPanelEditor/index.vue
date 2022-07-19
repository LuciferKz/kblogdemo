/**
 * @author liFeng
 * @email feng.li@arvato.com
 */
<template>
  <el-row>
    <el-col>
      <el-row
        type="flex"
        align="middle"
        :gutter="20"
        v-for="item,index in data"
        :key="item[ prop.keyword1 ].keys"
      >
        <el-col>
          <div class="orderly-list-box">
            <quickForm :model="item" ref="form" :layout="layout"></quickForm>
            <i
              class="el-icon-circle-close close"
              v-if="data.length != 1"
              @click="onDeleteOrderlyList(index)"
            ></i>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col>
      <el-button @click="onInsertOrderlyList">添加优惠</el-button>
    </el-col>
  </el-row>
</template>

<script>
import quickForm from "@/components/quickForm";

export default {
  name: "marketingPanelEditor",
  props: ["value", "prop", "config"],
  data() {
    const vm = this,
      r = this.$rules;

    return {
      layout: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 12,
        xl: 12
      },
      index: 0,
      model: []
    };
  },
  computed: {
    data() {
      const fresh = this.toDataRegroup(this.model);

      this.$emit("input", fresh);
      return this.model;
    }
  },
  created() {
    const { keyword1, keyword2 } = this.prop;
    this.model = this.value.map(item =>
      this.getOrderlyList([item[keyword1], item[keyword2]])
    );
  },
  watch: {
    config: {
      handler(v) {
        this.model = [this.getOrderlyList()];
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onDeleteOrderlyList(index) {
      this.model.splice(index, 1);
    },
    onInsertOrderlyList() {
      this.model.push(this.getOrderlyList());
    },
    getOrderlyList(values = []) {
      const vm = this;

      const { keyword1, keyword2 } = this.prop;
      const [v1 = "", v2 = ""] = values;
      const {
        keyword1: keyword_1_config = {},
        keyword2: keyword_2_config = {}
      } = this.config || {};

      const r = this.$rules;

      const TODOLIST_TEMPLATE = {
        [keyword1]: {
          keys: this.index++,
          type: "input",
          label: "消费满",
          value: v1,
          renderAppend(h) {
            return h("span", "元");
          },
          rules: [r.required(), r.number(), r.maxFloat(), r.greater(0)],
          ...keyword_1_config
        },
        [keyword2]: {
          type: "input",
          label: "优惠金额",
          value: v2,
          renderAppend(h) {
            return h("span", "元");
          },
          rules: [r.required(), r.number(), r.maxFloat(), r.greater(0)],
          ...keyword_2_config
        }
      };

      return TODOLIST_TEMPLATE;
    },
    toDataRegroup(data = []) {
      const { keyword1, keyword2 } = this.prop;

      const fresh = data.map(item => {
        return {
          [keyword1]: item[keyword1].value,
          [keyword2]: item[keyword2].value
        };
      });
      return fresh;
    },
    validate(callback) {
      const { form } = this.$refs;

      let promise = new Promise(function(resolve, reject) {
        callback = function(valid) {
          valid === true ? resolve(valid) : reject(valid);
        };
      });

      let arr = [];

      form.forEach(item => {
        item.validate(valid => {
          arr.push(valid);
        });
      });

      callback(!arr.includes(false));

      return promise;
    }
  },
  components: {
    quickForm
  }
};
</script>

<style lang="scss" scoped>
.orderly-list-box {
  padding: 20px 30px 0;
  border: 1px dashed #ccc;
  margin: 10px 0;
  position: relative;

  .close {
    position: absolute;
    right: -12px;
    top: -12px;
    font-size: 24px;
    color: #999;
  }
}
</style>