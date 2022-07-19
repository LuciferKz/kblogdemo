export const tools = [
  {
    'name': '基础组件',
    'tools':['member', 'order'],
    'collapse': false,
  },
  {
    'name': '商品类',
    'tools': ['shuanglieshangpin'],
    'collapse': false,
  }, {
    'name': '图文类',
    'tools': ['mofang', 'banner', 'imgGroup', 'doubleimgGroup', 'search', 'video', 'list'],
    'collapse': false,
  }
]

export const toolConfigs = {

  member: {
    type: 'member',
    name: '个人信息',
    icon: 'icon-huiyuan',
    limit: {
      max: 1,
      count: 0,
    },
    model: {
      member_color: "#f1f1f1",
      member_img: "",
      member_name: "1",
      member_level: "2",
      member_credit: "2",
      member_coupon: "2",
      member_review: "1",
      member_text: "",
      member_link: "",
    }
  },

  order: {
    type: 'order',
    name: '订单中心',
    icon: 'icon-shangpintubiaozu',
    limit: {
      max: 1,
      count: 0,
    },
    model: {
      order_num: 3,
      order_bg: "#fff",
      order_iconcolor: "#fff",
      order_textcolor: "#fff",
      order_badgecolor: "#fff",
      colorGroup: [],
    }
  },
  
  shuanglieshangpin: {
    type: 'shuanglieshangpin',
    name: '双列商品',
    icon: 'icon-shuanglieshangpin',
    limit: {
      max: 6,
      count: 0,
    },
    model: {
      choose: 'noauto',
      goods: ['goods_title','goods_price','goods_subtitle'],
      cart: 'cart_show',
      corset: 'cor_hide',
      colorGroup: []
    }
  },

  mofang: {
    type: 'mofang',
    name: '魔方',
    icon: 'icon-mofang',
    limit: {
      count: 0,
    },
    model: {
      combineLists: [],
    }
  },

  banner: {
    type: 'banner',
    name: '图片轮播',
    icon: 'icon-banner',
    limit: {
      count: 0,
    },
    model: {
      dot_isshow: "dot_show",
      dot_title:"轮播标题",
      span_isshow: 'span_hide',
      shadow_isshow: 'shadow_hide',
      dotIcon_isshow: "dotIcon_show",
      dot_type: "dot_rectangle",
      dot_position: "dot_inside",
      dot_color: "#fff",
      dotIcon_color: "#000",
      colorGroup: [],
    }
  },

  imgGroup: {
    type: 'imgGroup',
    name: '图片组',
    icon: 'icon-tupianzu',
    limit: {
      count: 0,
    },
    model: {
      udPadding:0,
      lrPadding:0,
      backColor:'#fff',
      colorGroup: [],
    }
  },

  doubleimgGroup: {
    type: 'doubleimgGroup',
    name: '多列图片组',
    icon: 'icon-shuanglietupian',
    limit: {
      count: 0,
    },
    model: {
      colorGroup: [],
      udPadding: 0,
      girdnum: '2',
      lrPadding: 0,
      backColor: '#fff'
    }
  },

  search: {
    type: 'search',
    name: '搜索',
    icon: 'icon-search',
    limit: {
      max: 1,
      count: 0,
    },
    model: {
      udPadding:6,
      lrPadding:3,
      search_bg:'#fff',
      search_border:'#f1f1f1',
      search_text:'#666',
      search_icon:'#666',
      textColor:'#666',
      search_keyalign:'1',
      search_key:'',
      key_show:'1',
      search_align:'1',
      search_style:'1',
      search_img:'',
      search_tips:'',
    }
  },

  video: {
    type: 'video',
    name:'视频',
    icon:'icon-shipin',
    limit: {
      count: 0,
    },
    model: {
      video_type:'1',
      video_style:'1',
      video_img:'',
      video_link:'',
    }
  },

  list: {
    type: 'list',
    name:'列表导航',
    icon:'icon-liebiaodaohang',
    limit: {
      count: 0,
    },
    model: {
      colorGroup: [],
    }
  },

  advertise: {
    type: 'advertise',
    name:'启动广告设置',
    model: {
      name: '',
      advertBackground: '#CCC',
      displaySetup: 1,
      displayPage: 1,
      isStart: 0,
      advertImages: [],
      intervalTime: 0,
      specifiedPage: '',
      startTime: ''
    }
  },
}

/**
 * tool 
 * 
 * name: 名称
 * 
 * icon: 图标
 * 
 * components: 组件
 * 
 * current: 现有数量
 * 
 * limit: 最大数量，不设为无上限
 * 
 * model: 部件可配置参数
 */