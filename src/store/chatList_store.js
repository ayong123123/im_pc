/**
 * 聊天列表
 */
import axios from '../axios'
import router from '../router'
import qs from 'qs'
import md5 from 'js-md5'
import store from '../store'
import {getDate,setDate,copyobj,setSession,getSession} from '../common/common'
import { Loading,Message,MessageBox} from 'element-ui';
import moren from '../assets/weChat/group_chat.png'
import sysImg from '../assets/weChat/sys.png'
import _config from "../configWX/configWX"
import groupTip from '../assets/weChat/group_tip.png'
export default {
  state: {
    // 新建群聊窗口
    AddContactState: false,
    // 聊天窗口右侧隐藏窗口
    ChatRightBoxState: false,
    // 聊天窗口好友右侧隐藏窗口
    ChatRightFriendBoxState: false,
    //查看视频窗口
    videoState: false,
    // 查看照片 窗口
    pictureState: false,
    // 发送红包状态
    sendRedPackState: false,
    // 发送牛牛红包状态
    sendBullRedState: false,
    // 发送扫雷红包状态
    sendSweepRedState: false,
    // 发送接龙红包状态
    sendDragonRedState: false,
    // 红包详情
    redDetailState: false,
    //禁言列表
    enableSendState: false,
    //搜索聊天记录
    searchRecord:false,
    // 红包打开
    redPupContainer: false,
    //转账打开
    transferDetail: false,
    // 设置密码
    setPassword: false,
    // 搜索弹框
    searchMoreState: false,
    // 添加联系人弹框
    AddFriendState: false,

    //右键功能
    handleUserVible: false,

    userInfoState: false,  // 查看好友详情弹窗

    groupUserInfoState: false, // 查看群成员详情弹窗

    personalInfor: false, //用户详情

    leftUserSetState: false,  // 用户信息框

    messageSoundOpen: false,  // 消息MP3
    redPackSoundOpen: false,  // 红包mp3

    groupIncomeState: false, // 群收益弹窗

    groupManageState: false, // 管理员设置

    groupZhuShou: false, // 群助手

    orderFollowState: false, // 跟投

    planFollowState: false, // 计划跟投

    moneyRewardState: false, // 跟投

    groupErWeiMaState: false, // 二维码

    // 查看照片
    pictureObj: {
      img: '',
      state: false,
    },

    // 查看视频
    videoObj: {
      data: '',
      state: false,
    },
    // 当前登录用户
    userInfo: {
      name: 'ratel',
      img: 'static/images/UserAvatar.jpg',
    },
    searchText: '', // 筛选

    selectFriendId: null,
    // 对话好友列表
    chatlist: [
      // {
      //   chatType:1,
      //   id: 999999999,
      //   chatCount:1,
      //   user: {
      //     name: '系统通知',
      //     remarks_name:'',
      //     img:  '/static/images/vue.jpg'
      //   },
      //   messages: {
      //     lastMessage: '已经置顶聊天，可以给我发信息啦！',
      //     date: new Date(),
      //     unRead:0,
      //   },
      // },
    ],
    //emoji表情
    emojis: [
      {file: '100.gif', code: '/::)', title: '微笑', reg: /\/::\)/g},
      {file: '101.gif', code: '/::~', title: '伤心', reg: /\/::~/g},
      {file: '102.gif', code: '/::B', title: '美女', reg: /\/::B/g},
      {file: '103.gif', code: '/::|', title: '发呆', reg: /\/::\|/g},
      {file: '104.gif', code: '/:8-)', title: '墨镜', reg: /\/:8-\)/g},
      {file: '105.gif', code: '/::<', title: '哭', reg: /\/::</g},
      {file: '106.gif', code: '/::$', title: '羞', reg: /\/::\$/g},
      {file: '107.gif', code: '/::X', title: '哑', reg: /\/::X/g},
      {file: '108.gif', code: '/::Z', title: '睡', reg: /\/::Z/g},
      {file: '109.gif', code: '/::\'(', title: '哭', reg: /\/::'\(/g},
      {file: '110.gif', code: '/::-|', title: '囧', reg: /\/::-\|/g},
      {file: '111.gif', code: '/::@', title: '怒', reg: /\/::@/g},
      {file: '112.gif', code: '/::P', title: '调皮', reg: /\/::P/g},
      {file: '113.gif', code: '/::D', title: '笑', reg: /\/::D/g},
      {file: '114.gif', code: '/::O', title: '惊讶', reg: /\/::O/g},
      {file: '115.gif', code: '/::(', title: '难过', reg: /\/::\(/g},
      {file: '116.gif', code: '/::+', title: '酷', reg: /\/::\+/g},
      {file: '117.gif', code: '/:--b', title: '汗', reg: /\/:--b/g},
      {file: '118.gif', code: '/::Q', title: '抓狂', reg: /\/::Q/g},
      {file: '119.gif', code: '/::T', title: '吐', reg: /\/::T/g},
      {file: '120.gif', code: '/:,@P', title: '笑', reg: /\/:,@P/g},
      {file: '121.gif', code: '/:,@-D', title: '快乐', reg: /\/:,@-D/g},
      {file: '122.gif', code: '/::d', title: '奇', reg: /\/::d/g},
      {file: '123.gif', code: '/:,@o', title: '傲', reg: /\/:,@o/g},
      {file: '124.gif', code: '/::g', title: '饿', reg: /\/::g/g},
      {file: '125.gif', code: '/:|-)', title: '累', reg: /\/:\|-\)/g},
      {file: '126.gif', code: '/::!', title: '吓', reg: /\/::!/g},
      {file: '127.gif', code: '/::L', title: '汗', reg: /\/::L/g},
      {file: '128.gif', code: '/::>', title: '高兴', reg: /\/::>/g},
      {file: '129.gif', code: '/::,@', title: '闲', reg: /\/::,@/g},
      {file: '130.gif', code: '/:,@f', title: '努力', reg: /\/:,@f/g},
      {file: '131.gif', code: '/::-S', title: '骂', reg: /\/::-S/g},
      {file: '133.gif', code: '/:,@x', title: '秘密', reg: /\/:,@x/g},
      {file: '134.gif', code: '/:,@@', title: '乱', reg: /\/:,@@/g},
      {file: '135.gif', code: '/::8', title: '疯', reg: /\/::8/g},
      {file: '136.gif', code: '/:,@!', title: '哀', reg: /\/:,@!/g},
      {file: '137.gif', code: '/:!!!', title: '鬼', reg: /\/:!!!/g},
      {file: '138.gif', code: '/:xx', title: '打击', reg: /\/:xx/g},
      {file: '139.gif', code: '/:bye', title: 'bye', reg: /\/:bye/g},
      {file: '142.gif', code: '/:handclap', title: '鼓掌', reg: /\/:handclap/g},
      {file: '145.gif', code: '/:<@', title: '什么', reg: /\/:<@/g},
      {file: '147.gif', code: '/::-O', title: '累', reg: /\/::-O/g},
      {file: '153.gif', code: '/:@x', title: '吓', reg: /\/:@x/g},
      {file: '155.gif', code: '/:pd', title: '刀', reg: /\/:pd/g},
      {file: '156.gif', code: '/:<W>', title: '水果', reg: /\/:<W>/g},
      {file: '157.gif', code: '/:beer', title: '酒', reg: /\/:beer/g},
      {file: '158.gif', code: '/:basketb', title: '篮球', reg: /\/:basketb/g},
      {file: '159.gif', code: '/:oo', title: '乒乓', reg: /\/:oo/g},
      {file: '195.gif', code: '/:circle', title: '跳舞', reg: /\/:circle/g},
      {file: '160.gif', code: '/:coffee', title: '咖啡', reg: /\/:coffee/g}
    ],
    forbiddenUserList: {
      code: null,
      data: [],
      message: ''
    },
    SearchFriendList: {
      code: null,
      data: {},
      message: ''
    }, // 查找好友
    // 群聊用户信息
    groupUserInfoList: {}, // 群聊成员信息
    newBuildGroupName: '', // 群聊名称
    dataniuniuList: '',
    zhuanFaMessage: {},

    groupHidden: false, // 群聊伸缩
    kefuHidden: false, // 群聊伸缩
    friendHidden: false, // 群聊伸缩
    todayLossModal: false,
    showEmoji: false,
    topInfo: [],
    mergeGroupInfo:'',
    userGroup:[], //群组列表
  },
  /*$store.commit*/
  mutations: {
    setUserGroup(state, data) {
      state.userGroup = data
      // console.log('state.userGroup',state.userGroup)
    },
    //置顶信息
    setTopInfo (state, data) {
      state.topInfo.push(data)
    },
    //更新置顶数据
    updateTopInfo (state, data) {
      if(data.length == 0 &&  state.topInfo.length>0) {
        state.topInfo.map((item,i)=>{
          delete item.istop
          // state.topInfo.splice(i,1)
        })
      }
      state.topInfo = data
    },
    //合并群组
    mergeGroups(state,data) {
      state.mergeGroupInfo = data.groupmessage;

      let sessions = state.chatlist.filter(sessions => sessions.user.remarks_name ? sessions.user.remarks_name.includes(state.searchText) : sessions.user.name.includes(state.searchText));
      let mergeInfo= JSON.parse(store.state.chatListStore.mergeGroupInfo.content);
      let mergeId= mergeInfo.mergeId;
      let groupId =mergeInfo.groupId;

      let friendsListStore = store.state.friendsListStore.groupChatList;
      let mergeGroupInfo = sessions.filter(item=>item.id == mergeId)
      let groupIdInfo = friendsListStore.filter(item=>item.id == groupId )

      if(mergeGroupInfo[0]) {
        // store.state.msgListStore.activeWindowId && s.chatType == store.state.msgListStore.activeTyep
        if(store.state.msgListStore.activeWindowId == mergeGroupInfo[0].id && state.chatlist.length>0 ) { //当前群被合并则清除选中窗口
          // this.setActiveWindow({id:item.id,type:item.chatType,name:item.user.remarks_name || item.user.name ,head_portrait:item.user.img})
          const {id,chatType,user} = state.chatlist[state.chatlist.length - 1];
          store.commit('setActiveWindow',{id:id,type:chatType,name:user.remarks_name || user.name ,head_portrait:user.img})
          if(chatType == 1){
            // 无记录 拉取最新记录
            store.dispatch('getLastMessageAction',{send_uid:store.state.chatuserInfoStore.loginData.id,accept_uid:id})
          }
          if(chatType == 2){
            //        选择群聊  请求群聊详情
            store.dispatch('getGroupChatInfoAction',{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:id})
            store.dispatch('getGlastMessageAction',{send_id:store.state.chatuserInfoStore.loginData.id,group_id:id})
            store.dispatch('getGroupNoticeAction',{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:id})
          }
          if(chatType == 3){
            store.dispatch('getMergeNoticeAction',{Page:1,pageNum:10})
          }
        }
        Message({
          message:`群组${mergeGroupInfo[0].user.name}已被合并到${groupIdInfo[0].name}`,
          type:"success",
          showClose:true
        })
      }
    },
    //点击关闭右键弹窗
    setHandleUserVible (state, data) {
      state.handleUserVible = data
    },
    setForbiddenUserList (state, data) {
      state.forbiddenUserList = data
    },
    setGroupJoinApply (state, data) {
      let idx = state.chatlist.findIndex((a) => {
        return data.groupmessage.groupid == a.id && a.chatType == 4
      })
      if (idx != -1) {
        state.chatlist[idx].messages.date = data.create_time
        state.chatlist[idx].messages.unRead = state.chatlist[idx].messages.unRead + 1
        state.chatlist[idx].messages.lastMessage = data.groupmessage.content
        store.commit("setChatGoUp", {id: data.groupmessage.groupid, chatType: 4})
      } else {
        state.chatlist.unshift({
          chatType: 4,
          id: data.groupmessage.groupid,
          chatCount: 1,
          kefu: false,
          user: {
            name: '群通知',
            img: groupTip,
          },
          messages: {
            lastMessage: data.groupmessage.content,
            date: data.create_time,
            unRead: 1,
          },
        })
      }

    },
    setZhuanFaMessage (state, data) {
      state.zhuanFaMessage = data;
    },
    setNewBuildGroupName (state, data) {
      state.newBuildGroupName = data
    },   // 群聊名称
    closeSomeModal (state, data) {
      state.handleUserVible = false
      state.personalInfor = false
      state.searchMoreState = false
      state.leftUserSetState = false
      state.todayLossModal = false
      state.showEmoji = false
    },
    // 更新用户 昵称头像
    upDataUserInfo (state, data) {
      if (!state.chatlist && state.chatlist.length == 0) {
        return
      }
      state.chatlist.forEach(function (i) {
        if (i.id == data.singlemessage.sendid && i.chatType == 1) {
          i.user.name = data.nickname
          i.user.img = data.head_portrait

        }
      })
    },
    // 更新群 名称
    upDataGroupNameInfo (state, data) {
      if (!state.chatlist && state.chatlist.length == 0) {
        return
      }
      state.chatlist.forEach(function (i) {
        if (i.id == data.group_id && i.chatType == 2) {
          i.user.name = data.group_name
          i.user.img = data.img
          i.chatCount = data.count
        }
      })
    },
    // 发送消息后消息置顶
    setChatGoUp (state, data) {
      if (state.chatlist.length === 0) {
        return
      }
      if (state.chatlist[0].id == data.id) {
        return
      }

      let arr = null
      for (let i = 0; i < state.chatlist.length; i++) {
        if (data.id == state.chatlist[i].id && data.chatType == state.chatlist[i].chatType) {
          arr = state.chatlist.splice(i, 1);
          state.chatlist.unshift(arr[0])
          break;
        }
      }

    },
    setGroupUserInfoList (state, data) {
      state.groupUserInfoList = {...state.groupUserInfoList, ...data}
    },
    //   修改群聊名称后更新列表 群聊名称
    updateGroupName (state, data) {
      state.chatlist.forEach(function (i) {
        if (i.id == data.id && i.chatType == 2) {
          i.user.name = data.name
        }
      })
    },
    //   删除当前聊天窗口 更新列表
    deleteChatWindow (state, data) {
      if (state.chatlist.length == 0) {
        return
      }
      for (let x = 0; x < state.chatlist.length; x++) {
        if (state.chatlist[x].chatType == data.chatType && state.chatlist[x].id == data.id) {
          state.chatlist.splice(x, 1);
          x--;
        }
      }
      if (state.chatlist.length == 0) {
        return
      }
      // console.log('state.chatlist[0].chatType ', state.chatlist[0].chatType)
      store.commit("setActiveWindow", {
        id: state.chatlist[0].id,
        type: state.chatlist[0].chatType,
        name: state.chatlist[0].user.remarks_name || state.chatlist[0].user.name
      })
      if (state.chatlist[0].chatType == 2) {
        store.dispatch("delChatEnum", {delete_id: data.id})
        store.dispatch("getGroupChatInfoAction", {
          self_uid: store.state.chatuserInfoStore.loginData.id,
          group_id: state.chatlist[0].id
        })
      }
    },
    //   关闭显示群聊详情窗口
    setChatRightBoxState (state, data) {
      if (!data) {
        state.ChatRightBoxState = false
      } else {
        state.ChatRightBoxState = !state.ChatRightBoxState
      }
    },
    //   关闭显示好友详情窗口
    setChatRightFriendBoxState (state, data) {
      if (!data) {
        state.ChatRightFriendBoxState = false
      } else {
        state.ChatRightFriendBoxState = !state.ChatRightFriendBoxState
      }
    },

    setSearchFriendList (state, data) {
      state.SearchFriendList = data
    },
    setVideoPlayer (state, data) {
      state.videoObj = {...state.videoObj, ...data}
    },
    setPicture (state, data) {
      state.pictureObj = {...state.pictureObj, ...data}
    },
    // 设置弹窗状态
    setModalState (state, data) {
      state[data] = !state[data]
    },
    // 从localStorage 中获取数据
    initData (state) {
      let data = localStorage.getItem('vue-chat');
      if (data) {
        state.chatlist = JSON.parse(data);
      }
    },
    // 好友列表内 当前选择的是哪个好友 创建聊天窗口 用。
    selectFriend (state, value) {
      state.selectFriendId = value
    },
    search (state, value) {
      state.searchText = value
    },
    // 更新群聊最后一条消息
    updateChatUserList (state, data) {
      var name = data.lastMessage.nickname && data.chatType == 2 ? data.lastMessage.nickname + ':' : ''
      state.chatlist.forEach((i) => {
        if (i.id == data.id && i.chatType == data.chatType) {
          i.messages.unRead = data.unRead
          i.messages.date = data.date
          if (data.lastMessage.type == _config.MSG_PRIVATE_TXT || data.lastMessage.type == _config.MSG_GROUP_TXT) {
            i.messages.lastMessage = name + data.lastMessage.content
          }
          if (data.lastMessage.type == _config.MSG_GROUP_RED || data.lastMessage.type == _config.MSG_PRIVATE_RED) {
            i.messages.lastMessage = name + '[有红包]'
          }
          if (data.lastMessage.type == _config.MSG_PRIVATE_IMG || data.lastMessage.type == _config.MSG_GROUP_IMG) {
            i.messages.lastMessage = name + '[图片]'
          }
          if (data.lastMessage.type == _config.MSG_GROUP_CARD || data.lastMessage.type == _config.MSG_PRIVATE_CARD) {
            i.messages.lastMessage = name + '[名片]'
          }
          if (data.lastMessage.type == _config.MSG_PRIVATE_ROB || data.lastMessage.type == _config.MSG_GROUP_ROB) {
            i.messages.lastMessage = name + '[红包被领取]'
          }
          if (data.lastMessage.type == _config.MSG_GROUP_AUDIO || data.lastMessage.type == _config.MSG_PRIVATE_AUDIO) {
            i.messages.lastMessage = name + '[语音消息]'
          }
          if (data.lastMessage.type == _config.MSG_GROUP_VIDEO || data.lastMessage.type == _config.MSG_PRIVATE_VIDEO) {
            i.messages.lastMessage = name + '[视频]'
          }
          if (data.lastMessage.type == _config.MSG_PRIVATE_SHARE || data.lastMessage.type == _config.MSG_GROUP_SHARE) {
            i.messages.lastMessage = name + '[盈亏]'
          }
          if (data.lastMessage.type == _config.MSG_PRIVATE_SIGN || data.lastMessage.type == _config.MSG_GROUP_SIGN) {
            i.messages.lastMessage = name + '[签到]'
          }
          if (data.lastMessage.type == _config.MSG_PRIVATE_DASHANG || data.lastMessage.type == _config.MSG_GROUP_DASHANG) {
            i.messages.lastMessage = name + '[打赏]'
          }
          if (data.lastMessage.type == _config.MSG_PRIVATE_SHARENOTE || data.lastMessage.type == _config.MSG_GROUP_SHARENOTE) {
            i.messages.lastMessage = name + '[注单分享]'
          }
          if (data.lastMessage.type == _config.MSG_GROUP_INGROUP) {
            i.messages.lastMessage = name + '[新成员加入]'
          }
          if (data.lastMessage.type == _config.MSG_GROUP_PLAN) {
            i.messages.lastMessage = name + '[精准计划]'
          }
        }
      })
    },
    setniuniuList (state, value) {
      state.dataniuniuList = value
    },
    // 同步消息
    setCustomerMessage (state, data) {
      var myid = store.state.chatuserInfoStore.loginData.id
      let createdId, createdImg, createdName;

      if (data.length > 0) {
        var isKefu = false;
        for (let obj of data) {
          createdId = obj.send_uid
          createdImg = obj.send_avatar
          createdName = obj.send_remarkName || obj.send_nickname
          if (myid == createdId) {
            createdId = obj.accept_uid
            createdImg = obj.accept_avatar
            createdName = obj.send_remarkName || obj.accept_nickname
          }
          let idx = state.chatlist.findIndex((a) => {
            return createdId == a.id && a.chatType == 1
          })

          var lastText = '有新消息'
          if (obj.type == _config.MSG_PRIVATE_AGREEADDFRIEND) {
            // console.log('obj', obj)
            var lastText = `你和${obj.send_nickname}已成为好友可以聊天了`;
          }
          if (obj.type == _config.MSG_MONEY_TRANSFER) {
            lastText = '[转账]'
          }
          if (obj.type == _config.MSG_PRIVATE_TXT) {
            lastText = obj.content
          }
          if (obj.type == _config.MSG_PRIVATE_RED) {
            lastText = '[有红包]'
          }
          if (obj.type == _config.MSG_PRIVATE_IMG) {
            lastText = '[图片]'
          }
          if (obj.type == _config.MSG_PRIVATE_ROB) {
            lastText = '[红包被领取]'
          }
          if (obj.type == _config.MSG_PRIVATE_AUDIO) {
            lastText = '[语音消息]'
          }
          if (obj.type == _config.MSG_PRIVATE_VIDEO) {
            lastText = '[视频]'
          }
          if (obj.type == _config.MSG_PRIVATE_SHARE) {
            lastText = '[盈亏]'
          }
          if (obj.type == _config.MSG_PRIVATE_SIGN) {
            lastText = '[签到]'
          }
          if (obj.type == _config.MSG_PRIVATE_DASHANG) {
            lastText = '[打赏]'
          }
          if (obj.type == _config.MSG_PRIVATE_SHARENOTE) {
            lastText = '[注单分享]'
          }
          if (obj.is_admin == 2 || obj.is_admin == 3) {
            isKefu = true
          }
          if (idx != -1) {
            state.chatlist[idx].messages.date = obj.create_time
            if (state.chatlist[idx].messages.unRead == 0 && obj.total * 1 > 0) {
              state.chatlist[idx].messages.unRead = obj.total
            }
            state.chatlist[idx].messages.lastMessage = lastText;
            store.commit("setChatGoUp", {id: createdId, chatType: 1})
          } else {
            state.chatlist.unshift({
              chatType: 1,
              id: createdId,
              chatCount: 1,
              kefu: isKefu,
              user: {
                name: createdName,
                img: createdImg,
              },
              messages: {
                lastMessage: lastText,
                date: obj.create_time,
                unRead: obj.total * 1,
              },
            })
            if (store.state.chatListStore.chatlist.length == 1) {
              let message = {}
              message[createdId] = {
                msgList: [],
                unReadNum: 0,
                count: 0,
                activeWindowId: createdId,
                activeName: "",
              }
              store.state.msgListStore.friendMsgMap = Object.assign({}, message, store.state.msgListStore.friendMsgMap)
              store.commit("setActiveWindow", {id: createdId, type: 1, name: createdName, head_portrait: createdImg})
              store.dispatch("getLastMessageAction", {send_uid: myid, accept_uid: createdId})
            }
          }
        }
        // 按时间排序
        state.chatlist = state.chatlist.sort(function (a, b) {
          return b.messages.date * 1 - a.messages.date * 1;
        })
      }

      var sortRule = function (a, b) {
        a.messages.unRead = a.messages.unRead * 1 || 0;
        b.messages.unRead = b.messages.unRead * 1 || 0;

        return b.messages.unRead - a.messages.unRead;
      };
      state.chatlist.sort(sortRule);
      // state.chatlist
      // console.log("state.chatlist排序",state.chatlist)
    },
    // 更新群聊系统信息
    upGroupOtherChatUserList (state, data) {
      let groupid = data.groupmessage.groupid
      state.chatlist.forEach((i) => {
        if (groupid == i.id && i.chatType == 2) {
          i.messages.unRead = 9
          i.messages.date = data.create_time
          if (data.type == _config.MSG_GROUP_AT || data.type == _config.MSG_GROUP_AT_ALL) {
            i.messages.lastMessage = '<span style="color:orangered;">【有人@我】</span>' + data.groupmessage.content
          }
          if (data.type == _config.MSG_GROUP_NOTICE) {
            i.messages.lastMessage = '<span style="color:orangered;">【有新公告】</span>' + data.groupmessage.content
          }
          if (data.type == _config.MSG_GROUP_REMOVEPERSON) {
            i.messages.lastMessage = '<span style="color:orangered;">【移出群聊】</span>' + data.groupmessage.content
          }

        }
      })
    },
    // 更新系统公告站内信 最后信息
    upSystemChatUserList (state, data) {
      state.chatlist.forEach((i) => {
        if (i.id == data.id && i.chatType == data.chatType) {
          i.messages.unRead = data.unRead
          i.messages.date = data.date
          if (data.type == _config.MSG_SYSTEM_GG || data.type == _config.MSG_STATION_LETTER) {
            i.messages.lastMessage = data.lastMessage.title + ':' + data.lastMessage.announcement
          }
        }
      })
    },

    // 选择好友后，点击发送信息。判断在聊天列表中是否有该好友，有的话跳到该好友对话。没有的话
    // 添加该好友的对话 并置顶
    /**
     * message 信息
     * type 聊天类型 群2 / 单聊1 / 系统 3
     * state 是否跳转到此窗口
     * */
    sendNewChat (state, data) {
      // console.log('data',data)
      var kefu = false
      var myImages = ''
      var qunMessage, lastMessage;
      if (data.type == 2) {
        if (store.state.friendsListStore.groupChatList.length > 0) {
          qunMessage = store.state.friendsListStore.groupChatList.find(img => img.id == data.message.id)
        }
        if (qunMessage) {
          myImages = qunMessage.group_cover || moren
        } else {
          myImages = moren
        }
        lastMessage = data.lastMessage || '已经置顶聊天，可以给我发信息啦！'
      }
      if (data.type == 1) {
        try {
          if (store.state.friendsListStore.kefuList.length > 0) {
            kefu = store.state.friendsListStore.kefuList.some(res => res.id == data.message.id)
          }
          if (!kefu && store.state.friendsListStore.allFriendList.length > 0) {
            // 是否是导师
            kefu = store.state.friendsListStore.allFriendList.some(res => res.id == data.message.id && res.is_admin == 3)
          }
        } catch (e) {

        }
        myImages = data.message.head_portrait
        lastMessage = data.lastMessage || '已经置顶聊天，可以给我发信息啦！'
      }
      if (data.type == 3) {
        myImages = sysImg
        lastMessage = data.lastMessage && data.lastMessage.title + ':' + data.lastMessage.announcement
      }

      let msg;
      state.chatlist.map(r => {
        if (r.id == data.message.id && r.chatType == data.type) {
          msg = r.id;
        }
      })

      // console.log('msg',msg)

      if (!msg) {
        state.chatlist.unshift({
          chatType: data.type,
          id: data.message.id,
          chatCount: data.message.count,
          kefu: kefu,
          user: {
            remarks_name: data.message.remarks_name,
            name: data.message.name,
            img: myImages,
          },
          messages: {
            lastMessage: lastMessage || '已经置顶聊天，可以给我发信息啦！',
            date: Math.round(new Date().getTime() / 1000).toString(),
            unRead: data.state ? 0 : 1,
          },
        })

        if (state.chatlist.length == 1) {
          store.commit("setActiveWindow", {
            id: data.message.id,
            type: data.type,
            name: data.message.remarks_name || data.message.name,
            num: data.message.count,
            head_portrait: data.message.head_portrait
          })
        }
      }
      if (data.state) {
        let datas = {
          id: data.message.id,
          type: data.type,
          name: data.message.remarks_name || data.message.name,
          num: data.message.count,
          head_portrait: data.message.head_portrait
        }

        store.commit("setActiveWindow", {
          id: data.message.id,
          type: data.type,
          name: data.message.remarks_name || data.message.name,
          num: data.message.count,
          head_portrait: data.message.head_portrait
        })

        // console.log('state.chatlist',state.chatlist)

        router.push({path: '/chat'})

      }
    },
  },

  /*$store.getters*/
  getters: {
    // 筛选出含有搜索值的聊天列表
    searchedChatlist (state) {
      let sessions = state.chatlist.filter(sessions => sessions.user.remarks_name ? sessions.user.remarks_name.includes(state.searchText) : sessions.user.name.includes(state.searchText));

      /*
      置顶功能 添加istop属性
      @istop true已置顶，false未置顶，如果置顶排序到顶部
       */
      const TOP = ()=>{
        let topArr = null;
        if (state.topInfo.length>0) {
          state.topInfo.map((item,index)=>{
            for (let i = 0; i < sessions.length; i++) {
              if (state.topInfo[index].id == sessions[i].id && state.topInfo[index].chatType == sessions[i].chatType) {
                topArr = sessions.splice(i, 1)
                topArr[0].istop =true;
                sessions.unshift(topArr[0])
                break;
              }
            }
          })
        }
      }

      /*
      1.合并群操作，如果合并则更新聊天列表
      2.检测群聊是否合并提示，如果合并则$message提示，并更新聊天列表
       */
       const Merge = () =>{
        if(store.state.chatListStore.mergeGroupInfo) {
          let mergeInfo= JSON.parse(store.state.chatListStore.mergeGroupInfo.content);
          let mergeId= mergeInfo.mergeId;
          sessions = sessions.filter(item=>item.id != mergeId )

          if(store.state.msgListStore.activeWindowId == mergeId && sessions.length>0 ) { //当前选中群被合并则自动选中列表第一个
            // this.setActiveWindow({id:item.id,type:item.chatType,name:item.user.remarks_name || item.user.name ,head_portrait:item.user.img})
            const {id,chatType,user} = sessions[0];
            store.commit('setActiveWindow',{id:id,type:chatType,name:user.remarks_name || user.name ,head_portrait:user.img})
            if(chatType == 1){
              // 无记录 拉取最新记录
              store.dispatch('getLastMessageAction',{send_uid:store.state.chatuserInfoStore.loginData.id,accept_uid:id})
            }
            if(chatType == 2){
              //        选择群聊  请求群聊详情
              store.dispatch('getGroupChatInfoAction',{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:id})
              store.dispatch('getGlastMessageAction',{send_id:store.state.chatuserInfoStore.loginData.id,group_id:id})
              store.dispatch('getGroupNoticeAction',{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:id})
            }
            if(chatType == 3){
              store.dispatch('getMergeNoticeAction',{Page:1,pageNum:10})
            }
          }
        }

        // 检测群聊合并
        let groupChatListId = [];
        let groupListID = [];
        // 筛选出搜索列表的群组
        let groupList = sessions.filter(item=> item.chatType == 2)
        const getId = (group,data)=>{
          group.forEach(item=>{
            data.push(item.id)
            return data;
          })
        }
        getId(store.state.friendsListStore.groupChatList,groupChatListId)
        getId(groupList,groupListID)

        //筛选出被合并的群组
        let list = groupListID.filter(items => {
          if (!groupChatListId.includes(items)) return items;
        })

        //更新搜索列表
        if(list.length != 0) {
          list.forEach(i =>{
            sessions = sessions.filter(item=>item.id != i)
          })
        }
      }

      /*
      是否在线功能 给单聊添加online字段
      @online  0离线，1在线
       */
      const ONLINE = ()=>{
        if(store.state.friendsListStore.allFriendList.length>0 && sessions.length>0) {
          sessions.forEach(friendItem=>{
            store.state.friendsListStore.allFriendList.forEach(sessionsItem =>{
              if(sessionsItem.id && friendItem.chatType != 2 && sessionsItem.id ==friendItem.id) {
                friendItem.online = sessionsItem.online
              }
            })
          })
        }
      }

      TOP();
      Merge();
      ONLINE();
      return sessions
    },

    // 筛选出含有搜索值的好友列表  暂未使用
    searchedFriendlist (state) {
      let friends = state.friendlist.filter(friends => friends.remark.includes(state.searchText));
      return friends
    },
    // 通过当前选择是哪个对话匹配相应的对话信息
    selectedChat (state) {
      let session = state.chatlist.find(s => s.id == store.state.msgListStore.activeWindowId && s.chatType == store.state.msgListStore.activeTyep);

      //合并群操作
      if(store.state.chatListStore.mergeGroupInfo) {
        let mergeInfo = JSON.parse(store.state.chatListStore.mergeGroupInfo.content);
        let mergeId = mergeInfo.mergeId;

        if(mergeId == session.id && state.chatlist.length>0 ) {
          return state.chatlist[state.chatlist.length-1]
        }
      }
      return session
    },

  },

  /*$store.dispatch*/
  actions: {
    // 更新列表用户信息
    upDataUserInfoAction: ({commit}, value) => commit('upDataUserInfo', value),
    searchUser: ({commit}, value) => {
      setTimeout(() => {
        commit('search', value)
      }, 100)
    },
    //合并群组
    mergeGroup:({commit},value)=>{
      commit('mergeGroups',value)
    },
    initData: ({commit}, value) => commit('initData', value),

    //离线群组列表
    getUserGroup (content, data) {
      return new Promise(resolve => {
        axios({
          method: 'post',
          url: window.host + "/Api/WechatGame/getUserGroup",
          data: data,
        }).then(function (res) {
          if (res.data.code === 0) {
            // resolve(res.data.data)
            content.commit('setUserGroup',res.data.data)
            // console.log(res.data.data)
            // let friendsListStore = store.state.friendsListStore.groupChatList;
            // console.log('friendsListStore',friendsListStore)

          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },

    // 上传图片
    addPhoneAction (content, data) {
      return new Promise(resolve => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/uploadFile/upload",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          data: data,
        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {
            resolve(res.data.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },
    // 多个消息转发
    messageForward (content, data) {
      return new Promise(resolve => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/push/forward",
          data: qs.stringify(data)
        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {
            Message({
              message: '转发成功',
              type: "success",
              showClose: true
            })
            resolve(res.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },
    //获取七牛云token
    getqiniuToken (content, data) {
      return new Promise(resolve => {
        var obj = {
          key: 'ac768f083acf4733b3e136c9917c89de'
        }
        axios({
          method: 'post',
          url: window.hostIm + "/api/uploadFile/createToken",
          data: qs.stringify(obj)
        }).then(function (res) {
          // console.log(res)
          if (store.getters.getCodeState(res.data.code)) {
            resolve(res.data.data)
            return res.data.data
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },
    //自定义7牛地址
    getqiniuToken2 (content, data) {
      return new Promise(resolve => {
        var obj = {
          key: 'ac768f083acf4733b3e136c9917c89de'
        }
        resolve({});

        // axios({
        //   method: 'post',
        //   url:window.hostIm+"/api/uploadFile/createToken",
        //   data:qs.stringify(obj)
        // }).then(function(res){
        //   if(store.getters.getCodeStateIm(res.data.code)){
        //     resolve(res.data.data)
        //     return res.data.data
        //   }else {
        //     resolve(res.data.data)
        //     //
        //     // Toast({
        //     //   message:res.data.message,
        //     // })
        //     return false;
        //   }
        // })
      })
    },

    getqiniuToken3 (content, data) {
      return new Promise(resolve => {
        axios({
          method: 'post',
          url: data.url,
          data: data.files
        }).then(res => {
          // console.log(res)
          // if(store.getters.getCodeStateIm(res.data.code)){
          //   resolve(res.data.data)
          //   return res.data.data
          // }else {
          //   resolve(res.data.data)
          //   //
          //   // Toast({
          //   //   message:res.data.message,
          //   // })
          //   return false;
          // }
        })
      })
    },
    // 搜索好友
    searchFriendListAction (content, data) {
      axios({
        method: 'post',
        url: window.hostIm + "/api/user/search",
        data: qs.stringify(data)

      }).then(function (res) {
        if (store.getters.getCodeState(res.data.code)) {
          content.commit("setSearchFriendList", res.data)

          // return res.data;
        } else {
          Message({
            message: res.data.message,
            type: "warning",
            showClose: true
          })
          content.commit("setSearchFriendList", res.data)
          return false;
        }
      })
    },
    //转让群主
    transferGroup(content,data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url: window.hostIm + "/api/userGroup/transferGroup",
          data: qs.stringify(data)

        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {
            Message({
              message: res.data.message,
              type: "success",
              showClose: true
            })
            store.dispatch('getGroupChatInfoAction',{self_uid:store.state.chatuserInfoStore.loginData.id,group_id:data.group_id})
            resolve(true)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },
    // 添加好友
    addMyFriendAction (content, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/userFriend/addFriend",
          data: qs.stringify({
            self_uid: data.self_uid,
            friend_uid: data.friend_uid,
            agree: data.agree,
            add_msg: data.add_msg
          })

        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {
            Message({
              message: res.data.message,
              type: "success",
              showClose: true
            })

            if (data.agree == 0) {
              let params = {
                to: data.friend_uid,
                message: store.state.chatuserInfoStore.dataGetInfo.nickname + '申请添加您为好友',
                type: _config.MSG_PRIVATE_APPLYFRIEND,
                reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})
              }
              content.dispatch("sendMessageIM", params)
            }
            if (data.agree == 1) {

              store.commit("setActiveWindow", {
                id: data.friend_uid,
                type: 1,
                name: data.nickname,
                num: 1,
                head_portrait: data.head_portrait
              })

              let params1 = {
                to: data.friend_uid,
                message: `您与${store.state.chatuserInfoStore.dataGetInfo.nickname}已成为好友，可以聊天了`,
                type: _config.MSG_PRIVATE_AGREEADDFRIEND,
                reserved:JSON.stringify({level:store.state.indexStore.userHomeData.data.userlevelid.levelName})
              }
              content.dispatch("sendMessageIM", params1)
            }
            content.dispatch("getCountApplyFriendAction", {self_uid: data.self_uid})
            if (data.searchParam) {
              content.dispatch("searchFriendListAction", {
                uid: data.self_uid,
                searchParam: data.searchParam,
              })
            }
            resolve(res.data)
            // return res.data;
          } else {

            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },
    // 修改自己聊天群昵称
    editGroupSelfAction (content, data) {

      axios({
        method: 'post',
        url: window.hostIm + "/api/userGroup/editGroupSelf",
        data: qs.stringify(data)

      }).then(function (res) {
        if (store.getters.getCodeState(res.data.code)) {
          // Message({
          //   message:res.data.message,
          //   type:"success",
          //   showClose:true
          // })
          content.dispatch("getGroupChatInfoAction", {self_uid: data.self_uid, group_id: data.group_id})
        } else {
          Message({
            message: res.data.message,
            type: "warning",
            showClose: true
          })
          return false;
        }
      })
    },
    //禁言列表
    getForbiddenUserList (content, data) {
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.host + "/Api/WechatGame/getForbiddenUserList",
          data: qs.stringify(data)
        }).then(function (res) {
          if (res.data.code == 0) {
            content.commit("setForbiddenUserList", res.data)
            return true
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },
    // 编辑群信息
    editGroupAction (content, data) {
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/userGroup/editGroup",
          data: qs.stringify(data)

        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {
            // Message({
            //   message:res.data.message,
            //   type:"success",
            //   showClose:true
            // })
            if(data.group_name) {
              content.commit("updateGroupName", {id: data.group_id, name: data.group_name})
            }
            resolve(res.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })

    },
    // 设置抢红包最低等级
    setGrabLevel (content, data) {
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/miscell/steGrabLevel",
          data: qs.stringify(data)
        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {
            // content.commit("updateGroupName", {id: data.group_id, name: data.group_name})
            Message({
              message: '设置成功！',
              type: "success",
              showClose: true
            })
            resolve(res.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })

    },
    // 设置发红包最低等级
    setSendGrabLevel (content, data) {
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/miscell/setSendGrabLevel",
          data: qs.stringify(data)
        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {
            // content.commit("updateGroupName", {id: data.group_id, name: data.group_name})
            Message({
              message: '设置成功！',
              type: "success",
              showClose: true
            })
            resolve(res.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })

    },



    // 删除群聊或踢出人员
    delGroupAction (content, data) {

      axios({
        method: 'post',
        url: window.hostIm + "/api/userGroup/delGroup",
        data: qs.stringify(data)

      }).then(function (res) {
        if (store.getters.getCodeState(res.data.code)) {
          Message({
            message: res.data.message,
            type: "success",
            showClose: true
          })
          if (data.del_uid) {
            content.dispatch("getGroupChatInfoAction", {self_uid: data.self_uid, group_id: data.group_id})
          } else {
            content.commit("deleteChatWindow", {id: data.group_id, chatType: 2})
            content.commit("setChatRightBoxState", false)
          }
        } else {
          Message({
            message: res.data.message,
            type: "warning",
            showClose: true
          })
          return false;
        }
      })
    },

    // 自己退出群聊
    signOutGroupAction (content, data) {

      axios({
        method: 'post',
        url: window.hostIm + "/api/userGroup/signOutGroup",
        data: qs.stringify(data)

      }).then(function (res) {
        if (store.getters.getCodeState(res.data.code)) {
          Message({
            message: res.data.message,
            type: "success",
            showClose: true
          })
          content.commit("deleteChatWindow", {id: data.group_id, chatType: 2})
          content.commit("setChatRightBoxState", false)
        } else {
          Message({
            message: res.data.message,
            type: "warning",
            showClose: true
          })
          return false;
        }
      })
    },
    // 群组查看用户信息
    getGroupUserInfoAction (content, data) {
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/userGroup/getGroupUserInfo",
          data: qs.stringify(data)

        }).then(function (res) {
          loading.close();
          if (store.getters.getCodeState(res.data.code)) {
            // Message({
            //   message:res.data.message,
            //   type:"success",
            //   showClose:true
            // })
            content.commit("setGroupUserInfoList", res.data.data)
            resolve(res.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })

    },

    // 牛牛红包玩法
    niuniuMethodAction (content, data) {
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.host + "/Api/Home/rule",
          data: qs.stringify(data)

        }).then(function (res) {
          if (res.data.code === 0) {
            content.commit("setniuniuList", res.data.data)
            resolve(res.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })
    },
    // 发红包
    sendRedEnvelopes (content, data) {
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.hostIm + "/api/wechatGame/sendRedEnvelopes",
          data: qs.stringify(data)

        }).then(function (res) {
          if (store.getters.getCodeState(res.data.code)) {

            // content.commit("setGroupUserInfoListIm",res.data.data)
            resolve(res.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })

    },
    // 单聊消息丢失补偿
    getCustomerServiceAction (content, data) {
      // data.Authorization=getSession('token');
      return new Promise((resolve) => {
        axios({
          method: 'post',
          url: window.host + "/Api/WechatGame/getCustomerService",
          data: qs.stringify(data)

        }).then(function (res) {
          if (res.data.code == 10000) {
            content.commit("setCustomerMessage", res.data.data.offlineMessage)

            // content.commit()
            resolve(res.data.data)
          } else {
            Message({
              message: res.data.message,
              type: "warning",
              showClose: true
            })
            return false;
          }
        })
      })

    },
  }
}


