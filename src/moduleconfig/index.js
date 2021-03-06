import Vue from 'vue'


// 弹窗
// 看照片
Vue.component('wx-photo',resolve => require(['@/components/weixinChatRoom/modal/photo'], resolve))
// 看视频
Vue.component('wx-video',resolve => require(['@/components/weixinChatRoom/modal/videoPlayer'], resolve))
// 发红包
Vue.component('wx-send-redpack',resolve => require(['@/components/weixinChatRoom/modal/sendRedPack'], resolve))
// 发牛牛红包
Vue.component('wx-send-bullpack',resolve => require(['@/components/weixinChatRoom/modal/sendBullPack'], resolve))
// 发扫雷红包
Vue.component('wx-send-sweeppack',resolve => require(['@/components/weixinChatRoom/modal/sendSweepPack'], resolve))
// 发接龙红包
Vue.component('wx-send-dragonpack',resolve => require(['@/components/weixinChatRoom/modal/sendDragonPack'], resolve))
// 修改个人信息
Vue.component('wx-editorUserInfo',resolve => require(['@/components/weixinChatRoom/modal/editorUserInfo'], resolve))
// 修改个人密码
Vue.component('wx-resetPassword',resolve => require(['@/components/weixinChatRoom/modal/resetPwd'], resolve))
// 设置提款密码
Vue.component('wx-setPayPassword',resolve => require(['@/components/weixinChatRoom/modal/setPayPwd'], resolve))
// 新建群聊
Vue.component('wx-newBuildGroup',resolve => require(['@/components/weixinChatRoom/modal/newBuildGroup'], resolve))
// 添加新朋友
Vue.component('wx-addNewFriend',resolve => require(['@/components/weixinChatRoom/modal/addNewFriend'], resolve))
// 红包 已抢过
Vue.component('wx-redYiqiang',resolve => require(['@/components/weixinChatRoom/modal/redYiqiang'], resolve))
// 红包 抢到红包
Vue.component('wx-haveRedPack',resolve => require(['@/components/weixinChatRoom/modal/haveRedPack'], resolve))
// 红包 没抢到红包
Vue.component('wx-notRedPack',resolve => require(['@/components/weixinChatRoom/modal/notRedPack'], resolve))
// 查看用户信息
Vue.component('wx-userDetail',resolve => require(['@/components/weixinChatRoom/modal/userDetail'], resolve))
// 查看群友详情
Vue.component('wx-groupUserDetail',resolve => require(['@/components/weixinChatRoom/modal/groupUserDetail'], resolve))

// 红包开
Vue.component('wx-red-open',resolve => require(['@/components/weixinChatRoom/modal/wxRedOpen'], resolve))
// 红包详情
Vue.component('wx-red-detail',resolve => require(['@/components/weixinChatRoom/modal/redDetail'], resolve))
// 转账详情
Vue.component('wx-transfer-detail',resolve => require(['@/components/weixinChatRoom/modal/transferDetail'], resolve))
//玩法详情
Vue.component('wx-wanfa-detail',resolve => require(['@/components/weixinChatRoom/modal/bullRedMethod'], resolve))
// 重新连接
Vue.component('wx-again-connect',resolve => require(['@/components/weixinChatRoom/modal/againConnect'], resolve))
//转发
Vue.component('wx-transpond',resolve => require(['@/components/weixinChatRoom/modal/transpond'], resolve))
//分享名片
Vue.component('wx-shareCard',resolve => require(['@/components/weixinChatRoom/modal/shareCard'], resolve))
//询问弹窗
Vue.component('wx-config',resolve => require(['@/components/weixinChatRoom/modal/wxConfig'], resolve))
//询问弹窗
Vue.component('groupIncome',resolve => require(['@/components/weixinChatRoom/modal/groupIncome'], resolve))
// 禁言列表弹窗
Vue.component('enableSendMsgList',resolve => require(['@/components/weixinChatRoom/modal/enableSendMsgList'], resolve))
//搜索本地聊天记录弹窗
Vue.component('searchRecord',resolve => require(['@/components/weixinChatRoom/modal/searchRecord.vue'], resolve))
// 管理员设置
Vue.component('groupManageSet',resolve => require(['@/components/weixinChatRoom/modal/groupManageSet'], resolve))
// 群助手
Vue.component('groupAssistant',resolve => require(['@/components/weixinChatRoom/modal/groupAssistant'], resolve))
// 跟投
Vue.component('orderFollow',resolve => require(['@/components/weixinChatRoom/modal/orderFollow'], resolve))
Vue.component('planFollow',resolve => require(['@/components/weixinChatRoom/modal/planFollow'], resolve))
// 打赏
Vue.component('moneyReward',resolve => require(['@/components/weixinChatRoom/modal/moneyReward'], resolve))
// 二维码
Vue.component('groupQrcode',resolve => require(['@/components/weixinChatRoom/modal/groupQrcode'], resolve))

// 侧边栏
Vue.component('wx-leftNav',resolve => require(['@/components/weixinChatRoom/leftNav'], resolve))
// 搜索userChatList
Vue.component('wx-search',resolve => require(['@/components/weixinChatRoom/common/search'], resolve))

// 聊天列表
Vue.component('wx-userChatList',resolve => require(['@/components/weixinChatRoom/chatList/userChatList'], resolve))
// 聊天记录信息体
// 分享战绩
Vue.component('wx-share-record',resolve => require(['@/components/weixinChatRoom/chatList/other/shareRecord'], resolve))
// 打赏
Vue.component('wx-da-shang',resolve => require(['@/components/weixinChatRoom/chatList/other/daShang'], resolve))
// 订单详情
Vue.component('wx-share-order',resolve => require(['@/components/weixinChatRoom/chatList/other/shareOrder'], resolve))
//计划
Vue.component('wx-sharePlan',resolve => require(['@/components/weixinChatRoom/chatList/other/sharePlan'], resolve))
// 签到
Vue.component('wx-chat-sign',resolve => require(['@/components/weixinChatRoom/chatList/other/getSign'], resolve))
// 发送文本
Vue.component('wx-chat-text',resolve => require(['@/components/weixinChatRoom/chatList/other/chatText'], resolve))
// 发送图片
Vue.component('wx-chat-images',resolve => require(['@/components/weixinChatRoom/chatList/other/chatImages'], resolve))
//发送视频
Vue.component('wx-chat-video',resolve => require(['@/components/weixinChatRoom/chatList/other/chatVideo'], resolve))
//发送语音
Vue.component('wx-chat-audio',resolve => require(['@/components/weixinChatRoom/chatList/other/chatAudio'], resolve))
// 发送红包
Vue.component('wx-chat-redpack',resolve => require(['@/components/weixinChatRoom/chatList/other/chatRedPack'], resolve))
// 转账
Vue.component('wx-chat-transfer',resolve => require(['@/components/weixinChatRoom/chatList/other/chatTransfer'], resolve))
// 发送牛牛红包
Vue.component('wx-chat-bullpack',resolve => require(['@/components/weixinChatRoom/chatList/other/chatBullPack'], resolve))
// 发送扫雷红包
Vue.component('wx-chat-sweeppack',resolve => require(['@/components/weixinChatRoom/chatList/other/chatSweepPack'], resolve))
// 发送接龙红包
Vue.component('wx-chat-dragonpack',resolve => require(['@/components/weixinChatRoom/chatList/other/chatDragonPack'], resolve))
// 领取红包信息推送
Vue.component('wx-redpack-message',resolve => require(['@/components/weixinChatRoom/chatList/other/redPackMessage'], resolve))
// 信息撤回推送
Vue.component('wx-message-back',resolve => require(['@/components/weixinChatRoom/chatList/other/messageBack'], resolve))
// 名片推送
Vue.component('wx-user-card',resolve => require(['@/components/weixinChatRoom/chatList/other/userCard'], resolve))
// 系统通知
Vue.component('system-gongGao',resolve => require(['@/components/weixinChatRoom/chatList/other/systemGongGao'], resolve))
// 加入群聊推送
Vue.component('wx-newUserInto',resolve => require(['@/components/weixinChatRoom/chatList/other/newUserInto'], resolve))
// 有人提醒 推送
Vue.component('wx-remind-you',resolve => require(['@/components/weixinChatRoom/chatList/other/remindYou'], resolve))
// ====
Vue.component('wx-chatMessage',resolve => require(['@/components/weixinChatRoom/chatList/chatMessage'], resolve))
// 发送输入框
Vue.component('wx-send-text',resolve => require(['@/components/weixinChatRoom/chatList/sendText'], resolve))

Vue.component('wx-my-friends',resolve => require(['@/components/weixinChatRoom/friendList/myFriends'], resolve))
Vue.component('wx-userinfo',resolve => require(['@/components/weixinChatRoom/friendList/userinfo'], resolve))
Vue.component('wx-groupChat',resolve => require(['@/components/weixinChatRoom/friendList/groupChat'], resolve))


Vue.component('wx-friend-circle',resolve => require(['@/components/weixinChatRoom/friendCircle/friend-circle'], resolve))
// 朋友圈
Vue.component('wx-allFriendCircle',resolve => require(['@/components/weixinChatRoom/friendCircle/allFriendCircle'], resolve))
Vue.component('wx-blockList',resolve => require(['@/components/weixinChatRoom/friendCircle/blockList'], resolve))
Vue.component('wx-sendFriendCircle',resolve => require(['@/components/weixinChatRoom/friendCircle/sendFriendCircle'], resolve))
Vue.component('wx-childFrinedCircle',resolve => require(['@/components/weixinChatRoom/friendCircle/childFrinedCircle'], resolve))
Vue.component('wx-accountchange',resolve => require(['@/components/weixinChatRoom/friendCircle/accountChange'], resolve))

//等级
Vue.component('wx-level',resolve => require(['@/components/weixinChatRoom/modal/level'], resolve))

