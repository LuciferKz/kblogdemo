!function(n){var o={};function r(t){if(o[t])return o[t].exports;var e=o[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,r),e.l=!0,e.exports}r.m=n,r.c=o,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}({1:function(t,e,n){"use strict";n.r(e);n(3),n(13),n(16);window.onload=function(){console.log(kcomponents);var t=new KGraph({container:document.getElementById("kgraph-container"),containerWidth:null,containerHeight:function(){return 600<window.innerHeight?window.innerHeight-60:540},diagram:{dragable:!1,scroll:!0,horizontalAlign:"center",verticalAlign:"center",gridWidth:10,gridLineWidth:2,gridAlign:!0,direction:"horizontal",contextMenu:!0,diagramSize:"full",diagramWidth:1002,diagramHeight:802,offsetX:240,afterCreatePath:function(t){pathCount++,!t.campaignNodeId&&(t.campaignNodeId="flow"+(+new Date+10*pathCount))}},toolbar:{toolsHidden:!1},footer:{hidden:!1},sidebar:{hidden:!1}});t.init().then(function(){t.sidebar.createSection("组1",[{key:"Start",text:"Start",value:"start",iconText:"&#xe6ec;",top:!1,left:!1,onlyone:!0},{key:"Start",text:"Start",value:"start",iconText:"&#xe6ec;",top:!1,left:!1,onlyone:!0},{key:"Start",text:"Start",value:"start",iconText:"&#xe6ec;",top:!1,left:!1,onlyone:!0},{key:"Start",text:"Start",value:"start",iconText:"&#xe6ec;",top:!1,left:!1,onlyone:!0},{key:"Start",text:"Start",value:"start",iconText:"&#xe6ec;",top:!1,left:!1,onlyone:!0},{key:"Start",text:"Start",value:"start",iconText:"&#xe6ec;",top:!1,left:!1,onlyone:!0}]),t.sidebar.createSection("组2",[]),window.onresize=t.resize})}},13:function(t,e){},16:function(t,e){},3:function(t,e){}});