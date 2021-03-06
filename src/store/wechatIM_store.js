/*
* beta版本聊天室
* */

import axios from '../axios'

import {getSession2,uuid} from '../common/common'

import store from '../store'
import qs from 'qs'

import WebIM from "../configWX/WebIMWX"

import _config from "../configWX/configWX"

import {setBefferMsg,getResponeMsg} from '../utils/ProtoSwap'
import moren from '../assets/weChat/group_chat.png'
import sysImg from '../assets/weChat/sys.png'
import groupTip from '../assets/weChat/group_tip.png'
import { Loading,Message,MessageBox} from 'element-ui';

const msgTpl = {
  base: {
    "type": 1,   // 文本类型标识
    // "code": 10, //  信息状态码 3.4 10为前端发送状态
    "control":"", //控制器
    "action":"", //
    "from":"pc",
    "comment":"",
    "token":"",
    "create_time":"",
    "unique_value":"",
    // "head_portrait":"",
    "nickname":"",
    "reserved":""
  },
  //单人图片 MSG_PRIVATE_IMG
  6: {
    action:"image",
    control:"SingleChat",
    type: 6,
    head_portrait:"",
  },
  //单聊红包
  7: {
    action:"red",
    control:"SingleChat",
    type: 7,
    head_portrait:"",
  },
  //个人名片 MSG_PRIVATE_CARD
  25: {
    action:"card",
    control:"SingleChat",

    type: 25,
    head_portrait:"",
  },
  //单聊文本信息
  5: {
    action:"text",
    control:"SingleChat",
    type: 5,
    head_portrait:"",
  },
  //添加好友 MSG_PRIVATE_APPLYFRIEND
  13: {
    action:"apply",
    control:"SingleChat",
    type: 13,
    head_portrait:"",
  },
  //单条信息撤回 MSG_PRIVATE_RECALL
  15: {
    action:"recall",
    control:"SingleChat",
    type: 15,
    head_portrait:"",
  },
  //领取红包 MSG_PRIVATE_ROB
  17: {
    action:"rob",
    control:"SingleChat",
    type: 17,
    head_portrait:"",
  },
  //同意添加好友 MSG_PRIVATE_AGREEADDFRIEND
  14:{
    action:"agree",
    control:"SingleChat",
    type: 14,
    head_portrait:"",
  },
  //进群 MSG_GROUP_INGROUP
  18:{
    action:"ingroup",
    control:"GroupChat",
    type: 18,
    head_portrait:"",
  },
  //群抢红包 MSG_GROUP_ROB
  23:{
    action:"rob",
    control:"GroupChat",
    type: 23,
    head_portrait:"",
  },
  //群红包信息 MSG_GROUP_ROB
  10:{
    action:"red",
    control:"GroupChat",
    type: 10,
    head_portrait:"",
  },
  //群@某人 MSG_GROUP_AT
  11:{
    action:"tip",
    control:"GroupChat",
    type: 11,
    head_portrait:"",
  },
  //群名片 MSG_GROUP_CARD
  24:{
    action:"card",
    control:"GroupChat",
    type: 24,
    head_portrait:"",
  },
  //群撤回 MSG_GROUP_RECALL
  16:{
    action:"recall",
    control:"GroupChat",
    type: 16,
    head_portrait:"",
  },
  //群信息  MSG_GROUP_TXT
  8:{
    action:"text",
    control:"GroupChat",
    type: 8,
    head_portrait:"",
  },
  //群图片  MSG_GROUP_IMG
  9:{
    action:"image",
    control:"GroupChat",
    type: 9,
    head_portrait:"",
  },
  //群@所有人 MSG_GROUP_AT_ALL
  33:{
    action:"tipall",
    control:"GroupChat",
    type: 33,
    head_portrait:"",
  },

  /*其他系统消息*/
  //单聊未读 MSG_SYS_SACK
  21:{
    action:"sack",
    control:"Common",
    type: 21,
    head_portrait:"",
  },
  //群聊未读 MSG_SYS_GACK
  22:{
    action:"gack",
    control:"Common",
    type: 22,
    head_portrait:"",
  },
  //点赞推送 MSG_SYS_THUMBS
  19:{
    action:"thumbs",
    control:"Common",
    type: 19,
    head_portrait:"",
  },
  //评论推送 MSG_SYS_COMMENT
  20:{
    action:"comment",
    control:"Common",
    type: 20,
    head_portrait:"",
  },
  //MSG_RED_LANDMINE 扫雷红包
  30:{
    action:"clearance",
    control:"Game",
    type: 30,
    head_portrait:"",
  },
  //MSG_RED_COW 牛牛红包
  29:{
    action:"cattle",
    control:"Game",
    type: 29,
    head_portrait:"",
  },
  //MSG_RED_DRAGON 接龙红包
  39:{
    action:"solitaire",
    control:"GroupChat",
    type: 39,
    head_portrait:"",
  },
  //心跳 MSG_SYS_INDEX
  100:{
    action:"index",
    control:"HeartBeat",
    type: 100,
    head_portrait:"",
  },
  44:{
    action:"video",
    control:"GroupChat",
    type: 44,
    head_portrait:"",
  },
  45:{
    action:"audio",
    control:"GroupChat",
    type: 45,
    head_portrait:"",
  },
  46:{
    action:"video",
    control:"SingleChat",
    type: 46,
    head_portrait:"",
  },
  47:{
    action:"audio",
    control:"SingleChat",
    type: 47,
    head_portrait:"",
  },
  //MSG_GROUP_SHARE群分享盈亏
  55:{
    action:"groupLoss",
    control:"Share",
    type: 55,
    head_portrait:"",
  },
//MSG_PRIVATE_SHARE单聊分享盈亏
  54:{
    action:"singleLoss",
    control:"Share",
    type: 54,
    head_portrait:"",
  },
//MSG_PRIVATE_SIGN单聊签到
  50:{
    action:"singleSignIn",
    control:"Share",
    type: 50,
    head_portrait:"",
  },
  //群聊签到MSG_GROUP_SIGN
  51:{
    action:"groupSignIn",
    control:"Share",
    type: 51,
    head_portrait:"",
  },
  //群聊投注MSG_GROUP_SHARENOTE
  49:{
    action:"groupShareNote",
    control:"Share",
    type: 49,
    head_portrait:"",
  },
  //单聊天投注分享MSG_PRIVATE_SHARENOTE
  48:{
    action:"singleShareNote",
    control:"Share",
    type: 48,
    head_portrait:"",
  },
  //MSG_PRIVATE_DASHANG单聊打赏
  52:{
    action:"singleReward",
    control:"Share",
    type: 52,
    head_portrait:"",
  },
  //MSG_PRIVATE_DASHANG群聊打赏
  53:{
    action:"groupReward",
    control:"Share",
    type: 53,
    head_portrait:"",
  },
  //MSG_SYS_CALLBACK信息应答
  57:{
    action:"acceptAck",
    control:"Common",
    type: 57,
    head_portrait:"",
  },
}


function parseFromLocal(from,to,message,bodyType,reserved,groupinfo) {
  // console.log("msgTpl.base",msgTpl.base)
  let obj = copy({}, msgTpl.base);
  let body = copy({}, msgTpl[bodyType]);
  // body.token=store.state.chatuserInfoStore.loginData.websocketToken;
  body.unique_value=uuid();
  body.nickname=store.state.chatuserInfoStore.dataGetInfo.nickname;
  body.create_time= Math.round(new Date().getTime()/1000).toString();
  body.from="web";
  body.reserved=reserved;
  body.head_portrait=store.state.chatuserInfoStore.dataGetInfo.head_portrait;
  // console.log(groupinfo)
  if(_config._ifGroup(bodyType)){
    body.groupmessage={
      comment:groupinfo && groupinfo.findId || '',
      content:message,
      groupid:to,
      sendid:from,
      groupName:groupinfo && groupinfo.groupName || '',
      groupPeoples:groupinfo && groupinfo.count || '',
    }
  }else{
    body.singlemessage={
      sendid:from,
      acceptid:to,
      content:message,
      comment:"",
    }
  }

  return {
    ...obj,
    ...body,
  }

}

function copy(message, tpl) {
  // console.log("______",message,tpl);
  let obj = {}
  Object.keys(tpl).forEach(v => {
    obj[v] = message[v] || tpl[v]
  })
  return obj
}

/*call-back*/
WebIM.conn.listen({
  // success connect to xmpp
})

export default {
  state:{
    onlineState:-1,
    // 抢到多少红包信息
    redPackDetail:{
    },
    red_id:'',  // 红包id
    dataRedId:[],
    //  @ 用户
    chatRoomFindUser:{
      num:0,
      name:'',
      status:false,
      atAll:false,
    },
    isGoDown:false,
    findUserList:[],

    /*粘贴板图片*/
    pasteImg:{
      /*是否弹出*/
      state:false,
      blobUrl:"",
      file:{},
    },
    thisRedType:0,  // 红包类型
    redSendUid:'',  // 红包发送人id
    redUnique_value:'',  // 红包唯一val
    sendRedPackMessage:{

    },
    firstRedState:{
    },
    getOrCheck:1,

    // 系统消息
    mergeNoticeList:{
      count:0,
      data:[],
    },
    daShangObj:{},
    rewardUserObj:{},
    //转账详情
    transferDetail:{},
  },

  /*$store.getters*/
  getters:{

    initForwardMessage:(state) => (data) =>  {
      var {to, message, type ,groupinfo}=data;
      var _fromId=store.state.chatuserInfoStore.loginData.id;
      var initMessage = parseFromLocal(_fromId, to, message, type ,groupinfo)
      initMessage.avatar = initMessage.head_portrait
      delete initMessage.head_portrait
      if(initMessage.groupmessage){
        let groupMessage = initMessage.groupmessage
        initMessage.groupMessage = groupMessage
        initMessage.groupMessage.sendId = store.state.chatuserInfoStore.loginData.id
        initMessage.groupMessage.groupId = 0
        delete initMessage.groupmessage
      }
      if(initMessage.singlemessage){
        let singleMessage = initMessage.singlemessage
        initMessage.singleMessage = singleMessage
        initMessage.singleMessage.sendId = store.state.chatuserInfoStore.loginData.id
        initMessage.singleMessage.acceptId = 0
        delete initMessage.singlemessage
      }
      // console.log(initMessage)
      return initMessage
    },
  },
  /*$store.commit*/
  mutations: {
    setMessageTimes(state,data){
      var redDate = getSession2("redHui")
      var Detail = getSession2("niuDetail")
      var audioData = getSession2("audioUnread")
      data.forEach((i,idx)=>{
        // 时间状态
        // if(idx < data.length -1){
        //   let on = getTimerAll.formatDate(new Date(i.create_time*1000))
        //   let tw = getTimerAll.formatDate(new Date(data[idx +1].create_time * 1000))
        //   if(on != tw){
        //     i.showTime = true
        //   }
        // }
        // 置灰状态
        if(redDate.length > 0){
          let stat = redDate.some((u)=>u == i.unique_value)
          if(stat){
            i.redState = true
          }
        }
        // 语音已读
        if(audioData.length > 0){
          let stat = audioData.some((u)=>u == i.unique_value)
          if(stat){
            i.audioUnread = true
          }
        }
        // 红包牛牛状态
        if(Detail && Detail[i.unique_value]){
          let niuData = Detail[i.unique_value]
          i.niu_detail = niuData
        }

      })
    },
    setGetOrCheck(state,data){
      state.getOrCheck = data
    },
    setPasteImg(state,data){
      state.pasteImg={...state.pasteImg,...data};
    },
    setChatRoomFindUser(state,data){

      if(data.status){
        state.chatRoomFindUser.num ++
        if(data.atAll){
          state.chatRoomFindUser.status = true
          state.chatRoomFindUser.name = '全部成员 '
          return
        }
        let obj = {
          name:'@'+data.nickname,
          uid:data.uid
        }
        if(data.type){
          state.chatRoomFindUser.name = data.nickname +' '
        }else{
          state.chatRoomFindUser.name = '@' + data.nickname +' '
        }

        let flag = state.findUserList.findIndex(i => i.uid == obj.uid)
        if(flag == -1){
          state.findUserList.unshift(obj)
        }else{
          state.findUserList.splice(flag,1,obj)
        }
      }else{
        state.findUserList = []
      }
      state.chatRoomFindUser.status = data.status
    },

    //  单聊离线消息处理
    setOfflineMessage(state,data){
      var isKefu = false
      for (let [index,obj] of data.entries()) {
        let idx = store.state.chatListStore.chatlist.findIndex((a) => {
          return obj.send_uid == a.id && a.chatType == 1
        })
        var lastText = '有新消息'
        if(obj.type == _config.MSG_PRIVATE_AGREEADDFRIEND) {
          var lastText = `你和${obj.send_nickname}已成为好友可以聊天了`;
        }
        if(obj.type == _config.MSG_MONEY_TRANSFER){
          lastText = '[转账]'
        }
        if(obj.type == _config.MSG_PRIVATE_TXT){
          lastText = obj.content
        }
        if(obj.type == _config.MSG_PRIVATE_RED){
          lastText = '[有红包]'
        }
        if(obj.type == _config.MSG_PRIVATE_IMG){
          lastText = '[图片]'
        }
        if(obj.type == _config.MSG_PRIVATE_ROB){
          lastText = '[红包被领取]'
        }
        if(obj.type == _config.MSG_PRIVATE_AUDIO){
          lastText = '[语音消息]'
        }
        if(obj.type == _config.MSG_PRIVATE_VIDEO){
          lastText = '[视频]'
        }
        if(obj.type == _config.MSG_PRIVATE_SHARE){
          lastText = '[盈亏]'
        }
        if(obj.type == _config.MSG_PRIVATE_SIGN){
          lastText = '[签到]'
        }
        if(obj.type == _config.MSG_PRIVATE_DASHANG){
          lastText = '[打赏]'
        }
        if(obj.type == _config.MSG_PRIVATE_SHARENOTE){
          lastText = '[注单分享]'
        }
        if(obj.type == _config.MSG_GROUP_PLAN){
          lastText = '[精准计划]'
        }
        if(obj.type == _config.MSG_GROUP_CARD){
          lastText = '[名片]'
        }
        if(obj.is_admin == 2 || obj.is_admin == 3){
          isKefu = true
        }
        if(idx != -1){
          store.state.chatListStore.chatlist[idx].messages.date = obj.create_time
          store.state.chatListStore.chatlist[idx].messages.unRead = obj.total
          store.state.chatListStore.chatlist[idx].messages.lastMessage = lastText
          store.commit("setChatGoUp",{id:obj.send_uid,chatType:1 })
        }else{
          store.state.chatListStore.chatlist.unshift({
            chatType:1,
            id:obj.send_uid,
            chatCount:1,
            kefu:isKefu,
            user: {
              name: obj.send_remarkName || obj.send_nickname,
              img:  obj.send_avatar,
            },
            messages:{
              lastMessage: lastText,
              date:  obj.create_time,
              unRead:obj.total,
            },
          })


          if(store.state.chatListStore.chatlist.length == 1){
            let message = {}
            message[obj.send_uid] = {
              msgList:[],
              unReadNum:0,
              count:0,
              activeWindowId:obj.send_uid,
              activeName:"",
            }
            store.state.msgListStore.friendMsgMap = Object.assign({}, message,store.state.msgListStore.friendMsgMap)
            store.commit("setActiveWindow",{id:obj.send_uid,type:1,name:obj.send_nickname,head_portrait:obj.send_avatar})

            store.dispatch("getLastMessageAction",{send_uid:obj.accept_uid,accept_uid:obj.send_uid})
          }

        }


      }

    },
    //  群聊离线消息处理
    setGroupOfflineMessage(state,data){
      for (let [index,obj] of data.entries()) {
        let idx = store.state.chatListStore.chatlist.findIndex((a) => {
          return obj.group_id == a.id && (a.chatType == 2 || a.chatType == 3 || a.chatType == 4)
        })
        var chatType = 2
        if(obj.group_id == 10000000){
          chatType = 3
        }
        if(obj.group_id == 0){
          chatType = 4
        }
        var lastText = '有新消息'
        if(obj.type == _config.MSG_GROUP_TXT || obj.type == _config.MSG_GROUP_APPLY_JOIN){
          lastText = obj.content
        }
        if(obj.type == _config.MSG_SYSTEM_GG || obj.type == _config.MSG_STATION_LETTER){
          if(obj.content){
            let tent = JSON.parse(obj.content)
            lastText = tent.title + ':' + tent.announcement
          }else{
            lastText = ''
          }
        }
        if(obj.type == _config.MSG_GROUP_RED || obj.type == _config.MSG_RED_LANDMINE || obj.type == _config.MSG_RED_COW || obj.type == _config.MSG_RED_DRAGON){
          lastText = '[有红包]'
        }
        if(obj.type == _config.MSG_GROUP_IMG){
          lastText = '[图片]'
        }
        if(obj.type == _config.MSG_GROUP_CARD){
          lastText = '[名片]'
        }
        if(obj.type == _config.MSG_GROUP_ROB){
          lastText = '[红包被领取]'
        }
        if(obj.type == _config.MSG_GROUP_INGROUP){
          lastText = '[新成员加入]'
        }
        if(obj.type == _config.MSG_GROUP_AUDIO){
          lastText = '[语音消息]'
        }
        if(obj.type == _config.MSG_GROUP_VIDEO){
          lastText = '[视频]'
        }
        if(obj.type == _config.MSG_GROUP_SHARE){
          lastText = '[盈亏]'
        }
        if(obj.type == _config.MSG_GROUP_SIGN){
          lastText = '[签到]'
        }
        if(obj.type == _config.MSG_GROUP_DASHANG){
          lastText = '[打赏]'
        }
        if(obj.type == _config.MSG_GROUP_SHARENOTE){
          lastText = '[注单分享]'
        }
        if(obj.type == _config.MSG_GROUP_PLAN){
          lastText = '[精准计划]'
        }
        if(obj.type == _config.MSG_GROUP_CARD){
          lastText = '[名片]'
        }

        if(idx != -1){
          store.state.chatListStore.chatlist[idx].messages.date = obj.create_time
          store.state.chatListStore.chatlist[idx].messages.unRead = obj.total
          store.state.chatListStore.chatlist[idx].messages.lastMessage = lastText
          store.commit("setChatGoUp",{id:obj.group_id,chatType:chatType})
        }else{
          store.state.chatListStore.chatlist.unshift({
            chatType:chatType,
            id:obj.group_id,
            chatCount:obj.group_total,
            user: {
              name: obj.group_name,
              img:  chatType==3 ? sysImg : chatType == 4 ? groupTip : moren,
            },
            messages:{
              lastMessage: lastText,
              date:  obj.create_time,
              unRead:obj.total,
            },
          })


          if(store.state.chatListStore.chatlist.length == 1){
            let message = {}
            message[obj.group_id] = {
              msgList:[],
              unReadNum:0,
              count:0,
              activeWindowId:obj.group_id,
              activeName:"",
            }
            store.state.msgListStore.roomMsgMap = Object.assign({}, message,store.state.msgListStore.roomMsgMap)
            store.commit("setActiveWindow",{id:obj.group_id,type:chatType,name:obj.group_name,head_portrait:chatType==3 ? sysImg : chatType == 4 ? groupTip : moren})
            if(chatType==2){
              store.dispatch("getGlastMessageAction",{send_uid:store.state.chatuserInfoStore.loginData.id,group_id:obj.group_id})
            }else{
              // 获取系统消息
            }

          }


        }


      }

    },
    // 离线有人加好友处理
    setApplyMessage(state,data){

      if(!data || JSON.stringify(data) === '{}'){
        return
      }
      data.forEach((i)=>{
        if(!store.state.msgListStore.friendMsgMap[i.send_uid]) {
          store.state.chatListStore.chatlist.unshift({
            chatType:1,
            id:i.send_uid,
            chatCount:1,
            user: {
              remarks_name:'',
              name: i.send_nickname,
              img:  i.send_avatar,
            },
            messages:{
              lastMessage: '你们已经成为好友了，快开始聊天吧！',
              date:  i.create_time,
              unRead:1,
            },
          })
          if(store.state.chatListStore.chatlist.length == 1){
            store.commit("setActiveWindow",{id:i.send_uid,type:1,name:i.send_nickname})

            let message = {}
            message[i.send_uid] = {
              msgList:[],
              unReadNum:0,
              count:0,
              activeWindowId:i.send_uid,
              activeName:"",
            }
            store.state.msgListStore.friendMsgMap = Object.assign({}, message,store.state.msgListStore.friendMsgMap)
            let addData = {
              asFrom:i.send_uid,
              asGroup:1,
              asTo:i.accept_uid,
              content:'你们已经成为好友了，快开始聊天吧！',
              create_time:i.create_time,
              head_portrait:i.send_avatar,
              nickname:i.send_nickname,
              singlemessage:{
                acceptid: i.accept_uid,
                comment: "",
                content: "你们已经成为好友了，快开始聊天吧！",
                sendid: i.send_uid,
              },
              read:1,
              status:'succeed',
              type:5,
              unique_value:i.unique_value,
              userMsg:false
            }
            store.state.msgListStore.friendMsgMap[i.send_uid].msgList.push(addData)

          }

        }else{
          store.state.chatListStore.chatlist.forEach((c)=>{
            let flag = data.find((a) => {
              return c.id == a.send_uid && c.chatType == 1
            })
            if(flag) {
              c.messages.lastMessage = '你们已经成为好友了，快开始聊天吧！',
              c.messages.date = i.create_time,
              c.messages.unRead = 1
            }

          })
        }

      })


    },
    setTransferDetail(state,data) {
      state.transferDetail = data;
    },
    setMergeNoticeList(state,data){
      let arr = data.data.reverse();
      state.mergeNoticeList.data = arr;
    },
    addMergeNoticeList(state,data){
      let arr = data.data.reverse();
      state.mergeNoticeList.data.unshift(...arr)
    },

    setIsGoDown(state,data){
      state.isGoDown = data
    },

    setRedId(state,data){
      state.red_id = data
    },
    setRedPackDetail(state,data){
      state.redPackDetail = data
    },
    // 存储当前空包的red_id
    getRedId(state,data){
      state.dataRedId = data
    },
    setOnlineState(state,data){
      state.onlineState=data;
    },
    // 红包发送类型
    setRedSendUidType(state,data){
      state.redSendUid = data.id
      state.thisRedType = data.type
      state.redUnique_value = data.unique_value || ''
    },
    setSendRedPackMessage(state,data){
      state.sendRedPackMessage = data
    },
    // 预抢详情
    setFirstGrabRedEnvelope(state,data){
      state.firstRedState = data
    },
    setDaShangObj(state,data){
      state.daShangObj = data
    },
    setRewardUser(state,data){
      state.rewardUserObj = {...state.rewardUserObj,...data}
    },
  }
  ,
  /*$store.dispatch*/
  actions:{

    //消息重发单人
    againSenAllTxt(context,data){
      // console.log("重发---",data)
      var data2=JSON.parse(JSON.stringify(data));
      var _cmMsg=data2
      var _msg=data2.singlemessage;
      var _type=9;
      delete _cmMsg.content;
      delete _cmMsg.asFrom;
      delete _cmMsg.asTo;
      delete _cmMsg.asGroup;
      delete _cmMsg.redState;
      delete _cmMsg.audioUnread;
      delete _cmMsg.status;
      delete _cmMsg.read;
      delete _cmMsg.showTime;
      delete _cmMsg.userMsg;
      delete _cmMsg.gameState;
      var _utf8Arr=setBefferMsg(_cmMsg,_msg,_type);
      WebIM.conn.send(_utf8Arr);
      data.status=null;
    },


    /*打赏某人*/
    dashangAction:(context,data)=>{
      let loading = Loading.service({lock: true, text: '支付中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve)=>{

        axios.post(window.host + '/Api/Chat/Gratuity', qs.stringify(data)).then(function (res) {
          loading.close();
          if (store.getters.getCodeStateZh(res.data.code)) {

            var temp = {};
            /*打赏者*/
            temp.nickname = store.state.chatuserInfoStore.dataGetInfo.nickname;
            temp.amount = data.amount;
            /*被打赏*/
            temp.toNickName = data.toNickName;

            var data2 = {
              to:store.state.msgListStore.activeWindowId,
              message:JSON.stringify(temp),
              type:store.state.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_DASHANG : _config.MSG_GROUP_DASHANG,
              // type:_config.MSG_GROUP_SHARE,
              reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})
            }

            if(store.state.msgListStore.activeTyep == 2){
              let group = {}
              group.groupName = store.state.friendsListStore.groupChatInfoList.data.group_name
              group.count = store.state.friendsListStore.groupChatInfoList.data.count
              data2.groupinfo = group
            }


            context.dispatch("sendMessageIM",data2);

            resolve()

          }
          else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
          }


        }).catch(function (error) {

        });

      })


    },
    /*跟投*/
    /*下注*/
    chatBetAction:(context,data)=>{
      axios.post(window.host+'/Api/Game/postCode', qs.stringify(data)).then(function (res) {

        if (store.getters.getCodeStateZh(res.data.code)) {
          Message({
            message:res.data.message,
            type:"success",
            showClose:true
          })
        }
        else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
        }
      }).catch(function (error) {
          // console.log(error);

        });


    },
    rewardUser(context,data){
      return new Promise((resolve,reject)=>{

        axios.post(window.host+'/Api/Chat/GratuityUser', qs.stringify(data)).then(function (res) {

          if (store.getters.getCodeStateZh(res.data.code)) {
            context.commit("setRewardUser",res.data)
            resolve()
          }
          else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
          }

          // console.log("成功", response);
        })
          .catch(function (error) {
            // console.log(error);

          });

      })
    },
    /*分享账单*/
    shareBillAction:function(context,data){

      /*
      * 1.查询报表接口
      * 2.推送接口账单信息
      * */

      let queryOjb={
        type:data.type,
      };

      return new Promise((resolve)=>{


        axios.post(window.host+'/Api/Order/userProfitCount/', qs.stringify(queryOjb)).then(function (res) {
          resolve()
          if (store.getters.getCodeStateZh(res.data.code)) {
            var t={};
            t.touzhutotal=res.data.data.touzhutotal || '0';
            t.fanjiangtotal=res.data.data.fanjiangtotal ||'0';
            t.tzyingkuitotal=res.data.data.tzyingkuitotal || '0';

            t.type = res.data.data.type || 1

            t.nickname = store.state.chatuserInfoStore.dataGetInfo.nickname;

            let data = {
              to:store.state.msgListStore.activeWindowId,
              message:JSON.stringify(t),
              type:store.state.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_SHARE : _config.MSG_GROUP_SHARE,
              reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})
            }
            if(store.state.msgListStore.activeTyep == 2){
              let group = {}
              group.groupName = store.state.friendsListStore.groupChatInfoList.data.group_name
              group.count = store.state.friendsListStore.groupChatInfoList.data.count
              data.groupinfo = group
            }
            context.dispatch("sendMessageIM",data);
          } else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
          }



        })


      })



    },
    /*签到
    *@parameter username 用户名
    */
    signinAction:function(context,data){

      var t={nickname:store.state.chatuserInfoStore.dataGetInfo.nickname,sharetype:"signin"};

      return new Promise((resolve)=>{

      axios.post(window.host+'/Api/Chat/setSign/', qs.stringify({username:store.state.chatuserInfoStore.dataGetInfo.username})).then(function (res) {

        if (store.getters.getCodeStateZh(res.data.code)) {


          var data = {
            to:store.state.msgListStore.activeWindowId,
            message:JSON.stringify(t),
            type:store.state.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_SIGN : _config.MSG_GROUP_SIGN,
            reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})
          }

          if(store.state.msgListStore.activeTyep == 2){
            let group = {}
            group.groupName = store.state.friendsListStore.groupChatInfoList.data.group_name
            group.count = store.state.friendsListStore.groupChatInfoList.data.count
            data.groupinfo = group
          }


          context.dispatch("sendMessageIM",data);
          resolve()


        }
        else {
          /*提示失败信息*/
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
        }

      })


      })





    },
    /*登出
    * */
    logout: (context,data) => {
        if (WebIM.conn.isOpened()) {
          WebIM.conn.close("logout")
        }
    },

    /*加入聊天室
    * @parameter roomId
    * */
    joinChatRoom:(context,data)=>{
      WebIM.conn.joinChatRoom({
        roomId: data.roomId
      })
    },

    // 单聊离线消息接口
    getSofflineMessageAction(context,data) {
      axios({
        method: 'post',
        url:window.hostIm+"/api/message/soffline",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          if(res.data.code === 10000){
            context.commit("setApplyMessage",res.data.data.applyMessage)
            context.commit("setOfflineMessage",res.data.data.offlineMessage)
          }

        }else {
          // Message({
          //   message:res.data.message,
          //   type:"warning",
          //   showClose:true超过1000
          // })
          return false;
        }
      })
    },
    // 群聊离线消息接口
    getGroupOfflineMessageAction(context,data) {
      axios({
        method: 'post',
        url:window.hostIm+"/api/message/goffline",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          if(res.data.code === 10000){
            context.commit("setGroupOfflineMessage",res.data.data)
          }

        }else {
          // Message({
          //   message:res.data.message,
          //   type:"warning",
          //   showClose:true
          // })
          return false;
        }
      })
    },

    // 单聊消息进入窗口拉取接口
    getLastMessageAction(context,data) {
      // context.commit("setMessageTimes",[]) //先清空数据,防止串消息
      // context.commit("setFriendHistory",[]) ////先清空,防止串消息
      return new Promise(resolve => {
        axios({
          method: 'post',
          url:window.hostIm+"/api/message/last",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            if(res.data.code === 10000){
              context.commit("setMessageTimes",res.data.data)
              context.commit("setFriendHistory",res.data.data)
              resolve(res.data.data)
            }
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


    // 群聊消息进入窗口消息拉取接口
    getGlastMessageAction(context,data) {
      // context.commit("setMessageTimes",[]) //防止串消息
      // context.commit("setGroupHistory",[]) //防止串消息
       new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/message/glast",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            if(res.data.code === 10000){
              context.commit("setMessageTimes",res.data.data)
              context.commit("setGroupHistory",res.data.data)
            }
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

    getMergeNoticeAction(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/Article/mergeNotice",
          data:qs.stringify(data)
        }).then(function(res){

          if(store.getters.getCodeStateZh(res.data.code)){
            context.commit("setMergeNoticeList",res.data.data)
            resolve(res.data)
          }else {
            return false;
          }
        })

      })
    },
    // 系统公告站内信
    addMergeNoticeAction(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/Article/mergeNotice",
          data:qs.stringify(data)
        }).then(function(res){
          resolve(res.data)
          if(res.data.code == 0){
            context.commit("addMergeNoticeList",res.data.data)
          }else {
            return false;
          }
        })

      })
    },

    // 单聊消息向上拉取/向下拉取 历史
    getJudegMessageAction(context,data) {
      return new Promise((resolve,reject)=>{

        axios({
          method: 'post',
          url:window.hostIm+"/api/message/judeg",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            if(res.data.code === 10000){
              // console.log(data)
              context.commit("setMessageTimes",res.data.data)
              context.commit("setFriendUpDownHistory",{data:res.data.data,isUpDown:data.isUpDown})
              resolve()
            }
            if(res.data.code === 10002){
              Message({
                message:'没有更多聊天记录',
                type:"warning",
                showClose:true
              })
            }
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
    //  群聊消息向上拉取/向下拉取历史
    getGjudgeMessageAction(context,data) {
      return new Promise((resolve,reject)=>{

        axios({
          method: 'post',
          url:window.hostIm+"/api/message/gjudge",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            if(res.data.code === 10000){
              context.commit("setMessageTimes",res.data.data)
              context.commit("setGroupUpDownHistory",{data:res.data.data,isUpDown:data.isUpDown})
              resolve()
            }
            if(res.data.code === 10002){
              Message({
                message:'没有更多聊天记录',
                type:"warning",
                showClose:true
              })
            }
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
    //  消息清屏请求接口
    getClearMessageAction(context,data) {
      return new Promise((resolve,reject)=>{

        axios({
          method: 'post',
          url:window.hostIm+"/api/clear/message",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){

            resolve()
          }else {

            return false;
          }
        })

      })
    },


    // 发红包
    sendRedPackActionIm(context, data){
      let loading = Loading.service({lock: true, text: '红包发送中...', background: 'rgba(0, 0, 0, 0.7)'});

      return new Promise((resolve)=>{
        axios({
          method: 'post',
          url:window.host+'/Api/wechatGame/sendRedEnvelopes',
          data:qs.stringify(data)

        }).then(function(res){
          loading.close();
          if(store.getters.getCodeStateZh(res.data.code)){
            resolve(res.data)

            var loginData = getSession2('loginData')
            var sendType = ''
            var msg = {
              id:res.data.data.redid,
              repcode:res.data.data.repcode,
              amount:data.total,
              topic:data.info,
              send_name:loginData.nickname,
              send_head_portrait:loginData.head_portrait
            }
            // if(data.retype == 1){

            // 个人红包
            if(data.retype == 2 && data.type == 0){
              sendType = _config.MSG_PRIVATE_RED
            }
            // 群红包
            if(data.retype == 1 && data.type == 0){
              sendType = _config.MSG_GROUP_RED
            }
            // 扫雷
            if(data.type == 1){
              msg.fval = data.thn
              sendType = _config.MSG_RED_LANDMINE

            }
            // 牛牛
            if(data.type == 2){
              msg.fval = data.jtype
              sendType = _config.MSG_RED_COW
            }
            // 接龙
            if(data.type == 3){
              sendType = _config.MSG_RED_DRAGON
            }
            var temp = {
              to:data.jid,
              message:JSON.stringify(msg),
              type:sendType,
              reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})
            }

            if(data.retype == 1){
              let group = {}
              group.groupName = store.state.friendsListStore.groupChatInfoList.data.group_name
              group.count = store.state.friendsListStore.groupChatInfoList.data.count
              temp.groupinfo = group
            }
            context.dispatch("sendMessageIM",temp)
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

    //  预领取红包
    firstGrabRedEnvelopeAction(context,data) {
      let loading = Loading.service({lock: true, text: '红包领取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.host+'/Api/wechatGame/firstGrabRedEnvelope',
          data:qs.stringify(data)
        }).then(function(res){
          loading.close();
          context.commit("setFirstGrabRedEnvelope",res.data)
          resolve(res.data)
          if(store.getters.getCodeStateZh(res.data.code)){
            // Toast({
            //   message:res.data.message,
            // })

          }else {
            // Toast({
            //   message:res.data.message,
            // })
            return false;
          }
        })

      })
    },
    //  领取红包
    getRedPackAction(context,data) {
      let loading = Loading.service({lock: true, text: '红包领取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.host+'/Api/wechatGame/grabRedEnvelope',
          data:qs.stringify(data)
        }).then(function(res){
          loading.close();
          if(store.getters.getCodeStateZh(res.data.code)){
            context.commit("setRedPackDetail",res.data.data)
            resolve(res.data.data)
            if(data.gtype == 1 && res.data.code == 0 && res.data.data.grab.money > 0){

              var msg = {
                amount:res.data.data.grab.money,
              }
              if(store.state.msgListStore.activeTyep == 2){
                msg.nickname = store.state.chatuserInfoStore.dataGetInfo.nickname
                // msg.send_name = res.data.data.base.username || ''
              }
              var temp = {
                to:store.state.msgListStore.activeWindowId,
                message:JSON.stringify(msg),
                type:store.state.msgListStore.activeTyep == 2 ? _config.MSG_GROUP_ROB : _config.MSG_PRIVATE_ROB,
                reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})
              }
              // 推送

              if(store.state.msgListStore.activeTyep == 2){
                let group = {}
                group.groupName = store.state.friendsListStore.groupChatInfoList.data.group_name
                group.count = store.state.friendsListStore.groupChatInfoList.data.count
                group.findId = context.state.redSendUid
                group.findId = context.state.redSendUid +""
                temp.groupinfo = group
                // console.log(context.state.redSendUid)
              }
              if(!data.qtype || data.qtype != 2){
                context.dispatch("sendMessageIM",temp)
              }

            }
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

    // 转账详情
    getTransferDetail(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/Transfer/Detail",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeStateZh(res.data.code)){
            context.commit("setTransferDetail",res.data.data);
            resolve(res.data.data)
            return true;
          }else {
            // Toast({
            //   message: res.data.message,
            // });
            return false;
          }
        })
      })
    },

    // 获取红包列表
    getbRedEnvelopeImList(context,data) {
      let loading = Loading.service({lock: true, text: '获取列表中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.host+'/Api/wechatGame/redEnvelopeList',
          data:qs.stringify(data)
        }).then(function(res){
          loading.close();
          if(store.getters.getCodeStateZh(res.data.code)){
            resolve(res.data.data)
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

    /*推送文本广播
    *@parameter to       //推送到id{to:id,messge:""}
    *@parameter message  //推送信息
    *@parameter type     //推送类型
    * @parameter groupinfo  // 群聊扩展
    * */
    sendMessageIM: (context,data) => {
      var {to, message, type ,reserved,groupinfo}=data;
      var _fromId=store.state.chatuserInfoStore.loginData.id;
        const pMessage = parseFromLocal(_fromId, to, message, type,reserved,groupinfo);

        var _cmMsg=pMessage;

        var _type=_config._ifGroup(type) ? 10 : 9;

        var _msg;
        // console.log(_cmMsg.groupmessage)
        // console.info("调试__",pMessage,_type)
           //9单人 10群组
        if(_type==9){
          _msg=pMessage.singlemessage;
          // delete  pMessage.singlemessage;
          // delete  pMessage.groupmessage;
        }else{
          _msg=pMessage.groupmessage;
          // delete  pMessage.singlemessage;
          // delete  pMessage.groupmessage;
        }
        var _utf8Arr=setBefferMsg(_cmMsg,_msg,_type);
        // console.log("发送对象",getResponeMsg(_utf8Arr));

        WebIM.conn.send(_utf8Arr);
        if(type!=_config.MSG_SYS_INDEX){
          store.dispatch("addMsgAction",pMessage);
        }
    },


    //http重发信息
    retrySed(context,data) {
      // console.log(data)

      var data2= {
        // uniqueId: 'webIM_X0MHHsD6Hubf_1582006038503',
        // from: 'web',
        // type: 5,
        // 'sendTime': 1582006039,
        // avatar: 'http:youpai10.dasheng80.com\/head\/01.png',
        // nickname: '奸勘角潞秦',
        // singleData: {sendId: 49142, acceptId: 9, content: 'sdcsdcs'}
      };
      data2.uniqueId=data.unique_value;
      data2.from=data.from;
      data2.type=data.type;
      data2.sendTime=data.create_time;
      data2.avatar=data.head_portrait;
      data2.nickname=data.nickname;
      data2.singleMessage =data.singlemessage;
      data2.singleMessage.sendId =data.singlemessage.sendid || '';
      data2.singleMessage.acceptId =data.singlemessage.acceptid || '';
      delete data.singlemessage.sendid;
      delete data.singlemessage.acceptid;
      // console.log("http重发",data)
      // console.log("http重发格式",data2)


      data2=JSON.stringify(data2);
      var temp={message:data2}
      // console.log(data2);



      var list=[5,6,7,15,13,14,25,47,46,40];

      if(list.indexOf(data.type*1) == -1){
        return;
      }

      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/push/retry",
          data:qs.stringify(temp)
          // data:data2
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            data.status="succeed";
          }else {
            // Toast({
            //   message:res.data.message,
            // })
            return false;
          }
        })
      })
    },
  }

}

