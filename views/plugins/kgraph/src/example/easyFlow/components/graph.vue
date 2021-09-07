<template>
  <div ref="graph_container" class="gc_19287349"></div>
</template>
<script>
export default {
  props: ["graph"],
  data() {
    return {};
  },
  mounted() {
    this.graph.$mount(this.$refs.graph_container);
  },
};
</script>