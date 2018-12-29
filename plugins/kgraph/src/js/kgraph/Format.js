import $k from '../kelement';
import kutil from '../kutil';

const FormatContainer = function (ft, title, style) {
  let refs = {};
  let container = kutil.newElement({
    tag: 'div',
    props: { className: style },
    children: [{
      tag: 'div',
      props: { className: 'format-title' },
      children: [{
        tag: 'i',
        props: { className: 'iconfont icon-fenlei1' }
      }, {
        tag: 'span',
        props: { innerText: title }
      }]
    }, {
      tag: 'div',
      ref: 'formatForm',
      props: { className: 'format-form' },
    }]
  }, refs)
  ft.container.append(container);
  return {
    clearForm: function () {
      refs.formatForm.html('');
    },
    append: function (node) {
      refs.formatForm.append(node);
    },
    show: function () {
      container.css({ display: 'block' })
    },
    hide: function () {
      container.css({ display: 'none' })
    }
  }
}
const Format = function (graph, config) {
  let ft = this;
  let refs = graph.refs;
  ft.container = kutil.newElement({
    tag: 'div',
    props: { className: 'kgraph-format-container' }
  })
  let canvasFormat, dnodeFormat;
  
  let init = function () {
    canvasFormat = new FormatContainer(ft, '画布属性', 'format-canvas-container');
    createCanvasFormat();
    dnodeFormat = new FormatContainer(ft, '节点属性', 'format-dnode-container');
    dnodeFormat.hide();
  };
  let createCanvasFormat = function () {
  };
  let createDNodeFormat = function () {
    kutil.newElement({
      tag: 'div',
      ref: 'fieldbar',
      props: { className: 'text-input-panel' },
      children: [{
        tag: 'div',
        props: { className: 'field-name' },
      },{
        tag: 'div',
        props: { className: 'field-value', innerHTML: '节点名称' },
        children: [{
          tag: 'input',
          ref: 'fieldInput',
          props: { type: 'text', value: graph.selectedDNode.text },
        }]
      }]
    }, refs)

    refs.fieldInput.on('input', () => {
      graph.selectedDNode.text = input.value;
      graph.updateDiagram();
    })

    refs.fieldInput.on('blur', () => {
      graph.$trigger('editText');
    })
  };
  let switchFormat = function () {
    if (graph.selectedDNode) {
      dnodeFormat.clearForm();
      dnodeFormat.show();
      canvasFormat.hide();
      createDNodeFormat();
    } else {
      dnodeFormat.hide();
      canvasFormat.clearForm();
      canvasFormat.show();
      createCanvasFormat();
    }
  };

  init();
  kutil.extend(ft, {
    switchFormat,
  })
}

export default FormatContainer;