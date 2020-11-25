<template>
  <div>
    <div class="time"><span>{{getTimes(msg.create_time)}}</span></div>
    <div class="main" :class="{self:msg.userMsg || msg.send_uid == getUserId}">
      <img class="avatar" width="36" height="36" v-lazy="msg.head_portrait" v-if="msg.head_portrait" @click="findUser(msg)" />
      <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="msg.send_uid == getUserId" @click="findUser(msg)" />
      <img class="avatar" width="36" height="36" v-lazy="selectedChat.user.img" v-else @click="findUser(msg)" />
      <!--<img class="avatar" width="36" height="36" src="@/assets/weChat/default_avatar.png" v-else  @click="findUser(msg)" />-->
      <span  class="chat-username" v-if="msg.userMsg || msg.send_uid == getUserId">
        <wx-level :msg="msg"/>{{chatuserInfoStore.dataGetInfo.nickname}}
      </span>
      <span  class="chat-username" v-else-if="msgListStore.activeTyep == 1">
        {{msgListStore.activeName}}<wx-level :msg="msg"/>
      </span>
      <span  class="chat-username" v-else>
        {{getGroupRemarkName({uid:msg.asFrom,send_uid:msg.send_uid}) || msg.nickname || msg.username}}<wx-level :msg="msg"/>
      </span>
      <div class="chat-order chat-content-dom">
        <div>
          <p class="title_p">
            精准计划:
            <!--<span>{{msg.level}}</span>-->
          </p>
          <!--@contextmenu.prevent="messageBack()"-->
          <div class="orders long-text" >
            <div class="orders_title">
              <!--{{orderObj.para.cptitle || 1}}-->
              <p class="planTitle">☆☆☆  精准计划  ☆☆☆</p>
              <!--<p class="planName">{{msgInside[0][0].title}}</p>-->
              <p class="planName">{{msgConten[0][0].title}}</p>
            </div>
            <section class="" v-for="(t,index) in msgConten">
              <div class="tit">{{t[0].class_groupname}}</div>

              <div class="play_li" v-for="(i,index) in t">
                <div class="left_no">{{i.shwoNo}}</div>
                <div class="right_playNmae">{{i.actionData}}
                  <span class="state_on" v-if="i.state*1 == 1 || i.state*1 == 3">(中)</span>
                  <span class="state_off" v-if="i.state*1 == 0">(不中)</span>
                  <span class="state_bet" v-if="i.state*1 == 2" @click="betLot(i)">(跟投)</span>
                </div>
              </div>

              <!--<div class="play_li">-->
                <!--<div class="left_no">1111</div>-->
                <!--<div class="right_playNmae">单<span class="state_off">(不中)</span></div>-->
              <!--</div>-->

              <!--<div class="play_li">-->
                <!--<div class="left_no">1111</div>-->
                <!--<div class="right_playNmae">单<span class="state_bet">(跟投)</span></div>-->
              <!--</div>-->
            </section>
          </div>
        </div>

        <i class="el-icon-loading chat-loading" v-if="msg.status == config.MSG_STATUS_SED"></i>
        <i class="el-icon-warning chat-loading error" v-if="msg.status == config.MSG_STATUS_ERROR" @click="chongFa()"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import {getTimes,getTimesYueRi} from '@/common/common'
  import _config from '@/configWX/configWX'
  import {Message} from  'element-ui'
  export default {

    props: ['msg'],
    data () {
      return {
        getTimes:getTimes,
        config:_config,
        getTimesYueRi:getTimesYueRi,
        errorTimer:null,
        msgConten:[],
      }
    },
    computed:{
      ...mapState([
        "msgListStore",
        'chatListStore',
        "chatuserInfoStore",
        "friendsListStore",
        "indexStore",
//        "setPlanOrderObj"
      ]),
      ...mapGetters([
        'selectedChat',
        "getUserId",
        "getGroupRemarkName",
        "isBoss",
        "isManagement",
      ]),
      orderObj(){
        var temp=JSON.parse(this.msg.content);
        return temp;
      },

    },
    watch: {

    },
    created (){
        this.msgConten=JSON.parse(this.msg.content) || [];
      this.errorTimer = setTimeout(()=>{
        this.setError()
      },10000)
    },
    beforeDestroy(){
      clearTimeout(this.errorTimer)
    },
    mounted () {

    },
    methods:{
      ...mapActions([
        "rewardUser"
      ]),
      ...mapMutations([
        "setModalState",
        "setDaShangObj"
      ]),
//       messageBack(){
//         if((this.msg.send_uid && this.msg.send_uid == this.getUserId) || (this.msg.userMsg && this.msg.status == this.config.MSG_STATUS_SUCCEED) || (this.isBoss && this.msgListStore.activeTyep == 2) || (this.isManagement && this.msgListStore.activeTyep == 2)){
//           this.$confirm('是否撤回该消息?', '提示', {
//             confirmButtonText: '确定',
//             cancelButtonText: '取消',
//             type: 'warning'
//           }).then(() => {
//             this.$emit('messageBack')
//           }).catch(() => {
// //          this.$message(+{
// //            type: 'info',
// //            message: '已取消删除'
// //          });
//           });
//         }
//
//       },
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
      daShangFn(){
        var uid = this.msg.send_uid || this.msg.groupmessage && this.msg.groupmessage.sendid || this.msg.singlemessage && this.msg.singlemessage.sendid
        this.setDaShangObj(this.msg);
        if(this.msg.userMsg || this.msg.send_uid == this.getUserId){
          Message({
            message:'不可以打赏自己',
            type:"warning",
            showClose:true
          })
          return;
        }
        this.rewardUser({uid:uid }).then(()=>{
          this.setModalState('moneyRewardState')
        })

      },
      orderFn(){
        let temp = JSON.parse(this.msg.content)
        temp.nickname = this.msg.nickname
        this.setDaShangObj(temp)
        this.setModalState('orderFollowState')
      },
      tochinese (str) {
        if(str=="k3hz_da"){ return "大"}
        if(str=="k3hz_xiao"){ return "小"}
        if(str=="k3hz_dan"){ return "单"}
        if(str=="k3hz_shuang"){ return "双"}
        return str;
      },

      betLot(i){
//        this.setPlanOrderObj(i)
//        this.moduleState.planGenTou = true
        this.setDaShangObj(i)
        this.setModalState('planFollowState')
      }
    },
  }
</script>
<style lang="less" scoped>
  .user-chat-message .message-wrapper .main .chat-order .orders{
    height: auto;
    background: #ffffff;
  }
  .tit{
    color: #BBA071;
    line-height: 28px;
    text-align: center;
    font-size: 16px;
  }
  .left_no{
    float: left;
    width: 50%;
    border-right: 1px solid #E8E8E8;
    border-top: 1px solid #E8E8E8;
    line-height: 25px;
  }
  .right_playNmae{
    float: left;
    width: 50%;
    border-top: 1px solid #E8E8E8;
    line-height: 25px;
  }
  .state_on{
    padding-left:2px;
    color: #FD4847;
    font-weight: bold;
  }
  .state_off{
    padding-left:2px;
    color: #4A7ADB;
    font-weight: bold;
  }
  .state_bet{
    margin-top: 5px;
    margin-left: 2px;
    display: inline-block;
    width: 55px;
    height: 20px;
    border-radius:5px;
    background: #FF0000;
    color: #ffffff;
    line-height: 20px;
    cursor: pointer;
  }

</style>
