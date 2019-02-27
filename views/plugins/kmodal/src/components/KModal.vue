<template>
  <div class="kmodal-container kmodal-theme-default">
    <div 
      class="kmodal" 
      :class="[kmodal.active ? 'active' : '', 'kmodal-' + type]" 
      :style="{ animation: kmodalAnim}">
      <div class="kmodal-dialog">
        <div class="kmodal-content">
          <div class="kmodal-header">
            <button 
              type="button" 
              class="close"
              data-dismiss="kmodal" 
              aria-label="Close" 
              @click="cancel()">&times;
            </button>
            <h4 class="kmodal-title">{{ title }}</h4>
          </div>
          <div class="kmodal-body">
            <slot></slot>
            <div v-if="message">{{ message }}</div>
          </div>
          <div class="kmodal-footer">
            <button type="button" class="btn btn-outline pull-left" @click="cancel()">取消</button>
            <button type="button" class="btn btn-outline" @click="confirm()">确认</button>
          </div>
        </div>
      </div>
    </div>
    <div 
      class="kcover" 
      :class="{ 'active': kcover.active }" 
      @click="hide()" 
      :style="{ animation: kcoverAnim }"
    ></div>
  </div>
</template>

<script>
  export default {
    name: 'Kmodal',
    data () {
      return {
        type: 'default', // kmodal 类型 info, danger, warn, success
        title: '默认窗口',
        message: '', // kmodal 要展示的消息
        kmodal: {
          active: false,
          animType: 'fade',
        },
        kcover: {
          active: false,
          animType: 'fade',
        },
        duration: 500, // kmodal 过渡时长
        timingFn: 'linear', // 过渡函数
        beforeClose: null, // 关闭前执行的函数
        beforeConfirm: null, // 确认前执行的函数
        currentStage: 'In', // 当前阶段
      }
    },
    created () {
      this.$on('show', (settings = {}) => {
        Object.assign(this, settings)
        this.kmodal.active = this.kcover.active = true
        if (settings.animType) {
          this.kmodal.animType = settings.animType
          this.kcover.animType = settings.animType
        }
      })
      this.$on('hide', (settings = {}) => {
        Object.assign(this, settings)
        this.hide()
      })
    },
    computed: {
      kmodalAnimType () {
        return this.kmodal.animType + this.currentStage;
      },
      kcoverAnimType () {
        return 'kcover' + this.kcover.animType + this.currentStage;
      },
      kmodalAnim () {
        return this.kmodalAnimType + ' ' + this.duration / 1000 + 's ' + this.timingFn + ' forwards'
      },
      kcoverAnim () {
        return this.kcoverAnimType + ' ' + this.duration / 1000 + 's ' + this.timingFn + ' forwards'
      },
    },
    methods: {
      set (name, val) {
        this[name] = val
      },
      show () {
        this.currentStage = 'In';
      },
      hide (result) {
        this.currentStage = 'Out';
        setTimeout(() => {
          this.kmodal.active = this.kcover.active = false
          this.resolve(result);
        }, this.duration)
      },
      cancel () {
        this.hide(false);
      },
      confirm () {
        this.hide(true);
      }
    }
  }
</script>

<style lang="less">
@import '../less/default.less';

/** 可以定制的切换效果 **/
@keyframes kcoverFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes kcoverFadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translate(-50%, 80px)
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 100px)
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translate(-50%, 100px)
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 80px)
  }
}
</style>