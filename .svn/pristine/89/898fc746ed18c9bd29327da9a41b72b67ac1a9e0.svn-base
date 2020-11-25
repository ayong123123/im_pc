<!-- 好友列表 -->
<template>
  <div class="friendCirclelist">
    <ul>
      <li
        :class="{'friactive':index == checkIndex}"
        v-for="(item,index) in menuList"
        :key="index"
        @click="friendCircleSet(index)"
      >
        <i></i>
        <span>{{item.title}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState, mapActions ,mapGetters } from 'vuex'
  export default {
    data(){
      return{
//      {id:1,title:'朋友圈'},
        menuList:[

          {id:1,title:'黑名单'},
//          {id:2,title:'账变'},
        ],
        checkIndex:0
      }
    },
    computed: {
      ...mapState([
        'chatuserInfoStore',
      ]),
      ...mapGetters([
        'searchedFriendlist'
      ])
    },
    methods: {
      ...mapActions([
      ]),
      friendCircleSet(index){
        this.checkIndex = index
        this.$emit('childByValue', ++index)
      }
    }
  }
</script>

<style lang="less" scoped>
  .friendCirclelist {
    height: 650px;
    /*// 阻止复制*/
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    ul{
      li{
        line-height: 48px;
        cursor: pointer;
        span{
          font-size: 14px;
          color: #000000;
          margin-left: 20px;
        }
      }
    }
  }
  .friactive{
    background-color: #C4C4C4;
  }
</style>
