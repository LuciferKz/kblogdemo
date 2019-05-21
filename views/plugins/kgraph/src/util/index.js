import each from './each'
import extend from './extend'
import clone from './clone'
import mix from './mix'
import deepMix from './deep-mix'

import find from './array/find'

import typeUtil from './type/';

import mod from './math/mod'
import augment from './augment'
import toArray from './to-array'

import toUpperFirst from './to-upper-first'

const Util = {
  find,
  
  each,
  extend,
  clone,
  mix,
  deepMix,

  mod,
  augment,
  toArray,

  toUpperFirst
}

mix(Util, typeUtil)

export default Util