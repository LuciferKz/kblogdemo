let validate = function (data) {
  let msg = '';
  data.currentTemplate.some(widget => {
    msg = validator[widget.components](widget);
    return msg;
  })
  return msg;
}

const validator = {
  'shuanglieshangpin': function (data) {
    if (!data.colorGroup.length) {
      return '双列商品未选择商品！';
    }
  },
  'mofang': function () {
    
  },
  'banner': BannerConfig,
  'imgGroup': ImgConfig,
  'doubleimgGroup': DoubleImgConfig,
  'search': SearchConfig,
  'video': VideoConfig,
  'member': MemberConfig,
  'order': OrderConfig,
  'list': ListConfig,
}

export default validate;