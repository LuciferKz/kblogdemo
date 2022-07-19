<style lang="less" scoped>
@import "./memberTem.less";
</style>

<template>
  <!-- <div
    class="member diyitem"
    :style="{background: options.member_img ? 'url('+ options.member_img +')' : options.member_color,'background-size':'cover','background-position':'center'}"
  >
    <div class="member-avatar">
      <img src="../../assets/images/people.png" class="icon-member" alt>
    </div>
    <div class="member-info">
      <div class="info-item" v-if="options.member_name == '1'">
        <div class="item-label">用户昵称</div>
      </div>
      <div class="info-item" v-if="options.member_level == '1'">
        <div class="item-label">会员等级：</div>
      </div>
      <div class="info-item" v-if="options.member_credit == '1'">
        <div class="item-label">会员积分：</div>
      </div>
    </div>
    <div class="member-review">{{ options.member_review == '1' ? options.member_text ? options.member_text : '修改信息>' : ''}}</div>
  </div> -->
  <div class="member-box" :style="{height: options.member_level == '1'||options.member_credit == '1'||options.member_coupon == '1'?'185px':'100px'}">
    <div class="header-box"  :style="{background: options.member_img ? 'url('+ options.member_img +')' : options.member_color,'background-size':'cover','background-position':'center'}">
      <div class="member-header">
        <div class="member-avatar">
          <img src="../../assets/images/people.png" class="icon-member" alt>
        </div>
        <div class="member-name" v-if="options.member_name == '1'">
          <div class="item-label">用户昵称</div>
        </div>
        <div class="member-review">{{ options.member_review == '1' ? options.member_text ? options.member_text : '修改信息>' : ''}}</div>
      </div>
    </div>
    <div class="member-info" v-if="options.member_level == '1'||options.member_credit == '1'||options.member_coupon == '1'">
      <div class="info-item" v-if="options.member_level == '1'">
        <div class="item-value">啤酒小白</div>
        <div class="item-label">会员等级</div>
      </div>
      <div class="info-item" v-if="options.member_credit == '1'">
        <div class="item-value">124</div>
        <div class="item-label">积分</div>
      </div>
      <div class="info-item" v-if="options.member_coupon == '1'">
        <div class="item-value">73</div>
        <div class="item-label">优惠券</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
};
</script>
