<!-- 文本 -->
<template>
  <div>
    <div class="main"  :class="{ self: msg.userMsg || msg.send_uid == getUserId}" >
      <img class="avatar" width="36" height="36" v-lazy="msg.head_portrait" v-if="msg.head_portrait" @click="findUser(msg)"  @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="msg.send_uid == getUserId" @click="findUser(msg)"  @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="selectedChat.user.img" v-else @click="findUser(msg)"  @contextmenu.prevent="openHandleUserVible(msg)"/>
      <!--右键弹窗-->
      <div class="handleConfig" v-show="chatListStore.handleUserVible && forbiddenInfo.unique_value ==msg.unique_value && msg.send_uid != getUserId" >
        <ul>
          <li @click="isStopTalking(msg)" v-if="forbiddenInfo.forbiddenStatus != 2">
            禁言
          </li>
          <li  @click="isStopTalking(msg)" v-if="forbiddenInfo.forbiddenStatus != 1">
            解禁
          </li>
          <li @click="removeGroupUser(msg)">
            移除
          </li>
          <li @click="findUser(msg)">
            @TA
          </li>
        </ul>
      </div>

      <div>
         <p v-if="msg.userMsg || msg.send_uid == getUserId">
           <wx-level :msg="msg"/>{{chatuserInfoStore.dataGetInfo.nickname}}
      </p>
        <p v-else-if="msgListStore.activeTyep == 1">
          {{msgListStore.activeName}}<wx-level :msg="msg"/>
      </p>
        <p v-else>
          {{getGroupRemarkName({uid:msg.asFrom,send_uid:msg.send_uid}) || msg.nickname || msg.username}}<wx-level :msg="msg"/>
      </p>
        <div class="whatsay">
          <div class="whatsay_video" @contextmenu.prevent="messageBack">
            <img  width="120" height="160" v-lazy="chatObj.youpai_image_url || chatObj.qiniu_image_url">
            <div class="video-modal">
            <img src="@/assets/weChat/player.png" alt="" @click="setVideoPlayer({data:msg.content,state:true})"  >
            <div class="time">{{videoTimeFilter(chatObj.time)}}</div>
          </div>
            <img src="@/assets/weChat/error.png" width="18" height="18"  class="chat-state resendMsg" v-if="msg.status == config.MSG_STATUS_ERROR" @click="chongFa()">
          </div>
          <!--<mt-spinner color="#999" :size="14" type="double-bounce" class="chat-state" v-if="msg.status == config.MSG_STATUS_SED"></mt-spinner>-->
          <!--<img src="@/assets/weChat/error.png" width="18" height="18"  class="chat-state" v-if="msg.status == config.MSG_STATUS_ERROR" @click="chongFa()">-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState ,mapMutations ,mapActions} from 'vuex'
  import {getTimes,getTimesYueRi,videoTimeFilter} from '@/common/common'
  import _config from '@/configWX/configWX'

  export default {
    props: ['msg','forbiddenInfo'],
    computed: {
      ...mapGetters([
        'getUserId',
        'selectedChat',
        "getGroupRemarkName",
        "isBoss",
        "isManagement",
      ]),
      ...mapState([
        "chatuserInfoStore",
        "msgListStore",
        "chatListStore",
        "friendsListStore"

      ]),
      chatObj(){
        try {
          var obj =JSON.parse(this.msg.content);
          return obj || ''
        }catch (e){

        }
      },

    },
    data(){
      return {
        getTimes:getTimes,
        config:_config,
        getTimesYueRi:getTimesYueRi,
        videoTimeFilter:videoTimeFilter,

        longClick:0,
        timeOutEvent:0,
        timeOutEvent2:0,
        options:false,
        errorTimer:null,
      }
    },
    mounted() {
      // console.log(this.msg)
    },
    beforeDestroy(){
      clearTimeout(this.errorTimer)
    },
    watch: {

    },
    created(){
      this.errorTimer = setTimeout(()=>{
        this.setError()
      },10000)
    },
    methods: {
      ...mapActions([

      ]),
      ...mapMutations([
          'setVideoPlayer'
      ]),
      //禁言
      isStopTalking(u) {
        this.$emit('isStopTalking',u)
      },
      //移除
      removeGroupUser(u) {
        this.$emit('removeGroupUser',u)
      },
      openHandleUserVible(u) {
        this.$emit("openHandleUserVible",u)
      },
      chongFa(){
        if((this.msg.send_uid && this.msg.send_uid == this.getUserId) || (this.msg.userMsg && this.msg.status == this.config.MSG_STATUS_ERROR)){
          this.$confirm('是否重发该消息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit("reSendMessage",this.msg)
          }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
          });
        }

      },
      messageBack() {
        if((this.msg.send_uid && this.msg.send_uid == this.getUserId) || (this.msg.userMsg && this.msg.status == this.config.MSG_STATUS_SUCCEED) || (this.isBoss && this.msgListStore.activeTyep == 2) || (this.isManagement && this.msgListStore.activeTyep == 2)) {
          this.$emit('openConfig',this.msg)
        }else {
          this.$confirm('是否转发该消息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('getZhuanFa')
          }).catch(() => {
//          this.$message(+{
//            type: 'info',
//            message: '已取消删除'
//          });
          })
        }
      },
      setError(){
        if ((!this.msg.code || this.msg.code == 3) && this.msg.status == this.config.MSG_STATUS_SED) {
          this.msg.status = this.config.MSG_STATUS_ERROR
          clearTimeout(this.errorTimer)
        }
      },
      findUser(u){
        this.$emit("setFindUser",u)
      },

    },
  }
</script>

<style lang="css" scoped>
  .video-modal{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /*background-color: rgba(0,0,0,0.1);*/
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .user-chat-message .message-wrapper .main .avatar{margin-right: 15px;}
  .user-chat-message .message-wrapper .main .whatsay,
  .user-chat-message .message-wrapper .self .whatsay{
    width: 100%;
    height: 160px;
    text-align: left;
  }
  .user-chat-message .message-wrapper .self .whatsay{text-align: right;}

  .user-chat-message .message-wrapper .self  .whatsay_video,
  .user-chat-message .message-wrapper .main .whatsay_video{
    width: 120px;
    height: 160px;
    display: inline-block;
    text-align: right;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }
  .user-chat-message .message-wrapper .main .whatsay_video{text-align: left}
  .user-chat-message .message-wrapper .self  .whatsay_video>img,
  .user-chat-message .message-wrapper .main .whatsay_video>img{
    width: 100%;
    height: 100%;
  }
  .video-modal:after{
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.4);
    z-index: 0;
  }
  .user-chat-message .message-wrapper .self .video-modal>img,
  .user-chat-message .message-wrapper .main .video-modal>img{
    width: 48px;
    height: 48px;
    position: absolute;
    top:50%;
    left: 50%;
    margin-top: -24px;
    margin-left: -24px;
    cursor: pointer;
    z-index: 1;
  }
  .user-chat-message .message-wrapper .self .video-modal>.time,
  .user-chat-message .message-wrapper .main .video-modal>.time{
    position: absolute;
    bottom: 0;
    right: 0;
    color: #fff;
    text-align: right;
    padding-right: 10px;
    z-index: 1;
  }
</style>
