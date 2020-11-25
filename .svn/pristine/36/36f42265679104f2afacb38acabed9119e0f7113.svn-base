import Vue from 'vue'
import axios from '../axios'
import qs from 'qs'
import {getDate,setDate} from '../common/common'

/*常量表*/

export default {
  state:{
    '10000' :'10000',  //'非法状态码'
    '10002' :'10002',  //'非法状态码'

  },
  /*$store.commit*/
  mutations: {},

  /*$store.dispatch*/
  actions:{},


  /*$store.getters*/
  getters:{

    getCodeState:(state) => (code) => {
      if(code == state[10002] || code == state[10000]){
        return true;
      }else {
        return false
      }
    }

  }

}

