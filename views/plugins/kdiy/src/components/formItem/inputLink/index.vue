<template>
  <div class="input-link" :style="{ width: width }">
    <el-input :value="currentValue" placeholder="请选择跳转" disabled>
      <el-button slot="suffix" @click="handleSelectLink" :disabled="disabled">选择跳转</el-button>
    </el-input>

    <el-dialog :title="'请选择链接'" :visible.sync="dialog.visible" width="1000px" height="800px" z-index="99999" :append-to-body="appendToBody">
      <div v-if="dialog.visible">
        <link-selector ref="linkSelector" v-model="dialog.value" @change="handleLinkChange" @close="handleClose" :enableSettings="enableSettings" :filterTab="filterTab"></link-selector>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import linkSelector from '@/components/linkSelector';

export default {
  name: 'input-link',

  components: { linkSelector },

  props: {
    value: String,
    disabled: Boolean,
    appendToBody: Boolean,
    enableSettings: {
      type: Object,
      default: () => ({ disablePhone: 1 })
    },
    width: String,
    filterTab: {
      type: Object,
      default: () => ({ wxapp: true })
    }
  },

  data () {
    return {
      dialog: {
        visible: false,
        value: '',
      }
    }
  },

  computed: {
    currentValue: {
      get () {
        return this.value;
      },
      set (v) {
        this.$emit('input', v);
      }
    }
  },

  methods: {
    handleSelectLink () {
      this.dialog.value = this.currentValue;
      this.dialog.visible = true;
    },
    handleLinkChange () {
      let value = this.dialog.value;
      if (typeof(value) === 'object') {
        value = JSON.stringify(value);
      }
      this.currentValue = value;
    },
    handleClose () {
      this.dialog.visible = false;
    }
  }
}
</script>

<style>
  .input-link .el-input__suffix {
    top: -1px;
    right: 0;
  }
</style>