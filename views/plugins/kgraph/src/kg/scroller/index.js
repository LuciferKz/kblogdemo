import newElement from '../../util/dom/new-element'
import $k from '../../util/dom/index'
import Util from '../../util'

const scrollEvents = {
  downPoint: null,
  prevPoint: null,
  direction: 'vertical',
  scroller: null,
  mousedown: function (e, dir) {
    scrollEvents.direction = dir;
    scrollEvents.prevPoint = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', scrollEvents.mousemove);
    document.addEventListener('mouseup', scrollEvents.mouseup);
  },
  mousemove: function (e) {
    let se = scrollEvents
    let scroller = se.scroller
    if (scrollEvents.direction === 'vertical' && scroller.get('hasVer')) {
      scroller.scrollVer(e.clientY - scrollEvents.prevPoint.y);
    } else if (scrollEvents.direction === 'horizontal' && scroller.get('hasHor')) {
      scroller.scrollHor(e.clientX - scrollEvents.prevPoint.x);
    }
    scrollEvents.prevPoint = { x: e.clientX, y: e.clientY };
  },
  mouseup: function (e) {
    document.removeEventListener('mousemove', scrollEvents.mousemove);
    document.removeEventListener('mouseup', scrollEvents.mouseup);
  },
}

class Scroller {

  constructor (cfg) {
    const defaultCfg = {
      container: null,

      vbar: null,

      hbar: null,
      
      width: 1000,

      height: 500,

      scrollTop: 0,

      scrollLeft: 0,
      // 垂直滚动条bar高度
      vbarSize: 0,
      // 水平滚动条bar宽度
      hbarSize: 0,

      refs: {},

      graph: null,

      speed: 20,

      barSize: 10
    } 
    this._cfg = Util.mix({}, defaultCfg, cfg)
    this.init()
  }

  init () {
    this.buildLayout()
    this.changeSize()

    const container = this.get('container')
    const speed = this.get('speed')
    container.onWheel((e) => {
      e.preventDefault();
      this.get('hasHor') && this.scrollHor(e.deltaX * speed);
      this.get('hasVer') && this.scrollVer(e.deltaY * speed);
    })

    scrollEvents.scroller = this

    const vbar = this.get('vbar')
    vbar.on('mousedown', (e) => { scrollEvents.mousedown(e, 'vertical') })

    const hbar = this.get('hbar')
    hbar.on('mousedown', (e) => { scrollEvents.mousedown(e, 'horizontal') })
  }

  buildLayout () {
    const refs = {}
    newElement({
      tag: 'div',
      ref: 'scrollContainer',
      props: { className: 'scroll-container' },
      children: [{
        tag: 'div',
        props: { className: 'scroll-vertical-container' },
        children: [{
          tag: 'div',
          ref: 'scrollVerBar',
          props: { className: 'scroll-bar' }
        }]
      }, {
        tag: 'div',
        props: { className: 'scroll-horizontal-container' },
        children: [{
          tag: 'div',
          ref: 'scrollHorBar',
          props: { className: 'scroll-bar' }
        }]
      }]
    }, refs)

    this.set('scroller', refs.scrollContainer)
    this.set('vbar', refs.scrollVerBar)
    this.set('hbar', refs.scrollHorBar)
    this.get('container').append(refs.scrollContainer)
  }

  changeSize () {
    let graph = this.get('graph')
    let ratio = graph.get('ratio')
    let barSize = this.get('barSize')
    let width = this.get('width')
    let height = this.get('height')
    let canvasWidth = graph.get('width')
    let canvasHeight = graph.get('height')
    let diagramWidth = graph.get('diagramWidth') * ratio
    let diagramHeight = graph.get('diagramHeight') * ratio
    let vbar = this.get('vbar')
    let hbar = this.get('hbar')
    let scroller = this.get('scroller')
    let hasVer = canvasHeight < diagramHeight
    let hasHor = canvasWidth < diagramWidth
    let vratio = canvasHeight / diagramHeight
    let hratio = canvasWidth / diagramWidth

    let translateX = graph.get('translateX')
    let scrollLeft = -translateX * hratio
    hbar.css('transform', 'translate('+ scrollLeft +'px,0)')
    this.set('scrollLeft', scrollLeft)

    let translateY = graph.get('translateY')
    let scrollTop = -translateY * vratio
    vbar.css('transform', 'translate(0,'+ scrollTop +'px)')
    this.set('scrollTop', scrollTop)
    
    scroller.css({ width: width + barSize + 'px', height: height + barSize + 'px' })

    if (hasHor) {
      let hbarSize = hratio * width
      hbar.css({ 'width': hbarSize + 'px', 'display': 'block' })
      this.set('hbarSize', hbarSize)
    } else {
      hbar.css({ 'width': '0px', 'display': 'none' })
    }

    if (hasVer) {
      let vbarSize = vratio * height
      this.set('vbarSize', vbarSize)
      vbar.css({ 'height': vbarSize + 'px', 'display': 'block' })
    } else {
      vbar.css({ 'height': '0px', 'display': 'none' })
    }

    this.set('hasVer', hasVer)
    this.set('hasHor', hasHor)
    this.set('vratio', vratio)
    this.set('hratio', hratio)
  }

  scroll () {
    const graph = this.get('graph')
    const scrollLeft = this.get('scrollLeft')
    const scrollTop = this.get('scrollTop')
    const vratio = this.get('vratio')
    const hratio = this.get('hratio')
    graph.translate(-(scrollLeft / hratio), -(scrollTop / vratio))
  }

  scrollHor (x) {
    let scrollLeft = this.get('scrollLeft')
    let hbar = this.get('hbar')
    let hbarSize = this.get('hbarSize')
    let width = this.get('width')

    scrollLeft = scrollLeft + x
    if (scrollLeft < 0) {
      scrollLeft = 0
    } else if (scrollLeft + hbarSize > width) {
      scrollLeft = width - hbarSize
    }
    hbar.css('transform', 'translate('+ scrollLeft +'px,0)')
    this.set('scrollLeft', scrollLeft)
    this.scroll()
  }

  scrollVer (y) {
    let scrollTop = this.get('scrollTop')
    let vbar = this.get('vbar')
    let vbarSize = this.get('vbarSize')
    let height = this.get('height')

    scrollTop = scrollTop + y
    if (scrollTop < 0) {
      scrollTop = 0
    } else if (scrollTop + vbarSize > height) {
      scrollTop = height - vbarSize
    }
    vbar.css('transform', 'translate(0,'+ scrollTop +'px)')
    this.set('scrollTop', scrollTop)
    this.scroll()
  }

  set(key, val) {
    if (Util.isPlainObject(key)) {
      this._cfg = Util.mix({}, this._cfg, key);
    } else {
      this._cfg[key] = val;
    }
  }

  get(key) {
    return this._cfg[key];
  }












}

export default Scroller
