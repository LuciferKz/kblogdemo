
    let blue = '#007fb1',
    red = '#f9723e',
    green = '#56bb4c',
    yellow = '#f6c231';

    let flowControlData = [
      {
        id: 0,
        text: '开始',
        value: 'start',
        iconText: '&#xe6ec;',
        borderColor: yellow,
        iconColor: yellow,
        top: false,
        left: false,
        children: [5],
        dblclick: function () {
          console.log(this.text);
        }
      },
      {
        id: 1,
        text: '分支',
        value: 'branch',
        iconText: '&#xe655;',
        borderColor: yellow,
        iconColor: yellow,
        children: [3, 4, 5, 8],
      }, {
        id: 2,
        text: '结束',
        value: 'end',
        iconText: '&#xe66e;',
        borderColor: yellow,
        iconColor: yellow,
        bottom: false,
        right: false,
      }, 
      {
        id: 3,
        text: '等待',
        value: 'wait',
        iconText: '&#xe644;',
        children: [3, 4, 7],
      }, 
      {
        id: 4,
        text: '过滤',
        value: 'filter',
        iconText: '&#xe65b;',
        nochildren: [1, 2, 11, 4, 5],
      }, 
      {
        id: 5,
        text: '时间波次',
        value: 'time',
        iconText: '&#xe69d;'
      }
    ];

    let flowExecuteData = [
      {
        id: 6,
        text: '短信',
        value: 'sms',
        iconText: '&#xe648;',
      }, 
      {
        id: 7,
        text: '邮件',
        value: 'email',
        iconText: '&#xe6c6;',
      }, 
      {
        id: 8,
        text: '微信',
        value: 'wechat',
        iconText: '&#xe6ae;',
        borderColor: green,
        iconColor: green
      }, 
      {
        id: 9,
        text: '排除',
        value: 'paichu',
        iconText: '&#xe68b;',
      }, 
      {
        id: 10,
        text: '积分',
        value: 'integral',
        iconText: '&#xe66b;',
      }, 
      {
        id: 11,
        text: '人群',
        value: 'groups',
        iconText: '&#xe692;',
      }, 
      {
        id: 12,
        text: '优惠券发送',
        value: 'send-coupon',
        iconText: '&#xe64c;',
      }, 
      {
        id: 13,
        text: '优惠券生效',
        value: 'coupon-start',
        iconText: '&#xe69c;',
      }, 
      {
        id: 14,
        text: '优惠券过期',
        value: 'coupon-expired',
        iconText: '&#xe65d;',
      },
      {
        id: 15,
        text: '优惠券',
        value: 'coupon',
        iconText: '&#xe6c9;',
      }
    ];