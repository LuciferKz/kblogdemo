import KModal from './components/KModal'

export default {
  install: function (v) {
    v.component('KModal', KModal)

    v.prototype.$kmodal = {
      kmodal: null,
      init: function (kmodal) {
        this.kmodal = kmodal
      },
      show: function (settings) {
        return new Promise ((resolve) => {
          settings.resolve = resolve
          this.kmodal.$emit('show', settings)
        })
      },
      hide: function (settings) {
        this.kmodal.$emit('hide', settings)
      },
    }
  }
}