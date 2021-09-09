<template>
  <div>
    <data-flow-graph :graph="graph" ref="graph"></data-flow-graph>
    <el-input></el-input>
    <el-button>确定</el-button>
  </div>
</template>
<script>
    // <data-flow-tools :graph="graph" ref="tools"></data-flow-tools>
import graph from "./components/graph.vue";
import graphNode from './components/graphNode.vue';
import createGraph from "./js/createGraph.js";
import Vue from 'vue/dist/vue.esm.js';

export default {
  components: { dataFlowGraph: graph },
  data() {
    console.log(this)
    return {
      graph: createGraph({ vue: Vue }),
    };
  },
  mounted() {
    this.addNode({label : '开始'});
    this.addNode({label : '结束'});
  },
  methods : {
    addNode( props ){
      this.graph.addNode(200,200,200,140,graphNode,props);
    }
  }
};
</script>