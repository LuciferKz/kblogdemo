import Base from "./base";
import Util from "../../util";
import drawArrow from "./math/arrow";
import { getArrowPoints } from "./math/arrow";
import drawPolyline from "./math/polyline";

class Polyline extends Base {
  /**
   * @param { object } context
   * @param { object } cfg
   */
  constructor(cfg) {
    super(cfg);
  }

  draw(c) {
    this._draw(c);
  }

  _draw(c) {
    if (!c) throw new Error("illegal context");
    const s = this.get("style");
    let points = Util.clone(this.get("points"));
    let arrowPoints;

    c.save();
    c.strokeStyle = s.stroke;
    c.lineWidth = s.lineWidth;
    c.lineJoin = s.lineJoin;
    c.lineCap = s.lineCap;
    c.beginPath();
    if (s.arrow) {
      arrowPoints = getArrowPoints(points.slice(-2), s.arrowStyle);
      points.splice(-1, 1, arrowPoints.mid);
    }
    drawPolyline(c, points);
    c.stroke();
    c.restore();

    if (s.arrow) drawArrow(c, arrowPoints, s.arrowStyle);
  }

  updatePoints(points) {
    this.set("points", points);
  }

  getDefaultStyle() {
    return {
      /**
       * 颜色
       * @type { string }
       */
      stroke: "#000",
      /**
       * 线宽
       * @type { number }
       */
      lineWidth: 2,
      /**
       * 拐角类型 miter bevel round
       * @type { string }
       */
      lineJoin: "miter",
      /**
       * 结束线帽 butt square round
       * @type { string }
       */
      lineCap: "butt",

      arrowStyle: {
        lineWidth: 5,

        theta: 30,

        headlen: 20,

        fill: true,
      },

      arrow: true,
    };
  }

  getShapeStyle() {
    const defaultStyle = this.getDefaultStyle();
    const shapeStyle = Util.deepMix({}, defaultStyle, this.get("style"));
    shapeStyle.arrow = this.get("arrow");
    shapeStyle.arrowStyle.color = shapeStyle.stroke;
    return shapeStyle;
  }

  getDefaultCfg() {
    return {
      x: 0,
      y: 0,
      /* 连接点，至少两个点 */
      points: [],
      /* 连接锚点. */
      anchors: [],
    };
  }
}

export default Polyline;
