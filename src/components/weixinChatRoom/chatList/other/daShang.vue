<template>
  <div>
    <div class="time"><span>{{getTimes(msg.create_time)}}</span></div>
    <div class="main self">
      <div class="message-tuisong ds chat-content-dom">
        <span>{{daShangObj.nickname}} </span>打赏了<span> {{daShangObj.isZhuBo*1 == 1 ? '主播' : daShangObj.toNickName}} </span> <span style="color:#ff0000">¥{{daShangObj.amount}}元</span>
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
      daShangObj(){
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
