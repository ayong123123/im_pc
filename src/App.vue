<template>
  <div id="app">
    <!--<h1>{{$store.state.count}}</h1>-->
    <router-view/>

  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex';
  import {Message,MessageBox} from 'element-ui';
  import {setSession, getSession, cleraSeeion} from './common/common'
export default {
  name: 'App',
  data () {
    return {

    }
  },
  created (){

  },
  methods: {
    ...mapMutations([

    ]),
  },
  computed:{
  },
  watch:{

  },
  beforeDestroy(){
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
  height: 100%;
}
  html,body{margin: 0;padding: 0;}
</style>
