<!-- 红包 -->
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
            <img class="avatar" width="36" height="36" v-lazy="msg.head_portrait" v-if="msg.head_portrait" @click="findUser(msg)" />
            <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="msg.send_uid == getUserId" @click="findUser(msg)" />
            <img class="avatar" width="36" height="36" v-lazy="selectedChat.user.img" v-else @click="findUser(msg)" />
            <!--<img class="avatar" width="36" height="36" src="@/assets/weChat/default_avatar.png" v-else  @click="findUser(msg)" />-->

            <div class="chat-red-pack chat-content-dom">
                <div class="red-envelopes" :class="{opacity:msg.redState}"  @click="getRedPackFn">
                    <img src="../../../../assets/weChat/red_transfer_icon.png" alt="" width="52" height="52">


                    <div class="red-envelopes-message">
                        <div class="long-text" style="font-size: 18px;margin-top: 0">¥{{chatObj.amount}}</div>
                        <div class="long-text" style="font-size: 15px;margin-top: 0" v-if="chatObj.topic">{{chatObj.topic}}</div>
                        <div class="long-text" style="font-size: 15px;margin-top: 0" v-else-if="msg.userMsg || msg.send_uid == getUserId">转账给{{msgListStore.activeName}}</div>
                        <div class="long-text" style="font-size: 15px;margin-top: 0" v-else>转账给你</div>
                    </div>

                    <!--<div class="red-envelopes-message">-->
                        <!--<div class="long-text">{{chatObj.topic}}</div>-->
                    <!--</div>-->
                </div>
                <p>
                    转账
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
  import {getTimes,getSession2 } from '@/common/common'
  import _config from '@/configWX/configWX'
  export default {
    props: ['msg'],
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
        "msgListStore"
      ])
    },
    beforeDestroy(){
      clearTimeout(this.errorTimer)
    },
    created(){
      this.errorTimer = setTimeout(()=>{
        this.setError()
      },10000)
    },
    mounted() {

    },
    watch: {

    },
    methods: {
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
        "firstGrabRedEnvelopeAction",
        "getTransferDetail"
      ]),
      getRedPackFn(){
        var token = getSession2('token')
        if(!token){
          Message({
            message: "提示:请重新登录",
            type: "warning",
            showClose: true,
          })
          return
        }
        var id = JSON.parse(this.msg.content).id || '';
        localStorage.setItem('transferId',id);
        this.setModalState('transferDetail')
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
