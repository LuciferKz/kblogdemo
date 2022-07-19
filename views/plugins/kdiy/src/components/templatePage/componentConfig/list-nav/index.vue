<template>
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">导航列表设置</span></h2>
    <div class="pannelcontent">
      <ax-form @submit.native.prevent class="form" :model="model" size="small" :label-width="'0'" label-position="left" hide-required-asterisk ref="form">
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
        colorGroup: {
          value: [],
          // label: '列表导航',
          custom: true,
          type: 'imageLink',
          props: { disabled: false, buttonText: '添加', min: 1, map: { image: 'adImg', title: 'adText', link: "adLink", remark: 'adRemark' }, showIcon: true,  }
        }
      }
    };
  },

  mounted () {
    this.formItems.colorGroup.props.disabled = !!this.diypage.template;
  },
};
</script>
