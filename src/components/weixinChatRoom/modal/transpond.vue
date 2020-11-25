<template>
    <div class="transpond">
        <el-dialog
                title="选择转发对象"
                :visible.sync="transpondData.visible"
                width="30%"
                center>
            <div class="transpond_box">
                <div class="user-card flex" :class="{curr:i.checked}"
                     v-for="i in chatListMessage" @click="shareFn(i)" v-if="(i.chatType == 1 && !i.kefu) || i.chatType == 2" >
                  <img :src="i.user.img" alt="" v-if="i.user.img"/>
                    <img v-else src="@/assets/weChat/default_avatar.png" class="avatar">
                    <div class="flex-1">
                      {{i.user.remarks_name || i.user.name}} <span v-if="i.chatType == 2">({{i.chatCount}})</span>
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
    props:['transpondData'],
    data() {
      return {
        userObj:{

        },
        pageId:'',
        config:_config,
        chatListMessage:[],
      }
    },
    created () {
      if(this.chatListStore.chatlist.length > 0){
        this.chatListMessage = []
        for(var i = 0,len = this.chatListStore.chatlist.length; i < len;i++){
          let obj = {}
          let message = this.chatListStore.chatlist[i]
          message['checked'] = false
          obj = Object.assign({}, message,obj)
          this.chatListMessage.push(obj)
        }
      }
    },
    methods:{
      ...mapMutations([
        "setActiveWindow"
      ]),
      ...mapActions([
        'getFriendList',
        "sendMessageIM",
        "messageForward"
      ]),
      shareFn(i){
        i.checked = !i.checked
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
        let selectNum = 0
        this.chatListMessage.forEach((i)=>{
          if(i.checked){
            selectNum++
            if(i.chatType == 1){
              fLsit.push(i.id)
            }
            if(i.chatType == 2){
              gList.push(i.id)
            }
          }
        })

        if(selectNum >30){
          this.$message({
            type: 'warning',
            message: '最多只能选择30个!'
          });
          return
        }

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
    },

  }
</script>

<style scoped lang="less">

</style>
