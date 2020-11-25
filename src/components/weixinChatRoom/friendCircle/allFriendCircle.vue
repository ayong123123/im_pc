<template>
  <div class="Info-wrapper">
    <div class="newfriend"  @mousedown="windowMove($event)">
      <div class="nickname">朋友圈</div>
      <i class="photos point" @click="sendFriendCircle"></i>
    </div>
    <!-- 内容 -->
    <div class="noneData" v-if="showContent == '0'">暂无内容，去发表一条朋友圈吧</div>
    <div ref="scrollList" class="content-div">
      <!-- <div class="friend-message">
        <div class="flex point">
          <img src="@/assets/weChat/default_avatar.png" alt="">
          <span>1条新消息</span>
          <i></i>
        </div>
      </div> -->
      <ul class="friend-circles"
      :class="{'on': remarkShow}"
      v-if="showContent == '1'">
        <li
          class="cirlist"
          v-for="(item, index) in dataList"
          :key="index">
          <div class="friend-overall">
            <!-- 点击进入发消息 -->
            <img class="friendleft point" v-if="item.head_portrait" v-lazy="item.head_portrait" @click="enterMessage(item,1)">
            <img class="friendleft point" v-else src="@/assets/weChat/default_avatar.png"  @click="enterMessage(item,1)">
            <div class="friendright" @click="removeIntoState()">
              <p class="send-name point"  @click="enterFriendList(item)">{{item.name}}</p>
              <div :class="activeIndex == index?'detailed-introduce':'total-introduce'">
                <div class="intro-content">
                  <p v-html="item.content" ref="group"></p>
                </div>
              </div>
              <span class="send-all point"  v-if="getHeight(index)>126" @click="changeFoldState(item,index)">{{activeIndex == index?'收起':'全文'}}</span>
              <div class="send-img">
                <div @click="setPicture({img: it, state:true})" v-for="it in item.picture">
                  <img v-if="it" v-lazy="it">
                  <img v-else src="@/assets/weChat/notime.jpg">
                </div>
              </div>
              <div class="send-set">
                <div>
                  <span class="send-time">{{$getTimes (item.create_time)}}</span>
                  <!-- 判断是否为自己发的 -->
                  <span class="send-detal" v-if="item.uid == getUserId" @click="delMoments(item)">删除</span>
                </div>
                <i class="point send-i" @click.stop="moreContent(item)"></i>
                <transition name="showbox">
                  <div class="emojiBox" v-if="item.intoState">
                    <div class="emojileft point" @click="aLike(item, index)">
                      <i class="nonelike"></i>
                      <a>{{getLikeState(item.like)?'取消':'赞'}}</a>
                    </div>
                    <div class="emojiright point" @click.stop="remarkContent(item, index)"><i></i><a>评论</a></div>
                  </div>
                </transition>
              </div>
              <div class="commentsUp">
                <span class="triangle" v-if="item.like.length > 0 || item.comment.length > 0"></span>
                <div class="flex-all liveContent" v-if="item.like.length > 0">

                  <!-- 评论下点赞的人-->
                  <div class="flex-all commentsdown">
                    <i class="nonelike"></i>
                    <!-- <div>{{nameData(item.like)}}</div> -->
                    <div>
                      <span v-for="it in item.like"  @click="enterMessage(it,2)" class="point">{{it.name}}</span>
                    </div>
                  </div>
                </div>
                <!-- 评论的内容 -->
                <ul v-if="item.comment.length > 0">
                  <li
                    class="comment-content flex"
                    v-for="con in item.comment"
                   ><p><span class="nameSpan" @click="enterMessage(con,3)">{{con.name}}：</span><span @click.stop="recoveComment(item, con)">{{con.content}}</span></p>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </li>
        <li class="cirlist loadingContent" v-if="loadding == 0">加载中，请稍后</li>
        <li class="cirlist loadingContent" v-if="loadding == 1">— 没有更多数据了 —</li>
      </ul>
    </div>

      <!-- 评论 -->
      <div class="CommentsV2-footer" v-if="remarkShow">
        <div class="commentsleft">
          <el-input
            ref="commentInput"
            type="textarea"
            autosize
            autofocus
            :placeholder=placeConetent
            v-model="friendComment">
          </el-input>
        </div>
        <button type="button" class="singleButton" @click="sendContent">发布</button>
      </div>
  </div>
</template>

<script>
  import { mapGetters, mapState ,mapMutations, mapActions } from 'vuex'
  import _config from '../../../configWX/configWX'
  export default {
    data(){
      return{
        like:true,
        friendComment:'',
        remarkShow:false,
        targetInfo: {},
        com_id: '',
        placeConetent:'',
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
        dataList:[],
        conName:'',
        // 是否展示所有文本内容
        activeIndex:'-1',
        offdata:[],
        showContent:'0',
        messgeid:''
      }
    },
    created() {
      this.parm.self_uid = this.getUserId
      this.getFriendListAction(this.parm).then(res=>{
        if(res.code == 10000){
          this.showContent = '1'
          this.dataList = res.data
          if(this.dataList.length>=10){
            this.isKaiGuan = true
            this.loadding = 0
          }else{
            this.isKaiGuan = false
            this.loadding = 1
          }
        }else{
          this.showContent = '0'
        }
      })
    },
    computed: {
      ...mapGetters(['getUserId']),
      ...mapState([
        'friendCircleStore',
        "chatuserInfoStore",
        "msgListStore"
      ]),
      // dataList () {
      //   return this.friendCircleStore.dataFriendList
      // },
    },
    mounted() {
      this.$nextTick(()=>{
        this.$refs.scrollList.addEventListener("scroll", this.menu);
      })
    },
    watch:{
      'dataList'(){
        setTimeout(() => {
          this.getDataHe()
        }, 100);
      }
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
        'getFriendListAction',
        'addLikeAction',
        'deleteMoment',
        'addComment',
        'cancelLikeAction',
        'getFriendCircleList',
        'getFriendInfoAction',
        'searchUser',
      ]),
      getHeight(data){
        for(var i = 0;i<this.offdata.length;i++){
          if(data == i){
            return this.offdata[i]
          }
        }
      },

      getDataHe(){
        this.offdata = []
        let divs = this.$refs.group
        for(let i =0 ;i<divs.length;i++){
          this.offdata.push(divs[i].offsetHeight)
        }
      },
      menu() {
        if (this.isKaiGuan) {
          let scroll = this.getScrollTop() + this.getWindowHeight() - this.getScrollHeight();
          if (scroll == 0) {
            this.parm.page++;
            this.parm.self_uid = this.getUserId
            this.loadding = 0
            this.getFriendListAction(this.parm).then(res=>{
              if(res.code == 10000){
                for(var i = 0;i<res.data.length;i++){
                  this.dataList.push(res.data[i])
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
                  this.dataList.push([])
                }
                this.loadding = 1
                this.isKaiGuan = false;
              }
            })
          }
        }
      },
      // 进入朋友的个人朋友圈
      enterFriendList(item){
        if(item.uid != this.getUserId){
          let data = {
            it:item.uid,
            itname:item.name
          }
          this.$emit('childData', data)
        }
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

      nameData(data){
        return data.map(res=>{
          return res.name
        }).join(',')
      },
      changeFoldState(item,index){
        this.activeIndex = this.activeIndex == index ? -1 : index;
      },
      // 展开/关闭更多
      moreContent(item){
        // 点击点赞和评论时只能显示一个出来，其他关闭
        let flag = item.intoState
        for (let k in this.dataList) {
          if (item.id == this.dataList[k].id) {
            this.$set(this.dataList[k], 'intoState', !item.intoState)
          } else {
            this.$set(this.dataList[k], 'intoState', false)
            this.remarkShow = false
          }
        }
      },
      // 关闭更多
      removeIntoState () {
        this.dataList.map(r => {
          this.$set(r, 'intoState', false)
        })
        this.remarkShow = false
      },
      // 发朋友圈
      sendFriendCircle(){
        this.$emit('sendData', true)
      },
      // 删除朋友圈
      delMoments (item) {
        this.$confirm('是否删除该条朋友圈', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMoment({
            self_uid: this.getUserId,
            fcm_id: item.id
          }).then(res=>{
            let index = this.dataList.findIndex(r=>r.id == res.id)
            this.dataList.splice(index,1)
          })

        }).catch(() => {

        });
      },
      remarkContent(item, k){
        // item.uid != getUserId
        if(item.uid != this.getUserId){
          this.targetInfo = item
          this.remarkShow = !this.remarkShow
          this.placeConetent = "评论"
          this.$set(this.dataList[k], 'intoState', false)
          if (this.remarkShow) {
            // 默认把回复id清空
            this.com_id = ''
            this.$refs.commentInput && this.$refs.commentInput.focus()
          }
        }else{
          this.$notify({
            title: '警告',
            message: '不能评论自己',
            type: 'warning'
          });
          this.$set(this.dataList[k], 'intoState', false)
        }
      },
      // 点赞
      aLike(item,index){
        let flag = this.getLikeState(item.like)
        if (flag) {//取消点赞
          this.cancelLikeAction({
            self_uid: this.getUserId,
            fcmid: item.id,
          }).then(res=>{
            if(res.id){
              for(let k in this.dataList){
                if(this.dataList[k].id == res.id){
                  let index = this.dataList[k].like.findIndex(r => r.l_uid == this.getUserId)
                  this.dataList[k].like.splice(index,1)
                }
              }
            }
          })
        }else{//点赞
          this.addLikeAction({
            likeUid: this.getUserId,
            fcmid: item.id,
            circleUid: item.uid
          }).then(res=>{
            if(res.id){
              for(let k in this.dataList){
                if(this.dataList[k].id == res.id){
                  this.dataList[k].like.push(res.data)
                }
              }
            }
          })
        }
      },
      // 传入点赞数组是否存在自己的id  返回true或false
      getLikeState (arr) {
        if (arr.length == 0 || !arr) return false;
        return arr.some(r => r.l_uid == this.getUserId)
      },
      // 发送评论
      sendContent(){
        if(this.friendComment){
          this.addComment({
            comUid: this.getUserId,
            fcmid: this.targetInfo.id,
            circleUid: this.targetInfo.uid,
            content: this.friendComment,
            repeatUid: this.com_id,
            conName:this.conName
          }).then(res => {
              this.friendComment = ''
              this.remarkShow = false
              for(let k in this.dataList){
                if(this.dataList[k].id == res.id){
                  this.dataList[k].comment.push(res.data)
                }
              }
          })
        } else {
          this.$message('请输入要评论的内容')
        }
      },
      // 二级评论
      recoveComment (item, con) {
        if(this.getUserId != con.com_uid){
          this.targetInfo = item
          this.com_id = con.com_uid
          this.remarkShow = true
          this.conName = con.name
          this.placeConetent = `回复${con.name}:`
        }
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
    .photos{
      width: 25px;
      height: 25px;
      background-size: 25px 25px;
      background-image: url('../../../assets/weChat/photo.png');
      display: inline-block;
      background-repeat: no-repeat;
      background-position: center center;
    }
  }
  .content-div{
    height: 590px;
    overflow-y: auto;
    .friend-message{
      padding: 20px 0 10px 0;
      border-bottom: 1px solid#e7e7e7;
      div{
        margin: auto;
        width: 160px;
        height: 42px;
        background: #393939;
        border-radius: 5px;
        justify-content: space-around;
        img{
          width: 25px;
          height: 25px;
        }
        span{
          color: white;
        }
        i{
          width: 25px;
          height: 25px;
          background-size: 25px 25px;
          background-image: url('../../../assets/weChat/rightarr.png');
          display: inline-block;
          background-repeat: no-repeat;
          background-position: center center;
        }
      }
    }
  }
  .friend-circles{
    &.on{
      padding-bottom: 57px;
    }
    .cirlist{
      border-bottom: 1px solid#e7e7e7;
      .friend-overall{
        width: 500px;
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
              width: 32%;
              height: 100px;
              margin-left: 7px;
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
            .send-detal{
              margin-left: 10px;
              color: #5866B1;
              cursor: pointer;
            }
            .send-i{
              width: 35px;
              height: 35px;
              background-image: url('../../../assets/weChat/more.png');
              background-size: 100% 100%;
            }
            .emojiBox {
              position: absolute;
              display: flex;
              flex-wrap: wrap;
              top: 0px;
              right: 33px;
              width: 140px;
              height: 32px;
              padding: 5px;
              color: white;
              background-color: #4C5154;
              border-radius: 5px;
              &.showbox-enter-active, &.showbox-leave-active {
                transition: all .5s;
              }
              &.showbox-enter,&.showbox-leave-active {
                opacity: 0;
              }
              div{
                width: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                a{
                  margin-left: 5px;
                  line-height: 20px;
                  color: white;
                  text-decoration:underline;
                }
              }
              .emojileft{
                border-right: 1px solid #404548;
                .nonelike{
                    width: 15px;
                    height: 22px;
                    background-size: 15px 15px;
                    background-image: url('../../../assets/weChat/zan.png');
                  }
                .havelike{
                  width: 22px;
                  height: 25px;
                  background-image: url('../../../assets/weChat/bigzan.png');
                  background-size: 25px 25px;
                  transform: scale(0.8);
                }
              }
              .emojiright{
                i{
                  width: 15px;
                  height: 22px;
                  background-size: 15px 15px;
                  background-image: url('../../../assets/weChat/remark.png');

                }
              }
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
              margin-top: 1px;
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
              // div{

              // }
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
  .CommentsV2-footer{
    position: absolute;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    width: 548.2px;
    background-color: #F2F2F2;
    padding: 10px;
    border-top: 1px solid #ddd;
    .singleButton{
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      background: #f5f5f5;
      font-size: 14px;
      color: #7c7c7c;
      cursor: pointer;
      margin-left: 15px;
      width: 60px;
      height: 35px;
      &:hover{
        background: #1aad19;
        color: #fff;
        border-radius: 5px;
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

