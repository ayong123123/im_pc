<!-- 好友信息 -->
<template>
  <div class="Info-wrapper">
    <div class="newfriend"   @mousedown="windowMove($event)">
      <div class="nickname">{{friendsListStore.groupChatInfoList.data.group_name}}</div>
    </div>
    <div class="group-content">
      <ul class="groupList">
        <li v-for="item in friendsListStore.groupChatInfoList.data.user_info" class="point" @click="openUserInfo(item)">
          <img v-if="item.head_portrait" width="55" height="55" :src="item.head_portrait">
          <img v-else width="55" height="55" src="@/assets/weChat/default_avatar.png">
          <p :style="item.role == 1 ? {'color':'#CD7F32'} :''">{{item.user_group_name}}</p>
          <img src="@/assets/weChat/qunzhu_icon.png" alt=""  v-show="item.role == 1" class="qunz-icon2">
          <img src="@/assets/weChat/guanliyuan_icon.png" alt=""  v-show="item.role == 2" class="qunz-icon2">
        </li>
      </ul>
    </div>
    <div class="send" @click="send()">
      <p>发消息</p>
    </div>
  </div>
</template>

<script>
  import { mapGetters ,mapActions , mapState ,mapMutations} from 'vuex'
  import _config from '../../../configWX/configWX'
  import {Message} from 'element-ui'
  export default {
    data () {
      return {
        friendEditState: false,
        nameRemark:0,
        remarks_name:''
      }
    },
    computed: {
      ...mapGetters([
        'getUserId',
        "isManagement",
        "isBoss"
      ]),
      ...mapState([
        'friendsListStore',
        'chatListStore',
        "msgListStore"
      ]),
    },
    created() {
      this.friendsListStore.friendInfo = ''
    },
    methods: {
      ...mapActions([
        'addMsgAction',
        "getGroupUserInfoAction"
      ]),
      ...mapMutations([
        "setFriendEditState",
        "setPicture",
        'windowMove',
        'setActiveWindow',
        "sendNewChat",
        "createGroupChatMessage",
        "setModalState"
      ]),
      openUserInfo(item){
        if(this.getUserId == item.uid){
          Message({
            message:'不能查看自己',
            type:"warning",
            showClose:true
          })
          return
        }
        if(this.friendsListStore.groupChatInfoList.data.is_add == 1 || this.isManagement || this.isBoss){
          this.getGroupUserInfoAction({self_uid:this.getUserId,friend_uid:item.uid,group_id:this.friendsListStore.groupChatInfoList.data.group_id}).then((res)=>{
            this.setModalState('groupUserInfoState')
          })
        }else{
          Message({
            message:'群主已经开启群员不能加好友',
            type:"warning",
            showClose:true
          })
        }
      },
      send(){

        let data = this.friendsListStore.groupChatInfoList.data
        this.createGroupChatMessage({id:data.group_id})
        let fromMessage = {
          id:data.group_id,
          name:data.group_name,
          count:data.count,
          head_portrait:data.group_cover,
          remarks_name:'',
        }


        this.sendNewChat({message:fromMessage,type:2,state:true})

      }

    }
  }
</script>

<style lang="less" scoped>
.group-content{
  height: 400px;
  overflow-y: auto;
}
.groupList{
    width: 450px;
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
    li{
      position: relative;
      width: 60px;
      margin: 7px;
      text-align: center;
      p{
        text-align: center;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .qunz-icon2{
        position: absolute;
        width: 20px;
        height: 20px;
        top: -6px;
        right: -6px;
      }
    }
  }
  .send {
    text-align: center;
    height: 36px;
    position: absolute;
    bottom: 35px;
    left: 50%;
    transform: translate(-50%, -50%);
    p{
      width: 140px;
      line-height: 36px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      border-radius: 2px;
      background-color: #1aad19;
    }
    p:hover {
      background: rgb(18,150,17);
    }
  }
  .Info-wrapper {
    position: relative;
    height: 100%;
    .info-more {
      position: absolute;
      right: 30px;
      top:10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .newfriend {
    height: 60px;
    padding: 28px 0 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    .nickname {
      font-size: 18px;
    }
  }
  .noneData{
    text-align: center;
    font-size: 14px;
    line-height: 100px;
  }
</style>

