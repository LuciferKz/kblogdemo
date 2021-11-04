<template>
  <section class="node-contextmenu">
    <section
      class="node-contextmenu-item"
      @click="handleTrigger('copy')"
    ><i class="el-icon el-icon-document-copy">复</i></section>
    <section
      class="node-contextmenu-item"
      @click="handleTrigger('delete')"
    ><i class="el-icon el-icon-delete">删</i></section>
  </section>
</template>

<script>
// import { ElMessage } from 'element-plus'

export default {
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
    graph: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    handleTrigger(key) {
      // const graph = props.graph
      // const node = props.node
      // props.graph.$trigger(key)
      // const parent = graph.findById(node.get('parent'))
      // props.graph.$trigger('blur', parent)
      // ElMessage.success(`${key === 'delete' ? '删除' : '复制'}成功`)
      this.$emit("connect");
    },
  },
};
</script>

<style>
.node-contextmenu {
  width: 24px;
  z-index: 10000;
  padding: 0 5px;
  font-size: 14px;
}

.node-contextmenu-item {
  padding: 3px 0;
  cursor: pointer;
}

.node-contextmenu-item:first-child {
  border-bottom: 2px solid #ccc;
}
</style>