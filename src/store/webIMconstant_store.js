import Vue from 'vue'
import axios from '../axios'
import qs from 'qs'
import {getDate,setDate} from '../common/common'

/*常量表*/

export default {
  state:{
      "1":"1",//绑定消息
      "2":"2",//点对点消息
      "3":"3",//群组消息 x
      "4":"4",//前端心跳
      "5":"5",//绑定成功
      "6":"6",//群聊消息撤回
      "7":"7",//错误消息
      "8":"8",//红包消息 x
      "9":"9",//打赏消息 x
      "10":"10",//分享消息 x
      "11":"11",//签到推送 x
      "12":"12",//禁言消息
      "13":"13",//拉黑消息
      "14":"14",//跨组私聊消息
      "15":"15",//超级管理管理员发送消息接口
      "16":"16",//个人对个人红包消息推送（预留）
      "17":"17",//个人消息撤回（预留）
      "20":"20",//成功
  },
  /*$store.commit*/
  mutations: {},

  /*$store.dispatch*/
  actions:{},


  /*$store.getters*/
  getters:{

    getWebImState:(state) => (code) => {
      // if(code == state[1] || code == state[8888]){
      if(code !=state[7] || code ==state[20]){
        return true;
      }else {
        return false
      }
    },

    //判断是否为 群组信息
    getGeneralState:(state) => (code) => {
      if(code ==state[3] || code ==state[8] || code ==state[9] || code ==state[10] || code ==state[11]){
        return true;
      }else {
        return false
      }
    }

  }

}

