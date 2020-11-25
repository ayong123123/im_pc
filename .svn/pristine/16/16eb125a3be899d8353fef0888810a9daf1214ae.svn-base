<template>
  <div class="animation-left on"
       ref="animationLeft">
    <div class="animation-content">
      <div class="send-user-remind">
        老王@了你
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  export default {
    props: ['msg'],
    data () {
      return {

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
  .animation-left {
    position: fixed;
    left: 30%;
    top: 100PX;
    width: 0px;
    display: flex;
    margin:0;
    z-index: 9999;
    overflow: hidden;
    justify-content: space-between;
  }
  .animation-left.on {
    -webkit-animation: showLeft 2s 1s ease 1;
    -moz-animation: showLeft 2s 1s ease 1;
  }
  @keyframes showLeft {
    0% {
      width: 0px;

    }
    10% {
      width: 200px;
    }
    70%{
      width: 200px;
      opacity: 1;
    }
    90%{
      width: 200px;
      opacity: .5;
    }
    100% {
      width: 0px;
      opacity: 0;
    }
  }
  .animation-left .animation-content {
    width: 200px;
    height: 30px;
    padding-left: 20px;
    background-color: #ff0000;
    border-radius: 30px;
    overflow: hidden;
    line-height: 30px;
    color:#fff;
    font-size: 15px;
  }

</style>
