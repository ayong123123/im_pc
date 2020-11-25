<template>
  <div class="content">
    <div class="friend-wrapper">
      <wx-search v-if="chatuserInfoStore.loginData.is_admin == 1"></wx-search>
      <wx-my-friends @leftData="leftData"></wx-my-friends>
    </div>
    <div class="friendinfo" >
      <wx-userinfo v-if="dataVal == 0"></wx-userinfo>
      <wx-groupChat v-if="dataVal == 1"></wx-groupChat>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex';
  import {copyobj,setSession,getSession,getchar} from '@/common/common'
  import {Message} from 'element-ui'
  export default {
    name: 'friends',
    data () {
      return {
        dataVal:'',
        contentHeight:'600px'
      }
    },
    mounted(){

    },
    created (){

    },
    methods: {
      ...mapMutations([

      ]),

      ...mapActions([

      ]),
      leftData (val) {
        this.dataVal = val
      },


    },
    components:{

    },
    computed: {
      ...mapState([
        'chatuserInfoStore'
      ]),
    },
    filters:{

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .content {
    display: flex;
    width: 800px;
    .friend-wrapper {
      width: 250px;
      background: #E7E7E7;
    }
    .friendinfo {
      flex: 1;
    }
  }

</style>
