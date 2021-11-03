import kg from "@/kg";
import Util from "@/util";

kg.registerNode("outline", (item) => {
  return class anchor extends item {
    _init() {
      super._init();
      this._subsribe();
    }

    _subsribe() {
      const graph = this.get("graph");
      const parent = graph.findById(this.get("parent"));

      parent.on("focus", () => {
        this.show();
      });
      parent.on("blur", () => {
        this.hide();
      });
      parent.on("hover", (val) => {
        val ? this.show() : this.hide();
      });
    }

    _getShapeCfg() {
      const state = this.get("state");
      const stateShapeMap = this.get("stateShapeMap");

      let shape = this.get("shape");
      shape.x = this._cfg.x;
      shape.y = this._cfg.y;
      shape = Util.mix(shape, stateShapeMap.default);
      shape.points = this.getPoints();
      Util.each(state, (value, name) => {
        if (value) {
          Util.mix(shape, stateShapeMap[name]);
        }
      });
      shape.hidden = this.get("hidden");
      return shape;
    }

    getPoints() {
      const graph = this.get("graph");
      const parentId = this.get("parent");
      const parent = graph.findById(parentId);
      const box = parent.get("box");
      return [
        { x: box.l - 10, y: box.t - 10 },
        { x: box.r + 10, y: box.t - 10 },
        { x: box.r + 10, y: box.b + 10 },
        { x: box.l - 10, y: box.b + 10 },
        { x: box.l - 10, y: box.t - 10 },
      ];
    }

    getDefaultCfg() {
      return {
        state: {},

        stateShapeMap: {},

        hidden: false,

        shape: {
          type: "line",

          style: {
            stroke: "#333",

            lineWidth: 3,

            lineDash: [8, 8],

            points: [],
          },
        },
      };
    }
  };
});

kg.registerNode("contextmenu", (item) => {
  return class contextmenu extends item {
    _init() {
      super._init();
      const graph = this.get("graph");
      const vueComponent = this.get("vueComponent");
      if (vueComponent) {
        const vueElement = graph.$vue.create(
          Util.mix({ component: vueComponent }, this.get("props").vue || {}, {
            parent: this,
          })
        );
        this.set("vueElement", vueElement);
      }
      this._subsribe();
    }

    _subsribe() {
      const graph = this.get("graph");
      const parent = graph.findById(this.get("parent"));

      parent.on("focus", () => {
        this.show();
      });
      parent.on("blur", () => {
        this.hide();
      });
    }

    getDefaultCfg() {
      return {
        state: {},

        props: {
          vue: {},
        },

        hidden: true,

        event: true,

        shape: {
          type: "rect",

          size: [24, 52],

          style: {
            fill: "white",

            stroke: "transparent",
          },
        },
      };
    }
  };
});
