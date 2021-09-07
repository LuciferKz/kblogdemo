<template>
  <div class="custom-flow--container__tools">
    <div class="custom-flow--container__tools--bar">
      <div
        v-for="(tool, index) in toolbar"
        :key="index"
        :class="
          tool.key === 'cutOff'
            ? 'cut-off'
            : `iconfont icon-${tool.key} ${tool.disabled ? 'disabled' : ''}`
        "
        @mouseover="handleMouseOver(tool.key)"
        @click="handleClick(tool)"
        @mouseout="handleMouseOut(tool.key)"
      >
        <span v-show="tool.key !== 'cutOff'" class="tooltips" :ref="tool.key">{{
          tool.title
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Util from "@/components/customflow/utils";
import { rearrange } from "@/components/customflow/utils/kgraph/kg.extend.js";

const baseicTools = {
  fitpagewidth: { key: "fitpagewidth", title: "适应画布" },
  fitpage: { key: "fitpage", title: "实际尺寸" },
  zoomin: { key: "zoomin", title: "放大" },
  zoomout: { key: "zoomout", title: "缩小" },
  copy: {
    key: "copy",
    title: "复制",
    disabled: true,
    disableFn: () => {
      const focusedItems = this.graph.get("targetMap").focus || [];
      return (
        !focusedItems.length ||
        !focusedItems.filter((n) => n.get("type") === "node").length
      );
    },
  },
  paste: {
    key: "paste",
    title: "粘贴",
    disabled: true,
    disableFn: () => !this.graph.get("copiedItem"),
  },
  delete: {
    key: "delete",
    title: "删除",
    disabled: true,
    disableFn: () => {
      const focusedItems = this.graph.get("targetMap").focus || [];
      return !focusedItems.length;
    },
  },
  undo: { key: "undo", title: "撤销", disabled: true },
  redo: { key: "redo", title: "重做", disabled: true },
  clear: {
    key: "clear",
    title: "清空",
    disabled: false,
    disableFn: () => this.graph.get("nodes").length === 0,
  },
  tofront: { key: "tofront", title: "前置" },
  toback: { key: "toback", title: "后置" },
  grid: { key: "grid", title: "网格" },
  auto: { key: "auto", title: "自动排布" },
  kaishi: { key: "kaishi", title: "测试" },
};

export default {
  name: "easy-flow-tools",
  props: {
    tools: {
      type: Array,
      default: () => [],
    },
    graph: {
      default: () => {},
    },
  },

  data() {
    return {
      operations: [
        // { key: 'subflow', title: '保存为子流程' },
        { key: "template", title: "保存为模板" },
        { key: "cancel", title: "取消" },
      ],
      toolbar: [],
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      if (!this.tools.length) {
        this.tools = [Object.keys(baseicTools)];
      }
      this.toolbar = this.tools
        .map((group, idx) => {
          const arr = group.map((tool) => {
            if (typeof tool === "string") {
              return baseicTools[tool];
            } else {
              return tool;
            }
          });
          if (idx < this.tools.length - 1) arr.push({ key: "cutOff" });
          return arr;
        })
        .flat();
    },

    resetToolbar() {
      this.toolbar.forEach((tool) => {
        if (tool.disableFn) {
          tool.disabled = tool.disableFn();
        }
      });
    },

    handleClick(tool) {
      if (tool.disabled) return;
      const key = tool.key;
      const graph = this.graph;
      if (key === "auto") {
        this.handleAutoArrange();
      } else if (key === "cancel") {
        this.$router.push("/marketing/campaignNew");
      } else if (tool.handle) {
        tool.handle();
      } else {
        graph.$trigger(key);
      }
      this.resetToolbar();
    },
    handleAutoArrange() {
      const graph = this.graph;
      const nodes = graph.get("nodes");

      let hasUnconnectedNode = Util.find(
        nodes,
        (node) => !node.get("inEdges").length && !node.get("outEdges").length
      );
      if (hasUnconnectedNode) {
        this.$message.error("没有完成节点连线");
        return false;
      }

      const start = Util.find(nodes, (node) => !node.get("inEdges").length);
      rearrange(graph);
    },

    handleMouseOver(key) {
      this.$refs[key][0].style.display = "block";
      this.$nextTick(() => {
        let $elW = this.$refs[key][0].offsetWidth;
        let $elRight =
          $elW > 40
            ? -this.$refs[key][0].offsetWidth / 2
            : -this.$refs[key][0].offsetWidth / 3;
        this.$refs[key][0].style.right = $elRight + "px";
      });
    },
    handleMouseOut(key) {
      this.$refs[key][0].style.display = "none";
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/customflow/utils/kgraph/style/index.scss";
@import "@/components/customflow/styles/kgrph.scss";

.custom-flow--container__tools {
  display: flex;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 0 0 15px;
  box-sizing: border-box;

  &--bar,
  &--operations {
    display: flex;
    align-items: center;
    height: 40px;

    .iconfont {
      height: 30px;
      line-height: 30px;
      margin: 0 3px;
      border-radius: 2px;
      cursor: pointer;
      text-align: center;
      position: relative;

      .tooltips {
        display: none;
        position: absolute;
        right: -8px;
        top: -15px;
        z-index: 10;
        padding: 3px 4px;
        line-height: 1;
        border-radius: 2px;
        white-space: nowrap;
        font-size: 10px;
      }
    }

    .cut-off {
      width: 1px;
      height: 20px;
      margin: 0 10px;
    }
  }
}
</style>