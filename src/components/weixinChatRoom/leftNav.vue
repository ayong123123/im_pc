<!-- 最左边的选择框 -->
<template>
  <div class="mycard">
    <header @click.stop="userInformation">
      <img v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" class="avatar" v-if="chatuserInfoStore.dataGetInfo.head_portrait">
      <img src="@/assets/weChat/default_avatar.png" alt="" class="avatar" v-else>
    </header>
    <!-- 个人信息 -->
    <!--@click.stop="test()"-->
    <div class="user-information"  v-if="chatListStore.personalInfor">
      <div class="user-content">
        <div class="user-left">
          <p class="user-name" >{{chatuserInfoStore.dataGetInfo.nickname ? chatuserInfoStore.dataGetInfo.nickname : '-'}}
            <img src="@/assets/weChat/woman.png" width="20" alt="" v-if="chatuserInfoStore.dataGetInfo.sex == 2">
            <img src="@/assets/weChat/man.png" width="20"  alt="" v-else>
          </p>
          <div class="user-right">
            <img v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-if="chatuserInfoStore.dataGetInfo.head_portrait">
            <img src="@/assets/weChat/default_avatar.png" alt="" v-else>
          </div>
        </div>
        <div class="region">
          账号：<span>{{chatuserInfoStore.loginData.username ? chatuserInfoStore.loginData.username : '-'}}</span>
        </div>
        <div class="region">
          余&nbsp;额：<span class="red">{{chatuserInfoStore.dataGetInfo.coin ? chatuserInfoStore.dataGetInfo.coin : '0'}}</span>
        </div>
        <!--<div class="region">-->
          <!--地&nbsp;区：<span>{{chatuserInfoStore.dataGetInfo.region ? chatuserInfoStore.dataGetInfo.region : '-'}}</span>-->
        <!--</div>-->
        <!--<div class="signature" @click="editRemark()" >-->
          <!--个性签名：-->
          <!--<a class=" point" v-if="nameRemark == 0" >{{chatuserInfoStore.dataGetInfo.signature || '点击编辑个性签名'}}</a>-->
          <!--<input v-if="nameRemark == 1" type="text" placeholder="" v-model="chatuserInfoStore.dataGetInfo.signature" @blur="loseFocus">-->
        <!--</div>-->
        <div class="set-label">
          <img @click="editInfo" src="@/assets/weChat/bianji_icon.png" alt="">
        </div>
      </div>
    </div>
    <div class="navbar" @click="clearSearch">
      <router-link to="/chat" class="icon iconfont icon-msg">
        <!--<el-badge :is-dot="unReadNumber > 0"  class="message-dian-badge"></el-badge>-->
        <el-badge :value="unReadNumber" :max="99" v-if="unReadNumber > 0" class="message-number-badge"></el-badge>
      </router-link>
      <router-link to="/friend" class="icon iconfont icon-friend">
        <el-badge :value="friendsListStore.countApplyFriend" :max="99" class="message-number-badge" v-if="friendsListStore.countApplyFriend > 0"></el-badge>
      </router-link>
      <router-link to="/circle" class="icon iconfont icon-collection"></router-link>
      <!--<a :href="chatuserInfoStore.dataSysConfig.webSiteJumpUrl" target="_blank" class="icon" v-if="chatuserInfoStore.dataSysConfig.appGameSwitch == 1">-->
        <!--<img src="@/assets/weChat/network.png" width="26" alt="">-->
      <!--</a>-->

    </div>
    <footer>
      <i class="icon iconfont icon-more point" @click.stop="leftSet"></i>
      <ul class="footer-content" v-if="chatListStore.leftUserSetState">
        <li class="point" v-if="indexStore.indexData.kefuGG">
          <a :href="indexStore.indexData.kefuGG"  target="_blank">客服链接</a>
        </li>
        <li class="point" v-if="indexStore.indexData.appDownLoadLink">
          <a :href="indexStore.indexData.appDownLoadLink"  target="_blank">APP下载</a>
        </li>
        <li class="point" @click="goResetPwd()">
          修改登录密码
        </li>
        <li class="point setflex" @click="setWithPwd()" v-if="indexStore.userHomeData.data.coinPassword !=1">
          <span class="set-pwd">设置提款密码</span>
          <span class="set-tip"></span>
        </li>
        <li class="point" v-if="indexStore.userHomeData.data.coinPassword == 1" @click="setWithPwd()">修改提款密码</li>
        <li class="point" @click="loginOut()">退出登录</li>
      </ul>
    </footer>
<!--     编辑个人信息弹窗-->
    <wx-editorUserInfo ref="dialog"/>
<!--    修改密码弹窗-->
    <wx-resetPassword ref="resetpwd"/>



  </div>
</template>
<script>
  import { mapState ,mapActions,mapMutations,mapGetters} from 'vuex'
  import {getSession,setSession2,getSession2} from '../../common/common'
  import _config from '../../configWX/configWX'
  import WebIM from "../../configWX/WebIMWX"

export default {
  data () {
    return {
      nameRemark:0,
      unReadNumber:0,  // 未读数量
    }
  },
  created () {

    this.getLoginData({route:this.$router})
    this.setIsAddUser(false)
    this.getFriendList({self_uid:this.getUserId})
    this.getInfo({uid:this.getUserId})
    this.setAllMp3State()
    this.getAppDownUrl()
    this.getCountApplyFriendAction({self_uid:this.getUserId})
    this.computeNumber()
    this.initIndexAction()
    this.userHomeDataAction()
    WebIM.conn.open();
//    this.getSysConfig()
  },
  computed: {
    ...mapState([
      'chatListStore',
      "chatuserInfoStore",
      'friendsListStore',
      "indexStore"
    ]),
    ...mapGetters([
        'getUserId',
        "selectedChat",
      "getChatList"
    ]),
  },
  watch:{
    'chatListStore.chatlist':{
      handler:function(val){
        this.computeNumber()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'searchUser',
      'loginOutAction',
      'getInfo',
      'setSignature',
      "sendMessageIM",
      "getCountApplyFriendAction",
      "addFriendList",
      "getFriendList",
      "getAppDownUrl",
      "getSysConfig",
      "initIndexAction",
      "userHomeDataAction"
    ]),
    ...mapMutations([
      'getLoginData',
      "setIsAddUser",
      "setModalState",
      "closeSomeModal",
      "setAllMp3State"
    ]),
    computeNumber(){
      this.unReadNumber = 0
      this.chatListStore.chatlist.forEach((i)=>{
        if(i.chatType == 2 && i.messages.unRead>0){
          this.unReadNumber += 1
        }else{
          this.unReadNumber += i.messages.unRead
        }

      })
    },
    editRemark(){
      this.nameRemark = 1
    },
    loseFocus(){
      if(!this.chatuserInfoStore.dataGetInfo.signature){
        this.$notify({
          title: '警告',
          message: '请填写个性签名',
          type: 'warning'
        });
      }else{
        this.nameRemark = 0
        let data = {
          uid:this.chatuserInfoStore.dataGetInfo.id,
          signature:this.chatuserInfoStore.dataGetInfo.signature,
        }
        this.setSignature(data).then(res=>{
          this.getInfo({uid:this.getUserId})
        })
      }
    },
    clearSearch() {
      this.searchUser('')
      this.getCountApplyFriendAction({self_uid:this.getUserId})
      this.addFriendList({self_uid:this.getUserId})
    },
    // 个人信息
    userInformation(){
      this.setModalState("personalInfor")

      this.getInfo({uid:this.getUserId})
      this.nameRemark = 0
    },
    leftSet(){
      this.setModalState("leftUserSetState")
      this.getInfo({uid:this.getUserId})
    },

    //退出登录
    loginOut() {
      // console.log(getSession('token'))
      let params = {
        data:{
          token:getSession2('token'),
        },
        route:this.$router
      }
      this.loginOutAction(params)
    },
    //去修改密码
    goResetPwd() {
      this.$refs.resetpwd.centerDialogVisible = true;
    },
    // 设置提款密码
    setWithPwd(){
      this.setModalState('setPassword')
    },
    //编辑资料
    editInfo() {
      this.$refs.dialog.centerDialogVisible = true;
    },
  },

}

</script>
<style lang="less" scoped>
.setflex{
  display: flex;
}
.red{
  color: red!important;
}
.mycard {
  position: relative;
  width: 100%;
  height: 100%;

  .avatar {
    width: 36px;
    height: 36px;
    margin: 20px 12px 0 12px;
    border-radius: 2px;
    cursor: pointer;
  }
  .signature{
    width: 100%;
    font-size: 15px;
    color: black;
    line-height: 23px;
    padding-top: 10px;
    input{
      border-bottom: 1px solid #000000;
    }
  }
  .nickname{
    color: #999999;
    font-size: 14px;
    line-height: 25px;
  }
  .user-information {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    top: 20px;
    left: 50px;
    width: 330px;
    padding: 5px;
    background-color: #fff;
    border: 1px solid #d1d1d1;
    border-radius: 30px;
    z-index: 120;
    .user-content{
      width: 300px;
      margin:12px auto;
      .user-left{
        margin-bottom: 5px;
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        .user-name{
          width: 78%;
          font-size: 24px;
          color: black;
          .man{
            color: deepskyblue;
          }
          .woman{
            color: darkorange;
          }
        }
        div{
          display: flex;
          color: #999999;
          font-size: 14px;
          p{
            width: 115px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
          }
        }

        .user-right{
          width: 62px;
          height: 62px;
          margin-left: 3px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 2px;
          }
        }
      }
      .set-label{
        width: 100%;
        font-size: 16px;
        color: black;
        padding: 12px 0;
        cursor: pointer;
        padding-bottom: 0;
        text-align: right;
        img:first-child{
          margin-right: 15px;
        }
        img {
          width: 25px;

        }
      }
        // margin-top: 12px;
      .name-bott{
        border-top:1px solid #e7e7e7;
      }
      .region{
        width: 100%;
        font-size: 16px;
        padding: 10px 0;
        color: #333;
        span{
          padding-left: 5px;
          // font-size: 14px;
          color: #666;
        }
      }
      .user-set{
        border-top:1px solid #e7e7e7;
        width: 100%;
        padding-top: 25px;
        div{
          display: flex;
          justify-content: flex-end;
          img:first-child{
            width: 20px;
            height: 28px;
            margin-right: 20px;
          }
          img:nth-child(2){
            width: 28px;
            height: 28px;
          }
        }
      }
    }
  }
  .navbar {
    width: 100%;
    text-align: center;

    .icon {
      position: relative;
      display: inline-block;
      font-size: 26px;
      margin-top: 28px;
      padding: 0 16px;
      box-sizing: border-box;
      color: rgb(173, 174, 175);
      opacity: 0.8;
      cursor: pointer;

      &.active {
        color: rgb(0, 220, 65);
      }

      &:hover {
        opacity: 1;
      }

    }
    .message-number-badge{
      position: absolute;
      right: 5px;
      top: -10px;
    }
    .message-dian-badge {
      position: absolute;
      right: 18px;
      top: -5px;
    }
    .icon-msg,
    .icon-more {
      font-size: 22px;

    }

    .icon-msg {
      padding: 0 19px;
    }

  }

  footer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    color: #aaa;
    /*阻止复制*/
    .footer-content{
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -khtml-user-select: none;
        user-select: none;
        text-align: left;
        position: absolute;
        bottom: 0;
        left: 60px;
        width: 146px;
        line-height: 40px;
        font-size: 14px;
        background-color: #2C2B2B;
        color: #8C8C8C;
        z-index: 10;
        li{
          padding: 0px 10px;
          a {
            display: block;
          }
        }
        li:hover{
          background: #323132;
        }
      }
  }
}
</style>
