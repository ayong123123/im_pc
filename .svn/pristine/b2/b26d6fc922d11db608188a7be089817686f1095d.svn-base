<template>
  <div class="follow">
    <div class="head_follow">
      <img src="@/assets/weChat/close.png" alt="" @click="setModalState('orderFollowState')">
      <span>{{orderObj.para.cptitle}}</span>
    </div>
    <div class="c_order_fa">
      <span>{{wechatIMstore.daShangObj.nickname}}</span>分享的注单方案
    </div>
    <div class="c_content flex-between">
      <span>投注内容</span>
      <div>
        期号:{{orderObj.para.actionNo}}
      </div>
    </div>
    <div class="betMain">
      <p v-for="(i,index) in orderObj.nameList">
        {{i}}
      </p>
      <p v-if="!orderObj.nameList">
        <i v-for="(i,index) in orderObj.code">{{tochinese(i.actionData)}}<b v-if="orderObj.code.length - 1 > index">,</b></i>
      </p>
    </div>
    <div class="diyMoney ">
      <div class="b_all_money">
        总 金 额 ： {{money}} 元
      </div>
      <div class="flex-between">
        <div style="text-align: left; font-size: 14px;">
          每注金额<input  type="number" placeholder="请输入金额" pattern="[0-9]*" v-model="followMoney" />
        </div>
        <button @click="sureGenTou">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import { Message,MessageBox} from 'element-ui';
  export default {
    data () {
      return {
        money:0,
        followMoney:'',
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
      orderObj(){
        return this.wechatIMstore.daShangObj
      },

    },
    watch: {
      'followMoney'(){
        this.allOrderMoney()
      }
    },
    created () {
      this.followMoney = this.wechatIMstore.daShangObj.code[0].beiShu
      this.allOrderMoney()
    },
    mounted () {

    },
    methods:{
      ...mapActions([
        "chatBetAction"
      ]),
      ...mapMutations([
        "setModalState"
      ]),
      tochinese (str) {
        if(str=="k3hz_da"){ return "大"}
        if(str=="k3hz_xiao"){ return "小"}
        if(str=="k3hz_dan"){ return "单"}
        if(str=="k3hz_shuang"){ return "双"}
        return str;
      },
      allOrderMoney(){
        this.money = 0
        this.wechatIMstore.daShangObj.code.forEach((i)=>{
          this.money += i.actionNum*this.followMoney
        })
      },
      sureGenTou(){
        let me = this

        if(isNaN(this.followMoney*1) || !this.followMoney || this.followMoney*1 <= 0){
          Message({
            message:'请输入合理金额',
            type:"warning",
            showClose:true
          })
          return
        }
        this.followMoney = this.followMoney*1
        var tempData=this.wechatIMstore.daShangObj
        var temp={}
        temp.code=JSON.parse(JSON.stringify(tempData.code));
        temp.code.forEach(function(val,index,arr){
          val.minCharge=val.minCharge || {},
            val.multiple=val.multiple || {},
            delete val.playname;
          delete val.minCharge;
          delete val.multiple;
        })

        temp['actionNo']=tempData.para.actionNo;
        temp['kjTime']=tempData.para.kjTime;
        temp['type']=tempData.para.type;
        temp.zhongduan= 0;
        temp.zhuidata="";
        temp.zhuihao=0;
        temp.betType=3;
        temp.code.forEach(function(val,index,arr){
          val.beiShu=me.followMoney;
        })
        this.chatBetAction(temp)
        this.setModalState('orderFollowState')
      },

    },
  }
</script>
<style lang="less" scoped>
  .follow {
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
    .head_follow {
      height: 40px;
      line-height:40px;
      background-color: #ff0000;
      text-align: center;
      font-size: 16px;
      color:#fff;
      cursor: pointer;
      img{
        position: absolute;
        top: 5px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }
    .c_order_fa {
      text-align: left;
      line-height: 50px;
      font-size: 15px;
      padding-left: 12px;
      span {
        color: #f2c100;
      }
    }
    .c_content {
      background-color: #FFF0F5;
      line-height: 30px;
      padding: 0 12px;
    }
    .betMain {
      width: 100%;
      text-align: left;
      padding: 0 12px;
      height: 80px;
      overflow-Y: scroll;
      border-bottom: 1px solid #ddd;
      border-top: 1px solid #ddd;
      font-size: 13px;
      p {
        padding-left: 0.6399997rem;
        word-wrap: break-word;
        word-break: normal;
        line-height: 22px;
        color: #000;
        text-align: left;
      }
    }
    .diyMoney {
      background-color: #fff6f6;
      padding: 0 12px 12px 12px;
      .b_all_money {
        text-align: left;
        color: #ff0000;
        line-height: 40px;
        font-size: 16px;
      }
      input {
        padding-left: 10px;
        height: 36px;
        line-height: 36px;
        border-radius:5px;
        border: 1px solid #ff2d55;
        margin-right: 5px;
        background-color: #fff6f6;
      }
      button {
        padding: 10px 15px;
        background-color: #d73124;
        color: #fff;
        font-size: 15px;
        border-radius: 5px;
      }

    }


  }

</style>
