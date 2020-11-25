/**
 *  用户信息 设置 登录注册
 */

import axios from '../axios'
import router from '../router'
import qs from 'qs'
import md5 from 'js-md5'
import store from '../store'
import {getDate,setDate,copyobj,setSession,getSession,setSession2,getSession2,clearSession2 } from '../common/common'
import { Loading,Message,MessageBox} from 'element-ui';
import WebIM from "../configWX/WebIMWX"
export default {
  state:{
    // 当前登录用户
    userInfo: {
      name: 'ratel',
      img: 'static/images/UserAvatar.jpg',
    },
    // 登陆信息
    loginData:{
      /*标记是否登录*/
      sign:false,
      token:null,
      message:"",
      code:"",
      websocketToken:"",
    },
    //注册信息
    registerData:{},
    dataGetInfo:[],
    dataAccountChange:[],


    appDownloadUrl:{
      code:null,
      data:{

      }
    },
    /*登录验证码*/
    vcode:{
      val:"",
      flag :false,
      id:'',
      imgUrl:''
    },

  },
  /*$store.commit*/
  mutations: {
    setVcodeShow(state,data) {
      state.vcode.flag = data;
    },
    setVcodeData(state,data){
      state.vcode.imgUrl = 'data:image/png;base64,'+data.imageData;
      // state.vcode.val=window.hostIm + "/Api/user/vcode"+"?"+new Date().getTime();
      state.vcode.id = data.uniqueId
    },
    setAppDownloadUrl(state,data){
      state.appDownloadUrl = {...state.appDownloadUrl,...data}
    },

    setLoginData(state,data){
      state.loginData={...state.loginData,...data};
    },
    getLoginData(state,data){
      if(getSession2('loginData')){
        let loginData = getSession2('loginData')
        state.loginData={...state.loginData,...loginData};
      }else{
        data.route.push({ name:'login'});
      }
    },
    setgetInfo (state, data) {
      state.dataGetInfo = data
    },
    setAccountChange (state, data) {
      state.dataAccountChange = data
    },
    windowMove(state,e){
//        let odiv = this.$refs.privateWindow;  // /获取目标元素
      let odiv = window.document.getElementById("privateWindow");  // /获取目标元素
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;

      document.onmousemove = (e)=>{       //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置

        let left = e.clientX - disX;
        let top = e.clientY - disY;
        odiv.style.left = left + 'px';
        if(top < 1){
          odiv.style.top = 0 + 'px';
        }else{
          odiv.style.top = top + 'px';
        }
        //移动当前元素
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },

  },

  /*$store.getters*/
  getters:{
    // 获得用户id
    getUserId (state) {
      return state.loginData.id
    },
  },

  /*$store.dispatch*/
  actions: {
    //获取验证码
    getVsCode(context,data) {
      // console.log(data)
      let loading = Loading.service({
        lock: true,
        text: '获取中...',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return new Promise(resolve => {
        axios({
          method: 'post',
          // url:window.hostIm+"/Api/user/logined",
          url:window.host+"/Api/User/vcode",
          data:qs.stringify({data})
        }).then(function(res){
          context.commit("setVcodeData",res.data.data);
          loading.close();
        })
      })
    },
    // 登录
    loginAction(context,data){
      var _router=data.router;
      delete data.router;
      let loading = Loading.service({
        lock: true,
        text: '登录中',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      /*回传cookies*/
      // data.ci_session=getSession("ci_session") ;
      //  console.log("allCookies",document.cookie.split("; "));
      return axios({
        method: 'post',
        // url:"/Api/user/loginedwap",
        url:window.host+"/Api/User/logined",
        // data:qs.stringify(data)
        data:qs.stringify({username:data.username,password:data.password,vcode:data.vcode,uniqueId:data.uniqueId,loginFrom:1,phone_model:data.phone_model})

      }).then(function(res){
        loading.close();
        if(store.getters.getCodeStateZh(res.data.code)){
          if(data.rememberState){
            setSession2("ppd",data.password);
          }else{
            clearSession2("ppd")
          }
          let flag = false
          if(getSession2("username") && res.data.data.username != getSession2("username")){
            flag = true
          }
          Message({
            message: '登录成功',
            type:"success",
            showClose:true
          })
          store.commit("setIsFirstLogin",true)
          context.commit("setLoginData",res.data.data);
          context.dispatch("getInfo",{uid:res.data.data.id})
          context.dispatch("userHomeDataAction")
          setSession2('loginData',res.data.data);
          setSession2('imtoken',res.data.data.imtoken);
          setSession2('token',res.data.data.token);
          setSession2("username",res.data.data.username);

          //检测是否合并群组
          // context.dispatch('getUserGroup')

          if(flag){
            clearSession2("vuex")
            store.commit("initChatInfo")
          }
          setTimeout(()=>{
            // location.reload();
            // console.log('进入')
            _router.push({ path:'/chat'});
          },500)

          context.commit("setVcodeShow",false);
          // window.location.assign("#/chat");
          return res.data;
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          if(res.data.data.code == 1102) {
            context.commit("setVcodeShow",true);
            context.dispatch('getVsCode')
          }
          if(res.data.code == 4) {
            context.dispatch('getVsCode')
          }
          // context.commit("setVcodeData",{});
          return false;
        }

      })
    },
    //退出登录
    loginOutAction(contenxt,data) {
      let loading = Loading.service({
        lock: true,
        text: '退出中...',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return axios({
        method: 'post',
        // url:"/Api/user/loginedwap",
        url:window.host+"/Api/User/cancellation",
        // data:qs.stringify(data)
        data:qs.stringify(data.data)

      }).then(function(res){
        loading.close();
        if(store.getters.getCodeStateZh(res.data.code)){
          Message({
            message: '退出登录成功！',
            type:"success",
            showClose:true
          })
          clearSession2("imtoken")
          clearSession2("token")

          setTimeout(()=>{
            // location.reload();
            data.route.push({ name:'login'});
          },500)

          // 清空置顶聊天
          store.commit('updateTopInfo',[])

          WebIM.conn.close();
          return res.data;
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          // context.commit("setVcodeData",{});
          return false;
        }
      })


    },
    //注册
    registerAction(context,data) {
      let loading = Loading.service({
        lock: true,
        text: '注册中...',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      return axios({
        method: 'post',
        // url:"/Api/user/loginedwap",
        url:window.host+"/Api/User/reg",
        // data:qs.stringify(data)
        data:qs.stringify(data.data)

      }).then(function(res){
        loading.close();
        if(store.getters.getCodeStateZh(res.data.code)){
          context.commit("setLoginData",res.data.data);
          setSession2("ppd",data.data.password);
          let flag = false
          if(!getSession2("username") || (getSession2("username") && data.username != getSession2("username"))){
            flag = true
          }
          Message({
            message: '注册成功',
            type:"success",
            showClose:true
          })
          store.commit("setIsFirstLogin",true)
          context.commit("setLoginDataIm",res.data.data);
          setSession2('loginData',res.data.data);
          setSession2('imtoken',res.data.data.imtoken);
          setSession2("token",res.data.data.token);
          setSession2("username",res.data.data.username);
          if(flag){
            clearSession2("vuex")
            store.commit("initChatInfo")
          }

          setTimeout(()=>{

            context.dispatch("getInfo",{uid:res.data.data.id})
            // location.reload();
            data.router.push({ path:'/chat'});
          },500)
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          // context.commit("setVcodeData",{});
          return false;
        }
      })
    },
    //修改密码
    resetPassAction(context,data) {
      let loading = Loading.service({lock: true, text: '修改中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve)=>{
          axios({
          method: 'post',
          url:window.host+"/Api/Member/usereditpass",
          data:qs.stringify(data.data)
        }).then(function(res){
          loading.close();
          if(store.getters.getCodeStateZh(res.data.code)){
            resolve()
            Message({message: '修改成功！', type:"success", showClose:true})
            // setTimeout(()=>{
            //   // data.route.push({name:'login'});
            //   location.reload()
            // },2000)
            // return res.data;
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            // context.commit("setVcodeData",{});
            return false;
          }
        })

      })
    },

    //编辑用户
    editorUser(context,data) {
      let loading = Loading.service({lock: true, text: '上传中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/user/editUser",
          data:qs.stringify(data.data)
        }).then(function(res){
          loading.close();
          if(store.getters.getCodeState(res.data.code)){
            Message({message: '修改成功！', type:"success", showClose:true})
            // setTimeout(()=>{
            //   // data.route.push({name:'login'});
            //   location.reload()
            // },2000)
            context.commit('setLoginData',res.data.data);
            let loginData = getSession2('loginData')
            let newData = Object.assign({},loginData,res.data.data);
            setSession2('loginData',newData) //更新session数据
            // return res.data;
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            // context.commit("setVcodeData",{});
            return false;
          }
        })
      })
    },


    //修改头像
    modifyAvatar(context,data) {
      let loading = Loading.service({lock: true, text: '上传中...', background: 'rgba(0, 0, 0, 0.7)'});
      return axios({
        method: 'post',
        url:window.hostIm+"/api/user/editHead",
        data:qs.stringify(data.data)
      }).then(function(res){
        loading.close();
        if(store.getters.getCodeState(res.data.code)){
          Message({message: '修改头像成功！', type:"success", showClose:true})
          context.dispatch("getInfo",{uid:data.data.self_uid})
          context.commit('setLoginData',{ head_portrait:data.avatarUrl })
        }else {

          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          // context.commit("setVcodeData",{});
          return false;
        }
      })
    },
    //修改提款密码
    setWithdrawalPassword(context,data) {
      let loading = Loading.service({lock: true, text: '设置中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/Member/usereditdrawpass",
          data:qs.stringify(data)

        }).then(function(res){
          loading.close();
          if(store.getters.getCodeStateZh(res.data.code)){
            resolve()
            Message({message: '设置成功！', type:"success", showClose:true})
            return true;
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            return false;
          }
        })
      })
    },
    //初始化密码
    confirmPassword(context,data) {
      let loading = Loading.service({lock: true, text: '确认中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve)=>{

        axios({
          method: 'post',
          url:window.host+"/Api/member/userinsertdrawpass",
          data:qs.stringify(data)

        }).then(function(res){
          loading.close();
          if(store.getters.getCodeStateZh(res.data.code)){
            resolve()
            Message({message: '修改成功！', type:"success", showClose:true})
            context.dispatch("userHomeDataAction")
            return true;
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            return false;
          }
        })

      })

    },

    //用户详情
    getInfo(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/user/getInfo",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            context.commit("setgetInfo",res.data.data)
            resolve(res.data)
          }else {
            // Message({
            //   message:res.data.message,
            //   type:"warning",
            //   showClose:true
            // })
            return false;
          }
        })
      })
    },
    // 修改用户个性签名
    setSignature(context,data) {
      return axios({
        method: 'post',
        url:window.hostIm+"/api/user/setSignature",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          return true
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          return false;
        }
      })
    },
    // 下载app地址
    getAppDownUrl(context,data) {
      return axios({
        method: 'post',
        url:window.hostIm+"/api/uploadFile/downUrl",
        data:qs.stringify({})
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          if(res.data.code == 10000){
            context.commit("setAppDownloadUrl",res.data)
          }else{
            Message({
              message:'后台还未上传下载链接，请联系客服',
              type:"warning",
              showClose:true
            })
          }
          return true
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          return false;
        }
      })
    },
    // 获取用户帐变详情
    getAccountChange(context,data) {
      return axios({
        method: 'post',
        url:window.hostIm+"/api/user/accountChange",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          context.commit('setAccountChange',res.data.data)
          return res.data.code
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          return false;
        }
      })
    },



  }

}


