<template>
  <div class="red-detail-open"  :class="{nn:wechatIMstore.thisRedType == 2}">
    <i class="icon-set" @click="setModalState('redPupContainer')"></i>
    <div class="red-detail-head" v-if="firstState.data.status == 1" @click="qiangRed">
      <img src="../../../assets/weChat/open_red.png" alt="">
    </div>
    <div class="red-detail-content" :class="{on:firstState.data.status == 1}">
      <div class="user">
        <div>
          <img :src="sendPackUser.send_head_portrait" alt="" width="45" height="45"> {{sendPackUser.send_name}}发的红包
        </div>
        <p>{{sendPackUser.topic || '恭喜发财，大吉大利'}}</p>
        <p v-if="firstState.data.tip">{{firstState.data.tip}}</p>
      </div>
      <div class="game-img" v-if="wechatIMstore.thisRedType == 1">
        <img :src="getLei(sendPackUser.fval*1)" alt="" width="110" height="100">
      </div>
      <div class="game-img" v-if="wechatIMstore.thisRedType == 3">
        <img src="../../../assets/weChat/gameRed/open_dragon.png" alt="" width="100" height="100">
      </div>
    </div>
    <div class="check-detail" v-if="detailState && firstState.data.isview == 1" @click="lookDetail">
      点击查看领取详情 >
    </div>
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
        "chatuserInfoStore"
      ]),
      ...mapGetters([

      ]),
      sendPackUser(){
        return this.wechatIMstore.sendRedPackMessage
      },
      firstState(){
        return this.wechatIMstore.firstRedState
      },
      detailState(){
        if(this.firstState.data.status == 0 && this.firstState.data.isview == 0) {
          return false
        }else{
          return true
        }
      }
    },
    watch: {

    },
    created () {

    },
    mounted () {

    },
    methods:{
      getLei(i){
        return require('../../../assets/weChat/gameRed/mine'+ i + '.png') || require('../../../assets/weChat/gameRed/lei.png')
      },
      qiangRed(){
        this.setGetOrCheck(1)
        this.setModalState('redPupContainer')
        this.setModalState('redDetailState')

//        this.$router.push({
//          path:'/singlechat/redDetail/' + 1,
//          query:{
//            repcode:this.sendPackUser.repcode,
//          }
//        })

      },
      lookDetail(){
        this.setGetOrCheck(2)
        this.setModalState('redPupContainer');
        this.setModalState('redDetailState')
      },
      ...mapActions([

      ]),
      ...mapMutations([
        "setModalState",
        "setGetOrCheck"
      ]),

    },
  }
</script>
<style lang="less" scoped>
  .icon-set{
    position: absolute;
    width: 40px;
    height: 40px;
    background: url('../../../assets/weChat/close.png') no-repeat;
    background-size: 30px 30px;
    display: inline-block;
    background-position: center center;
    cursor: pointer;
    top:0;
    right: 0;
  }
  .red-detail-open {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 120;
    font-size:14px;
    width: 330px;
    height: 580px;
    border-radius: 5px;
    background-image: url('../../../assets/weChat/red-background_0.png');
    background-size: 100% 100%;
    text-align: center;
    color: #FDE0AF;
    &.nn {
       background-image: url('../../../assets/weChat/red-background_2.png');
     }
    .check-detail {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
    }
  .red-detail-head {
    width: 100%;
    margin-top: 85px;

    img {
        cursor: pointer;
        width: 80px;
        height: 80px;
      }
    }
    .red-detail-content {
      margin-top: 160px;

      font-size: 18px;
      padding: 15px;
      .user {
        p {
          line-height: 60px;
        }
        img {
          border-radius: 5px;
          margin-right: 10px;
        }
      }
      .game-img {
        margin-top: 15px;
      }
      &.on {
        margin-top: 20px;
       }
    }
  }
</style>
