<!-- 文本 -->
<template>
  <div class="texts">
    <div class="time" ><span v-if="!msg.showTime">{{getTimes(msg.create_time)}}</span></div>
    <div class="main" :class="{ self: msg.userMsg || msg.send_uid == getUserId}" >
      <img class="avatar" width="36" height="36" v-lazy="msg.head_portrait" v-if="msg.head_portrait" @click="findUser(msg)" @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="chatuserInfoStore.dataGetInfo.head_portrait" v-else-if="msg.send_uid == getUserId" @click="findUser(msg)"   @contextmenu.prevent="openHandleUserVible(msg)"/>
      <img class="avatar" width="36" height="36" v-lazy="selectedChat.user.img" v-else @click="findUser(msg)"   @contextmenu.prevent="openHandleUserVible(msg)"/>
      <!--<img class="avatar" width="36" height="36" src="@/assets/weChat/default_avatar.png" v-else  @click="findUser(msg)" />-->

      <!--右键弹窗-->
      <div class="handleConfig" v-show="chatListStore.handleUserVible && forbiddenInfo.unique_value ==msg.unique_value && msg.send_uid != getUserId" >
        <ul>
          <li @click="isStopTalking(msg)" v-if="forbiddenInfo.forbiddenStatus != 2">
            禁言
          </li>
          <li  @click="isStopTalking(msg)" v-if="forbiddenInfo.forbiddenStatus != 1">
            解禁
          </li>
          <li @click="removeGroupUser(msg)">
            移除
          </li>
          <li @click="findUser(msg)">
            @TA
          </li>
        </ul>
      </div>

      <span  class="chat-username" v-if="msg.userMsg || msg.send_uid == getUserId">
        <!--<span>{{msg}}</span>-->
        <wx-level :msg="msg"/>{{chatuserInfoStore.dataGetInfo.nickname}}
      </span>
      <span  class="chat-username" v-else-if="msgListStore.activeTyep == 1">
        {{msgListStore.activeName}}<wx-level :msg="msg"/>
      </span>
      <span  class="chat-username" v-else>
       {{getGroupRemarkName({uid:msg.asFrom,send_uid:msg.send_uid}) || msg.nickname || msg.username}}<wx-level :msg="msg"/>
      </span>
      <div class="content chat-content-dom"  @contextmenu.prevent="messageBack()">
        <!--<div class="text" v-html="replaceFace(msg.content)"></div>-->
        <div class="text" v-html="filterTxt(renderTxt(msg.content))"></div>
        <i class="el-icon-loading chat-loading" v-if="msg.status == config.MSG_STATUS_SED"></i>
        <i class="el-icon-warning chat-loading error" v-if="msg.status == config.MSG_STATUS_ERROR" @click="chongFa()"></i>
      </div>

    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState ,mapMutations ,mapActions} from 'vuex'
  import {getTimes} from '@/common/common'
  import _config from '@/configWX/configWX'
  import emoji from "@/configWX/emoji"
  export default {
    props: ['msg','forbiddenInfo'],
    computed: {
      ...mapGetters([
        'selectedChat',
        'getUserId',
        "getGroupRemarkName",
        "isBoss",
        "isManagement",
      ]),
      ...mapState([
        'chatListStore',
        "msgListStore",
        "chatuserInfoStore",
        "friendsListStore"
      ]),
      ...mapMutations([
          "setHandleUserVible"
      ])
    },
    data(){
      return {
        getTimes:getTimes,
        config:_config,
        reg:"操你妈*鸡吧",
        errorTimer:null,
      }
    },
    mounted() {

    },
    watch: {

    },
    created(){
      this.errorTimer = setTimeout(()=>{
        this.setError()
      },10000)
    },
    beforeDestroy(){
      clearTimeout(this.errorTimer)
    },
    methods: {
      //禁言
      isStopTalking(u) {
        this.$emit('isStopTalking',u)
      },
      //移除
      removeGroupUser(u) {
        this.$emit('removeGroupUser',u)
      },
      openHandleUserVible(u) {
        this.$emit("openHandleUserVible",u)
      },
      setError(){
        if ((!this.msg.code || this.msg.code == 3) && this.msg.status == this.config.MSG_STATUS_SED) {
          this.msg.status = this.config.MSG_STATUS_ERROR
          clearTimeout(this.errorTimer)
        }
      },
      chongFa(){
        if((this.msg.send_uid && this.msg.send_uid == this.getUserId) || (this.msg.userMsg && this.msg.status == this.config.MSG_STATUS_ERROR)){
          this.$confirm('是否重发该消息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit("reSendMessage",this.msg)
          }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
          });
        }

      },

      findUser(u){
        this.$emit("setFindUser",u)
      },
      /*解析表情*/
      renderTxt  (txt) {
        let rnTxt = []
        let match = null
        const regex = /(\[.*?\])/g
        let start = 0
        let index = 0
        while ((match = regex.exec(txt))) {
          index = match.index
          if (index > start) {
            rnTxt.push(txt.substring(start, index))
          }
          if (match[1] in emoji.map) {

            const v = emoji.map[match[1]]
            rnTxt.push(
              `<img  class="" src=./pcImstatic/images/faces/${v} />`
            )
          } else {
            rnTxt.push(match[1])
          }
          start = index + match[1].length
        }


        try {
          rnTxt.push(txt.substring(start, txt.length))
        }catch (e){
          // console.log(e)
          rnTxt.push(JSON.stringify(txt))
        }

        var textHthl="";
        rnTxt.forEach(function(val,index,arr){
          textHthl+=val;
        })

        return textHthl.replace(/\r\n/g,"</br>").replace(/\n/g,"</br>")
      },
      filterTxt(t){
        let t1 = t
        let arr = this.reg.split('*')
        for(let i in arr){
          try {
            var imgReg = eval("/" + arr[i] + "(?=[^>]*(<|$))/g");  // 忽略 标签元素
//            let a= new RegExp(arr[i],"g");
            t1 = t1.replace(imgReg,'***');
          }catch (e){

          }
        }
        return t1

      },
      ...mapActions([
        "sendMessageIM"
      ]),
      ...mapMutations([
        "clearMessageBack",
      ]),
      messageBack(){
          if((this.msg.send_uid && this.msg.send_uid == this.getUserId) || (this.msg.userMsg && this.msg.status == this.config.MSG_STATUS_SUCCEED) || (this.isBoss && this.msgListStore.activeTyep == 2) || (this.isManagement && this.msgListStore.activeTyep == 2)) {
            this.$emit('openConfig',this.msg)
          }else {
            this.$confirm('是否转发该消息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('getZhuanFa')
            }).catch(() => {

            })
          }



      },
      //  在发送信息之后，将输入的内容中属于表情的部分替换成emoji图片标签
      //  再经过v-html 渲染成真正的图片
      replaceFace (con) {
        if(con.includes('/:')) {
          var emojis=this.chatListStore.emojis;
          for(var i=0;i<emojis.length;i++){
            con = con.replace(emojis[i].reg, '<img src="pcImstatic/emoji/' + emojis[i].file +'"  alt="" style="vertical-align: middle; width: 24px; height: 24px" />');
          }
          return con;
        }
        return con;
      },
      ...mapMutations([

      ]),

    },
    filters: {
      // 将日期过滤为 hour:minutes

    }
  }
</script>

<style lang="less" scoped>
.resendMsg{
  display: inline-block;
  cursor: pointer;

}
</style>
