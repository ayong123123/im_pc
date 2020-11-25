import Vue from 'vue'
import vuex,{mapState} from 'vuex'
import indexStore from './index_store.js'
import chatuserInfoStore from './chatuserInfo_store.js'
import constantStore from '../store/constant_store.js'
import constantStoreZh from '../store/constant_store_zh.js'
import webIMconstant_store from '../store/webIMconstant_store.js'
import chatListStore from '../store/chatList_store.js'
import friendsListStore from '../store/friendsList_store.js'
import friendCircleStore from '../store/friendCircle_store.js'
import createPersistedState from "vuex-persistedstate";
import getter from './getter'
Vue.use(vuex);

import wechatIMstore from './wechatIM_store.js';
import msgListStore from './msgList_store.js';


export default new vuex.Store({
  modules:{
    chatuserInfoStore:chatuserInfoStore,
    wechatIMstore:wechatIMstore,
    constantStore:constantStore,
    webIMconstant_store:webIMconstant_store,
    chatListStore:chatListStore,
    friendsListStore:friendsListStore,
    friendCircleStore:friendCircleStore,
    msgListStore:msgListStore,
    constantStoreZh:constantStoreZh,
    indexStore:indexStore

  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    // reducer(val) {
    //   return {
    //     msgListStore: msgListStore,
    //     chatListStore:chatListStore,
    //     chatuserInfoStore:chatuserInfoStore,
    //   }
    // }
  })],
  // getter
})


