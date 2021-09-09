<template>
  <div class="foo">{{ label }}
    <el-button>确定</el-button>
  </div>
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