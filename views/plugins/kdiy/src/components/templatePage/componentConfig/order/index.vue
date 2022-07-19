<template :options="options">
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">订单中心设置</span></h2>
    <div class="pannelcontent">
      <ax-form @submit.native.prevent class="form" :model="model" size="small" :label-width="'100px'" label-position="left" hide-required-asterisk ref="form">
        <el-row>
          <el-col v-for="(item,prop) in formItems" :key="prop">
            <quick-form-item :model="item" :prop="prop" :key="prop" :ref="prop"></quick-form-item>
          </el-col>
        </el-row>
      </ax-form>
    </div>
  </div>
</template>

<script>
import quickFormItem from '@/components/quickFormItem';

export default {
  props: ["model", "editable"],
  components: { quickFormItem },
  inject: ['diypage'],
  data() {
    const vm = this;
    return {
      formItems: {
        order_num: {
          value: 4,
          label: '每行数量',
          type: 'radio',
          options: [{ label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }],
          events: {
            change (v) {
              vm.formItems.colorGroup.props.min = v;
              vm.formItems.colorGroup.props.max = v;
            }
          }
        },
        order_bg: {
          value: '#fff',
          label: '背景色',
          type: 'colorPicker',
        },
        order_iconcolor: {
          value: '#fff',
          label: '图标颜色',
          type: 'colorPicker',
        },
        order_textcolor: {
          value: '#fff',
          label: '文字颜色',
          type: 'colorPicker',
        },
        order_badgecolor: {
          value: '#fff',
          label: '角标颜色',
          type: 'colorPicker',
        },
        colorGroup: {
          value: [],
          label: '',
          custom: true,
          type: 'imageLink',
          labelWidth: '0px',
          hide: true,
          props: { disabled: false, min: 4, max: 4, map: { image: 'adImg', title: 'adText', link: 'adLink' }, showIcon: true, hideImage: true, rules: { title: { maxlength: 20 } } }
        },
      },
    };
  },

  mounted () {
    const colorGroup = this.formItems.colorGroup;
    colorGroup.props.disabled = !!this.diypage.template;
    colorGroup.props.min = parseInt(this.model.order_num);
    colorGroup.props.max = parseInt(this.model.order_num);
    colorGroup.hide = false;
  },
};
</script>
