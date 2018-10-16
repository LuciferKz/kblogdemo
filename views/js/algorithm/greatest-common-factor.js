var calFactor = (function() {
  'use strict'
  var arrFactors = [], arrNums = []

  var fnCalculate = (function f(x, y) {
    var boolTemp = x > y,
    nDivisor = boolTemp ? y : x, // 除数
    nDividend = boolTemp ? x : y, // 被除数
    nRemainder = nDividend % nDivisor // 余数

    if (nRemainder === 0) return nDivisor

    return f(nDivisor, nRemainder)
  })

  return function f() {
    if (arguments.length <= 1) {
      throw new Error('需要至少两个整数')
    }

    var args = Array.from(arguments)

    if (args.length === 2) {
      return fnCalculate(args[0], args[1])
    } else {
      arrFactors = []
      for (var i = 0; i < args.length - 1; i++) {
        arrFactors.push(fnCalculate(args[i], args[i+1]))
      }
      // console.log(arrFactors)
      return f.apply(null, arrFactors)
    }
  }
}())