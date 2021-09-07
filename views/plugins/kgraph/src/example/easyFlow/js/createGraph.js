import kg from '@/kg'
import createNode from './createNode';
import defaultGraphConfig from './defaultGraphConfig';

// 拓展 kg.Graph
class exGraph extends kg.Graph {
  constructor(config, name) {
    super(config, name);
    this.__bindEvents();
  }
  addNode(x, y, w, h, component, data = {}) {
    const node = createNode(x, y, w, h);
    if (component) node.setComponent(component, data);
    node.setData(data);
    this.add('node', node);
  }
  __bindEvents() {
    this.on('beforeAddItem', (item) => {
      console.log(item)
    })
    this.on('afterAddItem', (item) => {
      const t = item.get('type');
      item.on('mousemove', () => {
        console.log(t)
      })
      item.on('mouseenter', () => {
        console.log(t)
      })
      item.on('mouseleave', () => {
        console.log(t)
      })
      if (t == 'node') {
        this.emit('afterAddItem.node', item);
      }
      else if (t == 'anchor') {
        this.emit('afterAddItem.anchor', item);
      }
      else if (t == 'edge') {
        this.emit('afterAddItem.edge', item);
      }
    });
  }
}

const createGraph = function (config) {
  const graph = new exGraph({ ...defaultGraphConfig, ...config }, 'Root')
  return graph
}

export default createGraph;
