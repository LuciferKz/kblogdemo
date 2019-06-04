import Base from '../../canvas/shape/base'
import { shapeMap } from '../../canvas/shape'

export default function (name, factory) {
  shapeMap[name] = factory(Base)
  /**
   * constructor
   * 
   * init
   * 
   * _draw
   * 
   * getDefaultCfg
   * 
   * getShapeStyle
   * 
   */
}