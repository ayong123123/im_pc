<template>
  <div>
    <!--添加朋友-->
    <transition name="showbox">
      <div class="add-friend-box">
        <div class="friend-box-header">
          添加朋友
          <i class="icon-set" @click="setModalState('AddFriendState')"></i>
        </div>
        <div class="search-input">
          <input type="text" placeholder="请输入用户名" v-model="searchParam">
          <div @click="searchUserFn">
            <i class="icon iconfont icon-search"></i>
          </div>
        </div>
        <p>我的账号：{{chatuserInfoStore.loginData.username}}</p>
        <div class="search-yes-user">
          <p>搜索结果</p>
          <div class="search-alluser">
            <div class="flex-between search-alluser-item" v-for="(u,index) in chatListStore.SearchFriendList.data">
              <div :class="{'offline':u.online == 0}">
                <img :src="u.head_portrait || moren" alt="">
                {{u.nickname}}
              </div>
              <div class="search-friend-option">
                <span class="color-gray" v-if="u.is_friend == 1">已添加</span>
                <span @click="openMsgModal(u.id)" v-else-if="u.is_friend == 0" class="add-active point">添加</span>
                <span class="color-gray" v-else="u.have_add == 1">已申请</span>
                <span class="check-active point" @click="openNewFriendFn(u)">查看</span>
              </div>
            </div>
          </div>

        </div>
        <transition>
          <div class="look-new-friend" v-if="openNewFriendModal">
            <div class="look-new-friend-head">
              <i class="el-icon-arrow-left" @click="openNewFriendModal = false"></i>
              用户详情
            </div>
            <div class="look-new-friend-detail flex">
              <img :src="userDetail.head_portrait || moren" alt="">
              <div class="look-new-friend-user">
                <div class="look-new-friend-name">
                  {{userDetail.remarks_name || userDetail.nickname}}
                  <img src="@/assets/weChat/woman.png" width="12" alt="" v-if="userDetail.sex == 2">
                  <img src="@/assets/weChat/man.png" width="12"  alt="" v-else>
                </div>
                <div class="look-new-friend-diqu">昵&nbsp;&nbsp;&nbsp;称: {{userDetail.nickname || '--'}}</div>
                <div class="look-new-friend-diqu">用户名: {{userDetail.username || '--'}}</div>
                <!--<div class="look-new-friend-diqu">地&nbsp;&nbsp;&nbsp;区: {{userDetail.region || '&#45;&#45;'}}</div>-->
              </div>
            </div>
            <div class="friend-other-message">
              <!--<div class="other-message-item flex">-->
                <!--<span class="flex-shrink0">手机号</span>-->
                <!--<div class="color-phone">-->
                  <!--{{userDetail.phone}}-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="other-message-item flex">-->
                <!--<span class="flex-shrink0">个性签名</span>-->
                <!--<div>-->
                  <!--{{userDetail.signature}}-->
                <!--</div>-->
              <!--</div>-->
            </div>
            <div class="other-message-select" v-if="userDetail.is_friend == 1" @click="sendChat">
              <img src="@/assets/weChat/send_message_icon.png" width="24" alt="">发消息
            </div>
            <div class="other-message-select" v-else @click="openMsgModal(userDetail.id)">
              添加好友
            </div>
          </div>
        </transition>
      </div>

    </transition>
    <el-dialog
      title="验证消息"
      :visible.sync="addMsgModal"
      width="400px"
      center class="add_f_msg">
      <el-form  status-icon  ref="setPassForm" class="demo-ruleForm">
        <el-form-item label="朋友验证(选填):">
          <el-input type="text" v-model="applyMsg"  placeholder="请输入好友申请消息"></el-input>
        </el-form-item>
        <el-form-item class="footer" style="text-align: right">
          <el-button @click="addMsgModal =false">取 消</el-button>
          <el-button  type="primary" @click="addForFriendFn()" style="margin-left: 30px;">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
        openNewFriendModal:false, // 查看朋友详情模块
        searchParam:'',
        userDetail:{},
        moren:moren,
        addMsgModal:false,
        applyMsg:'',
        f_id:'',

      }
    },
    computed:{
      ...mapState([
        'chatListStore',
        "chatuserInfoStore",
        'friendsListStore',
        "msgListStore"
      ]),
      ...mapGetters([
        'getUserId'
      ]),
    },
    watch: {

    },
    created () {

    },
    mounted () {

    },
    methods:{
      ...mapActions(['getLastMessageAction']),
      ...mapMutations([
        'createFriendChatMessage',
        'sendNewChat'
      ]),

      openMsgModal(id){
        this.f_id = id
        this.applyMsg = ''
        this.addMsgModal = true;
      },
      sendChat(){
        // console.log('userDetail',this.userDetail)

        this.setModalState('AddFriendState')
        this.createFriendChatMessage({id:this.userDetail.id})

        this.setActiveWindow({id:this.userDetail.id,type:this.userDetail.chatType || 1,name: this.userDetail.nickname ,head_portrait:this.userDetail.head_portrait})
        //            向下拉取最新历史,
        if(this.userDetail.chatType == 1){
          // 无记录 拉取最新记录
          this.getLastMessageAction({send_uid:this.getUserId,accept_uid:this.userDetail.id})
                  .then(res=>{
                    let fromMessage = {
                      id:this.userDetail.id,
                      name:this.userDetail.nickname,
                      count:0,
                      head_portrait:this.userDetail.head_portrait,
                      remarks_name:this.userDetail.remarks_name,
                    }
                    this.sendNewChat({message:fromMessage,type:1,state:true})
                  })
        }

      },
      openNewFriendFn(item){
        this.userDetail = {}
        this.getFriendInfoAction({self_uid:this.getUserId,friend_uid:item.id}).then((data)=>{
          this.userDetail = data;
          this.userDetail.chatType =1;
          this.openNewFriendModal = true
        })
      },
      //      搜索好友
      searchUserFn(){
        let data = {
          uid:this.getUserId,
          searchParam:this.searchParam,
        }
        this.searchFriendListAction(data)
      },
      addForFriendFn(){
        this.addMyFriendAction({
          self_uid:this.getUserId,
          friend_uid:this.f_id,
          agree:0,
          searchParam:this.searchParam,
          add_msg:this.applyMsg,
        }).then(()=>{
          this.addMsgModal = false
        })

      },
      ...mapActions([
        "getFriendInfoAction",
        'searchFriendListAction',
        'addMyFriendAction',
        "sendMessageIM",
      ]),
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
  .add-friend-box {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 375px;
    height: 500px;
    background-color: #e6e6e6;
    border: 1px solid #d1d1d1;
    border-radius: 2px;
    z-index:122;

  .friend-box-header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align:center;
    color:#333;
    font-size:15px;
    background-color: #fff;
    .icon-set{
      width: 40px;
      height: 40px;
      background: url('../../../assets/weChat/close.png') no-repeat;
      background-size: 20px 20px;
      display: inline-block;
      background-position: center center;
      position: absolute;
      right: 0;
      cursor: pointer;
    }
  }
  .search-input {
    width: 100%;
    display:flex;
    margin-top:12px;
  input {
    flex: 1;
    height: 48px;
    padding:0 10px;
    font-size: 14px;
  }
  div {
    background-color: #fff;
    width: 50px;
    height: 48px;
    text-align: center;

  .icon-search{
    color:#1aad19;
    font-size: 24px;
    line-height: 48px;
  }
  }
  }
  > p {
      line-height: 30px;
      color:#222;
      font-size: 13px;
      text-align: center;
    }
  .search-yes-user {
    background-color: #fff;
    padding: 10px  0 0 10px;

  .search-alluser {
    height: 345px;
    overflow:auto;
  .search-alluser-item{

    padding: 8px 5px;
    display:flex;
    line-height:40px;
    color:#000;
    font-size:14px;
    border-bottom: 1px solid #e7e7e7;
    >div {
      &.offline{
        >img{
          -webkit-filter: grayscale(95%);
          -moz-filter: grayscale(95%);
          -ms-filter: grayscale(95%);
          -o-filter: grayscale(95%);
          filter: grayscale(95%);
          filter: gray;
        }
      }
    }
  img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    margin-right: 15px;
  }
  .search-friend-option {
    position: relative;
  span {
    display: inline-block;
    width: 50px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 3px;
  &.add-active {
     background-color: #1aad19;
     color:#fff;
   }
  }

  }

  }
  }

  p{
    border-bottom: 1px solid #e7e7e7;
  }

  }
  .search-no-user {
    background-color: #fff;
    text-align: center;
    color:#7e8c8d;
    font-size: 15px;
    line-height: 60px;
  }
  .look-new-friend {
    width: 375px;
    height: 502px;
    position: absolute;
    top:0;
    right:0;
    background-color: #fff;
    /*border: 1px solid #e7e7e7;*/
    -webkit-box-shadow: 0 1px 2px 1px #d1d1d1;
    box-shadow: 0 1px 2px 1px #d1d1d1;
    z-index: 120;
    text-align: center;
  .look-new-friend-head {
    height: 40px;
    font-size: 17px;
    color:#000;
    line-height: 40px;
  i {
    float: left;
    margin-top: 8px;
    margin-left: 8px;
    font-size: 20px;
  }
  }
  .look-new-friend-detail {
    padding: 5px 0 5px 5px;
    margin-left: 20px;
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
    font-size: 13px;

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
    border-bottom: 1px solid #e5e5e5;
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

  }
</style>
