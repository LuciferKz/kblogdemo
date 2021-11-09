import Util from "@/util";
import { shapes } from "./kg.config";
import $k from "@/util/dom";
import newElement from "@/util/dom/new-element";

/**
 *
 * 实现拖拽入场新增节点
 *
 */

const createDragNode = function(x, y) {
  let width = 60;
  let height = 60;
  let dragNode = newElement({
    tag: "div",
    style: {
      width: width + "px",
      height: height + "px",
      border: "1px dashed #333",
      position: "absolute",
      left: x - width / 2 + "px",
      top: y - height / 2 + "px",
      zIndex: 9999,
      transform: "translate(0, 0)",
    },
  });
  $k("body").append(dragNode);
  return dragNode;
};

export const nodeCreateEvent = function(item, dom, graph) {
  let downPoint = {};
  let grabing = false;
  let enter = false;
  let dragNode;
  let box = [];
  let ratio = 1;
  let pagePoint = {};

  let drag = function(e) {
    let clientX = e.clientX;
    let clientY = e.clientY;
    let pageX = e.pageX;
    let pageY = e.pageY;

    if (!grabing) {
      if (
        Math.abs(downPoint.x - clientX) > 10 ||
        Math.abs(downPoint.y - clientY) > 10
      ) {
        grabing = true;
        // 画布外落点处新建 pageX和pageY
        dragNode = createDragNode(pagePoint.x, pagePoint.y);
        $k("body").css("cursor", "move");
      } else {
        return false;
      }
    }

    enter =
      clientX > box.l && clientX < box.r && clientY > box.t && clientY < box.b;
    let scale = enter ? ratio : 1;
    if (enter) {
      graph.$event.trigger(e);
    }
    const translateX = clientX - downPoint.x;
    const translateY = clientY - downPoint.y;
    dragNode.css({
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
    });
  };

  let drop = function(e) {
    if (enter) {
      const point = graph.getPointByClient(e.clientX, e.clientY);
      item.x = point.x;
      item.y = point.y;
      const cfg = Object.assign(
        {},
        {
          cfgKey: item.cfgKey,
          props: item.props,
          shape: item.shape,
          label: item.label,
          isShowLabel: item.isShowLabel,
          vue: item.vue,
        },
        { x: point.x, y: point.y }
      );

      if (item.cfgKey === "image") {
        cfg.shape = { img: item.icon.dom };
      }
      const newNode = graph.addItem("node", cfg);
      const targetMap = graph.get("targetMap");
      const mouseenter = targetMap.mouseenter;
      if (mouseenter)
        newNode.emit("drop", {
          origin: e,
          clientX: point.x,
          clientY: point.y,
          target: mouseenter,
        });
      graph.saveData();
    }
    $k("body").css("cursor", "auto");
    if (dragNode) {
      dragNode.remove();
      dragNode = null;
    }
    grabing = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", drop);
  };

  dom.on("mousedown", (e) => {
    if (e.which === 1) {
      downPoint.x = e.clientX;
      downPoint.y = e.clientY;

      box = graph.get("canvas").getBox();
      ratio = graph.get("ratio");
      pagePoint.x = e.pageX;
      pagePoint.y = e.pageY;

      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", drop);
    }
  });
};

/**
 *
 * 实现节点的自动排布
 *
 * */

const generateArray = function(edges, nodeTable, graph) {
  let row = 0;
  let col = 0;
  let usedEdges = {};
  try {
    while (edges.length > 0) {
      const edgeId = edges.shift();
      const edge = graph.findById(edgeId);
      usedEdges[edgeId] = true;
      const startAnchor = edge.get("startAnchor");
      const endAnchor = edge.get("endAnchor");
      const targetId = edge.get("target");
      const target = graph.findById(targetId);
      const sourceId = edge.get("source");
      const source = graph.findById(sourceId);

      const nodeRc = nodeTable[sourceId];
      let increaserow = false;
      if (col > nodeRc.col) increaserow = true;
      col = nodeRc.col;

      if (startAnchor[1] < endAnchor[1]) {
        row--;
      } else if (startAnchor[1] > endAnchor[1]) {
        row++;
      }

      if (startAnchor[0] !== endAnchor[0]) {
        col++;
      }

      nodeTable[targetId] = { row, col };

      // outedges.map(graph.findById.bind(graph))
      const outedges = Util.clone(target.get("outEdges"))
        .map((outedgeId) => graph.findById(outedgeId))
        .sort((e1, e2) => {
          if (e2.get("endAnchor")[0] === 0) {
            return 1;
          } else {
            return -1;
          }
        });

      for (let j = outedges.length - 1; j >= 0; j--) {
        const outedgeId = outedges[j].get("id");
        if (!usedEdges[outedgeId]) edges.unshift(outedgeId);
      }
    }
  } catch (err) {
    throw err;
  }
};

export function rearrange(graph) {
  const nodeTable = {};
  const nodes = graph.get("nodes");
  const _nodes = Util.filter(nodes, (node) => !node.get("inEdges").length);

  if (_nodes.length > 1) return;
  const start = _nodes[0];

  if (start) {
    nodeTable[start.get("id")] = { row: 0, col: 0 };
    const edges = Util.clone(start.get("outEdges"));
    generateArray(edges, nodeTable, graph);
    let minRow = 0; // 整体画布向下移动数值
    Object.values(nodeTable).forEach((rc) => {
      if (rc && minRow > rc.row) minRow = rc.row;
    });
    Util.each(nodeTable, (rc, id) => {
      const node = graph.findById(id);
      graph.updateItem(node, {
        x: rc.col * 120 + 100,
        y: (rc.row - minRow) * 120 + 50,
      });
    });
  }
}

export function verticalAlign(graph, options = {}) {
  Object.assign(options, {
    space: 80,
  });

  function align(measuredNodes, offsetX = 120, offsetY = 0) {
    while (measuredNodes.length > 0) {
      const nodes = measuredNodes.pop();

      let rowX = offsetX;

      nodes.forEach((node) => {
        let clientWidth = 0;
        if (node.type !== "blank") {
          clientWidth = node.get("clientWidth");
          const clientX = getClientX(node, rowX);
          node.set("clientX", clientX);
          node.set("x", clientX);
          node.set("clientWidth", null);
          graph.updateItem(node, {
            x: clientX,
            y: measuredNodes.length * 120 + 50 + offsetY,
          });
        } else {
          clientWidth = 50;
        }

        rowX += clientWidth;
        rowX += options.space;
      });
    }
  }

  function measure(leveledNodes) {
    const measuredNodes = [];
    while (leveledNodes.length > 0) {
      const nodes = leveledNodes.pop();
      nodes.forEach((node) => {
        const clientWidth = getClientWidth(node);
        if (node.type !== "blank") {
          node.set("clientWidth", clientWidth);
        }
      });
      measuredNodes.unshift(nodes);
    }

    return measuredNodes;
  }

  function autoAlign(node) {
    const leveledNodes = divideNodes(node, 1);
    const nodes1 = measure(leveledNodes);

    if (graph.findById("1a8489889a3d4fde")) {
      const leveledNodes2 = divideNodes(graph.findById("1a8489889a3d4fde"));

      const nodes2 = measure(leveledNodes2);

      const nodes1Width = nodes1[0][0].get("clientWidth");
      const nodes2Width = nodes2[0][0].get("clientWidth");

      const nodes1Length = nodes1.length;

      if (nodes1Width >= nodes2Width) {
        align(nodes1);
        align(
          nodes2,
          120 + (nodes1Width - nodes2Width) / 2,
          120 * nodes1Length
        );
      } else {
        align(nodes2, 120, 120 * nodes1Length);
        align(nodes1, 120 + (nodes2Width - nodes1Width) / 2);
      }
    } else {
      align(nodes1);
    }
    // align(nodes2);
    // return measuredNodes;
  }

  function divideNodes(node, max) {
    const nodes = [[node]];
    let level = 0;
    const leveledNodes = [];
    let complete = false;

    try {
      while (nodes.length > 0) {
        let cols = nodes.shift();
        let newCols = [];
        while (cols.length > 0) {
          let node = cols.shift();

          const outEdges = node.type === "blank" ? [] : node.get("outEdges");

          if (!outEdges || !outEdges.length) {
            newCols.push({ label: "占位", type: "blank" });
          } else {
            outEdges.forEach((edgeId) => {
              const edge = graph.findById(edgeId);
              const target = edge.getTarget();

              const idx = newCols.indexOf(target);
              if (!~idx) {
                newCols.push(target);
              } else {
                newCols.push({ label: "占位", type: "blank" });
              }
            });
          }

          leveledNodes[level]
            ? leveledNodes[level].push(node)
            : (leveledNodes[level] = [node]);
        }
        if (max && level >= max) {
          break;
        }
        if (
          !newCols.find((col) => {
            return col.type !== "blank";
          }) &&
          !complete
        ) {
          complete = true;
          nodes.push(newCols);
        } else if (!complete) {
          nodes.push(newCols);
        }

        level++;
      }
    } catch (err) {
      console.error(err);
    }

    return leveledNodes;
  }

  const getClientWidth = function(node) {
    if (node.type === "blank") return 50;
    const outEdges = node.get("outEdges");
    const nextSiblings = node.getNextSiblings();

    if (outEdges.length > 0) {
      let clientWidth = 0;
      nextSiblings.forEach((node) => {
        if (node.get("clientWidth")) {
          clientWidth += node.get("clientWidth") + options.space;
        }
      });

      if (!clientWidth) {
        return node.get("box").width;
      } else {
        return clientWidth - options.space;
      }
    } else {
      return node.get("box").width;
    }
  };

  const getClientX = function(node, x) {
    const outEdges = node.get("outEdges");
    if (outEdges.length === 1) {
      const edge = graph.findById(outEdges[0]);
      const target = edge.getTarget();
      return target.get("inEdges").length === 1 ? target.get("x") : x;
    } else if (outEdges.length > 1) {
      const firstEdge = graph.findById(outEdges[0]);
      const firstTarget = firstEdge.getTarget();
      const lastEdge = graph.findById(outEdges[outEdges.length - 1]);
      const lastTarget = lastEdge.getTarget();
      return (
        firstTarget.get("x") + (lastTarget.get("x") - firstTarget.get("x")) / 2
      );
    } else {
      return x;
    }
  };

  /** 获取开始顶点，顶点是没有接入线的节点 */
  const startNodes = Util.filter(
    graph.get("nodes"),
    (node) => !node.get("inEdges").length
  );
  if (startNodes.length > 1) return;
  const startNode = startNodes[0];
  const autoPaint = graph.get("autoPaint");
  graph.setAutoPaint(false);
  if (startNode) {
    /** 生成数组 */
    // return

    // let center = (graph.get('width') - measuredNodes[0][0].get('clientWidth')) / 2

    autoAlign(startNode);
  }
  graph.setAutoPaint(autoPaint);
}
