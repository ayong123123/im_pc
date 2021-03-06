import Dexie from "dexie"
// import WebIMConfig from "WebIMConfig"
// import { config } from "@/config/"
// const DB_ENABLE = WebIMConfig.enableLocalStorage
// const DB_VERSION = "2.0"
const DB_VERSION = 4
const TABLE_NAME = "webimBeta_history"
// const TABLE_INDEX_KEYS = [ "id", "from", "to", "type", "isUnread", "status" ]
const TABLE_INDEX_KEYS = [ "id++","unique_value","type","code","control","action","create_time","token","from","comment","singlemessage","groupmessage","msg","asFrom","asTo","read","asGroup","status","userMsg"];
import store from '../store';

import _config from '../configWX/configWX';

/*
* type 消息类型
* code 消息状态 3失败 4成功
* control 请求控制器
* action  请求方法
* create_time 发送时间
* unique_value uuid
* token    信息token
* from     信息来源 客户端
* comment  预留
* singlemessage 单聊信息
* groupmessage 群聊信息
*
* msg      统一信息格式体
* asFrom   发送者id
* asTo     接收者id
// * read     是否已读
* asGroup  //是否群聊 2群聊 1单聊
* userMsg  //是否自己的信息 0 1
* status   //发送状态      sending发送中 succeed完成
* */

// const { PAGE_NUM } = config
// In the following line, you should include the prefixes of implementations you want to test.
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

const  DB_ENABLE=true;


if (!window.indexedDB) {
    window.alert("您的浏览器版本过于老旧,无法正常启动程序,请更换");
}


const AppDB = {

    // init db
    init: function(username) {
      username=username || "webIM_"+store.state.chatuserInfoStore.loginData.id;
      //
      // var db = new Dexie("username");
      // db.version(1).stores({
      //   friends: "++id,name,age",
      //   pets: "++id,name,kind"
      // });
      // db.open();

// Do some application logic on the database:
//       db.transaction("rw", db.friends, db.pets, function () {
//         db.friends.add({name: "David", age: 40, sex: "male"});
//         db.friends.add({name: "Ylva", age: 39, sex: "female"});
//         db.pets.add({name: "Josephina", kind: "dog"});
//
//         db.friends.where("name").equalsIgnoreCase("david").each(function(friend) {
//           console.log("Found friend: " + friend.name);
//         });

//         db.pets.where("kind").anyOf("dog", "cat").each(function(pet) {
//           console.log("Found dog or cat: " + pet.name);
//         });
//       }).catch (function (e) {
//         console.error(e.stack || e);
//       });
//       return;

        if (!DB_ENABLE || this.db) {
          return
        }



      // create a database, use username as db name
        const db = new Dexie(username)

        // create a table, use TABLE_NAME as table name
        db.version(DB_VERSION).stores({
          [TABLE_NAME] : TABLE_INDEX_KEYS.join(",")
        })

        this.db = db
        db.open();
        this.$_TABLE = db.table(TABLE_NAME);
    },

    exec(cb1, cb2) {
        return new Promise(function(resolve, reject) {
            if (DB_ENABLE) {
                cb1(resolve)
            } else {
                cb2 && cb2(reject)
            }
        })
    },

    // get unread messages
    getUnreadList() {
        const $_TABLE = this.$_TABLE
        return this.exec(resolve => {
            $_TABLE.where("isUnread").equals(1).toArray().then(res => resolve(res))
        })
    },

    // get lastest mumber of message by start index
    /*
    * 获得对应关系 聊天记录
    * @p chatType 是否群聊
    * @p from 来源id
    * @p to   接收者id
    * */
    getMessage(id, chatType = "chat", offset = 0, limit = 50) {
        const $_TABLE = this.$_TABLE;
        return this.exec(resolve => {
            $_TABLE.where("type")
                .equals(chatType)
                .filter(item => {
                    if (item.error) {
                        return false
                    }
                    if (chatType === "chat") {
                        return item.from == id || item.to == id
                    } else {
                        return item.to == id
                    }
                })
                .reverse()
                .offset(offset)
                .limit(limit)
                .sortBy("time")
                .then(res => {
                    resolve(res.reverse())
                })
        })
    },

    // read all messages of conversation(当前窗口_标记已读)
    /*
    *@parameter 群聊 私聊
    *@parameter id  发送者
    * */
    readMessage(chatType,fromId) {
      if(!this.$_TABLE){this.init()};
      const $_TABLE = this.$_TABLE;
        return  this.exec(resolve => {
          $_TABLE.where({"read":_config.MSG_UNREAD,"asFrom":fromId,asGroup:chatType}).modify({
            read:_config.MSG_READ
          }).then(res => {
              // console.log("查询集",res);
              resolve(res)
            })
        })

      // this.exec(resolve => {
      //   $_TABLE.where({"read":_config.MSG_UNREAD,"asFrom":fromId,asGroup:chatType}).toArray().then(res => {
      //     console.log("查询集",res);
      //     resolve(res)
      //   })
      // })
    },

    // update  message status 信息标示为发送成功
    updateMessageStatus(id, status) {
      if(!this.$_TABLE){this.init()};
      const $_TABLE = this.$_TABLE;
        return this.exec(resolve => {
            $_TABLE.where("id")
                .equals(id)
                .modify({ "status": status })
                .then(res => {
                    // console.log("res",res);
                    resolve(res)
                })
        })
    },

    //add a message to the database

    //@parameter  messgae
    addMessage(message) {
        if(!this.$_TABLE){this.init()};
        const $_TABLE = this.$_TABLE;
        message=JSON.parse(JSON.stringify(message));
        message.groupmessage=message.groupmessage || {};
        message.singlemessage=message.singlemessage || {};

        message.groupmessage=JSON.stringify(message.groupmessage);
        message.singlemessage=JSON.stringify(message.singlemessage);


      //保留100条
      var tempList=$_TABLE.where({asGroup:message.asGroup,asFrom:message.asFrom,asTo:message.asTo}).reverse().sortBy('create_time').then((res)=>{
      res.forEach((val,index,arr)=>{
           if(index>100){
             $_TABLE.where("unique_value").equals(val.unique_value).filter(item => {
               return true;
             }).delete().then(res => {
               // console.log("删除成功",res)
             }).catch(e => console.log("add messaga:", e));
           }
      })
      }).catch(e => console.log("controlCum messaga:", e));

      // console.log("tempList",tempList)
      if (!message.error) {
            return this.exec(resolve => {
                $_TABLE.where("unique_value").equals(message.unique_value).count().then(res => {
                // $_TABLE.where("unique_value").equals("webIM_kBr2koyahuGh_1565008297416").count().then(res => {
                //   console.log("添加前查询",res)
                  if (res === 0 ) {
                        $_TABLE.add(message)
                            .then(res => {
                              // console.log("添加成功",res)
                              resolve(res)
                            }).catch(e => console.log("add messaga:", e));
                    }
                })
            })
        }
    },


  // .delete().then(res => {
  //   console.log("删除成功",res)
  //   resolve(res)
  // })

    //保留特定条数50
    controlCum(asGroup,asFrom,asTo){

      // console.log(asGroup,asFrom,asTo);
      // if(!this.$_TABLE){this.init()};
      // const $_TABLE = this.$_TABLE;
      // return;
      // return this.exec(resolve => {
      //   $_TABLE.where({asGroup:asGroup,asFrom:asFrom,asTo:asTo}).sortBy("create_time").toArray().then((res)=>{
      //     console.log("res",res);
      //     // return resolve(res);
      //   }).catch(e => console.log("controlCum messaga:", e));
      // })

    },
    // clear all messages of specified conversation
    clearMessage(unique_value) {
      if(!this.$_TABLE){this.init()};
      const $_TABLE = this.$_TABLE;
        return this.exec(resolve => {
            $_TABLE.where("unique_value").equals(unique_value).filter(item => {
                  // console.log("_____________",item)
                  return true;
                }).delete().then(res => {
                  // console.log("删除成功",res)
                  resolve(res)
                }).catch(e => console.log("add messaga:", e));
        })
    },

    getLastMsg(asGroup,asFrom,asTo){
      if(!this.$_TABLE){this.init()};
      const $_TABLE = this.$_TABLE;
      return this.exec(resolve => {
        $_TABLE.where({asGroup:asGroup,asFrom:asFrom,asTo:asTo}).last().then(res => {
          // console.log("查询最后一条",res)
          resolve(res)
        }).catch(e => console.log("getLast messaga:", e));
      })
    },

}

// in order to test in browser, will be removed
window.AppDB = AppDB

export default AppDB
