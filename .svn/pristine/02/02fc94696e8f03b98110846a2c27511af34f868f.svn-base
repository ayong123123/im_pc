<template>
  <div class="reward">
    <div class="head_reward">
      <img src="@/assets/weChat/close.png" alt="" @click="setModalState('moneyRewardState')">
      <span>感谢 <i style="color: #fc701a;"> {{wechatIMstore.rewardUserObj.data.nickname}} </i>分享的注单</span>
    </div>
    <ul class="flex flex-warp">
      <li v-for="i in money" class="flex-1" @click="rewardMoney = i">{{i}}元</li>
    </ul>
    <div class="diyMoney flex-around">
      <b>
        金额
      </b>
      <input type="number" :placeholder="'已被打赏' + wechatIMstore.rewardUserObj.data.rewardCount + '次'" v-model="rewardMoney"  pattern="[0-9]*"/>
    </div>
    <div class="diyMoney flex-around" v-if="passwordShow">
      <b>
        提款密码
      </b>
      <input type="password" v-model="AmountPassword" placeholder="提款密码" />
    </div>
    <div class="btn_div" @click="sureDashang()">
      打赏
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import { Message,MessageBox} from 'element-ui';
  export default {
    data () {
      return {
        money:[1,2,5,10],
        rewardMoney:'',
        AmountPassword:'',
        passwordShow:false
      }
    },
    computed:{
      ...mapState([
        "chatListStore",
        "indexStore",
        "msgListStore",
        "wechatIMstore"
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
        "dashangAction"
      ]),
      ...mapMutations([
        "setModalState"
      ]),
      sureDashang(){
        if(isNaN(this.rewardMoney*1)){
          Message({
            message:'请输入合理金额',
            type:"warning",
            showClose:true
          })
          return
        }
        if(this.rewardMoney*1 <= 0){

          Message({
            message:'金额不能小于等于0',
            type:"warning",
            showClose:true
          })
          return
        }
        if(parseInt(this.indexStore.indexData.MinAmountPassword)<=parseInt(this.rewardMoney)){
          this.passwordShow = true
          if(!this.AmountPassword){
            Message({
              message: "提示:请输入提款密码",
              type: "warning",
              showClose: true,
            })
            return
          }
        }
        this.dashangAction({uid:this.wechatIMstore.rewardUserObj.data.uid,amount:this.rewardMoney*1,toNickName:this.wechatIMstore.rewardUserObj.data.nickname,AmountPassword:this.AmountPassword}).then(()=>{
          this.passwordShow = false
          this.setModalState('moneyRewardState')
        })

      },

    },
  }
</script>
<style lang="less" scoped>
  .reward {
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
    padding: 5px 0;
    .head_reward {
      height: 40px;
      line-height:40px;
      background-color: #fff;
      text-align: center;

      color:#000;
      img{
        position: absolute;
        top: 5px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }
    ul {
      width: 90%;
      margin: 20px auto;
      background-color: #eee;
      border-radius: 8px;
      cursor: pointer;
      li{
        line-height: 34px;
        border-radius: 8px;
        border-right: 1px solid #ddd;
        color: #000;
        font-size: 14px;
        padding: 0 8px;
        margin: 0 auto;
        text-align: center;
      }
    }
    .diyMoney {
      margin: 10px 15px;
      height: 40px;
      border-bottom: 1px solid #f5f5f5;
      font-size: 14px;
      b {
        color: #333;
      }
      input{
        padding-left:6px;
        height: 30px;
        line-height: 30px;
        border-radius:3px;
        width: 120px;
        text-align: center;
      }
    }
    .btn_div{
      background-color: #FF3B30;
      margin: 0 auto;
      width: 200px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      border-radius: 20px;
      text-align: center;
      cursor: pointer;
    }



  }

</style>
