webpackJsonp([61],{K31e:function(o,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=t("Dd8w"),i=t.n(s),n=t("NYxO"),r=t("F+jZ"),a=t("zL8q"),c={name:"login",data:function(){return{passwordLock:!1,isLogin:"",logonForm:{username:"",password:"",rememberState:!1,from:1,vcode:"",uniqueId:"",phone_model:"web"},labelPosition:"top",webName:""}},mounted:function(){},created:function(){this.webName=window.webName,this.passwordLock=Object(r.c)("isLock")||!1;var o=this;document.onkeydown=null,document.onkeydown=function(e){if(void 0==window.event)var t=e.keyCode;else t=window.event.keyCode;13==t&&o.submitForm()},Object(r.c)("isLock")&&(this.logonForm.password=Object(r.c)("ppd")||"",this.logonForm.username=Object(r.c)("username")||""),this.setIsFirstLogin(!1),this.getVsCode(),this.initIndexAction()},watch:{passwordLock:function(o){Object(r.j)("isLock",o)}},beforeDestroy:function(){document.onkeydown=null},methods:i()({},Object(n.d)(["setIsFirstLogin"]),Object(n.b)(["loginAction","registerAction","resetPassAction","getVsCode","initIndexAction"]),{getBrowser:function(){var o=navigator.userAgent.toLowerCase(),e={IE:window.ActiveXObject||"ActiveXObject"in window,Chrome:o.indexOf("chrome")>-1&&o.indexOf("safari")>-1,Firefox:o.indexOf("firefox")>-1,Opera:o.indexOf("opera")>-1,Safari:o.indexOf("safari")>-1&&-1==o.indexOf("chrome"),Edge:o.indexOf("edge")>-1,QQBrowser:/qqbrowser/.test(o),WeixinBrowser:/MicroMessenger/i.test(o)},t="web";for(var s in e)e[s]&&(t=s);return t},submitForm:function(){if(this.loginInfo){if(this.logonForm.rememberState=this.passwordLock,this.logonForm.router=this.$router,this.chatuserInfoStore.vcode.flag||1==this.indexStore.indexData.verifySwitch){if(!this.logonForm.vcode)return void Object(a.Message)({message:"提示:请输入验证码",type:"warning",showClose:!0});this.logonForm.uniqueId=this.chatuserInfoStore.vcode.id}this.logonForm.phone_model=this.getBrowser(),this.loginAction(this.logonForm)}else Object(a.Message)({message:"提示:信息请填写完整",type:"warning",showClose:!0})}}),components:{},computed:i()({},Object(n.e)(["chatuserInfoStore","indexStore"]),{loginInfo:function(){if(this.chatuserInfoStore.vcode.flag||1==this.indexStore.indexData.verifySwitch){if(this.logonForm.username&&this.logonForm.password&&this.logonForm.vcode)return!0}else if(this.logonForm.username&&this.logonForm.password)return!0}}),filters:{}},l={render:function(){var o=this,e=o.$createElement,t=o._self._c||e;return t("div",{staticClass:"wx-login"},[t("div",{staticClass:"login"},[t("div",{staticClass:"lang"},[t("a",{staticClass:"ng-scope",attrs:{target:"_blank"}},[o._v(o._s(o.indexStore.indexData.webName))])]),o._v(" "),t("div",{staticClass:"login_box"},[t("el-form",{ref:"logonForm",staticClass:"demo-ruleForm",attrs:{"label-position":o.labelPosition,model:o.logonForm,"status-icon":""}},[t("el-form-item",{attrs:{label:"",prop:"username"}},[t("div",{staticClass:"icon"},[t("i",{staticClass:"iconfont icon-huaban"})]),o._v(" "),t("el-input",{attrs:{placeholder:"登录账号"},model:{value:o.logonForm.username,callback:function(e){o.$set(o.logonForm,"username",e)},expression:"logonForm.username"}})],1),o._v(" "),t("el-form-item",{attrs:{label:"",prop:"pass"}},[t("div",{staticClass:"icon"},[t("i",{staticClass:"iconfont icon-mima"})]),o._v(" "),t("el-input",{attrs:{type:"password",placeholder:"登陆密码"},model:{value:o.logonForm.password,callback:function(e){o.$set(o.logonForm,"password",e)},expression:"logonForm.password"}})],1),o._v(" "),o.chatuserInfoStore.vcode.flag||1==o.indexStore.indexData.verifySwitch?t("el-form-item",[t("div",{staticClass:"icon"},[t("i",{staticClass:"iconfont icon-mima"})]),o._v(" "),t("el-input",{staticStyle:{width:"75%"},attrs:{type:"number",placeholder:"验证码"},model:{value:o.logonForm.vcode,callback:function(e){o.$set(o.logonForm,"vcode",e)},expression:"logonForm.vcode"}}),o._v(" "),t("div",{staticClass:"login-vcode",on:{click:function(e){return o.getVsCode()}}},[t("img",{attrs:{src:o.chatuserInfoStore.vcode.imgUrl,alt:""}})])],1):o._e(),o._v(" "),t("el-form-item",[t("el-checkbox",{model:{value:o.passwordLock,callback:function(e){o.passwordLock=e},expression:"passwordLock"}},[o._v("记住账号密码")])],1),o._v(" "),t("el-form-item",[t("button",{staticClass:"submitLogin",attrs:{type:"button"},on:{click:function(e){return o.submitForm()}}},[o._v("登录")])])],1)],1)])])},staticRenderFns:[]};var d=t("VU/8")(c,l,!1,function(o){t("hHWF")},"data-v-35ac4360",null);e.default=d.exports},hHWF:function(o,e){}});