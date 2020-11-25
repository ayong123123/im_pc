<template >
  <el-dialog
    :title="getInfoData"
    :visible.sync="chatListStore.setPassword"
    width="400px"
    center class="resetpwd-wrap">
    <div class="resetpwd-box">


      <!-- 设置 -->
      <el-form v-if="indexStore.userHomeData.data.coinPassword ==1" :model="setPassForm" status-icon :rules="rules2" ref="setPassForm" class="demo-ruleForm">

        <el-form-item label="原始密码：" prop="oldcoinpassword">
          <el-input type="password" v-model="setPassForm.oldcoinpassword"  placeholder="请输入旧的提款密码"></el-input>
        </el-form-item>

        <el-form-item label="新的密码：" prop="newcoinpassword">
          <el-input type="password" v-model="setPassForm.newcoinpassword"  placeholder="请输入新的提款密码"></el-input>
        </el-form-item>
        <el-form-item class="footer">
          <el-button @click="setModalState('setPassword')">取 消</el-button>
          <el-button  type="primary" @click="setResetPass('setPassForm')" style="margin-left: 30px;">确认</el-button>
        </el-form-item>
      </el-form>

      <!-- /修改密码 -->
      <el-form :model="resetPassForm" status-icon :rules="rules3" ref="resetPassForm" class="demo-ruleForm" v-else>
        <el-form-item label="提款密码：" prop="coinpassword">
          <el-input type="password" v-model="resetPassForm.coinpassword"  placeholder="请输入提款密码"></el-input>
        </el-form-item>
        <el-form-item class="footer">
          <el-button @click="setModalState('setPassword')">取 消</el-button>
          <el-button  type="primary" @click="surePass('resetPassForm')" style="margin-left: 30px;">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState, mapMutations, mapActions,mapGetters} from 'vuex';
  export default {
    name: 'resetPwd',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入提款密码！'));
        }else {
          callback();
        }
      };
      var validateresetPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新提款密码'));
        }else {
          callback();
        }
      };

      return {
        resetPassForm:{
          coinpassword:'',
        },
        setPassForm:{
          oldcoinpassword:'',
          newcoinpassword:'',
        },

        rules3: {
          coinpassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
        },
        rules2: {
          oldcoinpassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
          newcoinpassword: [
            { validator: validateresetPass, trigger: 'blur' }
          ]
        },
        titleContent:'',
        sureId:'',
        tokenPwd:''
      }
    },
    created() {
      this.getInfo({uid:this.getUserId})
    },
    methods:{
      ...mapActions([
        'resetPassAction',
        'setWithdrawalPassword',
        'confirmPassword',
        'getInfo',
      ]),
      ...mapMutations([
        "setModalState",
      ]),
      // 修改密码
      setResetPass(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              oldcoinpassword:this.setPassForm.oldcoinpassword,
              coinpassword:this.setPassForm.newcoinpassword,
            }
            this.setWithdrawalPassword(params).then(res=>{
              this.setModalState('setPassword')
            })

          }else {
            return false;
          }
        })
      },
      // 初始化密码
      surePass(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              coinpassword:this.resetPassForm.coinpassword,
            }
            this.confirmPassword(params).then(res=>{
              this.setModalState('setPassword')
            })
          }else {
            return false;
          }
        })
      },
    },
    computed: {
      ...mapState([
        'chatuserInfoStore',
        'chatListStore',
        "indexStore"
      ]),

    ...mapGetters(['getUserId']),
      getInfoData(){
        if(this.indexStore.userHomeData.data.coinPassword ==1){
          return "修改提款密码"
        }else{
          return "设置提款密码"
        }
      }
    },
  }
</script>

<style scoped lang="less">

</style>
