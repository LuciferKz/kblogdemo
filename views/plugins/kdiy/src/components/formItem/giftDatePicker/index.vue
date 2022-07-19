/**
 * @author liFeng
 * @email feng.li@arvato.com
 */
<template>
  <div>
    <ax-form
      @submit.native.prevent
      class="form"
      :model="model"
      size="small"
      label-width="0px"
      label-position="left"
      hide-required-asterisk
      ref="formOne"
    >
      <el-row type="flex">
        <el-col style="width:395px">
          <quick-form-item :model="model" prop="value" ref="picker"></quick-form-item>
        </el-col>
        <el-col style="flex: 1;padding-left:5px">
          <a href="javascript:;" @click="openDialog">高级选项</a>
        </el-col>
      </el-row>
    </ax-form>
    <el-dialog
      title="周期时段设置"
      @close="closeDialogHandler"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <quickForm :model="form" ref="formTwo"></quickForm>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import quickForm from "@/components/quickForm";
import quickFormItem from "@/components/quickFormItem";
import { format } from "@/utils";

const ONEWEEK = 3600 * 1000 * 24 * 7;
const DEFAULT_TIME = ["00:00:00", "23:59:59"];
const DATEMAP = {
  0: "1",
  1: "2",
  2: "3",
  3: "4",
  4: "5",
  5: "6",
  6: "7"
};

export default {
  name: "giftDatePicker",
  props: ["value"],
  data() {
    const vm = this,
      r = this.$rules;

    return {
      dialogVisible: false,
      model: {
        label: "",
        type: "datetime",
        value: "",
        props: {
          style: "width:395px !important",
          type: "datetimerange",
          "default-time": [this.getDefaultTime()],
          "value-format": "yyyy-MM-dd HH:mm:ss",
          "range-separator": "至",
          "start-placeholder": "开始时间",
          "end-placeholder": "结束时间",
          "picker-options": {
            disabledDate(date) {
              return (
                new Date(date).getTime() + 3600 * 1000 * 24 * 1 < Date.now()
              );
            }
          }
        },
        rules: [r.required()],
        events: {
          change(v) {
            const [startTime = "", endTime = ""] = v || [];
            const { effectDays = "", effectTimeSlot = "" } = vm.value;

            vm.$emit("input", {
              startTime,
              endTime,
              effectDays,
              effectTimeSlot
            });
          }
        }
      },
      form: {
        effectDays: {
          label: "活动周期",
          value: [],
          type: "checkbox",
          // rules: [r.required()],
          options: [
            {
              disabled: true,
              label: "周一",
              value: "2"
            },
            {
              disabled: true,
              label: "周二",
              value: "3"
            },
            {
              disabled: true,
              label: "周三",
              value: "4"
            },
            {
              disabled: true,
              label: "周四",
              value: "5"
            },
            {
              disabled: true,
              label: "周五",
              value: "6"
            },
            {
              disabled: true,
              label: "周六",
              value: "7"
            },
            {
              disabled: true,
              label: "周日",
              value: "1"
            }
          ]
        },
        effectTimeSlot: {
          label: "活动时段",
          value: DEFAULT_TIME,
          type: "timePicker",
          props: {
            "is-range": true,
            "value-format": "HH:mm:ss",
            "range-separator": "至",
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间"
          }
          // rules: [r.required()]
        }
      }
    };
  },
  watch: {
    value: {
      handler(v) {
        const {
          //  活动周期
          effectDays = "",
          //  活动时段
          effectTimeSlot = "",
          //  活动开始时间
          startTime = "",
          //  活动结束时间
          endTime = ""
        } = v || {};

        if (startTime && endTime) {
          this.model.value = [startTime, endTime];
        }

        if (effectDays) {
          this.form.effectDays.value = effectDays.split(",");
        }
        if (effectTimeSlot) {
          this.form.effectTimeSlot.value = effectTimeSlot.split("-");
        }
      },
      immediate: true
    }
  },
  created() {
    // this.$nextTick(() => {
    //   this.refreshTime();
    // });
  },
  methods: {
    refreshTime() {
      const { props } = this.model,
        fn = this.getDefaultTime;
      let timer = setInterval(() => {
        props["default-time"] = [fn()];
        // this.$refs.picker.getInput().mountPicker();
      }, 1000);

      this.$once("hook:beforeDestroy", function() {
        clearInterval(timer);
      });
    },
    closeDialogHandler() {
      const { effectDays, effectTimeSlot } = this.form;
      effectDays.value = [];
      effectTimeSlot.value = [];
    },
    openDialog() {
      this.setWeekOptions();

      const { effectDays, effectTimeSlot } = this.value;
      if (effectDays) {
        let arr = effectDays.split(",");
        this.form.effectDays.options.forEach(item => {
          const { value, disabled } = item;
          if (arr.includes(value) && disabled) {
            let index = arr.indexOf(value);
            if (index > -1) {
              arr.splice(index, 1);
            }
          }
        });
        this.form.effectDays.value = arr;
      } else {
        this.form.effectDays.value = [];
      }

      this.form.effectTimeSlot.value = effectTimeSlot
        ? effectTimeSlot.split("-")
        : DEFAULT_TIME;

      this.dialogVisible = true;
    },
    onDialogConfirm() {
      const {
        effectDays = [],
        effectTimeSlot = []
      } = this.$refs.formTwo.getFormData();

      const fresh = {};

      fresh.effectDays =
        effectDays && effectDays.length ? effectDays.join(",") : "";
      fresh.effectTimeSlot =
        effectTimeSlot && effectTimeSlot.length ? effectTimeSlot.join("-") : "";

      this.$emit("input", {
        ...this.value,
        ...fresh
      });
      this.dialogVisible = false;
    },
    getDefaultTime() {
      return format(this.getFiveDate(), "hh:mm:ss");
    },
    getFiveDate(minutes = 5) {
      const date = new Date();
      const m = date.getMinutes();
      date.setMinutes(m + minutes);
      return date;
    },
    setWeekOptions() {
      const v = this.model.value;
      const { effectDays } = this.form;

      effectDays.options = effectDays.options.map(item => ({
        ...item,
        disabled: true
      }));

      if (!v) {
        return;
      }

      const start = new Date(v[0]),
        end = new Date(v[1]),
        startMouth = start.getMonth(),
        endMouth = end.getMonth();
      let differ = end.getTime() - start.getTime();

      if (differ >= ONEWEEK) {
        effectDays.options = effectDays.options.map(item => ({
          ...item,
          disabled: false
        }));
      } else {
        const days = this.getALLDay(
          format(v[0], "yyyy-MM-dd"),
          format(v[1], "yyyy-MM-dd")
        );

        days.forEach(day => {
          let opt = effectDays.options.find(item => item.value == day) || {};
          opt.disabled = false;
        });
      }
    },
    getALLDay(start, end) {
      const date = [];
      let i = 0;
      while (start <= end) {
        date[i] = start;
        let start_time = new Date(start).getTime();

        start = format(start_time + 24 * 60 * 60 * 1000, "yyyy-MM-dd");
        i++;
      }
      return date.map(item => {
        const day = new Date(item).getDay();
        return DATEMAP[day];
      });
    },
    validate(callback) {
      let promise = new Promise(function(resolve, reject) {
        callback = function(valid) {
          valid === true ? resolve(valid) : reject(valid);
        };
      });
      const {
        //  活动周期
        effectDays = "",
        //  活动时段
        effectTimeSlot = "",
        //  活动开始时间
        startTime = "",
        //  活动结束时间
        endTime = ""
      } = this.value || {};

      const sTime = new Date(startTime).getTime(),
        fiveTime = new Date(this.getFiveDate(4)).getTime();

      // if (sTime < fiveTime) {
      //   callback({
      //     msg: "活动开始时间设置需提前至少5分钟(当前时间)"
      //   });
      // }
      // if (!effectDays || !effectTimeSlot) {
      //   callback({ msg: "活动时间【高级选项】不能为空" });
      // }

      callback(true);

      return Promise.all([this.$refs.formOne.validate(), promise]);
    },
    getFormData() {
      return this.value;
    }
  },
  components: {
    quickForm,
    quickFormItem
  }
};
</script>