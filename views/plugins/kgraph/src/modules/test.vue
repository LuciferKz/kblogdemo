<template>
  <div class="test-container">
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <p>{{ a }} + {{ b }} + {{ c }}</p>
    <input @click="handleA" type="button" value="a + 1" />
    <input @click="handleB" type="button" value="b + 1" />
    <input @click="handleC" type="button" value="c + 1" />
  </div>
</template>
<script>
  export default {
    data () {
      return {
        a: 1,
        b: 2,
        c: 3
      }
    },
    methods: {
      handleA () {
        this.a++
      },
      handleB () {
        this.b++
      },
      handleC () {
        this.c++
      }
    }
  }
</script>
<style>
  .test-container {
    overflow: auto;
    height: 100%;
  }
</style>