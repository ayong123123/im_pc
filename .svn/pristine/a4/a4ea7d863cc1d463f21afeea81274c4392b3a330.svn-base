<template>
  <div>
    <div class="time"><span>{{getTimes(msg.create_time)}}</span></div>
    <div class="main self">
      <div class="message-tuisong chat-content-dom">
        <img src="../../../../assets/weChat/lock.png" width="20" alt="" style="vertical-align: bottom;" v-if="msg.type == config.MSG_PRIVATE_AGREEADDFRIEND"> &nbsp;{{msg.content || msg.singlemessage.content}}
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
