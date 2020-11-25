<template >
  <el-dialog
    title="修改密码"
    :visible.sync="centerDialogVisible"
    width="400px"
    center class="resetpwd-wrap">
    <div class="resetpwd-box">
      <el-form :model="resetPassForm" status-icon :rules="rules3" ref="resetPassForm" class="demo-ruleForm">
        <el-form-item label="旧密码：" prop="oldpass">
          <el-input type="password" v-model="resetPassForm.oldpass"  placeholder="旧密码"></el-input>
        </el-form-item>

        <el-form-item label="新密码：" prop="newpass">
          <el-input type="password" v-model="resetPassForm.newpass"  placeholder="新密码"></el-input>
        </el-form-item>

        <el-form-item class="footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="resetPass('resetPassForm')" style="margin-left: 30px;">修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex';
  export default {
    name: 'resetPwd',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'));
        }else {
          callback();
        }
      };
      var validateresetPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          callback();
        }
      };

      return {
        centerDialogVisible:false,
        resetPassForm:{
          oldpass:'',
          newpass:'',
        },

        rules3: {
          oldpass: [
            { validator: validatePass, trigger: 'blur' },
          ],
          newpass: [
            { validator: validateresetPass, trigger: 'blur' }
          ],
        },
      }
    },
    watch:{
      'centerDialogVisible'(){
        this.resetPassForm.oldpass = ''
        this.resetPassForm.newpass = ''
      }
    },
    methods:{
      ...mapActions([
        'resetPassAction'
      ]),
      //修改密码
      resetPass(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              data:{
                oldpassword:this.resetPassForm.oldpass,
                password:this.resetPassForm.newpass,
              },
              route:this.$router
            }
            this.resetPassAction(params).then(()=>{
              this.centerDialogVisible = false;
            })
          }else {
            console.log('error submit!!');
            return false;
          }
        })
      },
    },
    computed: {
      ...mapState([
        'chatuserInfoStore',
        "indexStore"
      ]),
    },
  }
</script>

<style scoped lang="less">

</style>
