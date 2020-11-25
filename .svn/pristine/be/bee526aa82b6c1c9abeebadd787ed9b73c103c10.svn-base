<template>
    <div class="red-detail-open" style="background: #fff;box-shadow: 0 0 3px rgba(0,0,0,.3);" v-if="transferState">
        <i class="icon-set" @click="setModalState('transferDetail')"></i>

        <div class="transfer_box">
            <p class="title">转账详情</p>

            <div class="pic_attr">
                <img :src="transferState.pic_attr || defaultSrc" alt="">
            </div>


            <div class="name">{{transferState.nickname}}</div>
            <div class="amount">￥{{transferState.amount}}</div>
            <div class="jycg">交易成功</div>
            <div class="item" style="margin-top: 10px;">
                <p>{{transferState.type}}方式</p>
                <p>余额</p>
            </div>

            <div class="item">
                <p>对方账号</p>
                <p>{{transferState.username}}</p>
            </div>

            <div class="item">
                <p>转账备注</p>
                <p style="width: 80%;text-align: right;">{{transferState.remarks || ''}}</p>
            </div>


            <div class="item" style="margin-top:10px;">
                <p>创建时间</p>
                <p>{{transferState.actionTime}}</p>
            </div>

            <div class="item">
                <p>订单号</p>
                <p>{{transferState.orderNums}}</p>
            </div>

            <!--<div class="header-portrait" v-if="transferState.pic_attr">-->
                <!--<img :src="wechatIMstore.transferDetail.pic_attr || defaultSrc ">-->
                <!--<p class="name">{{wechatIMstore.transferDetail.nickname}}</p>-->
            <!--</div>-->

            <!--<p class="p1">{{wechatIMstore.transferDetail.amount}}</p>-->
            <!--<p class="p2">交易成功</p>-->

            <!--<div style="" class="tran-list">-->
                <!--<p>-->
                    <!--<span>{{wechatIMstore.transferDetail.type}}方式</span>-->
                    <!--<span>余额</span>-->
                <!--</p>-->
                <!--<p>-->
                    <!--<span>转账备注</span>-->
                    <!--<span>{{wechatIMstore.transferDetail.remarks || " "}}</span>-->
                <!--</p>-->
                <!--<p>-->
                    <!--<span>对方账号</span>-->
                    <!--<span>{{wechatIMstore.transferDetail.username}}</span>-->
                <!--</p>-->
            <!--</div>-->

            <!--<div style="" class="tran-list">-->
                <!--<p>-->
                    <!--<span>创建时间</span>-->
                    <!--<span>{{wechatIMstore.transferDetail.actionTime}}</span>-->
                <!--</p>-->
                <!--<p>-->
                    <!--<span>订单号</span>-->
                    <!--<span class="copy-text">{{wechatIMstore.transferDetail.orderNums}}</span>-->
                <!--</p>-->
            <!--</div>-->

        </div>
    </div>
</template>

<script>
  import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
  import defaultSrc from '@/assets/weChat/default_avatar.png';
  export default {
    props:['msg'],
    data () {
      return {
        defaultSrc:defaultSrc,
        rowId:''
      }
    },
    computed:{
      ...mapState([
        "wechatIMstore",
        "chatuserInfoStore"
      ]),

      transferState(){
        return this.wechatIMstore.transferDetail;
      },
      detailState(){
        if(this.firstState.data.status == 0 && this.firstState.data.isview == 0) {
          return false
        }else{
          return true
        }
      }
    },
    watch: {

    },
    created () {
      var id = localStorage.getItem('transferId');
      this.getTransferDetail({rowId:id});
    },
    mounted () {

    },
    methods:{
      ...mapMutations([
        "setModalState",
        "setGetOrCheck"
      ]),
      ...mapActions(['getTransferDetail'])
    },
  }
</script>
<style lang="less" scoped>
    .icon-set{
        position: absolute;
        width: 40px;
        height: 40px;
        background: url('../../../assets/weChat/close.png') no-repeat;
        background-size: 30px 30px;
        display: inline-block;
        background-position: center center;
        cursor: pointer;
        top:0;
        right: 0;
    }
    .red-detail-open {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 120;
        font-size:14px;
        width: 330px;
        height: 580px;
        border-radius: 5px;
        background-image: url('../../../assets/weChat/red-background_0.png');
        background-size: 100% 100%;
        text-align: center;
        color: #FDE0AF;

        .transfer_box {
            padding-top: 20px;
            color: #333;
            text-align: center;
            .title{
                font-size: 20px;
                font-weight: bold;
            }
            .pic_attr{
                width: 100px;
                height: 100px;
                margin: 0 auto;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .name {
                margin: 10px 0;
            }
            .amount {
                font-size: 20px;
                font-weight: bold;
            }
            .jycg{
                font-size: 14px;
                color: #999;
            }
            .item{
                /*border: 1px solid red;*/
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                padding: 5px 10px;
                >p:first-of-type{
                    color: #999;
                }
            }

        }
    }
</style>
