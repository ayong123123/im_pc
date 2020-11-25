<template>
  <div class="send-wrapper">
    <div class="newfriend">
      <span class="send-cancel point" @click="cancelSend">取消</span>
      <div class="nickname">发朋友圈</div>
      <span class="send-issue point" @click="commitMoment()">发表</span>
    </div>
    <div class="input-content">
      <textarea cols="15" rows="5" placeholder="这一刻的想法..." v-model="momentsText"></textarea>
      <div class="content-upload">
        <el-upload
          :class="{hide:hideUpload}"
          action=""
          list-type="picture-card"
          :on-remove="handleRemove"
          :http-request="upload"
          :before-upload="beforeAvatarUpload"
          ref="refContent"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data(){
      return{
        momentsText: '',
        dialogImageUrl: '',
        dialogVisible: false,
        uploadId: '',
        allImg:[],
        hideUpload: false,
        saveImgList: [],
        parm:{
          self_uid:'',
          page:1,
          page_size:'10'
        }
      }
    },
    computed: {
      ...mapGetters(['getUserId'])
    },
    created() {
    },
    methods: {
      ...mapActions([
        'addMoments',
        'addPhoneAction',
        'getFriendListAction'
      ]),
      upload (file, fileList) {
        // console.log(file, fileList)
        // return false
      },
      beforeAvatarUpload(file) {
        const isJPG =/^image\/(jpeg|png|jpg|gif)$/.test(file.type);

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG PNG GIF 格式!');
           return false
        }else{
          let sendData = new FormData()
          sendData.append('file', file)
          this.addPhoneAction(sendData).then(res => {
            if (res.path) {
              this.saveImgList.push({
                uid: file.uid,
                path: res.path
              })
              this.hideUpload = this.saveImgList.length >= 9;
            }else {
              return false
            }
          })
        }
      },
      handleRemove(file) {
        let index = this.saveImgList.findIndex(r => r.uid)
        this.saveImgList.splice(index, 1)
        this.hideUpload = this.saveImgList.length >= 9;
      },
      // 取消发送朋友圈
      cancelSend(){
        this.$emit('sendData', false)
      },
      // 发表朋友圈
      commitMoment () {
        if(!this.momentsText && this.saveImgList.length ==0){
          this.$notify({
            title: '警告',
            message: '请输入要发表的内容',
            type: 'warning'
          });
          return false
        }
        let picture = ""
        if (this.saveImgList.length > 0) {
          picture = this.saveImgList.map(r => r.path)
        }
        this.momentsText = this.momentsText.replace(/\n|\r\n/g,"<br>")
        this.addMoments({
          self_uid: this.getUserId,
          content: this.momentsText,
          picture,
        }).then(res => {
          if (res.code === 10002) {
            this.$emit('sendData', false)
            // this.parm.self_uid = this.getUserId
            // this.parm.page = 1
            // this.getFriendListAction(this.parm)
          }
        })
      },
    },
  }
</script>

<style lang="less">
.hide .el-upload--picture-card {
	display: none;
}
.send-wrapper{
  height: 100%;
  .newfriend {
    height: 60px;
    padding: 28px 30px 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nickname {
      font-size: 18px;
    }
    span{
      text-decoration: underline;
      font-size: 14px;
    }
    .send-cancel{
      color: #080808;
    }
    .send-issue{
      color: #ECF9EE;
      background: #06C15E;
      width: 50px;
      text-align: center;
      border-radius: 4px;
      line-height: 28px;
      margin-bottom: 2px;
    }
  }
  .input-content{
    width: 480px;
    height: 590px;
    margin: auto;
    padding-top: 10px;
    overflow-y: auto;
    textarea{
      width: 100%;
      font-size: 14px;
      color: #080808;
      background: #F2F2F2;
      line-height: 20px;
      letter-spacing:1px;
      resize:none;
    }
  }
}

</style>

