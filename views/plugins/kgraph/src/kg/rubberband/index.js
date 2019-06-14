import Util from "../../util";
import newElement from '../../util/dom/new-element';

class Rubberband {
  constructor (cfg) {
    const defaultCfg = {
      graph: null,
      rbbd: null
    }
    this._cfg = Util.mix({}, defaultCfg, cfg)
    this.init()
  }

  init () {
    this.addEvent()
  }

  addEvent () {
    let _this = this
    const graph = this.get('graph')
    const container = graph.get('container')
    let downPoint = null
    let rbbd = null
    let box = null

    const fnDown = function (e) {
      if (e.target) return false
      e = e.origin
      box = graph.getBox()
      downPoint = { x: e.clientX, y: e.clientY }
      graph.on('mousemove', fnMove)
      graph.on('mouseup', fnUp)
    }

    const fnMove = function (e) {
      e = e.origin
      const downClientX = downPoint.x
      const downClientY = downPoint.y
      const clientX  = e.clientX
      const clientY = e.clientY
      if (!rbbd && (Math.abs(downPoint.x - clientX) > 15 || Math.abs(downPoint.y - clientY) > 15)) {
        rbbd = _this.createRubberband({ x: downClientX - box.l, y: downClientY - box.t })
      }
      const moveX = clientX - downPoint.x
      const moveY = clientY - downPoint.y
      if (rbbd) rbbd.css({ transform: 'translate('+ (moveX < 0 ? moveX : 0) +'px,'+ (moveY < 0 ? moveY : 0) +'px)', width: Math.abs(moveX) + 'px', height: Math.abs(moveY) + 'px' })
    }

    const fnUp = function (e) {
      console.log('fnUp', e)
      if (rbbd) {
        rbbd.remove()
        rbbd = null

        const downX = downPoint.x
        const downY = downPoint.y
        const upX = e.clientX
        const upY = e.clientY
        let point1 = graph.getPointByClient(downX, downY)
        let point2 = graph.getPointByClient(upX, upY)
  
        const area = { l: 0, t: 0, r: 0, b: 0 }
        
        if (downX > upX) {
          area.l = point2.x
          area.r = point1.x
        } else {
          area.l = point1.x
          area.r = point2.x
        }
        
        if (downX > upX) {
          area.t = point2.y
          area.b = point1.y
        } else {
          area.t = point1.y
          area.b = point2.y
        }
  
        _this.selectArea(area)
      }
      graph.off('mousemove', fnMove)
      graph.off('mouseup', fnUp)
    }

    graph.on('mousedown', fnDown)
  }

  createRubberband (point) {
    const graph = this.get('graph')
    const container = graph.get('container')
    const rbbd = newElement({
      tag: 'div',
      props: {
        className: 'kg-rubber-band',
      },
      style: {
        position: 'absolute',
        left: point.x + 'px',
        top: point.y + 'px',
        border: '1px solid rgb(179, 179, 245)',
        background: 'rgba(179, 179, 245, 0.1)',
        zIndex: '999'
      }
    })
    container.append(rbbd)
    this.set('rbbd', rbbd)
    return rbbd
  }

  selectArea (area) {
    const graph = this.get('graph')
    const nodes = graph.get('nodes')
    const edges = graph.get('edges')

    const targetMap = graph.get('targetMap')
    targetMap.focus = []

    Util.each(nodes, node => {
      const x = node.get('x')
      const y = node.get('y')

      if (x > area.l && x < area.r && y > area.t && y < area.b) {
        node.setState('focus', true)
        targetMap.focus.push(node)
      }
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

export default Rubberband