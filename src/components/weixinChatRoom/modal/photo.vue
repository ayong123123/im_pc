<template>
  <div class="picture on" @click="setPicture({img:'',state:false})">
    <img :src="chatListStore.pictureObj.img">
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

      ]),
      ...mapMutations([
        "setPicture"
      ]),

    },
  }
</script>
<style lang="less" scoped>
  .picture {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 600px;
    height: 90%;
    z-index: 1000;
    transition: .1s;
    &.on {
      transform: translate(-50%, -50%) scale(1);
      transition: .1s
    }
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }
  }

</style>
