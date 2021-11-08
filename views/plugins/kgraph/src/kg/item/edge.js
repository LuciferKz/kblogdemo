import Util from "../../util";
import Base from "./base";
import {
  getPointsBetweenAA,
  getPointsBetweenAP,
  inDirection,
} from "../util/getPoints";
import { edgeHoverCursor } from "./util";
import Layer from "../../canvas/layer";

class Edge extends Base {
  constructor(cfg) {
    super(cfg);
  }

  _init() {
    const graph = this.get("graph");
    const edgeLayer = graph.get("edgeLayer");

    const shapeCfg = this.getShapeCfg();
    let shape = edgeLayer.addLayer(new Layer(shapeCfg));
    shape.parent = edgeLayer;

    const shapeMap = graph.get("shapeMap");
    shapeMap[this.get("id")] = shape;

    const targetAnchor = this.getTargetAnchor();

    if (targetAnchor) {
      this.addLabel();
    }

    edgeHoverCursor(this);
  }

  addLabel() {
    const graph = this.get("graph");
    const defaultLabelCfg = { offsetX: 0, offsetY: 0, style: {} };
    const labelCfg = Util.mix(defaultLabelCfg, this.get("labelCfg"));
    const label = labelCfg.content || this.get("label");
    if (!label) return;
    const shapeMap = graph.get("shapeMap");
    labelCfg.type = "text";
    labelCfg.content = label;
    const labelPosition = this.getLabelPosition();
    labelCfg.x = labelPosition.x + labelCfg.offsetX;
    labelCfg.y = labelPosition.y + labelCfg.offsetY;
    labelCfg.style.align = "center";
    this.set("labelCfg", labelCfg);
    const labelId = graph.addShape(
      Util.mix({}, labelCfg, { parent: shapeMap[this.get("id")] })
    );
    this.set("labelId", labelId);
  }

  updateLabel(label) {
    const labelCfg = this.get("labelCfg");
    labelCfg.content = label;
    this.set("labelCfg", labelCfg);
    if (!this.get("labelId")) {
      this.addLabel();
    } else {
      const graph = this.get("graph");
      const shapeMap = graph.get("shapeMap");
      const labelShape = shapeMap[this.get("labelId")];
      labelShape.update({ content: label });
      graph.autoPaint();
    }
  }

  getLabelPosition() {
    const points = this.get("points");
    const labelCfg = this.get("labelCfg");
    const align = labelCfg.align || "center";

    const midNum = Math.floor(points.length / 2);
    let part = null;

    if (points.length % 2) {
      if (align === "center") {
        return points[midNum];
      } else if (align === "edge-start") {
        part = points.slice(midNum - 1, midNum + 1);
      } else if (align === "edge-end") {
        part = points.slice(midNum, midNum + 2);
      }
    } else {
      if (align === "center") {
        part = points.slice(midNum - 1, midNum + 1);
      } else if (align === "edge-start") {
        part = points.slice(midNum - 2, midNum);
      } else if (align === "edge-end") {
        part = points.slice(midNum, midNum + 2);
      }
    }

    if (part.length >= 2) {
      return this.getMidPoint(part);
    } else {
      return part[0];
    }
  }

  updateLabelPosition() {
    if (!this.get("labelId")) return;
    const labelCfg = this.get("labelCfg");
    const graph = this.get("graph");
    const shapeMap = graph.get("shapeMap");
    const labelShape = shapeMap[this.get("labelId")];
    const labelPosition = this.getLabelPosition();
    labelShape.update({
      x: labelPosition.x + labelCfg.offsetX,
      y: labelPosition.y + labelCfg.offsetY,
    });
  }

  connectTo(targetAnchor) {
    const graph = this.get("graph");
    const source = this.getSource();
    const sourceAnchor = this.getSourceAnchor();
    const targetId = targetAnchor.get("parent");
    const target = graph.findById(targetId);

    this.set("target", targetId);
    this.set("targetAnchor", targetAnchor.get("id"));

    const id = this.get("id");
    source.addEdge("out", id);
    target.addEdge("in", id);
    this.set("arrow", true);

    this.updatePath();
    sourceAnchor.setState("visited", true);
    targetAnchor.setState("visited", true);
    const shape = graph.findShapeById(id);
    shape.parent.remove(shape);
    graph.get("edgeLayer").add(shape);
    graph.emit("connect", this);
    this.addLabel();
    graph.saveData();
  }

  _getShapeCfg() {
    const shape = this.get("shape");
    const points = this._getPoints();
    shape.arrow = this.get("arrow");
    shape.points = points;
    return shape;
  }

  _getPoints() {
    const sourceAnchor = this.getSourceAnchor();
    const startAnchor = this.getStartAnchor();
    const startPoint = this.getStartPoint();
    const target = this.getTarget();

    let points = [];
    if (target) {
      const targetAnchor = this.getTargetAnchor();
      const endPoint = this.getEndPoint();
      points = getPointsBetweenAA({
        sa: sourceAnchor,
        sp: startPoint,
        ea: targetAnchor,
        ep: endPoint,
      });
    } else {
      const endPoint = this.getEndPoint();
      points = getPointsBetweenAP({
        sa: sourceAnchor,
        sm: startAnchor,
        sp: startPoint,
        ep: endPoint,
      });
    }

    this.set("points", points);
    return points;
  }

  getSource() {
    const graph = this.get("graph");
    const source = graph.findById(this.get("source"));
    if (!source) {
      console.error(`未找到${this.get("source")}对应节点`);
      return [];
    }
    return source;
  }

  getSourceAnchor() {
    const graph = this.get("graph");
    const sourceAnchorId = this.get("sourceAnchor");
    return this.get("sourceAnchor") ? graph.findById(sourceAnchorId) : null;
  }

  getStartAnchor() {
    const sourceAnchor = this.getSourceAnchor();
    let startAnchor = this.get("startAnchor");
    if (sourceAnchor) startAnchor = sourceAnchor.get("m");
    this.set("startAnchor", startAnchor);
    return startAnchor;
  }

  getStartPoint() {
    const source = this.getSource();
    const startAnchor = this.get("startAnchor");
    const sourceAnchor = this.getSourceAnchor();
    const startPoint = sourceAnchor
      ? sourceAnchor.getPoint()
      : source.getAnchorPoint(startAnchor);
    this.set("startPoint", startPoint);
    return startPoint;
  }

  getTarget() {
    const graph = this.get("graph");
    const target = graph.findById(this.get("target"));
    return target || null;
  }

  getTargetAnchor() {
    const graph = this.get("graph");
    const targetAnchor = graph.findById(this.get("targetAnchor"));
    return targetAnchor;
  }

  getEndAnchor() {
    const graph = this.get("graph");
    const targetAnchor = graph.findById(this.get("targetAnchor"));
    let endAnchor = this.get("endAnchor");
    if (targetAnchor) endAnchor = targetAnchor.get("m");
    this.set("endAnchor", endAnchor);
    return endAnchor;
  }

  getEndPoint() {
    const shape = this.get("shape");
    const target = this.getTarget();
    const targetAnchor = this.getTargetAnchor();
    const endAnchor = this.getEndAnchor();
    const endPoint = targetAnchor
      ? targetAnchor.getPoint()
      : target
      ? target.getAnchorPoint(endAnchor)
      : shape.endPoint;
    if (!endPoint.x || !endPoint.y)
      Object.assign(endPoint, this.getStartPoint());
    this.set("endPoint", endPoint);
    return endPoint;
  }

  getData() {
    const cfg = Util.pick(this._cfg, [
      "id",
      "state",
      "source",
      "sourceAnchor",
      "startAnchor",
      "target",
      "targetAnchor",
      "endAnchor",
      "props",
      "labelCfg",
      "cfgKey",
      "points",
    ]);
    return cfg;
  }

  getLineDirection(line = []) {
    let p1 = line[0] || {};
    let p2 = line[1] || {};
    return p1.x === p2.x ? "V" : "H";
  }

  getPathPart(point) {
    let points = this.get("shape").points;
    let clientX = point.x;
    let clientY = point.y;
    let range = this.get("shape").style.lineWidth;
    let part;

    for (let i = 1, len = points.length; i < len; i++) {
      let p1 = points[i];
      let p2 = points[i + 1];
      if (!p2) break;
      if (
        (Math.abs(clientX - p1.x) <= range &&
          Math.abs(clientX - p2.x) <= range) ||
        (Math.abs(clientY - p1.y) <= range && Math.abs(clientY - p2.y) <= range)
      ) {
        part = [p1, p2];
        break;
      }
    }

    return part;
  }

  getMidPoint(part) {
    let p1 = part[0];
    let p2 = part[1];
    let midX = p1.x;
    let midY = p1.y;
    if (p1.x === p2.x) {
      midY = (p1.y - p2.y) / 2 + p2.y;
    } else if (p1.y === p2.y) {
      midX = (p1.x - p2.x) / 2 + p2.x;
    }
    return { x: midX, y: midY };
  }

  updatePath() {
    const shape = this.get("shape");
    const points = this._getPoints();
    shape.points = points;
    shape.arrow = this.get("arrow");
    this.updateShape();
    this.updateLabelPosition();
  }

  update(cfg) {
    const shape = this.getShapeCfg();
    Util.mix(shape, cfg);
    this.updateShape();
  }

  _getDefaultCfg() {
    return {
      state: {},

      source: null,

      target: null,
      // 是否有箭头
      arrow: false,

      // 锚点id

      sourceAnchor: "",

      targetAnchor: "",

      // 锚点matrix
      startAnchor: [],

      endAnchor: null,

      points: [],

      shape: {
        startPoint: {},

        endPoint: {},
      },

      labelCfg: {
        offsetX: 0,
        offsetY: 10,
      },

      props: {},

      event: true,
    };
  }

  getDefaultShapeCfg() {
    return {
      id: this.get("id"),
    };
  }
}

export default Edge;
