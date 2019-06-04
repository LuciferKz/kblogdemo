import Util from '../../util';
import registerShape from '../util/registerShape'

registerShape('grid', function (Base) {
  return class Grid extends Base {
    draw (c) {
      const s = this.get('style')
      this._draw(c, s)
    }

    _draw (c, s) {
      const width = this.get('width')
      const height = this.get('height')
      const size = this.get('size')
      let x = 0
      let y = 0
      c.save()
      c.beginPath()
  
      while (x < width) {
        c.moveTo(x, 0)
        c.lineTo(x, height)
        x += size
      }
      while (y < height) {
        c.moveTo(0, y)
        c.lineTo(width, y)
        y += size
      }
      c.strokeStyle = s.stroke
      c.stroke()
      c.restore()
    }

    getShapeStyle () {
      return {
        lineWidth: 1,
        stroke: '#eee'
      }
    }
  }
})

class Grid {
  constructor (cfg) {
    const defaultCfg = {
      size: 10
    }

    this._cfg = Util.mix({}, defaultCfg, cfg)
    this.init()
  }

  init () {
    const graph = this.get('graph')
    const width = graph.get('diagramWidth')
    const height = graph.get('diagramHeight')
    graph.$grid = this
    const gridId = graph.addShape({ type: 'grid', width, height })
    graph.on('afterChangeDiagramSize', function (width, height) {
      console.log('after change diagram size')
      graph.findShapeById(gridId).update({ width, height })
    })
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

export default Grid