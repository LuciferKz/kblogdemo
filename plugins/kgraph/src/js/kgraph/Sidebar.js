import $k from '../kelement';
import kutil from '../kutil';
import { DNode } from '../components';

const Sidebar = function (graph, config) {
  let container = kutil.newElement({ tag: 'div', props: { className: 'kgraph-sidebar-container' } });
  let dnodes = { list: [], maps: {} };
  graph.sbdnodes = dnodes;
  config = config || {};
  let refs = graph.refs;
  let init = function () {
    kutil.newElement({
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
    config.hidden && container.hide();
  }
  let createSideDNode = function (item) {
    let d = function (id, data) {
      this.isEdited = item.isEdited;
      DNode.apply(this, [id, data]);
    }
    d.prototype = Object.create(DNode.prototype);
    Object.assign(d.prototype, item);
    d.prototype.constructor = d;
    return d;
  }
  let createSection = function (title, items) {
    kutil.newElement({
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
  };
  let createItem = function (container, item) {
    let sectionItem = kutil.newElement({
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
    
    let d = createSideDNode(item)
    dnodes.list.push(d);
    dnodes.maps[item.key] = d;
    addDNodeEvt(item, sectionItem);
  };
  let addDNodeEvt = function (item, dom) {
    let downPoint = {}, grabing = false, enter = false, dragDNode;

    let drag = function (e) {
      if (!grabing) {
        if (Math.abs(downPoint.x - e.clientX) > 10  || Math.abs(downPoint.y - e.clientY) > 10) {
          grabing = true;
          dragDNode = createDRagDNode(item, downPoint.x, downPoint.y);
        } else {
          return false;
        }
      }
      if (e.clientX > graph.clientRect.left && e.clientX < graph.clientRect.right
        && e.clientY > graph.clientRect.top && e.clientY < graph.clientRect.bottom) {
        if (!enter) {
          enter = true;
          dragDNode.css({ width: item.width * graph.scale + 'px', height: item.height * graph.scale + 'px' })
        }
      } else {
        if (enter) {
          enter = false;
          dragDNode.css({ width: item.width + 'px', height: item.height + 'px' })
        }
      }
      dragDNode.css({ transform: 'translate('+ (e.clientX - downPoint.x) +'px, '+ (e.clientY - downPoint.y) +'px)' })
    }

    let drop = function (e) {
      if (!grabing) {
        graph.$trigger('insert', item.key, 'click');
      } else {
        if (dragDNode) {
          dragDNode.remove();
          graph.$trigger('insert', item.key, 'drag', {}, { x: e.clientX - graph.clientRect.left, y: e.clientY - graph.clientRect.top });
        }
      }

      grabing = false;
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', drop)
    }

    dom.on('mousedown', (e) => {
      if (e.which === 1) {
        downPoint.x = e.clientX;
        downPoint.y = e.clientY;
        
        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', drop)
      }
    });
  };
  let createDRagDNode = function (item, x, y) {
    let dragDNode = kutil.newElement({
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
    $k('body').append(dragDNode)
    return dragDNode;
  }
  init();
  return {
    container: container,
    createSection: createSection,
  }
}

export default Sidebar;