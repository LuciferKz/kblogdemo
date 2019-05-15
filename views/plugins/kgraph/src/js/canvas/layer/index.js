class Layer {
  constructor () {

  }

  addLayer (layer) {
    this.layer.push(layer)
  }

  addShape (shape) {
    this.layer.push(shape)
  }

  getDefaultCfg () {
    return {
      /**
       * 层内容
       */
      children: []
    }
  }
}

export default Layer