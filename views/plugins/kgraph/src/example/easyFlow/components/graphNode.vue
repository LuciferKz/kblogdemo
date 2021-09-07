<template>
  <div class="foo">{{ label }}</div>
</template>
<script>
export default {
  props : ['node','label'],
}
</script>
<style>
.foo{
  padding: 10px;
  background: white;
}
</style>