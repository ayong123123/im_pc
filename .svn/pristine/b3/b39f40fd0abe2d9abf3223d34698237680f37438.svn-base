<template>
    <!--询问弹窗-->
    <el-dialog
            title="提示"
            :visible.sync="configData.visible"
            width="20%"
            center>
        <div style="text-align: center"><i class="el-icon-warning icon"></i>请选择撤回或者转发本条消息</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="chehui">撤回</el-button>
            <el-button type="primary" @click="zhuanfa">转发</el-button>
           </span>
    </el-dialog>
</template>

<script>
  export default {
    name: 'wxConfig',
    props:['configData'],
    methods:{
      chehui() {
        this.$emit('messageBack',this.configData.data);
        this.$emit('closeConfig')
      },
      zhuanfa() {
        this.$emit('getZhuanFa',this.configData.data)
        this.$emit('closeConfig');
      },
    }

  }
</script>

<style scoped>
.icon{
    color: #e6a23c;font-size: 20px;vertical-align: -2px;margin-right: 5px;
}
</style>
