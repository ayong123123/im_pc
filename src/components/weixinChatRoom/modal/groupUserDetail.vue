<template>
  <div>
    <transition>
      <div class="look-new-friend-modal">
        <div class="look-new-friend-head">
          <i class="el-icon-close"  @click="setModalState('groupUserInfoState')"></i>
          群友详情
        </div>
        <div class="look-new-friend-detail flex">
          <img v-lazy="userDetail.head_portrait || moren" alt="">
          <div class="look-new-friend-user">
            <div class="look-new-friend-name">{{userDetail.remarks_name || userDetail.nickname}}<img src="@/assets/weChat/woman.png" width="12" alt="" v-if="userDetail.sex == 2">
              <img src="@/assets/weChat/man.png" width="12"  alt="" v-else></div>
            <div class="look-new-friend-diqu">昵&nbsp;&nbsp;&nbsp;称: {{userDetail.nickname || '--'}}</div>
            <div class="look-new-friend-diqu">用户名: {{userDetail.username || '--'}}</div>

            <!--<div class="look-new-friend-diqu">地区: {{userDetail.region || '&#45;&#45;'}}</div>-->
          </div>
        </div>
        <div class="friend-other-message">
          <!--<div class="other-message-item flex">-->
            <!--<span class="flex-shrink0">手机号</span>-->
            <!--<div class="color-phone">-->
              <!--{{userDetail.phone}}-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="other-message-item flex">-->
            <!--<span class="flex-shrink0">个性签名</span>-->
            <!--<div>-->
              <!--{{userDetail.signature}}-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <div class="other-message-select trasformBoss" v-if="isBoss && userDetail.id != getUserId" @click="transformBoss">
          <img src="@/assets/weChat/trasformBoss.png" width="24" alt="">
          转让群主
        </div>
        <div class="other-message-select" v-if="userDetail.is_friend == 1 && userDetail.id != getUserId" @click="sendChat">
          <img src="@/assets/weChat/send_message_icon.png" width="24" alt="">发消息
        </div>
        <div class="other-message-select" v-if="userDetail.is_friend == 0" @click="addForFriendFn(userDetail.id)">
          添加好友
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import { Loading,Message,MessageBox} from 'element-ui';
  import moren from '../../../assets/weChat/default_avatar.png'
  import _config from '../../../configWX/configWX'
  export default {
    data () {
      return {
        moren:moren,
        config:_config,
      }
    },
    computed:{
      ...mapState([
        'chatListStore',
        "friendsListStore",
        "msgListStore"
      ]),

      ...mapGetters([
        'getUserId',
        "selectedChat",
        "isBoss",
        "isManagement",
        "getGroupUsers"
      ]),
      userDetail(){
        return this.chatListStore.groupUserInfoList
      }
    },
    watch: {

    },
    created () {

    },
    mounted () {
      console.log('userDetail',this.userDetail)
    },
    methods:{

      ...mapActions([
        "addMyFriendAction",
        "transferGroup"
      ]),
      //转让群主
      async transformBoss() {
        if(this.isBoss && this.userDetail.id != this.getUserId) {
          await this.transferGroup({self_uid: this.getUserId,group_uid:this.chatListStore.groupUserInfoList.id,group_id:this.msgListStore.activeWindowId})
          this.setModalState('groupUserInfoState')
        }
      },
      sendChat(){
        this.setModalState('groupUserInfoState')

        this.createFriendChatMessage({id:this.userDetail.id})

        let fromMessage = {
          id:this.userDetail.id,
          name:this.userDetail.nickname,
          count:0,
          head_portrait:this.userDetail.head_portrait,
          remarks_name:this.userDetail.remarks_name,
        }
        this.sendNewChat({message:fromMessage,type:1,state:true})

      },
      addForFriendFn(id){
        this.addMyFriendAction({
          self_uid:this.getUserId,
          friend_uid:id,
          agree:0,
          add_msg:'',
        })
      },
      ...mapMutations([
        "setModalState",
        "setActiveWindow",
        "createFriendChatMessage",
        "sendNewChat"
      ]),

    },
  }
</script>
<style lang="less" scoped>
  .look-new-friend-modal {
    width: 350px;
    height: 502px;
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom: 0;
    margin: auto;
    background-color: #fff;
    /*border: 1px solid #e7e7e7;*/
    -webkit-box-shadow: 0 1px 2px 1px #d1d1d1;
    box-shadow: 0 1px 2px 1px #d1d1d1;
    z-index: 150;
    text-align: center;
  .look-new-friend-head {
    height: 40px;
    font-size: 17px;
    color:#000;
    line-height: 40px;
    border-bottom: 1px solid #e5e5e5;
  i {
    position: absolute;
    right:10px;
    top: 10px;
    font-size: 20px;
    cursor: pointer;
  }
  }
  .look-new-friend-detail {
    padding: 5px 0 5px 5px;
    margin-left: 20px;
    /*border-bottom:1px solid #e7e7e7;*/
  .look-new-friend-user {
    margin-left: 15px;
    text-align: left;
  .look-new-friend-name {
    font-size: 17px;
    font-weight: 600;
    color:#000;
    img {
      width: 15px;
      height: 15px;
      margin-left: 5px;
    }
  }
  .look-new-friend-diqu {
    font-size: 13px;

  }


  }
  img {
    border-radius: 5px;
    width: 50px;
    height: 50px;
  }
  }
  .friend-other-message {
    border-bottom: 10px solid #e5e5e5;
    /*border-top: 10px solid #e5e5e5;*/
    padding-left: 20px;
  .other-message-item {
    padding: 12px 12px 12px 0;
    background-color: #fff;
    font-size:16px;
    /*border-bottom: 1px solid #e5e5e5;*/
  span {
    display: inline-block;
    width: 80px;
    text-align: left;
    color:#000;
  }
  }

  }
  .other-message-select {
    text-align: center;
    border-bottom: 10px solid #e5e5e5;
    padding: 10px 0;
    font-size: 16px;
    color:	#5686DB;
    cursor: pointer;
  img {
    vertical-align: middle;
    margin-right: 5px;
  }
  }
  }
</style>
