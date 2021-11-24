import Util from "../../util";
import newElement from "../../util/dom/new-element";
import VueElement from "./element";

class VuePlugin {
  constructor(cfg) {
    const defaultCfg = {
      graph: null,
      container: null,
      scroller: null,
      elements: {},
      app: null,
      components: [],
    };
    this._cfg = Util.mix({}, defaultCfg, cfg);
    this.init();
  }

  init() {
    const graph = this.get("graph");
    const diagramContainer = graph.get("container");
    const container = this.addContainer();
    const scroller = this.addScroller();
    container.append(scroller);
    diagramContainer.append(container);
    this.addListener();
    const app = this.addApp();
  }

  addContainer() {
    const graph = this.get("graph");
    const width = graph.get("width");
    const height = graph.get("height");
    const container = newElement({
      tag: "div",
      props: {
        className: "vue-element-container",
      },
      style: {
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 9999,
      },
    });
    this.set("container", container);
    return container;
  }

  addScroller() {
    const graph = this.get("graph");
    const diagramWidth = graph.get("diagramWidth");
    const diagramHeight = graph.get("diagramHeight");
    const scroller = newElement({
      tag: "div",
      props: {
        className: "vue-element-scroller",
      },
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: `${diagramWidth}px`,
        height: `${diagramHeight}px`,
      },
      children: [
        {
          tag: "div",
          props: {
            className: "vue-app",
          },
        },
      ],
    });
    this.set("scroller", scroller);
    return scroller;
  }

  addApp() {
    const graph = this.get("graph");
    const elements = this.get("elements");
    const components = this.get("components");

    const app = graph.createApp({
      el: ".vue-app",
      data() {
        return {
          elements,
        };
      },
      computed: {
        elementStyle() {
          return function (el) {
            return el.get("style");
          };
        },
        elementComponent() {
          return function (el) {
            return components[el.get("component")];
          };
        },
      },
      template: `
        <div class="vue-elements">
          <div
            v-for="(el, key) in elements"
            :key="key"
            :id="el.get('id')"
            :style="elementStyle(el)"
            v-show="!el.get('hidden')">
            <component :is="elementComponent(el)" :node="el.get('parent')" v-bind="el.get('props')" v-on="el.get('events')"></component>
          </div>
        </div>
      `,
      createRender: function (h) {
        return function () {
          return h(
            "div",
            {
              className: "vue-elements",
            },
            [
              Object.values(this.elements).map((el) => {
                return h(
                  "div",
                  {
                    id: el.get("id"),
                    style: Util.mix({}, this.elementStyle(el), {
                      display: el.get("hidden") ? "none" : "block",
                    }),
                  },
                  [
                    h(
                      this.elementComponent(el),
                      Util.mix(
                        {
                          node: el.get("parent"),
                          graph,
                        },
                        el.get("props"),
                        el.get("events")
                      )
                    ),
                  ]
                );
              }),
            ]
          );
        };
      },
    });
    this.set("app", app);
  }

  addListener() {
    const graph = this.get("graph");

    graph.on("afterChangeSize", () => {
      const width = graph.get("width");
      const height = graph.get("height");
      this.get("container").css({ width: `${width}px`, height: `${height}px` });
    });

    graph.on("afterChangeDiagramSize", (width, height) => {
      this.get("scroller").css({ width: `${width}px`, height: `${height}px` });
    });

    graph.on("scroll", (e) => {
      this.get("container").scrollTo(e);
    });

    graph.on("scale", (ratio) => {
      this.get("scroller").css({
        transformOrigin: "0 0",
        transform: `scale(${ratio})`,
      });
    });
  }

  create(cfg) {
    const components = this.get("components");
    let componentIndex = components.indexOf(cfg.component);
    if (!~componentIndex) {
      componentIndex = components.length;
      components.push(cfg.component);
    }

    cfg.component = componentIndex;

    const elements = this.get("elements");
    const vueElement = new VueElement(Util.mix(cfg));
    elements[vueElement.get("id")] = vueElement;

    const app = this.get("app");
    app.$forceUpdate();
    setTimeout(() => {
      vueElement.bindEl();
    }, 0);
    this.subscribe(vueElement);
    return vueElement;
  }

  subscribe(element) {
    const elements = this.get("elements");
    const parent = element.get("parent");
    const app = this.get("app");

    parent.on("updatePosition", () => {
      const box = parent.getBox();
      element.updatePosition(box.l, box.t);
    });

    parent.on("show", () => {
      element.set("hidden", false);
      app.$forceUpdate();
    });

    parent.on("hide", () => {
      element.set("hidden", true);
      app.$forceUpdate();
    });

    parent.on("afterRemoveItem", (item) => {
      delete elements[element.get("id")];
      app.$forceUpdate();
    });
  }

  clear() {
    const elements = this.get("elements");
    Object.keys(elements).forEach((key) => {
      delete elements[key];
    });
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get(key) {
    return this._cfg[key];
  }
}

export default VuePlugin;
