import graph from './graph'
import item from './item'
import registerShape from './util/registerShape'

const kg = {
  Graph: graph,
  Item: item,
  registerNode (name, factory) {
    item[name] = factory(item.base)
  },
  registerShape,
}

export default kg