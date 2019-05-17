import each from './each'
import extend from './extend'
import clone from './clone'
import mix from './mix'
import deepMix from './deep-mix'


import typeUtil from './type/';

import mod from './math/mod'
import augment from './augment'
import toArray from './to-array'

const Util = {
  each,
  extend,
  clone,
  mix,
  deepMix,

  mod,
  augment,
  toArray,
}

mix(Util, typeUtil)

export default Util