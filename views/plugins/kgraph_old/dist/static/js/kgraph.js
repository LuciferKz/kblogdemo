!function(n){var o={};function i(t){if(o[t])return o[t].exports;var e=o[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,i),e.l=!0,e.exports}i.m=n,i.c=o,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=2)}([function(t,e){var n={guid:function(){for(var t=[],e="0123456789abcdef",n=0;n<16;n++)t[n]=e.substr(Math.floor(16*Math.random()),1);return t[3]="4",t[7]=e.substr(3&t[7]|8,1),t.join("")},newElement:function(t,e){var n=this,o=$k(document.createElement(t.tag));for(var i in e=e||{},t.attrs&&o.attrs(t.attrs),t.props&&o.props(t.props),t.style&&o.css(t.style),t.evts)o.on(i,t.evts[i]);return t.children&&t.children.forEach(function(t){o.append(n.newElement(t,e))}),t.ref&&(e[t.ref]=o),o},extend:function(t,e){if(Object.assign)Object.assign(t,e);else for(var n in e)t[n]=e;return t},clone:function(t){var e={};return this.extend(e,t),e},sum:function(t,e){return(10*t+10*e)/10},minus:function(t,e){return(10*t-10*e)/10},isFunction:function(t){return"function"==typeof t},getScrollLeft:function(){return document.documentElement?document.documentElement.scrollLeft:document.body.scrollLeft},getScrollTop:function(){return document.documentElement?document.documentElement.scrollTop:document.body.scrollTop}};window.kutil=n},,function(t,e,n){"use strict";n.r(e);var y=function(){var e=[],n=-1;return{getStateId:function(){return n},getLength:function(){return e.length},saveState:function(t){-1<n&&(e=e.slice(0,n+1)),e.push(t),n++},clearStates:function(){e=[],n=-1},nextState:function(){return n=n+1<e.length-1?n+1:e.length-1,e[n]},prevState:function(){return e[n=-1<n-1?n-1:0]},currentState:function(){return e[n]}}},i=[{key:"undo",title:"撤销"},{key:"redo",title:"重做"},{key:"cutOff"},{key:"copy",title:"复制"},{key:"paste",title:"粘贴"},{key:"delete",title:"删除"},{key:"cutOff"},{key:"zoomin",title:"放大"},{key:"zoomout",title:"缩小"},{key:"cutOff"},{key:"fitpagewidth",title:"适应画布"},{key:"fitpage",title:"实际尺寸"},{key:"cutOff"},{key:"tofront",title:"前置"},{key:"toback",title:"后置"}],v=function(r,a){var c=(this.graph=r).refs;kutil.newElement({tag:"div",ref:"toolbar",props:{className:"kgraph-toolbar-container"}},c);var t={hidden:!1,toolsHidden:!1,toolsConfig:{},modules:[]};kutil.extend(t,a),a=t,i.forEach(function(t){var e=a.toolsConfig[t.key];e&&kutil.extend(t,e)});var s={list:[],maps:{}},e=function(){var t=r.$ghistory.getStateId(),e=r.$ghistory.getLength();s.maps.undo.config.disabled=0===t,s.maps.redo.config.disabled=e-1<=t},n=function(){var t=!r.getSelectedDNode();s.maps.copy.config.disabled=t,s.maps.paste.config.disabled=t,s.maps.delete.config.disabled=t,s.maps.tofront.config.disabled=t,s.maps.toback.config.disabled=t},o=function(){s.list.forEach(function(t){return t.dom[t.config.disabled?"addClass":"removeClass"]("disabled")})};return kutil.newElement({tag:"div",ref:"tools",props:{className:"kgraph-toolbar"}},c),i.forEach(function(t){var e,n,o,i;"cutOff"===t.key?(i=kutil.newElement({tag:"div",props:{className:"cut-off"}}),c.tools.append(i)):!t.hidden&&(e=t,n=kutil.newElement({tag:"div",props:{title:e.title,className:"iconfont icon-"+e.key+" disabled"},evts:{click:function(){if(a.disabled)return!1;r.$trigger(e.key)}}}),o={name:e.key,config:e,dom:n},s.maps[e.key]=o,s.list.push(o),c.tools.append(n))}),c.toolbar.append(c.tools),a.modules.forEach(function(t){return t(c,r)}),a.hidden&&c.toolbar.hide(),a.toolsHidden&&c.tools.hide(),{updateTools:function(){e(),n(),o()}}},o=function(t){var e=this;e.id=kutil.guid(),e.state=1,kutil.extend(e,t),e.isShowCMButton=!0,e.isShowMenu=!1,e.cmenu=[]};o.prototype.borderColor="#007fb1",o.prototype.bgColor="#fff",o.prototype.textColor="#333",o.prototype.iconColor="#007fb1",o.prototype.top=!0,o.prototype.left=!0,o.prototype.bottom=!0,o.prototype.right=!0,o.prototype.init=function(t){var e=this;e.dir=t,e.reset(),e.textY=e.height/2,e.iconY=e.height/2},o.prototype.reset=function(){this.focusing=!1,this.entering=!1,this.grabing=!1},o.prototype.draw=function(){var t=this;t.drawRect(t.ctx),t.drawText(t.ctx),t.drawIcon(t.ctx),t.cmbutton&&t.isShowCMButton&&t.cmbutton.draw(),(t.entering||t.grabing||t.focusing)&&t.drawOutline(t.ctx),t.grabing&&t.drawDragDNode(t.ctx)},o.prototype.drawRect=function(t){var e=this;t.save(),t.fillStyle=e.bgColor,t.fillRect(e.x,e.y,e.width,e.height),t.fillStyle=!1===e.isEdited?"#999":e.borderColor,t.fillRect(e.x,e.y,6,e.height),t.restore()},o.prototype.drawRoundedRect=function(t){var e=this.getPoint(this.x+t,this.y),n=this.getPoint(this.x+this.width,this.y),o=this.getPoint(this.x+this.width,this.y+this.height),i=this.getPoint(this.x,this.y+this.height),r=this.getPoint(this.x,this.y),a=this.ctx;a.strokeStyle="#f6c231",a.lineWidth=2,a.beginPath(),a.moveTo(e.x,e.y),a.arcTo(n.x,n.y,o.x,o.y,t),a.arcTo(o.x,o.y,i.x,i.y,t),a.arcTo(i.x,i.y,r.x,r.y,t),a.arcTo(r.x,r.y,e.x,e.y,t),a.stroke()},o.prototype.drawText=function(t){var e=this;t.save(),t.textBaseline="middle",t.font="bold 12px 黑体",t.fillStyle=!1===e.isEdited?"#999":e.textColor,t.fillText(e.text,e.x+35,e.y+e.textY),t.restore()},o.prototype.drawIcon=function(t){var e=this;t.save(),t.textBaseline="middle",t.font="16px iconfont",t.fillStyle=!1===e.isEdited?"#999":e.iconColor,t.fillText(e.icon,e.x+14,e.y+e.iconY),t.restore()},o.prototype.drawOutline=function(t){var e=this;t.save(),t.setLineDash([4,4]),t.strokeStyle=!1===e.isEdited?"#999":e.borderColor,t.strokeRect(e.x-5,e.y-8,e.width+10,e.height+16),t.restore()},o.prototype.focus=function(){this.focusing=!0},o.prototype.blur=function(){this.focusing=!1,this.isShowMenu=!1},o.prototype.enter=function(){this.entering=!0},o.prototype.leave=function(){this.entering=!1},o.prototype.remove=function(){this.state=0},o.prototype.drop=function(){var e=this;e.grabing=!1,e.x=e.dragDNode.x,e.y=e.dragDNode.y,e.cmbutton&&e.cmbutton.follow(e),e.dragDNode=null,e.cmenuOffsetX=0,e.cmenuOffsetY=0,e.cmenu.forEach(function(t){t.follow(e,"drop")})},o.prototype.move=function(t,e){this.x=t,this.y=e},o.prototype.drag=function(){var t=this;(t.grabing=t).dragDNode={x:t.x,y:t.y}},o.prototype.moveDragDNode=function(t,e){t<0&&(t=0),e<0&&(e=0),this.dragDNode.x=t,this.dragDNode.y=e},o.prototype.drawDragDNode=function(t){t.save(),t.setLineDash([4,4]),t.lineWidth=2,t.strokeStyle="#333",t.strokeRect(this.dragDNode.x,this.dragDNode.y,this.width,this.height),t.restore()},o.prototype.getPoint=function(t,e){return{x:t,y:e}},o.prototype.showMenu=function(){this.isShowMenu=!0},o.prototype.showCMButton=function(){this.isShowCMButton=!0},o.prototype.hideCMButton=function(){this.isShowCMButton=!1};var f=o,r=function(t){var e=this;e.id=kutil.guid(),e.parentNode=null,e.state=1,e.connected=!1,kutil.extend(e,t),e.type="left"===e.position||"top"===e.position?"start":"end"};r.prototype.width=24,r.prototype.height=24,r.prototype.r=4,r.prototype.outlineR=12,r.prototype.borderColor="#007fb1",r.prototype.init=function(){this.follow()},r.prototype.follow=function(){var t=this,e=t.parentNode;switch(t.position){case"top":t.cx=e.x+e.width/2,t.cy=e.y;break;case"left":t.cx=e.x,t.cy=e.y+e.height/2;break;case"bottom":t.cx=e.x+e.width/2,t.cy=e.y+e.height;break;case"right":t.cx=e.x+e.width,t.cy=e.y+e.height/2}t.x=t.cx-t.width/2,t.y=t.cy-t.height/2},r.prototype.setPosition=function(t){this.position=t,this.follow()},r.prototype.drawOutline=function(){var t=this.ctx;t.save(),t.strokeStyle="#c5e3ff",t.lineWidth=1,t.beginPath(),t.fillStyle="#c5e3ff",t.arc(this.cx,this.cy,this.outlineR,0,2*Math.PI),t.fill(),t.restore()},r.prototype.draw=function(){var t=this,e=t.ctx;e.save(),e.strokeStyle=this.borderColor,e.lineWidth=1,e.beginPath(),t.connected?e.fillStyle=this.borderColor:e.fillStyle="#FFFFFF",e.arc(t.cx,t.cy,t.r,0,2*Math.PI),e.closePath(),e.fill(),e.stroke(),e.restore()},r.prototype.remove=function(){this.state=0},r.prototype.connect=function(){this.connected=!0},r.prototype.disConnect=function(){this.connected=!1},r.prototype.isConnectable=function(){return!this.connected||"multiple"===this.parentNode.connectRule};var Xt=r,a=function(){this.id=kutil.guid()};a.prototype={width:12,height:12,r:6,init:function(t){this.follow(t),this.status=0<t.nextSiblings.length?1:0},draw:function(){var t=this.ctx,e=this.r,n=this.cx,o=this.cy;t.save(),t.beginPath(),t.strokeStyle="#333",t.arc(n,o,e,0,2*Math.PI),t.stroke(),t.beginPath(),t.moveTo(n-(e-2),o),t.lineTo(n+(e-2),o),t.stroke(),t.beginPath(),t.moveTo(n,o-(e-2)),t.lineTo(n,o+(e-2)),t.stroke(),t.restore()},follow:function(t){var e=this;e.cx=t.x+120,e.cy=t.y+t.height/2,e.x=e.cx-e.r,e.y=e.cy-e.r}};var Ht=a,c=function(t,e){this.id=kutil.guid(),this.key=t,this.idx=e};c.prototype={r:15,width:30,height:30,init:function(t){},draw:function(){var t=this,e=t.ctx,n=t.r,o=t.cx,i=t.cy;e.beginPath(),e.strokeStyle="#ffbb05",e.fillStyle="#fff",e.arc(o,i,n,0,2*Math.PI),e.fill(),e.stroke(),t.drawIconText()},getPoint:function(t,e){return{x:t,y:e}},drawTitle:function(){var t=this,e=12*t.text.length+10,n=t.cx-e/2,o=t.y+t.height+10,i=t.getPoint(n+6,o),r=t.getPoint(n+e,o),a=t.getPoint(n+e,o+20),c=t.getPoint(n,o+20),s=t.getPoint(n,o),l=t.ctx;l.save(),l.beginPath(),l.moveTo(i.x,i.y),l.arcTo(r.x,r.y,a.x,a.y,6),l.arcTo(a.x,a.y,c.x,c.y,6),l.arcTo(c.x,c.y,s.x,s.y,6),l.arcTo(s.x,s.y,i.x,i.y,6),l.fillStyle="#EEE",l.fill(),l.textAlign="center",l.textBaseline="middle",l.font="12px 黑体",l.fillStyle="#333",l.fillText(t.text,n+e/2,o+10),l.restore()},drawIconText:function(){var t=this,e=t.ctx;e.save(),e.textBaseline="middle",e.textAlign="center",e.font="24px iconfont",e.fillStyle="#333",e.fillText(t.icon,t.x+t.width/2,t.y+t.height/2),e.restore()},follow:function(t,e){var n,o,i=this,r=i.idx,a=t.cmenu.length,c=t.cmenuOffsetX||0,s=t.cmenuOffsetY||0;"vertical"===t.dir?(n=t.x+t.width/2+c,o=t.y+t.height+20+s,n+=a%2?[-1,1][r%2]*Math.ceil(r/2)*45-15:[-1,1][r%2]*(15*Math.ceil((r+1)/2)+30*((1^r%2)+Math.floor(r/2)))-15*[-1,1][r%2]/2):"horizontal"===t.dir&&(n=t.x+t.width+40+c,o=t.y+t.height/2+s,o+=a%2?[-1,1][r%2]*Math.ceil(r/2)*45-15:[-1,1][r%2]*(15*Math.ceil((r+1)/2)+30*((1^r%2)+Math.floor(r/2)))-15*[-1,1][r%2]/2),i.x=n,i.y=o,i.cx=n+i.r,i.cy=o+i.r},setText:function(t){this.text=t},setIcon:function(t){this.icon=t},enter:function(){this.entering=!0},leave:function(){this.entering=!1}};var It=c,s=function(t){var e=this;e.id=kutil.guid(),e.dir="vertical",e.state=1,kutil.extend(e,t),e.points=[],e.start=t.start,e.end=t.end};s.prototype.draw=function(){var n=this.ctx;n.beginPath(),n.strokeStyle="#a0d1e1",this.points.forEach(function(t,e){0===e?n.moveTo(t.x,t.y):n.lineTo(t.x,t.y)}),n.stroke()},s.prototype.closePath=function(t){this.start?this.end=t:this.end&&(this.start=t)},s.prototype.move=function(t,e){var n=this;n.start?n.createPoints({x:n.start.cx,y:n.start.cy},{x:t,y:e}):n.end&&n.createPoints({x:t,y:e},{x:n.end.cx,y:n.end.cy})},s.prototype.connectPoints=function(){var t=this,e={x:t.start.cx,y:t.start.cy},n={x:t.end.cx,y:t.end.cy};t.createPoints(e,n)},s.prototype.createPoints=function(t,e){var n=this;n.points=[{x:t.x,y:t.y}],"vertical"===n.dir?e.y<t.y?(n.points.push({x:(e.x-t.x)/2+t.x,y:t.y}),n.points.push({x:(e.x-t.x)/2+t.x,y:e.y})):0<Math.abs(e.x-t.x)&&n.points.push({x:e.x,y:t.y}):"horizontal"===n.dir&&(t.x<e.x?(n.points.push({x:(e.x-t.x)/2+t.x,y:t.y}),n.points.push({x:(e.x-t.x)/2+t.x,y:e.y})):t.x>e.x&&(n.points.push({x:t.x,y:t.y-(t.y-e.y)/2}),n.points.push({x:e.x,y:t.y-(t.y-e.y)/2}))),n.points.push({x:e.x,y:e.y})};var l,Wt=s,x=function(s,t){var a={list:[],maps:{}};s.sbdnodes=a,t=t||{};var c=s.refs,r=kutil.newElement({tag:"div",ref:"sidebar",props:{className:"kgraph-sidebar-container"}},c),l=function(t,e){var n=kutil.newElement({tag:"div",props:{className:"sidebar-section-item item-"+e.key},children:[{tag:"i",ref:"icontext",props:{className:"iconfont",innerHTML:e.iconText}},{tag:"span",props:{innerText:e.text}}]},c);t.append(n),e.width=140,e.height=40,e.icon=c.icontext.text(),e.text=e.text;var o,i,r=(o=e,(i=function(t,e){this.isEdited=o.isEdited,f.apply(this,[t,e])}).prototype=Object.create(f.prototype),Object.assign(i.prototype,o),i.prototype.constructor=i);a.list.push(r),a.maps[e.key]=r,u(e,n)},u=function(n,t){var o,e={},i=!1,r=!1,a=function(t){if(!i){if(!(10<Math.abs(e.x-t.pageX)||10<Math.abs(e.y-t.pageY)))return!1;i=!0,o=d(n,e.x,e.y)}t.pageX>s.cr.left&&t.pageX<s.cr.right&&t.pageY>s.cr.top&&t.pageY<s.cr.bottom?r||(r=!0,o.css({width:n.width*s.scale+"px",height:n.height*s.scale+"px"})):r&&(r=!1,o.css({width:n.width+"px",height:n.height+"px"})),o.css({transform:"translate("+(t.pageX-e.x)+"px, "+(t.pageY-e.y)+"px)"})},c=function t(e){i?o&&(o.remove(),s.$trigger("insert",n.key,"drag",{},{x:e.clientX-s.cr.left+kutil.getScrollLeft(),y:e.clientY-s.cr.top+kutil.getScrollTop()})):s.$trigger("insert",n.key,"click"),i=!1,document.removeEventListener("mousemove",a),document.removeEventListener("mouseup",t)};t.on("mousedown",function(t){1===t.which&&(e.x=t.pageX,e.y=t.pageY,document.addEventListener("mousemove",a),document.addEventListener("mouseup",c))})},d=function(t,e,n){var o=kutil.newElement({tag:"div",style:{width:t.width+"px",height:t.height+"px",border:"1px dashed #333",position:"absolute",top:n+"px",left:e+"px",zIndex:999,transform:"translate(0, 0)"}});return $k("body").append(o),o};return kutil.newElement({tag:"i",props:{className:"button-open-sidebar iconfont icon-fenlei1"},ref:"buttonOpenSlidebar",evts:{click:function(){r.removeClass("collapse"),setTimeout(function(){s.resize()},200)}}},c),r.append(c.buttonOpenSlidebar),t.hidden&&r.hide(),{container:r,createSection:function(t,e){var n,o=0,i=kutil.newElement({tag:"div",props:{className:"sidebar-section"},ref:"sidebarSection",children:[{tag:"div",props:{className:"sidebar-section-title"},children:[{tag:"i",props:{className:"iconfont icon-fenlei1"},evts:{click:function(){r.addClass("collapse"),setTimeout(function(){s.resize()},200)}}},{tag:"span",props:{innerText:t}},{tag:"i",props:{className:"section-title__arrow iconfont icon-arrow-bottom"},evts:{click:function(){i.hasClass("close")?n.height(o):n.height(0),i.toggleClass("close")}}}]},{tag:"div",ref:"sectionItems",props:{className:"sidebar-section-items"}}]},c);n=c.sectionItems,e.forEach(function(t,e){l(c.sectionItems,t),e%3||(o+=70)}),console.log(o),n.height(o),r.append(c.sidebarSection)}}},b=function(e,t){var n=e.refs;t=t||{};var o=kutil.newElement({tag:"div",ref:"footer",props:{className:"kgraph-footer-container"}},n);return kutil.newElement({tag:"div",ref:"diagramScale",props:{className:"diagram-scale"},children:[{tag:"div",props:{className:"scale"},evts:{click:function(){console.log("click")}},children:[{tag:"div",ref:"scaleBar",props:{className:"scale-bar"},style:{width:"50%"},children:[{tag:"div",props:{className:"scale-drag"}}]}]},{tag:"div",props:{className:"zoom"},children:[{tag:"div",ref:"zoomOut",props:{className:"scale-zoom-out iconfont icon-jian"}},{tag:"div",ref:"scaleValue",props:{className:"scale-value",innerHTML:"100%"}},{tag:"div",ref:"zoomIn",props:{className:"scale-zoom-in iconfont icon-jia"}}]}]},n),n.zoomOut.on("click",function(){e.$trigger("zoomout")}),n.zoomIn.on("click",function(){e.$trigger("zoomin")}),o.append(n.diagramScale),t.hidden&&o.hide(),t.modules&&t.modules.forEach(function(t){return t(n,e)}),{container:o,scaleChanged:function(t){n.scaleValue.html(Math.ceil(100*t)+"%"),n.scaleBar.css({width:t/2*100+"%"})},directionChanged:function(t){n.fieldbar&&n.fieldbar.attrs({class:"graph-mode "+t})}}},Rt=function(){var c,m=0,g=0,y=1,v={},x=null,b={},s=function(t,e){for(var n=t.changedTouches?t.changedTouches[0]:t,o=v[e],i=o.length-1,r=(n.clientX-m-x.left-kutil.getScrollLeft())/y,a=(n.pageY-g-x.top)/y,c=!1;-1<i;i--){var s=o[i],l=b[s];if(l){var u=l.evts[e];if(u){var d=l.x,f=l.y,h=l.r,p=l.b;if(d<r&&f<a&&r<h&&a<p){if("mouseleave"===e)continue;if("mouseenter"===e){if(l.enter){if(c){l.enter=!1,l.evts.mouseleave.fn.call(l.self,t);continue}break}l.enter=!0}else if(c)break;u.fn.call(l.self,t),u.opt.cancelBubble&&(c=!0)}else"mouseleave"===e&&l.enter&&(l.enter=!1,u.fn.call(l.self,t))}}}};return{init:function(t){c=t},setClientRect:function(t){x=t},setOffset:function(t,e){m=t,g=e},setScale:function(t){y=t},addEvent:function(t,e,n,o){var i,r=t,a=t.id;b[a]||(b[a]={self:t,x:r.x,y:r.y,r:r.x+r.width,b:r.y+r.height,width:r.width,height:r.height,enter:!1,evts:{}}),b[a].evts[e]={fn:n,opt:o||{}},v[e]?!~v[e].indexOf(a)&&v[e].push(a):(v[e]=[a],c.on("mouseenter"===(i=e)||"mouseleave"===i?"mousemove":i,function(t){v[e]&&v[e].length&&s(t,e)}))},clearEvent:function(){v={},b={}},updateEvent:function(t,e){var n=t;b[t.id]&&kutil.extend(b[t.id],{x:n.x,y:n.y,r:n.x+n.width,b:n.y+n.height,width:n.width,height:n.height})},moveEvent:function(t,e){for(var n in v){var o=v[n],i=o.indexOf(t.id);"unshift"===e?o.unshift(o.splice(i,1)[0]):o.push(o.splice(i,1)[0])}},delEvent:function(t){b[t.id]&&delete b[t.id]},handleEvent:s}},w=function(l,u){var d,f,h,o,i,e=this,t=kutil.newElement({tag:"div",props:{className:"kgraph-diagram-container"}});e.graph=l,u=u||{};var n,r,a,c,p,s,m,g,y,v,x,b,w,k,E,S,C,N,P=0,L=0,M=!1,T=null,D=1,B=1,O=0,z=0,Y=null,X=null,H=new Rt,I=l.refs,W={createScrollContainer:function(){kutil.newElement({tag:"div",ref:"scrollContainer",props:{className:"scroll-container"},children:[{tag:"div",props:{className:"scroll-vertical-container"},children:[{tag:"div",ref:"scrollVerBar",props:{className:"scroll-bar"}}]},{tag:"div",props:{className:"scroll-horizontal-container"},children:[{tag:"div",ref:"scrollHorBar",props:{className:"scroll-bar"}}]}]},I),I.diagramDragLayer.onWheel(function(t){t.preventDefault(),(a||c)&&(a&&(P+=20*t.deltaY),c&&(L+=20*t.deltaX),W.triggerScroll())}),I.scrollVerBar.on("mousedown",function(t){W.mousedown(t,"vertical")}),I.scrollHorBar.on("mousedown",function(t){W.mousedown(t,"horizontal")}),I.scrollContainer.insertBefore(I.diagramDragLayer)},triggerScroll:function(){h-n<P?P=h-n:P<0&&(P=0),f-r<L?L=f-r:L<0&&(L=0),I.scrollVerBar.css({transform:"translate(0px, "+P+"px)"}),I.scrollHorBar.css({transform:"translate("+L+"px, 0px)"}),J(O=-L/f*(o*B),z=-P/h*(i*B)),Pt()},triggerScrollByOffset:function(){P=-z/(i*B)*h,L=-O/(o*B)*f,I.scrollVerBar.css({transform:"translate(0px, "+P+"px)"}),I.scrollHorBar.css({transform:"translate("+L+"px, 0px)"}),J(O,z)},resizeScrollBar:function(){h<i*B?(n=h*h/(i*B),I.scrollVerBar.css({height:n+"px"}),a=!0,I.scrollVerBar.show()):(console.log("hide v"),a=!1,I.scrollVerBar.hide()),f<o*B?(r=f*f/(o*B),I.scrollHorBar.css({width:r+"px"}),c=!0,I.scrollHorBar.show()):(console.log("hide h"),c=!1,I.scrollHorBar.hide())}},R=function(t){var e=W[t];W[t]=function(){u.scroll&&e()}};for(var $ in W)R($);kutil.extend(W,{downPoint:null,prevPoint:null,direction:"vertical",mousedown:function(t,e){W.direction=e,W.prevPoint={x:t.clientX,y:t.clientY},document.addEventListener("mousemove",W.mousemove),document.addEventListener("mouseup",W.mouseup)},mousemove:function(t){"vertical"===W.direction?P+=t.clientY-W.prevPoint.y:"horizontal"===W.direction&&(L+=t.clientX-W.prevPoint.x),W.triggerScroll(),W.prevPoint={x:t.clientX,y:t.clientY}},mouseup:function(t){document.removeEventListener("mousemove",W.mousemove),document.removeEventListener("mouseup",W.mouseup)}});var j={downPoint:{},mousedown:function(t){if(j.downPoint.x=t.clientX-O,j.downPoint.y=t.clientY-z,!p)return!1;u.dragable&&document.addEventListener("mousemove",j.mousemove),document.addEventListener("mouseup",j.mouseup)},mousemove:function(t){O=t.clientX-j.downPoint.x,z=t.clientY-j.downPoint.y,H.setOffset(O,z),Pt()},mouseup:function(t){G(null),u.dragable&&document.removeEventListener("mousemove",j.mousemove),document.removeEventListener("mouseup",j.mouseup)}},F=function(){b=[],w={},k=[],E={},S=[],C={},s=u.startX||60,m=u.startY||60,g=u.direction||"vertical","full"===u.diagramSize?(o=f,i=h):(o=u.diagramWidth||602,i=u.diagramHeight||802,O="left"===u.horizontalAlign?0:(f-o)/2<0?0:(f-o)/2,z="top"===u.verticalAlign?0:(h-i)/2<0?0:(h-i)/2),y=u.gridWidth||10,v=u.gridLineWidth||2,x=void 0===u.gridAlign||u.gridAlign,p=!0,e.diagramWidth=o,H.clearEvent()},A=function(){kutil.newElement({tag:"div",ref:"main",props:{className:"kgraph-diagram"},children:[{tag:"canvas",ref:"canvas",props:{id:"canvas"},style:{backgroundColor:"#f8fbfb"}},{tag:"div",ref:"diagramDragLayer",props:{className:"diagram-drag-layer"}}]},I),u.header&&t.append(u.header),W.createScrollContainer(),e.ctx=d=I.canvas.dom.getContext("2d"),V(),t.append(I.main)},V=function(){Wt.prototype.ctx=e.ctx,Xt.prototype.ctx=e.ctx,Ht.prototype.ctx=e.ctx,It.prototype.ctx=e.ctx},_=function(t){T=I.contextMenu,I.contextMenu.css({left:t.pageX-l.cr.left+"px",top:t.pageY-l.cr.top+"px"}),I.contextMenu.show()},q=function(){p=!0,T=null,I.contextMenu.hide()},J=function(t,e){O=t,z=e,H.setOffset(O,z)},K=function(){canvas.width=0,canvas.height=0;var t=I.main.dom.getBoundingClientRect();o=o<f?f:o,i=i<h?h:i,l.cr={top:t.top+kutil.getScrollTop(),left:t.left+kutil.getScrollLeft(),width:t.width,height:t.height},u.adjustCr&&(console.log(u.offsetX,I.sidebar.width(),kutil.getScrollLeft()),l.cr.left=u.offsetX+(I.sidebar?I.sidebar.width():0)+kutil.getScrollLeft()),console.log(l.cr),canvas.width=t.width,canvas.height=t.height,e.caWidth=f=t.width,h=t.height,W.resizeScrollBar(),H.setClientRect(l.cr)},G=function(t){Y&&Y!==t&&(Y.blur(),nt(Y,"del")),Y=t,l.updateFormat(),l.updateToolbar(),Pt()},Q=function(t){Z(t,"update"),tt(t,"update"),et(t,"update"),nt(t,"update")},U=function(){p=!1,document.removeEventListener("mousemove",j.mousemove),document.removeEventListener("mouseup",j.mouseup)},Z=function(t,e){ot(t,e)},tt=function(t,e){at(t).forEach(function(t){ot(t,e)})},et=function(t,e){if(!t.cmbutton)return!1;ot(t.cmbutton,e)},nt=function(t,e){t.cmenu.forEach(function(t){ot(t,e)})},ot=function(t,e){var n=e+"Event";H[n](t,"mouseenter"),H[n](t,"mousedown"),H[n](t,"mouseleave")},it=function(t,e,n,o){var i=l.sbdnodes.maps[t];if(!i)return console.error("未找到key: "+t+"对应的节点"),null;i.prototype.ctx=d;var r=new i(n||{});switch(r.key=t,e){case"click":var a=Et(r);r.move(a.x,a.y);break;case"copy":r.reset(),(X=r).id=kutil.guid(),r.move(X.x+y,X.y+y);break;case"drag":var c=o.x-O,s=o.y-z;x&&(o.x=c<0?0:c-c%y,o.y=s<0?0:s-s%y);case"cmitem":r.move(o.x,o.y)}return b?b.push(r):b=[r],w[r.id]=r,wt(r),"restore"===e||kt({t:r.y,l:r.x,b:r.y+r.height,r:r.x+r.width})||(z=0<h-r.y-r.height-10?0:h-r.y-r.height-10,O=0<f-r.x-r.width-10?0:f-r.x-r.width-10,W.triggerScrollByOffset()),ut(r),u.afterInsertDNode&&u.afterInsertDNode(r,D,e),D++,r},rt=function(t,e){e&&(t.position=e);var n=new Xt(t);n.init(),dt(n),S.push(n),C[n.id]=n},at=function(e){return S.filter(function(t){return t.parentNode===e})},ct=function(t){var e=new Wt(t);k.push(e),"multiple"!==(E[e.id]=e).start.parentNode.connectRule&&(e.start.parentNode.hideCMButton(),et(e.start.parentNode,"del")),u.afterCreatePath&&u.afterCreatePath(e)},st=function(e){return k.filter(function(t){return t.start.parentNode===e||t.end.parentNode===e})},lt=function(e){return k.filter(function(t){return t.start===e||t.end===e})},ut=function(o){var i={},r={},a=!1;o.init(g),o.nextSiblings&&(o.cmbutton=new Ht,o.cmbutton.init(o)),o.cmenu.length?o.cmenu.forEach(function(t){t.follow(o,"dnode init")}):o.nextSiblings&&o.nextSiblings.length&&(o.nextSiblings.forEach(function(t){var e=l.sbdnodes.maps[t];if(e){var n=new It(t,o.cmenu.length);n.setText(e.prototype.text),n.setIcon(e.prototype.icon),o.cmenu.push(n)}}),o.cmenu.forEach(function(t){t.follow(o,"dnode init")})),pt(o);var c=function(t){if(Math.abs(i.x-t.clientX)<5&&Math.abs(i.y-t.clientY)<5)return!1;a=!0,o.drag();var e=t.clientX-i.x,n=t.clientY-i.y;x&&(e-=e%y,n-=n%y),o.moveDragDNode(r.x+Ot(e),r.y+Ot(n)),Pt()},s=function t(e){p=!0,document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",t),a?(a=!1,o.drop(),pt(o),at(o).forEach(function(t){t.follow()}),wt(o),Q(o),Pt(),Nt("drop dnode")):(G(o),o.focus())};H.addEvent(o,"mouseenter",function(){I.diagramDragLayer.addClass("move"),o.enter(),Pt()},{cancelBubble:!0}),H.addEvent(o,"mousedown",function(t){var e,n;U(),1===t.which?(e=t,i.x=e.clientX,i.y=e.clientY,r.x=o.x,r.y=o.y,document.addEventListener("mousemove",c),document.addEventListener("mouseup",s)):3===t.which&&u.contextMenu&&(G(o),o.focus(),n=t,I.contextMenu||(kutil.newElement({tag:"div",ref:"contextMenu",props:{className:"diagram-context-menu"}},I),[{action:"delete",text:"删除"}].forEach(function(t){var e=kutil.newElement({tag:"div",props:{className:"context-menu-item",textContent:t.text}});e.on("mousedown",function(t){zt("delete")}),I.contextMenu.append(e)}),document.addEventListener("mousedown",function(){T&&q()}),I.diagramDragLayer.append(I.contextMenu)),_(n),t.stopPropagation(),t.cancelBubble=!0)},{cancelBubble:!0}),H.addEvent(o,"mouseleave",function(){I.diagramDragLayer.removeClass("move"),o.leave(),Pt()});var t=function(t){var e=o.evts[t];kutil.extend(e.options||{},{cancelBubble:!0}),H.addEvent(o,t,function(t){e.cb(t,o)},e.options)};for(var e in o.evts)t(e);o.cmbutton&&ft(o)},dt=function(i){var r={},a=function(t){N.move(Ot(t.pageX-l.cr.left-O),Ot(t.pageY-l.cr.top-z)),Pt()},n=function t(e){if(5<Math.abs(r.x-e.pageX)||5<Math.abs(r.y-e.pageY)){var n=yt({x:Ot(e.pageX-l.cr.left-O),y:Ot(e.pageY-l.cr.top-z)});if(n){var o=bt(i,n);o?l.message({type:"error",message:o}):(N.closePath(n),ct(N),i.connect(),n.connect(),Nt("add path"))}}M=!(p=!0),N=null,Pt(),document.removeEventListener("mousemove",a),document.removeEventListener("mouseup",t)};H.addEvent(i,"mouseenter",function(){I.diagramDragLayer.addClass("auto")}),H.addEvent(i,"mousedown",function(t){var e={dir:g};"start"===i.type?e.end=i:e.start=i,N=new Wt(e),M=!0,r.x=t.pageX,r.y=t.pageY,U(),document.addEventListener("mousemove",a),document.addEventListener("mouseup",n)},{cancelBubble:!0}),H.addEvent(i,"mouseleave",function(){I.diagramDragLayer.removeClass("auto")})},ft=function(e){H.addEvent(e.cmbutton,"mouseenter",function(){I.diagramDragLayer.addClass("pointer")}),H.addEvent(e.cmbutton,"mousedown",function(){e.showMenu(),e.cmenu.forEach(function(t){ht(e,t)}),Pt()}),H.addEvent(e.cmbutton,"mouseleave",function(){I.diagramDragLayer.removeClass("pointer")})},ht=function(i,t){H.addEvent(t,"mouseenter",function(){t.enter(),I.diagramDragLayer.addClass("pointer"),Pt()}),H.addEvent(t,"mousedown",function(){t.leave(),l.$trigger("insert",t.key,"cmitem",{},"vertical"===g?{x:i.x,y:i.y+i.height+60}:{x:i.x+i.width+60,y:i.y},function(t){var e=at(i).slice(-1)[0],n=at(t)[0],o=bt(e,n);o?(l.message({type:"error",message:o}),l.$trigger("delete",t)):(ct({start:e,end:n,dir:g}),e.connect(),n.connect(),Nt("add path and dnode"))}),I.diagramDragLayer.removeClass("pointer")},{cancelBubble:!0}),H.addEvent(t,"mouseleave",function(){I.diagramDragLayer.removeClass("pointer"),t.leave(),Pt()})},pt=function(t){var e=mt(t);kt(e)||gt(t,e)},mt=function(t){var e=t.cmenu.slice(-1)[0]||{},n=t.cmenu.slice(-2,-1)[0]||e,o=t.cmenu.length;return"horizontal"===g?o%2?{t:e.y,l:e.x,b:n.y+n.height,r:e.x+e.width}:{t:n.y,l:e.x,b:e.y+e.height,r:e.x+e.width}:"vertical"===g?o%2?{t:e.y,l:e.x,b:e.y+e.height,r:n.x+n.width}:{t:e.y,l:n.x,b:e.y+e.height,r:e.x+e.width}:void 0},gt=function(e,t){t.l<-O?e.cmenuOffsetX=O-t.l:t.r>-O+f&&(e.cmenuOffsetX=-O+f-t.r),i<t.b?i=t.b+90:t.t<-z?e.cmenuOffsetY=-z-t.t:t.b>-z+h&&(e.cmenuOffsetY=-z+h-t.b),e.cmenu.forEach(function(t){t.follow(e,"moveCMenuItems")})},yt=function(e){var n=null;return S.forEach(function(t){t.x-t.outlineR<e.x&&t.x+2*t.outlineR>e.x&&t.y-t.outlineR<e.y&&t.y+2*t.outlineR>e.y&&(n=t)}),n},vt=function(t,e){if("inherit"===t.connectRule){var n=st(t);n&&0<n.length&&(t=n[0]["start"===e?"end":"start"].parentNode)}return t},xt=function(t){var n=null;return at(t).find(function(t){if("start"===t.type){var e=lt(t);0<e.length&&(n=e[0].start.parentNode)}}),n},bt=function(t,e){if(t.position===e.position)return"start"===t.type?"需要连接节点开始位置":"需要连接节点结束位置";var n,o;"end"===t.type?(n=t,o=e):"start"===t.type&&(n=e,o=t);var i=vt(n.parentNode,n.type),r=vt(o.parentNode,o.type),a=u.verifyConnection&&u.verifyConnection(n,o);if(a)return a;var c=i.nextSiblings;return c&&!~c.indexOf(r.key)?i.text+"节点只能连接"+c.map(function(t){return l.sbdnodes.maps[t]&&l.sbdnodes.maps[t].prototype.text}).join(",")+"节点":i.verifyConnection&&i.verifyConnection(i,i,r)||r.verifyConnection&&r.verifyConnection(r,i,r)},wt=function(t){t.x>o-t.width-100&&(e.diagramWidth=o=t.x+t.width+100),t.y>i-100&&(i=t.y+t.height+100),W.resizeScrollBar()},kt=function(t){return!(t.t<-z||t.l<-O||t.b+z>h||t.r+O>f)},Et=function(t){var e,n=s,o=m;if(u.dragable||u.scroll){var i=(e={x:0,y:0},St(function(t){"horizontal"===g?e.x=Math.max(e.x,t.x):"vertical"===g&&(e.y=Math.max(e.y,t.y))}),e);0<i.y?o=i.y+t.height+20:0<i.x&&(n=i.x+t.width+20)}return 0===b.length&&("horizontal"===g?o=h/2-20:"vertical"===g&&(n=f/2-80)),{x:n,y:o}},St=function(t){for(var e=0,n=b.length;e<n;e++)t(b[e],e,b)},Ct=function(t,e){if(!t)return!1;F();var n=JSON.parse(t);B=n.scale,l.scaleChanged(B),g=n.direction,l.directionChanged(g),n.dnodes.map(function(t){return it(t.key,"restore",t)}),n.connects.map(function(t){return t.parentNode=w[t.parentNode]||{},rt(t)}),n.paths.map(function(t){return t.start=C[t.start]||{},t.end=C[t.end]||{},ct(t)}),o=n.diagramWidth,i=n.diagramHeight,n.diagramWidth<f&&"full"===u.diagramSize&&(o=f),n.diagramHeight<h&&"full"===u.diagramSize&&(i=h),y=n.gridWidth,v=n.gridLineWidth,x=n.gridAlign,D=n.currentId,W.triggerScrollByOffset(),G(null)},Nt=function(t){var e=JSON.stringify({dnodes:b.map(function(t){var e=kutil.clone(t);return delete e.cmbutton,delete e.cmenu,e}),connects:S.map(function(t){var e=kutil.clone(t);return e.parentNode=e.parentNode.id,e}),paths:k.map(function(t){var e=kutil.clone(t);return e.start=e.start.id,e.end=e.end.id,delete e.points,e}),diagramWidth:o,diagramHeight:i,gridWidth:y,gridAlign:x,scale:B,direction:g,currentId:D});l.$ghistory.saveState(e),l.updateToolbar()},Pt=function(t){requestAnimationFrame(function(){d.clearRect(0,0,f,h),d.save(),d.translate(O,z),d.scale(B,B),Lt(),Mt(),Bt(),Dt(),d.restore()})},Lt=function(){var t=0,e=0;for(d.beginPath(),d.strokeStyle="#EEEEEE",d.lineWidth=v;e<i;)d.moveTo(0,e),d.lineTo(o,e),e+=y;for(;t<o;)d.moveTo(t,0),d.lineTo(t,i),t+=y;d.stroke()},Mt=function(){St(function(t){t.draw(),Tt(t)})},Tt=function(t){at(t).forEach(function(t){M&&t.drawOutline(),t.draw()})},Dt=function(){St(function(t){t.isShowMenu&&(t.cmenu.forEach(function(t){t.draw()}),t.cmenu.forEach(function(t){t.entering&&t.drawTitle()}))})},Bt=function(){N&&N.draw(),k.forEach(function(t){t.connectPoints(),t.draw()})},Ot=function(t){return t/B},zt=function(t){var e=Array.from(arguments).slice(1);Yt[t].apply(Yt,e),"undo"===t||"redo"===t?Pt("restore"):Pt()},Yt={insert:function(t,e,n,o,i){var r,a;if(!u.beforeInsertDNode||u.beforeInsertDNode(t,e,n)){var c=it(t,e,n,o);a={parentNode:r=c},"vertical"===g?(r.top&&rt(a,"top"),r.bottom&&rt(a,"bottom")):"horizontal"===g&&(r.left&&rt(a,"left"),r.right&&rt(a,"right")),Nt("insert"),i&&kutil.isFunction(i)&&i(c)}},copy:function(){X=Y},paste:function(){if(!X)return!1;this.insert(X.key,"copy",X),Nt("paste")},splice:function(){var o=null,i=null;return St(function(t,e,n){t===Y&&(i=n,o=e)}),G(null),i.splice(o,1)[0]},delete:function(t){var e,n=t||Y;G(null),Z(e=n,"del"),tt(e,"del"),et(e,"del"),nt(e,"del"),b.splice(b.indexOf(n),1),delete w[n.id],st(n).forEach(function(t){t.start.parentNode.showCMButton(),t.start.parentNode.cmbutton&&ft(t.start.parentNode),k.splice(k.indexOf(t),1),0===lt(t.start).length&&t.start.disConnect(),0===lt(t.end).length&&t.end.disConnect()}),at(n).forEach(function(t){S.splice(S.indexOf(t),1),delete C[t.id]}),Nt("delete dnode")},tofront:function(){var t=this.splice();b.push(t),H.moveEvent(t,"push"),at(t).forEach(function(t){H.moveEvent(t,"push")}),t.cmbutton&&H.moveEvent(t.cmbutton,"push"),Nt("dnode to front")},toback:function(){var t=this.splice();b.unshift(t),H.moveEvent(t,"unshift"),at(t).forEach(function(t){H.moveEvent(t,"unshift")}),t.cmbutton&&H.moveEvent(t.cmbutton,"unshift"),Nt("dnode to back")},undo:function(){Ct(l.$ghistory.prevState())},redo:function(){Ct(l.$ghistory.nextState())},zoomin:function(){B=B<2?kutil.sum(B,.2):2,l.scaleChanged(B),Nt("scale changed")},zoomout:function(){B=.6<B?kutil.minus(B,.2):.6,l.scaleChanged(B),Nt("scale changed")},fitpage:function(){B=1,l.scaleChanged(B),Nt("scale changed")},fitpagewidth:function(){B=parseFloat((f/o).toFixed(2)),l.scaleChanged(B),Nt("scale changed")},editText:function(){Nt("edit dnode text")},changeDir:function(t){g=t,l.directionChanged(t),Nt("direction changed")}};return kutil.extend(l,{$trigger:zt,getSelectedDNode:function(){return Y}}),kutil.extend(e,{reset:F,reboot:function(){V()},refs:I,draw:Pt,container:t,initCanvas:function(){H.init(I.diagramDragLayer),K(),F(),J(O,z),l.directionChanged(u.direction),I.diagramDragLayer.on("mousedown",j.mousedown),Pt(),Nt("init diagram")},resizeCanvas:K,scaleChanged:function(){var t=f-o*B,e=h-i*B;O=0<t?t/2:0,z=0<e?e/2:0,H.setOffset(O,z),H.setScale(B),W.resizeScrollBar()},directionChanged:function(n){S.forEach(function(t){"vertical"===g?"left"===t.position?t.setPosition("top"):"right"===t.position&&t.setPosition("bottom"):"horizontal"===g&&("top"===t.position?t.setPosition("left"):"bottom"===t.position&&t.setPosition("right"))}),b.forEach(function(e){e.dir=n,e.cmenuOffsetX=0,e.cmenuOffsetY=0,e.cmenu.forEach(function(t){t.follow(e,"directionChanged")}),pt(e),Q(e)}),k.forEach(function(t){t.dir=n})},saveState:Nt,restoreState:Ct,clearState:function(){F(),W.resizeScrollBar(),Pt()},getPathsMaps:function(){return E},getAllDNodes:function(){return b},getConnects:at,getAllConnects:function(){return S},getAllPaths:function(){return k},getPrevSibling:xt,getPrevSiblingByKey:function(t,e){for(var n=xt(t);n&&n.key!==e;)n=xt(n);return n},getNextSibling:function(t){var n=null;return at(t).forEach(function(t){if("end"===t.type){var e=lt(t);0<e.length&&(n=e[0].end.parentNode)}}),n}}),A(),e},u=(n(0),"");document.addEventListener?l="addEventListener":document.attachEvent&&(l="attachEvent",u="on");var d=function(t,e,n,o){t[l](u+e,n,o)};function h(t){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var p=function(t,e){return!!m(t)&&(window.getComputedStyle?e?window.getComputedStyle(t,null)[e]:window.getComputedStyle(t,null):e?t.currentStyle[e]:t.currentStyle)},m="object"===("undefined"==typeof HTMLElement?"undefined":h(HTMLElement))?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"===h(t)&&1===t.nodeType&&"string"==typeof t.nodeName},g=function(t){this.dom=t,this.display="block",this.isHide="none"===p(t,"display")};g.prototype={append:function(t){return this.dom.appendChild(t.dom),this},prepend:function(t){return this.dom.insertBefore(t.dom,this.dom.childNodes[0]),this},insertBefore:function(t){return t.dom.parentNode.insertBefore(this.dom,t.dom),this},remove:function(){return this.dom.parentNode&&this.dom.parentNode.removeChild(this.dom),this},css:function(t,e){if("object"===h(t)){var n=t;for(var o in n)this.dom.style[o]=n[o]}else this.dom.style[t]=e;return this},hasClass:function(t){return this.dom.classList.contains(t)},addClass:function(t){return this.dom.classList.add(t),this},removeClass:function(t){return this.dom.classList.remove(t),this},toggleClass:function(t){return this.hasClass(t)?this.removeClass(t):this.addClass(t),this},show:function(){return this.dom.style.display=this.display,this.isHide=!1,this},hide:function(){var t=p(this.dom,"display");return"none"!==t&&(this.display=t||"block",this.dom.style.display="none",this.isHide=!0,this)},toggle:function(){return this.isHide?this.show():this.hide(),this},attrs:function(t){for(var e in t)this.dom.setAttribute(e,t[e]);return this},props:function(t){for(var e in t)this.dom[e]=t[e];return this},html:function(t){return t||""===t?(this.dom.innerHTML=t,this):this.dom.innerHTML},text:function(t){return t?(this.dom.textContent=t,this):this.dom.textContent},on:function(t,e,n){return d(this.dom,t,e,n),this},onWheel:function(t,e){return function(t,e,n){var o="wheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";d.apply(this,[t,o,function(t){e({originalEvent:t,target:t.target||t.srcElement,type:"wheel",deltaX:t.wheelDeltaX?-.025*t.wheelDeltaX:0,deltaY:t.wheelDelta?-.025*t.wheelDelta:t.deltaY||t.detail,preventDefault:function(){t.preventDefault?t.preventDefault:t.returnValue=!1}})},n])}(this.dom,t,e),this},height:function(t){return"boolean"==typeof t&&t?this.dom.offsetHeight:"number"==typeof t?(this.dom.style.height=t+"px",this):this.dom.clientHeight},width:function(t){return"boolean"==typeof t&&t?this.dom.offsetWidth:"number"==typeof t?(this.dom.style.width=t+"px",this):this.dom.clientWidth},getBoundingClientRect:function(){return this.dom.getBoundingClientRect()}},window.$k=function(t){return t.window===window&&console.log(t),m(t)||t instanceof DocumentFragment||t.window===window?new g(t):new g(document.querySelector(t))};var k=function(t){var e,n,o,i,r=this,a={},c=$k(document.createDocumentFragment()),s=$k(t.container||document.getElementsByTagName("body")[0]),l={container:s},u=function(){d(),e.resizeCanvas(),e.draw()},d=function(){s.css({width:(kutil.isFunction(t.containerWidth)?t.containerWidth():t.containerWidth)+"px",height:(kutil.isFunction(t.containerHeight)?t.containerHeight():t.containerHeight)+"px"})},f=function(){a={refs:l,resize:u,updateToolbar:function(){n.updateTools()},updateFormat:function(){},updateDiagram:function(){e.draw()},scaleChanged:function(t){e.scaleChanged(t),i.scaleChanged(t)},directionChanged:function(t){e.directionChanged(t),i.directionChanged(t)},message:function(t){alert(t.message)},$ghistory:new y},r.graph=a},h=function(){e=new w(a,t.diagram),r.diagram=e,c.append(e.container)},p=function(){n=new v(a,t.toolbar),r.toolbar=n,c.append(l.toolbar)},m=function(){o=new x(a,t.sidebar),r.sidebar=o,c.append(o.container)},g=function(){i=new b(a,t.footer),r.footer=i,e.container.append(i.container)};r.resize=u,r.set=function(t,e){a[t]=e},r.getState=function(){return a.$ghistory.currentState()},r.reboot=function(){console.log("reboot"),e.reboot()},r.init=function(){return d(),f(),p(),m(),h(),g(),s.html(""),s.append(c),s.addClass("kgraph-container"),s.on("mousedown",function(t){t.preventDefault()}),s.on("mousemove",function(t){t.preventDefault()}),s.on("contextmenu",function(t){t.preventDefault()}),new Promise(function(t){e.initCanvas(),n.updateTools(),t()})}};window.KGraph=k,window.kcomponents={DNode:f,Path:Wt,ConnectPoint:Xt,ConnectsMenuItem:It,ConnectsMenuButton:Ht}}]);