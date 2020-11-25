<template>
  <div>
    <div class="time"><span>{{getTimes(msg.create_time)}}</span></div>
    <div class="main self">
      <div class="message-tuisong ds chat-content-dom">
        <img src="@/assets/weChat/user_sign.png" alt="" width="18" height="18"><span> {{signObj.nickname || "用户名" }} </span>签到
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

      ]),
      signObj(){
        var obj =JSON.parse(this.msg.content);
        return obj
      }
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
  .message-tuisong.ds span{
    color:#ff8c00;
  }
</style>
