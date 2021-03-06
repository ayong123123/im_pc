/**
 * 关系信息
 */
import Vue from 'vue';
import axios from '../axios'
// import router from '../router'
import qs from 'qs'
import md5 from 'js-md5'
import store from '../store'
import _config from "../configWX/configWX"
import AppDB from "../utils/AppDB"
// import {getDate,setDate,copyobj,setSession,getSession} from '../common/common'
// import { Loading,Message,MessageBox} from 'element-ui';
import {dateDiffChatIM,setSession2,getSession2} from '@/common/common'
export default {
  state:{
    //当前活跃窗口
    activeWindowId: 999999999,
    //窗口类型 MSG_GROUP:2 MSG_PRIVATE:1
    activeTyep:"1",
    //窗口名称 (群组名称)
    activeName:"",
    //群组人数
    activeNum:"",
    head_portrait:'',
    //朋友信息
    friendMsgMap:{
      //会话者id
      id:{
        //信息队列
        msgList:[],
        //未读气泡
        unReadNum:0,
        //总数
        count:0,
        //姓名
        activeWindowId:"",
        //昵称
        activeName:"",
      }
    },
    //聊天室分组信息
    roomMsgMap:{
      id:{
        msgList:[],
        unReadNum:0,
        count:0,
        activeWindowId:"id",
        activeName:"",
      },
    },
    //系统信息
    sysMsgMap:{
      id:{
        msgList:[],
        unReadNum:0,
        count:0,
        activeWindowId:"id",
        activeName:"",
      },
    },
    // 群@消息列表
    findMeMap:{
      id:{
        list:[],
        state:false,
      },
    },
    didiMp3State:false,  //滴滴滴铃声
    redPackMp3State:false, //红包 铃声
    questSoundMp3State:false,

    isFirstLogin:false,  //  登陆状态 每次登陆后只请求一次离线
  },
  /*$store.commit*/
  mutations: {
    setBullDataIm(state, data){
      let Detail = getSession2("niuDetail")
      if(Detail){
        if(Detail[data.code]){
          Detail[data.code] = data.detail
          setSession2("niuDetail",Detail)
        }else{
          let setData = {}
          setData[data.code] = data.detail
          Detail = Object.assign({}, setData,Detail)
          setSession2("niuDetail",Detail)
        }
      }else{
        let setData = {}
        setData[data.code] = data.detail
        setSession2("niuDetail",setData)
      }

    },
    // 置灰
    setRedHuiIm(state, data){
      let redDate = getSession2("redHui")
      if(redDate){
        let sta = redDate.some((a)=> a == data.code)
        if(!sta){
          redDate.push(data.code)
          if(redDate.length > 100){
            redDate.splice(0,1)
          }
          setSession2("redHui",redDate)
        }
      }else{
        let redCode = []
        redCode.push(data.code)
        setSession2("redHui",redCode)
      }

    },
    // 设置聊天状态
    setChatGameState(state,data){
      var arr;
      // console.log('data',data)
      if(data.chatType == 1) {
        arr = state.friendMsgMap[state.activeWindowId].msgList
      }
      if(data.chatType == 2) {
        arr = state.roomMsgMap[state.activeWindowId].msgList
      }
      arr.forEach((i,index)=>{
        if(data.type == 1){
          if(i.unique_value == store.state.wechatIMstore.redUnique_value) {
            if(data.data.base.type == 2){
              let data1 = i
              if(data1.niu_detail){
                delete data1.niu_detail
              }else{
                data1.niu_detail = data.data
              }
              state.roomMsgMap[state.activeWindowId].msgList[index] = Object.assign({}, data1,state.roomMsgMap[state.activeWindowId].msgList[index])
            }else{
              let data2 = i
              if(data2.redState == false){
                delete data2.redState
              }else{
                data2.redState = true
              }
              state.roomMsgMap[state.activeWindowId].msgList[index] = Object.assign({}, data2,state.roomMsgMap[state.activeWindowId].msgList[index])
            }
          }
        }
        if(data.type == 2){
          if(i.unique_value == data.data) {
            if(i.audioUnread == false){
              delete i.audioUnread
            }
            let data1 = {}
            data1['audioUnread'] = true
            arr[index] = Object.assign({}, data1,arr[index])
          }
        }

      })


    },
    setIsFirstLogin(state,data){
      state.isFirstLogin = data
    },
    // 进入聊天创建对话对象
    createFriendChatMessage(state,data){
      if(!state.friendMsgMap[data.id]){
        let message = {}
        message[data.id] = {
          msgList:[],
          unReadNum:0,
          count:0,
          activeWindowId:data.id,
          activeName:"",
        }
        state.friendMsgMap = Object.assign({}, message,state.friendMsgMap)
      }
    },
    // 进入聊天创建对话对象
    createGroupChatMessage(state,data){
      if(!state.roomMsgMap[data.id]){
        let message = {}
        message[data.id] = {
          msgList:[],
          unReadNum:0,
          count:0,
          activeWindowId:data.id,
          activeName:"",
        }
        state.roomMsgMap = Object.assign({}, message,state.roomMsgMap)
      }
    },

    //  新建聊天窗口
    newBuildFriendChatBox(state,data){
      let idx = store.state.chatListStore.chatlist.findIndex((a) => {
        return data.singlemessage.sendid == a.id && a.chatType == 1
      })
      if(idx != -1){

      }

      if(!state.friendMsgMap[data.singlemessage.sendid]) {
        store.state.chatListStore.chatlist.unshift({
          chatType:1,
          id:data.singlemessage.sendid,
          chatCount:1,
          user: {
            remarks_name:'',
            name: data.nickname,
            img:  data.head_portrait,
          },
          messages:{
            lastMessage: data.singlemessage.content,
            date:  data.create_time,
            unRead:1,
          },
        })
        // if(store.state.chatListStore.chatlist.length == 1){
        store.commit("setActiveWindow",{id:data.singlemessage.sendid,type:1,name:data.nickname})
        // }


        let message = {}
        message[data.singlemessage.sendid] = {
          msgList:[],
          unReadNum:0,
          count:0,
          activeWindowId:data.singlemessage.sendid,
          activeName:"",
        }
        state.friendMsgMap = Object.assign({}, message,state.friendMsgMap)
        state.friendMsgMap[data.singlemessage.sendid].msgList.push(data)

      }else{
        state.friendMsgMap[data.singlemessage.sendid].msgList.push(data)
        store.state.chatListStore.chatlist.forEach((c)=>{
          if(data.singlemessage.sendid == c.id && c.chatType == 1){
            c.messages.lastMessage = data.singlemessage.content,
              c.messages.date = data.create_time,
              c.messages.unRead = 1
          }
        })
        store.commit("setActiveWindow",{id:data.singlemessage.sendid,type:1,name:data.nickname})
        store.commit("setChatGoUp",{id:data.singlemessage.sendid,chatType:1})

      }
    },

    setAllMp3State(state,data){
      state.didiMp3State = false
      state.redPackMp3State = false
      state.questSoundMp3State = false
    },
    setQuestSound (state,data){
      state.questSoundMp3State = false
      setTimeout(()=>{
        state.questSoundMp3State = true
      },1000)
    },
    //  设置dididi声音
    setDiDiAudio (state,data){
      state.didiMp3State = false
      setTimeout(()=>{
        state.didiMp3State = true
      },1000)
    },
    //  设置红包来了声音
    setRedPackMp3State(state,data){
      state.redPackMp3State = false
      setTimeout(()=>{
        state.redPackMp3State = true
      },1000)
    },
    // 隐藏某群@人横条
    setCloseFindMeModal(state,data){
      state.findMeMap[state.activeWindowId].state = false
    },

    // 显示某个群 @人 的状态
    setFindMeList(state,data){
      var groupid = data.groupmessage.groupid
      if(state.findMeMap[groupid]){

        state.findMeMap[groupid].list.splice(0,1,data)
      }else{
        let message = {}
        message[groupid] = {
          list:[],
          state:false,
        }
        state.findMeMap = Object.assign({}, message,state.findMeMap)
        state.findMeMap[groupid].list.push(data)
      }
      // 更新最后一条消息
      setTimeout(()=>{
        store.commit("upGroupOtherChatUserList",data)
      },300)

      state.findMeMap[groupid].state = true
    },
    // 设置群离线公告
    setGroupOfflineList(state,data){
      var groupid = data.id
      if(state.findMeMap[groupid]){

        state.findMeMap[groupid].list.splice(0,1,data)
      }else{
        let message = {}
        message[groupid] = {
          list:[],
          state:false,
        }
        state.findMeMap = Object.assign({}, message,state.findMeMap)
        state.findMeMap[groupid].list.push(data)
      }

      state.findMeMap[groupid].state = true
    },
    // 无历史记录查看历史
    setFriendHistory(state,data){
      let arr = data.reverse();
      let filterArr = arr.filter(i => i.is_recall == 1)

      // 无聊天数据创建
      // if(state.friendMsgMap[state.activeWindowId]){
      //   state.friendMsgMap[state.activeWindowId].msgList = filterArr
      // }else{
      let message = {}
      message[state.activeWindowId] = {
        msgList:[],
        unReadNum:0,
        count:0,
        activeWindowId:state.activeWindowId,
        activeName:"",
      }
      state.friendMsgMap = Object.assign({}, message,state.friendMsgMap)
      state.friendMsgMap[state.activeWindowId].msgList = filterArr
      // }

      if(filterArr.length > 0){
        store.commit("setOfflineLastMessage",filterArr[filterArr.length -1])
      }
    },
    // 拉取离线消息设置最后一条消息
    setOfflineLastMessage(state,data){
      var name = data.username ? data.username + ':' : ''
      store.state.chatListStore.chatlist.forEach((i)=>{
        if(i.id == state.activeWindowId && i.chatType == state.activeTyep){
          i.messages.unRead = 0
          i.messages.date = data.create_time
          if(data.type == _config.MSG_PRIVATE_TXT || data.type == _config.MSG_GROUP_TXT){
            i.messages.lastMessage = name + data.content
          }
          if(data.type == _config.MSG_GROUP_RED || data.type == _config.MSG_PRIVATE_RED || data.type == _config.MSG_RED_LANDMINE || data.type == _config.MSG_RED_COW || data.type == _config.MSG_RED_DRAGON){
            i.messages.lastMessage = name + '[有红包]'
          }
          if(data.type == _config.MSG_MONEY_TRANSFER){
            i.messages.lastMessage =name + '[转账]'
          }
          if(data.type == _config.MSG_PRIVATE_IMG || data.type == _config.MSG_GROUP_IMG){
            i.messages.lastMessage =name + '[图片]'
          }
          if(data.type == _config.MSG_GROUP_CARD || data.type == _config.MSG_PRIVATE_CARD){
            i.messages.lastMessage = name + '[名片]'
          }
          if(data.type == _config.MSG_PRIVATE_ROB || data.type == _config.MSG_GROUP_ROB){
            i.messages.lastMessage = name + '[红包被领取]'
          }
          if(data.type == _config.MSG_PRIVATE_AUDIO || data.type == _config.MSG_GROUP_AUDIO){
            i.messages.lastMessage = name + '[语音消息]'
          }
          if(data.type == _config.MSG_GROUP_VIDEO || data.type == _config.MSG_PRIVATE_VIDEO){
            i.messages.lastMessage = name + '[视频]'
          }
          if(data.type == _config.MSG_PRIVATE_SHARE || data.type == _config.MSG_GROUP_SHARE){
            i.messages.lastMessage =name + '[盈亏]'
          }
          if(data.type == _config.MSG_PRIVATE_SIGN || data.type == _config.MSG_GROUP_SIGN){
            i.messages.lastMessage =name + '[签到]'
          }
          if(data.type == _config.MSG_PRIVATE_DASHANG || data.type == _config.MSG_GROUP_DASHANG){
            i.messages.lastMessage =name + '[打赏]'
          }
          if(data.type == _config.MSG_PRIVATE_SHARENOTE || data.type == _config.MSG_GROUP_SHARENOTE){
            i.messages.lastMessage =name + '[注单分享]'
          }
          if(data.type == _config.MSG_GROUP_PLAN ){
            i.messages.lastMessage =name + '[进准计划]'
          }
          if(data.type == _config.MSG_GROUP_INGROUP){
            i.messages.lastMessage = data.content
          }
        }
      })
    },
    // 无历史记录查看历史
    setGroupHistory(state,data){
      let arr = data.reverse();
      let filterArr = arr.filter(i => i.is_recall == 1 && i.clear_time < i.create_time)

      // if(state.roomMsgMap[state.activeWindowId]){
      //   state.roomMsgMap[state.activeWindowId].msgList = filterArr
      // }else {
      let message = {}
      message[state.activeWindowId] = {
        msgList: [],
        unReadNum: 0,
        count: 0,
        activeWindowId: state.activeWindowId,
        activeName: "",
      }
      state.roomMsgMap = Object.assign({}, message, state.roomMsgMap)
      state.roomMsgMap[state.activeWindowId].msgList = filterArr
      // }
      if(filterArr.length > 0){
        store.commit("setOfflineLastMessage",filterArr[filterArr.length -1])
      }
    },
    // 单聊上下拉
    setFriendUpDownHistory(state,data){
      if(data.isUpDown == 1){
        let arr = data.reverse();
        let filterArr = arr.filter(i => i.is_recall == 1)
        state.friendMsgMap[state.activeWindowId].msgList.push(...filterArr)
        if(filterArr.length > 0){
          store.commit("setOfflineLastMessage",filterArr[filterArr.length -1])
        }
      }
      if(data.isUpDown == 2){
        let arr = data.data.filter(i => i.is_recall == 1)
        state.friendMsgMap[state.activeWindowId].msgList.unshift(...arr)
      }

    },
    // 群聊上下拉
    setGroupUpDownHistory(state,data){
      if(data.isUpDown == 1){
        let filterArr = data.data.filter(i => i.is_recall == 1 && i.clear_time < i.create_time)
        // let arr = data.data.reverse();
        state.roomMsgMap[state.activeWindowId].msgList.push(...filterArr)
        if(filterArr.length > 0){
          store.commit("setOfflineLastMessage",filterArr[filterArr.length -1])
        }
      }
      if(data.isUpDown == 2){
        let arr = data.data.reverse();
        let filterArr = arr.filter(i => i.is_recall == 1 && i.clear_time < i.create_time)
        state.roomMsgMap[state.activeWindowId].msgList.unshift(...filterArr)
      }
    },
    // 登录初始化 数据
    initChatInfo(state,data){
      let message = {}
      message['id'] = {
        msgList:[],
        unReadNum:0,
        count:0,
        activeWindowId:"id",
        activeName:"",
      }
      state.friendMsgMap = message
      state.roomMsgMap = message
      state.sysMsgMap = message
      store.state.chatListStore.chatlist = []
      store.state.friendsListStore.goodFriendList = []
      store.state.friendsListStore.kefuList = []
      store.state.friendsListStore.newAddFriendHistory = []
      store.state.chatListStore.ChatRightFriendBoxState = false
      store.state.chatListStore.ChatRightBoxState = false

    },
    /**
     * id ： 用户 / 群 id
     * type: 消息类型
     *  unique_value: md5 唯一标识
     * */
    // 撤回消息
    clearMessageBack(state,data){
      if(data.type == 1){
        state.friendMsgMap[data.id].msgList.forEach((i,index)=>{
          if (i.unique_value == data.unique_value) {
            state.friendMsgMap[data.id].msgList.splice(index,1)
          }
        })
      }else{
        state.roomMsgMap[data.id].msgList.forEach((i,index)=>{
          if (i.unique_value == data.unique_value) {
            state.roomMsgMap[data.id].msgList.splice(index,1)
          }
        })
      }
    },
    //  删除对话所有信息
    deleteMessageMap(state,data){
      if(data.chatType == 1){
        delete state.friendMsgMap[data.id]
      }else{
        delete state.roomMsgMap[data.id]
      }
    },
    //  清空本地聊天记录
    clearChatHisTory(state,data){
      if(data.chatType == 1){
        state.friendMsgMap[data.id].msgList = []
      }else{
        state.roomMsgMap[data.id].msgList = []
      }
      store.state.chatListStore.chatlist.forEach((i)=>{
        if(i.id == data.id && i.chatType == data.chatType){
          i.messages.lastMessage = '暂无消息记录'
        }
      })
    },

    /*
    * @describe 切换聊天窗口 记录新窗口
    * @parameter  Id 窗口聊天id int
    * @parameter  tyep 聊天类型 单 群（MSG_GROUP:2 MSG_PRIVATE:1） int
    * @parameter  name 聊天窗口名称 （取昵称）  str
    * @parameter  num  聊天窗口人数 （群租使用）  int
    * */
    setActiveWindow(state,data){
      // console.log(data.id)
      Vue.set(state,'activeWindowId',data.id || -1)
      Vue.set(state,'activeTyep',data.type || -1)
      Vue.set(state,'activeName',data.name || -1)
      Vue.set(state,'activeNum',data.num || -1)
      Vue.set(state,'activePortrait',data.head_portrait || -1)
      // state.activeWindowId=data.id || -1;
      // state.activeTyep=data.type || -1;
      // state.activeName=data.name || -1;
      // state.activeNum=data.num || -1;
      // state.activePortrait = data.head_portrait || -1
      //标识已读
      // AppDB.readMessage(state.activeTyep,state.activeWindowId);

      if(state.activeTyep==_config.MSG_GROUP){
        state.roomMsgMap[state.activeWindowId]=state.roomMsgMap[state.activeWindowId] || { msgList:[], unReadNum:0, count:0, activeWindowId:"id", activeName:""};

        state.roomMsgMap[state.activeWindowId].msgList.forEach(function(val,index,arr){
          val.read=_config.MSG_READ;
        });

      };

      if(state.activeTyep==_config.MSG_PRIVATE){
        state.friendMsgMap[state.activeWindowId]=state.friendMsgMap[state.activeWindowId] || { msgList:[], unReadNum:0, count:0, activeWindowId:"id", activeName:""};
        state.friendMsgMap[state.activeWindowId].msgList.forEach(function(val,index,arr){
          val.read=_config.MSG_READ;
        });
      };

      if(state.activeTyep==_config.MSG_SYS){
        state.sysMsgMap[state.activeWindowId]=state.sysMsgMap[state.activeWindowId] || { msgList:[], unReadNum:0, count:0, activeWindowId:"id", activeName:""};
        state.sysMsgMap[state.activeWindowId].count = 0
        state.sysMsgMap[state.activeWindowId].unReadNum = 0
        state.sysMsgMap[state.activeWindowId].msgList.forEach(function(val,index,arr){
          val.read=_config.MSG_READ;
        });
      };

    },
    /*
    * @parameter  id对话(人)窗口id
    * */
    updateFriendMsg(state,data){
      var _key=data.id;
      delete  data.id;
      // state.friendMsgMap[_key]=state.friendMsgMap[_key] || {msgList:[],unReadNum:0,count:0};
      state.friendMsgMap[_key]=data.body;
    },
    /*
    * 更新单聊 data.first;
    * */
    updatePrivateChat(state,data){
      var {asTo,asFrom,unique_value,type,singlemessage}=data;

      if(asTo==store.state.chatuserInfoStore.loginData.id){
        asTo=asFrom;
      }

      // 列表是否存在
      let idx = store.state.chatListStore.chatlist.some((a) => {
        return asTo == a.id && a.chatType == 1
      })
      if(!idx){
        var activeName = ''
        var activePortrait = ''
        var userObj;
        if(data.singlemessage.sendid==store.state.chatuserInfoStore.loginData.id){
          userObj = store.state.friendsListStore.allFriendList.find(img => img.id == data.singlemessage.acceptid)
          activeName =userObj && userObj.remarks_name || state.activeName
          activePortrait =userObj && userObj.head_portrait || state.activePortrait
        }else{
          userObj = store.state.friendsListStore.allFriendList.find(img => img.id == data.singlemessage.sendid)
          activeName =userObj && userObj.remarks_name || data.nickname
          activePortrait =userObj && userObj.head_portrait || data.head_portrait
        }
        let fromMessage = {
          id:asTo,
          name:data.nickname,
          count:1,
          head_portrait:activePortrait || data.head_portrait,
          remarks_name:activeName,
        }
        store.commit("sendNewChat",{message:fromMessage,lastMessage:data.singlemessage.content,type:1,state:false})
      }


      if(state.friendMsgMap[asTo]){
        var _arr=state.friendMsgMap[asTo].msgList;
        console.log('进入了11',_arr)
        var _temp=true;
        var _unReadNum=0;
        _arr.forEach(function(val,index,arr){
          if(val.unique_value==unique_value){
            _temp=false;
            _arr.splice(index,1,data)
            // _arr[index]=data;
            // 自己发送消息回调间隔时间低于60s不展示时间
            if(_arr.length > 1 && (_arr[_arr.length -1].create_time - _arr[_arr.length -2].create_time) < 60){
              _arr[_arr.length -1].showTime = true
            }
          }
          if(val.read == _config.MSG_UNREAD){
            _unReadNum++
          }

        })

        if(_temp){
          _arr.push(data);
          // data.read=_config.MSG_UNREAD ?  _unReadNum++ : false;
          if(data.read == _config.MSG_UNREAD){
            _unReadNum++
          }
          // 他人发送消息回调间隔时间低于60s不展示时间
          if(!data.userMsg) {
            if(_arr.length > 1 && (_arr[_arr.length -1].create_time - _arr[_arr.length -2].create_time) < 60){
              _arr[_arr.length -1].showTime = true
            }
          }
          // 超过一百条数据开始删除
          if(_arr.length > 60) {
            _arr.splice(0,1)
          }
        }


        state.friendMsgMap[asTo].unReadNum=_unReadNum;
        state.friendMsgMap[asTo].count=state.friendMsgMap[asTo].msgList.length;


        var _id=0;
        if(data.asFrom==store.state.chatuserInfoStore.loginData.id){
          _id=data.asTo;
        }

        if(data.asTo==store.state.chatuserInfoStore.loginData.id){
          _id=data.asFrom;
        }

        //处理等级
        console.log('state.friendMsgMap[asTo]',state.friendMsgMap[asTo])
        console.log('插入信息',_arr)

        store.commit("updateChatUserList",{lastMessage:_arr[_arr.length-1],unRead:_unReadNum,date:data.create_time,chatType:data.asGroup,id:_id})

      }else{
        console.log('进入了')
        let message = {}
        message[asTo] = {
          msgList:[],
          unReadNum:0,
          count:0,
          activeWindowId:asTo,
          activeName:"",
        }

        state.friendMsgMap = Object.assign({}, message,state.friendMsgMap)

        if(!data.first){
          state.friendMsgMap[asTo].msgList.push(data)

          var _id=0;
          if(data.asFrom==store.state.chatuserInfoStore.loginData.id){
            _id=data.asTo;
          }

          if(data.asTo==store.state.chatuserInfoStore.loginData.id){
            _id=data.asFrom;
          }

          var _arr=state.friendMsgMap[asTo].msgList;
          var _unReadNum=state.friendMsgMap[asTo].unReadNum;
          store.commit("updateChatUserList",{lastMessage:_arr[_arr.length-1],unRead:1,date:data.create_time,chatType:data.asGroup,id:_id})
        }

      }
      console.log('dd',state.friendMsgMap)

      // 消息置顶
      store.commit("setChatGoUp",{id:asTo,chatType:1 })


    },
    /*
    * 更新群聊
    * */
    updateGroupChat(state,data){
      var {asTo,unique_value,type,groupmessage}=data;


      let idx = store.state.chatListStore.chatlist.some((a) => {
        return asTo == a.id && a.chatType == 2
      })
      if(!idx){
        let fromMessage = {
          id:asTo,
          name:data.groupmessage.groupName || '群组',
          count:data.groupmessage.groupPeoples,
          head_portrait:data.head_portrait,
          remarks_name:'',
        }

        store.commit("sendNewChat",{message:fromMessage,lastMessage:data.groupmessage.content,type:2,state:false})
      }

      if(state.roomMsgMap[asTo]){

        var _arr=state.roomMsgMap[asTo].msgList;

        var _temp=true;
        var _unReadNum=0;
        _arr.forEach(function(val,index,arr){
          //更新
          if(val.unique_value==unique_value){
            _temp=false;
            _arr.splice(index,1,data)
            // _arr[index]=data
            // 自己发送消息回调间隔时间低于60s不展示时间
            if(_arr.length > 1 && (_arr[_arr.length -1].create_time - _arr[_arr.length -2].create_time) < 60){
              _arr[_arr.length -1].showTime = true
            }
          }
          if(val.read == _config.MSG_UNREAD){
            _unReadNum++
          }
        })

        if(_temp){
          //插入
          _arr.push(data);
          // data.read=_config.MSG_UNREAD ?  _unReadNum++ : false;
          if(data.read == _config.MSG_UNREAD){
            _unReadNum++
          }
          // 他人发送消息回调间隔时间低于60s不展示时间
          if(!data.userMsg) {
            if(_arr.length > 1 && (_arr[_arr.length -1].create_time - _arr[_arr.length -2].create_time) < 60){
              _arr[_arr.length -1].showTime = true
            }
          }
          // 超过一百条数据开始删除
          if(_arr.length > 60) {
            _arr.splice(0,1)
          }
        }

        state.roomMsgMap[asTo].unReadNum=_unReadNum;
        state.roomMsgMap[asTo].count=state.roomMsgMap[asTo].msgList.length;


        // var _id=0;
        // if(data.asFrom==store.state.chatuserInfoStore.loginData.id){
        //   _id=data.asTo;
        // }
        //
        // if(data.asTo==store.state.chatuserInfoStore.loginData.id){
        //   _id=data.asFrom;
        // }

        store.commit("updateChatUserList",{lastMessage:_arr[_arr.length-1],unRead:_unReadNum,date:data.create_time,chatType:data.asGroup,id:asTo})

      }else{

        let message = {}
        message[asTo] = {
          msgList:[],
          unReadNum:0,
          count:0,
          activeWindowId:asTo,
          activeName:"",
        }

        state.roomMsgMap = Object.assign({}, message,state.roomMsgMap)

        if (!data.first) {
          state.roomMsgMap[asTo].msgList.push(data)
          var _arr=state.roomMsgMap[asTo].msgList;


          var _unReadNum=state.roomMsgMap[asTo].unReadNum;

          store.commit("updateChatUserList",{lastMessage:_arr[_arr.length-1],unRead:1,date:data.create_time,chatType:data.asGroup,id:asTo})
        }

      }
      // 消息置顶
      store.commit("setChatGoUp",{id:asTo,chatType:2 })


    },

    /*
     * 更新系统信息
     * */
    updateSysChat(state,data){
      var {asTo,unique_value,type,groupmessage}=data;

      let idx = store.state.chatListStore.chatlist.some((a) => {
        return asTo == a.id && a.chatType == 3
      })
      var lastMessage = JSON.parse(data.content)
      if(!idx){
        let fromMessage = {
          id:asTo,
          name:'系统消息',
          count:0,
          head_portrait:'',
          remarks_name:'',
        }

        store.commit("sendNewChat",{message:fromMessage,lastMessage:lastMessage,type:3,state:false})
      }

      if(state.sysMsgMap[asTo]){

        var _arr=state.sysMsgMap[asTo].msgList;

        var _temp=true;
        var _unReadNum=0;
        _arr.forEach(function(val,index,arr){
          //更新
          if(val.unique_value==unique_value){
            _temp=false;
            _arr.splice(index,1,data)
            // _arr[index]=data
          }
          if(data.read == 2){
            _unReadNum++
          }
        })

        if(_temp){
          //插入
          _arr.push(data);
          if(data.read == 2){
            _unReadNum++
          }
        }

        state.sysMsgMap[asTo].unReadNum=_unReadNum;
        state.sysMsgMap[asTo].count=state.sysMsgMap[asTo].msgList.length;


        store.commit("upSystemChatUserList",{lastMessage:lastMessage,type:data.type,unRead:_unReadNum,date:data.create_time,chatType:data.asGroup,id:asTo})

      }else{

        let message = {}
        message[asTo] = {
          msgList:[],
          unReadNum:0,
          count:0,
          activeWindowId:asTo,
          activeName:"",
        }

        state.sysMsgMap = Object.assign({}, message,state.sysMsgMap)

        if (!data.first) {

          state.sysMsgMap[asTo].msgList.push(data)

          var _unReadNum=state.sysMsgMap[asTo].unReadNum;

          store.commit("upSystemChatUserList",{lastMessage:lastMessage,unRead:_unReadNum,date:data.create_time,chatType:data.asGroup,id:asTo})
        }

      };
      store.commit("setChatGoUp",{id:asTo,chatType:3 })

    },
  },
  /*$store.getters*/
  getters:{
    getChatList(state) {
      // console.log('getters',state.activeWindowId)
      switch(state.activeTyep*1) {
        case _config.MSG_GROUP:
          return state.roomMsgMap[state.activeWindowId] && state.roomMsgMap[state.activeWindowId].msgList || []
          break;
        case _config.MSG_PRIVATE:
          return state.friendMsgMap[state.activeWindowId] && state.friendMsgMap[state.activeWindowId].msgList || []
          break;
        case _config.MSG_SYS:
          return state.sysMsgMap[state.activeWindowId] && state.sysMsgMap[state.activeWindowId].msgList || []
          break;
      }
    },
    getFindMeMsg(state){
      return state.findMeMap[state.activeWindowId] && state.findMeMap[state.activeWindowId].list || []
    },
    getFindMeState(state){
      return state.findMeMap[state.activeWindowId].state
    }
  },
  /*$store.dispatch*/
  actions:{
    findMeListAction: ({ commit },value) => commit('setFindMeList',value),

    messageCallBack: ({ commit },value) => commit('clearMessageBack',value),

    addMsgAction(context,data){
      var {code,type,groupmessage,singlemessage}=data;
      //格式分离
      if(_config._ifSys(type)){
        data.content=groupmessage.content;
        data.asFrom=groupmessage.sendid;
        data.asTo=groupmessage.groupid;
        data.asGroup=_config.MSG_SYS;
      }
      //格式分离
      if(_config._ifGroup(type)){
        data.content=groupmessage.content;
        data.asFrom=groupmessage.sendid;
        data.asTo=groupmessage.groupid;
        data.asGroup=_config.MSG_GROUP;
      }

      if(_config._ifPrivate(type)){
        data.content=singlemessage.content;
        data.asFrom=singlemessage.sendid;
        data.asTo=singlemessage.acceptid;
        data.asGroup=_config.MSG_PRIVATE;
      }


      data.redState = false

      if(code==_config.MSG_MY_SED){
        data.status=_config.MSG_STATUS_SED;
      }

      if(code==_config.MSG_SUCCEED){
        data.status=_config.MSG_STATUS_SUCCEED;
      }

      if(code==_config.MSG_ERROR){
        data.status=_config.MSG_STATUS_ERROR;
      }

      data.read=_config.MSG_UNREAD;
      // 是否显示时间
      data.showTime = false
      // 判断是否已读 当前窗口信息为活跃
      if((data.asGroup==context.state.activeTyep && data.asTo==context.state.activeWindowId) || (data.asGroup==1 && data.asFrom==context.state.activeWindowId)){
        data.read=_config.MSG_READ;
      }

      //自己发送为已读
      if(data.asFrom==store.state.chatuserInfoStore.loginData.id){
        data.read=_config.MSG_READ
        data.userMsg=true;
      }

      //主观发送
      if(code==_config.MSG_MY_SED){
        data.read=_config.MSG_READ;
        data.userMsg=true;
      }

      //主观创建单聊窗口 同步本地历史信息
      if(code==_config.MSG_ACTIVE && _config._ifPrivate(type)){
        // data.read=_config.MSG_READ;
        // data.userMsg=true;
        data.first=true;
        context.commit("updatePrivateChat",data);
        return;
      }
      //主观创建群聊窗口 同步本地历史信息
      if(code==_config.MSG_ACTIVE && _config._ifGroup(type)){
        // data.read=_config.MSG_READ;
        // data.userMsg=true;
        data.first=true;
        context.commit("updateGroupChat",data);
        return;
      }


      if(data.asGroup==_config.MSG_PRIVATE){
        context.commit("updatePrivateChat",data);
      }

      if(data.asGroup==_config.MSG_GROUP){
        context.commit("updateGroupChat",data);
      }

      if(data.asGroup==_config.MSG_SYS){
        context.commit("updateSysChat",data);
      }

      if(code!=_config.MSG_MY_SED && code!=_config.MSG_ERROR && code!=_config.MSG_ACTIVE){
        // AppDB.addMessage(data);
      }

      // AppDB.getLastMsg(data.asGroup,data.asFrom,data.asTo);

    },
    //单聊离线
    getPrivateHis(context,data){
      axios({
        method: 'post',
        url:window.hostIm+"/api/message/goffline",
        data:qs.stringify(data)

      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          // Message({
          //   message:res.data.message,
          //   type:"success",
          //   showClose:true
          // })
          // content.dispatch("getGroupChatInfoAction",{self_uid:data.self_uid,group_id:data.group_id})
          // console.log("单聊离线返回",res);
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

    getGroupHis(context,data){
      axios({
        method: 'post',
        url:window.hostIm+"/api/message/goffline",
        data:qs.stringify(data)

      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          // Message({
          //   message:res.data.message,
          //   type:"success",
          //   showClose:true
          // })
          // content.dispatch("getGroupChatInfoAction",{self_uid:data.self_uid,group_id:data.group_id})
          // console.log("群聊离线返回",res);
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


  },

}


