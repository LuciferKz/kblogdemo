// import KGraph from './js/kgraph'
// import { DNode, Path, ConnectPoint, ConnectsMenuItem, ConnectsMenuButton } from './js/components'
// window.KGraph = KGraph;
// window.kcomponents = {
//   DNode, Path, ConnectPoint, ConnectsMenuItem, ConnectsMenuButton
// };

import Toolbar from './js/modules/toolbar';
import Sidebar from './js/modules/sidebar';
import Footer from './js/modules/footer';
import Format from './js/modules/format';

import kg from './js/kgraph'

const graph = new kg.Graph({
  /**
   * 画布容器
   */
  container: '#kgraph-container',
  /**
   * 画布宽度
   */
  width: 1000, 
  /**
   * 画布高度
   */
  height: 800
})