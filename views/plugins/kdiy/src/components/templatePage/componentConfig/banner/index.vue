<template>
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">轮播栏设置</span></h2>
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
        dot_title: {
          value: '',
          label: '轮播标题',
          props: {
            maxlength: 11
          }
        },
        span_isshow: {
          value: 'span_hide',
          label: '显示边距',
          type: 'radio',
          options: [{ label: '显示', value: 'span_show' }, { label: '不显示', value: 'span_hide' }]
        },
        shadow_isshow: {
          value: 'shadow_hide',
          label: '添加阴影',
          type: 'radio',
          options: [{ label: '添加', value: 'shadow_show' }, { label: '不添加', value: 'shadow_hide' }]
        },
        dotIcon_isshow: {
          value: "dotIcon_show",
          label: '左右箭头',
          type: 'radio',
          options: [{ label: '显示', value: 'dotIcon_show' }, { label: '不显示', value: 'dotIcon_hide' }]
        },
        dotIcon_color: {
          value: "#000",
          label: '左右箭头颜色',
          type: 'colorPicker',
        },
        dot_isshow: {
          value: "dot_show",
          label: '轮播按钮',
          type: 'radio',
          options: [{ label: '显示', value: 'dot_show' }, { label: '不显示', value: 'dot_hide' }]
        },
        dot_type: {
          value: "dot_rectangle",
          label: '按钮形状',
          type: 'radio',
          options: [
            { label: '长方形', value: 'dot_rectangle' }, 
            { label: '正方形', value: 'dot_square' }, 
            { label: '圆形', value: 'dot_circle' }
          ]
        },
        dot_position: {
          value: "dot_inside",
          label: '按钮位置',
          type: 'radio',
          options: [{ label: '轮播图内', value: 'dot_inside' }, { label: '轮播图外', value: 'dot_outside' }]
        },
        dot_color: {
          value: "#fff",
          label: '按钮颜色',
          type: 'colorPicker',
        },
        colorGroup: {
          value: [],
          label: '上传图片',
          custom: true,
          type: 'imageLink',
          props: { buttonText: '添加广告图片', min: 1, map: { image: 'adImg', link: 'adLink' }},
          hide: false,
        }
      }
    };
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },

  mounted () {
    this.formItems.colorGroup.hide = !!this.diypage.template
  },
};
</script>
