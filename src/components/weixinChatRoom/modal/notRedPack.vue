<template>
  <div class="weiqiangdao on">
    <img src="../../../assets/weChat/weiqiangdao.png">
    <img  src="../../../assets/weChat/hongbao_close.png" @click="setRedPackState(0)">
    <p  @click="lookRedDetail()">去看看其他人的手气&gt;&gt;</p>
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
        "getRobRedList"
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
  .weiqiangdao {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    z-index: 120;
    transition: transform .1s;

  &.on {
     transform: translate(-50%, -50%) scale(1);
     transition: transform .1s
   }
  img:first-child {
    width: 220px
  }
  img:nth-child(2){
    position: absolute;
    top: -40px;
    right: -20px;
    width: 30px
  }
  p {
    position: absolute;
    bottom: 10px;
    width: 100%;
    font-size: 14px;
    line-height: 70px;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }
  }
</style>
