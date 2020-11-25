<template>
  <div>
    <!--新建群聊-->
    <transition name="showbox">
      <div class="new-adduser-Box">
        <div class="left-content">
          <!-- <div class="search">
            <i class="iconfont icon-sousuo icon"></i>
            <input type="text" :class="[ addSearchData.isChange ? 'change' :'']"
                   :placeholder="addSearchData.isChange? '':'搜索'"
                   v-model="addSearchData.searchVal" @focus="addSearchData.isChange = true"
                   @blur="addSearchData.isChange = false">
          </div> -->
          <div class="search ">
            <input type="text" placeholder="请输入" v-model="newGroupSearchText">

          </div>
          <div class="friend-list" id="friends">

            <div class="list" v-for="(item,index) in groupUserList" :key="index">
              <div class="sort-letter" v-if="item[0].initials">{{item[0].initials}}</div>
              <ul class="friends" v-for="(vv,i) in item" :key="i">
                <li @click="selectAdd(vv,item)" :class="vv.isChecked ? 'on':''">
                  <div class="lf-content">
                    <div class="avatar"><img v-lazy="vv.head_portrait || moren" alt=""></div>
                    <p class="name">{{vv.remarks_name || vv.nickname}}</p>
                  </div>
                  <i :class="['iconfont',vv.isChecked ? 'icon-xuanze select':'icon-weixuanze',]"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right-content">
          <i class="iconfont icon-guanbi closed-right-content" @click="closeBuildGroup()"></i>
          <p class="title">请勾选需要添加的联系人</p>
          <ul class="waitAdd-box">
            <li v-for="(item,index) in addList" :key="index">
              <div class="lf-content">
                <div class="avatar"><img v-lazy="item.head_portrait || moren" alt=""></div>
                <p class="name">{{item.remarks_name || item.nickname}}</p>
              </div>
              <i class="iconfont icon-shanchu" @click="selectDelete(item)"></i>
            </li>
          </ul>

          <div class="btn-box">
            <div></div>
            <div class="btn">
              <button :class="['sure',addList.length < 1 ? 'canadd':'']" @click="sureAdd">确认</button>
              <button class="cancel" @click="closeBuildGroup()">取消</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import { Loading,Message,MessageBox} from 'element-ui';
  import _config from '../../../configWX/configWX'
  import moren from '../../../assets/weChat/default_avatar.png'
  export default {
    data () {
      return {
        addSearchData:{
          searchVal:'',
          placeVal:'搜索',
          isChange:false
        },
        moren:moren,
        addList:[],
        newGroupSearchText:'',
      }
    },
    computed: {
      ...mapState([
        'friendsListStore',
        "chatListStore",
        "indexStore",
        "chatuserInfoStore"
      ]),
      ...mapGetters([
          'getUserId'
      ]),
      groupUserList(){
        let newArray = []
        let arrIndex = 0
        this.friendsListStore.goodFriendList.forEach((now,index)=>{
          let arr = now.filter((item) => {
            return item.remarks_name ? item.remarks_name.includes(this.newGroupSearchText) : item.nickname.includes(this.newGroupSearchText)
          })
          if(arr.length > 0){
            newArray[arrIndex] = arr
            arrIndex++
          }
        })
        return newArray
      }

    },
    watch: {},
    created () {
      this.addList = []
      this.getFriendList({self_uid:this.getUserId});
      this.newGroupSearchText = ''
    },
    mounted () {

    },
    methods: {
      ...mapActions([
          'getFriendList',
          'getGroupChatList',
          'firstAddGroupChat',
          'getGroupChatInfoAction',
        'sendMessageIM',
        "addManyGroupChat"

      ]),
      ...mapMutations([
          'setModalState',
        "setIsAddUser",
      ]),
      closeBuildGroup(){
        this.setIsAddUser(false)
        this.setModalState('AddContactState')
        this.getFriendList({self_uid:this.getUserId});
      },
      selectAdd(data,item) {//添加

        data.isChecked = !data.isChecked;
        if(data.isChecked) {
          this.addList.push(data);
        }else {
          this.addList.map((v,i)=>{if(v.id == data.id) this.addList.splice(i,1)})
        }
      },
      selectDelete(data) {//删除
        this.addList.map((v,i)=>{if(v.id == data.id) this.addList.splice(i,1)});
        this.friendsListStore.goodFriendList.map((item,index)=>{item.map((v,i)=>{if(v.id == data.id ) v.isChecked = false;}) });
      },
      //确认
      sureAdd() {
        if(this.addList.length == 0){
          Message({
            message:'请选择好友',
            type:"warning",
            showClose:true
          })
          return
        }
        if(!this.friendsListStore.isAddUser && this.addList.length<2) {
          Message({
            message:'请选择超过两个好友',
            type:"warning",
            showClose:true
          })
          return
        }

        let arr = [];
        var names = []
        this.addList.map(item=>{
            arr.push(item.id)
        })
        this.addList.map(item=>{
          names.push(item.nickname)
        })
        var params = {
          self_uid:this.getUserId,
          friend_uid:arr.join(","),
        }
//        如果是给群增加人员
        if(this.friendsListStore.isAddUser){
          params.group_id = this.friendsListStore.GroupChatId
          this.addManyGroupChat(params).then((res)=>{
            this.getGroupChatList({self_uid:this.getUserId})
            this.setModalState('AddContactState');
              this.getGroupChatInfoAction({self_uid:this.getUserId,group_id:this.friendsListStore.GroupChatId})
              let data = {
                to:this.friendsListStore.GroupChatId,
                message:this.chatuserInfoStore.dataGetInfo.nickname + ' 邀请 ' + names.join(",") + ' 加入了群聊',
                type:_config.MSG_GROUP_INGROUP,
                reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
              }
              this.sendMessageIM(data)
          })

        }else{
          params.group_name = this.chatListStore.newBuildGroupName
          this.firstAddGroupChat(params).then((res)=>{
            this.getGroupChatList({self_uid:this.getUserId})
            this.setModalState('AddContactState');
          })

        }



      },
    },
  }
</script>
<style lang="less" scoped>
  .new-adduser-Box {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    top: 0px;
    left: 0px;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 500px;
    height: 500px;
    /*padding: 5px;*/
    background-color: #fff;
    border: 1px solid #d1d1d1;
    border-radius: 2px;
    box-shadow: 0 1px 2px 1px #d1d1d1;
    z-index: 112;

    &.showbox-enter-active,

    &.showbox-leave-active {
      transition: all .5s;
    }

    &.showbox-enter,

    &.showbox-leave-active {
      opacity: 0;
    }

    .left-content {
      width: 52%;
      border-right: 1px solid #e5e5e5;

    .search {
      position: relative;
      margin: 8px;

        input {
          background: #e7e7e7;
          width: 100%;
          height: 25px;
          text-indent: 25px;
          line-height: 25px;
          border-radius: 3px;
        }
        button {
          background-color: #1aad19;
          border-radius: 3px;
          padding: 3px 10px;
          color:#fff;
          margin-left: 5px;
        }

      }
      .friend-list {
        height: 450px;
        border-top: 1px solid #e7e7e7;
        overflow-y: auto;

        .sort-letter {
          margin: 5px 20px;
          font-size: 14px;
          color: #999;
          line-height: 1;
        }

        .friends {

            li {
              display: flex;
              justify-content: space-between;
              padding: 10px 20px;
              font-size: 16px;
              color: #333;
              width: 100%;

                .lf-content {
                  display: flex;
                  justify-content: flex-start;

                  .avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 3px;
                    border: 1px solid #c4c4c4;

                      img {
                        width: 100%;
                        height: 100%;
                      }

                  }
                  .name {
                    margin-left: 10px;
                    max-width: 150px;
                    font-size: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                  }

                }
                i {
                  cursor: pointer;
                  font-size: 20px;
                  color: #999999;
                }

            .select {
              color: #1aad19;
            }

            &:hover {
              background: #e7e7e7;
            }

            &.on {
              background: #d3d3d3;
            }

          }
        }
      }
    }
    .right-content {
      width: 48%;

    .closed-right-content {
      float: right;
      cursor: pointer;
      font-size: 14px;
      padding: 3px 10px;

      /*margin:5px 10px 0 0;*/
      &:hover {
        background: #1aad19;
        color: #fff;
      }

    }
    .title {
      font-size: 14px;
      color: #333;
      margin-top: 20px;
      padding: 10px 20px;
    }

      .waitAdd-box {
        width: 100%;
        height: 395px;
        overflow-y: auto;

          li {
            padding: 10px 20px;
            font-size: 16px;
            color: #666;
            display: flex;
            justify-content: space-between;

            .lf-content {
              display: flex;
              justify-content: flex-start;

              .avatar {
                width: 30px;
                height: 30px;
                border-radius: 3px;
                border: 1px solid #e7e7e7;

                img {
                  width: 100%;
                  height: 100%;
                }

              }
              .name {
                margin-left: 10px;
                max-width: 150px;
                white-space: nowrap;
                overflow: hidden;
              }

            }
            i {
              cursor: pointer;
              color: #c4c4c4;

            &:hover {
              color: #999999;
            }

          }
        }
      }
      .btn-box {
        display: flex;
        justify-content: space-between;

          .btn {
            padding: 5px 20px 0 0;

          button {
            padding: 4px 15px;
            /*background: #e7e7e7;*/
            color: #7c7c7c;
            cursor: pointer;
            border: 1px solid #e7e7e7;
          }

          .sure {
            margin-right: 10px;
            background: #1aad19;
            color: #fff;
            border-color: #1aad19;
          }

          .canadd {
            opacity: .5;
          }

        }
      }
    }
  }
</style>
