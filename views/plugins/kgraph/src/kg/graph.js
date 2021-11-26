import Event from "./event";
import EventEmitter from "./event-emitter";
import Layer from "../canvas/layer";
import Canvas from "../canvas";
import Item from "./item";
import Trigger from "./trigger";
import History from "./history";
import Scroller from "./scroller";
import Grid from "./grid";
import Animate from "./animate";
import Rubberband from "./rubberband";
import Vue from "vue/dist/vue.esm.js";
import VuePlugin from "./vue";

import Util from "../util";
import { invertMatrix, guid } from "./util";
import baseShapeCfgs from "./util/config/baseShapeCfgs";
import $k from "../util/dom/index";

import raf from "./util/raf";

class Graph extends EventEmitter {
  constructor(cfg) {
    super();
    const defaultCfg = {
      canvas: null,

      container: null,

      vue: {},

      // 画布宽高
      width: window.innerWidth,

      height: window.innerHeight,

      // 容器宽高
      containerWidth: window.innerWidth,

      containerHeight: window.innerHeight,

      // 画布内容宽高
      diagramWidth: 800,

      diagramHeight: 400,

      ratio: 1,

      maxRatio: 2,

      minRatio: 0.2,

      nodes: [],

      edges: [],

      itemMap: {},

      shapeMap: {},

      shapeCfgs: {},

      data: {
        nodes: [],

        edges: [],
      },

      /**
       * mouseenter array 持续的状态
       * focus array 持续的状态
       * mouseleave object
       * mouseup object
       * click object
       * drag object
       * dragenter object
       */
      targetMap: {
        mouseenter: null,
        focus: [],
        mouseleave: null,
        mouseup: null,
        click: null,
      },
      /**
       * 画布的状态
       */
      state: {},

      nodeLayer: null,

      translateX: 0,

      translateY: 0,

      fitcanvas: true,

      enableScroll: false,

      barSize: 10,

      enableRubberband: false,

      enableNodeDrag: true,

      enableNodeConnect: true,

      enableTriggerShortcut: true,

      bgColor: "#FFF",

      grid: {
        show: false,

        align: false,

        size: 10,
      },

      originRatio: 1,

      autoPaint: true,

      autoExpandDiagram: true,

      limitX: 100,

      limitY: 100,

      marcotask: {},
    };

    const _cfg = Util.deepMix(defaultCfg, cfg);

    this.set = function (key, val) {
      if (Util.isPlainObject(key)) {
        Util.mix(_cfg, key);
      } else {
        _cfg[key] = val;
      }
    };

    this.get = function (key) {
      return _cfg[key];
    };

    if (this.get("container")) {
      this._initContainer();
      this._init();
    }
  }

  _init() {
    this._initSize();
    this._initContainerSize();
    this._changeDiagramSize(
      this.get("diagramWidth"),
      this.get("diagramHeight")
    );
    this._initCanvas();
    this._initBackground();
    this._initGrid();
    this._initGroups();
    this._initEvent();
    this._initVueElement();
    this.$trigger = new Trigger(this);
    this.$history = new History();
    if (this.get("enableRubberband"))
      this.$rubberband = new Rubberband({ graph: this });
    this._initScroller();
    this.$animate = new Animate({ graph: this });
    this.saveData("graph init");
    this.emit("load");
  }

  _initSize() {
    this.set("containerWidth", this.get("width"));
    this.set("containerHeight", this.get("height"));
    if (this.get("enableScroll")) {
      this.set("width", this.get("containerWidth") - this.get("barSize"));
      this.set("height", this.get("containerHeight") - this.get("barSize"));
    }
  }

  _initContainer() {
    let container = this.get("container");
    container =
      Util.isString(container) || Util.isDom(container)
        ? $k(container)
        : container;
    if (!container.dom) throw new Error(this.get("container") + "不存在");
    this.set("container", container);
  }

  _initContainerSize() {
    let container = this.get("container");
    let width = this.get("containerWidth");
    let height = this.get("containerHeight");
    container.css({ position: "relative" });
    if (width) container.css({ width: width + "px" });
    if (height) container.css({ height: height + "px" });
  }

  _initScroller() {
    if (!this.get("enableScroll")) return false;
    this.$scroller = new Scroller({
      container: this.get("container"),
      graph: this,
      width: this.get("width"),
      height: this.get("height"),
      barSize: this.get("barSize"),
    });
  }

  _initEvent() {
    const event = new Event(this);
    this.$event = {
      trigger() {
        const args = [].slice.call(arguments);
        event.handleEvent.apply(event, args);
      },
    };
  }

  _initCanvas() {
    let canvas = this.get("canvas");

    if (!canvas) {
      canvas = $k(document.createElement("canvas"));
      canvas.addClass("kgraph-canvas");
      this.get("container").append(canvas);
    } else {
      canvas =
        Util.isString(canvas) || Util.isDom(canvas) ? $k(canvas) : canvas;
    }

    if (!canvas.dom) throw new Error(this.get("canvas") + "不存在");

    canvas.css("background", this.get("bgColor"));

    let cfg = {
      width: this.get("width"),
      height: this.get("height"),
      translateX: this.get("translateX"),
      translateY: this.get("translateY"),
    };

    cfg.canvas = canvas.dom;

    cfg.ratio = this.get("originRatio");

    this.set("canvas", new Canvas(cfg));
  }

  _initBackground() {
    const canvas = this.get("canvas");
    const diagramWidth = this.get("diagramWidth");
    const diagramHeight = this.get("diagramHeight");
    const bgColor = this.get("bgColor");

    const background = new Layer({
      type: "rect",
      x: diagramWidth / 2,
      y: diagramHeight / 2,
      size: [diagramWidth, diagramHeight],
      style: {
        fill: bgColor,
      },
    });
    canvas.addLayer(background);
    this.set("background", background);
  }

  _updateBackground() {
    const canvas = this.get("canvas");
    const background = this.get("background").get("shape");
    const diagramWidth = this.get("diagramWidth");
    const diagramHeight = this.get("diagramHeight");
    const bgColor = this.get("bgColor");

    background.update({
      x: diagramWidth / 2,
      y: diagramHeight / 2,
      size: [diagramWidth, diagramHeight],
      style: {
        fill: bgColor,
      },
    });
  }

  _initGrid() {
    const canvas = this.get("canvas");
    const gridCfg = this.get("grid");
    const diagramWidth = this.get("diagramWidth");
    const diagramHeight = this.get("diagramHeight");
    gridCfg.graph = this;
    const gridLayer = new Layer({
      type: "rect",
      x: 0,
      y: 0,
      size: [diagramWidth, diagramHeight],
    });
    canvas.addLayer(gridLayer);
    gridCfg.layer = gridLayer;
    this.$grid = new Grid(gridCfg);
  }

  _initGroups() {
    const canvas = this.get("canvas");
    const diagramWidth = this.get("diagramWidth");
    const diagramHeight = this.get("diagramHeight");
    const edgeLayer = new Layer({
      type: "rect",
      x: 0,
      y: 0,
      size: [diagramWidth, diagramHeight],
      style: {},
      parent: canvas,
    });
    const nodeLayer = new Layer({
      type: "rect",
      x: 0,
      y: 0,
      size: [diagramWidth, diagramHeight],
      style: {},
      parent: canvas,
    });
    canvas.addLayer(edgeLayer);
    canvas.addLayer(nodeLayer);
    this.set("nodeLayer", nodeLayer);
    this.set("edgeLayer", edgeLayer);
  }

  createApp(cfg) {
    const vContainer = cfg.el;
    delete cfg.el;
    const { createApp: vCons, h: vCreateElement } = this.get("vue");
    const vInstance = vCons ? vCons(cfg) : new Vue(cfg);
    if (vInstance.version && vInstance.version >= "3") {
      vInstance.$forceUpdate = function () {
        vInstance._instance.ctx.$forceUpdate();
      };

      cfg.render = cfg.createRender(vCreateElement);

      vInstance.mount(vContainer);
    } else {
      vInstance.$mount(vContainer);
    }
    return vInstance;
  }

  _initVueElement() {
    this.$vue = new VuePlugin({ graph: this });
  }

  add(type, cfg) {
    const autoPaint = this.get("autoPaint");
    this.setAutoPaint(false);
    const item = this.addItem(type, cfg);
    this.saveData("add item");
    this.setAutoPaint(autoPaint);
    return item;
  }

  remove(item) {
    this.removeItem(item);
    this.saveData("remove item");
    return item;
  }

  update(item, cfg) {
    this.updateItem(item, cfg);
    this.saveData("update item");
    return item;
  }

  addItem(type, cfg) {
    cfg.graph = this;
    cfg.zIndex = 0;
    cfg.type = type;

    if (cfg.cfgKey) {
      const _cfg =
        this.get("shapeCfgs")[cfg.cfgKey] || baseShapeCfgs[cfg.cfgKey];
      if (!_cfg) {
        console.error(
          `配置: ${cfg.cfgKey}不存在，请检查shapeCfgs中是否存在key为${cfg.cfgKey}的配置，shapeCfgs配置项请参考文档内式样配置`
        );
      } else {
        cfg = Util.deepMix({}, _cfg, cfg);
      }
    } else if (baseShapeCfgs[type]) {
      cfg = Util.deepMix({}, baseShapeCfgs[type], cfg);
    }
    this.emit("beforeAddItem", cfg);
    if (!this.get("abandonAddItem")) {
      const id = cfg.id || guid();
      cfg = Util.mix({}, cfg, { id });
      let parent = cfg.parent ? this.findById(cfg.parent) : null;
      let item = new Item[type](cfg);
      if (parent) parent.get("children").unshift(item);
      this.get(type + "s")
        ? this.get(type + "s").unshift(item)
        : this.set(type + "s", [item]);
      this.emit("afterAddItem", item);
      this.autoPaint("afterAddItem");
      if (type === "node") this.autoExpandDiagram();
      return item;
    } else {
      this.set("abandonAddItem", false);
      return null;
    }
  }

  abandonAddItem() {
    this.set("abandonAddItem", true);
  }

  addShape(cfg) {
    this.emit("beforeAddShape");
    const layer = cfg.parent || this.get("canvas");
    const shapeStyle = cfg;
    const shape = layer.addShape(shapeStyle);
    const shapeMap = this.get("shapeMap");
    const id = cfg.id || guid();
    shapeMap[id] = shape;
    this.emit("afterAddShape");
    this.autoPaint(`afterAddShape`);
    return id;
  }

  removeItem(item) {
    if (!item) {
      return false;
    }
    if (Util.isString(item)) item = this.findById(item);

    item.emit("beforeRemoveItem", item);
    this.emit("beforeRemoveItem", item);

    if (!this.get("abandonRemoveItem")) {
      this._removeItem(item);
      this.emit("afterRemoveItem", item);
      item.emit("afterRemoveItem", item);
      this.autoPaint("afterRemoveItem");
    } else {
      this.set("abandonRemoveItem", false);
    }
  }

  abandonRemoveItem() {
    this.set("abandonRemoveItem", true);
  }

  _removeItem(item) {
    const id = item.get("id");
    const type = item.get("type");
    const items = this.get(type + "s");
    const shape = this.get("shapeMap")[id];
    const itemMap = this.get("itemMap");
    let index = items.indexOf(item);
    // 删图形
    shape.parent.remove(shape);
    // 删list
    items.splice(index, 1);
    // 删map
    delete itemMap[id];
    // 删关联线
    if (type === "node") {
      const outEdges = item.get("outEdges");
      const inEdges = item.get("inEdges");
      Util.each(outEdges, (id) => {
        let edge = this.findById(id);
        this.removeItem(edge);
      });
      Util.each(inEdges, (id) => {
        let edge = this.findById(id);
        this.removeItem(edge);
      });
    } else if (type === "edge") {
      const source = this.findById(item.get("source"));
      const target = this.findById(item.get("target"));
      if (source) {
        index = source.get("outEdges").indexOf(id);
        if (index > -1) source.get("outEdges").splice(index, 1);
      }
      if (target) {
        index = target.get("inEdges").indexOf(id);
        if (index > -1) target.get("inEdges").splice(index, 1);
      }
    }
  }

  updateItem(item, cfg) {
    if (!item) {
      return false;
    }
    const autoPaint = this.get("autoPaint");
    if (Util.isString(item)) item = this.findById(item);
    this.emit("beforeUpdateItem", item, cfg);
    this.setAutoPaint(false);
    item.update(cfg);
    this.emit("afterUpdateItem", item);
    this.setAutoPaint(autoPaint);
    return item;
  }

  saveData(log) {
    if (this.get("debug")) console.log("save data", log);
    this.$history.saveState(this.getData());
  }

  getData() {
    const nodes = this.get("nodes");
    const edges = this.get("edges");
    const data = {};
    data.nodes = nodes.map((node) => node.getData());
    data.edges = edges.map((edge) => edge.getData());
    return data;
  }

  clearData() {
    this.$history.clearStates();
  }

  clear() {
    this._clear();
    this.saveData("clear");
    return this;
  }

  _clear() {
    // const canvas = this.get('canvas');
    const nodeLayer = this.get("nodeLayer");
    const edgeLayer = this.get("edgeLayer");
    nodeLayer.clear();
    edgeLayer.clear();
    if (this.$vue) this.$vue.clear();
    this.set({
      itemMap: {},
      nodes: [],
      edges: [],
      shapeMap: {},
      targetMap: {},
    });

    this.autoPaint("clear");
    return this;
  }

  render(data) {
    this._render(data);
    this.saveData("render");
  }

  _render(data) {
    this._clear();
    const autoPaint = this.get("autoPaint");

    this.setAutoPaint(false);
    Util.each(data.nodes, (node) => {
      this.addItem("node", node);
    });

    Util.each(data.edges, (edge) => {
      this.addItem("edge", edge);
    });

    this.setAutoPaint(autoPaint);
  }

  destroy() {
    window.onkeydown = null;
  }

  paint(log) {
    this.get("debug") && console.log(log);
    this.emit("beforePaint");
    this.get("canvas").draw();
    this.emit("afterPaint");
  }
  setAutoPaint(value, log) {
    this.set("autoPaint", value);
    this.autoPaint(log || "set");
  }

  autoPaint(log) {
    if (this.get("autoPaint")) {
      raf(() => {
        this.paint(log);
      });
    }
  }

  getBox() {
    const container = this.get("container");
    const cr = container.getBoundingClientRect();
    return {
      l: cr.left,
      t: cr.top,
      r: cr.right,
      b: cr.bottom,
      width: cr.width,
      height: cr.height,
    };
  }

  getPointByClient(x, y) {
    const box = this.getBox();
    return this.getPointByCanvas(x - box.l, y - box.t);
  }

  getPointByCanvas(x, y) {
    const matrix = this.get("canvas").getMatrix();
    const point = { x, y };
    return invertMatrix(point, matrix);
  }

  getPointByPage(x, y) {
    const ratio = this.get("ratio");
    const box = this.getBox();
    const translateY = this.$scroller.get("translateY");
    const translateX = this.$scroller.get("translateX");

    return {
      x: ratio * x + translateX + box.l,
      y: ratio * y + translateY + box.t,
    };
  }

  setState(key, val) {
    const state = this.get("state");
    state[key] = val;
  }

  findById(id) {
    const itemMap = this.get("itemMap");
    return itemMap[id];
  }

  findShapeById(id) {
    const shapeMap = this.get("shapeMap");
    return shapeMap[id];
  }

  /* 绘制: 先进在前 事件: 先进在后 */
  tofront(item) {
    if (!item) return false;
    const items = this.get(`${item.get("type")}s`);
    let index = items.indexOf(item);
    items.splice(index, 1);
    items.unshift(item);
    const layer = this.get("shapeMap")[item.get("id")];
    const children = layer.parent.children;
    index = children.indexOf(layer);
    children.splice(index, 1);
    children.push(layer);
    this.autoPaint("tofront");
  }

  toback(item) {
    if (!item) return false;
    const items = this.get(`${item.get("type")}s`);
    let index = items.indexOf(item);
    items.splice(index, 1);
    items.push(item);
    const layer = this.get("shapeMap")[item.get("id")];
    const children = layer.parent.children;
    index = children.indexOf(layer);
    children.unshift(layer);
    this.autoPaint("toback");
  }

  scale(ratio) {
    if (ratio === this.get("ratio")) return false;
    const canvas = this.get("canvas");
    canvas.scale(ratio);
    this.set("ratio", ratio);
    this.emit("changeSize");
    this.emit("scale", ratio);
    this.autoPaint("scale");
  }

  translate(x, y) {
    let canvas = this.get("canvas");
    this.set("translateX", x);
    this.set("translateY", y);
    canvas.translate(x, y);
    this.autoPaint("translate");
  }

  zoomin() {
    const maxRatio = this.get("maxRatio");
    let ratio = this.get("ratio");
    ratio =
      ratio + 0.2 <= maxRatio ? parseFloat((ratio + 0.2).toFixed(2)) : maxRatio;
    this.scale(ratio);
  }

  zoomout() {
    const minRatio = this.get("minRatio");
    let ratio = this.get("ratio");
    ratio =
      ratio - 0.2 >= minRatio ? parseFloat((ratio - 0.2).toFixed(2)) : minRatio;
    this.scale(ratio);
  }

  setAutoExpandDiagram(value) {
    this.set("autoExpandDiagram", value);
    this.autoExpandDiagram();
  }

  autoExpandDiagram(item) {
    if (this.get("autoExpandDiagram")) {
      this.expandDiagram(item);
    }
  }

  expandDiagram(item) {
    let maxX = 0;
    let maxY = 0;
    let minX = 0;
    let minY = 0;
    if (item) {
      let box = item.get("box");
      maxX = box.r;
      maxY = box.b;
      minX = box.l - 50;
      minY = box.t - 50;
    } else {
      let nodes = this.get("nodes");
      Util.each(nodes, (node) => {
        const nodeX = node.get("x");
        const nodeY = node.get("y");
        if (nodeX > maxX) {
          maxX = nodeX;
        } else if (nodeX < minX) {
          minX = nodeX;
        }
        if (nodeY > maxY) {
          maxY = nodeY;
        } else if (nodeY < minY) {
          minY = nodeY;
        }
      });
    }

    if (minX < 0 || minY < 0) {
      const autoPaint = this.get("autoPaint");
      this.setAutoPaint(false);

      if (minX < 0) {
        const expandWidth = Math.abs(minX) + 50;

        Util.each(this.get("nodes"), (node) => {
          node.update({
            x: node.get("x") + expandWidth,
          });
        });
      }

      if (minY < 0) {
        const expandHeight = Math.abs(minY) + 50;

        Util.each(this.get("nodes"), (node) => {
          node.update({
            y: node.get("y") + expandHeight,
          });
        });
      }

      this.expandDiagram();
      this.setAutoPaint(autoPaint, "expandDiagram");

      return;
    }

    let diagramWidth = this.get("diagramWidth");
    let diagramHeight = this.get("diagramHeight");
    let limitX = this.get("limitX");
    let limitY = this.get("limitY");
    let expandHor = diagramWidth - maxX < limitX;
    let expandVer = diagramHeight - maxY < limitY;

    if (expandHor || expandVer) {
      const autoPaint = this.get("autoPaint");
      this.setAutoPaint(false);
      if (expandHor) {
        diagramWidth = maxX + limitX;
      }

      if (expandVer) {
        diagramHeight = maxY + limitY;
      }
      this.changeDiagramSize(diagramWidth, diagramHeight);
      this.emit("changeSize");
      this.setAutoPaint(autoPaint, "expandDiagram");
    }
  }

  // 传入的是container size
  changeSize(width, height) {
    let canvas = this.get("canvas");
    this.emit("beforeChangeSize", width, height);
    this.set("containerWidth", width);
    this.set("containerHeight", height);
    if (this.get("enableScroll")) {
      this.set("width", width - 10);
      this.set("height", height - 10);
    }
    this.emit("changeSize");
    canvas.changeSize(width - 10, height - 10);
    this._updateBackground();
    this.emit("afterChangeSize", width, height);
    this.autoPaint("changeSize");
  }

  changeDiagramSize(width = 0, height = 0) {
    this.emit("beforeChangeDiagramSize", width, height);
    this._changeDiagramSize(width, height);
    this._updateBackground();
    this.emit("afterChangeDiagramSize", width, height);
  }

  _changeDiagramSize(width, height) {
    const currentWidth = this.get("width");
    const currentHeight = this.get("height");

    if (this.get("fitcanvas")) {
      width = width > currentWidth ? width : currentWidth;
      height = height > currentHeight ? height : currentHeight;
    }

    this.set("diagramWidth", width);
    this.set("diagramHeight", height);
  }

  $mount(container, cfg = {}) {
    this.set("canvas", null);
    this.set("container", container || "body");
    this._initContainer();
    container = this.get("container");
    cfg = Util.mix(
      { width: container.width(), height: container.height() },
      cfg
    );
    this.set(cfg);
    this._init();
  }
}

export default Graph;
