const couponStatus = ['有效', '未生效', '生效'];
const couponTypes = ['现金券', '折扣券', '实物券', '赠品券'];

export default {
  label: 'name',
  query: 'getCoupons',
  form: {
    couponType: {
      type: 'select',
      label : '优惠券类型',
      value : '',
      props: { props: { label:'text' } },
      options: [],
      icon : 'icon iconfont icon-qudaoxifen icon-blue',
    },
    name: {
      value : '',
      label : '优惠券名称',
      icon : 'icon iconfont icon-mingcheng icon-blue',
    },
    isValid:{
      hide: true,
      value: true
    }
  },
  searchForm: {
    couponType: '',
    name: '',
    isValid: true
  },
  table: [
    { label: '优惠券名称', prop: 'name' },
    { label: '库存', prop: 'stock' },
  ]
}