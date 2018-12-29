!function(n){var o={};function i(e){if(o[e])return o[e].exports;var t=o[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=n,i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t,n){"use strict";n.r(t);var i,r="";document.addEventListener?i="addEventListener":document.attachEvent&&(i="attachEvent",r="on");var a=function(e,t,n,o){e[i](r+t,n,o)};function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var c="object"===("undefined"==typeof HTMLElement?"undefined":o(HTMLElement))?function(e){return e instanceof HTMLElement}:function(e){return e&&"object"===o(e)&&1===e.nodeType&&"string"==typeof e.nodeName},s=function(e){this.dom=e};s.prototype={append:function(e){return this.dom.appendChild(e.dom),this},insertBefore:function(e){return e.dom.parentNode.insertBefore(this.dom,e.dom),this},remove:function(){return this.dom.parentNode&&this.dom.parentNode.removeChild(this.dom),this},css:function(e){for(var t in e)this.dom.style[t]=e[t];return this},addClass:function(e){return this.dom.classList.add(e),this},removeClass:function(e){return this.dom.classList.remove(e),this},show:function(){return this.dom.style.display="block",this},hide:function(){return this.dom.style.display="none",this},attrs:function(e){for(var t in e)this.dom.setAttribute(t,e[t]);return this},props:function(e){for(var t in e)this.dom[t]=e[t];return this},html:function(e){return e||""===e?(this.dom.innerHTML=e,this):this.dom.innerHTML},text:function(e){return e?(this.dom.textContent=e,this):this.dom.textContent},on:function(e,t,n){return a(this.dom,e,t,n),this},onWheel:function(e,t){return function(e,t,n){var o="wheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";a.apply(this,[e,o,function(e){t({originalEvent:e,target:e.target||e.srcElement,type:"wheel",deltaX:e.wheelDeltaX?-.025*e.wheelDeltaX:0,deltaY:e.wheelDelta?-.025*e.wheelDelta:e.deltaY||e.detail,preventDefault:function(){e.preventDefault?e.preventDefault:e.returnValue=!1}})},n])}(this.dom,e,t),this}};var g=function(e){return c(e)||e instanceof DocumentFragment?new s(e):new s(document.querySelector(e))},Ye={guid:function(){for(var e=[],t="0123456789abcdef",n=0;n<16;n++)e[n]=t.substr(Math.floor(16*Math.random()),1);return e[3]="4",e[7]=t.substr(3&e[7]|8,1),e.join("")},newElement:function(e,t){var n=this,o=g(document.createElement(e.tag));for(var i in t=t||{},e.attrs&&o.attrs(e.attrs),e.props&&o.props(e.props),e.style&&o.css(e.style),e.evts)o.on(i,e.evts[i]);return e.children&&e.children.forEach(function(e){o.append(n.newElement(e,t))}),e.ref&&(t[e.ref]=o),o},extend:function(e,t){if(Object.assign)Object.assign(e,t);else for(var n in t)e[n]=t},clone:function(e){var t={};return this.extend(t,e),t},sum:function(e,t){return(10*e+10*t)/10},minus:function(e,t){return(10*e-10*t)/10},isFunction:function(e){return"[object Function]"===Object.prototype.toString.call(e)}},v=function(){var t=[],n=-1;return{getStateId:function(){return n},getLength:function(){return t.length},saveState:function(e){-1<n&&(t=t.slice(0,n+1)),t.push(e),n++},clearStates:function(){t=[],n=-1},nextState:function(){return n=n+1<t.length-1?n+1:t.length-1,t[n]},prevState:function(){return t[n=-1<n-1?n-1:0]},currentState:function(){return t[n]}}},x=function(r,e){var t=Ye.newElement({tag:"div",props:{className:"kgraph-toolbar-container"}});e=e||{},Ye.extend(e,{tools:[{undo:{title:"撤销",enabled:!0},redo:{title:"重做",enabled:!0}},{copy:{title:"复制",enabled:!0,requireDNode:!0},paste:{title:"粘贴",enabled:!0,requireDNode:!0},delete:{title:"删除",enabled:!0,requireDNode:!0}},{zoomin:{title:"放大",enabled:!0},zoomout:{title:"缩小",enabled:!0},fitpagewidth:{title:"适应画布",enabled:!0},fitpage:{title:"实际尺寸",enabled:!0}},{tofront:{title:"前置",enabled:!0,requireDNode:!0},toback:{title:"后置",enabled:!0,requireDNode:!0}}]}),this.graph=r;var a={list:[],maps:{}},n=function(){var e=r.$ghistory.getStateId(),t=r.$ghistory.getLength();a.maps.undo.config.enabled=0<e,a.maps.redo.config.enabled=e<t-1},o=function(){var e=!!r.getSelectedDNode();a.maps.copy.config.enabled=e,a.maps.paste.config.enabled=e,a.maps.delete.config.enabled=e,a.maps.tofront.config.enabled=e,a.maps.toback.config.enabled=e},i=function(){a.list.forEach(function(e){e.config.enabled?e.dom.removeClass("disabled"):e.dom.addClass("disabled")})};return c=Ye.newElement({tag:"div",props:{className:"kgraph-toolbar"}}),e.tools.forEach(function(i,e){if(0!==e){var t=Ye.newElement({tag:"div",props:{className:"cut-off"}});c.append(t)}var n=function(e){var t=i[e];if(t.enabled){var n=Ye.newElement({tag:"div",props:{title:t.title,className:"iconfont icon-"+e+" disabled"},evts:{click:function(){if(!t.enabled)return!1;r.$trigger(e)}}}),o={name:e,config:t,dom:n};a.maps[o.name]=o,a.list.push(o),c.append(n)}};for(var o in i)n(o)}),t.append(c),e.header&&t.append(e.header),e.hidden&&t.hide(),{container:t,updateTools:function(){n(),o(),i()}};var c},d=function(e){var t=this;t.id=Ye.guid(),t.state=1,Ye.extend(t,e),t.isShowCMButton=!0,t.isShowMenu=!1,t.cmenu=[]};d.prototype={borderColor:"#007fb1",bgColor:"#fff",textColor:"#333",iconColor:"#007fb1",top:!0,left:!0,bottom:!0,right:!0,init:function(e){this.dir=e,this.reset()},reset:function(){this.focusing=!1,this.entering=!1,this.grabing=!1},draw:function(){var e=this;e.drawRect(e.ctx),e.drawText(e.ctx),e.drawIcon(e.ctx),e.cmbutton&&e.isShowCMButton&&e.cmbutton.draw(),(e.entering||e.grabing||e.focusing)&&e.drawOutline(e.ctx),e.grabing&&e.drawDragDNode(e.ctx)},drawRect:function(e){var t=this;e.save(),e.fillStyle=t.bgColor,e.fillRect(t.x,t.y,t.width,t.height),e.fillStyle=!1===t.isEdited?"#999":t.borderColor,e.fillRect(t.x,t.y,6,t.height),e.restore()},drawRoundedRect:function(e){var t=this.getPoint(this.x+e,this.y),n=this.getPoint(this.x+this.width,this.y),o=this.getPoint(this.x+this.width,this.y+this.height),i=this.getPoint(this.x,this.y+this.height),r=this.getPoint(this.x,this.y),a=this.ctx;a.strokeStyle="#f6c231",a.lineWidth=2,a.beginPath(),a.moveTo(t.x,t.y),a.arcTo(n.x,n.y,o.x,o.y,e),a.arcTo(o.x,o.y,i.x,i.y,e),a.arcTo(i.x,i.y,r.x,r.y,e),a.arcTo(r.x,r.y,t.x,t.y,e),a.stroke()},drawText:function(e){var t=this;e.save(),e.textBaseline="middle",e.font="bold 12px 黑体",e.fillStyle=!1===t.isEdited?"#999":t.textColor;var n=t.remark?12:t.height/2;if(e.fillText(t.text,t.x+35,t.y+n),t.remark){e.font="10px 黑体",e.fillText(t.remark,t.x+35,t.y+30)}e.restore()},drawIcon:function(e){var t=this;e.save(),e.textBaseline="middle",e.font="16px iconfont",e.fillStyle=!1===t.isEdited?"#999":t.iconColor;var n=t.remark?12:t.height/2;e.fillText(t.icon,t.x+14,t.y+n),e.restore()},drawOutline:function(e){var t=this;e.save(),e.setLineDash([4,4]),e.strokeStyle=!1===t.isEdited?"#999":t.borderColor,e.strokeRect(t.x-5,t.y-8,t.width+10,t.height+16),e.restore()},focus:function(){this.focusing=!0},blur:function(){this.focusing=!1,this.isShowMenu=!1},enter:function(){this.entering=!0},leave:function(){this.entering=!1},remove:function(){this.state=0},drop:function(){var t=this;t.grabing=!1,t.x=t.dragDNode.x,t.y=t.dragDNode.y,t.cmbutton&&t.cmbutton.follow(t),t.dragDNode=null,t.cmenuOffsetX=0,t.cmenuOffsetY=0,t.cmenu.forEach(function(e){e.follow(t,"drop")})},move:function(e,t){this.x=e,this.y=t},drag:function(){var e=this;(e.grabing=e).dragDNode={x:e.x,y:e.y}},moveDragDNode:function(e,t){e<0&&(e=0),t<0&&(t=0),this.dragDNode.x=e,this.dragDNode.y=t},drawDragDNode:function(e){e.save(),e.setLineDash([4,4]),e.lineWidth=2,e.strokeStyle="#333",e.strokeRect(this.dragDNode.x,this.dragDNode.y,this.width,this.height),e.restore()},getPoint:function(e,t){return{x:e,y:t}},showMenu:function(){this.isShowMenu=!0},showCMButton:function(){this.isShowCMButton=!0},hideCMButton:function(){this.isShowCMButton=!1}};var Ie=function(e,t){this.id=Ye.guid(),this.key=e,this.idx=t};Ie.prototype={r:15,width:30,height:30,init:function(e){},draw:function(){var e=this,t=e.ctx,n=e.r,o=e.cx,i=e.cy;t.beginPath(),t.strokeStyle="#ffbb05",t.fillStyle="#fff",t.arc(o,i,n,0,2*Math.PI),t.fill(),t.stroke(),e.drawIconText()},getPoint:function(e,t){return{x:e,y:t}},drawTitle:function(){var e=this,t=12*e.text.length+10,n=e.cx-t/2,o=e.y+e.height+10,i=e.getPoint(n+6,o),r=e.getPoint(n+t,o),a=e.getPoint(n+t,o+20),c=e.getPoint(n,o+20),s=e.getPoint(n,o),l=e.ctx;l.save(),l.beginPath(),l.moveTo(i.x,i.y),l.arcTo(r.x,r.y,a.x,a.y,6),l.arcTo(a.x,a.y,c.x,c.y,6),l.arcTo(c.x,c.y,s.x,s.y,6),l.arcTo(s.x,s.y,i.x,i.y,6),l.fillStyle="#EEE",l.fill(),l.textAlign="center",l.textBaseline="middle",l.font="12px 黑体",l.fillStyle="#333",l.fillText(e.text,n+t/2,o+10),l.restore()},drawIconText:function(){var e=this,t=e.ctx;t.save(),t.textBaseline="middle",t.textAlign="center",t.font="24px iconfont",t.fillStyle="#333",t.fillText(e.icon,e.x+e.width/2,e.y+e.height/2),t.restore()},follow:function(e,t){var n,o,i=this,r=i.idx,a=e.cmenu.length,c=e.cmenuOffsetX||0,s=e.cmenuOffsetY||0;"vertical"===e.dir?(n=e.x+e.width/2+c,o=e.y+e.height+20+s,n+=a%2?[-1,1][r%2]*Math.ceil(r/2)*45-15:[-1,1][r%2]*(15*Math.ceil((r+1)/2)+30*((1^r%2)+Math.floor(r/2)))-15*[-1,1][r%2]/2):"horizontal"===e.dir&&(n=e.x+e.width+40+c,o=e.y+e.height/2+s,o+=a%2?[-1,1][r%2]*Math.ceil(r/2)*45-15:[-1,1][r%2]*(15*Math.ceil((r+1)/2)+30*((1^r%2)+Math.floor(r/2)))-15*[-1,1][r%2]/2),i.x=n,i.y=o,i.cx=n+i.r,i.cy=o+i.r},setText:function(e){this.text=e},setIcon:function(e){this.icon=e},enter:function(){this.entering=!0},leave:function(){this.entering=!1}};var He=function(){this.id=Ye.guid()};He.prototype={width:12,height:12,r:6,init:function(e){this.follow(e),this.status=0<e.nextSiblings.length?1:0},draw:function(){var e=this.ctx,t=this.r,n=this.cx,o=this.cy;e.save(),e.beginPath(),e.strokeStyle="#333",e.arc(n,o,t,0,2*Math.PI),e.stroke(),e.beginPath(),e.moveTo(n-(t-2),o),e.lineTo(n+(t-2),o),e.stroke(),e.beginPath(),e.moveTo(n,o-(t-2)),e.lineTo(n,o+(t-2)),e.stroke(),e.restore()},follow:function(e){var t=this;t.cx=e.x+120,t.cy=e.y+e.height/2,t.x=t.cx-t.r,t.y=t.cy-t.r}};var We=function(e){var t=this;t.id=Ye.guid(),t.parentNode=null,t.state=1,t.connected=!1,Ye.extend(t,e),t.type="left"===t.position||"top"===t.position?"start":"end"};We.prototype={width:24,height:24,r:4,outlineR:12,init:function(){this.follow()},follow:function(){var e=this,t=e.parentNode;switch(e.position){case"top":e.cx=t.x+t.width/2,e.cy=t.y;break;case"left":e.cx=t.x,e.cy=t.y+t.height/2;break;case"bottom":e.cx=t.x+t.width/2,e.cy=t.y+t.height;break;case"right":e.cx=t.x+t.width,e.cy=t.y+t.height/2}e.x=e.cx-e.width/2,e.y=e.cy-e.height/2},setPosition:function(e){this.position=e,this.follow()},drawOutline:function(){var e=this.ctx;e.save(),e.strokeStyle="#c5e3ff",e.lineWidth=1,e.beginPath(),e.fillStyle="#c5e3ff",e.arc(this.cx,this.cy,this.outlineR,0,2*Math.PI),e.fill(),e.restore()},draw:function(){var e=this,t=e.ctx;t.save(),t.strokeStyle="#007fb1",t.lineWidth=1,t.beginPath(),e.connected?t.fillStyle="#007fb1":t.fillStyle="#FFFFFF",t.arc(e.cx,e.cy,e.r,0,2*Math.PI),t.closePath(),t.fill(),t.stroke(),t.restore()},remove:function(){this.state=0},connect:function(){this.connected=!0},disConnect:function(){this.connected=!1},isConnectable:function(){return!this.connected||"multiple"===this.parentNode.connectRule}};var je=function(e){var t=this;t.id=Ye.guid(),t.dir="vertical",t.state=1,Ye.extend(t,e),t.points=[],t.start=e.start,t.end=e.end};je.prototype={closePath:function(e){this.start?this.end=e:this.end&&(this.start=e)},move:function(e,t){var n=this;n.start?n.createPoints({x:n.start.cx,y:n.start.cy},{x:e,y:t}):n.end&&n.createPoints({x:e,y:t},{x:n.end.cx,y:n.end.cy})},connectPoints:function(){var e=this,t={x:e.start.cx,y:e.start.cy},n={x:e.end.cx,y:e.end.cy};e.createPoints(t,n)},createPoints:function(e,t){var n=this;n.points=[{x:e.x,y:e.y}],"vertical"===n.dir?t.y<e.y?(n.points.push({x:(t.x-e.x)/2+e.x,y:e.y}),n.points.push({x:(t.x-e.x)/2+e.x,y:t.y})):0<Math.abs(t.x-e.x)&&n.points.push({x:t.x,y:e.y}):"horizontal"===n.dir&&(e.x<t.x?(n.points.push({x:(t.x-e.x)/2+e.x,y:e.y}),n.points.push({x:(t.x-e.x)/2+e.x,y:t.y})):e.x>t.x&&(n.points.push({x:e.x,y:e.y-(e.y-t.y)/2}),n.points.push({x:t.x,y:e.y-(e.y-t.y)/2}))),n.points.push({x:t.x,y:t.y})},draw:function(){var n=this.ctx;n.beginPath(),n.strokeStyle="#a0d1e1",this.points.forEach(function(e,t){0===t?n.moveTo(e.x,e.y):n.lineTo(e.x,e.y)}),n.stroke()},remove:function(){this.state=0}};var y=function(s,e){var n=Ye.newElement({tag:"div",props:{className:"kgraph-sidebar-container"}}),a={list:[],maps:{}};s.sbdnodes=a,e=e||{};var c=s.refs,o=function(e,t){var n=Ye.newElement({tag:"div",props:{className:"sidebar-section-item item-"+t.key},children:[{tag:"i",ref:"icontext",props:{className:"iconfont",innerHTML:t.iconText}},{tag:"span",props:{innerText:t.text}}]},c);e.append(n),t.width=140,t.height=40,t.icon=c.icontext.text(),t.text=t.text;var o,i,r=(o=t,(i=function(e,t){this.isEdited=o.isEdited,d.apply(this,[e,t])}).prototype=Object.create(d.prototype),Object.assign(i.prototype,o),i.prototype.constructor=i);a.list.push(r),a.maps[t.key]=r,l(t,n)},l=function(n,e){var o,t={},i=!1,r=!1,a=function(e){if(!i){if(!(10<Math.abs(t.x-e.clientX)||10<Math.abs(t.y-e.clientY)))return!1;i=!0,o=u(n,t.x,t.y)}e.clientX>s.clientRect.left&&e.clientX<s.clientRect.right&&e.clientY>s.clientRect.top&&e.clientY<s.clientRect.bottom?r||(r=!0,o.css({width:n.width*s.scale+"px",height:n.height*s.scale+"px"})):r&&(r=!1,o.css({width:n.width+"px",height:n.height+"px"})),o.css({transform:"translate("+(e.clientX-t.x)+"px, "+(e.clientY-t.y)+"px)"})},c=function e(t){i?o&&(o.remove(),s.$trigger("insert",n.key,"drag",{},{x:t.clientX-s.clientRect.left,y:t.clientY-s.clientRect.top})):s.$trigger("insert",n.key,"click"),i=!1,document.removeEventListener("mousemove",a),document.removeEventListener("mouseup",e)};e.on("mousedown",function(e){1===e.which&&(t.x=e.clientX,t.y=e.clientY,document.addEventListener("mousemove",a),document.addEventListener("mouseup",c))})},u=function(e,t,n){var o=Ye.newElement({tag:"div",style:{width:e.width+"px",height:e.height+"px",border:"1px dashed #333",position:"absolute",top:n+"px",left:t+"px",zIndex:999,transform:"translate(0, 0)"}});return g("body").append(o),o};return Ye.newElement({tag:"i",props:{className:"button-open-sidebar iconfont icon-fenlei1"},ref:"buttonOpenSlidebar",evts:{click:function(){n.removeClass("collapse"),setTimeout(function(){s.resize()},200)}}},c),n.append(c.buttonOpenSlidebar),e.hidden&&n.hide(),{container:n,createSection:function(e,t){Ye.newElement({tag:"div",props:{className:"sidebar-section"},ref:"sidebarSection",children:[{tag:"div",props:{className:"sidebar-section-title"},children:[{tag:"i",props:{className:"iconfont icon-fenlei1"},evts:{click:function(){n.addClass("collapse"),setTimeout(function(){s.resize()},200)}}},{tag:"span",props:{innerText:e}}]},{tag:"div",ref:"seciontItems",props:{className:"sidebar-section-items"}}]},c),t.forEach(function(e){o(c.seciontItems,e)}),n.append(c.sidebarSection)}}},b=function(e,t){var n=Ye.newElement({tag:"div",props:{className:"kgraph-footer-container"}}),o=e.refs;t=t||{};var i=function(){Ye.newElement({tag:"div",ref:"fieldbar",props:{className:"graph-mode vertical"},children:[{tag:"div",ref:"option1",props:{className:"option option-hor"},children:[{tag:"i",props:{className:"iconfont icon-liucheng"}},{tag:"span",props:{innerHTML:"流程图（横向）"}}]},{tag:"i",props:{className:"iconfont icon-qiehuan"}},{tag:"div",ref:"option2",props:{className:"option option-ver"},children:[{tag:"i",props:{className:"iconfont icon-liucheng"}},{tag:"span",props:{innerHTML:"流程图（纵向）"}}]}]},o),o.option1.on("click",function(){e.$trigger("changeDir","horizontal")}),o.option2.on("click",function(){e.$trigger("changeDir","vertical")}),n.append(o.fieldbar)};return Ye.newElement({tag:"div",ref:"diagramScale",props:{className:"diagram-scale"},children:[{tag:"div",props:{className:"scale"},evts:{click:function(){console.log("click")}},children:[{tag:"div",ref:"scaleBar",props:{className:"scale-bar"},style:{width:"50%"},children:[{tag:"div",props:{className:"scale-drag"}}]}]},{tag:"div",props:{className:"zoom"},children:[{tag:"div",ref:"zoomOut",props:{className:"scale-zoom-out iconfont icon-jian"}},{tag:"div",ref:"scaleValue",props:{className:"scale-value",innerHTML:"100%"}},{tag:"div",ref:"zoomIn",props:{className:"scale-zoom-in iconfont icon-jia"}}]}]},o),o.zoomOut.on("click",function(){e.$trigger("zoomout")}),o.zoomIn.on("click",function(){e.$trigger("zoomin")}),n.append(o.diagramScale),i(),t.hidden&&n.hide(),{container:n,scaleChanged:function(e){o.scaleValue.html(Math.ceil(100*e)+"%"),o.scaleBar.css({width:e/2*100+"%"})},directionChanged:function(e){o.fieldbar.attrs({class:"graph-mode "+e})}}},Fe=function(){var t,m=0,g=0,v=1,x={},y=null,b={},n=function(e,t){for(var n=e.changedTouches?e.changedTouches[0]:e,o=x[t],i=o.length-1,r=(n.clientX-m-y.left)/v,a=(n.clientY-g-y.top)/v,c=!1;-1<i;i--){var s=o[i],l=b[s];if(l){var u=l.evts[t];if(u){var d=l.x,f=l.y,h=l.r,p=l.b;if(d<r&&f<a&&r<h&&a<p){if("mouseleave"===t)continue;if("mouseenter"===t){if(l.enter){if(c){l.enter=!1,l.evts.mouseleave.fn.call(l.self,e);continue}break}l.enter=!0}else if(c)break;u.fn.call(l.self,e),u.opt.cancelBubble&&(c=!0)}else"mouseleave"===t&&l.enter&&(l.enter=!1,u.fn.call(l.self,e))}}}};return{init:function(e){(t=e).on("mousedown",function(e){x.mousedown&&n(e,"mousedown")}),t.on("mousemove",function(e){x.mousemove&&n(e,"mousemove"),x.mouseleave&&n(e,"mouseleave"),x.mouseenter&&n(e,"mouseenter")}),t.on("dblclick",function(e){x.dblclick&&n(e,"dblclick")}),t.on("mouseup",function(e){x.mouseup&&n(e,"mouseup")})},setClientRect:function(e){y=e},setOffset:function(e,t){m=e,g=t},setScale:function(e){v=e},addEvent:function(e,t,n,o){var i=e,r=e.id;b[r]||(b[r]={self:e,x:i.x,y:i.y,r:i.x+i.width,b:i.y+i.height,width:i.width,height:i.height,enter:!1,evts:{}}),b[r].evts[t]={fn:n,opt:o||{}},x[t]?!~x[t].indexOf(r)&&x[t].push(r):x[t]=[r]},clearEvent:function(){x={},b={}},updateEvent:function(e,t){var n=e;b[e.id]&&Ye.extend(b[e.id],{x:n.x,y:n.y,r:n.x+n.width,b:n.y+n.height,width:n.width,height:n.height})},moveEvent:function(e,t){for(var n in x){var o=x[n],i=o.indexOf(e.id);"unshift"===t?o.unshift(o.splice(i,1)[0]):o.push(o.splice(i,1)[0])}},delEvent:function(e){b[e.id]&&delete b[e.id]},handleEvent:n}},w=function(l,u){var d,f,h,o,i,t=this,e=Ye.newElement({tag:"div",props:{className:"kgraph-diagram-container"}});t.graph=l,u=u||{};var n,r,a,c,p,s,m,g,v,x,y,b,w,E,N,S,C,k,D,P=0,T=0,M=!1,L=null,B=1,O=1,z=0,X=0,R=null,Y=null,I=new Fe,H=l.refs,W={createScrollContainer:function(){Ye.newElement({tag:"div",ref:"scrollContainer",props:{className:"scroll-container"},children:[{tag:"div",props:{className:"scroll-vertical-container"},children:[{tag:"div",ref:"scrollVerBar",props:{className:"scroll-bar"}}]},{tag:"div",props:{className:"scroll-horizontal-container"},children:[{tag:"div",ref:"scrollHorBar",props:{className:"scroll-bar"}}]}]},H),H.diagramDragLayer.onWheel(function(e){e.preventDefault(),(a||c)&&(a&&(P+=20*e.deltaY),c&&(T+=20*e.deltaX),W.triggerScroll())}),H.scrollVerBar.on("mousedown",function(e){W.mousedown(e,"vertical")}),H.scrollHorBar.on("mousedown",function(e){W.mousedown(e,"horizontal")}),H.scrollContainer.insertBefore(H.diagramDragLayer)},triggerScroll:function(){h-n<P?P=h-n:P<0&&(P=0),f-r<T?T=f-r:T<0&&(T=0),H.scrollVerBar.css({transform:"translate(0px, "+P+"px)"}),H.scrollHorBar.css({transform:"translate("+T+"px, 0px)"}),K(z=-T/f*(o*O),X=-P/h*(i*O)),Pe()},triggerScrollByOffset:function(){P=-X/(i*O)*h,T=-z/(o*O)*f,H.scrollVerBar.css({transform:"translate(0px, "+P+"px)"}),H.scrollHorBar.css({transform:"translate("+T+"px, 0px)"}),K(z,X)},resizeScrollBar:function(){h<i*O?(n=h*h/(i*O),H.scrollVerBar.css({height:n+"px"}),a=!0,H.scrollVerBar.show()):(a=!1,H.scrollVerBar.hide()),f<o*O?(r=f*f/(o*O),H.scrollHorBar.css({width:r+"px"}),c=!0,H.scrollHorBar.show()):(c=!1,H.scrollHorBar.hide())}},j=function(e){var t=W[e];W[e]=function(){u.scroll&&t()}};for(var F in W)j(F);Ye.extend(W,{downPoint:null,prevPoint:null,direction:"vertical",mousedown:function(e,t){W.direction=t,W.prevPoint={x:e.clientX,y:e.clientY},document.addEventListener("mousemove",W.mousemove),document.addEventListener("mouseup",W.mouseup)},mousemove:function(e){"vertical"===W.direction?P+=e.clientY-W.prevPoint.y:"horizontal"===W.direction&&(T+=e.clientX-W.prevPoint.x),W.triggerScroll(),W.prevPoint={x:e.clientX,y:e.clientY}},mouseup:function(e){document.removeEventListener("mousemove",W.mousemove),document.removeEventListener("mouseup",W.mouseup)}});var $={downPoint:{},mousedown:function(e){if($.downPoint.x=e.clientX-z,$.downPoint.y=e.clientY-X,!p)return!1;u.dragable&&document.addEventListener("mousemove",$.mousemove),document.addEventListener("mouseup",$.mouseup)},mousemove:function(e){z=e.clientX-$.downPoint.x,X=e.clientY-$.downPoint.y,I.setOffset(z,X),Pe()},mouseup:function(e){Q(null),u.dragable&&document.removeEventListener("mousemove",$.mousemove),document.removeEventListener("mouseup",$.mouseup)}},A=function(){b=[],w={},E=[],N={},S=[],C={},s=u.startX||60,m=u.startY||60,g=u.direction||"vertical","full"===u.diagramSize?(o=f,i=h):(o=u.diagramWidth||602,i=u.diagramHeight||802,z="left"===u.horizontalAlign?0:(f-o)/2<0?0:(f-o)/2,X="top"===u.verticalAlign?0:(h-i)/2<0?0:(h-i)/2),v=u.gridWidth||10,x=u.gridLineWidth||2,y=void 0===u.gridAlign||u.gridAlign,p=!0,t.diagramWidth=o,I.clearEvent()},V=function(){Ye.newElement({tag:"div",ref:"main",props:{className:"kgraph-diagram"},children:[{tag:"canvas",ref:"canvas",props:{id:"canvas"},style:{backgroundColor:"#f8fbfb"}},{tag:"div",ref:"diagramDragLayer",props:{className:"diagram-drag-layer"}}]},H),u.header&&e.append(u.header),W.createScrollContainer(),t.ctx=d=H.canvas.dom.getContext("2d"),q(),e.append(H.main)},q=function(){je.prototype.ctx=t.ctx,We.prototype.ctx=t.ctx,He.prototype.ctx=t.ctx,Ie.prototype.ctx=t.ctx},_=function(e){L=H.contextMenu,H.contextMenu.css({display:"block",left:e.clientX-k.left+"px",top:e.clientY-k.top+"px"})},J=function(){p=!0,L=null,H.contextMenu.hide()},K=function(e,t){z=e,X=t,I.setOffset(z,X)},G=function(){canvas.width=0,canvas.height=0,k=H.diagramDragLayer.dom.getBoundingClientRect(),o=o<f?f:o,i=i<h?h:i,l.clientRect=k,canvas.width=k.width,canvas.height=k.height,t.caWidth=f=k.width,h=k.height,W.resizeScrollBar(),I.setClientRect(k)},Q=function(e){R&&R!==e&&(R.blur(),oe(R,"del")),R=e,l.updateFormat(),l.updateToolbar(),Pe()},U=function(e){ee(e,"update"),te(e,"update"),ne(e,"update"),oe(e,"update")},Z=function(){p=!1,document.removeEventListener("mousemove",$.mousemove),document.removeEventListener("mouseup",$.mouseup)},ee=function(e,t){ie(e,t)},te=function(e,t){ce(e).forEach(function(e){ie(e,t)})},ne=function(e,t){if(!e.cmbutton)return!1;ie(e.cmbutton,t)},oe=function(e,t){e.cmenu.forEach(function(e){ie(e,t)})},ie=function(e,t){var n=t+"Event";I[n](e,"mouseenter"),I[n](e,"mousedown"),I[n](e,"mouseleave")},re=function(e,t,n,o){var i=l.sbdnodes.maps[e];if(!i)return console.error("未找到key: "+e+"对应的节点"),null;i.prototype.ctx=d;var r=new i(n||{});switch(r.key=e,t){case"click":var a=Se(r);r.move(a.x,a.y);break;case"copy":r.reset(),(Y=r).id=Ye.guid(),r.move(Y.x+v,Y.y+v);break;case"drag":if(y){var c=o.x-z,s=o.y-X;o.x=c<0?0:c-c%v,o.y=s<0?0:s-s%v}case"cmitem":r.move(o.x,o.y)}return b?b.push(r):b=[r],w[r.id]=r,Ee(r),"restore"===t||Ne({t:r.y,l:r.x,b:r.y+r.height,r:r.x+r.width})||(X=0<h-r.y-r.height-10?0:h-r.y-r.height-10,z=0<f-r.x-r.width-10?0:f-r.x-r.width-10,W.triggerScrollByOffset()),de(r),u.afterInsertDNode&&u.afterInsertDNode(r,B),B++,r},ae=function(e,t){t&&(e.position=t);var n=new We(e);n.init(),fe(n),S.push(n),C[n.id]=n},ce=function(t){return S.filter(function(e){return e.parentNode===t})},se=function(e){var t=new je(e);E.push(t),"multiple"!==(N[t.id]=t).start.parentNode.connectRule&&(t.start.parentNode.hideCMButton(),ne(t.start.parentNode,"del")),u.afterCreatePath&&u.afterCreatePath(t)},le=function(t){return E.filter(function(e){return e.start.parentNode===t||e.end.parentNode===t})},ue=function(t){return E.filter(function(e){return e.start===t||e.end===t})},de=function(o){var i={},r={},a=!1;o.init(g),o.nextSiblings&&(o.cmbutton=new He,o.cmbutton.init(o)),o.cmenu.length?o.cmenu.forEach(function(e){e.follow(o,"dnode init")}):o.nextSiblings&&o.nextSiblings.length&&(o.nextSiblings.forEach(function(e){var t=l.sbdnodes.maps[e];if(t){var n=new Ie(e,o.cmenu.length);n.setText(t.prototype.text),n.setIcon(t.prototype.icon),o.cmenu.push(n)}else console.error("找不到对应dnode",e)}),o.cmenu.forEach(function(e){e.follow(o,"dnode init")})),me(o);var c=function(e){if(Math.abs(i.x-e.clientX)<5&&Math.abs(i.y-e.clientY)<5)return!1;a=!0,o.drag();var t=e.clientX-i.x,n=e.clientY-i.y;y&&(t-=t%v,n-=n%v),o.moveDragDNode(r.x+ze(t),r.y+ze(n)),Pe()},s=function e(t){p=!0,document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",e),a?(a=!1,o.drop(),me(o),ce(o).forEach(function(e){e.follow()}),Ee(o),U(o),Pe(),De("drop dnode")):(Q(o),o.focus())};I.addEvent(o,"mouseenter",function(){H.diagramDragLayer.addClass("move"),o.enter(),Pe()},{cancelBubble:!0}),I.addEvent(o,"mousedown",function(e){var t,n;Z(),1===e.which?(t=e,i.x=t.clientX,i.y=t.clientY,r.x=o.x,r.y=o.y,document.addEventListener("mousemove",c),document.addEventListener("mouseup",s)):3===e.which&&u.contextMenu&&(Q(o),o.focus(),n=e,H.contextMenu||(Ye.newElement({tag:"div",ref:"contextMenu",props:{className:"diagram-context-menu"}},H),[{action:"delete",text:"删除"}].forEach(function(e){var t=Ye.newElement({tag:"div",props:{className:"context-menu-item",textContent:e.text}});t.on("mousedown",function(e){Xe("delete")}),H.contextMenu.append(t)}),document.addEventListener("mousedown",function(){L&&J()}),H.diagramDragLayer.append(H.contextMenu)),_(n),e.stopPropagation(),e.cancelBubble=!0)},{cancelBubble:!0}),I.addEvent(o,"mouseleave",function(){H.diagramDragLayer.removeClass("move"),o.leave(),Pe()}),o.dblclick&&I.addEvent(o,"dblclick",function(e){o.dblclick(e,o)}),o.cmbutton&&he(o)},fe=function(i){var n={},r=function(e){D.move(ze(e.pageX-k.left-z),ze(e.pageY-k.top-X)),Pe()},o=function e(t){M=!(p=!0);var n=xe({x:ze(t.pageX-k.left-z),y:ze(t.pageY-k.top-X)});if(n){var o=we(i,n);o?l.message({type:"error",message:o}):(D.closePath(n),se(D),i.connect(),n.connect(),De("add path"))}D=null,Pe(),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",e)};I.addEvent(i,"mouseenter",function(){H.diagramDragLayer.addClass("auto")}),I.addEvent(i,"mousedown",function(e){var t={dir:g};"start"===i.type?t.end=i:t.start=i,D=new je(t),M=!0,n.x=e.pageX,n.y=e.pageY,Z(),document.addEventListener("mousemove",r),document.addEventListener("mouseup",o)},{cancelBubble:!0}),I.addEvent(i,"mouseleave",function(){H.diagramDragLayer.removeClass("auto")})},he=function(t){I.addEvent(t.cmbutton,"mouseenter",function(){H.diagramDragLayer.addClass("pointer")}),I.addEvent(t.cmbutton,"mousedown",function(){t.showMenu(),t.cmenu.forEach(function(e){pe(t,e)}),Pe()}),I.addEvent(t.cmbutton,"mouseleave",function(){H.diagramDragLayer.removeClass("pointer")})},pe=function(i,e){I.addEvent(e,"mouseenter",function(){e.enter(),H.diagramDragLayer.addClass("pointer"),Pe()}),I.addEvent(e,"mousedown",function(){e.leave(),l.$trigger("insert",e.key,"cmitem",{},"vertical"===g?{x:i.x,y:i.y+i.height+60}:{x:i.x+i.width+60,y:i.y},function(e){var t=ce(i).slice(-1)[0],n=ce(e)[0],o=we(t,n);o?(l.message({type:"error",message:o}),l.$trigger("delete",e)):(se({start:t,end:n,dir:g}),t.connect(),n.connect(),De("add path and dnode"))}),H.diagramDragLayer.removeClass("pointer")},{cancelBubble:!0}),I.addEvent(e,"mouseleave",function(){H.diagramDragLayer.removeClass("pointer"),e.leave(),Pe()})},me=function(e){var t=ge(e);Ne(t)||ve(e,t)},ge=function(e){var t=e.cmenu.slice(-1)[0]||{},n=e.cmenu.slice(-2,-1)[0]||t,o=e.cmenu.length;return"horizontal"===g?o%2?{t:t.y,l:t.x,b:n.y+n.height,r:t.x+t.width}:{t:n.y,l:t.x,b:t.y+t.height,r:t.x+t.width}:"vertical"===g?o%2?{t:t.y,l:t.x,b:t.y+t.height,r:n.x+n.width}:{t:t.y,l:n.x,b:t.y+t.height,r:t.x+t.width}:void 0},ve=function(t,e){e.l<-z?t.cmenuOffsetX=z-e.l:e.r>-z+f&&(t.cmenuOffsetX=-z+f-e.r),i<e.b?i=e.b+90:e.t<-X?t.cmenuOffsetY=-X-e.t:e.b>-X+h&&(t.cmenuOffsetY=-X+h-e.b),t.cmenu.forEach(function(e){e.follow(t,"moveCMenuItems")})},xe=function(t){var n=null;return S.forEach(function(e){e.x-e.outlineR<t.x&&e.x+2*e.outlineR>t.x&&e.y-e.outlineR<t.y&&e.y+2*e.outlineR>t.y&&(n=e)}),n},ye=function(e,t){if("inherit"===e.connectRule){var n=le(e);n&&0<n.length&&(e=n[0]["start"===t?"end":"start"].parentNode)}return e},be=function(e){var n=null;return ce(e).find(function(e){if("start"===e.type){var t=ue(e);0<t.length&&(n=t[0].start.parentNode)}}),n},we=function(e,t){if(e.position===t.position)return"start"===e.type?"需要连接节点开始位置":"需要连接节点结束位置";var n,o;"end"===e.type?(n=e,o=t):"start"===e.type&&(n=t,o=e);var i=ye(n.parentNode,n.type),r=ye(o.parentNode,o.type),a=u.verifyConnection&&u.verifyConnection(n,o);if(a)return a;var c=i.nextSiblings;return c&&!~c.indexOf(r.key)?i.text+"节点只能连接"+c.map(function(e){return l.sbdnodes.maps[e]&&l.sbdnodes.maps[e].prototype.text}).join(",")+"节点":i.verifyConnection&&i.verifyConnection(i,i,r)||r.verifyConnection&&r.verifyConnection(r,i,r)},Ee=function(e){e.x>o-e.width-100&&(t.diagramWidth=o=e.x+e.width+100),e.y>i-100&&(i=e.y+e.height+100),W.resizeScrollBar()},Ne=function(e){return!(e.t<-X||e.l<-z||e.b+X>h||e.r+z>f)},Se=function(e){var t,n=s,o=m;if(u.dragable||u.scroll){var i=(t={x:0,y:0},Ce(function(e){"horizontal"===g?t.x=Math.max(t.x,e.x):"vertical"===g&&(t.y=Math.max(t.y,e.y))}),t);0<i.y?o=i.y+e.height+20:0<i.x&&(n=i.x+e.width+20)}return 0===b.length&&("horizontal"===g?o=h/2-20:"vertical"===g&&(n=f/2-80)),{x:n,y:o}},Ce=function(e){for(var t=0,n=b.length;t<n;t++)e(b[t],t,b)},ke=function(e,t){if(!e)return!1;A();var n=JSON.parse(e);console.log(n),O=n.scale,l.scaleChanged(O),g=n.direction,l.directionChanged(g),console.log(g),n.dnodes.map(function(e){return re(e.key,"restore",e)}),n.connects.map(function(e){return e.parentNode=w[e.parentNode]||{},ae(e)}),n.paths.map(function(e){return e.start=C[e.start]||{},e.end=C[e.end]||{},se(e)}),o=n.diagramWidth,i=n.diagramHeight,n.diagramWidth<f&&"full"===u.diagramSize&&(o=f),v=n.gridWidth,x=n.gridLineWidth,y=n.gridAlign,B=n.currentId,W.triggerScrollByOffset(),Q(null)},De=function(e){var t=JSON.stringify({dnodes:b.map(function(e){var t=Ye.clone(e);return delete t.cmbutton,delete t.cmenu,t}),connects:S.map(function(e){var t=Ye.clone(e);return t.parentNode=t.parentNode.id,t}),paths:E.map(function(e){var t=Ye.clone(e);return t.start=t.start.id,t.end=t.end.id,delete t.points,t}),diagramWidth:o,diagramHeight:i,gridWidth:v,gridAlign:y,scale:O,direction:g,currentId:B});l.$ghistory.saveState(t),l.updateToolbar()},Pe=function(e){requestAnimationFrame(function(){d.clearRect(0,0,f,h),d.save(),d.translate(z,X),d.scale(O,O),Te(),Me(),Oe(),Be(),d.restore()})},Te=function(){var e=0,t=0;for(d.beginPath(),d.strokeStyle="#EEEEEE",d.lineWidth=x;t<i;)d.moveTo(0,t),d.lineTo(o,t),t+=v;for(;e<o;)d.moveTo(e,0),d.lineTo(e,i),e+=v;d.stroke()},Me=function(){Ce(function(e){e.draw(),Le(e)})},Le=function(e){ce(e).forEach(function(e){M&&e.drawOutline(),e.draw()})},Be=function(){Ce(function(e){e.isShowMenu&&(e.cmenu.forEach(function(e){e.draw()}),e.cmenu.forEach(function(e){e.entering&&e.drawTitle()}))})},Oe=function(){D&&D.draw(),E.forEach(function(e){e.connectPoints(),e.draw()})},ze=function(e){return e/O},Xe=function(e){var t=Array.from(arguments).slice(1);Re[e].apply(Re,t),"undo"===e||"redo"===e?Pe("restore"):Pe()},Re={insert:function(e,t,n,o,i){var r,a;if(!u.beforeInsertDNode||u.beforeInsertDNode(e,t,n)){var c=re(e,t,n,o);a={parentNode:r=c},"vertical"===g?(r.top&&ae(a,"top"),r.bottom&&ae(a,"bottom")):"horizontal"===g&&(r.left&&ae(a,"left"),r.right&&ae(a,"right")),De("insert"),i&&i(c)}},copy:function(){Y=R},paste:function(){if(!Y)return!1;this.insert(Y.key,"copy",Y),De("paste")},splice:function(){var o=null,i=null;return Ce(function(e,t,n){e===R&&(i=n,o=t)}),Q(null),i.splice(o,1)[0]},delete:function(e){var t,n=e||R;Q(null),ee(t=n,"del"),te(t,"del"),ne(t,"del"),oe(t,"del"),b.splice(b.indexOf(n),1),delete w[n.id],le(n).forEach(function(e){e.start.parentNode.showCMButton(),e.start.parentNode.cmbutton&&he(e.start.parentNode),E.splice(E.indexOf(e),1),0===ue(e.start).length&&e.start.disConnect(),0===ue(e.end).length&&e.end.disConnect()}),ce(n).forEach(function(e){S.splice(S.indexOf(e),1),delete C[e.id]}),De("delete dnode")},tofront:function(){var e=this.splice();b.push(e),I.moveEvent(e,"push"),ce(e).forEach(function(e){I.moveEvent(e,"push")}),e.cmbutton&&I.moveEvent(e.cmbutton,"push"),De("dnode to front")},toback:function(){var e=this.splice();b.unshift(e),I.moveEvent(e,"unshift"),ce(e).forEach(function(e){I.moveEvent(e,"unshift")}),e.cmbutton&&I.moveEvent(e.cmbutton,"unshift"),De("dnode to back")},undo:function(){ke(l.$ghistory.prevState())},redo:function(){ke(l.$ghistory.nextState())},zoomin:function(){O=O<2?Ye.sum(O,.2):2,l.scaleChanged(O),De("scale changed")},zoomout:function(){O=.6<O?Ye.minus(O,.2):.6,l.scaleChanged(O),De("scale changed")},fitpage:function(){O=1,l.scaleChanged(O),De("scale changed")},fitpagewidth:function(){O=parseFloat((f/o).toFixed(2)),l.scaleChanged(O),De("scale changed")},editText:function(){De("edit dnode text")},changeDir:function(e){g=e,l.directionChanged(e),De("direction changed")}};return Ye.extend(l,{$trigger:Xe,getSelectedDNode:function(){return R}}),Ye.extend(t,{reset:A,reboot:function(){q()},refs:H,draw:Pe,container:e,initCanvas:function(){I.init(H.diagramDragLayer),G(),A(),K(z,X),l.directionChanged(u.direction),H.diagramDragLayer.on("mousedown",$.mousedown),Pe(),De("init diagram")},resizeCanvas:G,scaleChanged:function(){var e=f-o*O,t=h-i*O;z=0<e?e/2:0,X=0<t?t/2:0,I.setOffset(z,X),I.setScale(O),W.resizeScrollBar()},directionChanged:function(n){S.forEach(function(e){"vertical"===g?"left"===e.position?e.setPosition("top"):"right"===e.position&&e.setPosition("bottom"):"horizontal"===g&&("top"===e.position?e.setPosition("left"):"bottom"===e.position&&e.setPosition("right"))}),b.forEach(function(t){t.dir=n,t.cmenuOffsetX=0,t.cmenuOffsetY=0,t.cmenu.forEach(function(e){e.follow(t,"directionChanged")}),me(t),U(t)}),E.forEach(function(e){e.dir=n})},saveState:De,restoreState:ke,getPathsMaps:function(){return N},getAllDNodes:function(){return b},getConnects:ce,getAllConnects:function(){return S},getAllPaths:function(){return E},getPrevSibling:be,getPrevSiblingByKey:function(e,t){for(var n=be(e);n&&n.key!==t;)n=be(n);return n},getNextSibling:function(e){var n=null;return ce(e).forEach(function(e){if("end"===e.type){var t=ue(e);0<t.length&&(n=t[0].end.parentNode)}}),n}}),V(),t},l=function(e){var t,n,o,i,r=this,a={},c=g(document.createDocumentFragment()),s=g(e.container||document.getElementsByTagName("body")[0]),l=function(){u(),t.resizeCanvas(),t.draw()},u=function(){Ye.isFunction(e.containerWidth)&&s.css({width:e.containerWidth()+"px"}),Ye.isFunction(e.containerHeight)&&s.css({height:e.containerHeight()+"px"})},d=function(){a={refs:{},resize:l,updateToolbar:function(){n.updateTools()},updateFormat:function(){},updateDiagram:function(){t.draw()},scaleChanged:function(e){t.scaleChanged(e),i.scaleChanged(e)},directionChanged:function(e){t.directionChanged(e),i.directionChanged(e)},message:function(e){alert(e.message)},$ghistory:new v},console.log(a),r.graph=a},f=function(){t=new w(a,e.diagram),r.diagram=t,c.append(t.container)},h=function(){n=new x(a,e.toolbar),r.toolbar=n,c.append(n.container)},p=function(){o=new y(a,e.sidebar),r.sidebar=o,c.append(o.container)},m=function(){i=new b(a,e.footer),r.footer=i,t.container.append(i.container)};return r.resize=l,r.set=function(e,t){a[e]=t},r.getState=function(){return a.$ghistory.currentState()},r.reboot=function(){console.log("reboot"),t.reboot()},u(),d(),h(),p(),f(),m(),s.html(""),s.append(c),s.addClass("kgraph-container"),s.on("mousedown",function(e){e.preventDefault()}),s.on("mousemove",function(e){e.preventDefault()}),s.on("contextmenu",function(e){e.preventDefault()}),t.initCanvas(),n.updateTools(),r};window.KGraph=l}]);