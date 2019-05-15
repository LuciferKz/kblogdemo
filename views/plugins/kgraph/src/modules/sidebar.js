import Util from '../util'
import newElement from '../util/dom/new-element'
import { getScrollLeft, getScrollTop } from '../util/scroll'
import canvas from '../canvas'
import $k from '../util/dom'

const Sidebar = function (refs = {}) {
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
    let area = []
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
          dragNode = createDRagNode(item, pageX - item.width / 2, pageY - item.height / 2);
          refs.container.css('cursor', 'move')
        } else {
          return false;
        }
      }
      
      let scale = clientX > area.l && clientX < area.r && clientY > area.t && clientY < area.b ? ratio : 1
      dragNode.css({ transform: 'translate('+ (clientX - downPoint.x) +'px, '+ (clientY - downPoint.y) +'px) scale('+ scale +')' })
    }

    let drop = function (e) {
      // if (!grabing) {
      //   graph.$trigger('insert', item.key, 'click');
      // } else {
      //   if (dragNode) {
      //     dragNode.remove();
      //     graph.$trigger('insert', item.key, 'drag', {}, { x: e.clientX - graph.cr.left + kutil.getScrollLeft(), y: e.clientY - graph.cr.top + kutil.getScrollTop() });
      //   }
      // }
      scrollLeft = getScrollLeft()
      scrollTop = getScrollTop()
      dragNode.remove();
      grabing = false;
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
    }

    dom.on('mousedown', (e) => {
      if (e.which === 1) {
        downPoint.x = e.clientX;
        downPoint.y = e.clientY;

        const cr = refs.canvas.dom.getBoundingClientRect()

        area = { l: cr.left, t: cr.top, r: cr.right, b: cr.bottom }

        ratio = canvas.getRatio()

        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', drop)
      }
    });
  }
  
  let createDRagNode = function (item, x, y) {
    let dragNode = newElement({
      tag: 'div',
      style: {
        width: item.width + 'px',
        height: item.height + 'px',
        border: '1px dashed #333',
        position: 'absolute',
        top: y + 'px',
        left: x + 'px',
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