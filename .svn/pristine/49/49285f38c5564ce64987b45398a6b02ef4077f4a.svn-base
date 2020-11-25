<template>
  <div class="manage_set">
    <div class="head_manage">
      <img src="@/assets/weChat/close.png" alt="" @click="closeFn()"/>
      <span>管理员设置</span>
    </div>
    <div class="manage_list" v-if="!sheetVisible">
      <p>
        群主
      </p>
      <div class="c_set_man">
        <div class="c_man_users flex" v-for="i in groupUser" v-if="i.role == 1">
          <img v-lazy="i.head_portrait" alt="">
          <div class="c_man_select flex-1">
            {{i.user_group_name || i.user_nickname}}
          </div>
        </div>
      </div>
      <p>
        管理员({{managementCount}}/10)
      </p>
      <div class="c_set_man">
        <div class="c_man_users flex" @click="openManage">
          <img src="@/assets/red/message.navigator.menu.png" alt="" />
          <div class="c_man_select flex-1">
            添加管理员
          </div>
        </div>
        <div class="c_man_users flex"  v-for="i in groupUser" v-if="i.role == 2">
          <img v-lazy="i.head_portrait" alt="">
          <div class="c_man_select flex-between flex-1">
            {{i.user_group_name || i.user_nickname}}
            <img src="@/assets/weChat/delete.png" width="20" alt="" @click="deleteSection(i)" class="flex-shrink0"/>
          </div>
        </div>
      </div>
    </div>
    <div class="add_manage" v-else>
      <div class="flex" style="padding: 0 10px;">
        <div class="t_search">
          <img src="@/assets/weChat/icon_search.png" alt="" class="img-search">
          <form action="javascript:void 0">
            <input
              type="text"
              placeholder="请输入联系人昵称" v-model="searchUser">
          </form>
        </div>
        <div class="r_sure_manage" @click="addManagementFn">
          添加
        </div>
      </div>
      <div class="t_add_manage">
        <div class="c_user">
          <div class="c_user_item flex" v-for="u in groupUserType3" v-if="u.role == 3" @click="selectManage(u)">
            <img v-lazy="u.head_portrait" alt="">
            <div class="flex-1 flex-between">
              <span>{{u.user_group_name || u.user_nickname}}</span>
              <img src="@/assets/weChat/checked.png" alt="" style="width:25px;height: 30px;vertical-align: middle;" v-if="u.checked">
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import { Message,MessageBox} from 'element-ui';
  export default {
    data () {
      return {
        userType3:[], // 普通成员
        sheetVisible:false, // 新增成员
        searchUser:'',
      }
    },
    computed:{
      ...mapState([
        "chatListStore",
        "indexStore",
        "msgListStore",
        "friendsListStore"
      ]),
      ...mapGetters([
        'getUserId'
      ]),
      groupUser(){
        return this.friendsListStore.groupChatInfoList.data.user_info
      },
      managementCount(){
        let count = 0
        this.friendsListStore.groupChatInfoList.data.user_info.forEach((u)=>{
          if(u.role == 2){
            count++
          }
        })
        return count
      },
      groupUserType3(){
        let list = this.userType3.filter(sessions => sessions.user_group_name.includes(this.searchUser))
        return list
      },


    },
    watch: {

    },
    created () {

    },
    mounted () {

    },
    methods:{
      ...mapActions([
      "groupSetAdminAction",
        "getGroupChatInfoAction"
      ]),
      ...mapMutations([
        "setModalState"
      ]),
      deleteSection(i){
        this.$confirm('解除管理员一职, 是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          let obj = {
            owner_uid:this.getUserId,
            group_id:this.friendsListStore.groupChatInfoList.data.group_id,
            uid:i.uid,
            status:3,
          }
          this.groupSetAdminAction(obj).then(()=>{
            this.getGroupChatInfoAction({self_uid:this.getUserId,group_id:this.friendsListStore.groupChatInfoList.data.group_id})
          })
        }).catch(() => {

        });


      },
      closeFn(){
        if(!this.sheetVisible){
          this.setModalState('groupManageState')
        }else{
          this.sheetVisible = false
        }
      },
      openManage(){
        this.userType3 = []
        this.friendsListStore.groupChatInfoList.data.user_info.forEach((u)=>{
          let item = u
          item.checked = false
          this.userType3.push(item)
        })
        this.sheetVisible = true

      },
      selectManage(i){
        i.checked = !i.checked
      },
      addManagementFn(){
        let flag = this.userType3.some((i)=> i.checked)
        if(!flag){
          Message({
            message:'请选择群成员',
            type:"warning",
            showClose:true
          })
          return
        }
        let list = []
        let selectNum = 0
        this.userType3.forEach((i)=>{
          if(i.checked){
            selectNum++
            list.push(i.uid)
          }
        })
        if(selectNum > 10) {
          Message({
            message:'最多只能选择10个',
            type:"warning",
            showClose:true
          })
          return
        }

        let obj = {
          owner_uid:this.getUserId,
          group_id:this.friendsListStore.groupChatInfoList.data.group_id,
          uid:list.join(","),
          status:2,
        }
        this.groupSetAdminAction(obj).then(()=>{
          this.getGroupChatInfoAction({self_uid:this.getUserId,group_id:this.friendsListStore.groupChatInfoList.data.group_id})
          this.sheetVisible = false
        })


      },
    },
  }
</script>
<style lang="less" scoped>
  .manage_set {
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
    .head_manage {
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
    .add_manage {
      height: 450px;
      padding: 10px 0;
      .t_search {
        width: 94%;
        height: 36px;
        border-radius: 4px;
        display: flex;
        background-color: #FFFFFF;
        .img-search {
          width: 36px;
          height: 36px;
          padding: 6px;
          border-radius: 5px;
        }
        form{
          width: 100%;
          input{
            font-size: 14px;
            border-radius: 4px;
            width: 100%;
            height: 100%;
            padding: 0 10px;
          }
        }
      }
      .r_sure_manage {
        background-color: #00dc41;
        border-radius: 4px;
        width: 50px;
        line-height: 32px;
        margin-left: 5px;
        text-align: center;
        color: #000;
      }
      .t_add_manage {
        padding-top: 10px;
        background-color: #F2F2F7;
        overflow: auto;
        height: 410px;
        .c_user {
          border-bottom: 1px solid #e0e0e0;
          border-top: 1px solid #e0e0e0;
          .c_user_item {
            img {
              margin: 5px;
              width: 45px;
              height: 45px;
              border-radius: 50%;
            }
            div{
              padding: 5px;
              line-height: 45px;
              border-bottom: 1px solid #e0e0e0;
              font-size: 15px;
            }
            &:last-child {
              div {
                border-bottom: none;
              }
            }
          }
        }
      }
    }
    .manage_list {
      height: 450px;
      overflow: auto;
      padding: 10px 0;
      >p {
        padding-left: 10px;
        line-height: 32px;
        font-size: 13px;
      }
      .c_set_man {
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        .c_man_users {
          background-color: #fff;
          img {
            margin: 5px;
            width: 45px;
            height: 45px;
          }
          .c_man_select {
            padding:5px;
            border-bottom: 1px solid #e0e0e0;
            line-height: 45px;
            font-size: 16px;
            color:#000;
          }
          &:last-child {
            .c_man_select {
              border-bottom: none;
            }
          }
        }
      }

    }
  }

</style>
