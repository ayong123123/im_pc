webpackJsonp([57],{gRcc:function(e,t){},mPzE:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("Dd8w"),i=s.n(n),r=s("NYxO"),a=s("F+jZ"),o=s("SQjO"),c={props:["msg","forbiddenInfo"],data:function(){return{getTimes:a.d,config:o.a,errorTimer:null}},computed:i()({},Object(r.c)(["selectedChat","getUserId","getGroupRemarkName","isBoss","isManagement"]),Object(r.e)(["msgListStore","chatListStore","chatuserInfoStore","friendsListStore"])),beforeDestroy:function(){clearTimeout(this.errorTimer)},created:function(){var e=this;this.errorTimer=setTimeout(function(){e.setError()},1e4)},mounted:function(){},watch:{},methods:i()({isStopTalking:function(e){this.$emit("isStopTalking",e)},removeGroupUser:function(e){this.$emit("removeGroupUser",e)},openHandleUserVible:function(e){this.$emit("openHandleUserVible",e)},setError:function(){this.msg.code&&3!=this.msg.code||this.msg.status!=this.config.MSG_STATUS_SED||(this.msg.status=this.config.MSG_STATUS_ERROR,clearTimeout(this.errorTimer))},chongFa:function(){var e=this;(this.msg.send_uid&&this.msg.send_uid==this.getUserId||this.msg.userMsg&&this.msg.status==this.config.MSG_STATUS_ERROR)&&this.$confirm("是否重发该消息?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$emit("reSendMessage",e.msg)}).catch(function(){})},messageBack:function(){var e=this;this.msg.send_uid&&this.msg.send_uid==this.getUserId||this.msg.userMsg&&this.msg.status==this.config.MSG_STATUS_SUCCEED||this.isBoss&&2==this.msgListStore.activeTyep||this.isManagement&&2==this.msgListStore.activeTyep?this.$emit("openConfig",this.msg):this.$confirm("是否转发该消息?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$emit("getZhuanFa")}).catch(function(){})},findUser:function(e){this.$emit("setFindUser",e)}},Object(r.d)(["setPicture"])),filters:{}},u={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"time"},[e.msg.showTime?e._e():s("span",[e._v(e._s(e.getTimes(e.msg.create_time)))])]),e._v(" "),s("div",{staticClass:"main",class:{self:e.msg.userMsg||e.msg.send_uid==e.getUserId}},[e.msg.head_portrait?s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.msg.head_portrait,expression:"msg.head_portrait"}],staticClass:"avatar",attrs:{width:"36",height:"36"},on:{click:function(t){return e.findUser(e.msg)},contextmenu:function(t){return t.preventDefault(),e.openHandleUserVible(e.msg)}}}):e.msg.send_uid==e.getUserId?s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.chatuserInfoStore.dataGetInfo.head_portrait,expression:"chatuserInfoStore.dataGetInfo.head_portrait"}],staticClass:"avatar",attrs:{width:"36",height:"36"},on:{click:function(t){return e.findUser(e.msg)},contextmenu:function(t){return t.preventDefault(),e.openHandleUserVible(e.msg)}}}):s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.selectedChat.user.img,expression:"selectedChat.user.img"}],staticClass:"avatar",attrs:{width:"36",height:"36"},on:{click:function(t){return e.findUser(e.msg)},contextmenu:function(t){return t.preventDefault(),e.openHandleUserVible(e.msg)}}}),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.chatListStore.handleUserVible&&e.forbiddenInfo.unique_value==e.msg.unique_value&&e.msg.send_uid!=e.getUserId,expression:"chatListStore.handleUserVible && forbiddenInfo.unique_value ==msg.unique_value && msg.send_uid != getUserId"}],staticClass:"handleConfig"},[s("ul",[2!=e.forbiddenInfo.forbiddenStatus?s("li",{on:{click:function(t){return e.isStopTalking(e.msg)}}},[e._v("\n          禁言\n        ")]):e._e(),e._v(" "),1!=e.forbiddenInfo.forbiddenStatus?s("li",{on:{click:function(t){return e.isStopTalking(e.msg)}}},[e._v("\n          解禁\n        ")]):e._e(),e._v(" "),s("li",{on:{click:function(t){return e.removeGroupUser(e.msg)}}},[e._v("\n          移除\n        ")]),e._v(" "),s("li",{on:{click:function(t){return e.findUser(e.msg)}}},[e._v("\n          @TA\n        ")])])]),e._v(" "),e.msg.userMsg||e.msg.send_uid==e.getUserId?s("span",{staticClass:"chat-username"},[s("wx-level",{attrs:{msg:e.msg}}),e._v(e._s(e.chatuserInfoStore.dataGetInfo.nickname)+"\n    ")],1):1==e.msgListStore.activeTyep?s("span",{staticClass:"chat-username"},[e._v("\n      "+e._s(e.msgListStore.activeName)),s("wx-level",{attrs:{msg:e.msg}})],1):s("span",{staticClass:"chat-username"},[e._v("\n      "+e._s(e.getGroupRemarkName({uid:e.msg.asFrom,send_uid:e.msg.send_uid})||e.msg.nickname||e.msg.username)),s("wx-level",{attrs:{msg:e.msg}})],1),e._v(" "),s("div",{staticClass:"chat-img chat-content-dom",on:{click:function(t){return e.setPicture({img:e.msg.content,state:!0})},contextmenu:function(t){return t.preventDefault(),e.messageBack()}}},[s("img",{attrs:{src:e.msg.content,alt:"图片",width:"100"}}),e._v(" "),e.msg.status==e.config.MSG_STATUS_SED?s("i",{staticClass:"el-icon-loading chat-loading"}):e._e(),e._v(" "),e.msg.status==e.config.MSG_STATUS_ERROR?s("i",{staticClass:"el-icon-warning chat-loading error",on:{click:function(t){return e.chongFa()}}}):e._e()])])])},staticRenderFns:[]};var m=s("VU/8")(c,u,!1,function(e){s("gRcc")},"data-v-4381cc6c",null);t.default=m.exports}});