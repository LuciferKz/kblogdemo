const getMonthDayCount = function (mon) {
  let curDate = new Date()
  curDate.setMonth(mon + 1)
  curDate.setDate(0)
  return curDate.getDate()
}

const moment = function (str) {
  let $D = str ? new Date(str) : new Date()

  return {
    startOf (type) {
      $D.setHours(0)
      $D.setMinutes(0)
      $D.setSeconds(0)
      $D.setMilliseconds(0)

      switch (type) {
        case 'year':
          $D.setMonth(0)
        case 'month':
          $D.setDate(1)
      }

      return this
    },
    endOf (type) {
      $D.setHours(23)
      $D.setMinutes(59)
      $D.setSeconds(59)
      $D.setMilliseconds(999)

      switch (type) {
        case 'year':
          $D.setMonth(11)
        case 'month':
          $D.setDate(getMonthDayCount(11))
      }

      return this
    },
    subtract (val, type) {
      let _year = $D.getFullYear()
      let _month = $D.getMonth()
      let _date = $D.getDate()

      switch(type) {
        case 'year':
          $D.setFullYear(_year - val)
          break;
        case 'month':
          $D.setMonth(_month - val)
          break;
        case 'week':
          $D.setDate(_date - 7 * 2)
          break;
        case 'date':
          $D.setDate(_date - val)
          break;
      }
      return this
    },
    add (val, type) {
      let _year = $D.getFullYear()
      let _month = $D.getMonth()
      let _date = $D.getDate()

      switch(type) {
        case 'year':
          $D.setFullYear(_year + val)
          break;
        case 'month':
          $D.setMonth(_month + val)
          break;
        case 'week':
          $D.setDate(_date + 7 * 2)
          break;
        case 'date':
          $D.setDate(_date + val)
          break;
      }
      return this
    },
    valueOf () {
      return $D.valueOf()
    },
    format (formatter) {
      let YEAR = $D.getFullYear()
      let MONTH = ('0' + ($D.getMonth() + 1)).substr(-2)
      let DATE = ('0' + $D.getDate()).substr(-2)
      let HOUR = ('0' + ($D.getHours())).substr(-2);
      let MINUTE = ('0' + ($D.getMinutes())).substr(-2);
      let SECOND = ('0' + ($D.getSeconds())).substr(-2);

      let matchs = {
        'Y+': YEAR,
        'M+': MONTH,
        'D+': DATE,
        'H+': HOUR,
        'm+': MINUTE,
        's+': SECOND,
      };

      let returnStr = formatter;
      for (let s in matchs) {
        returnStr = returnStr.replace(new RegExp(`(${s})`), matchs[s]);
      }
      return returnStr;
    }
  }
}

export default moment