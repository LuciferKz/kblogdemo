import $k from '../kelement';
import kutil from '../kutil';

const Footer = function (graph, config) {
  let container = kutil.newElement({ tag: 'div', props: { className: 'kgraph-footer-container' } })
  let refs = graph.refs;
  config = config || {};
  let init = function () {
    createDiagramScale();
    createGraphMode();
    config.hidden && container.hide();
  }
  let createDiagramScale = function () {
    kutil.newElement({
      tag: 'div',
      ref: 'diagramScale',
      props: { className: 'diagram-scale' },
      children: [{
        tag: 'div',
        props: { className: 'scale' },
        evts: {
          click: function () {
            console.log('click');
          }
        },
        children: [{
          tag: 'div',
          ref: 'scaleBar',
          props: { className: 'scale-bar' },
          style: { width: '50%' },
          children: [{
            tag: 'div',
            props: { className: 'scale-drag' }
          }]
        }]
      }, {
        tag: 'div',
        props: { className: 'zoom' },
        children: [{
          tag: 'div',
          ref: 'zoomOut',
          props: { className: 'scale-zoom-out iconfont icon-jian' }
        }, {
          tag: 'div',
          ref: 'scaleValue',
          props: { className: 'scale-value', innerHTML: '100%' }
        }, {
          tag: 'div',
          ref: 'zoomIn',
          props: { className: 'scale-zoom-in iconfont icon-jia' }
        }]
      }]
    }, refs)

    refs.zoomOut.on('click', () => {
      graph.$trigger('zoomout');
    });

    refs.zoomIn.on('click', () => {
      graph.$trigger('zoomin');
    });

    container.append(refs.diagramScale);
  }
  let createGraphMode = function () {
    kutil.newElement({
      tag: 'div',
      ref: 'fieldbar',
      props: { className: 'graph-mode vertical' },
      children: [{
        tag: 'div',
        ref: 'option1',
        props: { className: 'option option-hor' },
        children: [{
          tag: 'i',
          props: { className: 'iconfont icon-liucheng' }
        }, {
          tag: 'span',
          props: { innerHTML: '流程图（横向）' }
        }]
      }, {
        tag: 'i',
        props: { className: 'iconfont icon-qiehuan' }
      }, {
        tag: 'div',
        ref: 'option2',
        props: { className: 'option option-ver' },
        children: [
          {
            tag: 'i',
            props: { className: 'iconfont icon-liucheng' }
          }, {
            tag: 'span',
            props: { innerHTML: '流程图（纵向）' }
          }
        ]
      }]
    }, refs)
    refs.option1.on('click', () => {
      graph.$trigger('changeDir', 'horizontal');
    })
    refs.option2.on('click', () => {
      graph.$trigger('changeDir', 'vertical');
    })
    container.append(refs.fieldbar);
  }
  let scaleChanged = function (scale) {
    refs.scaleValue.html(Math.ceil(scale * 100) + '%');
    refs.scaleBar.css({ width: scale / 2 * 100 + '%' })
  }
  let directionChanged = function (dir) {
    refs.fieldbar.attrs({ class: 'graph-mode ' + dir })
  }
  init();
  return {
    container,
    scaleChanged,
    directionChanged
  }
}

export default Footer;