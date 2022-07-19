import Vue from 'vue';

import DefaultConfig from "./default"; // 默认

import MemberConfig from './member'; // 会员中心
import OrderConfig from './order'; // 订单中心

import ShuangConfig from "./column-double-product"; // 双列商品

import MofangConfig from "./mofang"; // 魔方
import BannerConfig from "./banner"; // 图片轮播
import ImgConfig from "./group-image"; // 图片组
import DoubleImgConfig from "./column-multiple-image"; // 多列图片组
import SearchConfig from "./search"; // 搜索框
import VideoConfig from './video'; // 视频
import ListConfig from './list-nav'; // 列表导航
import advertise from './advertise'; // 广告

const items = {
  'default': DefaultConfig,
  'shuanglieshangpin': ShuangConfig,
  'mofang': MofangConfig,
  'banner': BannerConfig,
  'imgGroup': ImgConfig,
  'doubleimgGroup': DoubleImgConfig,
  'search': SearchConfig,
  'video': VideoConfig,
  'member': MemberConfig,
  'order': OrderConfig,
  'list': ListConfig,
  advertise
}

export default Vue.component('diy-item', {
  render (h) {
    const type = this.type || this.default;
    if (!type) return false; 
    const model = this.model || {};
    return h(items[type], { 
      props: {
        model, 
        editable: this.editable 
      },
      events: this.events,
      listeners: this.listeners
    });
  },
  props: ['type', 'model', 'editable', 'events', 'default']
})