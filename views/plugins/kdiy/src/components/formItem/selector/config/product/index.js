export default function (vm) {
  return {
    columns: [
      { label: '图片', prop: 'firstImage', render: (h, scope) => (<img src={scope.row.firstImage} width="100" height="100" />) }, 
      { label: '商品名称', prop: 'name' },
      { label: '规格', render: function (h, scope) {
        if (scope.row.specsNames) {
          return h('el-button', { class: 'break-word', on: { click: function () { vm.handleClick('spec', '选择规格', scope.row) } } }, scope.row.specsNames)
        } else {
          return h('el-button', { on: { click: function () { vm.handleClick('spec', '选择规格', scope.row) } } }, '设置规格')
        }
      } }
    ]
  }
}