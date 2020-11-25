<template>
  <div class="wx-login">
    <div class="login">
      <!--<div class="logo">-->
        <!--<i class="logo-icon"></i>-->
      <!--</div>-->
      <div class="lang">
        <a  target="_blank"
            class="ng-scope">{{indexStore.indexData.webName}}</a>
        <!-- <span class="sep ng-scope"></span>
        <a class="lang-item" >中文</a>
         <span class="sep"></span>
        <a class="lang-item" >繁体</a>
        <span class="sep"></span>
        <a class="lang-item" >English</a> -->
      </div>
      <!-- <div class="copyright">
        <p class="desc">© 1998 - 2019 abc Inc. All Rights Reserved</p>
      </div> -->
      <div class="login_box">

        <!--<div class="nav_login_zd">-->
          <!--<div class="login_nav active-on">-->
            <!--<div class="grid-content bg-purple">登录</div>-->
          <!--</div>-->
          <!--<div class="login_nav">-->
            <!--<div class="grid-content bg-purple-light"><a href="#/registered">注册</a></div>-->
          <!--</div>-->
        <!--</div>-->

        <el-form :label-position="labelPosition" :model="logonForm" status-icon ref="logonForm" class="demo-ruleForm">
          <el-form-item label="" prop="username">
            <div class="icon"><i class="iconfont icon-huaban"></i></div>
            <el-input v-model="logonForm.username" placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item label="" prop="pass">
            <div  class="icon"><i class="iconfont icon-mima"></i></div>
            <el-input type="password" v-model="logonForm.password"  placeholder="登陆密码"></el-input>
          </el-form-item>
          <el-form-item v-if="chatuserInfoStore.vcode.flag || indexStore.indexData.verifySwitch == 1">
            <div  class="icon"><i class="iconfont icon-mima"></i></div>
            <el-input type="number" v-model="logonForm.vcode"  placeholder="验证码" style="width: 75%"></el-input>
            <div class="login-vcode" @click="getVsCode()">
              <img :src="chatuserInfoStore.vcode.imgUrl" alt="">
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="passwordLock">记住账号密码</el-checkbox>
          </el-form-item>

          <el-form-item>
            <button type="button" class="submitLogin" @click="submitForm()">登录</button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex';
   import { setSession2,getSession2} from '../common/common'
  import {Message} from 'element-ui'
  export default {
    name: 'login',
    data () {
      return {
        passwordLock:false,
        isLogin:'',
        logonForm: {
          username: '',
          password:'',
          rememberState:false,
          from:1,
          vcode:'',
          uniqueId:'',
          phone_model:'web'
        },
        labelPosition: 'top',
        webName:'',
      }
    },
    mounted(){

    },
    created() {
      this.webName = window.webName

      this.passwordLock = getSession2("isLock") || false
      var _this = this;

      document.onkeydown=null;
      document.onkeydown = function(e) {
        if(window.event == undefined){
          var key = e.keyCode;
        }else{
          var key = window.event.keyCode;
        }
        if(key == 13){
            _this.submitForm()
        }
      }
      if(getSession2("isLock")){
        this.logonForm.password = getSession2("ppd") || ''
        this.logonForm.username = getSession2("username") || ''
      }
      this.setIsFirstLogin(false)

      this.getVsCode()
      this.initIndexAction()
    },
    watch:{
      'passwordLock'(n){
        setSession2("isLock",n);
      }
    },
    beforeDestroy(){
      document.onkeydown=null;
    },
    methods: {
      ...mapMutations([
          "setIsFirstLogin"
      ]),
      ...mapActions([
        'loginAction',
        'registerAction',
        'resetPassAction',
        "getVsCode",
        "initIndexAction"
      ]),
      getBrowser() {
        var UserAgent = navigator.userAgent.toLowerCase();
        var browserArray = {
          IE: window.ActiveXObject || "ActiveXObject" in window, // IE
          Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
          Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
          Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
          Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1, // safari浏览器
          Edge: UserAgent.indexOf('edge') > -1, // Edge浏览器
          QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
          WeixinBrowser: /MicroMessenger/i.test(UserAgent) // 微信浏览器
        };
        var versions = 'web';
        for (var i in browserArray) {
          if (browserArray[i]) {
            versions = i;
          }
        }
        return versions;
      },
      submitForm() { //提交
        if(!this.loginInfo){
          Message({
            message: "提示:信息请填写完整",
            type: "warning",
            showClose: true,
          })
          return;
        }
        this.logonForm.rememberState = this.passwordLock
        this.logonForm.router = this.$router
        if(this.chatuserInfoStore.vcode.flag || this.indexStore.indexData.verifySwitch == 1) {
          if(!this.logonForm.vcode){
            Message({
              message: "提示:请输入验证码",
              type: "warning",
              showClose: true,
            })
            return;
          }
          this.logonForm.uniqueId = this.chatuserInfoStore.vcode.id
        }
        this.logonForm.phone_model = this.getBrowser()
        this.loginAction(this.logonForm)
      },
    },
    components: {

    },
    computed: {
      ...mapState([
        'chatuserInfoStore',
        "indexStore"
      ]),
      loginInfo:function () {
        var flg = this.chatuserInfoStore.vcode.flag || this.indexStore.indexData.verifySwitch == 1;
        if(flg) {
          if (this.logonForm.username && this.logonForm.password && this.logonForm.vcode){
            return true;
          }
        }else {
          if (this.logonForm.username && this.logonForm.password){
            return true;
          }
        }
      },
    },
    filters: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .wx-login {
    width: 100%;
    height: 100%;
    background: url('../assets/weChat/login_bg.jpg') no-repeat 50%;
    background-size: cover;

    .login-vcode{
      box-sizing: border-box;
      width: 25%;
      background-color: #eeeeee;
      img {
        width: 98%;
        height: 98%;
      }
    }
    .login {
      height: 100%;
      min-width: 860px;
      min-height: 700px;
      overflow: auto;
      position: relative;

      .logo {
        position: absolute;
        left: 60px;
        top: 60px;

        .logo-icon {
          display: inline-block;
          vertical-align: middle;
          width: 80px;
          height: 80px;
          /*澳博logo*/
           background: url('../assets/weChat/logo.png') no-repeat;
        /*赢胜logo*/
         /*background: url('../assets/weChat/IMG_0022.png') no-repeat;*/
          background-size: 100% 100%;
          border-radius: 10px;
        }
      }
      .lang {
        position: absolute;
        left: 60px;
        bottom: 60px;
        a{
          text-decoration: none;
          font-size: 12px;
          color: #d3d3d3;
        }
        .sep {
          display: inline-block;
          height: 12px;
          vertical-align: middle;
          margin: 0 10px;
          border-right: 1px solid #d3d3d3;
        }
      }
      .copyright {
        position: absolute;
        bottom: 60px;
        right: 60px;
        color: #d3d3d3;
        font-size: 12px;
      }
      .login_box {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 15px;
        margin-left: -190px;
        margin-top: -270px;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        /*background-color: #fff;*/
        width: 380px;
        height: 540px;
        /*box-shadow: 0 2px 10px #999;*/
        /*-moz-box-shadow: #999 0 2px 10px;*/
        /*-webkit-box-shadow: #999 0 2px 10px;*/
        .nav{
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          color: #d3d3d3;
          cursor: pointer;
          .el-col{
            background: #666666;
            &.on{
              background: #333333;
              color: #fff;
            }
          }
        }
        .el-form-item{
          display: flex;
          justify-content: space-between;
          .el-select{
            width: 100%;
          }
        }
      }

    }
  }
  .nav_login_zd{
    width: 100%;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    color: #d3d3d3;
    cursor: pointer;
    display: flex;
    .login_nav{
      width: 100%;
      background: #666666;
      color: #d3d3d3;
      a {
        display: block;
      }
    }
    .active-on{
      color: #fff;
      background: #333333;
    }
  }
</style>
