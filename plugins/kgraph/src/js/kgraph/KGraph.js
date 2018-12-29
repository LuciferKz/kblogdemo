import $k from '../kelement';
import kutil from '../kutil';
import KGraphHistory from '../khistory';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Diagram from './Diagram';
import Format from './Format';

const KGraph = function (config) {
  let kg = this, graph = {}, 
  fragment = $k(document.createDocumentFragment()), 
  container = $k(config.container || document.getElementsByTagName('body')[0]),
  diagram, toolbar, sidebar, format, footer;

  let init = function () {
    resizeContainer();
    configGraph();
    createToolBar();
    createSideBar();
    createDiagram();
    createFooter();
    // createFormat();
    container.html('');
    container.append(fragment);
    container.addClass('kgraph-container');

    container.on('mousedown', (e) => {
      e.preventDefault();
    })
    container.on('mousemove', (e) => {
      e.preventDefault();
    })
    container.on('contextmenu', (e) => {
      e.preventDefault();
    })
    diagram.initCanvas();
    toolbar.updateTools();
  }
  let reboot = function () {
    console.log('reboot');
    diagram.reboot();
  }
  let set = function (name, value) {
    graph[name] = value;
  }
  let resize = function () {
    resizeContainer();
    diagram.resizeCanvas();
    diagram.draw();
  }
  let resizeContainer = function () {
    if (kutil.isFunction(config.containerWidth)) {
      container.css({ width: config.containerWidth() + 'px' })
    }
    if (kutil.isFunction(config.containerHeight)) {
      container.css({ height: config.containerHeight() + 'px' })
    }
  }
  let configGraph = function () {
    graph = {
      refs: {},
      resize: resize,
      updateToolbar: function () {
        toolbar.updateTools();
      },
      updateFormat: function () {
      },
      updateDiagram: function () {
        diagram.draw();
      },
      scaleChanged: function (scale) {
        diagram.scaleChanged(scale);
        footer.scaleChanged(scale);
      },
      directionChanged: function (dir) {
        diagram.directionChanged(dir);
        footer.directionChanged(dir);
      },
      message: function (options) {
        alert(options.message);
      },
      $ghistory: new KGraphHistory()
    }

    console.log(graph);
    kg.graph = graph;
  }
  let createDiagram = function () {
    diagram = new Diagram(graph, config.diagram);
    kg.diagram = diagram;
    fragment.append(diagram.container);
  }
  let createToolBar = function () {
    toolbar = new Toolbar(graph, config.toolbar);
    kg.toolbar = toolbar;
    fragment.append(toolbar.container);
  }
  let createSideBar = function () {
    sidebar = new Sidebar(graph, config.sidebar);
    kg.sidebar = sidebar;
    fragment.append(sidebar.container);
  }
  let createFormat = function () {
    format = new Format(graph);
    fragment.append(format.container);
  }
  let createFooter = function () {
    footer = new Footer(graph, config.footer);
    kg.footer = footer;
    diagram.container.append(footer.container);
  }
  kg.resize = resize;
  kg.set = set;
  kg.getState = function () {
    return graph.$ghistory.currentState();
  }
  kg.reboot = reboot;

  init();
  return kg;
}

export default KGraph;