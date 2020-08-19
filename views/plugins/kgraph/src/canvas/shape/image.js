import Base from './base'
import Util from '../../util'

class Img extends Base {
  /**
   * @param { object } context
   * @param { object } cfg
   */
  constructor (cfg) {
    super(cfg)
  }

  draw (c) {
    this._draw(c, this._cfg)
  }

  _draw (c, cfg) {
    if (!c) throw new Error('illegal context')
    if (!cfg.img) throw new Error('绘制图片，目标图片不存在')
    const s = this.getShapeStyle()
    c.save();
    c.drawImage(cfg.img, s.sx, s.sy, s.swidth, s.sheight, s.x, s.y, s.width, s.height)
    c.restore();
  }

  _updatePosition (x, y) {
    this._cfg.style.x = x
    this._cfg.style.y = y
  }

  getDefaultCfg () {
    return  {
      x: 0,
      y: 0,
      size: [50, 50],
      img: null,
    }
  }

  getShapeStyle () {
    const cfg = this._cfg

    const shapeStyle = Util.mix({}, this.getDefaultStyle(), this.get('style'))
    
    const size = cfg.size

    shapeStyle.width = size[0]

    shapeStyle.height = size[1]

    this._updatePosition(cfg.x - shapeStyle.width / 2, cfg.y - shapeStyle.height / 2)

    return shapeStyle
  }

  getDefaultStyle () {
    return {
      // 图片上的x坐标
      sx: 0,
      // 图片上的y坐标
      sy: 0,
      // 图片上的宽度
      swidth: 0,
      // 图片上的高度
      sheight: 0,
      // 画布上的x坐标
      x: 0,
      // 画布上的y坐标
      y: 0,
      // 画布上的宽度
      width: 0,
      // 画布上的高度
      height: 0,
      /**
       * 图片地址
      */
    }
  }
}

export default Img
