kGraph
========
 
用的antv的算法，定制化实现流程绘制工具
 
特点
--------
 
- 快速使用
- 方便扩展
 
安装
------------
 
    npm install kgraph
 
开始
------------

最简单的例子

    import kg from './kgraph'
    
    const graph = new kg.Graph()

配置项
------------

### container
<span style="display: inline-block; background:#fd8888; color: #FFF; padding: 2px 3px; border-radius: 3px;">string</span> <span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">HTMLElement</span>

    选择器 or dom对象，默认body，设置则在指定容器内初始化组件。

### canvas
<span style="display: inline-block; background:#fd8888; color: #FFF; padding: 2px 3px; border-radius: 3px;">string</span> <span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">HTMLElement</span>

    选择器 or dom对象，不指定则默认生成一个canvas并插入容器中，宽高自适应容器大小

### width
<span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">number</span>

    宽度，默认撑满全屏

### height
<span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">number</span>

    高度，默认撑满全屏

### diagramWidth
<span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">number</span>

    绘图范围宽度，默认 800

### diagramHeight
<span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">number</span>

    绘图范围高度，默认 400

### fitcanvas
<span style="display: inline-block; background:#e6a23c; color: #FFF; padding: 2px 3px; border-radius: 3px;">boolean</span>

    绘图范围是否默认撑满画布。默认true。
    指定true时绘制范围小于画布的时候会撑满画布。
    指定false时绘制范围尺寸为指定高度宽度。
    

### originRatio
<span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">number</span>

    分辨率(较低值在高分辨率显示器下会模糊)，默认2

### enableRubberband
<span style="display: inline-block; background:#e6a23c; color: #FFF; padding: 2px 3px; border-radius: 3px;">boolean</span>

    rubberhand

## Grid

网格配置

### grid.show
<span style="display: inline-block; background:#e6a23c; color: #FFF; padding: 2px 3px; border-radius: 3px;">boolean</span>

    启用网格，默认false

### grid.align
<span style="display: inline-block; background:#e6a23c; color: #FFF; padding: 2px 3px; border-radius: 3px;">boolean</span>

    网格对齐，默认false

### grid.size
<span style="display: inline-block; background:#8fb9e4; color: #FFF; padding: 2px 3px; border-radius: 3px;">number</span>

    网格大小，默认10

