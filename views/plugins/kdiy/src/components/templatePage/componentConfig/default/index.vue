<template>
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">{{ !editable ? '模板设置' : '页面设置' }}</span></h2>
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
  props: ['model', 'editable'],
  components: { quickFormItem },
  inject: ['diypage'],
  data() {
    return {
      // model: {
      //   mbtype: '1',
      //   pageName: '',
      //   pageTitle: '',
      //   backColor: '#fff',
      //   backImg: '',
      //   tabBackColor: '#000',
      //   tabColor: 'white',
      // },
      formItems: {
        mbtype: {
          value: '1',
          label: '模板类型',
          type: 'select',
          options: [{ label: '商品详情模板', value: '1' }],
          hide: this.editable
        },
        pageName: {
          value: '',
          label: this.editable ? '页面名称' : '模板名称',
          hint: '页面名称仅供后台查找',
        },
        pageTitle: {
          value: '',
          label: '页面标题',
          hint: '显示在小程序顶部',
          hide: !this.editable
        },
        backColor: {
          value: '#fff',
          label: '页面背景色',
          type: 'colorPicker',
          // hint: '页面背景色',
        },
        backImg: {
          value: '',
          label: '页面背景图',
          type: 'selector',
          props: { multiselect: false }
        },
        tabBackColor: {
          value: '#000',
          label: '标题栏背景色',
          type: 'colorPicker',
          hide: !this.editable,
        },
        tabColor: {
          value: 'white',
          label: '标题栏文字',
          type: 'radio',
          options: [{ label: '白色', value: 'white' }, { label: '黑色', value: 'black' }],
          hide: !this.editable,
        }
      }
    }
  },
  created () {
    console.log('default created', this.model);
  }
}
</script>