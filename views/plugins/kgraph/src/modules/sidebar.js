import Util from '../util'
import newElement from '../util/dom/new-element'
import $k from '../util/dom'
import { nodeEvent } from '../global'

const Sidebar = function (graph, refs = {}) {
  let nodes = { list: [], maps: {} };
  let container = newElement({ tag: 'div', ref: 'sidebar', props: { className: 'kgraph-sidebar-container' } }, refs);
  
  let init = function () {
    newElement({
      tag: 'i',
      props: { className: 'button-open-sidebar iconfont icon-fenlei1' },
      ref: 'buttonOpenSlidebar',
      evts: {
        click: function () {
          container.removeClass('collapse');
          setTimeout(() => {
            graph.resize();
          }, 200);
        }
      }
    }, refs)

    container.append(refs.buttonOpenSlidebar);
  }

  let createSideNode = function (item) {
    let d = function (id, data) {
      this.isEdited = item.isEdited;
      Node.apply(this, [id, data]);
    }
    d.prototype = Object.create(Node.prototype);
    Object.assign(d.prototype, item);
    d.prototype.constructor = d
    return d
  }

  let createSection = function (title, items) {
    newElement({
      tag: 'div',
      props: { className: 'sidebar-section' },
      ref: 'sidebarSection',
      children: [{
        tag: 'div',
        props: { className: 'sidebar-section-title' },
        children: [{
          tag: 'i',
          props: { className: 'iconfont icon-fenlei1' },
          evts: {
            click: function () {
              container.addClass('collapse');
              setTimeout(() => {
                graph.resize();
              }, 200);
            }
          }
        }, {
          tag: 'span',
          props: { innerText: title }
        }]
      }, {
        tag: 'div',
        ref: 'seciontItems',
        props: { className: 'sidebar-section-items' }
      }]
    }, refs)
    items.forEach((item) => {
      createItem(refs.seciontItems, item);
    })
    container.append(refs.sidebarSection);
  }
  
  let createItem = function (container, item) {
    let sectionItem = newElement({
      tag: 'div',
      props: { className: 'sidebar-section-item item-'+ item.key },
      children: [{
        tag: 'i',
        ref: 'icontext',
        props: { className: 'iconfont', innerHTML: item.iconText }
      }, {
        tag: 'span',
        props: { innerText: item.text }
      }]
    }, refs)
    container.append(sectionItem);
    item.width = 140;
    item.height = 40;
    item.icon = refs.icontext.text();
    item.text = item.text;
    
    let d = createSideNode(item)
    nodes.list.push(d);
    nodes.maps[item.key] = d;
    addNodeEvt(item, sectionItem);
  }

  let addNodeEvt = function (item, dom) {
    let downPoint = {}
    let grabing = false
    let enter = false
    let dragNode
    let box = []
    let ratio = 1
    let scrollLeft = 0
    let scrollTop = 0

    let drag = function (e) {
      let clientX = e.clientX
      let clientY = e.clientY
      let pageX = e.pageX
      let pageY = e.pageY

      if (!grabing) {
        if (Math.abs(downPoint.x - clientX) > 10  || Math.abs(downPoint.y - clientY) > 10) {
          grabing = true;
          dragNode = createDragNode(item, downPoint.x, downPoint.y);
          refs.container.css('cursor', 'move')
        } else {
          return false;
        }
      }

      enter = clientX > box.l && clientX < box.r && clientY > box.t && clientY < box.b
      let scale = enter ? ratio : 1
      const translateX = clientX - downPoint.x
      const translateY = clientY - downPoint.y
      dragNode.css({ transform: 'translate('+ translateX +'px, '+ translateY +'px) scale('+ scale +')' })
    }

    let drop = function (e) {
      if (enter) {
        const point = graph.getPointByClient(e.clientX, e.clientY)
        graph.addItem('node', Util.extend(item.item, {
          x: point.x,
          y: point.y,
          label: item.text,
        }))
        graph.saveData()
      }
      refs.container.css('cursor', 'auto')
      if (dragNode) {
        dragNode.remove()
        dragNode = null
      }
      grabing = false
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
    }

    dom.on('mousedown', (e) => {
      if (e.which === 1) {
        downPoint.x = e.clientX;
        downPoint.y = e.clientY;

        box = graph.get('canvas').getBox()
        ratio = graph.get('canvas').get('ratio')

        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', drop)
      }
    });
  }
  
  let createDragNode = function (item, x, y) {
    let width = 0
    let height = 0
    const shape = item.item.shape
    if (shape.type === 'circle') {
      width = shape.size * 2
      height = shape.size * 2
    } else if (shape.type === 'rect' || shape.type === 'diamond') {
      width = shape.size[0]
      height = shape.size[1]
    }
    let dragNode = newElement({
      tag: 'div',
      style: {
        width: width + 'px',
        height: height + 'px',
        border: '1px dashed #333',
        position: 'absolute',
        left: (x - width / 2) + 'px',
        top: (y - height / 2) + 'px',
        zIndex: 999,
        transform: 'translate(0, 0)'
      }
    })
    $k('body').append(dragNode)
    return dragNode;
  }
  init();
  return {
    createSection: createSection,
  }
}

export default Sidebar;