<template>
  <div class="Info-wrapper">
    <div class="newfriend"   @mousedown="windowMove($event)">
      <div class="nickname">黑名单列表</div>
    </div>
    <div class="new-friend-add" v-if="friendsListStore.blackList.length>0">
      <div class="new-friend-item flex-between"

      v-for="(item,index) in friendsListStore.blackList"
      >
        <div class="new-friend-item-info flex">
          <img :src="item.head_portrait" alt="">
          <div>
            <span>{{item.remarks_name}} </span>
            <br>
            {{item.username}}
          </div>

          <p v-if="item.black_to == 1">来源：自己拉黑好友</p>
          <p v-else-if="item.black_to == 2">来源：好友拉黑自己</p>
        </div>
        <div class="new-friend-isjieshou" v-if="item.black_to == 1">
          <span class="accepet" @click="cancelBlackFriend(item)">取消拉黑</span>
        </div>
      </div>
    </div>

    <div class="noneData" v-else>暂无黑名单</div>
  </div>
</template>

<script>
  import { mapGetters ,mapActions , mapState ,mapMutations} from 'vuex'
  export default {
    data(){
      return{
      }
    },
    computed: {
      ...mapGetters([
        'getUserId',
      ]),
      ...mapState([
        'friendsListStore',
      ]),
    },
    created() {
      this.getBlackList({self_uid:this.getUserId})
    },
    methods: {
      ...mapActions([
        'getBlackList',
        'cancelBlack'
      ]),
      ...mapMutations([
        "windowMove"
      ]),
      // 取消拉黑
      cancelBlackFriend(item){
        this.$confirm(`是否取消拉黑${item.remarks_name}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.cancelBlack({self_uid:this.getUserId,friend_uid:item.friend_uid}).then(res=>{
            this.getBlackList({self_uid:this.getUserId})
          })
        }).catch(()=>{})
      }
    }
  }
</script>

<style lang="less" scoped>
  .newfriend {
    height: 60px;
    padding: 28px 0 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    .nickname {
      font-size: 18px;
    }
  }
    .new-friend-add {
    height: 590px;
    overflow: auto;
    padding-top: 15px;
    .new-friend-item {
      width: 450px;
      margin: 0 auto;
      padding: 12px 0;
      border-bottom: 1px solid #e7e7e7;
      .new-friend-item-info {
        font-size: 13px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 5px;
        }
        span {
          font-size: 16px;
          }
          p{
            margin-left: 20px;
            color:#999;
          }
      }
      .new-friend-isjieshou {
        color:#fff;
        cursor: pointer;
        display: flex;
        span{
          line-height: 26px;
          text-align: center;
          border-radius: 3px;
          width: 60px;
          height: 26px;
          display: block;
        }
        .accepet{
          background-color: #1aad19;
        }
        .refuse{
          background-color: #ddd;
          margin-left: 10px;
        }
      }
    }
  }
  .noneData{
    text-align: center;
    font-size: 14px;
    line-height: 100px;
  }
</style>

