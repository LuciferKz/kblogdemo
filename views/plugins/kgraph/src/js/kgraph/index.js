// import KGraphHistory from './khistory';
// import Toolbar from './modules/toolbar';
// import Sidebar from './modules/sidebar';
// import Footer from './modules/footer';
// // import Diagram from './modules/diagram';
// import Format from './modules/format';

// // import components from './components'
// import './kutil';
// import './kelement';

// const KGraph = function (config) {
//   let kg = this, graph = {}, 
//   fragment = $k(document.createDocumentFragment()), 
//   container = $k(config.container || document.getElementsByTagName('body')[0]),
//   diagram, toolbar, sidebar, format, footer;

//   const refs = {
//     container
//   };

//   let init = function () {
//     resizeContainer();
//     configGraph();
//     createToolBar();
//     createSideBar();
//     createDiagram();
//     createFooter();
//     // createFormat();
//     container.html('');
//     container.append(fragment);
//     container.addClass('kgraph-container');

//     container.on('mousedown', (e) => {
//       e.preventDefault();
//     })
//     container.on('mousemove', (e) => {
//       e.preventDefault();
//     })
//     container.on('contextmenu', (e) => {
//       e.preventDefault();
//     })
//     return new Promise(resolve => {
//       diagram.initCanvas();
//       toolbar.updateTools();
//       resolve()
//     })
//   }
//   let reboot = function () {
//     console.log('reboot');
//     diagram.reboot();
//   }
//   let set = function (name, value) {
//     graph[name] = value;
//   }
//   let resize = function () {
//     resizeContainer();
//     diagram.resizeCanvas();
//     diagram.draw();
//   }
//   let resizeContainer = function () {
//     container.css({ 
//       width: (kutil.isFunction(config.containerWidth) ? config.containerWidth() : config.containerWidth) + 'px',
//       height: (kutil.isFunction(config.containerHeight) ? config.containerHeight() : config.containerHeight) + 'px'
//     })
//   }
//   let configGraph = function () {
//     graph = {
//       refs: refs,
//       resize: resize,
//       updateToolbar: function () {
//         toolbar.updateTools();
//       },
//       updateFormat: function () {
//       },
//       updateDiagram: function () {
//         diagram.draw();
//       },
//       scaleChanged: function (scale) {
//         diagram.scaleChanged(scale);
//         footer.scaleChanged(scale);
//       },
//       directionChanged: function (dir) {
//         diagram.directionChanged(dir);
//         footer.directionChanged(dir);
//       },
//       message: function (options) {
//         alert(options.message);
//       },
//       $ghistory: new KGraphHistory()
//     }

//     // console.log(graph);
//     kg.graph = graph;
//   }
//   let createDiagram = function () {
//     diagram = new Diagram(graph, config.diagram);
//     kg.diagram = diagram;
//     fragment.append(diagram.container);
//   }
//   let createToolBar = function () {
//     toolbar = new Toolbar(graph, config.toolbar);
//     kg.toolbar = toolbar;
//     fragment.append(refs.toolbar);
//   }
//   let createSideBar = function () {
//     sidebar = new Sidebar(graph, config.sidebar);
//     kg.sidebar = sidebar;
//     fragment.append(sidebar.container);
//   }
//   let createFormat = function () {
//     format = new Format(graph);
//     fragment.append(format.container);
//   }
//   let createFooter = function () {
//     footer = new Footer(graph, config.footer);
//     kg.footer = footer;
//     diagram.container.append(footer.container);
//   }
//   kg.resize = resize;
//   kg.set = set;
//   kg.getState = function () {
//     return graph.$ghistory.currentState();
//   }
//   kg.Graph = Graph
//   kg.reboot = reboot;
//   kg.init = init;
// }

// export default KGraph;

import Graph from './graph';

const KGraph = {
  Graph
}

export default KGraph