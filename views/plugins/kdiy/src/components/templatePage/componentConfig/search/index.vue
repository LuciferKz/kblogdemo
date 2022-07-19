<template>
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">搜索设置</span></h2>
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
        search_bg: {
          value: '#fff',
          label: '输入框背景色',
          type: 'colorPicker',
        },
        search_border: {
          value: '#f1f1f1',
          label: '输入框框体色',
          type: 'colorPicker',
        },
        search_text: {
          value: '#666',
          label: '文字颜色',
          type: 'colorPicker',
        },
        search_icon: {
          value: '#666',
          label: '图标颜色',
          type: 'colorPicker',
        },
        search_img: {
          value: '',
          label: '输入框背景图',
          type: 'selector',
          props: { multiselect: false }
        },
        search_tips: {
          value: '',
          label: '提示文字',
        },
        textColor: {
          value: '#666',
          label: '提示文字颜色',
          type: 'colorPicker',
        },
        udPadding: {
          value: 6,
          label: '上下边距',
          type: 'slider',
        },
        lrPadding: {
          value: 3,
          label: '左右边距',
          type: 'slider',
        },
        search_style: {
          value: '1',
          label: '搜索框样式',
          type: 'radio',
          options: [{ label: '方形', value: '1' }, { label: '圆角', value: '2' }, { label: '圆弧', value: '3' }]
        },
        search_align: {
          value: '1',
          label: '文字对齐',
          type: 'radio',
          options: [{ label: '居左', value: '1' }, { label: '居中', value: '2' }, { label: '居右', value: '3' }]
        },
        key_show: {
          value: '1',
          label: '推荐关键词',
          type: 'radio',
          options: [{ label: '显示', value: '1' }, { label: '隐藏', value: '2' }]
        },
        search_key: {
          value: '',
          hint: '多个关键词用半角“;"隔开',
          props: { placeholder: '新品;热销' }
        },
        search_keyalign: {
          value: '1',
          label: '关键词对齐',
          type: 'radio',
          options: [{ label: '居左', value: '1' }, { label: '居中', value: '2' }, { label: '居右', value: '3' }]
        },
      },
    };
  },
};
</script>
