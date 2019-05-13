import KCanvas from '../../utils/k-canvas'
import _ from '../../utils/index'

const GraphStates = function () {
  let states = [],
  stateId = -1;
  return {
    getStateId () {
      return stateId;
    },
    getLength () {
      return states.length;
    },
    saveState (state) {
      if (stateId > -1) {
        states = states.slice(0, stateId + 1);
      }
      states.push(state);
      stateId++;
    },
    clearStates () {
      states = [];
      stateId = -1;
    },
    nextState () {
      stateId = stateId + 1 < states.length - 1 ? stateId + 1 : states.length - 1;
      return states[stateId];
    },
    prevState () {
      stateId = stateId - 1 > -1 ? stateId - 1 : 0;
      return states[stateId];
    },
    currentState () {
      return states[stateId];
    }
  }
}

const Graph = function (cfg) {
  const dft = {
    width: 1000,
    height: 800,

    shapeCfg: {},
    edgeCfg: {}
  }

  const g = this

  g.cfg = _.extend(dft, cfg)

  const _init = function () {
    g.ca = document.createElement('canvas')
    
    g.ca.width = g.cfg.width
    g.ca.height = g.cfg.height

    g.ctx = g.ca.getContext('2d')

    g.kc = new KCanvas(g.ctx)
    if (g.cfg.enableGrid) g.grid = new Grid({ width: g.cfg.width, height: g.cfg.height })
  }

  const handler = {
    render () {
      if (g.grid) {
        _.each(g.grid.lines, l => {
          const attrs = _.extend({}, g.grid.attrs, { path: l })
          g.kc.drawLine(attrs)
        })
      }
    },
  
    reset () {},
  
    refresh () {},
  
    clear () {},
  
    save (data) {
      GraphStates.save(data)
    },
  
    read (data) {
      g.save(data)
      g.render()
    },
  
    changeSize (w, h) {
      g.cfg.width = w
      g.cfg.height = h
    },
  
    paint () {
      
    },

    addItem () {

    },

    removeItem () {},

    updateItem () {},
  
    autoRender: false
  }

  _.extend(g, handler)

  _init()
}

const Background = function () {}

const Grid = function (cfg) {
  const dft = {
    size: 10,
    align: false,
    color: '#EEEEEE',
    lineWidth: 2
  }

  cfg = _.extend(dft, cfg)

  g.attrs = {
    stroke: g.cfg.color,
    lineWidth: g.cfg.lineWidth
  }
  
  g.lines = []

  const init = function () {
    genLines()
  }

  const genLines = function () {
    const lines = []
    let x = 0, y = 0;
    while (y < cfg.width) {
      lines.push([{ t: 'M', x: 0, y: y }, { t: 'L', x: diagramWidth, y: y }])
      y += cfg.size;
    }
    while (x < cfg.height) {
      lines.push([{ t: 'M', x: x, y: 0 }, { t: 'L', x: x, y: diagramHeight }])
      x += cfg.size;
    }
    g.lines = lines
  }

  init()
}

export default Graph