/**
 * 朋友圈
 */
import axios from '../axios'
import router from '../router'
import qs from 'qs'
import md5 from 'js-md5'
import store from '../store'
import {getDate,setDate,copyobj,setSession,getSession} from '../common/common'
import { Loading,Message,MessageBox} from 'element-ui';
const now = new Date();
export default {
  state:{
    dataFriendList: [],
    dataFriendCircle:[]
  },
  /*$store.commit*/
  mutations: {
    setFriendList(state,data){
      for (let k in data) {
        data[k].intoState = false
      }
      state.dataFriendList = data
    },
    setFriendCircleList(state,data){
      state.dataFriendCircle = data
    },
  },
  /*$store.getters*/
  getters:{},
  /*$store.dispatch*/
  actions:{
    // 获取朋友圈列表
    getFriendListAction(context, data={'self_uid': store.getters.getUserId}) {
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
        method: 'post',
        url:window.hostIm+"/api/FriendCircle/getSelfCircleList",
        data:qs.stringify(data)
      }).then(function(res){
        loading.close();
        if(store.getters.getCodeState(res.data.code)){
          context.commit("setFriendList",res.data.data)
          resolve(res.data)
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          // context.commit("setVcodeData",{});
          return false;
        }
      })
      })
    },

    // 获取好友朋友圈列表
    getFriendCircleList(context, data={'self_uid': store.getters.getUserId}) {
      let loading = Loading.service({lock: true, text: '获取中...', background: 'rgba(0, 0, 0, 0.7)'});
      return new Promise((resolve,reject)=>{
        axios({
        method: 'post',
        url:window.hostIm+"/api/FriendCircle/getFriendCircleList",
        data:qs.stringify(data)
      }).then(function(res){
        loading.close();
        if(store.getters.getCodeState(res.data.code)){
          context.commit("setFriendCircleList",res.data.data)
          resolve(res.data)
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          // context.commit("setVcodeData",{});
          return false;
        }
      })
      })
    },

    // 点赞
    addLikeAction (context, data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/FriendCircle/like",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            let result = {
              id:data.fcmid,
              data:{
                l_uid:data.likeUid,
                name:store.state.chatuserInfoStore.dataGetInfo.nickname
              }
            }
            resolve(result)
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            // context.commit("setVcodeData",{});
            return false;
          }
        })
      })
    },

    // 取消朋友圈点赞
    cancelLikeAction (context, data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/FriendCircle/cancelLike",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            let result = {
              id:data.fcmid,
              data:{
                l_uid:data.self_uid,
                name:store.state.chatuserInfoStore.dataGetInfo.nickname
              }
            }
            resolve(result)
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            // context.commit("setVcodeData",{});
            return false;
          }
        })
      })
    },

    // 评论
    addComment (context, data) {
      return axios({
        method: 'post',
        url:window.hostIm+"/api/FriendCircle/comment",
        data:qs.stringify(data)
      }).then(function(res){
        if(store.getters.getCodeState(res.data.code)){
          Message({
            message:res.data.message,
            type:"success",
            showClose:true
          })
          let result = {
            id:res.data.data.fcmid,
            data:{
              com_uid:res.data.data.comUid,
              content:data.content,
              m_id:res.data.data.circleId,
              name:store.state.chatuserInfoStore.dataGetInfo.nickname
            }
          }
          if(res.data.data.repeatUid){
            result.data.content = '回复 '+data.conName+':'+data.content
          }
          // console.log(result)
          return result
        }else {
          Message({
            message:res.data.message,
            type:"warning",
            showClose:true
          })
          return false;
        }
      })
    },
    // 发表朋友圈
    addMoments (context, data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/FriendCircle/releaseCircle",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            // context.dispatch('getFriendListAction')
            resolve(res.data)
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            // context.commit("setVcodeData",{});
            return false;
          }
        })
      })
    },
    // 删除朋友圈
    deleteMoment (context, data) {
      return new Promise((resolve,reject)=>{
        axios({
          method: 'post',
          url:window.hostIm+"/api/FriendCircle/delFriendCircle",
          data:qs.stringify(data)
        }).then(function(res){
          if(store.getters.getCodeState(res.data.code)){
            Message({
              message:res.data.message,
              type:"success",
              showClose:true
            })
            // context.dispatch('getFriendListAction')
            let result = {
              id:data.fcm_id,
            }
            resolve(result)
          }else {
            Message({
              message:res.data.message,
              type:"warning",
              showClose:true
            })
            return false;
          }
        })
      })
    }
  }
}
