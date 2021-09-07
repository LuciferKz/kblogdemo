<template>
  <div class="test-container">
    <div class="test-content">
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
  </div>
</template>
<script>
  export default {

    props: {
      node: Object,
      value: Object
    },

    data () {
      return {
        a: 1,
        b: 2,
        c: 3
      }
    },

    computed: {
      currentValue: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },

    methods: {
      handleA () {
        this.currentValue = { a: ++this.currentValue.a, ...this.currentValue }
      },
      handleB () {
        this.b++
      },
      handleC () {
        this.c++
      }
    },

    mounted () {
      console.log('test', this.node)
    }
  }
</script>
<style>
  .test-container {
    height: 100%;
    padding: 5px 10px 5px 10px;
    box-sizing: border-box;
    background: #FFF;
    /* border: 1px solid #EEE; */
  }
  .test-content {
    overflow: auto;
    height: 100%;
  }
</style>