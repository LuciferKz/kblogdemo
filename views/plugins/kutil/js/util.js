
var util = (function () {
  var Countdown = function(options) {
    var opt = { vm: null, totalSec: 300, resume: false };
    var assign = Object.assign;
    assign(opt, options);
    if (!opt.vm) {
      throw new Error("需要传入组件对象");
    }
    var vm = opt.vm,
      _interval = null,
      totalSec = opt.totalSec,
      currentSec,
      flag,
      subscribeKeys = {};
  
    var start = function(sec, isResume) {
      if (flag === true) return Promise.resolve(false);
      flag = true;
      currentSec = sec || totalSec;
      if (opt.remain && !isResume)
        localStorage.setItem("countdown.start", +new Date());
      dopublish(currentSec);
      return new Promise((resolve, reject) => {
        _interval = setInterval(() => {
          if (--currentSec === 0) {
            finish();
            resolve(); // 异步形式
          }
          dopublish(currentSec);
        }, 1000);
      });
    };
    
    var stop = function () {
      finish()
      dopublish(totalSec);
    }
  
    var formatNum = function(num) {
      return ("0" + num).substr(-2);
    };
    var format = function(sec) {
      return [Math.floor(sec / 60), sec % 60].map(formatNum).join(":");
    };
    var finish = function() {
      // 倒计时完成;
      flag = false;
      clearInterval(_interval);
      // 回调方法;
      options.callback && options.callback();
    };
    var dosubscribe = function(key, val) {
      subscribeKeys[key] = val;
    };
    var dopublish = function() {
      vm[subscribeKeys.flag] = flag;
      vm[subscribeKeys.remaintime] = format(currentSec);
    };
  
    if (opt.remain) {
      var startime = localStorage.getItem("countdown.start");
      typeof startime;
      if (startime) {
        var remainsec = totalSec - Math.floor((+new Date() - startime) / 1000);
        remainsec > 0
          ? start(remainsec, true)
          : localStorage.removeItem("countdown.start");
      }
    }
  
    return {
      start,
      stop,
      dosubscribe
    };
  };

  return {
    Countdown: Countdown,
  }
} ())