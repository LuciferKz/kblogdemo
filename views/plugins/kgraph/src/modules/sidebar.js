import $k from '../util/dom'
import newElement from '../util/dom/new-element'

const Sidebar = function(selector, graph, refs = {}) {
  let container = $k(selector)
  let nodes = { list: [], maps: {} }
  let createSection = function(title, items) {
    newElement(
      {
        tag: 'div',
        props: { className: 'sidebar-section' },
        ref: 'sidebarSection',
        children: [
          {
            tag: 'div',
            props: { className: 'sidebar-section-title open' },
            ref: 'sectionTitle',
            children: [
              {
                tag: 'i',
                props: { className: 'iconfont icon-fenlei1' },
                evts: {
                  click: function() {
                    container.addClass('collapse')
                    setTimeout(() => {
                      graph.resize()
                    }, 200)
                  }
                }
              },
              {
                tag: 'span',
                props: { innerText: title }
              }
            ]
          },
          {
            tag: 'div',
            ref: 'seciontItems',
            props: { className: 'sidebar-section-items' }
          }
        ]
      },
      refs
    )
    const sectionTitle = refs.sectionTitle
    const sectionItems = refs.seciontItems
    sectionTitle.on('click', function(e) {
      sectionItems.toggle()
      sectionTitle.toggleClass('open')
    })
    items.forEach(item => {
      createItem(refs.seciontItems, item)
    })
    container.append(refs.sidebarSection)
  }

  let createItem = function(container, item) {
    let props = item.props || {}
    let icon = null
    if (item.cfgKey == 'image') {
      icon = {
        tag: 'img',
        ref: 'iconimg',
        props: { className: 'iconfont' },
        attrs: { src: props.iconImage },
        style: { width: '22px', height: '22px' }
      }
    } else {
      icon = {
        tag: 'i',
        ref: 'icontext',
        props: { className: 'iconfont', innerHTML: props.iconText }
      }
    }
    let sectionItem = newElement(
      {
        tag: 'div',
        props: { className: 'sidebar-section-item item-' + props.key + ' shape-' + item.cfgKey },
        children: [
          {
            tag: 'div',
            props: {
              className: props.key ? 'icon-wrap icon-wrap-' + props.key : ''
            },
            children: [icon]
          },
          {
            tag: 'span',
            props: { innerText: item.label ? item.label : '' }
          }
        ]
      },
      refs
    )
    container.append(sectionItem)
    props.key && addNodeEvt(item, sectionItem)
    item.dom = sectionItem
    item.icon = item.cfgKey == 'image' ? refs.iconimg : refs.icontext.text();
    nodes.list.push(item)
  }

  let addNodeEvt = function(item, dom) {
    let downPoint = {}
    let grabing = false
    let enter = false
    let dragNode
    let box = []
    let ratio = 1
    let pagePoint = {}

    let drag = function(e) {
      let clientX = e.clientX
      let clientY = e.clientY
      let pageX = e.pageX
      let pageY = e.pageY

      if (!grabing) {
        if (
          Math.abs(downPoint.x - clientX) > 10 ||
          Math.abs(downPoint.y - clientY) > 10
        ) {
          grabing = true
          // 画布外落点处新建 pageX和pageY
          dragNode = createDragNode(item, pagePoint.x, pagePoint.y)
          $k('body').css('cursor', 'move')
        } else {
          return false
        }
      }

      enter = clientX > box.l && clientX < box.r && clientY > box.t && clientY < box.b
      let scale = enter ? ratio : 1
      if (enter) {
        graph.$event.trigger(e)
      }
      const translateX = clientX - downPoint.x
      const translateY = clientY - downPoint.y
      dragNode.css({
        transform:
          'translate(' +
          translateX +
          'px, ' +
          translateY +
          'px) scale(' +
          scale +
          ')'
      })
    }

    let drop = function(e) {
      if (enter) {
        const point = graph.getPointByClient(e.clientX, e.clientY)
        item.x = point.x
        item.y = point.y
        const cfg = Object.assign({}, {
          cfgKey: item.cfgKey,
          props: item.props,
          shape: item.shape,
          label: item.label
        }, { x: point.x, y: point.y })

        if (item.cfgKey === 'image') {
          cfg.shape = { img: item.icon.dom }
        }
        const newNode = graph.addItem('node', cfg)
        const targetMap = graph.get('targetMap')
        const mouseenter = targetMap.mouseenter
        if (mouseenter) newNode.emit('drop', { origin: e, clientX: point.x, clientY: point.y, target: mouseenter })
        graph.saveData()
      }
      $k('body').css('cursor', 'auto')
      if (dragNode) {
        dragNode.remove()
        dragNode = null
      }
      grabing = false
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
    }

    dom.on('mousedown', e => {
      if (e.which === 1) {
        downPoint.x = e.clientX
        downPoint.y = e.clientY

        box = graph.get('canvas').getBox()
        ratio = graph.get('ratio')
        pagePoint.x = e.pageX
        pagePoint.y = e.pageY

        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', drop)
      }
    })
  }

  let createDragNode = function(item, x, y) {
    let width = 60
    let height = 60
    let dragNode = newElement({
      tag: 'div',
      style: {
        width: width + 'px',
        height: height + 'px',
        border: '1px dashed #333',
        position: 'absolute',
        left: x - width / 2 + 'px',
        top: y - height / 2 + 'px',
        zIndex: 9999,
        transform: 'translate(0, 0)'
      }
    })
    $k('body').append(dragNode)
    return dragNode
  }

  let filter = function(val) {
    nodes.list.forEach(node => {
      node.dom.show()
      if (node.label.indexOf(val) === -1) {
        node.dom.hide()
      }
    })
  }

  container.on('mousedown', e => {
    e.preventDefault()
  })
  container.on('mousemove', e => {
    e.preventDefault()
  })
  container.on('mouseup', e => {
    e.preventDefault()
  })

  return {
    createSection,
    filter
  }
}

export default Sidebar