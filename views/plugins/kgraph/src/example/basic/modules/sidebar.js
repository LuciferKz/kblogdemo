import $k from '@/util/dom'
import newElement from '@/util/dom/new-element'
import { nodeCreateEvent } from '../js/kg.extend.js'

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
    props.key && nodeCreateEvent(item, sectionItem, graph)
    item.dom = sectionItem
    item.icon = item.cfgKey == 'image' ? refs.iconimg : refs.icontext.text();
    nodes.list.push(item)
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