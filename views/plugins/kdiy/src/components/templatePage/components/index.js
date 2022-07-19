import Vue from "vue"
import DanLieShangPin from "./danlieshangpin/danlieTem";
import ShuangLieShangPin from "./shuanglieshangpin/shuanglieTem";
import goodsBannerTem from "./goodsBannerTem/goodsBannerTem";
import tabBarTem from "./tabBarTem/tabBarTem";
import Mofang from "./mofang/mofangTem";
import Banner from "./banner/bannerTem";
import ShopInfo from "./shopinfo/shopinfoTem";
import ImgTem from "./imgTem/imgTem";
import DoubleImgTem from "./doubleImgTem/doubleImgTem";
import TabTem from "./tabTem/tabTem";
import SearchTem from "./searchTem/searchTem";
import BlankTem from "./blankTem/blankTem";
import LineTem from "./lineTem/lineTem";
import VideoTem from './videoTem/videoTem';
import MemberTem from './memberTem/memberTem';
import OrderTem from './orderTem/orderTem';
import ListTem from './listTem/listTem';
import morelistTem from './morelistTem/morelistTem';
import advertise from './advertise';

const items = {
  'danlieshangpin': DanLieShangPin,
  'shuanglieshangpin': ShuangLieShangPin,
  'goodsBannerTem': goodsBannerTem,
  'tabBarTem': tabBarTem,
  'mofang': Mofang,
  'banner': Banner,
  'shangpinxiangqing': ShopInfo,
  'imgGroup': ImgTem,
  'doubleimgGroup': DoubleImgTem,
  'xuanxiangqia': TabTem,
  'search': SearchTem,
  'blank': BlankTem,
  'line': LineTem,
  'video': VideoTem,
  'member': MemberTem,
  'order': OrderTem,
  'list': ListTem,
  'morelist': morelistTem,
  advertise,
}

export default Vue.component('diy-item', {
  render (h) {
    return h(items[this.type], { props: { options: this.options } });
  },
  props: ['type', 'options']
})