<template>
    <div>
        <transition>
            <div class="look-new-friend-modal">
                <div class="look-new-friend-head">
                    <a href="javascript:;" @click="historySwitch = false;historyMsgLoading = true" v-if="historySwitch" class="goback">返回上一级</a>
                    <i class="el-icon-close"  @click="setModalState('searchRecord')"></i>
                    搜索本地聊天记录
                </div>

                <div style="height: 100%;" v-if="!historySwitch">
                    <div class="search-wrapper">
                        <el-input type="text" v-model="searchText" placeholder="搜索内容" @keyup.enter.native="onKeyup"></el-input>
                        <el-button type="primary" size="small" @click="SearchRecord()" >搜索</el-button>
                    </div>


                    <div class="search-details" v-if="friendsListStore.historyMessage.data">
                        <p class="title">聊天记录查询</p>
                        <div class="look-new-friend-detail flex" v-for="(item,index) in friendsListStore.historyMessage.data" :key="index" @click="goHistoryMsg(item)">
                            <div class="flex-l">
                                <img v-lazy="item.head_portrait || moren" alt="" class="avatar" v-if="msgListStore.activeTyep * 1 == 2">
                                <img v-lazy="selectedChat.user.img || moren" alt="" v-else class="avatar">
                                <div class="look-new-friend-user">
                                    <div class="look-new-friend-diqu top">
                                        <p class="nikename" v-if="msgListStore.activeTyep * 1 == 2">
                                            {{item.username}}
                                        </p>
                                        <p class="nikename" v-else>{{selectedChat.user.remarks_name || selectedChat.user.name}}</p>

                                        <p>{{getTimes(item.create_time)}}</p>
                                    </div>

                                    <div class="bottom" v-html="keywordscolorful(item.content)"></div>
                                </div>
                            </div>
                            <img src="@/assets/weChat/right_icon.png" alt="" width=""  class="go"/>
                            <!--<div class="canSendMsg" @click="canSendMsg(item)"> 解除禁言</div>-->
                        </div>
                    </div>


                    <div style="text-align: center;color: #999;line-height: 30px;" v-else>
                        请输入要搜索的内容
                    </div>
                </div>

                <div
                         style="position: absolute;top:200px;width: 100%;"
                         v-if="historySwitch"
                         v-loading="historyMsgLoading"
                         element-loading-text="拼命加载中"
                         element-loading-spinner="el-icon-loading"
                         element-loading-background="rgba(0, 0, 0, 0.8)"></div>
                <div class="history-wrapper"
                     ref="list"
                     id="chat-list"
                     v-if="friendsListStore.historyMessageData.data && historySwitch">
                    <ul>
                        <li class="history-item"
                            v-for="(item,index) in friendsListStore.historyMessageData.data"
                            :class="{ self: item.userMsg || item.send_uid == getUserId,
                            clickRef:friendsListStore.clickContent.content == item.content && friendsListStore.clickContent.unique_value == item.unique_value}"
                            :data-info="item.unique_value"
                        >
                            <img class="avatar" width="36" height="36" v-lazy="item.head_portrait" v-if="item.head_portrait" />
                            <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="item.send_uid == getUserId"/>
                            <img class="avatar" width="36" height="36" v-lazy="selectedChat.user.img" v-else />

                            <div class="content_wrapper">
                                <div class="title_time">
                                    <span class="username">{{item.username}}</span>
                                    <span>{{getTimes(item.create_time)}}</span>
                                </div>
                                <div class="content"
                                     :style="friendsListStore.clickContent.content == item.content && friendsListStore.clickContent.unique_value == item.unique_value ? {'color':'red'}:''">{{item.content}}</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="text11">121212</div>
            </div>
        </transition>
    </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import { Loading,Message,MessageBox} from 'element-ui';
  import {getTimes,getTimesYueRi1} from '@/common/common'
  import moren from '../../../assets/weChat/default_avatar.png'

  export default {
    data () {
      return {
        moren:moren,
        searchText:"",
        getTimes:getTimes,
        historySwitch:false,
        historyMsgLoading:true,
        singleInfo:{
          img:'',
          name:'',
          remarks_name:''
        }
      }
    },
    computed:{
      ...mapState([
        'chatListStore',
        "friendsListStore",
        "msgListStore",
        "chatuserInfoStore"
      ]),
      ...mapGetters([
        'getUserId',
        'selectedChat',
      ]),
    },
    watch: {
      "historyMsgLoading"(n,o) {
        // this.scrollTo()
      }
    },
    created () {
      // console.log(this.selectedChat)

      this.singleInfo =this.selectedChat.user
    },
    mounted () {

    },
    beforeDestroy() {
      //清空历史记录
      this.setHistoryMessage('')
      this.setHistoryMessageData('')
      this.historySwitch =false;
      this.historyMsgLoading = true
    },
    methods:{
      ...mapActions([
        "addMyFriendAction",
        "getForbiddenUserList",
        "forbiddenUser",
        "getHistoryMessageAction",
        "getSingleHistoryMessageAction"
      ]),
      ...mapMutations([
        "setModalState",
        "setHistoryMessage",
        "setHistoryMessageData",
        "setAnchorInfo",
        "setClickContent"
      ]),
      //滚动到置顶位置
     async scrollTo() {
       let textArr = []
       await this.$nextTick(() => {

              const scrollBox = document.querySelector('#chat-list')
              const ul = scrollBox.querySelector('ul')
              const lis = ul.querySelectorAll('li.message-item')
              // console.log(ul)
              for(let i = 0;i<lis.length;i++) {
                textArr.push( lis[i].querySelector('.texts .main .text'))
                // console.log(text.innerHTML)
                // return textArr
                // const textInnerHtml = text.querySelector()
                // console.log(textInnerHtml)
                // console.log(text)
                // console.log(this.friendsListStore.clickContent.content)
                // if(text.innerHTML == this.friendsListStore.clickContent.content ) {
                //   console.log(lis[i])
                // }
              }

          // scrollBox.scrollTo(lis.offsetTop/2,0)
            // this.$refs.list.scrollTop = lis.offsetTop
            this.$refs.list.scrollTop = lis.offsetTop
        })
     },
      // 按回车发送信息
      onKeyup (e) {
        if (!e.shiftKey && e.keyCode === 13) {
          this.SearchRecord()
          e.preventDefault()
          return false
        }
      },
      goHistoryMsg(item){ //设置锚点信息
        // console.log(item)
        this.setClickContent(item)
        this.setHistoryMessageData('');
        setTimeout(()=>{
          this.historySwitch = true
        },0)
        this.msgListStore.activeTyep * 1 == 1 ?
          this.getSingleHistoryMessageAction({
            friendId:this.selectedChat.id,
            keyword:"",
            time:item.create_time,
            judge:3
          }).then(res=>{
            this.historyMsgLoading = false;
          })
          : this.getHistoryMessageAction({
              groupId:this.msgListStore.activeWindowId,
              keyword:"",
              time:item.create_time,
              judge:3
            }).then(res=>{
              this.historyMsgLoading = false;
            })
      },

      SearchRecord() {
        this.msgListStore.activeTyep * 1 == 2 ?
        this.getHistoryMessageAction({groupId:this.msgListStore.activeWindowId,keyword:this.searchText})
          : this.getSingleHistoryMessageAction({ friendId:this.selectedChat.id, keyword:this.searchText})
      },
      // 匹配颜色高亮
      keywordscolorful(str, key= this.searchText){
        var reg = new RegExp("(" + key + ")", "g");
        var newstr = str.replace(reg, "<font style='background:#adf3ad;'>$1</font>");
        return newstr;
      }

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
        .search-wrapper{
            display: flex;
            justify-content: flex-start;
            padding: 10px;
            .el-input{
                width: 73%;
                height: 30px;
                .el-input__inner{
                    height: 30px;
                }
            }
            .el-button{
                width: 20%;
                margin-left: 5%;
            }
        }
        .search-details {
            height: 81%;
            overflow-y: auto;
            .title{
                padding-left: 10px;
                text-align: left;
            }
        }
        .history-wrapper{
            height: 92%;
            overflow-y: auto;
            width: 100%;
            padding: 10px;
            background-color: #eee;
            .history-item{
                text-align: left;
                margin-top: 20px;
                img{
                   display: inline-block;
                    float: left;
                }
                .content_wrapper{
                    margin-top: -5px;
                    margin-left: 5px;
                    display: inline-block;
                    width: 85%;
                    .content{
                        display: inline-block;
                        margin-left: 10px;
                        position: relative;
                        padding: 6px 10px;
                        max-width: 260px;
                        min-height: 36px;
                        line-height: 24px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        font-size: 14px;
                        text-align: left;
                        word-break: break-all;
                        word-wrap: break-word;
                        background-color: #fff;
                        border-radius: 4px;
                        color: #333;
                        &::before{
                            content:"";
                            position: absolute;
                            top: 12px;
                            right: 100%;
                            border: 6px solid transparent;
                            border-right-color: #fff;
                        }
                    }
                }
                &.self{
                   text-align: right;
                    img{
                        text-align: right;
                        float: right;
                    }
                    .content_wrapper{
                        margin-right:5px;
                        .content{
                            background-color: #9eea6a;
                            margin-right: 10px;
                            margin-left: 0;
                            &::before{
                                content: "";
                                position: absolute;
                                top: 12px;
                                left: 100%;
                                border: 6px solid transparent;
                                border-left-color: #9eea6a;
                            }
                        }
                        .title_time{
                            .username{
                                float: right;
                                margin-left: 5px;
                            }
                        }
                    }
                }
            }
        }
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
            .goback{
                position: absolute;
                left: 8px;
                top:0;
            }
        }
        .look-new-friend-detail {
            padding: 5px 15px 5px 15px;
            border-bottom: 1px solid #eee;
            justify-content: space-between;
            cursor: pointer;
            &:last-of-type{
                border: none;
            }
            .flex-l{
                display: flex;
                justify-content: left;
                width: 90%;
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
                width: 84%;
                .top{
                    display: flex;
                    justify-content: space-between;
                    .nikename{
                        width: 46%;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                    }
                }
                .bottom{
                    width: 99%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                }


            }
            .go{
                width: 30px;
                height: 31px;
            }
            /*img {*/
                /*border-radius: 5px;*/
                /*width: 50px;*/
                /*height: 50px;*/
            /*}*/
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
