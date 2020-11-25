<template>
  <div class="Info-wrapper">
    <div class="newfriend"   @mousedown="windowMove($event)">
      <div class="nickname">账变列表</div>
    </div>
      <div class="account-info">
        <table >
          <tr class="table-header">
            <th>帐变金额</th>
            <th>帐变时间</th>
            <th>帐变信息</th>
          </tr>
          <tr class="trChange" v-if="showData == 0" v-for="item in chatuserInfoStore.dataAccountChange.data">
            <td :class="(item.status*1 == 2 || item.status*1 == 4) ? 'greenn' : 'redd'"><span>{{(item.status*1 == 2 || item.status*1 == 4) ? '-' : '+'}}</span>{{item.amount}}</td>
            <td>{{item.create_time}}</td>
            <td>{{item.message}}</td>
          </tr>
          <tr v-if="showData == 1">
            <td colspan="3">暂无数据</td>
          </tr>
        </table>
        <el-pagination
          v-if="showData == 0"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pagesize"
          layout="total, prev, pager, next, jumper"
          :total="chatuserInfoStore.dataAccountChange.count">
        </el-pagination>
      </div>
  </div>
</template>

<script>
  import { mapGetters ,mapActions , mapState ,mapMutations} from 'vuex'
  export default {
    data(){
      return{
        parm:{
          uid:'',
          page:1,
          page_size:10
        },
        currentPage:1, //初始页
        pagesize:10,    //    每页的数据
        userList: [],
        showData:0
      }
    },
    computed: {
      ...mapGetters([
        'getUserId',
      ]),
      ...mapState([
        'friendsListStore',
        'chatuserInfoStore'
      ]),
    },
    created() {
      this.parm.uid = this.getUserId
      this.getAccountChange(this.parm).then(res=>{
       res == 10000?this.showData = 0:this.showData = 1
      })
    },
    methods: {
      ...mapActions([
        'getAccountChange'
      ]),
      ...mapMutations([
        "windowMove"
      ]),
      // 分页
      handleCurrentChange: function(currentPage){
        this.parm.page = currentPage;
        this.getAccountChange(this.parm).then(res=>{
          res == 10000?this.showData = 0:this.showData = 1
        })
      },
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
  .Info-wrapper{
    height: 100%;
  }
  .el-pagination{
    text-align: center;
    margin-top: 20px;
  }
  .noneData{
    text-align: center;
    font-size: 14px;
    line-height: 100px;
  }
  .account-info{
    height: 590px;
    background-color: #fff;
    table{
      width: 100%;
      border-collapse:collapse;
      border:0px solid #999;
      font-size: 14px;
      .table-header{
        background-color: #F5F5F5;
      }
      tr{
        line-height: 40px;
        border-bottom: 1px solid #EBEEF5;
        th{
          font-size: 15px;
        }
        td{
          text-align: center;
        }
      }
      .redd {
        color:red;
      }
      .greenn{
        color:green;
      }
      .trChange:hover{
        background: #F5F5F5;
      }
    }
  }
</style>

