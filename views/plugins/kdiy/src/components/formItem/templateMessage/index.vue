<template>
  <div class="template-message__content">
    <div class="content__lt">
      <el-row class="el-form__row">
        <el-col v-for="(item, prop) in form" :key="prop">
          <ax-form @submit.native.prevent v-if="!loading" :model="currentValue" class="form" size="small" :label-width="'150px'" label-position="left" hide-required-asterisk ref="form">
            <quick-form-item :model="item" :prop="prop" :key="prop" :ref="prop"></quick-form-item>
          </ax-form>
        </el-col>
      </el-row>
    </div>
    <div class="content__rt">
      <el-select class="message—type__select" v-model="messageTypeId" placeholder="选择所需的模板消息" @change="handleLabelCategoryChange">
        <el-option v-for="item in messageTypeOption" :key="item.categoryName" :value="item.categoryName" :label="item.categoryName"></el-option>
      </el-select>
      <div class="message__buttons">
        <el-button class="message_buttonn" v-for="lbl in labels" :key="lbl.value" @click="handleClickMessage(lbl.labelValue)">{{ lbl.labelName }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import quickFormItem from '@/components/quickFormItem';

export default {
  name: 'template-message-content',

  components: { quickFormItem },

  props: {
    value: Object,
    content: String,
    labelsData: Array,
  },

  data () {
    return {
      form : {},
      template: '',
      messageTypeId: '',
      // messageTypeOption: [],
      // messages: ['商品名称', '粉丝昵称', '订单号', '订单金额', '运费', '快递公司', '快递单号', '购买者姓名', '收货地址', '下单时间', '购买者电话', '支付时间', '发货时间', '收货时间', '备注信息'],
      labels: [],
      loading: false,
    }
  },

  mounted () {
    if (this.content) this.handleLoadTemplate(this.content);
  },

  methods: {
    handleFocusInput (key) {
      this.currentKey = key;
    },
    handleClickMessage (v) {
      if (!this.currentKey || !this.form[this.currentKey]) return false;
      this.form[this.currentKey].value = v;
    },
    handleLoadTemplate (str) {
      let results = str.match(/[^(\{|\})]+\{\{.*(?=.DATA\}\})/g) || [];
      this.loading = true;
      let form = {};
      // let model = {};
      results.forEach((result, index) => {
        let arr = result.split(':{{');
        let name = arr[0];
        let key = arr[1];
        console.log(this.currentValue[key]);
        form[key] = {
          value: '',
          label: name,
          type: 'input',
          events: {
            focus: () => { return this.handleFocusInput(key); }
          }
        }

        // model[key] = '';
      })
      this.form = form;
      // this.currentValue = model;
      this.$nextTick(() => {
        this.loading = false;
      })
    },
    handleLabelCategoryChange (v) {
      this.labels = this.messageTypeOption.find(opt => opt.categoryName = v).labels;
    }
  },

  computed: {
    currentValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('input', value);
      },
    },
    messageTypeOption () {
      return this.labelsData || [];
    },
  },

  watch: {
    content (newVal) {
      this.handleLoadTemplate(newVal);
    },
  }
}
</script>

<style lang="scss" scoped>
  .template-message__content {
    display: flex;

    .content__lt {
      flex: 1;
    }

    .content__rt {
      flex: 1;
      border-left: 1px dashed #666;
      padding-left: 30px;

      .message—type__select {
        margin-bottom: 20px;
      }

      .message_buttonn {
        margin: 10px;
      }
    }
  }
</style>