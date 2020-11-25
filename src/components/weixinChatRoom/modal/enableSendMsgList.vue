<template>
    <div>
        <transition>
            <div class="look-new-friend-modal">
                <div class="look-new-friend-head">
                    <i class="el-icon-close"  @click="setModalState('enableSendState')"></i>
                    禁言列表
                </div>

                <div class="look-new-friend-detail flex" v-for="(item,index) in chatListStore.forbiddenUserList.data" :key="index" v-if="chatListStore.forbiddenUserList.data.length>0">
                    <div class="flex-l">
                        <img v-lazy="item.head_portrait || moren" alt="" class="avatar">
                        <div class="look-new-friend-user">
                            <div class="look-new-friend-diqu"> {{item.nickname || '--'}}</div>
                            <!--<div class="look-new-friend-diqu">群昵称: {{item.user_group_name || '&#45;&#45;'}}</div>-->
                        </div>
                    </div>
                    <div class="canSendMsg" @click="canSendMsg(item)"> 解除禁言</div>
                </div>

                <div style="text-align: center;color: #999;line-height: 30px;" v-if="chatListStore.forbiddenUserList.data.length == 0">
                    暂无数据
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
        "msgListStore",
      ]),
      ...mapGetters([
        'getUserId'
      ]),
      userDetail(){
        return this.chatListStore.groupUserInfoList
      }
    },
    watch: {

    },
    created () {
      this.getForbiddenUserList({self_uid:this.getUserId,group_id:this.msgListStore.activeWindowId});
    },
    mounted () {

    },
    methods:{
      ...mapActions([
        "addMyFriendAction",
        "getForbiddenUserList",
        "forbiddenUser"
      ]),
      //解除禁言
      async canSendMsg(data) {
        await this.forbiddenUser({
              self_uid: this.getUserId,
              group_id: this.msgListStore.activeWindowId,
              forbidden_uid: data.uid,
              status: 1
            })
         this.getForbiddenUserList({self_uid:this.getUserId,group_id:this.msgListStore.activeWindowId});
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
            padding: 5px 15px 5px 15px;
            border-bottom: 1px solid #eee;
            justify-content: space-between;
            &:last-of-type{
                border: none;
            }
            .flex-l{
                display: flex;
                justify-content: left;
            }
            .avatar{
                width: 30px;
                height: 30px;
                margin-top: 3px;
            }
            .canSendMsg{
                padding: 2px 5px;
                cursor: pointer;
                border: 1px solid green;
                color:green;
                transition:all .3s;
                &:hover{
                    color: #00dc41;
                    border-color: #00dc41;
                }
            }
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
                    font-size: 15px;
                    line-height: 40px;
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
