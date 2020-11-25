<!-- 搜索框 -->
<template>
  <div class="wrapper">
    <div class="search-wrapper" v-if="$route.name == 'chat'" style="padding: 0">
      <input type="text" class="searchInput" v-model="search" @keyup="change" placeholder="搜索"/>
      <i class="icon iconfont icon-search" v-show="noText"></i>
      <div class="searchInput-delete" v-show="haveText" @click="del"></div>
    </div>
    <div class="search-wrapper" v-if="$route.name == 'friend'" style="background-color: #E7E7E7;border: none;padding: 0">
      <select v-model="friendsListStore.friendPageSearchState">
        <option value="0">全部</option>
        <option value="1">群聊</option>
        <option value="2">客服</option>
        <option value="3">好友</option>
      </select>
      <input type="text" class="searchInput" v-model="friendsListStore.friendPageSearch" placeholder="搜索" style="margin-left: 5px;width: 100px;height: 26px"/>
    </div>
    <div class="add-user" @click.stop="setModalState('searchMoreState')" v-if="chatuserInfoStore.loginData.is_admin == 1">
      <div></div>
    </div>
    <transition name="showbox">
      <div class="more-option" v-if="chatListStore.searchMoreState" @click.stop="setModalState('searchMoreState')" >
        <div @click="setGroupNameVisible = true ; resetForm.newBuildGroupName = ''" class="point">
          <img src="../../../assets/weChat/chat_qunliao.png" alt=""><span>发起群聊</span>
        </div>
        <div @click="openAddFriendFn" class="point">
          <img src="../../../assets/weChat/add_friend_icon.png" alt=""> <span>添加朋友</span>
        </div>
        <div @click="upDataMessage" class="point">
          <img src="../../../assets/weChat/shuaxin.png" alt=""> <span>消息同步</span>
        </div>
      </div>
    </transition>
    <el-dialog
      title="设置群聊名称"
      :visible.sync="setGroupNameVisible"
      width="400px"
      center class="resetpwd-wrap">
      <div class="resetpwd-box">
        <el-form :model="resetForm" status-icon :rules="rules2" ref="resetForm" class="demo-ruleForm">
          <el-form-item label="群聊名称：" prop="newBuildGroupName">
            <el-input type="text" v-model="resetForm.newBuildGroupName"  placeholder="请输入群聊名称"></el-input>
          </el-form-item>

          <el-form-item class="footer">
            <el-button @click="setGroupNameVisible = false">取 消</el-button>
            <el-button type="primary" @click="resetName('resetForm')" style="margin-left: 30px;">下一步</el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions ,mapGetters ,mapMutations } from 'vuex'
  import { Loading,Message,MessageBox} from 'element-ui';
  import moren from '../../../assets/weChat/default_avatar.png'
  export default {

    data () {
      var validateGroup = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入群聊名称！'));
        }else if(value.length < 1 || value.length > 12) {
          callback(new Error('群名必须1至12个字符！'));
        }else {
          callback();
        }
      };
      return {
        moren:moren,
        search: '',
        friendSearch:'',
        active: false,
        showAddContact:false,
//        添加好友id
        friendList:[],
        setGroupNameVisible:false,
        resetForm:{
          newBuildGroupName:'',
        }, // 群聊名称
        rules2: {
          newBuildGroupName: [
            { validator: validateGroup, trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      upDataMessage(){
        this.getCustomerServiceAction()
      },
      checkLength(v){
        let t =v.replace(/[\u4e00-\u9fa5]/g,'');//替换中文
        return (v.length-t.length)*2+t.length<=24;//判断长度
      },
      resetName(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setGroupNameVisible = false
            this.setNewBuildGroupName(this.resetForm.newBuildGroupName)
            this.setModalState('AddContactState')
            this.setIsAddUser(false)

          }else {
            return false;
          }
        })

      },


      openAddFriendFn(){
        this.setModalState('AddFriendState')
        this.chatListStore.SearchFriendList.data = {}
      },
      openQunliao(){

      },

      change () {
        this.searchUser(this.search)
      },
      del () {
        this.search= ''
        this.change()
      },
      ...mapMutations([
        "setModalState",
        "setIsAddUser",
        "setNewBuildGroupName",
      ]),
      ...mapActions([
        'searchUser',
        'searchFriendListAction',
        'addMyFriendAction',
        'getFriendInfoAction',
        'getFriendList',
        'getGroupChatList',
        "getCustomerServiceAction"
      ]),
    },
    computed: {
      ...mapState([
        'chatListStore',
        "chatuserInfoStore",
        'friendsListStore'
      ]),
      ...mapGetters([
        'getUserId'
      ]),

      noText () {
        if(this.search  === '') return true
        return false
      },
      haveText () {
        if(this.search  === '') return false
        return true
      },


    },
    created() {
      this.getGroupChatList({ self_uid:this.getUserId }) //获取群聊列表
    }
  }
</script>

<style lang="less" scoped>
  .wrapper {
    position: relative;
    display: flex;
    padding: 22px 12px 12px 12px;
    height: 60px;
    .more-option {
      position: absolute;
      top:60px;
      right: 7px;
      width: 120px;
      height: 135px;
      background-color: #2C2B2B;
      z-index: 10;
      border-radius: 5px;
      font-size:15px;
      /*overflow:hidden;*/
      color:#fff;
      &:before{
         content: " ";
         position: absolute;
         bottom: 100%;
         right: 12px;
         border: 6px solid transparent;
         border-bottom-color: #2C2B2B;
       }
      >div {
           line-height: 45px;
           color:#8C8C8C;
           border-top-left-radius: 5px ;
           border-top-right-radius: 5px ;
          &:nth-child(2) {
             border-bottom-left-radius: 5px ;
             border-bottom-right-radius: 5px ;
           }
          img {
            width: 20px;
            height: 20px;
            margin: 0 8px;
          }
          &:hover {
            background-color: #323132;
           }
       }
      &.showbox-enter-active, &.showbox-leave-active {
                                 transition: all .5s;
                               }
      &.showbox-enter,&.showbox-leave-active {
                         opacity: 0;
                       }
    }
    .add-user{
      width: 25px;
      height: 25px;
      background-color: #DCD9D8;
      border-radius: 4px;
      position: absolute;
      right: 15px;
      div{
        width: 16px;
        height: 16px;
        background-image: url('../../../assets/weChat/add.png');
        background-size: 16px 16px;
        background-repeat: no-repeat;
        margin: auto;
        margin-top: 5px;
      }
    }
    .search-wrapper {
      position: relative;
      display: flex;
      box-sizing: border-box;
      height: 26px;
      width:84%;
      background-color: #DBD9D8;
      border: 1px solid #d9d7d6;
      border-radius: 4px;
      select {
        display: inline-block;
        background-color: #DBD9D8;
        border: 1px solid #d9d7d6;
        border-radius: 4px;
        width: 50px;
        -webkit-appearance: listbox;
      }
    }
    .searchInput {
      flex: 1;
      font-size: 12px;
      padding: 6px;
      background-color: #DBD9D8;
      outline: none;
      border-radius: 4px;
      &:focus{
        background-color: #f2efee;
      }
    }
    .icon-search {
      display: inline-block;
      width: 24px;
      height: 24px;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
    }
    .searchInput-delete {
      display: block;
      position: absolute;
      outline: none;
      top: 0;
      right: 0;
      width: 24px;
      height: 100%;
      background-image: url('../../../assets/weChat/delete.png');
      background-size: 26px;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    }

  }
</style>
