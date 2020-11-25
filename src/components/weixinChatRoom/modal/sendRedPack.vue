<template>
  <div class="send-red-pack">
    <div class="send-content">
      <div class="send-title">
        <p>普通红包</p>
        <i class="icon-colse"  @click="setModalState('sendRedPackState')"></i>
      </div>
      <!-- 私发 -->
      <div v-if="msgListStore.activeTyep == 1">
        <p class="red-notice">最低金额: {{indexStore.indexData.MinAmountHb}}元, 最大金额: {{indexStore.indexData.MaxAmountHb}}元</p>
        <div>
          <div class="red-detail">
            <div class="flex red-count">
              <span>总 金 额</span>
              <p>
                <input  v-model="sendParams.total" pattern="[0-9]*" type="number" placeholder="0.00">元
              </p>
            </div>

            <div class="flex red-count"  v-if="passwordShow">
              <span>提款密码</span>
              <p>
                <input class="drawing-pass" placeholder="支付密码" type="password" maxlength="22" v-model="sendParams.AmountPassword">
              </p>
            </div>
          </div>
          <p class="red-notice"></p>
          <div class="red-discount">
            <input type="text" v-model="sendParams.info" placeholder="恭喜发财，大吉大利" maxlength="12">
          </div>
        </div>

        <div class="red-sure">
          <button @click="sendRedPack">确定</button>
        </div>
      </div>
      <!-- 群发 -->
      <div v-else>
        <ul class="send-button-ul flex">
          <li class="point" v-for="(item,index) in listmenu" :key="index" @click="changeMenu(index)">
            <p :class="{active:changeIndex == index}">{{item}}</p>
          </li>
        </ul>
        <p class="red-notice">最低金额: {{indexStore.indexData.MinAmountHb}}元, 最大金额: {{indexStore.indexData.MaxAmountHb}}元</p>
        <div>
          <div class="red-detail">
            <div class="flex red-count">
              <span>红包个数</span>
              <p>
                <input type="number" placeholder="输入个数" v-model="sendParams.person" >个
              </p>
            </div>
            <div class="flex red-count">
              <span>金 额</span>
              <p>
                <input type="number" placeholder="输入金额" maxlength="9" v-model="sendParams.total">元
              </p>
            </div>
            <div class="flex red-count" v-if="changeIndex == 1">
              <span>总 金 额</span>
              <p>
                {{allMoney || '0.00'}}元
              </p>
            </div>
            <div class="flex red-count" v-if="passwordShow">
              <span>提款密码</span>
              <p>
                <input class="drawing-pass" type="password" placeholder="输入提款密码" maxlength="22" v-model="sendParams.AmountPassword">
              </p>
            </div>
          </div>

          <p v-if="changeIndex == 0" class="red-notice">小伙伴领取的金额随机</p>
          <p v-if="changeIndex == 1" class="red-notice">小伙伴领取的金额平分</p>
          <div class="red-discount">
            <input type="text" maxlength="12" placeholder="恭喜发财，大吉大利" v-model="sendParams.info" >
          </div>
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
        listmenu:['拼手气红包','每人固定金额'],
        changeIndex:0,
        sendParams:{
          token:'',
          type:0, // 此页面为固定普通红包 0
          mtype:1,
          retype:'',
          total:'',
          ptotal:'',
          person:'',
          jid:'',
          thn:'',
          AmountPassword:'',
          info:'',
        },
        passwordShow:false
      }
    },
    created () {
      this.sendParams.token = getSession2('token');
      this.sendParams.retype = this.msgListStore.activeTyep == 1 ? 2 : 1;
      this.sendParams.jid = this.msgListStore.activeWindowId;
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
      allMoney(){
        if(this.sendParams.mtype == 1){
          return this.sendParams.total*1
        }else{
          return this.sendParams.total*this.sendParams.person
        }
      }
    },
    watch: {
      "sendParams.person" (to, from) {
        this.sendParams.person=parseInt(to);
      }
    },

    mounted () {

    },
    methods:{
      changeMenu(index){
        this.changeIndex = index
        if(index == 0){
          this.sendParams.mtype = 1
        }else{
          this.sendParams.mtype = 2
        }
      },
      sendRedPack(){
        if(!this.sendParams.token){
          Message({
            message: "提示:请重新登录",
            type: "warning",
            showClose: true,
          })
          return
        }
        if(this.sendParams.total < parseInt(this.indexStore.indexData.MinAmountHb) || this.sendParams.total > parseInt(this.indexStore.indexData.MaxAmountHb)){
          Message({
            message: "提示:红包金额范围"+this.indexStore.indexData.MinAmountHb + '~' + this.indexStore.indexData.MaxAmountHb +'元!',
            type: "warning",
            showClose: true,
          })
          return
        }
        if(parseInt(this.indexStore.indexData.MinAmountPassword)<=parseInt(this.sendParams.total)){
          this.passwordShow = true
          if(!this.sendParams.AmountPassword){
            Message({
              message: "提示:请输入支付密码",
              type: "warning",
              showClose: true,
            })
            return
          }
        }
        //      单聊红包
        if(this.sendParams.retype == 2) {
          this.sendParams.ptotal = this.sendParams.total
          this.sendParams.mtype = 2
          this.sendParams.info = this.sendParams.info || '恭喜发财，大吉大利';
          this.sendParams.person = 1

          this.sendRedPackActionIm(this.sendParams).then(()=>{
            this.passwordShow = false
            this.setModalState('sendRedPackState')
          })


        }
        //      群红包
        if(this.sendParams.retype == 1){
//            随机红包
          if(this.sendParams.mtype == 1){
            if(this.sendParams.person < 1){
              Message({
                message: "提示:红包至少个数为1",
                type: "warning",
                showClose: true,
              })
              return
            }
            this.sendParams.info = this.sendParams.info || '恭喜发财，大吉大利'
            this.sendParams.total = this.sendParams.total*1
            this.sendRedPackActionIm(this.sendParams).then(()=>{
              this.passwordShow = false
              this.setModalState('sendRedPackState')
            })


          }else{
            if(this.sendParams.person < 1){
              Message({
                message: "提示:红包至少个数为1",
                type: "warning",
                showClose: true,
              })
              return
            }
            this.sendParams.ptotal = this.sendParams.total
            this.sendParams.total = this.sendParams.total*this.sendParams.person
            this.sendParams.info = this.sendParams.info || '恭喜发财，大吉大利'

            this.sendRedPackActionIm(this.sendParams).then(() => {
              this.passwordShow = false
              this.setModalState('sendRedPackState')
            })


          }
        }


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
        padding: 10px 25px;
        color:#333;
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
