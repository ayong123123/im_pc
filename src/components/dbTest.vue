<template>
  <div class="wx-login">
    <button @click="initDB()">测试1</button>
    </br>
    <button @click="addMessg()">添加记录</button>
    </br>
    <button @click="deletMessg()">删除记录</button>
  </br>
    <button @click="readMessage()">标识已读</button>
  </br>
    <button @click="updateMessageStatus()">跟新已读状态</button>
  </br>
   <button @click="protoSwap()">实体类转pro</button>
  </br>
   <button @click="sendMessagee()">推送信息</button>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex';
  import {copyobj, setSession, getSession, getchar,randomRange} from '../common/common'
  import {Message} from 'element-ui'
  import AppDB from '../utils/AppDB'
  import goo from '../utils/AppDB'
  import config from '../configWX/configWX'
  import {setBefferMsg,getResponeMsg} from '../utils/ProtoSwap'
  export default {
    name: 'home',
    data () {
        return{
            arr:[ ],

        }
    },
    mounted(){

    },
    created (){
//      console.log("___",config._ifGroup(7))
      var _temp={};
      //调试数据 默认 推送者id为1
      for(var i=0;i<888;i++){
        _temp={};
        _temp.type=randomRange(5,13);
        _temp.code=randomRange(3,5);
        _temp.control="action";
        _temp.action="action";
        _temp.create_time=new Date().getTime()-randomRange(1,100000);
        _temp.unique_value=i;
        _temp.token="token";
        _temp.from="pc";
        _temp.comment="comment";


         _temp.DggChatSingleMessage={};
         _temp.DggChatGroupMessage={};
         if(config._ifGroup(_temp.type)){
           _temp.DggChatGroupMessage={
               sendId:randomRange(0,5),
               groupId:randomRange(0,3),
               content:"xxx",
               comment:"xxx",
           }
         }else {
           _temp.DggChatSingleMessage={
             sendId:randomRange(0,5),
             acceptId:randomRange(0,5),
             content:"xxx",
             comment:"xxx",
           }
         };


         this.arr.push(_temp);
//      _temp=
      }

//      console.log(this.arr);
//        console.log(new Date().getTime())
    },
    methods: {

      ...mapActions([
        "sendMessageIM"
      ]),


      initDB(){
        AppDB.init();
      },

      addMessg(){
        this.arr.forEach(function(val,index,arr){
          AppDB.addMessage(val)
        })
      },

      deletMessg(){
        AppDB.clearMessage({unique_value:1})
      },

      readMessage(){
        var _res=AppDB.readMessage(config.MSG_GROUP,2);
        console.log("_res",_res)
      },

      updateMessageStatus(){
          AppDB.updateMessageStatus(1,config.MSG_STATUS_SUCCEED);
      },

      protoSwap(){
        //单聊
        var _getSingleMessage = {
          sendid: 1,
          acceptid: 2,
          content: "1111",
          comment: "22222",
        };

        //群聊
        var _DggChatGroupMessage = {
          sendid: randomRange(0, 5),
          groupid: randomRange(0, 3),
          content: "xxx",
          comment: "xxx",
        };


//        var _json = {
//          getUniqueId: "",//32位的md5唯一值(必须)
//          getFrom: "web,android,ios",//#消息来源（必须）
//          getAvatar: "http://avatar",//#消息发送人头像（必须）
//          getNickname: "lio",//#消息发送人昵称（必须）
//          getType: 6,//#消息类型（必须是6）
//          getSendTime: '1520325678',//#消息发送时间秒级（必须）
//          getCode: 3,//#失败3失败,4成功（必须）
//          getType: 7,  //#消息类型（必须是7）
//          getSingleMessage: {}, //#单聊消息对象（必须）
//          getSendId: 0, //#消息发送者id(必须)
//          getAcceptId: 21, //#消息接收人id(必须)
//          getContent: "{id:'红包id'，amount：'红包金额',topic:'红包描述'}",  //#消息内容必须是一个红包信息json（必须）
//          getComment: "{}", //#扩展字段（备用不需要传）;
//        };

        var _json={
          type:9,
          code:3,
          control:"SingleChat",
          action:"text",
          create_time:new Date().getTime(),
          unique_value:"8DEE60783ADC611DD306CA1A3E3478FA",
          token:1,
          singlemessage:{},
//          groupmessage:{},
          comment:{},
        };

//        setBefferMsg()

        var _arr=setBefferMsg(_json,_getSingleMessage,9);
        console.log("___",_arr)
        console.log("______",_arr.toString())


        var _temp="8,9,16,3,26,10,83,105,110,103,108,101,67,104,97,116,34,4,116,101,120,116,40,215,183,234,183,196,45,50,32,56,68,69,69,54,48,55,56,51,65,68,67,54,49,49,68,68,51,48,54,67,65,49,65,51,69,51,52,55,56,70,65";


       var _res=getResponeMsg(_arr);
       console.log("解码",_res)

        },

      sendMessagee(){
          this.sendMessageIM({to:11,type:5,message:"454564656", reserved:JSON.stringify({level:this.indexStore.userHomeData.data.userlevelid.level,levelName:this.indexStore.userHomeData.data.userlevelid.levelName})});
      },

    },
//    components: {},
   computed: {
     ...mapState([
        "indexStore"
     ]),
   },
//    filters: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
