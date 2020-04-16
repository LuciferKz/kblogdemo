const Footer = function (graph, config) {
  let refs = graph.refs;
  config = config || {};
  let container = kutil.newElement({ tag: 'div', ref: 'footer', props: { className: 'kgraph-footer-container' } }, refs);
  let init = function () {
    createDiagramScale();
    // createGraphMode();
    config.hidden && container.hide();
    config.modules && config.modules.forEach(m => m(refs, graph));
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
  let scaleChanged = function (scale) {
    refs.scaleValue.html(Math.ceil(scale * 100) + '%');
    refs.scaleBar.css({ width: scale / 2 * 100 + '%' })
  }
  let directionChanged = function (dir) {
    refs.fieldbar && refs.fieldbar.attrs({ class: 'graph-mode ' + dir })
  }
  init();
  return {
    container,
    scaleChanged,
    directionChanged
  }
}

export default Footer;