/**
 * @author liFeng
 * @email feng.li@arvato.com
 */
<template>
  <el-radio-group v-model="data" v-on="events" :disabled="disabled">
    <el-row type="flex" :align="align || 'middle'" v-for="item,index in options" :key="item.value">
      <el-col :span="span[0] || 5" :style="{ minHeight:'50px' }">
        <el-radio :style="{ marginTop: '9px' }" :label="item.value">{{ item.label }}</el-radio>
      </el-col>
      <el-col :span="span[1] || 19" :style="{ minHeight: item.form ? 'auto': '50px' }">
        <quick-form
          v-if="item.form"
          :disabled="item.disabled"
          :layout="layout"
          :model="item.form"
          :ref="'form_'+item.value"
        ></quick-form>
      </el-col>
    </el-row>
  </el-radio-group>
</template>

<script>
import quickForm from "@/components/quickForm";

export default {
  name: "radioPanel",
  // props: ["value", "events", "options", "layout", "span", "align", 'disabled'],
   props: {
    value: String,
    events: Object,
    options: Array,
    layout: Object,
    span: Array,
    align: String,
    disabled:{
      default: false,
    }
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
  watch: {
    value: {
      handler(v) {
        const { options, value } = this;

        this.options.forEach(item => {
          item.disabled = true;
        });

        const opts = this.options.find(item => item.value === v) || {};
        opts.disabled = false;
      },
      immediate: true
    }
  },
  methods: {
    validate(callback) {
      const vm = this.$refs["form_" + this.value];

      let promise;

      if (!callback) {
        promise = new Promise(function(resolve, reject) {
          callback = function(valid) {
            valid === true ? resolve(valid) : reject(valid);
          };
        });
      }

      const status = [];

      // console.log(" radioPanel:  ", callback, vm, this.$refs, this.value);

      if (vm) {
        vm[0].validate(function(valid) {
          status.push(valid);
        });
        callback(!status.includes(false));
      } else {
        callback(true);
      }

      return promise;
    },
    getFormData() {
      // console.log("getFormData: ", this.value);
      const vm = this.$refs["form_" + this.value];
      return vm
        ? vm[0].getFormData()
        : {
            value: this.value
          };
    }
  },
  components: {
    quickForm
  }
};
</script>