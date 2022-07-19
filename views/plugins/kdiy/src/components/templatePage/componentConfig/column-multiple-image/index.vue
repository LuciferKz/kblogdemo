<template :options="options">
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">多列图片组设置</span></h2>
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
  components:{ quickFormItem },
  inject: ['diypage'],
  data() {
    return {
      formItems: {
        backColor: {
          value: '#fff',
          label: '背景色',
          type: 'colorPicker',
        },
        udPadding: {
          value: 0,
          label: '上下边距',
          type: 'slider',
        },
        lrPadding: {
          value: 0,
          label: '左右边距',
          type: 'slider',
        },
        girdnum: {
          value: '2',
          label: '选择列数',
          type: 'radio',
          options: [{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }]
        },
        colorGroup: {
          value: [],
          label: '上传图片',
          custom: true,
          type: 'imageLink',
          props: { buttonText: '添加图片', min: 2, map: { image: 'adImg', link: 'adLink' }},
          hide: false,
        }
      }
    };
  },

  mounted () {
    this.formItems.colorGroup.hide = !!this.diypage.template
  },
};
</script>
