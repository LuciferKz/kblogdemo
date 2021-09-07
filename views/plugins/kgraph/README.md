kGraph
========
 
定制化实现流程绘制工具
 
特点
--------

- 基于antv g6的二次开发
 
安装
------------
 
    npm install kgraph
 
开始
------------

最简单的例子

    import kg from './kgraph'
    
    const graph = new kg.Graph()

配置项 / Options
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

    rubberhand 多个框选功能
    
### enableScroll
<span style="display: inline-block; background:#e6a23c; color: #FFF; padding: 2px 3px; border-radius: 3px;">boolean</span>

    滚动条, 默认true
    
### bgColor
<span style="display: inline-block; background:#fd8888; color: #FFF; padding: 2px 3px; border-radius: 3px;">string</span>

    画布背景色，默认#000

## 网格配置项 Options - Grid

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

---

## API

### Graph.addItem( type, options )
- 参数:
  - { String } type 节点类型
  - { Object } options 节点配置

- 用法: 
    
      const graph = new kg.Graph()
      const shape = {} // 参考式样配置
      const parentId = '' // 父级节点的ID
      graph.addItem('outline', {
          cfgKey: 'outline', // 配置对应的key
          x: 0, // 节点所处的X轴坐标
          y: 0, // 节点所处的Y轴坐标
          parent: parentId,
          ...shape
      })

### Graph.updateItem(item, options)
- 参数:
  - { Item } item 节点实例
  - { Object } options 节点配置

- 用法:

  item为新增完成的节点实例，options与addItem相同

### Graph.remove( Id )
- 参数:
  - { String } Id 节点ID
    
- 用法:
      
      const graph = new kg.Graph()
      const item = graph.addItem({})
      const id = item.get('id')
      graph.removeItem(id)

### Graph.abandonRemoveItem()

- 用法:
  阻止删除节点的操作，搭配beforeRemoveItem钩子使用

### Graph.clear()

- 用法:

  清空画布绘制内容

### Graph.clearData()

- 用法:

  清空画布数据

### Graph.getData()

- 用法:

  获取画布数据，可用于画布回显

### Graph.getBox()

- 用法:

  获取container的BoundingClientRect
  
### Graph.findById(ID)

- 用法:
  
  通过ID获取节点

### Graph.findShapeById(ID)

- 用法:

  通过ID获取Shape
 
### Graph.changeSize(width, height)

- 用法:

  改变画布容器大小

### Graph.getPointByClient(x, y)

- 用法 :
  
  通过x,y，获取窗口内的点

### Graph.getPointByClient(x, y)

- 用法 :
  
  通过x,y，获取画布内的点

### Graph.setAutoPaint( Flag )
- 参数: 
  - { Boolean } flag

- 用法: 
  
  是否自定绘制，addItem、updatePosition等操作会触发自动绘制
      
      graph.setAutoPaint(false)

### Graph.autoPaint()

- 用法:

  绘制一次画布

---

## 基础节点

节点类型
- Node // 各种 自己理解
- Edge // 线
- Anchor // 锚点

---

## Vue节点


### 组件 test
    <template>
        <div>{{ a }}</div>
    </template>
    <script></script>
    <style><style>
    

- 1.通过$vue.create创建vue对象，指定parent后插入，可以配合afterAddItem使用

        const graph = kg.Graph(options)
        
        graph.add({
            props: {
                vue: {
                    props: {
                        a: 1
                    }
                }
            }
        })
        
        graph.on('afterAddItem', item => {
            graph.$vue.create(Util.mix({ component: test }, item.get('props').vue, { parent: item }))
        })

- 2: node类型节点，配置vueComponent。

        const graph = kg.Graph(options)
            
        graph.add({
            component: test,
            props: {
                vue: {
                    props: {
                        a: 1
                    }
                }
            }
        })
    
## 注册节点

自定义节点类型

---

## 式样配置

    <!--节点的样式-->

    rect: {
        // 基础样式
        shape: {
          type: 'rect', // 形状
          size: [50, 50], // 宽高，circle只需要填一个
          style: { }, // 参考canvas的样式属性 lineWidth fill strokeStyle ..
        },
        
        // 节点不同状态下对应的样式
        stateShapeMap: {
          default: {
            type: 'rect',
            size: [50, 50],
            style: {
              stroke: '#00678a',
              fill: '#eee',
              lineWidth: 2,
            }
          },
          hover: {
            type: 'rect',
            size: [50, 50],
            style: {
              stroke: '#00678a',
              fill: '#000',
              lineWidth: 2,
            }
          }
        },
        
        // 自定义属性
        props: {
          key: 'start',
          value: 'Start'
        },
        
        
        anchorOffset: {}, // 锚点偏移
        
        anchorMatrix: [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]], // 锚点 matrix
        
        labelCfg: {
          content: '', // label内容
          
          offsetX: 0, // 相对偏移x 相对的是新增节点的中心坐标
          
          offsetY: 60, // 相对偏移y 相对的是新增节点的中心坐标
          
          style: {
            color: '#F00',
            size: '14px'
          },
          
          hidden: true // 是否显示label
        },
        event: true // 是否对节点绑定上所有画布事件
        
        eventArea: { r: 10 } // 节点的事件范围，不配置则以节点size作为事件范围
    }

---

## 事件监听
    
    /*
    * type: 参考下方事件列表及内置钩子
    * fn: 回调函数
    * 默认阻止一切冒泡
    */
    graph.on(type, fn)

## 事件触发
    
    /*
    * type: 参考下方事件列表及内置钩子
    */
    graph.emit(type)


### 全局事件

名称 | 说明 | 回调参数
---|---|---
click | 单击 | event
dblclick | 双击 | event
contextmenu | 右键菜单 | event
mousedown | 鼠标按下 | event
mouseup | 鼠标松开 | event
mouseenter | 鼠标移入 | event
mouseleave | 鼠标移出 | event
mousemove | 鼠标移动 | event
focus | 焦点在画布上 | event
blur | 焦点移出画布 | event

---

### 节点事件

名称 | 说明 | 回调参数
---|---|---
click | 单击 | event
dblclick | 双击 | event
contextmenu | 右键菜单 | event
mousedown | 鼠标按下 | event
mouseup | 鼠标松开 | event
mouseenter | 鼠标移入 | event
mouseout | 鼠标移出 | event
mouseover | 鼠标移入 | event
mousemove | 鼠标移动 | event
mouseleave | 鼠标移出 | event
dragstart | 拖拽开始 | event
dragend | 拖拽结束 | event
drag | 拖拽中 | event
dragenter | 拖拽进入 | event
dragleave | 拖拽离开 | event
drop | 放下 | event
focus | 聚焦在节点上 | event
blur | 焦点离开节点 | event

---

## 回调参数Event

名称 | 说明
---|---
type | 事件类型
origin | 原生event
items | 触发时间的节点列表
clientX | 画布中的绝对坐标X
clientY | 画布中的绝对坐标Y
target | 监听事件的节点对象

### 内置钩子

名称 | 说明 | 回调参数
---|---|---
beforeAddItem | 节点添加前 | config 配置参数
afterAddItem | 节点添加后 | item 节点
beforeAddShape | 图形添加前 | 
afterAddShape | 图形添加后 | 
beforeUpdateItem | 节点更新前 | item 节点 config 配置参数
afterUpdateItem | 节点更新后 | item 节点
beforeRemoveItem | 节点删除前 | item 作用节点
afterRemoveItem | 节点删除后 | item 已删节点
beforePaint | 流程绘制前 | 
afterPaint | 流程绘制后 |



[演示地址](http://demo.zhangzhenkai.com/views/plugins/kgraph/dist/index.html)

