<!-- 文本输入框 -->
<template>
  <div class="user-text">
    <div class="emoji">
      <ul class="table-ul">
        <li>
          <img src="../../../assets/weChat/c_bq.png" alt="" @click.stop="setModalState('showEmoji')">
        </li>
        <li>
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img src="../../../assets/weChat/zhibojian_btn2.png" alt="">
          </el-upload>
        </li>
        <!--<li @click="shareUserCard" v-if="selectedChat.chatType == 2 && friendsListStore.groupChatInfoList.data.is_add == 1">-->
          <!--<img src="../../../assets/weChat/share.png" alt="" >-->
        <!--</li>-->
        <li @click="openRedState('red')"   v-if="indexStore.indexData.pthbSet == 1">
          <img src="../../../assets/weChat/red_envelopes_icon.png" alt="">
        </li>
        <li @click="openRedState('niu')"   v-if="selectedChat.chatType == 2 && indexStore.indexData.nnhbSet == 1">
          <img src="../../../assets/weChat/icon_chat_item_niuniu.png" alt=""  style="width: 22px;">
        </li>
        <li @click="openRedState('lei')"    v-if="selectedChat.chatType == 2 && indexStore.indexData.slhbSet == 1">
          <img src="../../../assets/weChat/icon_chat_item_saolei.png" alt="">
        </li>
        <li @click="openRedState('long')"    v-if="selectedChat.chatType == 2 && indexStore.indexData.jlhbSet == 1">
          <img src="../../../assets/weChat/send_dragon.png" alt="">
        </li>
        <li v-if="indexStore.indexData.signIn == 1" @click="signFn">
          <img src="../../../assets/weChat/user_sign.png" alt="">
        </li>
        <li v-if="indexStore.indexData.todayLoss == 1"  @click.stop="setModalState('todayLossModal')">
          <img src="../../../assets/weChat/zhanji.png" alt="" style="width: 29px;"/>
          <div class="share_loss" v-if="chatListStore.todayLossModal">
            <div @click="todayLossFn(1)" v-if="indexStore.indexData.CpSet==1">
              彩票
            </div>
            <div @click="todayLossFn(2)" v-if="indexStore.indexData.RHSet==1">
              红包
            </div>
            <div @click="todayLossFn(3)" v-if="isZhongHe">
              综合游戏
            </div>
          </div>
        </li>
      </ul>

      <transition name="showbox">
        <div class="emojiBox" v-show="chatListStore.showEmoji">
          <!--<li v-for="(item, index) in chatListStore.emojis">-->
            <!--<img :src="'static/emoji/'+item.file" :data="item.code" @click="content +=item.code">-->
          <!--</li>-->
          <li  v-for="(i,key,index) in emoji.map" :key="index" @click.stop="selectEmoji(key)">
            <img  :src="emojiFn(i)" alt="">
          </li>
        </div>
      </transition>
      <transition name="showbox">
        <div class="find-all-people" v-show="findPeople">
          <ul>
            <li v-if="isBoss || isManagement" @click="findGroupUser('@全部成员')">
              @ 全部成员
            </li>
            <li v-for="i in friendsListStore.groupChatInfoList.data.user_info" @click="findGroupUser(i)">
              <img :src="i.head_portrait" width="40" height="40" alt="">{{i.user_group_name}}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <textarea ref="text" v-model="content" id="postMsg" @keydown="onKeyup" @click="findPeople = false;"></textarea>
    <div class="send" @click="send">
      <span>发送(Enter)</span>
    </div>
    <transition name="appear">
      <div class="warn" v-show="warn">
        <div class="description">不能发送空白信息</div>
      </div>
    </transition>
    <!--禁言遮罩   -->
    <div class="disable-modal" v-if="selectedChat && selectedChat.chatType == 2 && friendsListStore.groupChatInfoList.data.is_forbidden == 2 && !isBoss &&!isManagement">
      群主已开启禁言
    </div>

    <!--视频封面图-->
    <img src="@/assets/weChat/video_tup.png" alt="" class="fm_img" style="display: none;" id="fmImg"/>
    <video id="video" src="" style="display: none;"></video>
    <div id="output" style="display: none;"></div>
    <!--弹窗发送图片-->
    <el-dialog
      title="发送截图确认"
      :visible.sync="wechatIMstore.pasteImg.state"
      :modal="false"
      width="30%"
      style="margin-top: 15%"
      center>

      <img :src="wechatIMstore.pasteImg.src" class="pasteImg" style="width: 100%;max-height: 200px"/>

      <span slot="footer" class="dialog-footer">
      <el-button @click="setPasteImg({state:false})">取 消</el-button>
      <el-button type="primary" @click="beforeAvatarUpload2()">确 定</el-button>
    </span>
    </el-dialog>

  </div>
</template>

<script>
  import { mapGetters, mapState ,mapActions ,mapMutations} from 'vuex'
  import _config from '../../../configWX/configWX'
  import {Message,MessageBox} from 'element-ui'
  import emoji from "@/configWX/emoji"
  import {getTimesYueRi,getDate,getTimesYueRi1,getSession2} from '@/common/common';
  import * as qiniu from 'qiniu-js';
  import * as qiniu2 from 'qiniu-js2';
  export default {
    data () {
      return {
        emoji:emoji,
        content: '',
        reply: '未找到',
        frequency: 0,
        warn: false,
        uploadUrl:'',
        findPeople:false,
        videoDuration:0,
        uploadFileSize:0,
        timer:null
      };
    },
    computed: {
      ...mapState([
        'chatListStore',
        "chatuserInfoStore",
        "msgListStore",
        "wechatIMstore",
        "friendsListStore",
        "indexStore",
      ]),
      ...mapGetters([
        'selectedChat',
        'getUserId',
        "getGroupMyName",
        "isBoss",
        "isManagement"

      ]),
      isZhongHe(){
        if(this.indexStore.indexData.ChessSet==1 || this.indexStore.indexData.ElectronicsSet==1 || this.indexStore.indexData.AGset==1 || this.indexStore.indexData.SportSet==1 || this.indexStore.indexData.MatchSet==1){
          return true
        }else{
          return false
        }
      },
    },
    beforeDestroy(){
      clearTimeout(this.timer)
    },
    created(){
//      this.uploadUrl = window.hostIm+'/api/uploadFile/upload';
      document.onkeydown=null;
    },
    methods: {
      ...mapActions([
        "sendChatMessage",
        "sendMessageIM",
        "getInfo",
        "addPhoneAction",
        "getqiniuToken",
        "getqiniuToken2",
        "getqiniuToken3",
        "signinAction",
        "shareBillAction"
      ]),
      ...mapMutations([
        "setModalState",
        "setChatRoomFindUser",
        "setPasteImg",
        "setChatRoomFindUserWxIm"
      ]),
      todayLossFn(i){
        clearTimeout(this.timer)
        this.$confirm('分享今日盈亏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.shareBillAction({type:i}).then(()=>{
            this.$emit('goBottom');
          })
        }).catch(() => {

        });

      },
      signFn(){
        this.$confirm('今日签到?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.signinAction().then(()=>{
            this.$emit('goBottom');
          })
        }).catch(() => {

        });

      },
      findGroupUser(i){

        if(i == '@全部成员'){
          this.setChatRoomFindUser({atAll:true,status:true})
        }else{
          this.setChatRoomFindUser({nickname:i.user_nickname,uid:i.uid,status:true,type:true})
        }
        this.$refs.text.focus()
        this.findPeople = false
      },
      upload (file, fileList) {
      },
      //获取视频第一帧图片
      getVideoImageUrl() {
        let image = document.getElementById('fmImg');
        // image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var dataURLtoBlob = (dataurl) => {
          var arr = dataurl.split(','),
                  mime = arr[0].match(/:(.*?);/)[1],
                  bstr = atob(arr[1]),
                  n = bstr.length,
                  u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], {type: mime});
        };
        // var dataURLtoBlob = require('blueimp-canvas-to-blob');
        var imgUrl = dataURLtoBlob(url);//转换成blob文件上传
        return imgUrl;
        // console.log('imgUrl', imgUrl)
      },
      //发图片
      beforeAvatarUpload(file) {
        // console.log(file)
        // let sendData = new FormData()
        // sendData.append('file', file)
        // var file = e.target.files[0];
        const fileSize = JSON.parse((file.size/1024/1024).toFixed(2))
        if(fileSize > 50) {
         this.$message({
           type: 'warning',
           message: '上传文件不能大于50M!'
         });
          return false;
        }
        // this.$refs.uploading.style.right = 0; //上传动画

        const isJPG = /^image\/(jpeg|png|jpg|gif)$/.test(file.type);
        const isVideo = /^video\/(mp4|rmvb|avi|ts)$/.test(file.type);
        const isAudio = /^audio\/(wav|flac|ape|alac|mp3|aac|ogg|opus)$/.test(file.type);

        const ext = '.' + file.type.split('/').pop(); //后缀
        const website = this.indexStore.indexData.website || 'dgg';
        const TIME = new Date().getTime();
        const todyTime = getTimesYueRi1(TIME);

        // console.log('sss',this.getVideoImageUrl()) //第一帧图片
        const videoFirstImage = this.getVideoImageUrl();//第一帧图片


        // const videoFirstImage = this.getVideoImageUrl();//第一帧图片

        const upImageUrl = this.indexStore.indexData.uploadImgUrl; //图片上传地址
        const downImageUrl = this.indexStore.indexData.downImgUrl;  //图片下载地址
        const upVideoUrl = this.indexStore.indexData.localUploadUrl;//视频上传地址
        const downVideoUrl = this.indexStore.indexData.localDownUrl;//视频下载地址
        // console.log('file',file)
        // console.log('videoFirstImage',videoFirstImage)
        let files = new FormData();
        files.append('file_name',file);
        files.append('name',TIME + ext);
        files.append('website',website+'/'+todyTime);

        let firstVideoImage = new FormData();
        let firstImage = new File([videoFirstImage], 'videoFirstImage', {type: 'contentType', lastModified: Date.now()});//blob类型转file类型
        firstVideoImage.append('file_name',firstImage);
        firstVideoImage.append('name',TIME+'.png');
        firstVideoImage.append('website',website+'/'+todyTime);

        const videoFileSize = (file.size/1024).toFixed(2)+' KB';

        // if(isJPG)this.uploadQiniu(file, 1,ext,website,TIME,todyTime) //上传图片
        if(isJPG) this.upImage(files,TIME,ext,website,todyTime,upImageUrl,downImageUrl) //上传图片
        // else if(isAudio) this.uploadQiniu(file, 2,ext,website,TIME,todyTime) //上传音频
        // else if(isVideo) this.localUploadSp(file,ext,website,TIME,todyTime) //上传视频
        else if(isVideo) {
         if( this.indexStore.indexData.VideoSwitch == 2) {
           this.$message('视频上传功能已关闭！')
           return
         }
          this.upVideo(files,TIME,ext,website,todyTime,firstVideoImage,upImageUrl,upVideoUrl,downImageUrl,downVideoUrl,videoFileSize) //上传视频
        }
        // else if(isVideo) this.qiniuUploadSp(file,ext,website,TIME,todyTime)


//        同一文件不触发事件处理
//         e.srcElement.value = ""
      },

      //图片上传（最新）
      upImage(file,TIME,ext,website,todyTime,upImageUrl,downImageUrl) {
        // const params= {
        //   url:this.indexStore.indexData.uploadImgUrl,
        //   files:files
        // }
        // this.getqiniuToken3(params)
        fetch(upImageUrl,{
          method:'post',
          body:file,
        }).then(response => response.json()).then(res=>{
          if(res==1) {
            this.$message.success('上传成功！');
            const url = downImageUrl+website+'/'+todyTime + '/' + TIME + ext;
            // console.log('url',url)
            let datas = {
              to: this.msgListStore.activeWindowId,
              message: url,
              type: this.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_IMG : _config.MSG_GROUP_IMG,
              reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
          }

            if (this.msgListStore.activeTyep == 2) { //推送
              let group = {}
              group.groupName = this.friendsListStore.groupChatInfoList.data.group_name
              group.count = this.friendsListStore.groupChatInfoList.data.count
              datas.groupinfo = group
            }

            this.sendMessageIM(datas)
            this.$emit('goBottom');
          }else {
            this.$message.warning('上传失败！')
          }
        })
      },
      //视频上传（最新）
      upVideo(file,TIME,ext,website,todyTime,firstVideoImage,upImageUrl,upVideoUrl,downImageUrl,downVideoUrl,videoFileSize) {
        // console.log('firstVideoImage',firstVideoImage)
        // 先上传第一帧图片
        fetch(upImageUrl,{
          method:'post',
          body:firstVideoImage,
        }).then(response => response.json()).then(res=>{
          if(res==1) {
            // this.$message.success('上传成功！');
            const imageUrl =downImageUrl +website+'/'+todyTime + '/' + TIME + '.png';
            //再上传视频
            fetch(upVideoUrl,{
              method:'post',
              body:file,
            }).then(response => response.json()).then(res=>{
              if(res==1) {
                this.$message.success('上传成功！');
                const videoUrl =downVideoUrl +website+'/'+todyTime + '/' + TIME + ext;

                //获取视频时长
                const videoDom = document.getElementById('video')
                videoDom.setAttribute('src',videoUrl)
                videoDom.load()
                videoDom.oncanplay = ()=> {
                  // console.log('duration',videoDom.duration)
                  const durationTime = Math.ceil(videoDom.duration);

                  //视频消息推送
                  let video ={
                    youpai_url:videoUrl,
                    qiniu_url: videoUrl,
                    youpai_image_url:imageUrl,
                    qiniu_image_url:imageUrl,
                    size: videoFileSize,
                    time:durationTime,
                  }
                  // time:that.sendVideo.duration || 1,
                  let datas = {
                    to: this.msgListStore.activeWindowId,
                    message:JSON.stringify(video),
                    type: this.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_VIDEO : _config.MSG_GROUP_VIDEO,
                    reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
                  }
                  if (this.msgListStore.activeTyep == 2) {
                    let group = {}
                    group.groupName = this.friendsListStore.groupChatInfoList.data.group_name
                    group.count = this.friendsListStore.groupChatInfoList.data.count
                    datas.groupinfo = group
                  }
                  this.sendMessageIM(datas)
                  this.$emit('goBottom');
                }
              }else {
                this.$message.warning('上传失败！')
              }
            })
          }else {
            this.$message.warning('上传失败！')
          }
        })

      },
      //上传文件到七牛云 type=1图片，type=2语音，type=3视频

      //视频上传到本地服务器
      localUploadSp(data,ext,website,TIME,todyTime) {
        this.getqiniuToken()  //上传七牛云
              .then(res=> {
                  var uptoken = res.token
                  var downUrl = res.down_url
                  var key = todyTime + '/' + website + '/' + TIME + ext   // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。
                  const that = this;

                  let config = {
                    useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                    region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                  };

                  let putExtra = {
                    fname: "",  //文件原文件名
                    params: {}, //用来放置自定义变量
                    mimeType: null //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                  };


                  var observable = qiniu2.upload(data, key, uptoken, putExtra, config);
                  observable.subscribe({
                    next: (result) => {
                      that.uploadFileSize = (result.total.size/1024).toFixed(2)+' KB';
                    },
                    error: (errResult) => {
                      // this.$refs.uploading.style.right = -5+'rem'; //上传动画
                      // this.$toast('上传失败' + errResult)
                      Message({
                        message:'上传失败'+errResult,
                        type:"warning",
                        showClose:true
                      })
                    },
                    complete: (result) => {
                      // console.log('上传成功',result)
                      // var qiniu_url = downUrl+'/'+ todyTime + '/' + website + '/' + TIME + ext;
                      const qiniu_url = result.data.path;
                      const firstUrl = 'http://suibian.jammiy.com//2019-12-18/superWechat/1576657511050.png';
                      //获取视频时长
                      const video = document.getElementById('video')
                      video.setAttribute('src',qiniu_url)
                      video.load()
                      video.oncanplay = ()=> {
                        // console.log('duration',video.duration)
                        const durationTime = Math.ceil(video.duration);
                        this.localUploadQiniuFirstImage(qiniu_url,firstUrl,durationTime,that.uploadFileSize);
                      }
                    }
                  })
                })
      },
      //上传第一帧图片到本地服务器
      localUploadQiniuFirstImage(qiniu_url,firstUrl,videoDuration,uploadFileSize) {
            var that = this;
            // console.log('上传成功')
            // var img_url= downUrl+'/'+todyTime+'/'+website +'/'+TIME+ext1;
            //视频消息推送
            let video ={
              youpai_url:qiniu_url,
              qiniu_url: qiniu_url,
              youpai_image_url:firstUrl,
              qiniu_image_url:firstUrl,
              size: uploadFileSize,
              time:videoDuration,
            }
            // time:that.sendVideo.duration || 1,
            let datas = {
              to: that.msgListStore.activeWindowId,
              message:JSON.stringify(video),
              type: that.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_VIDEO : _config.MSG_GROUP_VIDEO,
              reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
            }
            if (that.msgListStore.activeTyep == 2) {
              let group = {}
              group.groupName = that.friendsListStore.groupChatInfoList.data.group_name
              group.count = that.friendsListStore.groupChatInfoList.data.count
              datas.groupinfo = group
            }
            that.sendMessageIM(datas)
            // that.$refs.uploading.style.right = -5+'rem'; //上传动画
            that.$emit('goBottom');
            // setTimeout(() => that.$refs.wrapper.scrollTop = that.$refs.wrapper.scrollHeight, 0)
      },
      //本地视频上传七牛云
      qiniuUploadSp(data,ext,website,TIME,todyTime) {
        this.getqiniuToken()  //上传七牛云
                .then(res=> {
                  var uptoken = res.token
                  var downUrl = res.down_url
                  var key = todyTime + '/' + website + '/' + TIME + ext   // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。
                  const that = this;

                  let config = {
                    useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                    region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                  };

                  let putExtra = {
                    fname: "",  //文件原文件名
                    params: {}, //用来放置自定义变量
                    mimeType: null //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                  };

                  var observable = qiniu.upload(data, key, uptoken, putExtra, config);
                  observable.subscribe({
                    next: (result) => {
                      that.uploadFileSize = (result.total.size/1024).toFixed(2)+' KB';
                    },
                    error: (errResult) => {
                      // this.$refs.uploading.style.right = -5+'rem'; //上传动画
                      // this.$toast('上传失败' + errResult)
                      Message({
                        message:'上传失败'+errResult,
                        type:"warning",
                        showClose:true
                      })
                    },
                    complete: (result) => {
                      // console.log('上传成功')
                      var qiniu_url = downUrl+'/'+ todyTime + '/' + website + '/' + TIME + ext;
                      var firstUrl = downUrl+'/'+ todyTime + '/' + website + '/' + TIME + ext+'?vframe/jpg/offset/0';
                      //获取视频时长

                      fetch(qiniu_url + '?avinfo', {
                         body: JSON.stringify(''), // must match 'Content-Type' header
                         method: 'POST', // *GET, POST, PUT, DELETE, etc.
                      })
                      .then(response => {
                         response.json()
                           .then(firstImageres => {
                             let videoDuration = Math.ceil(firstImageres.format.duration);
                             that.uploadQiniuFirstImage(qiniu_url,firstUrl,videoDuration,that.uploadFileSize,todyTime,website,TIME)
                           })
                      })


                    }
                  })
                })
      },
      //上传第一帧图片到七牛云
      uploadQiniuFirstImage(qiniu_url,firstUrl,videoDuration,uploadFileSize,todyTime,website,TIME) {
        var that = this;
        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.setAttribute("src", firstUrl);
        image.onload = function() {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

          var dataURLtoBlob=(dataurl)=> {
            var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
            while(n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr],{type:mime});
          };
          // var dataURLtoBlob = require('blueimp-canvas-to-blob');
          var imgUrl = dataURLtoBlob(url);//转换成blob文件上传
          that.getqiniuToken()  //上传封面图七牛云
                  .then(res=> {
                    var uptoken = res.token
                    var downUrl = res.down_url

                    let ext1 = '.' + imgUrl.type.split('/').pop(); //后缀
                    // var file = e.target.files[0] //Blob 对象，上传的文件
                    var key = todyTime +'/'+website +'/'+TIME+ext1   // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

                    let config = {
                      useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                      region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                    };

                    let putExtra = {
                      fname: "",  //文件原文件名
                      params: {}, //用来放置自定义变量
                      mimeType: null //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                    };

                    var observable1 = qiniu.upload(imgUrl, key, uptoken, putExtra, config);
                    observable1.subscribe({
                      next: (result) => {
                        // that.uploadFileSize = (result.total.size/1024).toFixed(2)+' KB';
                      },
                      error: (errResult) => {
                        // that.$refs.uploading.style.right = -5+'rem'; //上传动画
                        Message({
                          message:'上传失败'+errResult,
                          type:"warning",
                          showClose:true
                        })
                        // 失败报错信息
                        // console.log(errResult)
                      },
                      complete: (result) => {
                        // console.log('上传成功')
                        var img_url= downUrl+'/'+todyTime+'/'+website +'/'+TIME+ext1;
                        //视频消息推送
                        let video ={
                          youpai_url:qiniu_url,
                          qiniu_url: qiniu_url,
                          youpai_image_url:img_url,
                          qiniu_image_url:img_url,
                          size: uploadFileSize,
                          time:videoDuration,
                        }
                        // time:that.sendVideo.duration || 1,
                        let datas = {
                          to: that.msgListStore.activeWindowId,
                          message:JSON.stringify(video),
                          type: that.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_VIDEO : _config.MSG_GROUP_VIDEO,
                          reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
                        }
                        if (that.msgListStore.activeTyep == 2) {
                          let group = {}
                          group.groupName = that.friendsListStore.groupChatInfoList.data.group_name
                          group.count = that.friendsListStore.groupChatInfoList.data.count
                          datas.groupinfo = group
                        }
                        that.sendMessageIM(datas)
                        // that.$refs.uploading.style.right = -5+'rem'; //上传动画
                        that.$emit('goBottom');
                        // setTimeout(() => that.$refs.wrapper.scrollTop = that.$refs.wrapper.scrollHeight, 0)
                      }
                    })
                  })
        };
      },

      uploadQiniu(data,type,ext,website,TIME,todyTime) {
        this.getqiniuToken2()  //上传七牛云
            .then(res=>{
                  var uptoken = res.token || "666"
                  var downUrl = res.down_url  || "dgg.com"
                  // var file = e.target.files[0] //Blob 对象，上传的文件
                  var key = todyTime+'/'+website +'/'+TIME+ext   // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

                  let config = {
                    useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                    region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                  };

                  let putExtra = {
                    fname: TIME+ext,  //文件原文件名
                    params: {}, //用来放置自定义变量
                    mimeType: null //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                  };

              // 'http://18.162.207.104:8008'
              window.localUploadUrl = this.indexStore.indexData.uploadImgUrl;
              // console.log('localUploadUrl',window.localUploadUrl)

              var observable = qiniu2.upload(data, key, uptoken, putExtra, config);
                  observable.subscribe({
                    next: (result) => {
                      // 主要用来展示进度
//                Indicator.open({
//                  text: '语音上传中...',
//                  spinnerType: 'fading-circle'
//                });
//                 console.log('result',result.total.size)
                    },
                    error: (errResult) => {
                      // this.$refs.uploading.style.right = -5+'rem'; //上传动画
                      Message({
                        message:'上传失败'+errResult,
                        type:"warning",
                        showClose:true
                      })
                    },
                    complete: (result) => {
                      var qiniu_url=  downUrl+'/'+todyTime+'/'+website +'/'+ TIME + ext;

                      let datas,that = this;
                      switch (type) {
                        case 1:
                          datas = {
                            to: this.msgListStore.activeWindowId,
                            message: qiniu_url,
                            type: this.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_IMG : _config.MSG_GROUP_IMG,
                            reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
                          }

                          break;
                        case 2:
                          //推送语音
                          let audios ={
                            youpai_url:qiniu_url,
                            qiniu_url:qiniu_url,
                            time:this.sendYuyin.time || 3,
                          }
                          datas = {
                            to: this.msgListStore.activeWindowId,
                            message:JSON.stringify(audios),
                            type: this.msgListStore.activeTyep == 1 ? _config.MSG_PRIVATE_AUDIO : _config.MSG_GROUP_AUDIO,
                            reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
                          }
                          break;
                        default:
                      }

                      if (this.msgListStore.activeTyep == 2) { //推送
                        let group = {}
                        group.groupName = this.friendsListStore.groupChatInfoList.data.group_name
                        group.count = this.friendsListStore.groupChatInfoList.data.count
                        datas.groupinfo = group
                      }
                      this.sendMessageIM(datas)
                      // this.$refs.uploading.style.right = -5+'rem';
                      this.$emit('goBottom');
                      // setTimeout(() => this.$refs.list.scrollTop = this.$refs.list.scrollHeight, 0)
                    }
                  })
                })
      },

      // beforeAvatarUpload(file) {
      //   console.log("file",file)
      //   const isJPG =/^image\/(jpeg|png|jpg|gif)$/.test(file.type);
      //   const isLt2M = file.size / 1024 / 1024 < 2;
      //
      //   if (!isJPG) {
      //     this.$message.error('发送图片只能是 JPG PNG jif格式!');
      //     return false
      //   }else if (!isLt2M) {
      //     this.$message.error('发送图片大小不能超过 2MB!');
      //     return false
      //   }else{
      //     let sendData = new FormData()
      //     sendData.append('file', file)
      //     this.uploadQiniu(file,1)
      //     // this.addPhoneAction(sendData).then(res => {
      //     //   let data = {
      //     //     to:this.selectedChat.id,
      //     //     message:res.path,
      //     //     type:this.selectedChat.chatType == 1 ? _config.MSG_PRIVATE_IMG : _config.MSG_GROUP_IMG ,
      //     //   }
      //     //   if(this.selectedChat.chatType == 2){
      //     //     let group = {}
      //     //     group.groupName = this.friendsListStore.groupChatInfoList.data.group_name
      //     //     group.count = this.friendsListStore.groupChatInfoList.data.count
      //     //     data.groupinfo = group
      //     //   }
      //     //   this.sendMessageIM(data)
      //     // })
      //   }
      //
      //   // return isJPG && isLt2M;
      // },

      beforeAvatarUpload2() {
        var file=window.tempImg.data;
        const fileSize = JSON.parse((file.size/1024/1024).toFixed(2))
        this.setPasteImg({state:false});
        if(fileSize > 50) {
          this.$message({
            type: 'warning',
            message: '上传文件不能大于50M!'
          });
          return false;
        }
        // this.$refs.uploading.style.right = 0; //上传动画

        const isJPG = /^image\/(jpeg|png|jpg|gif)$/.test(file.type);
        const isVideo = /^video\/(mp4|rmvb|avi|ts)$/.test(file.type);
        const isAudio = /^audio\/(wav|flac|ape|alac|mp3|aac|ogg|opus)$/.test(file.type);

        const ext = '.' + file.type.split('/').pop(); //后缀
        const website = this.indexStore.indexData.website || 'dgg';
        const TIME = new Date().getTime();
        const todyTime = getTimesYueRi1(TIME);

        // console.log('sss',this.getVideoImageUrl()) //第一帧图片
        const videoFirstImage = this.getVideoImageUrl();//第一帧图片


        // const videoFirstImage = this.getVideoImageUrl();//第一帧图片

        const upImageUrl = this.indexStore.indexData.uploadImgUrl; //图片上传地址
        const downImageUrl = this.indexStore.indexData.downImgUrl;  //图片下载地址
        const upVideoUrl = this.indexStore.indexData.localUploadUrl;//视频上传地址
        const downVideoUrl = this.indexStore.indexData.localDownUrl;//视频下载地址

        // console.log('file',file)
        // console.log('videoFirstImage',videoFirstImage)
        let files = new FormData();
        files.append('file_name',file);
        files.append('name',TIME + ext);
        files.append('website',website+'/'+todyTime);

        let firstVideoImage = new FormData();
        let firstImage = new File([videoFirstImage], 'videoFirstImage', {type: 'contentType', lastModified: Date.now()});//blob类型转file类型
        firstVideoImage.append('file_name',firstImage);
        firstVideoImage.append('name',TIME+'.png');
        firstVideoImage.append('website',website+'/'+todyTime);

        const videoFileSize = (file.size/1024).toFixed(2)+' KB';

        // if(isJPG)this.uploadQiniu(file, 1,ext,website,TIME,todyTime) //上传图片
        if(isJPG) this.upImage(files,TIME,ext,website,todyTime,upImageUrl,downImageUrl) //上传图片

        else if(isVideo) this.upVideo(files,TIME,ext,website,todyTime,firstVideoImage,upImageUrl,upVideoUrl,downImageUrl,downVideoUrl,videoFileSize) //上传视频


        // return


       // var file=window.tempImg.data;
       // console.log(file)
       //  this.setPasteImg({state:false});
       //
       //  const isJPG =/^image\/(jpeg|png|jpg|gif)$/.test(file.type);
       //  const isLt2M = file.size / 1024 / 1024 < 2;
       //
       //  if (!isJPG) {
       //    this.$message.error('发送图片只能是 JPG PNG jif格式!');
       //    return false
       //  }else{
       //    let sendData = new FormData()
       //    sendData.append('file', file)
       //    this.addPhoneAction(sendData).then(res => {
       //      let data = {
       //        to:this.selectedChat.id,
       //        message:res.path,
       //        type:this.selectedChat.chatType == 1 ? _config.MSG_PRIVATE_IMG : _config.MSG_GROUP_IMG ,
       //      }
       //      if(this.selectedChat.chatType == 2){
       //        let group = {}
       //        group.groupName = this.friendsListStore.groupChatInfoList.data.group_name
       //        group.count = this.friendsListStore.groupChatInfoList.data.count
       //        data.groupinfo = group
       //      }
       //      this.sendMessageIM(data)
       //    })
       //  }

        // return isJPG && isLt2M;
      },
//      分享名片
      shareUserCard(){
        let _this = this
        this.$confirm('将你的【名片】分享到当前窗口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          let temp  = {
            head_portrait:_this.chatuserInfoStore.dataGetInfo.head_portrait,
            id:_this.chatuserInfoStore.loginData.id,
            phone:_this.chatuserInfoStore.loginData.phone,
            nickname:_this.chatuserInfoStore.dataGetInfo.nickname,
            username:_this.chatuserInfoStore.loginData.username,
          }
          let data = {
            to:_this.selectedChat.id,
            message:JSON.stringify(temp),
            type:_this.selectedChat.chatType == 1 ? _config.MSG_PRIVATE_CARD : _config.MSG_GROUP_CARD ,
            reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
          }
          if(this.selectedChat.chatType == 2){
            let group = {}
            group.groupName = this.friendsListStore.groupChatInfoList.data.group_name
            group.count = this.friendsListStore.groupChatInfoList.data.count
            data.groupinfo = group
          }
          this.sendMessageIM(data)
        }).catch(() => {


        });

      },
      selectEmoji(i){
        this.content+= i
      },
      emojiFn(i){
        let img;
        img = './pcImstatic/images/faces/' + i;
        return img
      },
////      发送图片
//      handleImageSuccess(res, file){
//
//        if(res.code === 10000) {
//          let data = {
//            to:this.selectedChat.id,
//            message:res.data.path,
//            type:this.selectedChat.chatType == 1 ? _config.MSG_PRIVATE_IMG : _config.MSG_GROUP_IMG ,
//          }
//          this.sendMessageIM(data)
//        }else{
//          Message({message: '上传失败',showClose:true})
//        }
//      },
//      beforeImageUpload(file){
//        const isJPG =/^image\/(jpeg|png|jpg|gif)$/.test(file.type);
//        const isLt2M = file.size / 1024 / 1024 < 2;
//
//        if (!isJPG) {
//          this.$message.error('上传头像图片只能是 JPG PNG JIF 格式!');
//        }
//        if (!isLt2M) {
//          this.$message.error('上传头像图片大小不能超过 2MB!');
//        }
//        return isJPG && isLt2M;
//      },
      // 按回车发送信息
      onKeyup (e) {
        if (!e.shiftKey && e.keyCode === 13) {
          this.send()
          e.preventDefault()
          return false
        }
      },
      openRedState(type){
        if(this.indexStore.userHomeData.data.coinPassword !=1){
          this.setModalState('setPassword')
        }else{
          switch (type) {
            case "red":
              this.setModalState('sendRedPackState')
              break
            case "niu":
              this.setModalState('sendBullRedState')
              break
            case "lei":
              this.setModalState("sendSweepRedState")
              break
            case "long":
              this.setModalState("sendDragonRedState")
              break
            default:
              this.$message.warning('请重新登录重试,谢谢!');
              break
          }

        }

      },
      // 点击发送按钮发送信息
      send () {
        this.content=this.content.replace(/^ +| +$/g,'');
        if(this.content.length < 1){
          this.warn = true
          this.content = ''
          setTimeout(() => {
            this.warn = false;
          }, 1000)
        }else{
          if(this.content.length > 2000){
            this.$message.warning('字数不能超过2000个!');
            return
          }
          this.content = this.content+""
          if(this.content == '0'){
            this.content = '零'
          }

          if(this.wechatIMstore.chatRoomFindUser.status && this.msgListStore.activeTyep == 2){

            var findArr = []
            var atAllState = false
            this.wechatIMstore.findUserList.forEach((i)=>{
              if(this.content.indexOf(i.name) != -1){
                findArr.push(i.uid)
              }
            })
//            判断是否是@全部
            if(this.content.indexOf('@全部成员') != -1){
              atAllState = true
            }

            if(findArr.length > 0 || atAllState){
              let findData = {
                to:this.selectedChat.id,
                message:this.content,
                type:atAllState ? _config.MSG_GROUP_AT_ALL : _config.MSG_GROUP_AT,
                reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
              }
              let findGroup = {}
              findGroup.groupName = this.friendsListStore.groupChatInfoList.data.group_name
              findGroup.count = this.friendsListStore.groupChatInfoList.data.count
              //              @人增加 findId
              findGroup.findId =atAllState ? '9999999' : findArr.join(",")
              findData.groupinfo = findGroup
              this.sendMessageIM(findData)
            }
            this.setChatRoomFindUser({nickname:'',status:false})
          }else{
            let data = {
              to:this.selectedChat.id,
              message:this.content,
              type:this.selectedChat.chatType == 1 ? _config.MSG_PRIVATE_TXT : _config.MSG_GROUP_TXT,
              reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})
            }
            if(this.selectedChat.chatType == 2){
              let group = {}
              group.groupName = this.friendsListStore.groupChatInfoList.data.group_name
              group.count = this.friendsListStore.groupChatInfoList.data.count
              data.groupinfo = group
            }
//          发送文本
            this.sendMessageIM(data)
          }
          this.content = ''
          setTimeout(() => window.document.getElementById("chat-list").scrollTop = window.document.getElementById("chat-list").scrollHeight, 0)
        }
      }
    },
    // 在进入的时候 聚焦输入框
    mounted() {
      this.$refs.text.focus()
      let full=this;
      var paste_img=function (e) {


        if (e.clipboardData && e.clipboardData.items) {

          var imageContent = e.clipboardData.getData('image/png');
          var ele = e.clipboardData.items
          for (var i = 0; i < ele.length; ++i) {
            //粘贴图片
            if (ele[i].kind == 'file' && ele[i].type.indexOf('image/') !== -1) {
              var blob = ele[i].getAsFile();
              window.URL = window.URL || window.webkitURL;
              var blobUrl = window.URL.createObjectURL(blob);
              // 显示到div中，此时是显示的本地图片数据，并没有上传到服务器
              var new_img = document.createElement('img');
              new_img.setAttribute('src', blobUrl);
              new_img.setAttribute('blobdata', blob);

              window.tempImg={filename:blob.name,filetype:blob.type,url:blobUrl,data:blob}

              // console.log("blob",window.tempImg)

              full.setPasteImg({state:true,src:blobUrl,file:window.tempImg})

//              store.dispatch(ChatRoomActions.changePasteImgAction({state:true,src:blobUrl,file:window.tempImg}));
              return;

            }//粘贴文本
            else if (ele[i].kind === "string" && ele[i].type.indexOf('text/plain') != -1) {
              //粘贴文本回调函数
              ele[i].getAsString(
                function (str) {

                  full.content=full.content+str;
                  // insertHtmlAtCaret(document.createTextNode(str));//插入文本到光标处 并移动光标到新位置
                })

            }
            else return;

          }


        }
        else {
          alert('不支持的浏览器');
        }
      }
      //编辑粘贴事件
      document.getElementById('postMsg').onpaste = function (event) { paste_img(event); return false; };

    },
    watch: {
      // 在选择其它对话的时候 聚焦输入框
      'msgListStore.activeWindowId'() {
        setTimeout(() => {
          this.content = ''
          this.$refs.text.focus()
          this.findPeople = false
        }, 0)
      },
      // 当输入框中的值为空时 弹出提示  并在一秒后消失
      content() {
        if(this.content === ''){
          if( this.frequency === 0){
            this.warn = true;
            this.frequency++
            setTimeout(() => {
              this.warn = false;
            }, 1000)
          }
        }
        if(this.content.charAt(this.content.length - 1) === '@' && this.msgListStore.activeTyep*1 == 2){
          this.findPeople = true
        }
      },
      'wechatIMstore.chatRoomFindUser.num':function (n,o) {
        this.content += this.wechatIMstore.chatRoomFindUser.name
        this.$refs.text.focus()
      },
    }
  }
</script>

<style lang="less" scoped>
  .disable-modal {
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    z-index:2;
    line-height: 150px;
    background-color: #fff;
    text-align: center;
  }
  .user-text {
    position: relative;
    height: 150px;
    background: #fff;
    z-index:1;
    .emoji {
      position: relative;
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      padding: 0 30px;
      box-sizing: border-box;
      color: #7c7c7c;
      .icon-look {
        cursor: pointer;
      &:hover {
         color: #1aad19;
       }
      }
    .table-ul li {
      display: inline-block;
      padding-right: 18px;
      cursor: pointer;
      position: relative;
      img {
        width: 24px;
        height: 24px;
      }
      .share_loss{
        position: absolute;
        left: 30px;
        bottom: 30px;
        overflow: hidden;
        background-color: #fff;
        width:80px;
        text-align: center;
        color:#ff0000;
        border-radius: 5px;
        -webkit-box-shadow: 0 1px 2px 1px #d1d1d1;
        box-shadow: 0 1px 2px 1px #d1d1d1;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        div{
          line-height: 34px;
          border-bottom: 1px solid #e0e0e0;
        }
      }
    }
    .emojiBox,.find-all-people {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      top: -210px;
      left: -100px;
      width: 346px;
      height: 210px;
      padding: 5px 10px;
      background-color: #fff;
      border: 1px solid #d1d1d1;
      border-radius: 2px;
      box-shadow:0 1px 2px 1px #d1d1d1;
      box-sizing: border-box;
        li{
          cursor: pointer;
          margin-right: 3px;
        }
        li:hover {
          background-color: #eee;
        }
        &.showbox-enter-active, &.showbox-leave-active {
           transition: all .5s;
         }
        &.showbox-enter,&.showbox-leave-active {
           opacity: 0;
         }

      }
      .find-all-people{
        left: 0px;
        width: 200px;
        height: 210px;
        overflow: auto;
        z-index: 9999;
        ul {
          width: 100%;
          color:#333;
          font-size: 14px;
          img {
            margin-right: 5px;
          }
          li{
            word-break: break-all;
            word-wrap: break-word;
          }
        }
      }
  }
    textarea{
      box-sizing: border-box;
      padding: 0 30px;
      height: 110px;
      width: 100%;
      border: none;
      outline: none;
      font-family: "Micrsofot Yahei";
      resize: none;
    }
  .send {
    position: absolute;
    bottom: 10px;
    right: 30px;
    width: 85px;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    background: #f5f5f5;
    font-size: 14px;
    color: #7c7c7c;
    cursor: pointer;
  &:hover {
     background: rgb(18,150,17);
     color: #fff;
   }

  }
  .warn {
    position: absolute;
    bottom: 50px;
    right: 10px;
    width: 110px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    text-align: center;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    box-shadow:0 1px 5px 1px #bdbdbd;
      &.appear-enter-active, &.appear-leave-active {
                                transition: all 1s;
                              }
      &.appear-enter,&.appear-leave-active {
                        opacity: 0;
                      }
      &:before {
         content: " ";
         position: absolute;
         top: 100%;
         right: 20px;
         border: 7px solid transparent;
         border-top-color: #fff;
         filter:drop-shadow(1px 3px 2px #bdbdbd);
       }
    }
  }
</style>
