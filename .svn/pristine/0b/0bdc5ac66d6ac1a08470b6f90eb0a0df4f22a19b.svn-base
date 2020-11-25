<template>
  <div class="send-red-pack">
    <div class="send-content">
      <div class="send-title">
        <p>牛牛红包</p>
        <i class="icon-colse"  @click="setModalState('sendBullRedState')"></i>
      </div>
      <div>
        <ul class="send-button-ul flex">
          <li class="point"  @click="niuniuSend.jtype = 1">
            <p :class="{active:niuniuSend.jtype == 1}">普通玩法</p>
          </li>
          <li class="point"  @click="niuniuSend.jtype = 2">
            <p :class="{active:niuniuSend.jtype == 2}">多倍玩法</p>
          </li>
        </ul>

        <div>
          <div class="red-detail">
            <div class="flex red-count">
              <span>红包个数</span>
              <p>
                <input type="number" placeholder="输入个数" v-model="niuniuSend.person" >个
              </p>
            </div>
            <div class="flex red-count">
              <span>金 额</span>
              <p>
                <input type="number" placeholder="输入金额" maxlength="9" v-model="niuniuSend.total">元
              </p>
            </div>
            <div class="flex red-count" v-if="passwordShow">
              <span>提款密码</span>
              <p>
                <input class="drawing-pass" type="password" placeholder="输入提款密码" maxlength="22" v-model="niuniuSend.AmountPassword">
              </p>
            </div>
          </div>
          <p class="red-notice">
            <span v-if="niuniuSend.jtype == 1">普通玩法:一比一进行赔付</span>
            <span v-else>多倍玩法:牛7、牛8两倍，牛9三倍，牛牛四倍</span>
            <br>
            红包个数范围：2~10
            <br>
            红包金额范围: {{indexStore.indexData.MinAmountnnHb}}~{{indexStore.indexData.MaxAmountnnHb}}
            <br>
            牛牛红包不结算红包金额，只结算输赢金额
          </p>

          <!--<div class="red-discount">-->
            <!--<input type="text" maxlength="12" placeholder="恭喜发财，大吉大利" v-model="niuniuSend.info" >-->
          <!--</div>-->
        </div>
        <div class="red-sure" >
          <button @click="sendRedPack">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import {Message} from 'element-ui'
  import {getchar,getSession2} from '@/common/common'
  import md5 from 'js-md5'
  export default {
    data () {
      return {
        niuniuSend:{
          token:'',
          type:2, // 牛牛红包
          mtype:1,
          retype:'',
          total:'',
          ptotal:'',
          person:'',
          jid:'',
          thn:'',
          AmountPassword:'',
          info:'',
          gtype:1,
          jtype:1
        },
        passwordShow:false
      }
    },
    created () {
      this.niuniuSend.retype =this.msgListStore.activeTyep == 1 ? 2 : 1;
      this.niuniuSend.jid = this.msgListStore.activeWindowId;
      this.niuniuSend.token = getSession2('token');
    },
    computed:{
      ...mapState([
        "chatListStore",
        "msgListStore",
        "indexStore"
      ]),
      ...mapGetters([
        "selectedChat",
        "getUserId"
      ]),
    },
    watch: {
      "niuniuSend.person" (to, from) {
        this.niuniuSend.person=parseInt(to);
      }
    },

    mounted () {

    },
    methods:{
      sendRedPack(){
        if(!this.niuniuSend.token){
          Message({
            message: "提示:请重新登录",
            type: "warning",
            showClose: true,
          })
          return
        }
        if((this.niuniuSend.total < parseInt(this.indexStore.indexData.MinAmountnnHb) || this.niuniuSend.total > parseInt(this.indexStore.indexData.MaxAmountnnHb))){
          Message({
            message: '提示:红包金额范围:'+this.indexStore.indexData.MinAmountnnHb+'~'+this.indexStore.indexData.MaxAmountnnHb+'元!',
            type: "warning",
            showClose: true,
          })
          return
        }
        if(this.niuniuSend.person < 2 || this.niuniuSend.person > 10){
          Message({
            message: "提示:红包个数范围: 2~10个",
            type: "warning",
            showClose: true,
          })
          return
        }
        if(parseInt(this.indexStore.indexData.MinAmountPassword)<=parseInt(this.niuniuSend.total)){
          this.passwordShow = true
          if(!this.niuniuSend.AmountPassword){
            Message({
              message: "提示:请输入支付密码",
              type: "warning",
              showClose: true,
            })
            return
          }
        }

        this.niuniuSend.info = this.niuniuSend.total + '(元) - ' + this.niuniuSend.person + '(个)'
        this.sendRedPackActionIm(this.niuniuSend).then(()=>{
          this.passwordShow = true
          this.setModalState("sendBullRedState")
        })


      },
      ...mapActions([
        "sendRedPackActionIm"
      ]),
      ...mapMutations([
        "setModalState"
      ]),

    },
  }
</script>
<style lang="less" scoped>
  .flex{
    display: flex;
  }
  .active{
    color: #D24653;
    border-bottom:2px solid #D24653;
  }
  .icon-colse{
    width: 40px;
    height: 40px;
    background: url('../../../assets/weChat/close.png') no-repeat;
    background-size: 20px 20px;
    display: inline-block;
    background-position: center center;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 5px;
  }
  .send-red-pack {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    transform: translate(-50%, -50%) scale(1);
  .send-content{
    width: 350px;
    height: 460px;
    background: #ECEDEE;
    border-radius: 10px;
  .send-title{
    position: relative;
  p{
    background: #D13D4B;
    text-align: center;
    color: white;
    line-height: 50px;
    font-size: 18px;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
  }
  }
  .send-button-ul{
    justify-content: space-around;
    align-items: center;
    background: #ECEDEE;
    line-height: 40px;
    font-size: 14px;
  li{
    width: 100%;
    text-align: center;
  p{
    width: 48%;
    margin: auto;
  }
  }
  }
  .red-count{
    justify-content: space-between;
    color:#333;
    padding: 10px 25px;
    font-size: 14px;

  span{
    color: #5E5C5E;
  }
  input{
    width: 60px;
    background-color: #fff;
  }
  .drawing-pass{
    width: 80px;
  }
  }
  .red-notice{
    font-size: 14px;
    padding: 10px 20px;
  }
  .red-discount{
    width: 100%;
  input{
    width: 100%;
    height: 50px;
    padding: 0 20px;
  }
  }
  .red-sure{
    width: 100%;
    text-align: center;
  button{
    width: 60%;
    background-color: #D13D4B;
    line-height: 35px;
    border-radius: 5px;
    color: white;
    margin-top: 20px;
    font-size: 16px;
  }
  }
  }
  .red-detail{
    background: #FFFFFF;
  }


  }


</style>
