<template :options="options">
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">视频设置</span></h2>
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
        video_style: {
          value: '1',
          label: '视频样式',
          type: 'radio',
          options: [{ label: '16:9', value: '1' }, { label: '4:3', value: '2' }, { label: '1:1', value: '3' }]
        },
        video_type: {
          value: '1',
          label: '播放方式',
          type: 'radio',
          options: [{ label: '自动播放', value: '1' }, { label: '点击播放', value: '2' }, { label: '静音播放', value: '3' }]
        },
        video_img: {
          value: '',
          label: '视频封面',
          type: 'selector',
          props: { multiselect: false }
        },
        video_link: {
          value: '',
          label: '视频链接',
          type: 'selector',
          props: { type: 'video', label: '选择视频', multiselect: false }
        },
      }
    };
  },
};
</script>
