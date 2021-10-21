import Util from "../../util";
import registerShape from "../util/registerShape";

registerShape("grid", function(Base) {
  return class Grid extends Base {
    draw(c) {
      const s = this.get("style");
      this._draw(c, s);
    }

    _draw(c, s) {
      const width = this.get("width");
      const height = this.get("height");
      const size = this.get("size");
      let x = 0;
      let y = 0;
      c.save();
      c.beginPath();

      while (x < width) {
        c.moveTo(x, 0);
        c.lineTo(x, height);
        x += size;
      }
      while (y < height) {
        c.moveTo(0, y);
        c.lineTo(width, y);
        y += size;
      }
      c.strokeStyle = s.stroke;
      c.stroke();
      c.restore();
    }

    getShapeStyle() {
      const style = this.get("style");
      const shapeStyle = Util.mix({}, this.getDefaultStyle(), style);
      return shapeStyle;
    }

    getDefaultStyle() {
      return {
        lineWidth: 1,
        stroke: "#eee",
      };
    }
  };
});

class Grid {
  constructor(cfg) {
    const defaultCfg = {
      show: false,
      align: false,
      size: 10,
      style: {
        stroke: "#eee",
      },
    };

    this._cfg = Util.mix({}, defaultCfg, cfg);
    this.init();
  }

  init() {
    const graph = this.get("graph");
    const width = graph.get("diagramWidth");
    const height = graph.get("diagramHeight");
    const size = this.get("size");
    const gridId = graph.addShape({
      type: "grid",
      width,
      height,
      size,
      style: this.get("style"),
    });
    const gridShape = graph.findShapeById(gridId);

    graph.on("afterChangeDiagramSize", function(width, height) {
      gridShape.update({ width, height });
    });

    graph.on("beforeUpdateItem", (item, cfg = {}) => {
      if (this.get("align") && (cfg.x || cfg.y)) {
        this.align(item, cfg);
      }
    });
  }

  align(item, cfg) {
    let x = cfg.x || item.get("x");
    let y = cfg.y || item.get("y");

    let gridSize = this.get("size");

    cfg.x =
      x - (x % gridSize) + Math.round((x % gridSize) / gridSize) * gridSize;
    cfg.y =
      y - (y % gridSize) + Math.round((y % gridSize) / gridSize) * gridSize;

    return { x, y };
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

export default Grid;
