<template>
    <el-dialog
            :title="chatListStore.dataniuniuList.title"
            :visible.sync="dialogData.visible"
            width="100%"
            :modal="false"
            :fullscreen="true"
            class="dialog"
            center>

        <div v-if="dialogData.id == 12">
            <div class="niuImg" v-html="chatListStore.dataniuniuList.content" ref="niuImg"></div>
        </div>
        <div v-else-if="dialogData.id == 13">
            <div class="niuImg" v-html="chatListStore.dataniuniuList.content"  ref="niuImg"></div>
        </div>
        <div v-else-if="dialogData.id == 14">
            <div class="niuImg" v-html="chatListStore.dataniuniuList.content"  ref="niuImg"></div>
        </div>
    </el-dialog>
</template>

<script>
  import { mapMutations,mapActions, mapState ,mapGetters } from 'vuex'
  export default {
    name: 'bullRedMethod',
    props:['dialogData'],
    data(){
      return{
        sendParm:{
        },
      }
    },
    created(){
      this.niuniuMethodAction({
        classId:this.dialogData.id
      })

    },
    mounted(){

    },
    components:{

    },
    computed:{
      ...mapGetters([
        'getUserId',
      ]),
      ...mapState([
        "chatListStore"
      ]),
    },
    methods:{
      ...mapMutations([
      ]),
      ...mapActions([
        "niuniuMethodAction"
      ]),
    }
  }
</script>

<style scoped lang="less">
</style>
