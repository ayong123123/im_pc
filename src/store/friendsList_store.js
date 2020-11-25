/**
 * 朋友联系人
 */

import axios from '../axios'
import router from '../router'
import qs from 'qs'
import md5 from 'js-md5'
import store from '../store'
import {getDate,setDate,copyobj,setSession,getSession} from '../common/common'
import { Loading,Message,MessageBox} from 'element-ui';
import {aesEncrypt,aesDecrypt} from '../common/crypto'


export default {
  state:{
    dataAddFriendList:{
      data: {
        count:0,
        data: [
        ]
      }
    },
    // 好友列表
    goodFriendList: [],
    //群组列表
    groupChatList:[],
    // 好友详情
    friendInfo: null,
    // 拉黑列表
    blackList:[],
    // 当前群聊信息
    groupChatInfoList:{
      code:null,
      data:{
      },
      message:'',
    },
    historyMessage:{
      code:null,
      data:'',
      message:'',
    },
    historyMessageData:{
      code:null,
      data:'',
      message:'',
    },
    anchorInfo: "",
    GroupChatId:'',  // 当前选中群聊ID
    countApplyFriend:0,

    inGroupUserList:[], //  在当前群聊内的用户
    isAddUser:false,  // 是新增用户 还是 新建群聊
    isAddFriend:false,  // 开启 允许添加好友
    disableSpeack:false, // 开启 禁言
    saoMaGroupJoin:false, // 开启扫码进群
    isGetPeople:false, // 允许拉人进群
    kefuList:[], // 用做客服列表

    allFriendList:[], // 全部原始好友

    newAddFriendHistory:[],  // 添加好友 历史记录

    allListFriendList:[],

    isAddFriendState:false, // 显示窗口 状态
    joinApplyList:[],  // 申请群聊列表

    friendPageSearch:'',
    friendPageSearchState:'0',
    groupUserSearch:'', // 群聊搜索
    clickContent:{}
  },
  /*$store.commit*/
  mutations: {
    setClickContent(state,data) {
      state.clickContent = data
    },
    setGroupUserSearch(state,data){
      state.groupUserSearch = ''
    },
    setIsAddFriendState(state,data){
      state.isAddFriendState = data
    },
    setAllListFriendList(state,data){
      if(state.newAddFriendHistory.length > 0){
        data.data.forEach((i)=>{
          let index = state.newAddFriendHistory.findIndex(a => a.id == i.id)
          if(index != -1){
            state.newAddFriendHistory[index].head_portrait = i.head_portrait
            state.newAddFriendHistory[index].nickname = i.nickname
          }
        })
      }

    },
    setAnchorInfo(state,data) {
      state.anchorInfo = data
    },
    setHistoryMessage(state,data) {
      if(data.data && data.data.length >0) {
        const newData = data.data.sort((a,b)=>b.create_time-a.create_time)
        data.data = newData;
      }
      state.historyMessage = data
    },
    setHistoryMessageData(state,data) {
      console.log(data)
      state.historyMessageData = data
    },
    setNewAddFriendHistory(state,data){
      if(data.clear){
        state.newAddFriendHistory = []
        return
      }
      let flag = state.newAddFriendHistory.findIndex(i => i.id == data.id)
      if(flag == -1){
        state.newAddFriendHistory.unshift(data)
      }else{
        state.newAddFriendHistory.splice(flag,1,data)
      }
    },

    // 修改单聊昵称
    setRemarkName(state,data){
      // console.log(data)
      if(store.state.chatListStore.chatlist.length > 0){
        for (let [index,obj] of store.state.chatListStore.chatlist.entries()) {
          if(obj.id == data.friend_uid){
            store.state.chatListStore.chatlist[index].user.remarks_name = data.remarks_name
            break;
          }
        }
      }
    },

    setAllFriendList(state,data){
      state.allFriendList = data
    },
    setGroupInfoState(state,data){
      state[data.name] = data.state
    },
    setIsAddUser(state,data){
      state.isAddUser = data
    },
    // 在当前群聊内的所有成员id
    setInGroupUser(state,data){
      state.inGroupUserList = []
      data.forEach(function (i) {
        state.inGroupUserList.push(i.uid)
      })
    },
    // 好友申请人员数量
    setCountApplyFriend(state,data){
      state.countApplyFriend = data
    },
    // 设置群聊内 成员状态
    setGroupChatInfoList(state,data){

      data.data.user_info.forEach((item,index)=>{
        item.checked = false
      })
      state.groupChatInfoList = data
    },
    //sdd
    setGroupChatInfoListNull(state,data = {
      code:null,
      data:{
      },
      message:'',
    }) {
      state.groupChatInfoList = data
    },

    //清空数据
    setNull(state,data) {
       state[data] = ''
    },
    // 当前群聊id
    setGroupChatId(state,data){
      state.GroupChatId = data
    },
    setAddFriendList(state,data){
      state.dataAddFriendList = data
    },
    setGoodFriendKefuList(state,data){
      state.kefuList = data.filter(i => i.is_admin == 2)
    },
    setGoodFriendList(state,data){
        // 删除好友列表内 在群聊内的好友
      for (var x = 0; x < data.length; x++) {
        let have = state.inGroupUserList.some(a => a == data[x].id)
        if (((have && state.isAddUser && store.state.chatListStore.AddContactState) || (store.state.chatListStore.AddContactState && data[x].is_admin == 3)) || data[x].is_admin == 2) {
          data.splice(x, 1);
          x--;
        }
      }



      if (JSON.stringify(data) == '{}') {
        data = []
      }
      data.forEach((i)=>{
        if(!i.initials){
          i.initials = '#'
        }
      })
      // 好友列表按 首字母重组
      let list = []
      let sortList = (arr, r) => {
        if (arr.length == 0) {
          list =  r
          return false;
        }
        // 默认往数组添加第一个
        let result = []
        let sList = []
        let k = arr[0].initials || '#'
        for (let i = 0, len = arr.length; i < len; i++) {
          let initText = arr[i].initials
          if (k == initText) {
            arr[i].isChecked = false
            arr[i].isChoose = false
            result.push(arr[i])
          } else {
            arr[i].isChecked = false
            arr[i].isChoose = false
            sList.push(arr[i])
          }
        }
        r.push(result)
        sortList(sList, r)
      }
      sortList(data, [])
      // 对数据的字母进行排序
      list = list.sort((a, b) => {
        let x = a[0].initials.charCodeAt() - 96
        let y = b[0].initials.charCodeAt() - 96
        return x - y
      })
      state.goodFriendList = list
    },
    setFriendInfo (state, data) {
      if(data && data.hasOwnProperty('superman')  ) {
        data.username = aesDecrypt(data.username);
      }
      state.friendInfo = data
    },
    setGroupChatList (state,data) {
       state.groupChatList = data
    },
    setBlackListInfo (state,data) {
      state.blackList = data
   },
    setJoinApplyList(state,data){
      state.joinApplyList = data
    },
  },

  /*$store.getters*/
  getters:{
    getGroupUsers(state){
      let arr =  state.groupChatInfoList.data.user_info.filter((item)=>item.user_group_name.includes(state.groupUserSearch))
      return arr
    },
    //  设置群聊备注
    getGroupRemarkName:(state) => (data) => {
      for (let [index,obj] of state.allFriendList.entries()) {
        if(obj.id == data.uid || obj.id == data.send_uid){
          return state.allFriendList[index].remarks_name
        }
      }
    },
    getGroupMyName(state){
      let id = store.getters.getUserId
      let obj = state.groupChatInfoList.data.user_info.find(i => i.uid == id)
      return obj.user_group_name
    },
    isBoss(state){
      if(store.state.chatuserInfoStore.loginData.id == state.groupChatInfoList.data.owner_uid){
        return true
      }else{
        return false
      }
    },
    isManagement(state){
      let flag = false
      if(state.groupChatInfoList.data.user_info){
        flag = state.groupChatInfoList.data.user_info.some((i)=>i.uid == store.state.chatuserInfoStore.loginData.id && i.role == 2)
      }
      return flag
    },
    getGroupChatList(state){
      if(state.friendPageSearchState == 1 || state.friendPageSearchState == 0){
        let arr  = state.groupChatList.filter(i => i.name.includes(state.friendPageSearch)) || []
        return arr
      }else{
        return state.groupChatList
      }
    },
    getKefuList(state){
      if(state.friendPageSearchState == 2 || state.friendPageSearchState == 0){
        let arr  = state.kefuList.filter(i => i.nickname.includes(state.friendPageSearch)) || []
        return arr
      }else{
        return state.kefuList
      }

    },
    getFriendAllPeople(state){
      let sessions = 0
      for(let i = 0;i<state.goodFriendList.length;i++){
        for(let j = 0;j<state.goodFriendList[i].length;j++){
          sessions++
        }
      }
      return sessions
    },
    getGoodFriendList(state){
      if(state.friendPageSearchState == 3 || state.friendPageSearchState == 0){
        let sessions = []
        let index = 0
        state.goodFriendList.forEach((now,i)=>{
          let arr = now.filter((item) => {
            return item.remarks_name ? item.remarks_name.includes(state.friendPageSearch) :  item.nickname.includes(state.friendPageSearch)
          })
          if(arr.length > 0) {
            sessions[index] = arr
            index++
          }
        })
        return sessions
      }else {
        return state.goodFriendList
      }
    }

  },

  /*$store.dispatch*/
  actions: {
    // 修改群头像
    editGroupCover(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/editGroupCover",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:'修改成功',
              type:"success",
              showClose:true
            })
            resolve(res.data)
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
    // 扫码进群同意或拒绝
    joinApplyAgreeAction(context,data){
      return new Promise((resolve)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/joinApplyAgree",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            resolve()
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
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
    // 申请进群列表
    getJoinApplyListAction(context,data){
      axios({
        method: 'post',
        url:window.hostIm+"/api/userGroup/joinApplyList",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          context.commit("setJoinApplyList",res.data)
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
    groupSetAdminAction(context,data){
      return new Promise((resolve)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/setAdmin",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            resolve(res.data)
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
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
    // 获取群公告
    getGroupNoticeAction(context,data) {
       new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/getGroupNotice",
          data:qs.stringify(data)
        }).then(function(res){
          if(res.data.code === 10000){
            if(res.data.data.is_read == 1){
              store.commit("setGroupOfflineList",res.data.data)
            }
            resolve(res.data)
          }else {

            return false;
          }
        })
      })
    },
    //删除单聊
    delChatEnum(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method:'post',
          url:window.host+"/Api/WechatGame/delChatEnum",
          data:qs.stringify(data)
        }).then(function(res){
          if(res.data.code === 10000){
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
          }else {

            return false;
          }
        })
      })
    },
    //获取群员禁言状态
    getForbiddenStatus(content,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/WechatGame/getForbiddenStatus",
          data:qs.stringify(data)
        }).then(function(res){
          if(res.data.code == 0){
            resolve(res.data)
            return true
          }else {

            return false;
          }
        })
      })
    },
    //禁言/解禁群员
    forbiddenUser(content,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/miscell/forbiddenUser",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            let msg = ''
            data.status == 2 ? msg= '禁言成功':msg ='解除禁言成功！'
            Message({
              message:msg,
              type:"success",
              showClose:true
            })
            resolve(res.data)
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

    //搜索群聊天历史信息
    getHistoryMessageAction (context,data) {

      return new Promise((resolve, reject)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/WechatGame/getHistoryMessage",
          data:qs.stringify(data)
        }).then(function(res){
          if(res.data.code === 0){
            if(!data.time) {
              context.commit("setHistoryMessage",res.data)
            }else {
              context.commit("setHistoryMessageData",res.data)
            }
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            resolve(res.data.data)
          }else {
            if(!data.time) {
              context.commit("setHistoryMessage",'')
            }else {
              context.commit("setHistoryMessageData",'')
            }
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })

          }
        })
      })
    },
    //搜索单聊天历史信息
    getSingleHistoryMessageAction (context,data) {
      return new Promise((resolve, reject)=>{
        axios({
          method: 'post',
          url:window.host+"/Api/WechatGame/getSingleMessageHistory",
          data:qs.stringify(data)
        }).then(function(res){
          if(res.data.code === 0){
            if(!data.time) {
              context.commit("setHistoryMessage",res.data)
            }else {
              context.commit("setHistoryMessageData",res.data)
            }
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            resolve(res.data.data)
          }else {
            if(!data.time) {
              context.commit("setHistoryMessage",'')
            }else {
              context.commit("setHistoryMessageData",'')
            }
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })

          }
        })
      })
    },

    //已读群公告
    isReadNoticeAction(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/isReadNotice",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){

            resolve(res.data)
          }else {

            return false;
          }
        })
      })
    },
    // 获取全部的添加好友列表
    getAllListFriendList(context,data){
       axios({
        method: 'post',
        url:window.hostIm+"/api/userFriend/getAllList",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          context.commit("setAllListFriendList",res.data)
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

    // 获取添加好友列表
    addFriendList(context,data) {
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return axios({
        method: 'post',
        url:window.hostIm+"/api/userFriend/addFriendList",
        data:qs.stringify(data)
      }).then(function(res){
        loading.close();
        if(store.getters.getCodeState(res.data.code)){
          context.commit("setAddFriendList",res.data)
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
    // 拒绝好友申请
    refuseAddFriend(context,data) {
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/refuseAddFriend",
          data:qs.stringify(data)
        }).then(function(res){
          loading.close();
          if(store.getters.getCodeState(res.data.code)){
            context.dispatch("getCountApplyFriendAction",{self_uid:data.self_uid})
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            resolve(res.data)
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
    // 获取好友列表
    getFriendList(context,data) {
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/getFriendList",
          data:qs.stringify(data)
        }).then(function(res){
          loading.close();
          if(store.getters.getCodeState(res.data.code)){
            if(res.data.code == 10000){
              let allList = [...res.data.data]
              context.commit("setGoodFriendList",res.data.data);
              context.commit("setAllFriendList",allList)
              resolve()
            }else{
              context.commit("setGoodFriendList",[]);
              context.commit("setAllFriendList",[])
            }
          }else {
            // Message({
            //   message:res.data.message,
            //   type:"warning",
            //   showClose:true
            // })
            // context.commit("setVcodeData",{});
            return false;
          }
        })
      })

    },
    // 获取客服列表
    getFriendkefuList(context,data) {
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return axios({
        method: 'post',
        url:window.hostIm+"/api/userFriend/getFriendList",
        data:qs.stringify(data)
      }).then(function(res){
        loading.close();
        if(store.getters.getCodeState(res.data.code)){
          if(res.data.code == 10000){
            context.commit("setGoodFriendKefuList",res.data.data);
          }else{
            context.commit("setGoodFriendKefuList",[]);
          }
        }else {
          // Message({
          //   message:res.data.message,
          //   type:"warning",
          //   showClose:true
          // })
          // context.commit("setVcodeData",{});
          return false;
        }
      })
    },
    // 获取好友信息
    getFriendInfoAction (context,data) {
      data.website = store.state.indexStore.indexData.website
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/getFriendInfo",
          data:qs.stringify(data)
        }).then(function(res){
          loading.close();
          if(store.getters.getCodeState(res.data.code)){
            context.commit("setFriendInfo",res.data.data)
            resolve(res.data.data)
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
    //新建群聊
    firstAddGroupChat(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/firstAddGroup",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            // Message({
            //   message:res.data.message,
            //   type:"success",
            //   showClose:true
            // })
            resolve(res.data)
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
    //拉人进群聊
    addManyGroupChat(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/addManyGroup",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            // Message({
            //   message:res.data.message,
            //   type:"success",
            //   showClose:true
            // })
            resolve(res.data)
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
    //获取聊天组列表
    getGroupChatList(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/getGroupList",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            context.commit("setGroupChatList",res.data.data);
            // resolve(res.data)
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
    //获取群组信息
    getGroupChatInfoAction(context,data) {
      // context.commit('setGroupChatInfoListNull') //清除缓存，防止串信息
       new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/getGroupInfo",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            // 保存当前选中群聊 ID
            context.commit("setGroupChatId",res.data.data.group_id)
            context.commit("upDataGroupNameInfo",{group_id:res.data.data.group_id,group_name:res.data.data.group_name,img:res.data.data.group_cover,count:res.data.data.count})
            context.commit("setGroupChatInfoList",res.data);

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

    // 设置开启拉人进群
    saoMaGroupJoinAction(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/joinApplySwitch",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:'修改成功',
              type:"success",
              showClose:true
            })
            resolve(res.data)
          }else {

            return false;
          }
        })
      })
    },
    //删除好友
    deleteFriendInfo(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/deleteFriend",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            resolve(res.data)
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
    // 获取拉黑列表
    getBlackList(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/getBlackList",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            context.commit("setBlackListInfo",res.data.data);
            resolve(res.data)
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
    // 拉黑好友
    blackFriendInfo(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/blackFriend",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            resolve(res.data)
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
    // 编辑好友信息
    editFriendInfo(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/editFriendInfo",
          data:qs.stringify(data)
        }).then(function(res){
          resolve(res.data)
          if(store.getters.getCodeState(res.data.code)){
            context.commit("setRemarkName",data)
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
    // 设置是否能添加好友
    setIsAddAction(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/setIsAdd",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:'修改成功',
              type:"success",
              showClose:true
            })
            resolve(res.data)
          }else {
            Message({
              message:'修改失败',
              type:"error",
              showClose:true
            })
            return false;
          }
        })
      })
    },
    // 设置开启禁言
    disableSpeackAction(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/forbiddenGroup",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:'修改成功',
              type:"success",
              showClose:true
            })
            resolve(res.data)
          }else {
            Message({
              message:'修改失败',
              type:"error",
              showClose:true
            })
            return false;
          }
        })
      })
    },
    // 设置是否能拉人进群
    setIsPullAction(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userGroup/setIsPull",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:'修改成功',
              type:"success",
              showClose:true
            })
            resolve(res.data)
          }else {
            Message({
              message:'修改失败',
              type:"error",
              showClose:true
            })
            return false;
          }
        })
      })
    },
    // 取消拉黑好友
    cancelBlack(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/cancelBlack",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            resolve(res.data)
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
    // 退出群聊
    signOutGroup(context,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/userFriend/signOutGroup",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            resolve(res.data)
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
    //申请好友人数统计
    getCountApplyFriendAction(context,data) {

      axios({
        method: 'post',
        url:window.hostIm+"/api/userFriend/countApplyFriend",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          // 保存当前选中群聊 ID
          context.commit("setCountApplyFriend",res.data.data.count)
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
  }
}


