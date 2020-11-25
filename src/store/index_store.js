import axios from '../axios'
import router from '../router'
import qs from 'qs'
import md5 from 'js-md5'
import store from '../store'
import {getDate,setDate,copyobj,setSession,getSession} from '../common/common'
import { Loading,Message,MessageBox} from 'element-ui';
export default {
  state:{
    dataFriendList: [],
    indexData:{},
    webName:'',
    /*注册动态字段*/
    getParams:{
      data:[],
    },
    webWeiHu:{

    },  // 网站维护信息
    // 合作商列表
    partnersList: {
      code: -1,
      data: [],
      message: ''
    },
    groupOwnerList:{

    },
    userHomeData:{

    }
  },
  /*$store.commit*/
  mutations: {
    setIndexDataData(state,data){
      state.indexData=data;
      // alert(data.vocabulary)
      setDate("vocabulary",data.vocabulary)

    },
    setWebName(state,data){
      state.webName=data;
    },
    setSetParamsData(state,data){
      state.getParams=data;
    },
    setWebWeiHu(state, data){
      state.webWeiHu = data
    },
    setGameListPartnersList (state, data) {
      state.partnersList = data
    },
    setGroupOwnerList(state,data){
      state.groupOwnerList = data
    },
    setUserHomeData(state,data){
      state.userHomeData=data;
    },
  },
  /*$store.getters*/
  getters:{},
  /*$store.dispatch*/
  actions:{
    userHomeDataAction(context){
      axios({
        method: 'post',
        url:window.host+"/Api/member/index",
        data:qs.stringify({})

      }).then(function(res){

        if(store.getters.getCodeStateZh(res.data.code)){

          context.commit("setUserHomeData",res.data);

          return true;
        }else {

        }

        // store.commit("increment")
      })

    },
    initIndexAction(context){
      axios.post(window.host+"/Api/home/main").then(function(res){
        if(store.getters.getCodeStateZh(res.data.code)){
          if (window.location.protocol == "https:") {
            res.data.data.downImgUrl = res.data.data.downImgUrl.replace(/http/g, "https");
            res.data.data.downUrl = res.data.data.downUrl.replace(/http/g, "https");
            res.data.data.downVoiceUrl = res.data.data.downVoiceUrl.replace(/http/g, "https");
            res.data.data.localDownUrl = res.data.data.localDownUrl.replace(/http/g, "https");
            res.data.data.localUploadUrl = res.data.data.localUploadUrl.replace(/http/g, "https");
            res.data.data.uploadImgUrl = res.data.data.uploadImgUrl.replace(/http/g, "https");
            res.data.data.uploadVoiceUrl = res.data.data.uploadVoiceUrl.replace(/http/g, "https");
          }
          context.commit("setIndexDataData",res.data.data)
          context.commit("setWebName",res.data.data.webName)
          document.getElementsByTagName("title")[0].innerText = res.data.data.webName
        }else{
          if(res.data.data.message){
            Message({
              message:res.data.data.message,
              type:"warning",
              showClose:true
            })
          }
        }
        if(res.data.code == 9999){
          context.commit("setWebWeiHu",res.data.data)
        }

      })
    },
    getParamsAction(context){
      axios({
        method: 'post',
        url:window.host+"/Api/user/getParams",
        data:qs.stringify({})

      }).then(function(res){

        if(store.getters.getCodeStateZh(res.data.code)){

          context.commit("setSetParamsData",res.data);

          return true;
        }else {

          return false;
        }

        // store.commit("increment")
      })
    },
    getGameListPartnersList(context,data){
      axios({
        method: 'post',
        url:window.host+"/Api/GameList/agencyList",
        data:qs.stringify(data)

      }).then(function(res){
        if(store.getters.getCodeStateZh(res.data.code)){

          context.commit("setGameListPartnersList",res.data);

          return true;
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
        }

      })
    },
    // 群红包s数据
    groupOwnerListAction(context,data){
      return new Promise((resolve)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/GroupOwner/income",
          data:qs.stringify(data)
        }).then(function(res){
          resolve(res.data)
          if(store.getters.getCodeStateZh(res.data.code)){

            context.commit("setGroupOwnerList",res.data.data);
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



  }
}
