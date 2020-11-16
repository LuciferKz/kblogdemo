const EVENT_MAP = [
  'click'
]

const ClientAnimation = function () {
  let pages = {}
  let events = {}
  
  const subsribe = function () {
    let widgetItem = null
    EVENT_MAP.forEach((evt) => {
      $k('#emulator').on(evt, (e) => {
        const type = e.type
        const target = $k(e.target)
        widgetItem = (target.hasClass('widget-item') || target.hasClass('tqo-emulator__page') ? target : target.parents('.widget-item')) || target.parents('.tqo-emulator__page')
        if (!widgetItem) return
        trigger(widgetItem.data('key'), type)
      })
    })

    let beginTime = 0
    let endTime = 0
    let startPoint = {}

    $k('#emulator').on('touchstart', (e) => {
      e.preventDefault()
      const target = $k(e.target)
      widgetItem = (target.hasClass('widget-item') || target.hasClass('tqo-emulator__page') ? target : target.parents('.widget-item')) || target.parents('.tqo-emulator__page')
      if (!widgetItem) return
      beginTime = Date.now()
      startPoint = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    })
    $k('#emulator').on('touchmove', (e) => {
      e.preventDefault()
    })
    $k('#emulator').on('touchend', (e) => {
      e.preventDefault()
      let endPoint = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
      if (Date.now() - beginTime > 1000) {
        return
      } else if (Math.abs(startPoint.x - endPoint.x) > 50 || Math.abs(startPoint.y - endPoint.y) > 50) {
        return
      } else {
        trigger(widgetItem.data('key'), 'click')
      }
    })
  }

  const listen = function (key, evt, fn) {
    const k = `${key}_${evt}`
    if (!events[k]) events[k] = []
    events[k].push(fn)
  }

  const offlisten = function (key, evt) {
    const k = `${key}_${evt}`
    if (events[k]) events[k] = []
  }

  const clear = function () {

  }

  const trigger = function (key, evt) {
    const k = `${key}_${evt}`
    if (!events[k]) return
    const args = [].slice.call(arguments, 1)
    events[k].forEach(fn => {
      fn.apply(this, args)
    })
  }
  
  const init = function (data) {
    console.log('init animation', data)
    events = {}
    pages = {}
    data.forEach(d => {
      const page = {}
      page.data = d
      page.el = $k(`[data-key="${d.id}"]`)
      pages[d.id] = page
      console.log(events, page)
      page.data.children.forEach((item) => {
        const animation = item.data.animation
        animation.forEach(keyframe => {
          keyframe.begins.forEach(begin => {
            listen(begin.target, begin.behavior, () => {
              startNode(item)
            })
          })
          // if (keyframe.type === 'buildin') {
          // } else {
          //   listen(begin.target, begin.behavior, () => {
          //     startNode(item)
          //   })
          //   // animation
          //   // console.log(transition)
          // }
        })
      })
    })
    subsribe()
  }
  
  const start = function (id) {
    trigger(id, 'enter')
  }

  const startNode = function (node) {
    const el = $k(`[data-key="${node.id}"]`)
    const animation = node.data.animation
    const queue = []
    if (animation && animation.length) {
      animation.forEach(keyframe => {
        if (keyframe.type === 'buildin') {
          queue.push(function (next) {
            el.addClass(keyframe.effect.from)
            setTimeout(() => {
              el.css('animation', keyframe.animation)
              el.on('animationend', () => {
                el.removeClass(keyframe.effect.from)
                el.css('animation', '')
                next()
              })
            }, 0)
          })
        } else {
          queue.push(function (next) {
            el.css('animation', keyframe.animation)
            el.on('animationend', () => {
              el.css('animation', '')
              next()
            })
          })
        }
      })
    }

    runQueue(queue)
  }

  const runQueue = function (queue) {
    const fn = queue.shift()
    fn(() => { if (queue.length > 0) runQueue(queue) })
  }

  return {
    init,
    start,
    startNode,
    trigger
  }
}