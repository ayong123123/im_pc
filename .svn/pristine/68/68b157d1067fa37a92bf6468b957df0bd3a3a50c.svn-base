<template>
  <el-dialog
    title="编辑资料"
    :visible.sync="centerDialogVisible"
    width="405px"
    center>
    <div class="editor-box">
      <el-row>
        <el-col :span="4"><div class="grid-content bg-purple editor-label">昵称：</div></el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light"><el-input v-model="editorForm.nickname"></el-input></div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4"><div class="grid-content bg-purple">性别：</div></el-col>
        <el-col :span="20">
          <el-radio-group v-model="editorForm.sex">
            <el-radio :label="1" >男</el-radio>
            <el-radio :label="2" >女</el-radio>
          </el-radio-group>
          <!--              <div class="grid-content bg-purple-light"><el-input v-model="editorForm.nikename"></el-input></div>-->
        </el-col>
      </el-row>
<!-- {{options}} -->
      <!--<el-row>-->
        <!--<el-col :span="4"><div class="grid-content bg-purple editor-label">地区：</div></el-col>-->
        <!--<el-col :span="20">-->
          <!--<div class="block">-->
            <!--<el-cascader-->
              <!--class="regin-cascader"-->
            <!--ref="cascaderAddr"-->
              <!--v-model="region"-->
              <!--:options="options"-->
              <!--@change="handleAddressFun"-->
              <!--separator="-">-->
            <!--</el-cascader>-->
            <!--<div class="regin-div">-->
              <!--<span class="regin-span">{{editorForm.region || '请选择地址'}}</span>-->
              <!--<i class="el-icon-arrow-down regin-down"></i>-->
            <!--</div>-->
            <!--&lt;!&ndash; <el-input v-model="editorForm.region" placeholder="地址信息"></el-input> &ndash;&gt;-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-row>-->

      <el-row>
        <el-col :span="4"><div class="grid-content bg-purple">头像：</div></el-col>
        <el-col :span="20">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="avatarUrl" v-lazy="avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="editor">确 定</el-button>
        </span>
  </el-dialog>
</template>

<script>
  import { mapState ,mapActions,mapMutations ,mapGetters} from 'vuex'
  import {getTimesYueRi1} from '@/common/common';
  import {MessageBox,Message} from 'element-ui';
  import areaJs from '@/common/area.js';
  export default {
    name: 'editorUserInfo',
    data() {
      return {
        centerDialogVisible:false,
        editorForm:{
          uid:'',
          nickname:'',
          sex:'',
        },
//        editorForm:{
//          uid:'',
//          nickname:'',
//          sex:'',
//          region:''
//        },
        avatarUrl:'', //头像
        uploadUrl:'',
        options: areajson,
        region:''
      }
    },
    watch:{
      'centerDialogVisible'(){
        this.getInfo({uid:this.getUserId}).then(()=>{
          this.editorForm = {
            uid:this.chatuserInfoStore.loginData.id,
            nickname:this.chatuserInfoStore.dataGetInfo.nickname,
            sex:this.chatuserInfoStore.dataGetInfo.sex || 1,
          }
        })
      }
    },
    methods:{
      ...mapMutations(['setLoginData']),
      ...mapActions(['uploadAvatar','editorUser','modifyAvatar','addPhoneAction',"getInfo"]),
      editor() {
        let index = 0;
        for(let k in  this.editorForm) {
          if(!this.editorForm[k]) {
             index++;
          }
        }
        // console.log(this.editorForm)
         if(index == 0) {
           let params = {
             data:this.editorForm
           };
           this.editorUser(params).then(()=>{
             this.getInfo({uid:this.getUserId})
             this.centerDialogVisible = false
           })

         }else {
           Message({message: '请填写完整信息！', type:"warning", showClose:true})
         }
      },
      touchSelect(){
        this.$refs.cascaderAddr.click()
      },
      handleAddressFun(item){
        var thsAreaCode = this.$refs.cascaderAddr.currentLabels
        // console.log(thsAreaCode)
        this.editorForm.region = thsAreaCode.join('-')
      },
      upload (file, fileList) {

      },
      cancel() { //取消
        this.centerDialogVisible = false;
      },
      beforeAvatarUpload(e) {
        const isJPG =/^image\/(jpeg|png|jpg|gif)$/.test(e.type);
        const isLt2M = e.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG PNG GIF 格式!');
          return false
        }else{
          // let sendData = new FormData()
          // sendData.append('file', file)
          const ext = '.' + e.type.split('/').pop(); //后缀
          const website = this.indexStore.indexData.website || 'dgg';
          const TIME = new Date().getTime();
          const todyTime = getTimesYueRi1(TIME);
          const upImageUrl = this.indexStore.indexData.uploadImgUrl; //图片上传地址
          const downImageUrl = this.indexStore.indexData.downImgUrl;  //图片下载地址

          let files = new FormData();
          files.append('file_name',e);
          files.append('name',TIME + ext);
          files.append('website','head');

          this.upImage(files,TIME,ext,website,todyTime,upImageUrl,downImageUrl) //上传图片
        }
      },

      //图片上传（最新）
      upImage(file,TIME,ext,website,todyTime,upImageUrl,downImageUrl) {
        fetch(upImageUrl,{
          method:'post',
          body:file,
        }).then(response => response.json()).then(res=>{
          if(res==1) {
            // this.$message.success('上传成功！');
            const url = downImageUrl+ '/head/' + TIME + ext;

            this.avatarUrl = url;
            if(this.chatuserInfoStore.dataGetInfo.head_portrait == '') { //如果没有头像添加头像
              this.setLoginData({ head_portrait:res.path })
            }else { //有头像就更换

              // console.log(url)
              let params = {
                data:{
                  self_uid:this.chatuserInfoStore.loginData.id,
                  head_portrait: this.avatarUrl
                },
                avatarUrl:url
              }
              this.modifyAvatar(params);
            }
            this.centerDialogVisible = false;
          }else {
            this.$message.warning('上传失败！')
          }
        })
      },

      // 图片上传
      // upLoadImage(file,url) {
      //   //构建formdata格式
      //   return new Promise(resolve => {
      //     const request = new XMLHttpRequest();
      //     request.onreadystatechange = () => {
      //       if (request.readyState === 4 && request.status === 200) {
      //         const result = JSON.parse(request.responseText).data;
      //         resolve(result);
      //       }
      //     };
      //     request.open('POST', url);//填入请求的url
      //     request.onerror = () => {
      //       Message({message: '请求失败！', type:"warning", showClose:true})
      //     };
      //     //发送请求
      //     request.send(file);
      //   })
      // },
    },
    computed:{
      ...mapState([
        'chatuserInfoStore',
        'indexStore'

      ]),
      ...mapGetters([
          "getUserId"
      ])
    },
    mounted() {
    },
    created () {
      this.getInfo({uid:this.getUserId})
      if(this.chatuserInfoStore.dataGetInfo.nickname) {
        this.editorForm = {
          uid:this.chatuserInfoStore.loginData.id,
          nickname:this.chatuserInfoStore.dataGetInfo.nickname,
          sex:this.chatuserInfoStore.dataGetInfo.sex || 1,
//          region: this.chatuserInfoStore.dataGetInfo.region
        }
      }
      this.avatarUrl = this.chatuserInfoStore.dataGetInfo.head_portrait || '';


      //上传地址
      this.uploadUrl = window.hostIm+'/api/uploadFile/upload';
    }
  }
</script>

<style scoped lang="less">
  .editor-box{
    .el-row{
      margin-top: 20px;
      .el-col{
        .editor-label{
          line-height: 40px;
        }
      }
      &:first-of-type{
        margin-top: 0;
      }
    }
    .block{
      position: relative;
      .regin-cascader {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        bottom: 0;
        opacity: 0;
      }
      .regin-div {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        line-height: 40px;
        height: 40px;
        z-index: 1;
        padding-left:3px;
        .regin-span {
          display: inline-block;
          width: 265px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .regin-down {
          position: absolute;
          right:5px;
          top: 15px;
        }
      }
    }
  }
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
</style>
