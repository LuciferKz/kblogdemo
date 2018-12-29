let self = this;
let blue = '#007fb1',
red = '#f9723e',
green = '#56bb4c',
yellow = '#f6c231';

let flowControlData = [
  {
    key: 'start',
    text: '开始',
    value: 'start',
    iconText: '&#xe6ec;',
    borderColor: yellow,
    iconColor: yellow,
    top: false,
    left: false,
    children: ['time'],
    dblclick: function () {
      console.log(this.text);
    }
  },
  {
    key: 'time',
    text: '时间波次',
    value: 'time',
    iconText: '&#xe69d;',
    children: ['groups'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('时间波次',layerConfig.timeAttribute,layerConfig.timeConfig,layerConfig.timeRules,"360px")
    }
  },
  {
    key: 'branch',
    text: '分支',
    value: 'branch',
    iconText: '&#xe655;',
    borderColor: yellow,
    iconColor: yellow,
    connectRule: 'multiple',
    // ABTest、等待 、过滤、短信|微信|邮件|彩信|消息盒子、优惠券、积分、券获取提醒、券生效提醒、券过期提醒
    // children: ['abtest', 'wait', 'filter', 'sms', 'wechat', 'email', 'mmsms', 'messageBox', 'coupon', 'integral', 'sendCoupon', 'couponStart', 'couponExpired'],
    nochildren: ['start', 'time', 'branch', 'groups'],
  },
  {
    key: 'abtest',
    text: 'ABTest',
    value: 'abtest',
    iconText: '&#xe627;',
    // 等待 、短信|微信|邮件|彩信|消息盒子、优惠券、积分 、过滤
    // children: ['wait', 'sms', 'wechat', 'email', 'mmsms', 'messageBox', 'coupon', 'integral', 'filter'],
    nochildren: ['start', 'time', 'branch', 'abtest', 'end', 'groups', 'sendCoupon', 'couponStart', 'couponExpired'],
  },
  {
    key: 'wait',
    text: '等待',
    value: 'wait',
    iconText: '&#xe644;',
    connectRule: 'inherit',
    // 不能连接 ‘分支’/‘时间波次’/‘人群’/‘等待’/‘结束’/‘积分’
    nochildren: ['branch', 'time', 'groups', 'wait', 'end', 'integral'],
    verifyConnection: function (startPoint, endPoint) {
      console.log(startPoint, endPoint);
      // return '不能连接';
    },
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('等待',layerConfig.waitAttribute,layerConfig.waitConfig,layerConfig.waitRules,"250px")
    }
  },
  {
    key: 'filter',
    text: '过滤',
    value: 'filter',
    iconText: '&#xe65b;',
    // ??? 没懂
  }, 
  {
    key: 'end',
    text: '结束',
    value: 'end',
    iconText: '&#xe66e;',
    borderColor: yellow,
    iconColor: yellow,
    bottom: false,
    right: false,
  }
];

let flowExecuteData = [
  {
    key: 'groups',
    text: '人群',
    value: 'groups',
    iconText: '&#xe692;',
    // 分支、等待、过滤、微信、短信、邮件、彩信、消息盒子、积分、优惠券
    children: ['branch', 'wait', 'filter', 'wechat', 'sms', 'email', 'mmsms', 'messageBox', 'integral', 'coupon'],
  },
  {
    key: 'wechat',
    text: '微信',
    value: 'wechat',
    iconText: '&#xe6ae;',
    borderColor: green,
    iconColor: green,
    children: ['wait', 'end', 'filter'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('微信',layerConfig.wxAttribute,layerConfig.wxConfig,layerConfig.wxRules,"320px")
    }
  },
  {
    key: 'sms',
    text: '短信',
    value: 'sms',
    iconText: '&#xe648;',
    children: ['wait', 'end', 'filter'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('短信',layerConfig.smsAttribute,layerConfig.smsConfig,layerConfig.smsRules,"320px")
    }
  },
  {
    key: 'email',
    text: '邮件',
    value: 'email',
    iconText: '&#xe6c6;',
    children: ['wait', 'end', 'filter'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('邮件',layerConfig.emailAttribute,layerConfig.emailConfig,layerConfig.emailRules,"320px")
    }
  },
  {
    key: 'mmsms',
    text: '彩信',
    value: 'mmsms',
    iconText: '&#xe632;',
    children: ['wait', 'end', 'filter'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('短信',layerConfig.smsAttribute,layerConfig.smsConfig,layerConfig.smsRules,"320px")
    }
  },
  {
    key: 'messageBox',
    text: '消息盒子',
    value: 'message-box',
    iconText: '&#xe6bf;',
    children: ['wait', 'end', 'filter'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('短信',layerConfig.smsAttribute,layerConfig.smsConfig,layerConfig.smsRules,"320px")
    }
  },
  // {
  //   text: '排除',
  //   value: 'paichu',
  //   iconText: '&#xe68b;',
  //   dblclick: function () {
  //     console.log(this.text);
  //     self.commonPopup('去重',layerConfig.removalAttribute,layerConfig.removalConfig,layerConfig.removalRules,"200px")
  //   }
  // }, 
  {
    key: 'integral',
    text: '积分',
    value: 'integral',
    iconText: '&#xe66b;',
    children: ['wait', 'end', 'filter'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('积分',layerConfig.integralAttribute,layerConfig.integralConfig,layerConfig.integralRules,"240px")
    }
  }, 
  {
    key: 'coupon',
    text: '优惠券',
    value: 'coupon',
    iconText: '&#xe6c9;',
    children: ['wait', 'end', 'filter'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('优惠券',layerConfig.couponAttribute,layerConfig.couponConfig,layerConfig.couponRules,"250px")
    }
  },
  {
    key: 'sendCoupon',
    text: '券获取提醒',
    value: 'send-coupon',
    iconText: '&#xe6f8;',
    children: ['sms', 'wechat', 'email', 'messageBox'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('券获取提醒',layerConfig.sendAttribute,layerConfig.sendConfig,layerConfig.sendRules,"240px")
    }
  }, 
  {
    key: 'couponStart',
    text: '券生效提醒',
    value: 'coupon-start',
    iconText: '&#xe69c;',
    children: ['sms', 'wechat', 'email', 'messageBox'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('券生效提醒',layerConfig.effectiveAttribute,layerConfig.effectiveConfig,layerConfig.effectiveRules,"300px")
    }
  }, 
  {
    key: 'couponExpired',
    text: '券过期提醒',
    value: 'coupon-expired',
    iconText: '&#xe65d;',
    children: ['sms', 'wechat', 'email', 'messageBox'],
    dblclick: function () {
      console.log(this.text);
      self.commonPopup('券过期提醒',layerConfig.overdueAttribute,layerConfig.overdueConfig,layerConfig.overdueRules,"300px")
    }
  },
];
