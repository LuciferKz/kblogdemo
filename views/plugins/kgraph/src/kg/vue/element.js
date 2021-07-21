import Util from "../../util";
import newElement from "../../util/dom/new-element";
import Vue from 'vue/dist/vue.js';

class VueElement {
  constructor (cfg) {
    const defaultCfg = {
      component: null,
      template: null,
      data: {},
      parent: null
    }
    this._cfg = Util.mix({}, defaultCfg, cfg)
    this.init()
  }

  init () {
    const parent = this.get('parent')
    const id = `node-${ parent.get('id') }`
    this.set('id', id)
    this.create()
    this.extend()
    this.updatePosition()
    this.subscribe()
  }

  create () {
    const parent = this.get('parent')
    const box = parent.get('box')
    const id = this.get('id')
    const el = newElement({
      tag: 'div',
      props: {
        id,
      },
      style: {
        position: 'absolute',
        width: `${ box.width }px`,
        height: `${ box.height }px`,
        zIndex: 9999,
        userSelect: 'none'
      }
    })
    this.set('el', el)
  }

  extend () {
    const data = this.get('data')
    const component = this.get('component')
    const el = this.get('el')
    let Vm = null
    if (component) {
      Vm = Vue.extend(component)
    } else {
      Vm = Vue.extend({
        template: this.get('template'),
        data () {
          return data
        }
      })
    }
    const $component = new Vm().$mount()
    el.append(newElement({ dom: $component.$el }))
  }

  updatePosition () {
    const parent = this.get('parent')
    const box = parent.get('box')
    this.get('el').css({
      top: `${ box.t }px`,
      left:  `${ box.l }px`
    })
  }

  subscribe () {
    const parent = this.get('parent')
    parent.on('updatePosition', (box) => {
      this.updatePosition()
    })
  }

  set (key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get (key) {
    return this._cfg[key];
  }
}

export default VueElement