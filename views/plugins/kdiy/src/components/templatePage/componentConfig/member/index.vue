<template :options="options">
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">个人中心设置</span></h2>
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
    return {
      formItems: {
        member_color: {
          value: '#f1f1f1',
          label: '背景色',
          type: 'colorPicker',
        },
        member_img: {
          value: '',
          label: '背景图',
          type: 'selector',
          hint: '添加背景图后将不显示页面背景色',
          props: { multiselect: false }
        },
        member_name: {
          value: '1',
          label: '用户昵称',
          type: 'radio',
          options: [{ label: '显示', value: '1' }, { label: '隐藏', value: '2' }]
        },
        member_level: {
          value: '2',
          label: '会员等级',
          type: 'radio',
          options: [{ label: '显示', value: '1' }, { label: '隐藏', value: '2' }]
        },
        member_credit: {
          value: '2',
          label: '会员积分',
          type: 'radio',
          options: [{ label: '显示', value: '1' }, { label: '隐藏', value: '2' }]
        },
        member_coupon: {
          value: '2',
          label: '优惠券',
          type: 'radio',
          options: [{ label: '显示', value: '1' }, { label: '隐藏', value: '2' }]
        },
        member_review: {
          value: '1',
          label: '修改信息',
          type: 'radio',
          options: [{ label: '显示', value: '1' }, { label: '隐藏', value: '2' }]
        },
        member_text: {
          value: '',
          label: '标题名称',
          props: { maxLength: 10 }
        },
        member_link: {
          value: '',
          label: '跳转页面',
          type: 'inputLink',
          custom: true,
          props: { width: '300px',placeholder: '请选择或填写小程序路径' ,filterTab: { wxapp: false }},
        },
      }
    };
  },
};
</script>
