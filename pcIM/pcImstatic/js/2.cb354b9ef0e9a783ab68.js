webpackJsonp([2],{"/oZl":function(e,t,s){e.exports=s.p+"pcImstatic/img/lei0.2449e92.png"},"8gou":function(e,t,s){e.exports=s.p+"pcImstatic/img/niu4.007de97.png"},"9K3T":function(e,t,s){e.exports=s.p+"pcImstatic/img/lei4.39ec222.png"},CkrH:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei2.cd954df.png"},"Dd6+":function(e,t,s){e.exports=s.p+"pcImstatic/img/niu3.2ed02d6.png"},E5UF:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei9.e4e4ef8.png"},ENhF:function(e,t,s){var a={"./niu-chartlet.png":"cZSi","./niu-red-bottom.png":"WYe7","./niu-samll.png":"NCnV","./niu.png":"RIsi","./niu0.png":"Httv","./niu1.png":"hwuh","./niu2.png":"tyyw","./niu3.png":"Dd6+","./niu4.png":"8gou","./niu5.png":"XnnK","./niu6.png":"qsCM","./niu7.png":"o7ZO","./niu8.png":"ablf","./niu9.png":"SJ+b"};function i(e){return s(n(e))}function n(e){var t=a[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}i.keys=function(){return Object.keys(a)},i.resolve=n,e.exports=i,i.id="ENhF"},FoZK:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei7.a928e9e.png"},G9kE:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s("bOdI"),i=s.n(a),n=s("Dd8w"),r=s.n(n),o=s("NYxO"),c=s("F+jZ"),p={data:function(){return{timer:null,h1:0,h2:0,m1:0,m2:0,s1:0,s2:0,alltime:0,redMessage:{grab:"",base:""},pageData:{page:1,repcode:""},totalPages:"",total:"",list:[],dialogData:{visible:!1,id:""}}},computed:r()({},Object(o.e)(["wechatIMstore"]),Object(o.c)([]),i()({redTime:function(){if(this.redMessage.base.hltime>60){var e=this.redMessage.base.hltime/60;return parseInt(e)+"小时"}return this.redMessage.base.hltime+"分钟"},packInfo:function(){return this.wechatIMstore.sendRedPackMessage},redTimeState:function(){return!(2==this.redMessage.base.type&&(this.alltime<2||0==this.redMessage.base.reperson)||1==this.redMessage.base.type&&(this.alltime<2||0==this.redMessage.base.reperson))}},"redTime",function(){if(this.redMessage.base.hltime>60){var e=this.redMessage.base.hltime/60;return parseInt(e)+"小时"}return this.redMessage.base.hltime+"分钟"})),watch:{},beforeDestroy:function(){clearTimeout(this.timer)},created:function(){var e=this;this.pageData.repcode=this.packInfo.repcode;var t={token:Object(c.c)("token"),repcode:this.packInfo.repcode,gtype:this.wechatIMstore.getOrCheck,qtype:1,compatible:2};this.getRedPackAction(t).then(function(t){e.redMessage.grab=t.grab,e.getListData()})},mounted:function(){},methods:r()({},Object(o.b)(["getRedPackAction","getbRedEnvelopeImList"]),Object(o.d)(["setModalState","setRedHuiIm","setBullDataIm","setChatGameState"]),{currentPage:function(e){this.pageData.page=e,this.getListData()},getListData:function(){var e=this;this.getbRedEnvelopeImList(this.pageData).then(function(t){t.base&&t.list&&(e.redMessage.base=t.base,e.totalPages=1*e.redMessage.base.person-1*e.redMessage.base.reperson,e.total=t.totalPages,e.list=t.list,e.alltime=e.redMessage.base.expired-e.redMessage.base.time,e.setChatGameState({data:t,type:1,chatType:2}),2==t.base.type?e.setBullDataIm({code:e.wechatIMstore.redUnique_value,detail:t}):e.setRedHuiIm({code:e.wechatIMstore.redUnique_value}),e.timeDown())})},lookPlay:function(){switch(this.dialogData.visible=!0,this.redMessage.base.type){case 1:this.dialogData.id=12;break;case 2:this.dialogData.id=13;break;case 3:this.dialogData.id=14}},timeDown:function(){var e=this;this.alltime>1?this.timer=setTimeout(function(){e.alltime--,e.timeDown(),e.lessen(e.alltime)},1e3):clearTimeout(this.timer)},lessen:function(e){var t,s,a,i=Math.abs(1e3*e)||0;t=Math.floor(i/1e3/60/60%24),(t+=24*(Math.floor(i/1e3/60/60/24)||0))<10?(this.h1="0",this.h2=""+t):(this.h1=""+Math.floor(t/10),this.h2=""+t%10),(s=Math.floor(i/1e3/60%60))<10?(this.m1="0",this.m2=""+s):(this.m1=""+Math.floor(s/10),this.m2=""+s%10),(a=Math.floor(i/1e3%60))<10?(this.s1="0",this.s2=""+a):(this.s1=""+Math.floor(a/10),this.s2=""+a%10)},getNiuNiu:function(e){return s("ENhF")("./niu"+e+".png")||s("RIsi")},getSaolei:function(e){return s("fhel")("./lei"+e+".png")||s("uWm1")}})},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.redMessage?a("div",{staticClass:"red-detail"},[a("i",{staticClass:"icon-set",on:{click:function(t){return e.setModalState("redDetailState")}}}),e._v(" "),a("div",{staticClass:"red-detail-head"},[a("div",{staticClass:"red-detial-div"},[a("div",[a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.redMessage.base.avatar,expression:"redMessage.base.avatar"}],attrs:{alt:""}})])]),e._v(" "),a("p",{staticClass:"red-name"},[e._v(e._s(e.redMessage.base.username)+"发的红包")]),e._v(" "),0==e.redMessage.base.reperson&&1==e.redMessage.base.isexpired?a("p",{staticClass:"red-name"},[e._v("红包已抢完")]):a("p",{staticClass:"red-name"},[e._v(e._s(e.redMessage.grab.tip))]),e._v(" "),1!=e.redMessage.base.type&&0!=e.redMessage.grab.money?a("p",{staticClass:"red-total"},[e._v("共"+e._s(e.redMessage.grab.money)+"元")]):e._e(),e._v(" "),2==e.redMessage.base.type?a("div",{staticClass:"flex-around game-niuniu"},[a("div",[e._v("庄："),a("span",{staticClass:"orange"},[e._v(e._s(e.redMessage.base.bwp)+" ")]),e._v("胜")]),e._v(" "),e.alltime>1&&0!=e.redMessage.base.reperson?a("div",{staticClass:"orange"},[e._v("\n        剩余时间"+e._s(e.m1)+e._s(e.m2)+":"+e._s(e.s1)+e._s(e.s2)+"\n      ")]):a("div",{staticClass:"orange"},[e._v("游戏已结束")]),e._v(" "),a("div",[e._v("闲："),a("span",{staticClass:"orange"},[e._v(e._s(e.redMessage.base.pwb)+" ")]),e._v("胜")])]):e._e(),e._v(" "),1==e.redMessage.base.type?a("div",{staticClass:"game-saolei"},[a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.getSaolei(1*e.redMessage.base.dval),expression:"getSaolei(redMessage.base.dval*1)"}],attrs:{alt:""}})]):e._e(),e._v(" "),3==e.redMessage.base.type?a("div",{staticClass:"game-saolei on",class:{dragon:e.redMessage.grab.money>0}},[a("img",{attrs:{src:s("rtBl"),alt:""}}),e._v(" "),2==e.redMessage.base.noc?a("div",[e._v("最佳手气接龙")]):a("div",[e._v("最差手气接龙")])]):e._e()]),e._v(" "),a("div",{staticClass:"content-deital flex"},[a("p",[e._v("已领取："+e._s(e.redMessage.base.person-e.redMessage.base.reperson)+"/"+e._s(e.redMessage.base.person)+"个，\n        共 "+e._s((e.redMessage.base.total-e.redMessage.base.retotal).toFixed(2))+"/"+e._s(e.redMessage.base.total)+"元")]),e._v(" "),0!=e.redMessage.base.type?a("span",{on:{click:function(t){return e.lookPlay()}}},[e._v("玩法")]):e._e()]),e._v(" "),a("div",{staticClass:"red-detail-content",style:3==e.redMessage.base.type||1==e.redMessage.base.type?{height:"285px"}:{height:"400px"}},[1==e.redMessage.base.type?a("ul",e._l(e.list,function(t,i){return a("li",{key:i},[a("div",{staticClass:"getname"},[0==i&&1==e.redMessage.base.isfirst?a("img",{attrs:{src:s("teNJ"),alt:""}}):a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.avatar,expression:"item.avatar"}],attrs:{alt:""}}),e._v(" "),a("div",{staticClass:"getniu"},[a("div",[0==i&&1==e.redMessage.base.isfirst?a("p",[e._v("免死")]):a("p",[e._v(e._s(t.username))])]),e._v(" "),a("p",{staticClass:"get-p"},[e._v(e._s(t.time))])])]),e._v(" "),a("div",{staticClass:"niu"},[0==e.redMessage.base.isfirst&&2==t.fval||1==e.redMessage.base.isfirst&&0!=i&&2==t.fval?a("img",{attrs:{src:s("uWm1"),alt:""}}):e._e(),e._v(" "),a("p",[e._v("\n            "+e._s(t.money)+"\n          ")])])])}),0):3==e.redMessage.base.type?a("ul",e._l(e.list,function(t,i){return a("li",[a("div",{staticClass:"getname"},[1==i&&1==e.redMessage.base.isfirst?a("img",{attrs:{src:s("teNJ"),alt:""}}):a("img",{directives:[{name:"laz",rawName:"v-laz",value:t.avatar,expression:"item.avatar"}],attrs:{alt:""}}),e._v(" "),a("div",{staticClass:"getniu"},[a("div",[1==i&&1==e.redMessage.base.isfirst?a("p",[e._v("免死")]):a("p",[e._v(e._s(t.username))])]),e._v(" "),a("p",{staticClass:"get-p"},[e._v(e._s(t.time))])])]),e._v(" "),a("div",{staticClass:"niu"},[a("p",[e._v("\n            "+e._s(t.money)+"\n            "),a("br"),e._v(" "),2==e.redMessage.base.noc&&2==t.fval?a("span",{staticClass:"orange",staticStyle:{"margin-left":"3px"}},[e._v("手气最佳")]):e._e(),e._v(" "),1==e.redMessage.base.noc&&2==t.fval?a("span",{staticClass:"orange",staticStyle:{"margin-left":"3px"}},[e._v("手气最差")]):e._e()])])])}),0):a("ul",{staticClass:"hongbao_box",style:e.total>1?{height:"350px"}:{height:"400px","border-bottom":"none"}},[e._l(e.list,function(t,i){return a("li",[a("div",{staticClass:"getname"},[a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.avatar,expression:"item.avatar"}],attrs:{alt:""}}),e._v(" "),a("div",{staticClass:"getniu"},[a("div",[a("p",[e._v(e._s(t.username))]),e._v(" "),0==i&&2==t.type?a("img",{attrs:{src:s("PmT5"),alt:""}}):e._e()]),e._v(" "),a("p",{staticClass:"get-p"},[e._v(e._s(t.time))])])]),e._v(" "),a("div",{staticClass:"niu"},[a("p",[e._v("\n            "+e._s(t.money)+"\n            "),a("br"),e._v(" "),e.redMessage.base.maxval==t.money&&0==t.type?a("span",{staticClass:"orange",staticStyle:{"margin-left":"3px"}},[e._v("手气最佳")]):e._e()]),e._v(" "),2==t.type?a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.getNiuNiu(1*t.fval),expression:"getNiuNiu(item.fval*1)"}],attrs:{alt:""}}):e._e()])])}),e._v(" "),e.redTimeState?a("p",{staticClass:"get-p tc"},[e._v("未领取的红包，将于"+e._s(e.redTime)+"发起退款")]):e._e()],2),e._v(" "),e.total>1?a("div",{staticClass:"box_bot"},[a("el-pagination",{attrs:{background:"","page-size":15,"pager-count":5,layout:"prev, pager, next",total:e.totalPages},on:{"current-change":e.currentPage}})],1):e._e()]),e._v(" "),e.dialogData.visible?a("wx-wanfa-detail",{attrs:{dialogData:e.dialogData}}):e._e()],1):e._e()},staticRenderFns:[]};var g=s("VU/8")(p,l,!1,function(e){s("Y0na")},"data-v-d2bcff46",null);t.default=g.exports},GUBF:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei5.42d01f9.png"},HPl3:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei6.3f5c665.png"},Httv:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu0.6917450.png"},NCnV:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu-samll.c7914c0.png"},PmT5:function(e,t,s){e.exports=s.p+"pcImstatic/img/zhuan.56ff447.png"},QWYW:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei3.4779f67.png"},RIsi:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu.e4265e1.png"},"SJ+b":function(e,t,s){e.exports=s.p+"pcImstatic/img/niu9.d0decaf.png"},WYe7:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu-red-bottom.94d2c64.png"},XnnK:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu5.0c4974e.png"},Y0na:function(e,t){},YBM9:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei8.14b5abc.png"},ablf:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu8.21c3e49.png"},cZSi:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu-chartlet.d79a931.png"},fhel:function(e,t,s){var a={"./lei.png":"uWm1","./lei0.png":"/oZl","./lei1.png":"ksCL","./lei2.png":"CkrH","./lei3.png":"QWYW","./lei4.png":"9K3T","./lei5.png":"GUBF","./lei6.png":"HPl3","./lei7.png":"FoZK","./lei8.png":"YBM9","./lei9.png":"E5UF"};function i(e){return s(n(e))}function n(e){var t=a[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}i.keys=function(){return Object.keys(a)},i.resolve=n,e.exports=i,i.id="fhel"},hwuh:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu1.ac7d94f.png"},ksCL:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei1.1a371c1.png"},o7ZO:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu7.065a18c.png"},qsCM:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu6.3765dcd.png"},rtBl:function(e,t,s){e.exports=s.p+"pcImstatic/img/open_dragon.640002c.png"},teNJ:function(e,t,s){e.exports=s.p+"pcImstatic/img/ms.0daad94.png"},tyyw:function(e,t,s){e.exports=s.p+"pcImstatic/img/niu2.c6fe7f3.png"},uWm1:function(e,t,s){e.exports=s.p+"pcImstatic/img/lei.9b75df6.png"}});