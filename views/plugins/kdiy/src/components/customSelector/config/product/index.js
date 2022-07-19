const renderThumb = function (data) {
  return data.row.firstImage ? `<img src="${data.row.firstImage}" width="100" height="100" alt="${data.row.firstImage}" />` : '';
}

export default {
  label: 'title',
  query: 'getProducts',
  form: {
    categoryId: {
      type: 'treeSelect',
      label : '商品分类',
      value : '',
      data: [],
      props: { nodeKey: 'id', showRadiobox : true, popWidth: '300', props: { label: "name", value: "id", children: 'childCategory' } },
      icon : 'icon iconfont icon-qudaoxifen icon-blue',
    },
    goodsName: {
      value : '',
      label : '商品名称',
      props : { placeholder : '请输入商品名称' },
      icon : 'icon iconfont icon-mingcheng icon-blue',
    }
  },
  searchForm: {
    categoryId: '',
    goodsName: '',
  },
  table: [
    { label: '图片', prop: 'firstImage', render: renderThumb, width: 180 },
    { label: '商品名称', prop: 'title', width: 150 },
    { label: '商品价格', prop: 'presentPrice' },
    { label: '库存', prop: 'virtualStock' }
  ]
}