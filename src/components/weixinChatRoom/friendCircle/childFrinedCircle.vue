<template>
  <div class="Info-wrapper">
    <div class="newfriend"  @mousedown="windowMove($event)">
      <i class="returnButt point" @click="cancelSend"></i>
      <div class="nickname">{{childIdSend.itname || '好友'}}的朋友圈</div>
      <span></span>
    </div>
    <!-- 内容 -->
    <div class="noneData" v-if="childDataList.length<=0">你的好友还没发布朋友圈</div>
    <div ref="scrollList" class="content-div">
      <ul class="friend-circles"
      :class="{'on': remarkShow}"
      v-if="childDataList.length>0">
        <li
          class="cirlist"
          v-for="(item, index) in childDataList"
          :key="index">
          <div class="friend-overall">
            <img class="friendleft point" v-if="item.head_portrait" v-lazy="item.head_portrait"  @click="enterMessage(item,1)">
            <img class="friendleft point" v-else src="@/assets/weChat/default_avatar.png"  @click="enterMessage(item,1)">
            <div class="friendright" @click="removeIntoState()">
              <p class="send-name point" @click="enterMessage(item,1)">{{item.name}}</p>
              <div class="detailed-introduce">
                <div class="intro-content">
                  <p v-html="item.content" ref="group"></p>
                </div>
              </div>
              <div class="send-img">
                <div @click="setPicture({img: it, state:true})" v-for="it in item.picture">
                  <img v-if="it" v-lazy="it">
                  <img v-else src="@/assets/weChat/notime.jpg">
                </div>
              </div>
              <div class="send-set">
                <div>
                  <span class="send-time">{{$getTimes(item.create_time)}}</span>
                </div>
              </div>
              <div class="commentsUp">
                <span class="triangle" v-if="item.like.length > 0 || item.comment.length > 0"></span>
                <div class="flex-all liveContent" v-if="item.like.length > 0">

                  <!-- 评论下点赞的人 -->
                  <div class="flex-all commentsdown">
                    <i class="nonelike"></i>
                    <div>
                      <span v-for="it in item.like"  @click="enterMessage(it,2)" class="point">{{it.name}}</span>
                    </div>
                  </div>
                </div>
                <!-- 评论的内容 -->
                <ul v-if="item.comment.length > 0">
                  <li
                    class="comment-content flex"
                    v-for="con in item.comment">
                   <p><span class="nameSpan" @click="enterMessage(con,3)">{{con.name}}：</span><span @click.stop="recoveComment(item, con)">{{con.content}}</span></p>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </li>
        <li class="loadingContent" v-if="loadding == 0">加载中，请稍后</li>
        <li class="loadingContent" v-if="loadding == 1">— 没有更多数据了 —</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState ,mapMutations, mapActions } from 'vuex'
  import _config from '../../../configWX/configWX'
  export default {
    props:['childIdSend'],
    data(){
      return{
       // 是否展示所有文本内容
        activeIndex:'-1',
        like:true,
        remarkShow:false,
        // 分页
        parm:{
          self_uid:'',
          friend_uid:'',
          page:1,
          page_size:'10'
        },
        loadding:'',
        clientHeight: 0,
        isKaiGuan: false,
        childDataList:[],
        messgeid:''
      }
    },
    created() {
      this.parm.self_uid = this.getUserId
      this.parm.friend_uid = this.childIdSend.it
      this.getFriendCircleList(this.parm).then(res=>{
        this.childDataList = res.data
        if(this.childDataList.length>=10){
          this.isKaiGuan = true
          this.loadding = 0
        }else{
          this.isKaiGuan = false
          this.loadding = 1
        }
      })
    },
    computed: {
      ...mapGetters(['getUserId']),
      ...mapState([
        'friendCircleStore',
        "chatuserInfoStore"
      ]),
    },
    mounted() {
      this.$nextTick(()=>{
        this.$refs.scrollList.addEventListener("scroll", this.menu);
      })
    },
    methods: {
      ...mapMutations([
        "setPicture",
        "windowMove",
        "setActiveWindow",
        "createFriendChatMessage",
        "sendNewChat"
      ]),
      ...mapActions([
        'getFriendCircleList',
        'getFriendInfoAction',
        'addMsgAction',
        'searchUser',
      ]),
      cancelSend(){
        this.$emit('sendData', false)
      },
      // 点击进入发消息
      enterMessage(i,index){
        if(index == 1){
          this.messgeid = i.uid
        }else if(index == 2){
          this.messgeid = i.l_uid
        }else{
          this.messgeid = i.com_uid
        }
        this.selectFriend(this.messgeid)
        if(this.messgeid != this.getUserId){
          this.getFriendInfoAction({self_uid:this.getUserId,friend_uid:this.messgeid}).then(res=>{

          this.createFriendChatMessage({id:res.id})

          let fromMessage = {
            id:res.id,
            name:res.nickname,
            count:0,
            head_portrait:res.head_portrait,
            remarks_name:res.remarks_name,
          }
          this.sendNewChat({message:fromMessage,type:1,state:true})
          })
        }
      },
      menu() {
        if (this.isKaiGuan) {
          let scroll = this.getScrollTop() + this.getWindowHeight() - this.getScrollHeight();
          if (scroll == 0) {
            this.parm.page++;
            this.parm.self_uid = this.getUserId
            this.loadding = 0
            this.getFriendCircleList(this.parm).then(res=>{
              if(res.code == 10000){
                for(var i = 0;i<res.data.length;i++){
                  this.childDataList.push(res.data[i])
                }
                if(res.data.length>10){
                  this.loadding = 0
                  this.isKaiGuan = true;
                }else{
                  this.loadding = 1
                  this.isKaiGuan = false;
                }
              }else{
                for(var i = 0;i<res.data.length;i++){
                  this.childDataList.push([])
                }
                this.loadding = 1
                this.isKaiGuan = false;
              }
            })
          }
        }
      },
      //滚动条在Y轴上的滚动距离
      getScrollTop() {
        var documentScrollTop = 0;
        documentScrollTop = this.$refs.scrollList.scrollTop;
        return documentScrollTop;
      },
      //文档的总高度
      getScrollHeight() {
        var documentScrollHeight = 0;
        documentScrollHeight = this.$refs.scrollList.scrollHeight;
        return documentScrollHeight;
      },
      //浏览器视口的高度
      getWindowHeight() {
        var windowHeight = 0;
        windowHeight = this.$refs.scrollList.clientHeight;
        return windowHeight;
      },
      // 关闭更多
      removeIntoState () {
        this.childDataList.map(r => {
          this.$set(r, 'intoState', false)
        })
        this.remarkShow = false
      },
    },
  }
</script>

<style lang="less" scoped>
.flex-all{
  display: flex;
  flex-wrap: wrap;
}
  .newfriend {
    height: 60px;
    padding: 28px 30px 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    justify-content: space-between;
    .nickname {
      font-size: 18px;
    }
    .returnButt{
      width: 25px;
      height: 25px;
      background-size: 25px 25px;
      background-image: url('../../../assets/weChat/return.png');
      display: inline-block;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }
  .content-div{
    height: 590px;
    overflow-y: auto;
  }
  .friend-circles{
    &.on{
      padding-bottom: 57px;
    }
    .cirlist{
      border-bottom: 1px solid#e7e7e7;
      .friend-overall{
        width: 450px;
        margin: 10px auto;
        display: flex;
        .friendleft{
          width: 45px;
          height: 45px;
          border-radius: 3px;
          min-width: 45px;
        }
        .friendright{
          width: 400px;
          margin-left: 10px;
          .send-name{
            color: #556F96;
            font-size: 18px;
            font-weight: 500;
          }
          .total-introduce{
            color: #020202;
            font-size: 14px;
            height: auto;
            overflow: hidden;
            .intro-content{
              max-height:125px;
              line-height: 21px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 6;
              overflow: hidden;
              p{
                height: 100%;
              }
            }
          }
          .detailed-introduce {
            font-size: 14px;
            color: #020202;
            position: relative;
            overflow: hidden;
            .intro-content{
              width: 100%;
              line-height: 21px;
              p{
                height: 100%;
              }
            }
          }
          .send-all{
            color: #5866B1;
            font-size: 14px;
            line-height: 25px;
          }
          i{
            display: inline-block;
            background-repeat: no-repeat;
            background-position: center center;
          }
          .send-img{
            display: flex;
            flex-wrap: wrap;
            div{
              width: 30%;
              height: 100px;
              margin-left: 5px;
              margin-top: 5px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            div:nth-child(3n+1){
              margin-left: 0;
            }
          }
          .send-set{
            position: relative;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            .send-time{
              color:#B3B3B3;
            }
          }
          .commentsUp{
            position: relative;
            background: rgba(0,0,0, 0.1);
            color: #2b5076fc;
            font-size: 14px;
            margin-top: 8px;
            position: relative;
            .commentsdown{
              width: 100%;
              i{
                width: 5%;
              }
              div{
                width: 94%;
                span:after{
                  content: ','
                }
                span:last-child:after{
                  content: ''
                }
              }
            }
            >ul{
              position: relative;
              &:before{
                position: absolute;
                content: '';
                top: 0;
                left: 0;
                width: 100%;
                border-top: 1px solid #bbb;
                transform: scaleY(.5);
              }
              padding: 5px 10px;
              li{
                margin-bottom: 3px;
              }
            }
            i{
              width: 15px;
              height: 22px;
              background-size: 15px 15px;
              background-image: url('../../../assets/weChat/bigzan.png');
              margin-right: 3px;
              // margin-top: 3px;
            }
            li{
              margin-right: 3px;
              p{
                color: #333;
                .nameSpan{
                  color: #2b5076fc;
                }
              }
            }
            .comment-content{
              cursor: pointer;
            }
            .liveContent{
              position: relative;
              padding: 5px;
            }
          }
          .triangle{
            width: 0;
            height: 0;
            border-top: 10px solid transparent;
            border-right: 10px solid transparent;
            border-left: 10px solid transparent;
            position: absolute;
            top: -20px;
            left: 10px;
          }
          .triangle:after {
            content: "";
            border-top: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid rgba(0,0,0, 0.1);
            border-left: 8px solid transparent;
            position: absolute;
            top: -6px;
            left: -8px;
          }
        }
      }
    }
  }
.noneData{
  text-align: center;
  font-size: 14px;
  line-height: 100px;
}
.loadingContent{
  text-align: center;
  line-height: 40px;
  border: none;

}
</style>

