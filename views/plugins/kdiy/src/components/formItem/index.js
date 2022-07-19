import Vue from 'vue';
// 通用组件
import selector from './selector'; // 选择器
import cardGift from './cardGift'; // 好友赠礼图片选择
import radioPanel from './radioPanel'; // 单选表单面板
// 表单组件
import letteringServece from './letteringServece'; // 商品编辑 -> 定制服务
import letteringConfig from './letteringConfig'; // 商品编辑 -> 定制卡片服务
import productPrice from './productPrice'; // 商品编辑 -> 商品价格
import memberDiscount from './memberDiscount'; // 商品编辑 -> 会员折扣
import letteringPrice from './letteringPrice'; // 运营 -> 刻字服务
import advertEditor from './advertEditor'; // 商品分类 -> 广告
import specEditor from '../specEditor'; // 商品规格 -> 规格
import postageConfig from './postageConfig'; // 商品编辑 -> 基本信息 -> 运费设置
import giftPanelEditor from './giftPanelEditor'; // 赠品营销 -> 满/选赠礼 -> 优惠设置
import giftConditionPanel from './giftConditionPanel'; // 赠品营销 -> 满/选赠礼 -> 优惠设置
import giftDatePicker from './giftDatePicker'; // 营销 -> 活动时间选择
import marketingPanelEditor from './marketingPanelEditor'; // 基本营销 -> 满减/折扣 -> 优惠设置
import useRule from './useRule'; // 全部优惠券 -> 使用规则 -> 使用条件
import useCoupon from './useCoupon'; // 全部优惠券 -> 使用规则 -> 优惠券限制
import useOrderRange from './useOrderRange'; // 营销-活动商品
import useStore from './useStore'; // 全部优惠券 -> 使用规则 -> 商品使用限制
import exUseStore from './exUseStore'; // 全部优惠券 -> 使用规则 -> 不商品使用限制
import imageLink from '../imageLink'; // 图片
import launchCondition from './launchCondition'; // 分享助力获取条件
import powerCondition from './powerCondition'; // 分享助力有奖
import templatePage from '../templatePage';
import inputLink from './inputLink';
import templateMessage from './templateMessage';

const Element = {
  selector,
  cardGift,
  radioPanel,
  productPrice,
  memberDiscount,
  letteringPrice,
  advertEditor,
  specEditor,
  postageConfig,
  giftPanelEditor,
  giftConditionPanel,
  giftDatePicker,
  marketingPanelEditor,
  useRule,
  useCoupon,
  useOrderRange,
  useStore,
  exUseStore,
  imageLink,
  launchCondition,
  powerCondition,
  templatePage,
  inputLink,
  templateMessage,
  letteringServece,
  letteringConfig
}

export default Vue.component('custom-item', {
  render(h) {
    const self = this;
    // console.log( Element[this.type] )
    return h(
      Element[this.type],
      {
        // attrs: this.attrs,
        props: {
          ...this.props,
          value: this.value,
        },
        on: {
          input(value) {
            console.log('custom-item input', value);
            self.$emit('input', value)
          },
          change(value) {
            self.onChange(value)
            self.$emit('change', value)
          },
          ...this.events
        },
        scopedSlots: {
          default: function () {
            return self.$slots.default
          }
        }
      },
    )
  },
  props: ['value', 'type', 'props'],
})