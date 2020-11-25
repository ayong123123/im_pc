<template>
    <div class="shareCard">
        <el-dialog
                title="分享名片"
                :visible.sync="shareCardInfo.visible"
                width="30%"
                center>
            <div class="transpond_box">
                <div class="user-card flex" :class="{curr:i.checked}"
                     v-for="i in shareList" @click="shareFn(i)">
                    <div v-if="i.initials">
                        <img :src="i.head_portrait" alt="" v-if="i.head_portrait"/>
                        <img v-else src="@/assets/weChat/default_avatar.png" class="avatar">
                        <div class="flex-1">
                            {{i.remarks_name || i.name}}
                        </div>
                    </div>

                    <div v-else>
                        <img :src="i.group_cover" alt="" v-if="i.group_cover"/>
                        <img v-else src="@/assets/weChat/default_avatar.png" class="avatar">
                        <div class="flex-1">
                            {{i.name}} <span>({{i.count}})</span>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeModal">取 消</el-button>
                <el-button type="primary" @click="messageForwardFn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import { mapMutations,mapActions, mapState ,mapGetters } from 'vuex'
  import _config from '@/configWX/configWX'
  export default {
    name: 'transpond',
    props:['shareCardInfo'],
    data() {
      return {
        userObj:{

        },
        pageId:'',
        config:_config,
        chatListMessage:[],
        sendId:'',
      }
    },
    created () {
    },
    methods:{
      ...mapMutations([
        "setActiveWindow",
        "createFriendChatMessage"
      ]),
      ...mapActions([
        'getFriendList',
        "sendMessageIM",
        "messageForward"
      ]),
      shareFn(i){
        this.shareList.forEach(item=>{
          item.checked = false;
        })
        i.checked = true;
        this.sendId = i.id
      },
      isGroup(type){
        if(this.config.MSG_GROUP_TXT == type || this.config.MSG_GROUP_IMG == type ||  this.config.MSG_GROUP_VIDEO == type || this.config.MSG_GROUP_SHARENOTE == type || this.config.MSG_GROUP_CARD == type){
          return true
        }else{
          return false
        }

      },
      getSingleType(type){
        switch (type) {
          case this.config.MSG_GROUP_TXT:
            return this.config.MSG_PRIVATE_TXT
            break;
          case this.config.MSG_GROUP_IMG:
            return this.config.MSG_PRIVATE_IMG
            break;
          case this.config.MSG_GROUP_VIDEO:
            return this.config.MSG_PRIVATE_VIDEO
            break;
          case this.config.MSG_GROUP_SHARENOTE:
            return this.config.MSG_PRIVATE_SHARENOTE
            break;
          case this.config.MSG_GROUP_CARD:
            return this.config.MSG_PRIVATE_CARD
            break;
        }
      },
      getGroupType(type){
        switch (type*1) {
          case this.config.MSG_PRIVATE_TXT:
            return this.config.MSG_GROUP_TXT
            break;
          case this.config.MSG_PRIVATE_IMG:
            return this.config.MSG_GROUP_IMG
            break;
          case this.config.MSG_PRIVATE_VIDEO:
            return this.config.MSG_GROUP_VIDEO
            break;
          case this.config.MSG_PRIVATE_SHARENOTE:
            return this.config.MSG_GROUP_SHARENOTE
            break;
          case this.config.MSG_PRIVATE_CARD:
            return this.config.MSG_GROUP_CARD
            break;
        }
      },
      closeModal(){
        this.$emit('closeTranspond');
      },
      messageForwardFn(){

        let flag = this.chatListMessage.some((i)=> i.checked)
        if(!flag){
          this.$message({
            type: 'warning',
            message: '请选择转发对象!'
          });
          return
        }
        let fLsit = []
        let gList = []
        // let selectNum = 0
        this.chatListMessage.forEach((i)=>{
          if(i.checked){
            // selectNum++
            if(i.initials){
              fLsit.push(i.id)
            }else {
              gList.push(i.id)
            }
          }
        })

        // if(selectNum >30){
        //   this.$message({
        //     type: 'warning',
        //     message: '最多只能选择30个!'
        //   });
        //   return
        // }

        let params = {
          selfUid:this.getUserId,
          singleList:'',
          groupList:'',
          singleData:'',
          groupData:'',
        }
        var ctype = this.chatListStore.zhuanFaMessage.type
        if(ctype == this.config.MSG_GROUP_NOTICE || ctype == this.config.MSG_GROUP_AT || ctype == this.config.MSG_GROUP_AT_ALL ){
          ctype = this.config.MSG_GROUP_TXT
        }else{
          ctype = this.chatListStore.zhuanFaMessage.type
        }
        let isGroup = this.isGroup(ctype)
        if(fLsit.length>0){
          params.singleList = fLsit.join(",")
          let initData = {
            to:0,
            message:this.chatListStore.zhuanFaMessage.content,
            type: ctype,
          }
          if(isGroup){
            initData.type = this.getSingleType(ctype)
          }
          let sendData = this.initForwardMessage(initData)
          params.singleData = JSON.stringify(sendData)

        }
        if(gList.length>0){
          params.groupList = gList.join(",")
          let initData = {
            to:0,
            message:this.chatListStore.zhuanFaMessage.content,
            type:ctype,
          }
          if(!isGroup){
            initData.type = this.getGroupType(ctype)
          }
          let sendData = this.initForwardMessage(initData)
          params.groupData = JSON.stringify(sendData)

        }
        this.createFriendChatMessage({id:this.sendId})
        this.messageForward(params).then(()=>{
          this.$emit('closeTranspond');
        })
      },
      shareCard(){
        // console.log(this.chatListStore)
        let sType = this.chatListStore.zhuanFaMessage.type
        if(sType == this.config.MSG_GROUP_VIDEO){
          sType = this.config.MSG_PRIVATE_VIDEO
        }
        if(sType == this.config.MSG_GROUP_IMG){
          sType = this.config.MSG_PRIVATE_IMG
        }
        var data = {
          to:this.userObj.id,
          message:this.chatListStore.zhuanFaMessage.content,
          type: sType,
          reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
        }
        this.sendMessageIM(data)


        this.$message.success('转发消息成功！')
        this.$emit('closeTranspond');
      },

    },
    computed:{
      ...mapGetters([
        'getUserId',
        "initForwardMessage"
      ]),
      ...mapState([
        'friendsListStore',
        "msgListStore",
        "indexStore",
        "chatuserInfoStore",
        "chatListStore"
      ]),
      shareList() {
        if(this.shareCardInfo.shareList.length > 0){
          this.chatListMessage = []
          for(var i = 0,len = this.shareCardInfo.shareList.length; i < len;i++){
            let obj = {}
            let message = this.shareCardInfo.shareList[i]
            message['checked'] = false
            obj = Object.assign({}, message,obj)
            this.chatListMessage.push(obj)
          }
          return this.chatListMessage
        }
      }
    },

  }
</script>

<style scoped lang="less">

</style>
