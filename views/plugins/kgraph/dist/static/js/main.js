!function(a){function t(t){for(var e,n,i=t[0],o=t[1],r=t[2],c=0,s=[];c<i.length;c++)n=i[c],l[n]&&s.push(l[n][0]),l[n]=0;for(e in o)Object.prototype.hasOwnProperty.call(o,e)&&(a[e]=o[e]);for(f&&f(t);s.length;)s.shift()();return h.push.apply(h,r||[]),u()}function u(){for(var t,e=0;e<h.length;e++){for(var n=h[e],i=!0,o=1;o<n.length;o++){var r=n[o];0!==l[r]&&(i=!1)}i&&(h.splice(e--,1),t=c(c.s=n[0]))}return t}var n={},l={0:0},h=[];function c(t){if(n[t])return n[t].exports;var e=n[t]={i:t,l:!1,exports:{}};return a[t].call(e.exports,e,e.exports,c),e.l=!0,e.exports}c.m=a,c.c=n,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)c.d(n,i,function(t){return e[t]}.bind(null,i));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="";var e=window.webpackJsonp=window.webpackJsonp||[],i=e.push.bind(e);e.push=t,e=e.slice();for(var o=0;o<e.length;o++)t(e[o]);var f=i;h.push([8,1]),u()}([function(t,e,n){"use strict";n.d(e,"d",function(){return i}),n.d(e,"e",function(){return s}),n.d(e,"a",function(){return c}),n.d(e,"c",function(){return o}),n.d(e,"b",function(){return r});var i=function(t){var e=this;e.id=kutil.guid(),e.state=1,kutil.extend(e,t),e.isShowCMButton=!0,e.isShowMenu=!1,e.cmenu=[]};i.prototype={borderColor:"#007fb1",bgColor:"#fff",textColor:"#333",iconColor:"#007fb1",top:!0,left:!0,bottom:!0,right:!0,init:function(t){this.dir=t,this.reset()},reset:function(){this.focusing=!1,this.entering=!1,this.grabing=!1},draw:function(){var t=this;t.drawRect(t.ctx),t.drawText(t.ctx),t.drawIcon(t.ctx),t.cmbutton&&t.isShowCMButton&&t.cmbutton.draw(),(t.entering||t.grabing||t.focusing)&&t.drawOutline(t.ctx),t.grabing&&t.drawDragDNode(t.ctx)},drawRect:function(t){var e=this;t.save(),t.fillStyle=e.bgColor,t.fillRect(e.x,e.y,e.width,e.height),t.fillStyle=!1===e.isEdited?"#999":e.borderColor,t.fillRect(e.x,e.y,6,e.height),t.restore()},drawRoundedRect:function(t){var e=this.getPoint(this.x+t,this.y),n=this.getPoint(this.x+this.width,this.y),i=this.getPoint(this.x+this.width,this.y+this.height),o=this.getPoint(this.x,this.y+this.height),r=this.getPoint(this.x,this.y),c=this.ctx;c.strokeStyle="#f6c231",c.lineWidth=2,c.beginPath(),c.moveTo(e.x,e.y),c.arcTo(n.x,n.y,i.x,i.y,t),c.arcTo(i.x,i.y,o.x,o.y,t),c.arcTo(o.x,o.y,r.x,r.y,t),c.arcTo(r.x,r.y,e.x,e.y,t),c.stroke()},drawText:function(t){var e=this;t.save(),t.textBaseline="middle",t.font="bold 12px 黑体",t.fillStyle=!1===e.isEdited?"#999":e.textColor;var n=e.remark?12:e.height/2;if(t.fillText(e.text,e.x+35,e.y+n),e.remark){t.font="10px 黑体",t.fillText(e.remark,e.x+35,e.y+30)}t.restore()},drawIcon:function(t){var e=this;t.save(),t.textBaseline="middle",t.font="16px iconfont",t.fillStyle=!1===e.isEdited?"#999":e.iconColor;var n=e.remark?12:e.height/2;t.fillText(e.icon,e.x+14,e.y+n),t.restore()},drawOutline:function(t){var e=this;t.save(),t.setLineDash([4,4]),t.strokeStyle=!1===e.isEdited?"#999":e.borderColor,t.strokeRect(e.x-5,e.y-8,e.width+10,e.height+16),t.restore()},focus:function(){this.focusing=!0},blur:function(){this.focusing=!1,this.isShowMenu=!1},enter:function(){this.entering=!0},leave:function(){this.entering=!1},remove:function(){this.state=0},drop:function(){var e=this;e.grabing=!1,e.x=e.dragDNode.x,e.y=e.dragDNode.y,e.cmbutton&&e.cmbutton.follow(e),e.dragDNode=null,e.cmenuOffsetX=0,e.cmenuOffsetY=0,e.cmenu.forEach(function(t){t.follow(e,"drop")})},move:function(t,e){this.x=t,this.y=e},drag:function(){var t=this;(t.grabing=t).dragDNode={x:t.x,y:t.y}},moveDragDNode:function(t,e){t<0&&(t=0),e<0&&(e=0),this.dragDNode.x=t,this.dragDNode.y=e},drawDragDNode:function(t){t.save(),t.setLineDash([4,4]),t.lineWidth=2,t.strokeStyle="#333",t.strokeRect(this.dragDNode.x,this.dragDNode.y,this.width,this.height),t.restore()},getPoint:function(t,e){return{x:t,y:e}},showMenu:function(){this.isShowMenu=!0},showCMButton:function(){this.isShowCMButton=!0},hideCMButton:function(){this.isShowCMButton=!1}};var o=function(t,e){this.id=kutil.guid(),this.key=t,this.idx=e};o.prototype={r:15,width:30,height:30,init:function(t){},draw:function(){var t=this,e=t.ctx,n=t.r,i=t.cx,o=t.cy;e.beginPath(),e.strokeStyle="#ffbb05",e.fillStyle="#fff",e.arc(i,o,n,0,2*Math.PI),e.fill(),e.stroke(),t.drawIconText()},getPoint:function(t,e){return{x:t,y:e}},drawTitle:function(){var t=this,e=12*t.text.length+10,n=t.cx-e/2,i=t.y+t.height+10,o=t.getPoint(n+6,i),r=t.getPoint(n+e,i),c=t.getPoint(n+e,i+20),s=t.getPoint(n,i+20),a=t.getPoint(n,i),u=t.ctx;u.save(),u.beginPath(),u.moveTo(o.x,o.y),u.arcTo(r.x,r.y,c.x,c.y,6),u.arcTo(c.x,c.y,s.x,s.y,6),u.arcTo(s.x,s.y,a.x,a.y,6),u.arcTo(a.x,a.y,o.x,o.y,6),u.fillStyle="#EEE",u.fill(),u.textAlign="center",u.textBaseline="middle",u.font="12px 黑体",u.fillStyle="#333",u.fillText(t.text,n+e/2,i+10),u.restore()},drawIconText:function(){var t=this,e=t.ctx;e.save(),e.textBaseline="middle",e.textAlign="center",e.font="24px iconfont",e.fillStyle="#333",e.fillText(t.icon,t.x+t.width/2,t.y+t.height/2),e.restore()},follow:function(t,e){var n,i,o=this,r=o.idx,c=t.cmenu.length,s=t.cmenuOffsetX||0,a=t.cmenuOffsetY||0;"vertical"===t.dir?(n=t.x+t.width/2+s,i=t.y+t.height+20+a,n+=c%2?[-1,1][r%2]*Math.ceil(r/2)*45-15:[-1,1][r%2]*(15*Math.ceil((r+1)/2)+30*((1^r%2)+Math.floor(r/2)))-15*[-1,1][r%2]/2):"horizontal"===t.dir&&(n=t.x+t.width+40+s,i=t.y+t.height/2+a,i+=c%2?[-1,1][r%2]*Math.ceil(r/2)*45-15:[-1,1][r%2]*(15*Math.ceil((r+1)/2)+30*((1^r%2)+Math.floor(r/2)))-15*[-1,1][r%2]/2),o.x=n,o.y=i,o.cx=n+o.r,o.cy=i+o.r},setText:function(t){this.text=t},setIcon:function(t){this.icon=t},enter:function(){this.entering=!0},leave:function(){this.entering=!1}};var r=function(){this.id=kutil.guid()};r.prototype={width:12,height:12,r:6,init:function(t){this.follow(t),this.status=0<t.nextSiblings.length?1:0},draw:function(){var t=this.ctx,e=this.r,n=this.cx,i=this.cy;t.save(),t.beginPath(),t.strokeStyle="#333",t.arc(n,i,e,0,2*Math.PI),t.stroke(),t.beginPath(),t.moveTo(n-(e-2),i),t.lineTo(n+(e-2),i),t.stroke(),t.beginPath(),t.moveTo(n,i-(e-2)),t.lineTo(n,i+(e-2)),t.stroke(),t.restore()},follow:function(t){var e=this;e.cx=t.x+120,e.cy=t.y+t.height/2,e.x=e.cx-e.r,e.y=e.cy-e.r}};var c=function(t){var e=this;e.id=kutil.guid(),e.parentNode=null,e.state=1,e.connected=!1,kutil.extend(e,t),e.type="left"===e.position||"top"===e.position?"start":"end"};c.prototype={width:24,height:24,r:4,outlineR:12,init:function(){this.follow()},follow:function(){var t=this,e=t.parentNode;switch(t.position){case"top":t.cx=e.x+e.width/2,t.cy=e.y;break;case"left":t.cx=e.x,t.cy=e.y+e.height/2;break;case"bottom":t.cx=e.x+e.width/2,t.cy=e.y+e.height;break;case"right":t.cx=e.x+e.width,t.cy=e.y+e.height/2}t.x=t.cx-t.width/2,t.y=t.cy-t.height/2},setPosition:function(t){this.position=t,this.follow()},drawOutline:function(){var t=this.ctx;t.save(),t.strokeStyle="#c5e3ff",t.lineWidth=1,t.beginPath(),t.fillStyle="#c5e3ff",t.arc(this.cx,this.cy,this.outlineR,0,2*Math.PI),t.fill(),t.restore()},draw:function(){var t=this,e=t.ctx;e.save(),e.strokeStyle="#007fb1",e.lineWidth=1,e.beginPath(),t.connected?e.fillStyle="#007fb1":e.fillStyle="#FFFFFF",e.arc(t.cx,t.cy,t.r,0,2*Math.PI),e.closePath(),e.fill(),e.stroke(),e.restore()},remove:function(){this.state=0},connect:function(){this.connected=!0},disConnect:function(){this.connected=!1},isConnectable:function(){return!this.connected||"multiple"===this.parentNode.connectRule}};var s=function(t){var e=this;e.id=kutil.guid(),e.dir="vertical",e.state=1,kutil.extend(e,t),e.points=[],e.start=t.start,e.end=t.end};s.prototype={closePath:function(t){this.start?this.end=t:this.end&&(this.start=t)},move:function(t,e){var n=this;n.start?n.createPoints({x:n.start.cx,y:n.start.cy},{x:t,y:e}):n.end&&n.createPoints({x:t,y:e},{x:n.end.cx,y:n.end.cy})},connectPoints:function(){var t=this,e={x:t.start.cx,y:t.start.cy},n={x:t.end.cx,y:t.end.cy};t.createPoints(e,n)},createPoints:function(t,e){var n=this;n.points=[{x:t.x,y:t.y}],"vertical"===n.dir?e.y<t.y?(n.points.push({x:(e.x-t.x)/2+t.x,y:t.y}),n.points.push({x:(e.x-t.x)/2+t.x,y:e.y})):0<Math.abs(e.x-t.x)&&n.points.push({x:e.x,y:t.y}):"horizontal"===n.dir&&(t.x<e.x?(n.points.push({x:(e.x-t.x)/2+t.x,y:t.y}),n.points.push({x:(e.x-t.x)/2+t.x,y:e.y})):t.x>e.x&&(n.points.push({x:t.x,y:t.y-(t.y-e.y)/2}),n.points.push({x:e.x,y:t.y-(t.y-e.y)/2}))),n.points.push({x:e.x,y:e.y})},draw:function(){var n=this.ctx;n.beginPath(),n.strokeStyle="#a0d1e1",this.points.forEach(function(t,e){0===e?n.moveTo(t.x,t.y):n.lineTo(t.x,t.y)}),n.stroke()},remove:function(){this.state=0}}},,,,,function(t,e,n){"use strict";e.a=function(){var s,g=0,x=0,y=1,v={},m=null,b={},a=function(t,e){for(var n=t.changedTouches?t.changedTouches[0]:t,i=v[e],o=i.length-1,r=(n.clientX-g-m.left)/y,c=(n.clientY-x-m.top)/y,s=!1;-1<o;o--){var a=i[o],u=b[a];if(u){var l=u.evts[e];if(l){var h=u.x,f=u.y,d=u.r,p=u.b;if(h<r&&f<c&&r<d&&c<p){if("mouseleave"===e)continue;if("mouseenter"===e){if(u.enter){if(s){u.enter=!1,u.evts.mouseleave.fn.call(u.self,t);continue}break}u.enter=!0}else if(s)break;l.fn.call(u.self,t),l.opt.cancelBubble&&(s=!0)}else"mouseleave"===e&&u.enter&&(u.enter=!1,l.fn.call(u.self,t))}}}};return{init:function(t){s=t},setClientRect:function(t){m=t},setOffset:function(t,e){g=t,x=e},setScale:function(t){y=t},addEvent:function(t,e,n,i){var o,r=t,c=t.id;b[c]||(b[c]={self:t,x:r.x,y:r.y,r:r.x+r.width,b:r.y+r.height,width:r.width,height:r.height,enter:!1,evts:{}}),b[c].evts[e]={fn:n,opt:i||{}},v[e]?!~v[e].indexOf(c)&&v[e].push(c):(v[e]=[c],s.on("mouseenter"===(o=e)||"mouseleave"===o?"mousemove":o,function(t){v[e]&&v[e].length&&a(t,e)}))},clearEvent:function(){v={},b={}},updateEvent:function(t,e){var n=t;b[t.id]&&kutil.extend(b[t.id],{x:n.x,y:n.y,r:n.x+n.width,b:n.y+n.height,width:n.width,height:n.height})},moveEvent:function(t,e){for(var n in v){var i=v[n],o=i.indexOf(t.id);"unshift"===e?i.unshift(i.splice(o,1)[0]):i.push(i.splice(o,1)[0])}},delEvent:function(t){b[t.id]&&delete b[t.id]},handleEvent:a}}},,function(t,e){var n={guid:function(){for(var t=[],e="0123456789abcdef",n=0;n<16;n++)t[n]=e.substr(Math.floor(16*Math.random()),1);return t[3]="4",t[7]=e.substr(3&t[7]|8,1),t.join("")},newElement:function(t,e){var n=this,i=$k(document.createElement(t.tag));for(var o in e=e||{},t.attrs&&i.attrs(t.attrs),t.props&&i.props(t.props),t.style&&i.css(t.style),t.evts)i.on(o,t.evts[o]);return t.children&&t.children.forEach(function(t){i.append(n.newElement(t,e))}),t.ref&&(e[t.ref]=i),i},extend:function(t,e){if(Object.assign)Object.assign(t,e);else for(var n in e)t[n]=e},clone:function(t){var e={};return this.extend(e,t),e},sum:function(t,e){return(10*t+10*e)/10},minus:function(t,e){return(10*t-10*e)/10},isFunction:function(t){return"[object Function]"===Object.prototype.toString.call(t)}};window.kutil=n},function(t,e,n){"use strict";n.r(e);n(9),n(18),n(20);var o,y=function(){var e=[],n=-1;return{getStateId:function(){return n},getLength:function(){return e.length},saveState:function(t){-1<n&&(e=e.slice(0,n+1)),e.push(t),n++},clearStates:function(){e=[],n=-1},nextState:function(){return n=n+1<e.length-1?n+1:e.length-1,e[n]},prevState:function(){return e[n=-1<n-1?n-1:0]},currentState:function(){return e[n]}}},v=n(1),m=n(2),b=n(3),w=n(4),r=(n(6),n(7),"");document.addEventListener?o="addEventListener":document.attachEvent&&(o="attachEvent",r="on");var c=function(t,e,n,i){t[o](r+e,n,i)};function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var s="object"===("undefined"==typeof HTMLElement?"undefined":i(HTMLElement))?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"===i(t)&&1===t.nodeType&&"string"==typeof t.nodeName},a=function(t){this.dom=t};a.prototype={append:function(t){return this.dom.appendChild(t.dom),this},prepend:function(t){return this.dom.insertBefore(t.dom,this.dom.childNodes[0]),this},insertBefore:function(t){return t.dom.parentNode.insertBefore(this.dom,t.dom),this},remove:function(){return this.dom.parentNode&&this.dom.parentNode.removeChild(this.dom),this},css:function(t){for(var e in t)this.dom.style[e]=t[e];return this},addClass:function(t){return this.dom.classList.add(t),this},removeClass:function(t){return this.dom.classList.remove(t),this},show:function(){return this.dom.style.display="block",this},hide:function(){return this.dom.style.display="none",this},attrs:function(t){for(var e in t)this.dom.setAttribute(e,t[e]);return this},props:function(t){for(var e in t)this.dom[e]=t[e];return this},html:function(t){return t||""===t?(this.dom.innerHTML=t,this):this.dom.innerHTML},text:function(t){return t?(this.dom.textContent=t,this):this.dom.textContent},on:function(t,e,n){return c(this.dom,t,e,n),this},onWheel:function(t,e){return function(t,e,n){var i="wheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";c.apply(this,[t,i,function(t){e({originalEvent:t,target:t.target||t.srcElement,type:"wheel",deltaX:t.wheelDeltaX?-.025*t.wheelDeltaX:0,deltaY:t.wheelDelta?-.025*t.wheelDelta:t.deltaY||t.detail,preventDefault:function(){t.preventDefault?t.preventDefault:t.returnValue=!1}})},n])}(this.dom,t,e),this}},window.$k=function(t){return s(t)||t instanceof DocumentFragment?new a(t):new a(document.querySelector(t))};var u=function(t){var e,n,i,o,r=this,c={},s=$k(document.createDocumentFragment()),a=$k(t.container||document.getElementsByTagName("body")[0]),u={},l=function(){h(),e.resizeCanvas(),e.draw()},h=function(){a.css({width:(kutil.isFunction(t.containerWidth)?t.containerWidth():t.containerWidth)+"px",height:(kutil.isFunction(t.containerHeight)?t.containerHeight():t.containerHeight)+"px"})},f=function(){c={refs:u,resize:l,updateToolbar:function(){n.updateTools()},updateFormat:function(){},updateDiagram:function(){e.draw()},scaleChanged:function(t){e.scaleChanged(t),o.scaleChanged(t)},directionChanged:function(t){e.directionChanged(t),o.directionChanged(t)},message:function(t){alert(t.message)},$ghistory:new y},console.log(c),r.graph=c},d=function(){e=new w.a(c,t.diagram),r.diagram=e,s.append(e.container)},p=function(){n=new v.a(c,t.toolbar),r.toolbar=n,s.append(u.toolbar)},g=function(){i=new m.a(c,t.sidebar),r.sidebar=i,s.append(i.container)},x=function(){o=new b.a(c,t.footer),r.footer=o,e.container.append(o.container)};return r.resize=l,r.set=function(t,e){c[t]=e},r.getState=function(){return c.$ghistory.currentState()},r.reboot=function(){console.log("reboot"),e.reboot()},h(),f(),p(),g(),d(),x(),a.html(""),a.append(s),a.addClass("kgraph-container"),a.on("mousedown",function(t){t.preventDefault()}),a.on("mousemove",function(t){t.preventDefault()}),a.on("contextmenu",function(t){t.preventDefault()}),e.initCanvas(),n.updateTools(),r},l=[];l.push({tag:"i",props:{className:"iconfont icon-duanxinmoban btn-save-as-template",title:"保存为模板"},evts:{click:function(){alert("保存为模板")}}}),l.push({tag:"i",props:{className:"iconfont icon-zuobianjiantou btn-prev",title:"上一步"},evts:{click:function(){alert("上一步")}}}),l.push({tag:"i",props:{className:"iconfont icon-baocun btn-save",title:"保存"},evts:{click:function(){alert("保存")}}}),l.push({tag:"i",props:{className:"iconfont icon-shanchu btn-cancel",title:"取消"},evts:{click:function(){alert("取消")}}}),new u({container:document.getElementById("kgraph-container"),containerHeight:function(){return window.innerHeight},diagram:{dragable:!0,scroll:!1,horizontalAlign:"center",verticalAlign:"center",gridWidth:10,gridLineWidth:2,gridAlign:!0,direction:"horizontal",contextMenu:!0,diagramSize:"full",diagramWidth:1002,diagramHeight:802,verifyConnection:function(t,e){console.log("定制通用连接规则")},beforeInsertDNode:function(t,e,n){return console.log("插入节点前执行，根据返回的boolean值决定是否插入"),!0},afterInsertDNode:function(t,e){console.log("插入节点后执行")},afterCreatePath:function(t){console.log("完成一次连线后执行")}},toolbar:{modules:[function(t,e){var n=kutil.newElement({tag:"div",props:{className:"kgraph-tool-head"},style:{flex:1,justifyContent:"flex-end"},children:[{tag:"div",props:{className:"kgraph-handle-container"},children:l}]});t.toolbar.append(n)}],toolsConfig:{zoomin:{title:"Zoom In"}}},footer:{modules:[function(t,e){kutil.newElement({tag:"div",ref:"fieldbar",props:{className:"graph-mode vertical"},children:[{tag:"div",ref:"option1",props:{className:"option option-hor"},children:[{tag:"i",props:{className:"iconfont icon-liucheng"}},{tag:"span",props:{innerHTML:"流程图（横向）"}}]},{tag:"i",props:{className:"iconfont icon-qiehuan"}},{tag:"div",ref:"option2",props:{className:"option option-ver"},children:[{tag:"i",props:{className:"iconfont icon-liucheng"}},{tag:"span",props:{innerHTML:"流程图（纵向）"}}]}]},t),t.option1.on("click",function(){e.$trigger("changeDir","horizontal")}),t.option2.on("click",function(){e.$trigger("changeDir","vertical")}),t.footer.append(t.fieldbar)}]}}).sidebar.createSection("基础流程节点",[{key:"start",text:"开始",value:"start",iconText:"&#xe6ec;",evts:{dblclick:{cb:function(){alert("双击事件")}},click:{cb:function(){console.log("点击事件")}}},nextSiblings:["wait"],verifyConnection:function(t,e,n){}},{key:"wait",text:"等待",value:"wait",iconText:"&#xe644;"},{key:"time",text:"结束",value:"time",iconText:"&#xe69d;"}])},function(t,e){},,,,,,,,,function(t,e){},,function(t,e){}]);