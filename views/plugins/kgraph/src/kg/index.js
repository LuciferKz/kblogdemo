import graph from "./graph";
import item from "./item";
import registerShape from "./util/registerShape";
import Vue from "vue/dist/vue.esm.js";

class G extends graph {
  createApp(cfg) {
    return new Vue(cfg);
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
