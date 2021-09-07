<template>
  <div>
    <data-flow-graph :graph="graph" ref="graph"></data-flow-graph>
  </div>
</template>
<script>
    // <data-flow-tools :graph="graph" ref="tools"></data-flow-tools>
import graph from "./components/graph.vue";
import graphNode from './components/graphNode.vue';
import createGraph from "./js/createGraph.js";

export default {
  components: { dataFlowGraph: graph },
  data() {
    return {
      graph: createGraph(),
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