<!-- 文本 -->
<template>
  <div>
    <div class="time" ><span> {{msg.addtime}}</span></div>
    <div class="main" >
      <img class="avatar" style="width: 36px;height: 36px" src="@/assets/wechat/wanzhan.png" v-if="msg.type == 1"/>
      <img class="avatar" style="width: 36px;height: 36px" src="@/assets/wechat/zhannei.png" v-if="msg.type == 2"/>

      <span class="chat-username" v-if="msg.type == 1">
        网站公告
      </span>
      <span class="chat-username" v-else>
        站内信
      </span>
      <div class="content chat-content-dom" >
        <!--<div class="text" v-html="replaceFace(msg.content)"></div>-->
        <div class="text">
          <b>
            {{msg.title}}
          </b>
          <div>
            {{msg.content}}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState ,mapMutations ,mapActions} from 'vuex'
  import {getTimes} from '@/common/common'
  import _config from '@/configWX/configWX'
  export default {
    props: ['msg'],
    computed: {
      ...mapGetters([
        'selectedChat',
        'getUserId',
      ]),
      ...mapState([
        'chatListStore',
        "chatuserInfoStore",
      ]),
    },
    data(){
      return {
        getTimes:getTimes,
        config:_config,
      }
    },
    mounted() {

    },
    watch: {

    },
    created(){

    },
    methods: {

      ...mapActions([

      ]),
      ...mapMutations([

      ]),

    },
    filters: {
      // 将日期过滤为 hour:minutes

    }
  }
</script>

<style lang="less" scoped>

</style>
