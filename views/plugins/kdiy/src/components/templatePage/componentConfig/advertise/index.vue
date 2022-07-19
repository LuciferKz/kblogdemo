<template>
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">启动广告设置</span></h2>
    <div class="pannelcontent">
      <ax-form @submit.native.prevent class="form" :model="model" size="small" :label-width="'120px'" label-position="left" hide-required-asterisk ref="form">
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
    const vm = this;
    return {
      formItems: {
        name: {
          value: '',
          label: '广告名称',
          hint: '广告名称仅供后台查找',
        },
        advertBackground: {
          value: '#CCC',
          label: '广告背景',
          type: 'colorPicker',
        },
        displaySetup: {
          value: 1,
          label: '显示设置',
          type: 'radio',
          options: [{ label: '仅显示一次', value: 1 }, { label: '每次显示', value: 2 }, { label: '间隔时间显示', value: 3 }],
          events: {
            change (v) {
              vm.formItems.intervalTime.hide = v !== 3;
            }
          }
        },
        intervalTime: {
          value: 0,
          label: '间隔时间(分钟)',
          type: 'slider',
          hide: this.model.displaySetup != 3
        },
        displayPage: {
          value: 1,
          label: '显示页面',
          type: 'radio',
          options: [{ label: '仅首页显示', value: 1 }, { label: '指定页面显示', value: 2 }, { label: '全部页面', value: 3 }],
          events: {
            change (v) {
              vm.formItems.specifiedPage.hide = v !== 2;
            }
          }
        },
        specifiedPage: {
          value: '',
          label: '指定页面',
          type: 'inputLink',
          custom: true,
          props: { enableSettings: { disablePhone: 1 } },
          hide: this.model.displayPage != 2,
        },
        advertImages: {
          value: [],
          label: '上传图片',
          custom: true,
          type: 'imageLink',
          props: { buttonText: '添加广告图片', min: 1, max: 10, map: { image: 'imgAddress', link: 'jumpAddress' }},
          hint: '最多添加10个广告，拖动选中的图片广告可对其排序',
        },
        isStart: {
          value: 0,
          label: '是否启用',
          type: 'radio',
          options: [{ label: '不启用', value: 0 }, { label: '立即启用', value: 1 }, { label: '定时启用', value: 2 }],
          events: {
            change (value) {
              vm.formItems.startTime.hide = value != 2;
            },
          }
        },
        startTime: {
          value: '',
          label: '启用时间',
          type: 'datetime',
          hide: this.model.isStart != 2,
          props: { type: 'datetime' }
        }
      }
    };
  },
};
</script>
