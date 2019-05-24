import Base from './base'
import Util from '../../util'

class Text extends Base {
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
    const s = this.get('style')
    // console.log('tex cfg', s)
    c.save();

    c.textBaseline = s.baseline;
    c.fillStyle = s.color;
    c.textAlign = s.align;
    c.font = s.weight + " " + s.size + " " + s.family;
    // console.log(c.font)

    c.shadowBlur = s.shadowBlur;
    c.shadowColor = s.shadowColor;
    c.shadowOffsetX = s.shadowOffsetX;
    c.shadowOffsetY = s.shadowOffsetY;

    if (s.stroke) {
        c.strokeText(cfg.content, cfg.x, cfg.y);
    } else {
        c.fillText(cfg.content, cfg.x, cfg.y);
    }

    c.restore();
  }

  getDefaultCfg () {
    return  {
      x: 0,
      y: 0,
      /**
       * 文本内容
      */
      content: ''
    }
  }

  getShapeStyle () {
    const shapeStyle = Util.mix({}, this.getDefaultStyle(), this.get('style'))
    
    if (this._cfg.size) shapeStyle.size = this._cfg.size + 'px'

    return shapeStyle
  }

  getDefaultStyle () {
    return {
      /**
       * 基线对齐
       */
      baseline: "middle",
      /**
       * 颜色
       */
      color: "#000",
      /**
       * 大小
       */
      size: "11px",
      /**
       * 粗细
       */
      weight: "normal",
      /**
       * 字体
       */
      family: "黑体",
      /**
       * 相对中心坐标靠左还是靠右还是居中
       */
      align: "center",
      /**
       * 阴影模糊
       */
      shadowBlur: 0,
      /**
       * 阴影颜色
       */
      shadowColor: "#000",
      /**
       * 阴影水平偏移量
       */
      shadowOffsetX: 0,
      /**
       * 阴影垂直偏移量
       */
      shadowOffsetY: 0,
      /**
       * 空心字
       */
      stroke: false,
    }
  }
}

export default Text
