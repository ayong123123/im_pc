import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import Vue from 'vue'
import strophe from 'strophe.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VideoPlayer from 'vue-video-player'

import Vuex from 'vuex'
import axios from './axios'
import moduleconfig from './moduleconfig'
import App from './App'
import router from './router'
import store from './store'
import {getSession,getDate,randomRange, getTimes} from './common/common'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import './common/commonWX.less'
import './common/fonts/iconfont.css'
import VueLazyLoad from 'vue-lazyload'
import WebIM from "./configWX/WebIMWX"

window.hostIm=window.hostIm || "";

/* WebIMConfig*/
window.Strophe = strophe.Strophe;
window.Strophe.Connection.prototype.setJid = function (jid) {
  this.jid = jid;
  this.authzid = Strophe.getBareJidFromJid(this.jid);
  this.authcid = Strophe.getNodeFromJid(this.jid);
},

window.Strophe.Connection.prototype.getJid = function () {
  return this.jid
},
  /*WebIMConfig*/


Vue.use(ElementUI)
Vue.use(VideoPlayer)
Vue.use(Vuex)
Vue.use(VueLazyLoad,{
  preLoad: 1.1,
  error:'./assets/error.png',
  loading:'./assets/loading.png'
})


Vue.config.productionTip = false
Vue.prototype.$getTimes = getTimes
/* eslint-disable no-new */
window.App=new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  computed:{

  },
  created:function(){
    // WebIM.conn.open();
    window.diyRouter = this.$router;



    // store.commit("setNetOnline",true);
    // online网络连接事件
    // window.addEventListener("online",function() {
    //   WebIM.conn.close(); //连接前先断一次
    //   console.log("网络连接已建立");
    //   WebIM.conn.open();
    //   // store.commit("setNetOnline",true)
    // });

    // offline网络连接事件
    // window.addEventListener("offline",function() {
    //   // console.log('WebIM1',WebIM1)
    //   console.log("网络连接已断开");
    //   WebIM.conn.close();
    //   // store.commit("setNetOnline",false)
    // });

  },

  data:{
    config:{
      host:window.hostIm || "",
    }
  }

})


/*init Global model*/
router.beforeEach((to, from, next) => {

  // var u=getSession('token');
  // if(!u){
  //   next({ path: '/login' })
  // }else{
  //   next();
  // }

  next();
})

document.body.onclick = function () {
  let div = document.getElementsByClassName('el-loading-mask')
  // console.log(div)
  if (div[0]){
    document.body.removeChild(div[0])
  }
}
