import graph from './graph'
import item from './item'
import Util from '../util'

const kg = {
  Graph: graph,
  Item: item,
  registerNode (name, factory) {
    item[name] = factory(item.base)
  }
}

export default kg