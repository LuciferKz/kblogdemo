<template :options="options">
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">图片组设置</span></h2>
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
          value: '#FFF',
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
        colorGroup: {
          value: [],
          label: '上传图片',
          custom: true,
          type: 'imageLink',
          props: { buttonText: '添加图片', min: 1, map: { image: 'adImg', link: 'adLink' }},
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
