<template>
  <div class="qun_code">
    <div class="qun_code_head">
      群二维码
      <img src="@/assets/weChat/close.png" alt="" @click="setModalState('groupErWeiMaState')"/>
    </div>
    <div id="qunCode">
    </div>
    <p>扫一扫上面的二维码，加入群聊</p>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import QRCode from 'qrcodejs2'
  import {aesEncrypt,aesDecrypt} from '@/common/crypto'
  export default {
    data () {
      return {

      }
    },
    computed:{
      ...mapState([
        "chatListStore",
        "indexStore",
        "friendsListStore"
      ]),
      ...mapGetters([

      ]),
    },
    watch: {

    },
    created () {

    },
    mounted () {
      this.createQunCode()
    },
    methods:{
      ...mapActions([

      ]),
      ...mapMutations([
        "setModalState"
      ]),
      createQunCode() {
//        var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        var _temp={
          user_id:this.getUserId,
          dgg_im:'dgg_im',
          website:this.indexStore.indexData.website,
          group_id:this.friendsListStore.groupChatInfoList.data.group_id,
          group_name:this.friendsListStore.groupChatInfoList.data.group_name,
          group_image:this.friendsListStore.groupChatInfoList.data.group_cover,
          group_count:this.friendsListStore.groupChatInfoList.data.count,
          isGroup:1,
        };
        _temp=JSON.stringify(_temp);
        var jiami = aesEncrypt(_temp)
        var qrcode = new QRCode("qunCode", {
          text: jiami,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
        })
      },

    },
  }
</script>
<style lang="less" scoped>
  #qunCode{
    width: 200px;
    margin: 0 auto;
  }
  .qun_code {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 120;
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    font-size: 14px;
    text-align: center;
    color:#333;
    .qun_code_head {
      font-size: 17px;
      line-height: 50px;
      img{
        position: absolute;
        top: 5px;
        right: 10px;
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
    }
    p {
      line-height: 40px;
      color:#999;
    }
  }

</style>
