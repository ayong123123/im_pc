<template>
  <div>
    <div class="time"><span>{{getTimes(msg.create_time)}}</span></div>
    <div class="main" :class="{self:msg.userMsg || msg.send_uid == getUserId}">
      <img class="avatar" width="36" height="36" v-lazy="msg.head_portrait" v-if="msg.head_portrait" @click="findUser(msg)"  @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="msg.send_uid == getUserId" @click="findUser(msg)" @contextmenu.prevent="openHandleUserVible(msg)" />
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

      <span  class="chat-username" v-if="msg.userMsg || msg.send_uid == getUserId">
        <span class="level" v-if="msg.level && msg.level_name"><span class="lv">LV</span><span class="grade">{{msg.level}}</span>{{msg.level_name}}</span>
        <span class="level" v-if="msg.reserved"><span class="lv">LV</span><span class="grade">{{JSON.parse(msg.reserved).level}}</span>{{JSON.parse(msg.reserved).levelName}}</span>{{chatuserInfoStore.dataGetInfo.nickname}}
      </span>
      <span  class="chat-username" v-else-if="msgListStore.activeTyep == 1">
        <span class="level" v-if="msg.level && msg.level_name"><span class="lv">LV</span><span class="grade">{{msg.level}}</span>{{msg.level_name}}</span>
        <span class="level" v-if="msg.reserved"><span class="lv">LV</span><span class="grade">{{JSON.parse(msg.reserved).level}}</span>{{JSON.parse(msg.reserved).levelName}}</span>{{msgListStore.activeName}}
      </span>
      <span  class="chat-username" v-else>
        <span class="level" v-if="msg.level && msg.level_name"><span class="lv">LV</span><span class="grade">{{msg.level}}</span>{{msg.level_name}}</span>
        <span class="level" v-if="msg.reserved"><span class="lv">LV</span><span class="grade">{{JSON.parse(msg.reserved).level}}</span>{{JSON.parse(msg.reserved).levelName}}</span>{{getGroupRemarkName({uid:msg.asFrom,send_uid:msg.send_uid}) || msg.nickname || msg.username}}
      </span>
      <div class="chat-order chat-content-dom">
        <div>
          <p class="title_p">
            分享注单:
          </p>
          <div class="orders long-text"  @contextmenu.prevent="messageBack()">
            <div class="orders_title">
              {{orderObj.para.cptitle}}
            </div>
            <div class="orders_content flex">
              <div class="orders_c_one">
                <p>投注期号</p>
                <p>投注内容</p>
                <p>投注总额</p>
              </div>
              <div class="orders_c_two">
                <p>{{orderObj.para.actionNo}}</p>
                <p class="long-text">
                  <i v-for="i in orderObj.nameList">{{i}}</i>
                  <i v-for="i in orderObj.code" v-if="!orderObj.nameList">[{{tochinese(i.actionData)}}]&nbsp;</i>
                </p>
                <p>¥<i>{{allMoney}}</i></p>
              </div>
              <div class="orders_c_three">
                <button @click="daShangFn" v-if="indexStore.indexData.rewardSwitch==1">打赏</button>
                <button @click="orderFn">跟投</button>
              </div>
            </div>
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

    props: ['msg','forbiddenInfo'],
    data () {
      return {
        getTimes:getTimes,
        config:_config,
        getTimesYueRi:getTimesYueRi,
        errorTimer:null,
      }
    },
    computed:{
      ...mapState([
        "msgListStore",
        'chatListStore',
        "chatuserInfoStore",
        "friendsListStore",
        "indexStore"
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
      allMoney(){
//        let obj =JSON.parse(this.msgInside.data)
        var temp=JSON.parse(this.msg.content);
        let money= 0;
        for(let i in temp.code){
          money+= Number(temp.code[i].beiShu * temp.code[i].actionNum)
        }
        return money
      }
    },
    watch: {

    },
    created (){
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
      messageBack(){
        if((this.msg.send_uid && this.msg.send_uid == this.getUserId) || (this.msg.userMsg && this.msg.status == this.config.MSG_STATUS_SUCCEED) || (this.isBoss && this.msgListStore.activeTyep == 2) || (this.isManagement && this.msgListStore.activeTyep == 2)){
          this.$confirm('是否撤回该消息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('messageBack')
          }).catch(() => {
//          this.$message(+{
//            type: 'info',
//            message: '已取消删除'
//          });
          });
        }

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
    },
  }
</script>
<style lang="less" scoped>

</style>
