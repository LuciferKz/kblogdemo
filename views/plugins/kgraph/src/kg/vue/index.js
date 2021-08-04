import Util from "../../util";
import newElement from "../../util/dom/new-element";
import VueElement from './element'

class VuePlugin {
  constructor (cfg) {
    const defaultCfg = {
      graph: null,
      container: null,
      scroller: null,
      elements: {}
    }
    this._cfg = Util.mix({}, defaultCfg, cfg)
    this.init()
  }

  init () {
    const graph = this.get('graph')
    const diagramContainer = graph.get('container')
    const container = this.addContainer()
    const scroller = this.addScroller()
    container.append(scroller)
    diagramContainer.append(container)
    this.addListener()
  }

  addContainer () {
    const graph = this.get('graph')
    const width = graph.get('width')
    const height = graph.get('height')
    const container = newElement({
      tag: 'div',
      props: {
        className: 'vue-element-container'
      },
      style: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${ width }px`,
        height: `${ height }px`,
        zIndex: 9999
      }
    })
    this.set('container', container)
    return container
  }

  addScroller () {
    const graph = this.get('graph')
    const diagramWidth = graph.get('diagramWidth')
    const diagramHeight = graph.get('diagramHeight')
    const scroller = newElement({
      tag: 'div',
      props: {
        className: 'vue-element-scroller'
      },
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${ diagramWidth }px`,
        height: `${ diagramHeight }px`
      }
    })
    this.set('scroller', scroller)
    return scroller
  }

  addListener () {
    const graph = this.get('graph')

    graph.on('afterChangeSize', () => {
      const width = graph.get('width')
      const height = graph.get('height')
      this.get('container').css({ width: `${ width }px`, height: `${ height }px` })
    })

    graph.on('afterChangeDiagramSize', (width, height) => {
      this.get('scroller').css({ width: `${ width }px`, height: `${ height }px` })
    })

    graph.on('scroll', (e) => {
      this.get('container').scrollTo(e)
    })

    graph.on('scale', (ratio) => {
      this.get('scroller').css({
        transformOrigin: '0 0',
        transform: `scale(${ ratio })`
      })
    })
  }

  create (cfg) {
    const elements = this.get('elements')
    const vueElement = new VueElement(cfg)
    const scroller = this.get('scroller')
    elements[vueElement.get('id')] = vueElement
    scroller.append(vueElement.get('el'))
    return vueElement
  }

  clear () {
    const elements = this.get('elements')
    const scroller = this.get('scroller')
    scroller.html('')
    Util.each(elements, element => {
      element.remove()
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

export default VuePlugin