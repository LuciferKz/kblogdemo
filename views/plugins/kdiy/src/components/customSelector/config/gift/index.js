const renderThumb = function (data) {
  return data.row.firstImage ? `<img src="${data.row.firstImage}" width="100" height="100" alt="${data.row.firstImage}" />` : '';
}
export default {
  label: 'title',
  query: 'getGifts',
  form: {
    goodsName: {
      value : '',
      label: '赠品名称',
      props: {
        placeholder: '请输入赠品名称'
      },
      icon : 'icon iconfont icon-mingcheng icon-blue',
    },
    categoryId: {
      type: 'treeSelect',
      label: '赠品分类',
      value : '',
      data: [],
      props: { nodeKey: 'id', showRadiobox : true, popWidth: '300', props: { label: "name", value: "id", children: 'childCategory' } },
      icon : 'icon iconfont icon-qudaoxifen icon-blue',
    }
  },
  searchForm: {
    goodsName: '',
    categoryId: ''
  },
  table: [
    { label: '图片', prop: 'firstImage', render: renderThumb, width: 180 },
    { label: '赠品名称', prop: 'title' },
    { label: '库存', prop: 'virtualStock' },
  ]
}