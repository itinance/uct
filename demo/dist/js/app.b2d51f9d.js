(function(t){function e(e){for(var r,c,u=e[0],s=e[1],l=e[2],d=0,b=[];d<u.length;d++)c=u[d],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&b.push(a[c][0]),a[c]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);i&&i(e);while(b.length)b.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],r=!0,u=1;u<n.length;u++){var s=n[u];0!==a[s]&&(r=!1)}r&&(o.splice(e--,1),t=c(c.s=n[0]))}return t}var r={},a={app:0},o=[];function c(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=r,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)c.d(n,r,function(e){return t[e]}.bind(null,r));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],s=u.push.bind(u);u.push=e,u=u.slice();for(var l=0;l<u.length;l++)e(u[l]);var i=s;o.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";n("85ec")},1:function(t,e){},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("DemoApp")],1)},o=[],c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"home"},[n("b-container",{attrs:{fluid:""}},[n("b-row",[n("b-col",{attrs:{cols:"4",offset:"2"}},[n("b-form-radio-group",{staticStyle:{margin:"0 2rem 2rem 0"},attrs:{options:t.options},model:{value:t.selectedOption,callback:function(e){t.selectedOption=e},expression:"selectedOption"}})],1)],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v("Start Date:")]),n("b-col",{attrs:{cols:"2"}},[n("b-input",{model:{value:t.tempStartDate,callback:function(e){t.tempStartDate=e},expression:"tempStartDate"}})],1),n("b-col",{attrs:{cols:"1"}},[n("b-btn",{on:{click:t.setStart}},[t._v("Set")])],1),n("b-col",{attrs:{cols:"2"}},[n("b-checkbox",{model:{value:t.useStartDate,callback:function(e){t.useStartDate=e},expression:"useStartDate"}},[t._v("Use Start Date")])],1)],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v("Contract:")]),n("b-col",{attrs:{cols:"4"}},[n("b-input",{attrs:{size:"42"},model:{value:t.contractAddress,callback:function(e){t.contractAddress=e},expression:"contractAddress"}})],1),n("b-col",{attrs:{cols:"1"}},[n("b-btn",{on:{click:t.connectContract}},[t._v("Connect")])],1)],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Gesamt: ")]),n("b-col",{attrs:{cols:"1"}},[n("b-input",{attrs:{placeholder:"Gesamt"},model:{value:t.totalAmount,callback:function(e){t.totalAmount=e},expression:"totalAmount"}})],1)],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Datum: ")]),n("b-col",{attrs:{cols:"5"}},[n("b-calendar",{model:{value:t.dateString,callback:function(e){t.dateString=e},expression:"dateString"}}),n("b-time",{attrs:{"show-seconds":""},model:{value:t.timeString,callback:function(e){t.timeString=e},expression:"timeString"}})],1)],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Aktueller Anspruch: ")]),n("b-col",{attrs:{cols:"3"}},[t._v(" "+t._s((t.activatedAmount*t.totalAmount).toFixed(4))+" ")])],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Aktueller Burn ")]),n("b-col",{attrs:{cols:"3"}},[t._v(" "+t._s(t.burnAmount.toFixed(5))+" ")])],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Gewünschte Ausschüttung: ")]),n("b-col",{attrs:{cols:"1"}},[n("b-input",{model:{value:t.wantedAmount,callback:function(e){t.wantedAmount=e},expression:"wantedAmount"}})],1)],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Tokens an Wallet: ")]),n("b-col",{attrs:{cols:"1"}},[t._v(" "+t._s((t.wantedAmount*(1-t.burnAmount)).toFixed(3))+" ")]),n("b-col",{attrs:{cols:"1"}},[t._v(" ("+t._s((t.activatedAmount*t.totalAmount*(1-t.burnAmount)).toFixed(3))+") ")])],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Tokens Burned: ")]),n("b-col",{attrs:{cols:"1"}},[t._v(" "+t._s((t.wantedAmount*t.burnAmount).toFixed(3))+" ")]),n("b-col",{attrs:{cols:"1"}},[t._v(" ("+t._s((t.activatedAmount*t.totalAmount*t.burnAmount).toFixed(3))+") ")])],1),n("b-row",[n("b-col",{attrs:{cols:"3"}},[t._v(" Tokens Übrig: ")]),n("b-col",{attrs:{cols:"1"}},[t._v(" "+t._s((t.activatedAmount*t.totalAmount-t.wantedAmount).toFixed(3))+" ")]),n("b-col",{attrs:{cols:"1"}},[t._v(" (0.000) ")])],1)],1)],1)},u=[],s=n("1da1"),l=(n("96cf"),n("ac1f"),n("1276"),n("a9e3"),n("c030")),i={name:"DemoApp",data:function(){return{totalAmount:"",dateString:(new Date).toISOString().split("T")[0],timeString:"00:00:00",startDate:new Date(2021,3,15),tempStartDate:new Date(2021,3,15).getTime()/1e3,useStartDate:!0,wantedAmount:0,provider:null,options:[{text:"Javascript",value:"javascript"},{text:"Testnet",value:"testnet"}],selectedOption:"javascript",contractAddress:"0xb16c169fC9D35a011A59A87E61E7a03a563576c7",contract:null}},components:{},computed:{date:{get:function(){return new Date(this.dateString+"T"+this.timeString)}}},asyncComputed:{activatedAmount:{get:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n,r,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n=0,console.log("Calculating Amount"),"javascript"!==t.selectedOption){e.next=6;break}return e.abrupt("return",t.calcActivatedAmount(t.startDate,t.date));case 6:if("testnet"!==t.selectedOption){e.next=22;break}if(!t.useStartDate){e.next=16;break}return e.t0=Number,e.next=11,t.contract.calcActivatedPercent(t.convertDate(t.startDate),t.convertDate(t.date));case 11:e.t1=e.sent,r=(0,e.t0)(e.t1),n=r*Math.pow(10,-18),e.next=22;break;case 16:return e.t2=Number,e.next=19,t.contract.getActivatedPercent(t.convertDate(t.date));case 19:e.t3=e.sent,a=(0,e.t2)(e.t3),n=a*Math.pow(10,-18);case 22:return e.abrupt("return",Number(n));case 23:case"end":return e.stop()}}),e)})))()},default:0},burnAmount:{get:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n,r,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n=0,console.log("Calculating Burn"),"javascript"!==t.selectedOption){e.next=6;break}return e.abrupt("return",t.calcBurnAmount(t.startDate,t.date));case 6:if("testnet"!==t.selectedOption){e.next=22;break}if(!t.useStartDate){e.next=16;break}return e.t0=Number,e.next=11,t.contract.calcBurnPercent(t.convertDate(t.startDate),t.convertDate(t.date));case 11:e.t1=e.sent,r=(0,e.t0)(e.t1),n=r*Math.pow(10,-18),e.next=22;break;case 16:return e.t2=Number,e.next=19,t.contract.getBurnPercent(t.convertDate(t.date));case 19:e.t3=e.sent,a=(0,e.t2)(e.t3),n=a*Math.pow(10,-18);case 22:return e.abrupt("return",Number(n));case 23:case"end":return e.stop()}}),e)})))()},default:.8}},methods:{calcActivatedAmount:function(t,e){var n=26352e5,r=Math.floor(Math.abs((e-t)/n)),a=Math.floor(r/3);return Math.min(.05*a,1)},calcBurnAmount:function(t,e){var n=864e5,r=Math.floor(Math.abs((e-t)/n)),a=.8-r*(.8/730);return Math.max(a,0)},convertDate:function(t){return Math.floor(t.getTime()/1e3)},connectContract:function(){this.provider=new l["a"].providers.EtherscanProvider("rinkeby",Object({NODE_ENV:"production",BASE_URL:"/"}).ETHERSCAN_API_KEY);var t=["function calcActivatedPercent(uint256 startDate, uint256 endDate) public pure returns (uint256)","function calcBurnPercent(uint256 startDate, uint256 endDate) public pure returns (uint256)","function getActivatedPercent(uint256 endDate) public view returns (uint256)","function getBurnPercent(uint256 endDate) public view returns (uint256)"];this.contract=new l["a"].Contract(this.contractAddress,t,this.provider)},setStart:function(){this.startDate=new Date(Number(1e3*this.tempStartDate))}},mounted:function(){this.connectContract()}},d=i,b=n("2877"),p=Object(b["a"])(d,c,u,!1,null,"39e15e3a",null),f=p.exports,m={name:"App",components:{DemoApp:f}},v=m,A=(n("034f"),Object(b["a"])(v,a,o,!1,null,null,null)),h=A.exports,w=n("5f5b"),g=n("b1e0"),D=n("3003");n("f9e3"),n("2dd8");r["default"].use(w["a"]),r["default"].use(g["a"]),r["default"].use(D["a"]),r["default"].config.productionTip=!1,new r["default"]({render:function(t){return t(h)}}).$mount("#app")},"85ec":function(t,e,n){}});
//# sourceMappingURL=app.b2d51f9d.js.map