webpackJsonp([52],{HS2H:function(t,e){},zXvg:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("mvHQ"),n=s.n(i),a=s("Dd8w"),o=s.n(a),r=s("NYxO"),c=(s("zL8q"),s("SQjO")),u={data:function(){return{config:c.a}},computed:o()({},Object(r.e)(["chatListStore","msgListStore","indexStore","friendsListStore","chatuserInfoStore"]),Object(r.c)(["getUserId"])),watch:{},created:function(){this.getJoinApplyListAction({self_uid:this.getUserId})},mounted:function(){},methods:o()({},Object(r.b)(["getJoinApplyListAction","joinApplyAgreeAction","sendMessageIM","getFriendInfoAction"]),Object(r.d)(["setModalState"]),{openInfo:function(t){var e=this;this.getFriendInfoAction({self_uid:this.getUserId,friend_uid:t.uid}).then(function(t){e.setModalState("userInfoState")})},agreeJoinFn:function(t){var e=this,s={apply_id:t.uid,uid:this.getUserId,group_id:t.group_id,status:2};this.joinApplyAgreeAction(s).then(function(){var s={to:e.friendsListStore.groupChatInfoList.data.group_id,message:e.chatuserInfoStore.dataGetInfo.nickname+" 邀请 "+t.nickname+" 加入了群聊",type:c.a.MSG_GROUP_INGROUP,reserved:n()({level:e.indexStore.userHomeData.data.userlevelid.level,levelName:e.indexStore.userHomeData.data.userlevelid.levelName})},i={};i.groupName=e.friendsListStore.groupChatInfoList.data.group_name,i.count=e.friendsListStore.groupChatInfoList.data.count,s.groupinfo=i,e.sendMessageIM(s),e.getJoinApplyListAction({self_uid:e.getUserId})})},stopJoinFn:function(t){var e=this,s={apply_id:t.uid,uid:this.getUserId,group_id:t.group_id,status:3};this.joinApplyAgreeAction(s).then(function(){e.getJoinApplyListAction({self_uid:e.getUserId})})}})},d={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"assistant"},[i("div",{staticClass:"head_assistant"},[i("img",{attrs:{src:s("lK4b"),alt:""},on:{click:function(e){return t.setModalState("groupZhuShou")}}}),t._v(" "),i("span",[t._v("群助手")])]),t._v(" "),i("div",{staticClass:"notice-list"},[i("p",[t._v("\n      验证消息\n    ")]),t._v(" "),i("ul",t._l(t.friendsListStore.joinApplyList.data,function(e){return i("li",{staticClass:"flex",on:{click:function(s){return t.openInfo(e)}}},[i("div",{staticClass:"g_img"},[i("img",{attrs:{src:e.pic_attr,alt:""}})]),t._v(" "),i("div",{staticClass:"g_msg flex-1 flex-between"},[i("div",[i("b",[t._v(t._s(e.nickname))]),t._v(" "),i("div",{staticClass:"long-text"},[t._v("申请加入 "),i("span",{staticStyle:{color:"#ff0000"}},[t._v(t._s(e.group_name))])]),t._v(" "),i("p",{staticClass:"long-text"},[t._v(t._s(e.apply_msg))])]),t._v(" "),i("div",[1==e.status?i("span",{staticClass:"agree",on:{click:function(s){return s.stopPropagation(),t.agreeJoinFn(e)}}},[t._v("同意")]):t._e(),t._v(" "),1==e.status?i("span",{staticClass:"jujue",on:{click:function(s){return s.stopPropagation(),t.stopJoinFn(e)}}},[t._v("拒绝")]):t._e(),t._v(" "),2==e.status?i("span",{},[t._v("已同意")]):t._e(),t._v(" "),3==e.status?i("span",{staticStyle:{color:"#ff0000"}},[t._v("已拒绝")]):t._e()])])])}),0)])])},staticRenderFns:[]};var l=s("VU/8")(u,d,!1,function(t){s("HS2H")},"data-v-5f3cf8ad",null);e.default=l.exports}});