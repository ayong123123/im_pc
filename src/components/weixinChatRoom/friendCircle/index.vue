<template>
  <div class="content">
    <div class="friend-wrapper">
      <wx-friend-circle @childByValue="childByValue"></wx-friend-circle>
    </div>
    <div class="friendinfo">
      <!-- 朋友圈 -->
      <!--<allFriendCircle v-if="childVal == 1" @sendData="sendData"  @childData="childDataOne"></allFriendCircle>-->
      <!-- 黑名单 -->
      <wx-blockList v-if="childVal == 1"></wx-blockList>
      <!-- 发朋友圈 -->
      <wx-sendFriendCircle v-if="showSendData" @sendData="sendData"></wx-sendFriendCircle>
      <!-- 好友朋友圈 -->
      <wx-childFrinedCircle v-if="childVal == 4" :childIdSend="childIdSend" @sendData="sendData"></wx-childFrinedCircle>
      <!-- 账变 -->
      <wx-accountchange  v-if="childVal == 2"></wx-accountchange>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import {copyobj,setSession,getSession,getchar} from '@/common/common'
  import {Message} from 'element-ui'
  export default {
    name: 'friends',
    data () {
      return {
        childVal:1,
        showSendData: false,
        childIdSend:''
      }
    },
    mounted(){

    },
    created (){

    },
    methods: {
      childByValue (val) {
        this.childVal = val
        this.showSendData = false
      },
      sendData (val) {
        this.childVal = val ? null : 1
        this.showSendData = val
      },
      childDataOne(val){
        this.childVal = 4
        this.childIdSend = val
      }
    },
    components:{

    },
    computed: {
      ...mapState([

      ]),
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .content {
    display: flex;
    width: 800px;
    height: 650px;
    .friend-wrapper {
      width: 250px;
      background: rgb(230,230,230);
    }
    .friendinfo {
      flex: 1;
    }
  }

</style>
