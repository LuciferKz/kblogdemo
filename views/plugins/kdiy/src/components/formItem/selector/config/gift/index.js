export default function (vm) {
  return {
    columns: [
      { label: '图片', prop: 'firstImage', render: (h, scope) => (<img src={scope.row.firstImage} width="100" height="100" />) }, 
      { label: '商品名称', prop: 'name' },
    ]
  }
}