<template>
  <div class="send-red-pack">
    <div class="send-content">
      <div class="send-title">
        <p>扫雷红包</p>
        <i class="icon-colse"  @click="setModalState('sendSweepRedState')"></i>
      </div>
      <div>
        <div>
          <div class="red-detail">
            <div class="flex red-count">
              <span>红包个数</span>
              <div class="lei_gs">
                <span @click="saoLeiSend.person = 7" :class="{curr:saoLeiSend.person == 7}">7个</span>
                <span @click="saoLeiSend.person = 9" :class="{curr:saoLeiSend.person == 9}">9个</span>
                <span @click="saoLeiSend.person = 11" :class="{curr:saoLeiSend.person == 11}">11个</span>
              </div>
            </div>
            <div class="flex red-count">
              <span>金 额</span>
              <p>
                <input type="number" placeholder="输入金额" maxlength="9" v-model="saoLeiSend.total">元
              </p>
            </div>
            <div class="flex red-count">
              <span>埋 雷</span>
              <p>
                <input type="number" placeholder="雷值" maxlength="1" v-model="saoLeiSend.thn">值
              </p>
            </div>
            <div class="flex red-count" v-if="passwordShow">
              <span>提款密码</span>
              <p>
                <input class="drawing-pass" type="password" placeholder="输入提款密码" maxlength="22" v-model="saoLeiSend.AmountPassword">
              </p>
            </div>
          </div>
          <p class="red-notice">
            <span>埋雷范围：0~9</span>
            <br>
            红包个数范围:(个数与赔率相关)
            <br>
            红包金额范围：{{indexStore.indexData.MinAmountslHb}}~{{indexStore.indexData.MaxAmountslHb}}
          </p>

          <!--<div class="red-discount">-->
          <!--<input type="text" maxlength="12" placeholder="恭喜发财，大吉大利" v-model="saoLeiSend.info" >-->
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
        saoLeiSend:{
          token:'',
          type:1, // 扫雷红包
          mtype:1,
          retype:'',
          total:'',
          ptotal:'',
          person:7,
          jid:'',
          thn:'',
          AmountPassword:'',
          info:'',
          gtype:1,
        },
        passwordShow:false
      }
    },
    created () {
      this.saoLeiSend.retype =this.msgListStore.activeTyep == 1 ? 2 : 1;
      this.saoLeiSend.jid = this.msgListStore.activeWindowId;
      this.saoLeiSend.token = getSession2('token');
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
      "saoLeiSend.person" (to, from) {
        this.saoLeiSend.person=parseInt(to);
      }
    },

    mounted () {

    },
    methods:{
      sendRedPack(){
        if(!this.saoLeiSend.token){
          Message({
            message: "提示:请重新登录",
            type: "warning",
            showClose: true,
          })
          return
        }
        if((this.saoLeiSend.total < parseInt(this.indexStore.indexData.MinAmountslHb) || this.saoLeiSend.total > parseInt(this.indexStore.indexData.MaxAmountslHb))){
          Message({
            message: '红包金额范围:'+this.indexStore.indexData.MinAmountslHb+'~'+this.indexStore.indexData.MaxAmountslHb +'元!',
            type: "warning",
            showClose: true,
          })
          return
        }
        if(this.saoLeiSend.thn === '' || this.saoLeiSend.thn < 0 || this.saoLeiSend.thn > 9){
          Message({
            message: "提示:雷值范围: 0~9",
            type: "warning",
            showClose: true,
          })
          return
        }
        if(parseInt(this.indexStore.indexData.MinAmountPassword)<=parseInt(this.saoLeiSend.total)){
          this.passwordShow = true
          if(!this.saoLeiSend.AmountPassword){
            Message({
              message: "提示:请输入支付密码",
              type: "warning",
              showClose: true,
            })
            return
          }
        }
        this.saoLeiSend.info = this.saoLeiSend.total + '(元) - ' + this.saoLeiSend.thn + '(雷) - ' +  this.saoLeiSend.person + '(个)'
        this.sendRedPackActionIm(this.saoLeiSend).then(()=>{
          this.passwordShow = false
          this.setModalState("sendSweepRedState")
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
    .lei_gs{
      width: 218px;
      border-radius: 8px;
      background-color: #ccc;
      span {
        display: inline-block;
        width: 70px;
        text-align: center;
        color: #000;
        line-height: 36px;
        border-radius: 8px;
        &.curr{
          background-color: #CD7F32;
          color: #fff;
        }
      }
    }
  }


  }


</style>
