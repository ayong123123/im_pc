import md5 from 'js-md5'
import axiosParen from 'axios'
import store from '../store'
import qs from 'qs'
import {setSession, getSession,cleraSeeion,clearSession2,getSession2} from '../common/common'
import {aesEncrypt,aesDecrypt} from '../common/crypto'
import { Loading,Message,MessageBox} from 'element-ui';
import CryptoJS from 'crypto-js/crypto-js'
// Vue.use(axios)

var axios = axiosParen.create({
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
// axios.defaults.timeout = 30 * 1000 // Timeout
// axios.defaults.baseURL = '';
axios.defaults.baseURL = '';

axios.defaults.retry = 5;
axios.defaults.retryDelay = 5000;
axios.defaults.withCredentials  = true;


var _t="";
import {qpla,qplb} from "./f"
_t+=qpla()+qplb();
import {qplaa,qplbb} from "./k"
const initKey = _t+qplaa()+qplbb();



// 请求拦截
axios.interceptors.request.use(
  config => {

    /*携带token*/
      if (getSession2('imtoken') && config.url.indexOf(window.hostIm) != -1) {
        config.headers["Authorization"] = getSession2('imtoken');
      }

    if (getSession2('imtoken') && getSession2('token') && config.url.indexOf('api/uploadFile/upload') == -1 && config.url.indexOf('Api/User/vcode') == -1 && config.url.indexOf('Api/User/logined') == -1) {
      var temp={};
      temp=qs.parse(config.data) || {};


      if(config.url.indexOf(window.host) != -1) {
        temp.token=getSession2('token');
      }else{
        temp.token=getSession2('imtoken');
      }

      temp=qs.stringify(temp)
      config.data=temp;
    }

    // console.log(config.url)


    if(config.data && !config.__retryCount && config.url.indexOf('api/uploadFile/upload') == -1){
      var temp={};
      temp.Param=qs.parse(config.data) || {};
      var t=JSON.stringify(temp.Param);
      temp.Param=aesEncrypt(t);
      // var str=t+window.md5;
      var str=t+initKey;
      temp.Autograph=md5(str);
      temp=qs.stringify(temp);
      config.data=temp;
    }

    return config;
  },

  err => {
    return Promise.reject(err);
  });

axios.interceptors.response.use(
  response => {

    try {
      var url=window.location.href;
      if(response.data.code == "12"){
        //判断是否有历史登录状态
        var loginState = getSession2('imtoken') || getSession2('token');
        if(loginState){
          //在痕迹下
          clearSession2("imtoken");
          clearSession2("RoomIdData");

          /*非注册页面跳转*/
          // if(url.indexOf("registered")<0 && url.indexOf("/index/user/r")<0){
            window.location.assign("#/login");
          // }
        }

      }
      if(response.data.code == "9999"){
        Message({
          message:'网站正在维护',
          type:"warning",
          showClose:true
        })
      }

      if(response.data.code == 10003 || response.data.code == 10004 ){
         //判断是否有历史登录状态
         var loginState = getSession2('imtoken') || getSession2('token');
        if(loginState || window.location.hash != "#/login"){
           // 在痕迹下
           clearSession2("imtoken");
           clearSession2("token");
           clearSession2("loginData");
           window.location.assign("#/login");

          Message({
            message:'请重新登录！',
            type:"warning",
            showClose:true
          })
         }

       }


    }
    catch (e){
      console.log(e)
    }


    // console.log(response)
    return response;
  },

  /*504 回调4次*/
  function axiosRetryInterceptor(err) {

      console.error("web报错",err)

      // window.loding.close();

      var config = err.config;
    if(!config || !config.retry) return Promise.reject(err);

    config.__retryCount = config.__retryCount || 0;

    if(config.__retryCount >= config.retry) {
      return Promise.reject(err);
    }

    config.__retryCount += 1

    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });

    return backoff.then(function () {
      return axios(config)
    })
  }






  // error => {
  //   if (error.response) {
  //     switch (error.response.status) {
  //       case 401:
  //         // 这里写清除token的代码
  //         router.replace({
  //           path: 'login',
  //           query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
  //         })
  //     }
  //   }
  //   return Promise.reject(error.response.data)
  // }
  );



// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


/*  */
export default(
  axios
)
