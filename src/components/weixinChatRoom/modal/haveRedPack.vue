<template>
  <div class="yiqiangdao on">

    <img src="../../../assets/weChat/qianghongbao.png">
    <img src="../../../assets/weChat/dalibao_guang.png" class="hongbao_guang">
    <img src="../../../assets/weChat/hongbao_close.png" class="close-red"  @click="setRedPackState(0)">
    <p class="get-red-type">抢到一个红包</p>

    <div class="get-red-money">{{wechatIMstore.redPackDetail.amount}} <span>元</span> </div>
    <p class="get-red-from point" @click="lookRedDetail()" v-if="selectedChat.chatType == 2">查看红包详情</p>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  export default {
    data () {
      return {

      }
    },
    computed:{
      ...mapState([
        "wechatIMstore",
        "chatListStore"
      ]),
      ...mapGetters([
        "selectedChat"
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
        'getRobRedList'
      ]),
      ...mapMutations([
        "setRedPackState"
      ]),
      lookRedDetail(){
        this.getRobRedList({red_id:this.wechatIMstore.red_id})
      }
    },
  }
</script>
<style lang="less" scoped>
  .yiqiangdao {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    z-index: 120;
    transition: transform .1s;
    font-size:15px;
    &.on {
       transform: translate(-50%, -50%) scale(1);
       transition: transform .1s
     }
    img:first-child {
      width: 400px
    }
    .close-red{
      position: absolute;
      top: -40px;
      right: -20px;
      width: 30px
    }
    .hongbao_guang{
      position: absolute;
      top: -8%;
      left: 50%;
      transform: translateX(-50%);
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      -o-transform: translateX(-50%);
      width: 110%;
      z-index: -10;
      animation: zhuanQuan 15s linear infinite;
    }
    @keyframes zhuanQuan {
      0% {
        transform: translateX(-50%) rotate(0deg);
        -webkit-transform: translateX(-50%) rotate(0deg);
        -moz-transform: translateX(-50%) rotate(0deg);
        -ms-transform: translateX(-50%) rotate(0deg);
        -o-transform: translateX(-50%) rotate(0deg);
      }

      100% {
        transform: translateX(-50%) rotate(1turn);
        -webkit-transform: translateX(-50%) rotate(1turn);
        -moz-transform: translateX(-50%) rotate(1turn);
        -ms-transform: translateX(-50%) rotate(1turn);
        -o-transform: translateX(-50%) rotate(1turn);
      }
    }
   .get-red-type,.get-red-money,.get-red-from {
     position: absolute;
     bottom: 125px;
     left: 22%;
     width: 220px;
     text-align: center;
     color:#FDC678;
   }
   .get-red-from {
     bottom: 10px;
     text-decoration:underline
   }
   .get-red-money {
     font-size: 30px;
     bottom: 70px;
     color:#fff;
     span {
       font-size: 15px;
     }
   }

  }
</style>
