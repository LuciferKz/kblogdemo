import Util from './index'

const assign = function (target, source) {
  for (let name in source) {
    target[name] = source[name]
  }
}

const extend = function () {
  const args = Array.from(arguments)
  const target = args.shift()
  if (Object.assign) {
    Object.assign(target, ...args)
  } else {
    Util.each(args, source => {
      assign(target, source)
    })
  }
  return target
}

export default extend