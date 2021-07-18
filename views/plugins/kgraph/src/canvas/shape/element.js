import Base from './base'
import Util from '../../util'

class Element extends Base {
  /**
   * @param { object } context
   * @param { object } cfg
   */
  constructor (cfg) {
    super(cfg)
  }

  init () {
    this.convertToSvg()
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

  convertToSvg () {
    return new Promise(resolve => {
      const el = this.get('el')
      console.log('cloneNode', el, el.offsetWidth, el.offsetHeight)
      const size = this.get('size')
      if (this.get('autosize')) {
        size[0] = el.offsetWidth
        size[1] = el.offsetHeight
      }
      el.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      // el.style.visibility = 'visible'

      // const elDiv = document.createElement('div')
      // elDiv.style.width = '100%'
      // elDiv.style.height = '100%'
      // elDiv.appendChild(el)

      const data = 
      `<svg xmlns='http://www.w3.org/2000/svg' width='${ el.offsetWidth }' height='${ el.offsetHeight }'>
        <foreignObject width='100%' height='100%'>
          ${ el.outerHTML }
        </foreignObject>
      </svg>`
  
      const DOMURL = self.URL || self.webkitURL || self;
      const img = new Image();
      const svg = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
      const url = DOMURL.createObjectURL(svg);
      img.onload = function() {
        // ctx.drawImage(img, 0, 0);
        resolve(img)
        // DOMURL.revokeObjectURL(url);
      };
      img.src = url;
      // document.body.appendChild(img)
      this.set('img', img)
    })
  }

  getDefaultCfg () {
    return  {
      x: 0,
      y: 0,
      size: [50, 50],
      img: null,
      el: null,
    }
  }

  getShapeStyle () {
    const style = this.get('style')

    const size = this.get('size')

    const shapeStyle = Util.mix({}, this.getDefaultStyle(), style)

    if (!this.get('img')) {
      this.convertToSvg().then(() => {
        const size = this.get('size')

        shapeStyle.width = size[0]

        shapeStyle.height = size[1]
          
        shapeStyle.swidth = size[0]
        
        shapeStyle.sheight = size[1]

        console.log(img, img.width, img.height)
      })
    }

    shapeStyle.width = size[0]

    shapeStyle.height = size[1]
      
    shapeStyle.swidth = size[0]
    
    shapeStyle.sheight = size[1]

    this._updatePosition(this.get('x') - shapeStyle.width / 2, this.get('y') - shapeStyle.height / 2)

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

export default Element
