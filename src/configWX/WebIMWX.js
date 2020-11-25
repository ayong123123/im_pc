/* eslint-disable */
// import "script-loader!easemob-websdk/dist/strophe-1.2.8-g.js"
/* eslint-enable */

import store from '../store'


import config from "./WebIMConfigWX"
import _config from "./configWX"
import emoji from "./emoji"
import Api from "axios"
import {randomRange,uuid,getDate,setDate,setSession2,getSession2} from "../common/common"
import { Message,Notification } from 'element-ui';
import {setBefferMsg,getResponeMsg,getBefferMsg} from '../utils/ProtoSwap'


let WebIM = window.WebIM || {};
// WebIM={...WebIM,...websdk}

WebIM.config = config;
window.againCountAll = 0
WebIM.conn = {
  ws:{readyState:0},
  open:function(callBack){
    // try{
    //   this.ws.close();
    // }catch (e){
    //
    // }
    // console.log(window.againCountAll)
    var _t=store.state.chatuserInfoStore.loginData.imtoken;
    this.ws = new WebSocket(window.wsHostIm+"?token="+_t+"&vcode="+new Date().getTime());
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = function () {
      window.WebIMws=this.ws;
      store.commit("setOnlineState",1);
      window.webIMpulse=window.webIMpulse || 1;
      clearInterval(window.webIMpulse);
      window.againCount=0;
      window.againCountAll = 0;
      window.webIMpulse=setInterval(()=>{
        store.dispatch("sendMessageIM",{to:1,type:_config.MSG_SYS_INDEX,message:"",reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})});
      },60000);
      this.ws.binaryType = "arraybuffer";



      for(var i in store.state.msgListStore.friendMsgMap){
        if(store.state.msgListStore.friendMsgMap[i].msgList){
          for(var v in store.state.msgListStore.friendMsgMap[i].msgList){
            if(store.state.msgListStore.friendMsgMap[i].msgList[v].status=="sending" || store.state.msgListStore.friendMsgMap[i].msgList[v].status=="error"){
              store.dispatch("againSenAllTxt",store.state.msgListStore.friendMsgMap[i].msgList[v]);
            }
          }
        }
      }

      store.dispatch('getSofflineMessageAction',{is_ack:1,offlineKey:'',uid:store.state.chatuserInfoStore.loginData.id})
      store.dispatch("getCustomerServiceAction",{})
        .then(res=>{
          if(res.applyCount>0) {
            store.commit("setQuestSound")
            store.dispatch("getCountApplyFriendAction",{self_uid:store.state.chatuserInfoStore.loginData.id})
          }
        })

      callBack();

    }.bind(this);
    this.ws.binaryType = "arraybuffer";

    this.ws.onmessage = function (evt){
      // console.log("收到信息",evt);
      var _temp=getResponeMsg(evt.data);

      var _temps = getBefferMsg(evt.data)
      // console.log('_temp',_temp)
      // console.log('_temps',_temps)

      //推送合并群组
      if(_temps.type ===_config.MERGE_GROUP) {
        store.dispatch("mergeGroup",_temp)
      }
      // console.log("收到回调",_temp);
      var _msgCodeArr=[5,6,7,15,13,14,25,28,47,46,40];
      //信息回执

      var _fromId=0;

      _temp.singlemessage ? _fromId=_temp.singlemessage.sendid : _fromId=_temp.groupmessage.sendid;

      if(_msgCodeArr.indexOf(_temp.type*1)!=-1 && store.getters.getUserId!=_fromId){
        // console.log("需要应答",_temp);
        //  unique_value

        store.dispatch("sendMessageIM",{to:1,type:_config.MSG_SYS_CALLBACK,message:_temp.unique_value,reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})});
      }

      if(_temp.status === _config.MSG_STATUS_ERROR && _temp.asFrom == store.state.chatuserInfoStore.loginData.id){
        Message({
          message:_temp.content,
          type:"warning",
          showClose:true
        })
      }

      // store.commit("upDataUserInfo",_temp)
      store.dispatch("addMsgAction",_temp)

      if(_temp.asGroup == 1 || _temp.type == _config.MSG_IMG_NICKNAME) {
        store.dispatch("upDataUserInfoAction",_temp)
      }
      // 单聊撤回
      if(_temp.type == _config.MSG_PRIVATE_RECALL){
        if(_temp.singlemessage.sendid != store.state.chatuserInfoStore.loginData.id){
          store.dispatch("messageCallBack",{id:_temp.singlemessage.sendid,type:1,unique_value:_temp.unique_value})
        }
      }
      // 二维码
      if(_temp.type == _config.MSG_GROUP_APPLY_JOIN){
        // alert(0)
        store.commit("setGroupJoinApply",_temp)
      }
      // 群聊撤回
      if(_temp.type == _config.MSG_PRIVATE_GROUPRECALL){
        if(_temp.groupmessage.sendid != store.state.chatuserInfoStore.loginData.id){
          store.dispatch("messageCallBack",{id:_temp.groupmessage.groupid,type:2,unique_value:_temp.groupmessage.content})
        }
      }
      // 群聊禁言  群聊加好友  群聊加入人员
      if(_temp.type == _config.MSG_GROUP_SPEAK || _temp.type == _config.MSG_GROUP_ADD_FRIEND || _temp.type == _config.MSG_GROUP_INGROUP){
        if(store.state.msgListStore.activeTyep == 2 && _temp.groupmessage.groupid == store.state.msgListStore.activeWindowId){
          store.dispatch("getGroupChatInfoAction",{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:store.state.msgListStore.activeWindowId})
        }
      }

      // 群聊公告
      if(_temp.type == _config.MSG_GROUP_NOTICE && _temp.groupmessage.sendid != store.state.chatuserInfoStore.loginData.id){
        store.dispatch("findMeListAction",_temp)

        // store.dispatch("getGroupChatInfoAction",{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:_temp.groupmessage.groupid})
      }
      // 群聊踢出人员
      if(_temp.type == _config.MSG_GROUP_REMOVEPERSON){
        store.dispatch("findMeListAction",_temp)
        // store.dispatch("getGroupChatInfoAction",{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:_temp.groupmessage.groupid})
      }
      // 群聊@人  && _temp.groupmessage.sendid != store.state.chatuserInfoStore.loginData.id
      if((_temp.type == _config.MSG_GROUP_AT || _temp.type == _config.MSG_GROUP_AT_ALL)  && _temp.groupmessage.sendid != store.state.chatuserInfoStore.loginData.id){
        let farr = _temp.groupmessage.comment
        let narr = farr.split(",")
        let flag = narr.some(c=>c == store.state.chatuserInfoStore.loginData.id)
        if(flag || _temp.type == _config.MSG_GROUP_AT_ALL){
          store.dispatch("findMeListAction",_temp)
        }
      }
      // 添加好友声音
      if(_temp.type == _config.MSG_PRIVATE_APPLYFRIEND && _temp.singlemessage.sendid != store.state.chatuserInfoStore.loginData.id){
        store.commit("setQuestSound")
        store.dispatch("getCountApplyFriendAction",{self_uid:store.state.chatuserInfoStore.loginData.id})
      }
      // 同意好友
      if(_temp.type == _config.MSG_PRIVATE_AGREEADDFRIEND){
        // if(_temp.singlemessage.acceptid == store.state.chatuserInfoStore.loginData.id){
        //   store.commit("newBuildFriendChatBox",_temp)
        // }
        store.dispatch("getFriendList",{self_uid:store.state.chatuserInfoStore.loginData.id})
      }
      // 不是本人收到消息 mp3
      if(store.state.chatListStore.messageSoundOpen && _temp.asFrom && _temp.asFrom != store.state.chatuserInfoStore.loginData.id && _temp.type != _config.MSG_PRIVATE_RED && _temp.type != _config.MSG_GROUP_RED && _temp.type != _config.MSG_PRIVATE_ROB && _temp.type != _config.MSG_GROUP_ROB && _temp.type != _config.MSG_RED_COW && _temp.type != _config.MSG_RED_LANDMINE &&  _temp.type != _config.MSG_RED_DRAGON){
        store.commit("setDiDiAudio")
      }
      // 不是本人收到红包 mp3
      if(store.state.chatListStore.redPackSoundOpen && _temp.asFrom && _temp.asFrom != store.state.chatuserInfoStore.loginData.id && (_temp.type == _config.MSG_PRIVATE_RED || _temp.type == _config.MSG_GROUP_RED || _temp.type == _config.MSG_RED_COW || _temp.type == _config.MSG_RED_LANDMINE || _temp.type == _config.MSG_RED_DRAGON)){
        store.commit("setRedPackMp3State")
      }
      //let decoder=proto.DggChat.DggCommon.deserializeBinary(event.data);
    };

    this.ws.onclose = function(e){
      // 关闭 websocket
      // console.log("连接已关闭...",e);

      store.commit("setOnlineState",2);
      clearInterval(window.webIMpulse);
      window.againCountAll++
      // console.log("连接已关闭尝试重连次数all..."+window.againCountAll);
      if(window.againCount<1){
        setTimeout(()=>{
          window.againCount++;
          WebIM.conn.open();
        },2000);
      };


    }.bind(this);

    // this.ws.onopen();
    // console.log(this.ws)

  },
  isOpened:function(){
// 0 - 表示连接尚未建立。
// 1 - 表示连接已建立，可以进行通信。
// 2 - 表示连接正在进行关闭。
// 3 - 表示连接已经关闭或者连接不能打开。
//     console.log("判断是否登录")
   return this.ws.readyState==1;

  },
  close:function(){
    this.ws.close();
  },
  send:function(msg){
    /*离线重连_信息队列*/
    if(this.isOpened()){
      this.ws.send(msg)
    }else{
      this.open(()=>{this.ws.send(msg)})
    }
  },
  listen:function(){},
  getUniqueId:function(){return uuid()},
};

// for downward compatibility
if (!WebIM.conn.apiUrl) {
    WebIM.conn.apiUrl = WebIM.config.apiURL;
};

// websdk.debug(false)

const appKeyPair = WebIM.config.appkey.split("#");
export let api = Api.create({
  baseURL: `${WebIM.config.apiURL}/${appKeyPair[0]}/${appKeyPair[1]}`,
  validateStatus: function (status) {
    return true
  }
});
/*新增自定义 ajax*/
export let ajax = Api.create({
  withCredentials: true
});

function requestFail(data) {
  if (data.data && data.data.error_description) {
    data.msg = data.data.error_description
  } else if (data.data && data.data.data && data.data.data.error_description) {
    data.msg = data.data.data.error_description
  }
  // message.error("Error:" + data.status + ", " + data.msg)
  return Promise.reject(data)
};
/*返回结果拦截器*/
api.interceptors.response.use(
  function (resp)  {
    if (resp.status >= 300) {
      return requestFail(resp)
    }
    if (resp.data && resp.data.status && resp.data.status !== 200) {
      return requestFail(resp.data)
    }
    if (resp.data && resp.data.data) {
      resp.data = resp.data.data
    }
    return resp
  },
  function (error) {
    console.log(error)
  },
);

/*上传图片*/
WebIM.uploadImg=function(data){

  let formData = new FormData();
  formData.append("file", data.value.data);
  formData.append("website", getDate("website"));
  formData.append("chat_uid", getDate("chat_uid"));
  formData.append("msg_code", uuid());


  var url=getDate("IM_http");
  url = url.replace(/ws:/g, 'http:');

  ajax({
    method: 'post',
    // url:"http://10.50.215.197:9501/chat/uploadFile",
    // url:url+"chat/uploadFile",
    url:getDate("IM_https")+"chat/uploadFile",
    data:formData,
  }).then(function(res){

    if(store.getters.getCodeState(res.data.code)){

      var url=res.data.result.url;
      var message_code_md5=res.data.result.msg_code || uuid();
      // console.log("___",JSON.stringify({"msg":url}))

      setTimeout(()=>{
        store.dispatch("sendDiyTxtMessage",{chatType:"chatroom",chatId:123456,message:{"msg":JSON.stringify({"url":url})},msgTye:"image",message_code_md5:message_code_md5});
      },1000)


    }else {



    }
    // store.commit("increment")
  })
}

WebIM.api = api
WebIM.ajax = ajax
WebIM.emoji = emoji
// WebIM.WebRTC = webrtc
// WebIM.EMedia = emedia
export default WebIM


