import Util from "../../util";
import Base from "./base";
import Layer from "../../canvas/layer";
import { nodeDragAndDrop, nodeHoverCursor, nodeSwitchScroller } from "./util";

class Node extends Base {
  constructor(cfg) {
    // 必须重置的配置
    const defaultCfg = {
      /* 状态 */
      state: {},
      /* 子节点 */
      children: [],

      anchors: {},
    };

    super(Util.mix(cfg, defaultCfg));
  }

  init() {
    const graph = this.get("graph");
    const nodeLayer = graph.get("nodeLayer");

    const shapeCfg = this.getShapeCfg();
    let shape = nodeLayer.addLayer(new Layer(shapeCfg));
    shape.parent = nodeLayer;

    const shapeMap = graph.get("shapeMap");
    shapeMap[this.get("id")] = shape;
    this.getBox();

    const vueComponent = this.get("vueComponent");
    if (vueComponent) {
      graph.updateItem(this, {
        style: { fill: "transparent", stroke: "transparent" },
      });
      graph.$vue.create(
        Util.mix({ component: vueComponent }, this.get("props").vue || {}, {
          parent: this,
        })
      );
    }

    super.init();

    if (graph.get("enableNodeDrag")) nodeDragAndDrop(this);
    nodeHoverCursor(this);
    nodeSwitchScroller(this);
  }

  _init() {
    this.addAnchors();
    if (!this.get("labelCfg").hidden) this.addLabel();
    this._subscribe();
  }

  _subscribe() {
    const graph = this.get("graph");
    const targetMap = graph.get("targetMap");
    this.on("focus", () => {
      targetMap.focus ? targetMap.focus.push(this) : (targetMap.focus = [this]);
      this.setState("focus", true);
    });
    this.on("blur", () => {
      const idx = targetMap.focus.indexOf(this);
      targetMap.focus.splice(idx, 1);
      this.setState("focus", false);
    });
  }

  /* 添加连线 */
  addEdge(type, edge) {
    this.get(`${type}Edges`).push(edge);
  }

  removeEdge(type, edge) {
    let edges = this.get(`${type}Edges`);
    let index = edges.indexOf(edge);
    edges.splice(index, 1);
  }

  addLabel() {
    const graph = this.get("graph");
    const labelCfg = Util.mix({}, this.get("labelCfg"));
    const label = this.get("label");
    if (label) labelCfg.content = label;
    const shapeMap = graph.get("shapeMap");
    labelCfg.type = "text";
    labelCfg.x = this._cfg.x + labelCfg.offsetX;
    labelCfg.y = this._cfg.y + labelCfg.offsetY;
    this.set("labelCfg", labelCfg);
    const labelId = graph.addShape(
      Util.mix({}, labelCfg, { parent: shapeMap[this.get("id")] })
    );
    this.set("labelId", labelId);
  }

  /**
   * 更新位置
   * @param {object} cfg
   */
  updatePosition(cfg) {
    this.getBox();
    super.updatePosition(cfg);
    const graph = this.get("graph");
    const shapeMap = graph.get("shapeMap");

    const outEdges = this.get("outEdges");
    Util.each(outEdges, (id) => {
      let edge = graph.findById(id);
      edge.updatePath();
    });

    const inEdges = this.get("inEdges");
    Util.each(inEdges, (id) => {
      let edge = graph.findById(id);
      edge.updatePath();
    });

    const labelId = this.get("labelId");
    if (labelId) {
      const label = shapeMap[labelId];
      if (label) {
        const labelCfg = this.get("labelCfg");
        label.update({
          x: cfg.x + labelCfg.offsetX,
          y: cfg.y + labelCfg.offsetY,
        });
      }
    }
  }
  /**
   * 获取图形配置
   */
  // _getShapeCfg () {
  //   return shape
  // }
  getData() {
    return Util.pick(this._cfg, [
      "id",
      "x",
      "y",
      "state",
      "outEdges",
      "inEdges",
      "props",
      "labelCfg",
      "cfgKey",
    ]);
  }

  /**
   * 生成锚点
   * */

  addAnchors() {
    const graph = this.get("graph");
    const anchorMatrix = this.get("anchorMatrix");
    const anchorOffset = this.get("anchorOffset");

    Util.each(anchorMatrix, (m, idx) => {
      let offset = anchorOffset[idx] || { x: 0, y: 0 };
      let anchorPoint = this.getAnchorPoint(m);
      graph.addItem("anchor", {
        id: `${this.get("id")}_${idx}`,
        cfgKey: "anchor",
        m,
        offset,
        parent: this.get("id"),
        hidden: true,
        x: anchorPoint.x,
        y: anchorPoint.y,
      });
    });
  }

  /**
   * 通过计算锚点和节点的位置关系获取在画布内坐标
   * @param {array} anchor
   */
  getAnchorPoint(m) {
    const box = this.get("box");
    let x = box.l + box.width * m[0];
    let y = box.t + box.height * m[1];
    return { x, y, m };
  }

  getPrevSiblings() {
    const graph = this.get("graph");
    const inEdges = this.get("inEdges");
    return inEdges.map((edgeId) => {
      return graph.findById(edgeId).getSource();
    });
  }

  getNextSiblings() {
    const graph = this.get("graph");
    const outEdges = this.get("outEdges");
    return outEdges.map((edgeId) => {
      return graph.findById(edgeId).getTarget();
    });
  }

  _getDefaultCfg() {
    return {
      /* 中心横坐标 */
      x: 0,
      /* 中心纵坐标 */
      y: 0,

      shape: {
        type: "rect",

        size: [100, 100],

        x: 0,

        y: 0,

        style: {},
      },
      /* 模型 */
      box: {},
      /* 父级Id */
      parent: "",

      // label 配置
      labelCfg: {
        content: "",

        hidden: false,

        offsetX: 0,

        offsetY: 0,
      },
      /* 锚点 matrix */
      anchorMatrix: [],
      /* 锚点 偏移坐标 */
      anchorOffset: {},
      /* 出发的线 */
      outEdges: [],
      /* 结束的线 */
      inEdges: [],

      props: {},

      vueComponent: null,

      event: true,
    };
  }
}

export default Node;
