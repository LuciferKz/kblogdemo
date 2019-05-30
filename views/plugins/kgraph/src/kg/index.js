import graph from './graph'
import item from './item'

const kg = {
  Graph: graph,
  Item: item,
  registerNode (name, factory) {
    item[name] = factory(item.base)
  }
}

export default kg