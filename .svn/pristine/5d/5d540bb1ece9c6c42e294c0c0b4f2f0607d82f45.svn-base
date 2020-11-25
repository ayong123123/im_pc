<template>
  <div class="connect on">
    <div class="loading-connect">
      <img src="../../../assets/weChat/loading.gif">
      <!--<span style="color:#fff;">正在尝试连接...</span>-->
      <button @click="connectFn"  v-if="connectState">重新连接</button>
    </div>

  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import WebIM from "../../../configWX/WebIMWX"
  export default {
    data () {
      return {
        connectState:true,
        timer:null,
      }
    },
    computed:{
      ...mapState([
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
    beforeDestroy(){
      clearTimeout(this.timer);
    },
    methods:{
      connectFn(){
        if(window.againCountAll == 4){
          this.$router.push({name:'login'})
        }
        WebIM.conn.open();
        this.connectState = false
        this.timer = setTimeout(()=>{
          this.connectState = true
        },3000)
      },
      ...mapActions([

      ]),
      ...mapMutations([
      ]),

    },
  }
</script>
<style lang="less" scoped>
  .connect {
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    margin: auto;
    width: 120px;
    height: 200px;
    z-index: 1000;
    transition: .1s;
     .loading-connect {
       z-index: 1001;
        text-align:center;
        img {
          width: 120px;
        }
        button {
          cursor: pointer;
         padding: 4px 15px;
          font-size: 14px;
          color:#fff;
          background-color: #ff0000;
          border-radius: 5px;
        }
     }


  }

</style>
