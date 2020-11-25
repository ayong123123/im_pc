<!-- 牛牛红包 -->
<template>
  <div>
    <div class="time"><span v-if="!msg.showTime">{{getTimes(msg.create_time)}}</span></div>
    <div class="main"  :class="{self:msg.userMsg  || msg.send_uid == getUserId}">
      <span  class="chat-username" v-if="msg.userMsg || msg.send_uid == getUserId">
        <wx-level :msg="msg"/>{{chatuserInfoStore.dataGetInfo.nickname}}
      </span>
      <span  class="chat-username" v-else-if="msgListStore.activeTyep == 1">
        {{msgListStore.activeName}}<wx-level :msg="msg"/>
      </span>
      <span  class="chat-username" v-else>
        {{getGroupRemarkName({uid:msg.asFrom,send_uid:msg.send_uid}) || msg.nickname || msg.username}}<wx-level :msg="msg"/>
      </span>
      <img class="avatar" width="36" height="36" v-lazy="msg.head_portrait" v-if="msg.head_portrait" @click="findUser(msg)" @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="msg.send_uid == getUserId" @click="findUser(msg)" @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="selectedChat.user.img" v-else @click="findUser(msg)" @contextmenu.prevent="openHandleUserVible(msg)"/>
      <!--<img class="avatar" width="36" height="36" src="@/assets/weChat/default_avatar.png" v-else  @click="findUser(msg)" />-->
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

      <div class="chat-red-pack chat-content-dom">
        <div class="red-envelopes" :class="{opacity:msg.redState}" @click="getNiuniuRed">
          <img src="../../../../assets/weChat/gameRed/pack_niu.png" width="40" height="48" alt=""  v-if="!msg.niu_detail">
          <img class="img-style" src="../../../../assets/weChat/gameRed/pass-kill.png" width="40" height="34" alt="" v-else-if="msg.niu_detail.base.reperson == 0 && msg.niu_detail.base.bwp > 0 && msg.niu_detail.base.pwb == 0">
          <img class="img-style" src="../../../../assets/weChat/gameRed/pass.png" width="40" height="34" alt=""  v-else-if="msg.niu_detail.base.reperson == 0 && msg.niu_detail.base.pwb > 0 && msg.niu_detail.base.bwp == 0">
          <div class="red-envelopes-message" v-if="!msg.niu_detail">
            <div class="long-text">{{chatObj.topic}}</div>
          </div>
          <div class="nn-niu" v-else>
            <img src="../../../../assets/weChat/gameRed/niu-chartlet.png" width="90" height="40" alt="" style="margin-left: 60px" />
            <span class="nn-niu-vs">vs</span>
          </div>
        </div>
        <p v-if="!msg.niu_detail">
          牛牛红包
          <span v-if="chatObj.fval == 2" style="color:red">(倍)</span>
        </p>
        <div class="nndiv flex-between" v-else>
          <div>庄: <span> {{msg.niu_detail.base.bwp}} </span>胜</div>
          <div style="color:#ED703A;">{{chatObj.amount}}</div>
          <div>闲: <span> {{msg.niu_detail.base.pwb}} </span>胜</div>
        </div>
        <i class="el-icon-loading chat-loading" v-if="msg.status == config.MSG_STATUS_SED"></i>
        <i class="el-icon-warning chat-loading error" v-if="msg.status == config.MSG_STATUS_ERROR"  @click="chongFa()"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState ,mapMutations ,mapActions} from 'vuex'
  import {Message} from 'element-ui'
  import {getTimes,getSession2 } from '@/common/common'
  import _config from '@/configWX/configWX'
  export default {
    props: ['msg','forbiddenInfo'],
    data(){
      return {
        getTimes:getTimes,
        config:_config,
        errorTimer:null,
      }
    },
    computed: {
      ...mapGetters([
        'selectedChat',
        "getUserId",
        "getGroupRemarkName"
      ]),
      chatObj(){
        var obj =JSON.parse(this.msg.content);
        return obj
      },
      ...mapState([
        'chatListStore',
        "chatuserInfoStore",
        "msgListStore",
        "wechatIMstore"
      ])
    },
    beforeDestroy(){
      clearTimeout(this.errorTimer)
    },

    created (){
      this.errorTimer = setTimeout(()=>{
        this.setError()
      },10000)
    },
    mounted() {

    },
    watch: {

    },
    methods: {
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
      setError(){
        if ((!this.msg.code || this.msg.code == 3) && this.msg.status == this.config.MSG_STATUS_SED) {
          this.msg.status = this.config.MSG_STATUS_ERROR
          clearTimeout(this.errorTimer)
        }
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
//          this.$message(+{
//            type: 'info',
//            message: '已取消删除'
//          });
          });
        }

      },
      findUser(u){
        this.$emit("setFindUser",u)
      },
      ...mapMutations([
        "setRedSendUidType",
        "setSendRedPackMessage",
        "setModalState",
        "setGetOrCheck"
      ]),
      ...mapActions([
        "getRedPackAction",
        "firstGrabRedEnvelopeAction"
      ]),
       getNiuniuRed(){
        var token = getSession2('token')
        var repcode = this.chatObj.repcode
        if(!token){
          Message({
            message: "提示:请重新登录",
            type: "warning",
            showClose: true,
          })
          return
        }
        let sendId  = this.msg.send_uid || this.msg.groupmessage && this.msg.groupmessage.sendid
        this.setRedSendUidType({id:sendId,type:2,unique_value:this.msg.unique_value})
        let redMessage = {
          repcode:this.chatObj.repcode,
          send_head_portrait:this.msg.head_portrait,
          send_name:this.msg.username || this.msg.nickname ,
          topic:this.chatObj.topic,
        }
        // wx-red-open
        this.setSendRedPackMessage(redMessage)
        this.firstGrabRedEnvelopeAction({token:token,repcode:repcode}).then((data)=>{
          if(data.code == 140){
            this.setGetOrCheck(2)
            this.setModalState('redDetailState')
          }else{
            this.setModalState('redPupContainer')
          }
        })


      }

    },
    filters: {
      // 将日期过滤为 hour:minutes
      time (date) {
        if (typeof date === 'string') {
          date = new Date(date);
        }
        if(date.getMinutes()<10){
          return date.getHours() + ':0' +date.getMinutes();
        }else{
          return date.getHours() + ':' + date.getMinutes();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.img-style{
  position: absolute;
  top: 15px;
  left: 16px;
}
</style>
