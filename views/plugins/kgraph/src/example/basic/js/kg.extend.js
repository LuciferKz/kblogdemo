import Util from '@/util'

/**
 * 
 * 实现节点的拖拽移动
 * 
 */

export const nodeDragAndDrop = function (node) {
  const debugEvent = false
  const graph = node.get('graph')
  const originPoint = { x: 0, y: 0 }
  const startPoint = { x: 0, y: 0 }

  node.on('dragstart', function (e) {
    debugEvent && console.log('dragstart', e)
    const item = node
    originPoint.x = item._cfg.x
    originPoint.y = item._cfg.y
    Object.assign(startPoint, { x: e.clientX, y: e.clientY })
  })

  node.on('drag', function (e) {
    debugEvent && console.log('drag', e)
    const clientX = e.clientX
    const clientY = e.clientY
    const startClientX = startPoint.x
    const startClientY = startPoint.y
    graph.updateItem(node, { x: originPoint.x + (clientX - startClientX), y: originPoint.y + (clientY - startClientY) })
  })

  node.on('dragend', function (e) {
    debugEvent && console.log('drag', e)
  })

  node.on('drop', function (e) {
    debugEvent && console.log('drop', e)
    
    if (!e.target || e.target.get('type') !== 'edge') {
      graph.expandDiagram(node)
      graph.saveData()
      return false
    }
    const edge = e.target
    const point = { x: e.clientX, y: e.clientY }
    let linePart = edge.getPathPart(point)
    let midPoint = edge.getMidPoint(linePart)
    let endAnchor = edge.get('endAnchor')
    let dir = edge.getLineDirection(linePart)

    graph.setAutoPaint(false)
    // 移到中点位置
    node.update(midPoint)

    // 截断前面部分的线，修改终点为当前节点
    let target = edge.get('target')
    edge.set('target', node.get('id'))
    edge.set('endAnchor', dir === 'V' ? [0.5,0] : [0,0.5])
    // 从目标节点删除该连入线
    let targetNode = graph.findById(target)
    // 新增一条线，充作后面部分的线，连接拖拽节点和原先的目标节点
    let newEdge = graph.addItem('edge', {
      cfgKey: 'edge',
      source: node.get('id'),
      target: target,
      startAnchor: dir === 'V' ? [0.5,1] : [1,0.5],
      endAnchor,
      arrow: true
    })
    targetNode.removeEdge('in', edge.get('id'))
    targetNode.addEdge('in', newEdge.get('id'))
    node.addEdge('in', edge.get('id'))
    node.addEdge('out', newEdge.get('id'))
    edge.updatePath()
    graph.setAutoPaint(true)
  })
}