webpackJsonp([12],{"62NF":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("Dd8w"),n=s.n(a),c=s("NYxO"),i=s("F+jZ"),r=s("SQjO"),d={props:["msg"],computed:n()({},Object(c.c)(["selectedChat","getUserId"]),Object(c.e)(["chatListStore","chatuserInfoStore"])),data:function(){return{getTimes:i.d,config:r.a}},mounted:function(){},watch:{},created:function(){},methods:n()({},Object(c.b)([]),Object(c.d)([])),filters:{}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"time"},[a("span",[t._v(" "+t._s(t.msg.addtime))])]),t._v(" "),a("div",{staticClass:"main"},[1==t.msg.type?a("img",{staticClass:"avatar",staticStyle:{width:"36px",height:"36px"},attrs:{src:s("wMuH")}}):t._e(),t._v(" "),2==t.msg.type?a("img",{staticClass:"avatar",staticStyle:{width:"36px",height:"36px"},attrs:{src:s("eaQ4")}}):t._e(),t._v(" "),1==t.msg.type?a("span",{staticClass:"chat-username"},[t._v("\n      网站公告\n    ")]):a("span",{staticClass:"chat-username"},[t._v("\n      站内信\n    ")]),t._v(" "),a("div",{staticClass:"content chat-content-dom"},[a("div",{staticClass:"text"},[a("b",[t._v("\n          "+t._s(t.msg.title)+"\n        ")]),t._v(" "),a("div",[t._v("\n          "+t._s(t.msg.content)+"\n        ")])])])])])},staticRenderFns:[]};var p=s("VU/8")(d,o,!1,function(t){s("BBCs")},"data-v-ffefa740",null);e.default=p.exports},BBCs:function(t,e){},eaQ4:function(t,e,s){t.exports=s.p+"pcImstatic/img/zhannei.cfa9dda.png"},wMuH:function(t,e,s){t.exports=s.p+"pcImstatic/img/wanzhan.b193633.png"}});