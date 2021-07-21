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

    props: {
      value: Object
    },

    data () {
      return { a: 1, b: 2, c: 3 }
    },

    computed: {

    },

    watch: {
      value () {
        this.init()
      }
    },

    methods: {
      init () {
        this.a = this.value.a
        this.b = this.value.b
        this.c = this.value.c
      },
      handleA () {
        this.a++
      },
      handleB () {
        this.b++
      },
      handleC () {
        this.c++
      }
    },

    mounted () {
      console.log(this.value)
      this.init()
    }
  }
</script>
<style>
  .test-container {
    overflow: auto;
    height: 100%;
    /* background: purple; */
  }
</style>