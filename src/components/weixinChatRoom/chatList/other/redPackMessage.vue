<template>
  <div  v-if="(msg.asGroup == 1 && msg.singlemessage.acceptid == getUserId) || msg.asGroup == 2">
    <div class="time"><span v-if="!msg.showTime">{{getTimes(msg.create_time)}}</span></div>
    <div class="main self">
      <div class="message-tuisong chat-content-dom" v-if="msg.asGroup == 2">
         <span v-if="msg.groupmessage.sendid == getUserId">
          你
        </span>
        <span v-else>{{chatObj.nickname}}</span>
        领取了
        <span v-if="msg.groupmessage.sendid == getUserId && msg.groupmessage.comment == getUserId">
          自己
        </span>
        <span v-else-if="msg.groupmessage.sendid != getUserId && msg.groupmessage.comment == getUserId">
          你
        </span>
        <span v-else>
          {{getGroupRemarkName({uid:msg.groupmessage.comment}) || chatObj.send_name}}
        </span>

        的<span class="red-msg">红包</span>
      </div>
      <div class="message-tuisong chat-content-dom" v-if="msg.asGroup == 1">
        您的红包已被领取
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import {getTimes} from '@/common/common'
  import _config from '@/configWX/configWX'
  export default {

    props: ['msg'],
    data () {
      return {
        getTimes:getTimes,
        config:_config,
      }
    },
    computed:{
      ...mapState([
      ]),
      ...mapGetters([
        "getUserId",
        "getGroupRemarkName"
      ]),
      chatObj(){
        var obj =JSON.parse(this.msg.content);
        return obj
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

      ]),
      ...mapMutations([

      ]),

    },
  }
</script>
<style lang="less" scoped>
</style>
