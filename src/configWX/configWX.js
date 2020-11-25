const _config={
  name: "Web_IM_DGG",
  logo: "",

  MSG_STATUS_SED:"sending",
  MSG_STATUS_SUCCEED:"succeed",
  MSG_STATUS_ERROR:"error",

  //自己推送信息
  MSG_USER:1,


  MSG_READ:1,
  MSG_UNREAD:2,

  MSG_PRIVATE:1,
  MSG_GROUP:2,
  MSG_SYS:3,

  MSG_SUCCEED:4,
  MSG_ERROR:3,
  MSG_MY_SED:10,
  //激活窗口使用
  MSG_ACTIVE:100,


//   5, #文本消息
//   'img'  =>6,#图片消息
//   'red'=>7,#红包消息
//   'groupText'=>8,#群组文本消息,
//   'groupImg'=>9,#群组图片消息,
//   'groupRed'=>10,#群组红包消息
//   'groupTip'=>11,//群组艾特类型消息
//   'GroupTipPerson'=>12,//个人提示消息
//   'applyFriend'=>13,//添加好友消息
//   'agreeAddFriend'=>14,//同意添加好友
//   'recall'=>15,//单聊消息撤回
//   'groupRecall'=>16,//单聊消息撤回
//   'card'  =>25 名片
//   'apply'  =>13 添加好友
//   'rob'  =>17 领取红包
//   'ingroup'  =>18 进群
//   'rob'  =>23 群抢红包


  //私
  //单聊文本信息
  MSG_PRIVATE_TXT:5,
  //单人图片
  MSG_PRIVATE_IMG:6,
  //单聊红包
  MSG_PRIVATE_RED:7,
  MSG_PRIVATE_HINT:12,
  //领取红包
  MSG_PRIVATE_ROB:17,
  //名片
  MSG_PRIVATE_CARD:25,


  //添加好友 系统
  MSG_PRIVATE_APPLYFRIEND:13,
  //同意添加好友
  MSG_PRIVATE_AGREEADDFRIEND:14,
  //单条信息撤回
  MSG_PRIVATE_RECALL:15,
  //群撤回
  MSG_PRIVATE_GROUPRECALL:16,

  //组
  //群信息
  MSG_GROUP_TXT:8,
  //群图片
  MSG_GROUP_IMG:9,
  //群红包信息
  MSG_GROUP_RED:10,
  //
  MSG_GROUP_AT:11,
  //进群
  MSG_GROUP_INGROUP:18,
  //群抢红包
  MSG_GROUP_ROB:23,
  //群名片
  MSG_GROUP_CARD:24,
  //群撤回
  MSG_GROUP_RECALL:16,
  //群公告
  MSG_GROUP_NOTICE:31,
  //群公告
  MSG_GROUP_REMOVEPERSON:32,
  /*系统信息接口*/
  //单聊未读
  MSG_SYS_SACK:21,
  //群聊未读
  MSG_SYS_GACK:22,
  //点赞推送
  MSG_SYS_THUMBS:19,
  //评论推送
  MSG_SYS_COMMENT:20,
  //心跳 index
  MSG_SYS_INDEX:100,

  PAGE_NUM: 20,
  //游戏红包 扫雷
  MSG_RED_LANDMINE:30,
  // 接龙
  MSG_RED_DRAGON:39,
  //牛牛
  MSG_RED_COW:29,
  // 更改昵称或头像
  MSG_IMG_NICKNAME:26,
// 群 加好友
  MSG_GROUP_ADD_FRIEND:35,
  // 群禁言解禁
  MSG_GROUP_SPEAK:34,
  // 群视频
  MSG_GROUP_VIDEO:44,
  // 群音频
  MSG_GROUP_AUDIO:45,
  // 单视频
  MSG_PRIVATE_VIDEO:46,
  // 单音频
  MSG_PRIVATE_AUDIO:47,

  // 转账
  MSG_MONEY_TRANSFER:40,
  // 系统公告
  MSG_SYSTEM_GG:41,
  // 站内信
  MSG_STATION_LETTER:42,
  // 艾特所有人
  MSG_GROUP_AT_ALL:33,


  //今日盈亏(单)
  MSG_PRIVATE_SHARE:54,
  //签到(单)
  MSG_PRIVATE_SIGN:50,
  //打赏(单)
  MSG_PRIVATE_DASHANG:52,
  //注单分享(单)
  // MSG_PRIVATE_SHARE:49,
  MSG_PRIVATE_SHARENOTE:48,


  //群聊盈亏
  MSG_GROUP_SHARE:55,
  //群聊签到
  MSG_GROUP_SIGN:51,
  //群聊投注
  MSG_GROUP_SHARENOTE:49,
  //群打赏
  MSG_GROUP_DASHANG:53,
  //群助手 加群申请
  MSG_GROUP_APPLY_JOIN:56,
  //信息回执57
  MSG_SYS_CALLBACK:57,
  //系统计划
  MSG_GROUP_PLAN:58,

  //合并群组
  MERGE_GROUP:59,

  _ifGroup(type){
    if (type == this.MSG_GROUP_TXT || type == this.MSG_GROUP_IMG || type == this.MSG_GROUP_RED || type == this.MSG_GROUP_AT || type == this.MSG_GROUP_AT_ALL || type == this.MSG_GROUP_INGROUP || type == this.MSG_GROUP_ROB  || type == this.MSG_GROUP_RECALL || type==this.MSG_GROUP_CARD || type==this.MSG_RED_LANDMINE || type==this.MSG_RED_DRAGON || type==this.MSG_RED_COW || type==this.MSG_GROUP_VIDEO || type==this.MSG_GROUP_AUDIO || type == this.MSG_GROUP_NOTICE || type==this.MSG_GROUP_SHARE || type==this.MSG_GROUP_SIGN || type==this.MSG_GROUP_SHARENOTE || type==this.MSG_GROUP_DASHANG || type==this.MSG_GROUP_PLAN ) {
      return true;
    }
    return false;
  },

  _ifPrivate(type){
    if (type == this.MSG_PRIVATE_TXT || type == this.MSG_PRIVATE_IMG || type==this.MSG_PRIVATE_RED || type==this.MSG_PRIVATE_HINT || type==this.MSG_PRIVATE_ROB || type==this.MSG_PRIVATE_CARD || type == this.MSG_PRIVATE_VIDEO || type == this.MSG_PRIVATE_AUDIO || type == this.MSG_PRIVATE_AGREEADDFRIEND || type==this.MSG_PRIVATE_SHARE || type==this.MSG_PRIVATE_SIGN || type==this.MSG_PRIVATE_SHARENOTE || type==this.MSG_PRIVATE_DASHANG || type == this.MSG_MONEY_TRANSFER) {
      return true;
    }
    return false;
  },


  _ifSys(type){
    if (type == this.MSG_SYS_COMMENT || type == this.MSG_SYS_THUMBS || type == this.MSG_SYSTEM_GG || type == this.MSG_STATION_LETTER ) {
      return true;
    }
    return false;
  },
  //是否自我推送信息
  _ifUser(msg){
    var _userId=1;
    if(msg.asFrom==_userId){
      return true;
    }
    return false;
  },
};


export default _config;


