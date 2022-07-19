<template :options="options">
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">双列商品设置</span></h2>
    <div class="pannelcontent">
      <ax-form @submit.native.prevent class="form" :model="model" size="small" :label-width="'90px'" label-position="left" hide-required-asterisk ref="form">
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
  props:['model','editable'],
  components: { quickFormItem },
  inject: ['diypage'],
  data () {
    return {
      newOptions:{},
      formItems: {
        choose: { 
          value: 'noauto',
          label: '',
          type: 'radio',
          options: [{ label: '手动选择', value: 'noauto' }]
        },
        colorGroup: {
          value: [],
          label: '选择商品',
          type: 'selector',
          hide: false,
          props: { type: 'product', label: '选择商品', displayType: 'list', filter: { selectGift: false, selectOnShelf: true } }
        },
        goods: {
          value: ['goods_title','goods_price','goods_subtitle'],
          label: '显示内容',
          type: 'checkbox',
          options: [
            { label: '商品名称', value: 'goods_title' },
            { label: '商品价格', value: 'goods_price' },
            { label: '划线原价', value: 'origin_price' },
            { label: '商品销量', value: 'goods_sale' },
            { label: '副标题', value: 'goods_subtitle' },
          ]
        },
        cart: {
          value: 'cart_show',
          label: '购物车按钮',
          type: 'radio',
          options: [{ label: '显示', value: 'cart_show' }, { label: '隐藏', value: 'cart_hide' }],
        },
        corset: {
          value: 'cor_hide',
          label: '角标设置',
          type: 'radio',
          options: [{ label: '不显示', value: 'cor_hide' }, { label: '系统图标', value: 'cor_system' }],
        },
      }
    }
  },
  mounted () {
    if (this.diypage.template) this.formItems.colorGroup.hide = true;
  },
}
</script>
