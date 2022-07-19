<template :options="options">
  <div class="d-config">
    <h2 class="pannel-title"><span class="pannel-title__label">魔方设置</span></h2>
    <div class="pannelcontent">
      <image-cube v-model="model.combineLists" :row="4" :col="4" :base="base" @click="handleSelectCell" :disabled="isTemplate"></image-cube>
      <image-link v-if="selected" v-model="currentCell" v-bind="config"></image-link>
    </div>
  </div>
</template>

<script>
import imageCube from '@/components/imageCube';
import imageLink from '@/components/imageLink';

export default {
  props: ["model", "editable"],

  components: { imageCube, imageLink },
  
  inject: ['diypage'],

  data () {
    return {
      config: {
        min: 1,
        max: 1,
        map: { image: 'imageUrl', link: 'linkUrl' }
      },
      base: { imageUrl: '', linkUrl: '' }, // 网格对象的基准字面量
      //  { imageUrl: '', linkUrl: '' }
      currentCell: [],
      selected: false,
    }
  },

  methods: {
    handleSelectCell (cell) {
      this.selected = true;
      this.currentCell = [cell];
    }
  },

  computed: {
    isTemplate () {
      return !!this.diypage.template;
    }
  },
};
</script>
