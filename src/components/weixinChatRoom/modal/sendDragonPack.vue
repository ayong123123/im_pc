<template>
  <div class="send-red-pack">
    <div class="send-content">
      <div class="send-title">
        <p>接龙红包</p>
        <i class="icon-colse"  @click="setModalState('sendDragonRedState')"></i>
      </div>
      <div>
        <ul class="send-button-ul flex">
          <li class="point"  @click="dragonSend.jtype = 2">
            <p :class="{active:dragonSend.jtype == 2}">最佳手气</p>
          </li>
          <li class="point"  @click="dragonSend.jtype = 1">
            <p :class="{active:dragonSend.jtype == 1}">最差手气</p>
          </li>
        </ul>

        <div>
          <div class="red-detail">
            <div class="flex red-count">
              <span>红包个数</span>
              <p>
                <input type="number" placeholder="输入个数" v-model="dragonSend.person" >个
              </p>
            </div>
            <div class="flex red-count">
              <span>金 额</span>
              <p>
                <input type="number" placeholder="输入金额" maxlength="9" v-model="dragonSend.total">元
              </p>
            </div>
            <div class="flex red-count" v-if="passwordShow">
              <span>提款密码</span>
              <p>
                <input class="drawing-pass" type="password" placeholder="输入提款密码" maxlength="22" v-model="dragonSend.AmountPassword">
              </p>
            </div>
          </div>
          <p class="red-notice">
            <span v-if="dragonSend.jtype == 2">最佳手气玩法:抢到金额最多者,赔付</span>
            <span v-else>最差手气玩法:抢到金额最少者,赔付</span>
            <br>
            红包个数范围：3~10
            <br>
            红包金额范围: {{indexStore.indexData.MinAmountjlHb}}~{{indexStore.indexData.MaxAmountjlHb}}
            <br>
            接龙红包不结算红包金额，只结算输赢金额
          </p>

          <!--<div class="red-discount">-->
          <!--<input type="text" maxlength="12" placeholder="恭喜发财，大吉大利" v-model="dragonSend.info" >-->
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
        dragonSend:{
          token:'',
          type:3, // 接龙红包
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
          jtype:2
        },
        passwordShow:false
      }
    },
    created () {
      this.dragonSend.retype =this.msgListStore.activeTyep == 1 ? 2 : 1;
      this.dragonSend.jid = this.msgListStore.activeWindowId;
      this.dragonSend.token = getSession2('token');
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
      "dragonSend.person" (to, from) {
        this.dragonSend.person=parseInt(to);
      }
    },

    mounted () {

    },
    methods:{
      sendRedPack(){
        if(!this.dragonSend.token){
          Message({
            message: "提示:请重新登录",
            type: "warning",
            showClose: true,
          })
          return
        }

        if((this.dragonSend.total < parseInt(this.indexStore.indexData.MinAmountjlHb) || this.dragonSend.total > parseInt(this.indexStore.indexData.MaxAmountjlHb))){
          Message({
            message: '提示:红包金额范围:'+this.indexStore.indexData.MinAmountjlHb+'~'+this.indexStore.indexData.MaxAmountjlHb+'元!',
            type: "warning",
            showClose: true,
          })
          return
        }
        if(this.dragonSend.person < 3 || this.dragonSend.person > 10){
          Message({
            message: "提示:红包个数范围: 3~10个",
            type: "warning",
            showClose: true,
          })
          return
        }
        if(parseInt(this.indexStore.indexData.MinAmountPassword)<=parseInt(this.dragonSend.total)){
          this.passwordShow = true
          if(!this.dragonSend.AmountPassword){
            Message({
              message: "提示:请输入支付密码",
              type: "warning",
              showClose: true,
            })
            return
          }
        }

        this.dragonSend.info = this.dragonSend.total + '(元) - ' + this.dragonSend.person + '(个)'
        this.sendRedPackActionIm(this.dragonSend).then(()=>{
          this.passwordShow = false
          this.setModalState("sendDragonRedState")
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
