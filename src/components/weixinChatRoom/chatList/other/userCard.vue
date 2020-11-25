<!-- 名片 -->
<template>
  <div>
    <div class="time"><span v-if="!msg.showTime">{{getTimes(msg.create_time)}}</span></div>
    <div class="main"  :class="{self:msg.userMsg || msg.send_uid == getUserId}">
      <!--<span class="chat-username">{{msg.nickname ? msg.nickname : msg.username ? msg.username : msg.send_uid == getUserId ? chatuserInfoStore.dataGetInfo.nickname : selectedChat.user.name }} </span>-->

      <span  class="chat-username" v-if="msg.userMsg || msg.send_uid == getUserId">
        <wx-level :msg="msg"/>{{chatuserInfoStore.dataGetInfo.nickname}}
      </span>
      <span  class="chat-username" v-else-if="msgListStore.activeTyep == 1">
        {{msgListStore.activeName}}<wx-level :msg="msg"/>
      </span>
      <span  class="chat-username" v-else>
        {{getGroupRemarkName({uid:msg.asFrom,send_uid:msg.send_uid}) || msg.nickname || msg.username}}<wx-level :msg="msg"/>
      </span>

      <img class="avatar" width="36" height="36" v-lazy="msg.head_portrait" v-if="msg.head_portrait" @click="findUser(msg)"  @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="msg.send_uid == getUserId" @click="findUser(msg)"  @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="selectedChat.user.img" v-else @click="findUser(msg)"  @contextmenu.prevent="openHandleUserVible(msg)"/>
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

      <div class="chat-user-card card chat-content-dom"   @contextmenu.prevent="messageBack()">
        <div class="red-envelopes" @click="openInfo">
          <img :src="chatObj.head_portrait" alt="" class="header_avatar">
          <div class="red-envelopes-message">
            <div class="long-text">{{chatObj.nickname}}</div>
            <span>{{chatObj.username}}</span>
          </div>
        </div>
        <p>
          个人名片
        </p>
        <i class="el-icon-loading chat-loading" v-if="msg.status == config.MSG_STATUS_SED"></i>
        <i class="el-icon-warning chat-loading error" v-if="msg.status == config.MSG_STATUS_ERROR" @click="chongFa()"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState ,mapMutations ,mapActions} from 'vuex'
  import {Message} from 'element-ui'
  import {getTimes} from '@/common/common'
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
        'getUserId',
        "getGroupRemarkName",
        "isBoss",
        "isManagement",
      ]),
      ...mapState([
        'chatListStore',
        "chatuserInfoStore",
        "friendsListStore",
        "msgListStore"
      ]),
      chatObj(){
        var obj =JSON.parse(this.msg.content);
        return obj
      },
    },
    mounted() {

    },
    created (){
      this.errorTimer = setTimeout(()=>{
        this.setError()
      },10000)
    },
    beforeDestroy(){
      clearTimeout(this.errorTimer)
    },
    watch: {

    },
    methods: {
      ...mapMutations([
        'setModalState',
      ]),
      ...mapActions([
        'getFriendInfoAction'
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
      messageBack(){
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

          })
        }


      },
      findUser(u){
        this.$emit("setFindUser",u)
      },

      openInfo(){
        this.getFriendInfoAction({self_uid:this.getUserId,friend_uid:this.chatObj.id}).then((res)=>{
          this.setModalState('userInfoState')
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

</style>
