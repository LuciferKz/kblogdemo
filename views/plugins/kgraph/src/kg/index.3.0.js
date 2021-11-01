import graph from "./graph";
import item from "./item";
import registerShape from "./util/registerShape";
import { createApp } from "vue/dist/vue.esm-bundler.js";

class G extends graph {
  createApp(cfg) {
    return createApp(cfg);
  }
}

const kg = {
  Graph: G,
  Item: item,
  registerNode(name, factory) {
    item[name] = factory(item.base);
  },
  registerShape,
};

export default kg;
