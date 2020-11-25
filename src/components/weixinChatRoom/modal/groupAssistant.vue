<template>
  <div class="assistant">
    <div class="head_assistant">
      <img src="@/assets/weChat/close.png" alt="" @click="setModalState('groupZhuShou')">
      <span>群助手</span>
    </div>
    <div class="notice-list">
      <p>
        验证消息
      </p>
      <ul>
        <li class="flex" v-for="i in friendsListStore.joinApplyList.data"  @click="openInfo(i)">
          <div class="g_img">
            <img :src="i.pic_attr" alt="">
          </div>
          <div class="g_msg flex-1 flex-between">
            <div>
              <b>{{i.nickname}}</b>
              <div class="long-text">申请加入 <span style="color:#ff0000;">{{i.group_name}}</span> </div>
              <p class="long-text">{{i.apply_msg}}</p>
            </div>
            <div>
              <span class="agree" v-if="i.status == 1" @click.stop="agreeJoinFn(i)">同意</span>
              <span class="jujue" v-if="i.status == 1" @click.stop="stopJoinFn(i)">拒绝</span>
              <span class="" v-if="i.status == 2">已同意</span>
              <span style="color: #ff0000;" v-if="i.status == 3">已拒绝</span>
            </div>
          </div>

        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import { Message,MessageBox} from 'element-ui';
  import _config from '@/configWX/configWX'
  export default {
    data () {
      return {
        config:_config,
      }
    },
    computed:{
      ...mapState([
        "chatListStore",
        "msgListStore",
        "indexStore",
        "friendsListStore",
        "chatuserInfoStore"
      ]),
      ...mapGetters([
        "getUserId"
      ]),

    },
    watch: {

    },
    created () {
      this.getJoinApplyListAction({self_uid:this.getUserId})
    },
    mounted () {

    },
    methods:{
      ...mapActions([
      "getJoinApplyListAction",
        "joinApplyAgreeAction",
        "sendMessageIM",
        "getFriendInfoAction"
      ]),
      ...mapMutations([
        "setModalState"
      ]),
      openInfo(item){
        this.getFriendInfoAction({self_uid:this.getUserId,friend_uid:item.uid}).then((res)=>{
          this.setModalState('userInfoState')
        })
      },
      agreeJoinFn(i){
        let post = {
          apply_id:i.uid,
          uid:this.getUserId,
          group_id:i.group_id,
          status:2,
        }
        this.joinApplyAgreeAction(post).then(()=>{
          let data = {
            to: this.friendsListStore.groupChatInfoList.data.group_id,
            message:this.chatuserInfoStore.dataGetInfo.nickname + ' 邀请 ' + i.nickname + ' 加入了群聊',
            type:_config.MSG_GROUP_INGROUP,
            reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
          }
          let findGroup = {}
          findGroup.groupName = this.friendsListStore.groupChatInfoList.data.group_name
          findGroup.count = this.friendsListStore.groupChatInfoList.data.count
          data.groupinfo = findGroup
          this.sendMessageIM(data)
          this.getJoinApplyListAction({self_uid:this.getUserId})
        })
      },
      stopJoinFn(i){
        let post = {
          apply_id:i.uid,
          uid:this.getUserId,
          group_id:i.group_id,
          status:3,
        }
        this.joinApplyAgreeAction(post).then(()=>{
          this.getJoinApplyListAction({self_uid:this.getUserId})
        })
      },

    },


  }
</script>
<style lang="less" scoped>
  .assistant {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 120;
    width: 400px;
    background-color: #EDEDED;
    border-radius: 5px;
    overflow: hidden;
    font-size: 14px;
    .head_assistant {
      height: 40px;
      line-height:40px;
      background-color: #EDEDED;
      text-align: center;

      color:#000;
      img{
        position: absolute;
        top: 5px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }
    .notice-list{
      height: 450px;
      padding: 5px 0;
      overflow: auto;
      font-size: 13px;
      color:#333;
      cursor: pointer;
      >p{
        line-height: 30px;
        background-color: #fff;
        color: #999;
        padding-left: 15px;
      }
      ul {
        border-top:1px solid #e0e0e0;
        border-bottom:1px solid #e0e0e0;
        li{
          .g_img {
            padding: 5px;
            img {
              width: 45px;
              height: 45px;
              border-radius: 50%;

            }
          }
          .g_msg {
            padding: 5px 10px;
            border-bottom: 1px solid #e0e0e0;
            line-height: 20px;
            p{
              font-size: 12px;
              color:#777;
            }
            .agree {
              padding: 6px 10px;
              background-color: #00dc41;
              color: #fff;
              border-radius: 18px;
              cursor: pointer;
            }
            .jujue {
              padding: 6px 10px;
              background-color: #e0e0e0;
              color: #ff0000;
              border-radius: 18px;
              cursor: pointer;
            }
          }
          &:last-child {
            .g_msg {
              border-bottom:none;
            }
          }
        }
      }
    }
  }

</style>
