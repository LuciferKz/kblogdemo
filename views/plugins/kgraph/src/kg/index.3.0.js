import graph from "./graph";
import item from "./item";
import registerShape from "./util/registerShape";
import { createApp } from "vue/dist/vue.esm-bundler.js";

class G extends graph {
  createApp(cfg) {
    const app = createApp(cfg);
    app.$forceUpdate = function() {
      app._instance.ctx.$forceUpdate();
    };
    return app;
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
