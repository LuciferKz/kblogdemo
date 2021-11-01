import Util from "../../../util";

/**
 *
 * 实现节点的拖拽移动
 *
 */

export const nodeDragAndDrop = function(node) {
  if (node.get("type") !== "node") return;
  const graph = node.get("graph");
  const originPoint = { x: 0, y: 0 };
  const startPoint = { x: 0, y: 0 };

  node.on("dragstart", function(e) {
    const item = node;
    originPoint.x = item._cfg.x;
    originPoint.y = item._cfg.y;
    Object.assign(startPoint, { x: e.clientX, y: e.clientY });
  });

  node.on("drag", function(e) {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const startClientX = startPoint.x;
    const startClientY = startPoint.y;
    graph.updateItem(node, {
      x: originPoint.x + (clientX - startClientX),
      y: originPoint.y + (clientY - startClientY),
    });
  });

  node.on("drop", function(e) {
    if (!e.target || e.target.get("type") !== "edge") {
      graph.expandDiagram(node);
      graph.saveData();
      return false;
    }
    const edge = e.target;
    const point = { x: e.clientX, y: e.clientY };
    let linePart = edge.getPathPart(point);
    let midPoint = edge.getMidPoint(linePart);
    let endAnchor = edge.get("endAnchor");
    let dir = edge.getLineDirection(linePart);

    graph.setAutoPaint(false);
    // 移到中点位置
    node.update(midPoint);

    // 截断前面部分的线，修改终点为当前节点
    let target = edge.get("target");
    edge.set("target", node.get("id"));
    edge.set("endAnchor", dir === "V" ? [0.5, 0] : [0, 0.5]);
    // 从目标节点删除该连入线
    let targetNode = graph.findById(target);
    // 新增一条线，充作后面部分的线，连接拖拽节点和原先的目标节点
    let newEdge = graph.addItem("edge", {
      cfgKey: "edge",
      source: node.get("id"),
      target: target,
      startAnchor: dir === "V" ? [0.5, 1] : [1, 0.5],
      endAnchor,
      arrow: true,
    });
    targetNode.removeEdge("in", edge.get("id"));
    targetNode.addEdge("in", newEdge.get("id"));
    node.addEdge("in", edge.get("id"));
    node.addEdge("out", newEdge.get("id"));
    edge.updatePath();
    graph.setAutoPaint(true);
  });
};

/**
 *
 * 实现节点hover时的cursor效果切换
 *
 */

export const nodeHoverCursor = function(node) {
  if (node.get("type") !== "node") return;
  const graph = node.get("graph");
  const container = graph.get("container");

  node.on("stateChange", function(key, val, state) {
    let item = this;
    const children = item.get("children");
    if (key === "hover" && !state.focus) {
      graph.setAutoPaint(false);
      Util.each(children, (child) => {
        if (!child.get("alwaysShow")) {
          val ? child.show() : child.hide();
        }
      });
      graph.setAutoPaint(true);
    }
  });

  node.on("mouseenter", function(e) {
    container.css("cursor", node.get("cursor") || "move");
  });

  node.on("mouseleave", function(e) {
    container.css("cursor", "auto");
  });
};

/**
 *
 * 实现暂停滚动功能
 *
 */

export const nodeSwitchScroller = function(node) {
  if (node.get("type") !== "node") return;
  const graph = node.get("graph");
  node.on("mouseenter", function(e) {
    graph.$scroller.pause();
  });

  node.on("mouseleave", function(e) {
    graph.$scroller.start();
  });
};

/**
 *
 * 实现锚点的连线即节点之间的关联
 */

export const nodeConnect = function(anchor) {
  if (anchor.get("type") !== "anchor") return;
  const graph = anchor.get("graph");
  const container = graph.get("container");

  const eventsMap = {
    mousedown(e) {},

    mouseenter(e) {
      container.css("cursor", "auto");
    },
    mouseleave(e) {
      if (e.target && e.target.get("type") === "node") {
        container.css("cursor", anchor.get("cursor") || "move");
      }
    },
    dragstart(e) {
      const graph = this.get("graph");
      const clientX = e.clientX;
      const clientY = e.clientY;

      const activeEdge = graph.addItem("edge", {
        cfgKey: "edge",
        source: this.get("parent"),
        target: null,
        sourceAnchor: anchor.get("id"),
        endPoint: { x: clientX, y: clientY },
        shape: {
          parent: graph.get("canvas"),
        },
        arrow: true,
      });

      graph.set("activeEdge", activeEdge);
    },
    drag(e) {
      const graph = this.get("graph");
      const activeEdge = graph.get("activeEdge");
      const clientX = e.clientX;
      const clientY = e.clientY;
      activeEdge.update({
        endPoint: { x: clientX, y: clientY },
      });
    },
    drop(e) {
      const graph = this.get("graph");
      const activeEdge = graph.get("activeEdge");
      if (e.target && e.target.get("type") === "anchor") {
        const source = graph.findById(activeEdge.get("source"));
        const sourceAnchor = this;
        const endAnchor = e.target;
        const targetId = endAnchor.get("parent");
        const target = graph.findById(targetId);

        activeEdge.set("target", targetId);
        activeEdge.set("targetAnchor", endAnchor.get("id"));

        const id = activeEdge.get("id");
        source.addEdge("out", id);
        target.addEdge("in", id);
        activeEdge.set("arrow", true);

        activeEdge.updatePath();
        sourceAnchor.setState("visited", true);
        endAnchor.setState("visited", true);
        const shape = graph.findShapeById(id);
        shape.parent.remove(shape);
        graph.get("edgeLayer").add(shape);
        graph.emit("connect", activeEdge);
        graph.saveData();
      } else {
        graph.removeItem(activeEdge);
      }
      graph.set("activeEdge", null);
    },
    dragenter(e) {
      const endAnchor = e.target;
      const graph = this.get("graph");
      const activeEdge = graph.get("activeEdge");
      if (activeEdge) {
        activeEdge.set("target", endAnchor.get("parent"));
        activeEdge.set("targetAnchor", endAnchor.get("id"));
      }

      this.update();
    },
    dragleave(e) {
      const graph = this.get("graph");
      const activeEdge = graph.get("activeEdge");
      if (activeEdge) {
        activeEdge.set("target", null);
        activeEdge.set("targetAnchor", null);
      }

      this.update();
    },
  };

  Util.each(eventsMap, (fn, evt) => {
    anchor.on(evt, fn);
  });
};

/**
 *
 * 实现Edge在hover时的cursor效果切换
 *
 */

export const edgeHoverCursor = function(edge) {
  if (edge.get("type") !== "edge") return;
  const graph = edge.get("graph");
  const container = graph.get("container");

  edge.on("mouseenter", function(e) {
    const point = { x: e.clientX, y: e.clientY };
    const linePart = this.getPathPart(point);
    const dir = this.getLineDirection(linePart);
    if (dir === "V") {
      container.css("cursor", "col-resize");
    } else if (dir === "H") {
      container.css("cursor", "row-resize");
    } else {
      container.css("cursor", "col-resize");
    }
  });
  edge.on("mouseleave", function(e) {
    container.css("cursor", "auto");
  });
};
