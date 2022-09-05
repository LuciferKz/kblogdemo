import each from "./each";
import extend from "./extend";
import clone from "./clone";
import mix from "./mix";
import map from "./map";
import deepMix from "./deep-mix";
import pick from "./pick";
import filter from "./filter";

import find from "./array/find";
import reduce from "./array/reduce";

import typeUtil from "./type/";

import mod from "./math/mod";
import augment from "./augment";
import toArray from "./to-array";

import toUpperFirst from "./to-upper-first";

import throttle from "./throttle";
import debounce from "./debounce";

import genUUID from "./uuid";

import traversal from "./traversal";

const Util = {
  find,
  reduce,

  each,
  filter,
  extend,
  clone,
  mix,
  map,
  deepMix,
  pick,

  mod,
  augment,
  toArray,

  toUpperFirst,

  throttle,
  debounce,

  genUUID,
};

mix(Util, typeUtil);

mix(Util, traversal);

export default Util;
