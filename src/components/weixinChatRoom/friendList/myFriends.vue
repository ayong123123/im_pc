<!-- 好友列表 -->
<template>
  <div>
    <div class="friendlist" :style="{'height':contentHeight}">
      <div class="frienditem noborder">
        <div class="list_title">新的朋友</div>
        <div class="friend-info" @click="addFiend()" :class="{ 'active': checkIndex == '-1' }">
          <img class="avatar"  width="36" height="36" src="@/assets/weChat/plugins_FriendNotify.png">
          <div class="remark">新的朋友</div>
        </div>
      </div>
      <div class="frienditem" v-if="friendsListStore.groupChatList.length >0">
        <div class="list_title flex-between" @click="setModalState('groupHidden')">
          群聊({{friendsListStore.groupChatList.length || 0}})
          <img src="@/assets/weChat/ic_down_red.png" alt="" width="20" v-if="chatListStore.groupHidden" />
          <img src="@/assets/weChat/ic_up_red.png" alt="" v-else width="20"/>
        </div>
        <ul class="frienditem" :class="{hidden:chatListStore.groupHidden}">
          <li
            v-for="(item, index) in getGroupChatList"
            :key="index"
            @click="getFlockDetail(item.id)">
            <div class="friend-info" :class="{ 'active': item.id == checkIndex }">
              <img v-lazy="item.group_cover" class="avatar"  width="36" height="36" >
              <div class="remark" :style="item.role == 1 ? {'color':'#CD7F32'} :''">
                {{item.name}}({{item.count}}人)
              </div>
              <img src="@/assets/weChat/qunzhu_icon.png" alt=""  v-show="item.role == 1" class="qunz-icon2">
              <img src="@/assets/weChat/guanliyuan_icon.png" alt=""  v-show="item.role == 2" class="qunz-icon2">

            </div>
          </li>
        </ul>
      </div>
      <div class="frienditem" v-if="friendsListStore.kefuList.length >0">
        <div class="list_title flex-between" @click="setModalState('kefuHidden')">
          客服({{friendsListStore.kefuList.length || 0}})
          <img src="@/assets/weChat/ic_down_red.png" alt="" width="20"  v-if="chatListStore.kefuHidden"/>
          <img src="@/assets/weChat/ic_up_red.png" alt="" v-else width="20"/>
        </div>
        <ul class="frienditem" :class="{hidden:chatListStore.kefuHidden}">
          <li
            v-for="(item, index) in getKefuList"
            :key="index"
            @click="getDetailInfo(item.id)" v-if="item.id != getUserId">
            <div class="friend-info" :class="{ 'active': item.id == checkIndexFrined }">
              <img v-lazy="item.head_portrait" class="avatar"  width="36" height="36" v-if="item.head_portrait">
              <img src="@/assets/weChat/group_chat.png" width="36" height="36" class="avatar" v-else>
              <div class="remark">
                <p >{{item.remarks_name || item.nickname}}</p>
                <p class="username-css">({{item.username}})</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="frienditem" v-if="friendsListStore.goodFriendList.length >0">
        <div class="list_title flex-between" @click="setModalState('friendHidden')">
          好友({{getFriendAllPeople || 0}})
          <img src="@/assets/weChat/ic_down_red.png" alt="" width="20" v-if="chatListStore.friendHidden" />
          <img src="@/assets/weChat/ic_up_red.png" alt="" v-else width="20"/>
        </div>
        <ul class="frienditem"  :class="{hidden:chatListStore.friendHidden}">
          <li
            :class="['frienditem']"
            v-for="(item, index) in getGoodFriendList"
            :key="index"
          >
            <div class="list_title" v-if="item[0].initials">{{item[0].initials}}</div>
            <div
              class="friend-info"
              :class="[{'active': i.id == checkIndexFrined },{'offline':i.online == 0}]"
              v-for="(i, key) in item"
              :key="key"
              @click="getDetailInfo(i.id)"
            >
              <img v-if="i.head_portrait" class="avatar"  width="36" height="36" v-lazy="i.head_portrait">
              <img v-else src="@/assets/weChat/default_avatar.png" width="36" height="36" class="avatar">
              <div class="remark">
                <p class="remarks_name">{{i.remarks_name}}</p>
                <p class="username-css">({{i.username}})</p>
              </div>
            </div>
          </li>

        </ul>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapState, mapActions ,mapGetters, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        checkIndex:'-1',
        checkIndexFrined:'',
        contentHeight:'',

      }
    },
    computed: {
      ...mapGetters([
        'getUserId',
        "getGroupChatList",
        "getKefuList",
        "getGoodFriendList",
        "getFriendAllPeople"
      ]),
      ...mapState([
        'chatListStore',
        'friendsListStore',
        'chatuserInfoStore'
      ]),
    },

    created() {
      this.setIsAddUser(false)
      this.setIsAddFriendState(false)
      this.getFriendList({self_uid: this.getUserId})
      this.getFriendkefuList({self_uid: this.getUserId})
      if(this.chatuserInfoStore.loginData.is_admin == 1){
        this.contentHeight = '590px'
      }else{
        this.contentHeight = '650px'
      }
    },
    methods: {
      ...mapMutations([
        'setFriendInfo',
        'selectFriend',
        "setIsAddUser",
        "setIsAddFriendState",
        "setModalState"
      ]),
      ...mapActions([
        'getFriendList',
        'getFriendInfoAction',
        'getGroupChatInfoAction',
        'addFriendList',
        "getFriendkefuList"
      ]),
      getDetailInfo (id) {
        this.checkIndexFrined = id
        this.checkIndex = ''
        this.$emit('leftData',0)
        // 设置当前选中好友的id
        this.selectFriend(id)
        // 默认设置为空
        this.setFriendInfo(2)
        // 获取详情
        this.getFriendInfoAction({
          self_uid: this.getUserId,
          friend_uid: id
        })
        this.setIsAddFriendState(true)
      },
      // 群聊
      getFlockDetail(id){
        this.checkIndex = id
        this.checkIndexFrined = ''
        this.$emit('leftData',1)
        this.getGroupChatInfoAction({
          self_uid: this.getUserId,
          group_id: id
        })
        this.setIsAddFriendState(true)
      },
      addFiend () {
        this.checkIndex = '-1'
        this.checkIndexFrined = ''
        this.$emit('leftData',0)
        // 默认设置为空
        this.setFriendInfo(null)
        this.addFriendList({self_uid: this.getUserId})
        this.setIsAddFriendState(false)
      }
    }
  }
</script>

<style lang="less" scoped>
  .friendlist {
    height: 540px;
    overflow-y: auto;
    .frienditem {
      border-top: 1px solid #dadada;
      cursor: pointer;
      // 阻止复制
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;
      &.noborder{
        border-top: none;
      }
      .list_title{
        box-sizing: border-box;
        width: 100%;
        font-size: 14px;
        padding: 10px  12px;
        color: #666;
      }
      .friend-info {
        display: flex;
        padding: 12px;
        transition: background-color .1s;
        font-size: 0;
        position: relative;
        &.offline{
          >img{
            -webkit-filter: grayscale(95%);
            -moz-filter: grayscale(95%);
            -ms-filter: grayscale(95%);
            -o-filter: grayscale(95%);
            filter: grayscale(95%);
            filter: gray;
          }
          .remark{
            .remarks_name{
              color: #000;
            }
            .username-css{
              color: #666;
            }
          }
        }
        &:hover{
           background-color: #DFDDDB;
         }
        &.active{
           background-color: #DFDDDB;
         }
         .avatar {
           border-radius: 2px;
           margin-right: 12px;
         }
         .remark {
           font-size: 14px;
           line-height: 20px;
           word-break: break-all;
           word-wrap: break-word;
         }
        .qunz-icon2{
          position: absolute;
          width: 20px;
          height: 20px;
          top: 4px;
          left: 38px;
        }
      }

      &.hidden {
        height: 0;
        overflow: hidden;
      }
    }
  }
</style>
