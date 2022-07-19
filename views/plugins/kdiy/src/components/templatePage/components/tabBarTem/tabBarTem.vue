<style lang="less" scoped>
@import "./tabBarTem.less";
</style>

<template>
  <div class="tabs diyitem" style="min-height:100px;">
    <div class="tabs-content" v-for="(item,index) in colorGroup" :key="index">
      <div class="tabs-tab" v-if="colorGroup.length > 1 || colorGroup[0].tabs">
        <!-- <div class="tab-item" :style="{color:index == current ? tab_activetext : tab_text,background:index == current ? tab_activebg : tab_bg}" @click.stop="clickTab(index)" v-for="(item,index) in colorGroup" :key="index">{{item.tabs}}</div> -->
        <div class="tab-item" 
        :style="{border:'1px solid '+tab_activebg,color:barindex == index ? tab_activetext : tab_text,background:barindex == index ? tab_activebg : tab_bg}" 
        v-for="(baritem,barindex) in colorGroup" 
        :key="barindex">{{baritem.tabs}}</div>
      </div>
      <div class="tabsimg" v-for="(citem,cindex) in item.tabContent" :key="cindex">
        <div v-if="citem.type == 'img'">
          <img class="tabimg" :src="citem.tabImg" alt="">
        </div>
        <div v-else-if="citem.type == 'carsoule'" class="banner" :style="{height:citem.dot_position == 'dot_inside' ? '210px' : '240px'}">
          <Carousel
            dots="none"
            @on-change="changeSwiper"
            class="banneritem"
          >
            <CarouselItem v-for="(moreitem,moreindex) in citem.content" :key="moreindex">
              <div  class="carousel">
                <img class="tabimg"  v-if="moreitem.tabImg" :src="moreitem.tabImg"  alt>
                <img class="tabimg" v-else src="../../static/img/default_onegoods.jpg" alt>
              </div>
            </CarouselItem>
          </Carousel>
          <div class="dots" v-if="citem.dot_isshow == 'dot_show'">
            <div
              :class="[citem.dot_type]"
              v-for="(dotitem,dotindex) in citem.content"
              :style="{background:dotindex == currentId ? citem.dot_color : 'rgba(0,0,0,0.2)',margin:'0px 6px'}"
              :key="dotindex"
            ></div>
          </div>
          
          <div class="iconDot" v-if="citem.dotIcon_isshow == 'dotIcon_show'">
            <span class="icon iconfont icon-right icon-right-show" :style="{color:citem.dotIcon_color}"></span>
            <span class="icon iconfont icon-left icon-left-show" :style="{color:citem.dotIcon_color}"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["options"],
  data() {
    return {
      tab_bg:'#fff',
      tab_text:'#666',
      tab_activebg:'#fff',
      tab_activetext:'#FF0000',
      newOptions: {},
      current:0,
      currentId:0,
      colorGroup: [
        {
          tabs: "",
          tabContent: [
            { 
              tabImg:'',
              tabLink:'',
              type:'img'
            }
          ]
        }
      ]
    };
  },
  watch: {
    options() {
      let _this = this;
      _this.newOptions = _this.options;
      console.log('选项卡模板',_this.newOptions)
      _this.init(_this.newOptions);
    }
  },
  created() {
    let _this = this;
    _this.init(_this.options);
  },
  methods: {
    // 初始化
    init(options) {
      let _this = this;
      console.log('传送数据tabbar',options.colorGroup)
      if (JSON.stringify(options) == "{}") {
        _this.restore();
      } else {
        _this.tab_bg = options.tab_bg;
        _this.tab_text = options.tab_text;
        _this.tab_activebg = options.tab_activebg;
        _this.tab_activetext = options.tab_activetext;
        _this.colorGroup = options.colorGroup;
      }
    },
    // 点击tab
    clickTab(index){
      console.log(index)
      this.current = index
    },
    // 更换banner
    changeSwiper(oldvalue, value) {
      let _this = this;
      _this.currentId = value;
    },
    // 恢复初始
    restore() {
      let _this = this;
      _this.tab_bg = '#fff',
      _this.tab_text = '#666',
      _this.tab_activebg = '#fff',
      _this.tab_activetext = '#FF0000',
      _this.colorGroup = [
        {
          tabs: "",
          tabContent: [
            {
              tabImg:'',
              tabLink:'',
              type:'img'
            }
          ]
        }
      ]
    }
  }
};
</script>
