webpackJsonp([63],{FF02:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Dd8w"),s=a.n(n),r=a("NYxO"),i={data:function(){return{parm:{uid:"",page:1,page_size:10},currentPage:1,pagesize:10,userList:[],showData:0}},computed:s()({},Object(r.c)(["getUserId"]),Object(r.e)(["friendsListStore","chatuserInfoStore"])),created:function(){var t=this;this.parm.uid=this.getUserId,this.getAccountChange(this.parm).then(function(e){t.showData=1e4==e?0:1})},methods:s()({},Object(r.b)(["getAccountChange"]),Object(r.d)(["windowMove"]),{handleCurrentChange:function(t){var e=this;this.parm.page=t,this.getAccountChange(this.parm).then(function(t){e.showData=1e4==t?0:1})}})},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"Info-wrapper"},[a("div",{staticClass:"newfriend",on:{mousedown:function(e){return t.windowMove(e)}}},[a("div",{staticClass:"nickname"},[t._v("账变列表")])]),t._v(" "),a("div",{staticClass:"account-info"},[a("table",[t._m(0),t._v(" "),t._l(t.chatuserInfoStore.dataAccountChange.data,function(e){return 0==t.showData?a("tr",{staticClass:"trChange"},[a("td",{class:1*e.status==2||1*e.status==4?"greenn":"redd"},[a("span",[t._v(t._s(1*e.status==2||1*e.status==4?"-":"+"))]),t._v(t._s(e.amount))]),t._v(" "),a("td",[t._v(t._s(e.create_time))]),t._v(" "),a("td",[t._v(t._s(e.message))])]):t._e()}),t._v(" "),1==t.showData?a("tr",[a("td",{attrs:{colspan:"3"}},[t._v("暂无数据")])]):t._e()],2),t._v(" "),0==t.showData?a("el-pagination",{attrs:{"current-page":t.currentPage,"page-size":t.pagesize,layout:"total, prev, pager, next, jumper",total:t.chatuserInfoStore.dataAccountChange.count},on:{"current-change":t.handleCurrentChange}}):t._e()],1)])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("tr",{staticClass:"table-header"},[e("th",[this._v("帐变金额")]),this._v(" "),e("th",[this._v("帐变时间")]),this._v(" "),e("th",[this._v("帐变信息")])])}]};var o=a("VU/8")(i,c,!1,function(t){a("wKtS")},"data-v-349ed9ee",null);e.default=o.exports},wKtS:function(t,e){}});