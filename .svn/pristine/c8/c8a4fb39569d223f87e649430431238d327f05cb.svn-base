import Cookies from 'js-cookie'

var tmep = {v:"1.2",developer:"beta",date:"2018/8/23"};
import CryptoJS from 'crypto-js/crypto-js'

export const getTimes =  (t) => {
  let tt = t * 1000
  let date = new Date(tt)
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return Y + M + d + ' ' + h + ':' + m + ':' + s;
}


/* 下注 . */
function initpostcode(playedId,actionNum,playedGroup,beiShu,actionData,multiple,type,playname,obj) {
  var temp = {};
  temp.actionNum = actionNum;
  temp.playedGroup = playedGroup;
  temp.beiShu = beiShu;
  temp.orderId = getorderId();
  temp.actionData = actionData;
  temp.multiple = multiple;
  temp.playname = playname;
  temp.playedId = playedId;
  temp.obj=obj;
  temp.type = type;
  return temp;
}

function getorderId(){
  var trano = (new Date()) - 2147486647 * 623;
  return trano;
}

export const getTimesYueRi =  (t) => {
  let tt = t * 1000
  let date = new Date(tt)
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return Y + M + d

}


export const getTimesYueRi1 =  (t) => {
  let tt = t
  let date = new Date(tt)
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return Y + M + d

}

function videoTimeFilter(time) {
  var t = Math.abs(time * 1000) || 0;
  var h, m, s,h1,h2,m1,m2,s1,s2;
  //计算开奖倒计时
  h = Math.floor(t / 1000 / 60 / 60 % 24);
  var day = Math.floor(t / 1000 / 60 / 60 / 24) || 0;
  h = h + day * 24;
  if (h < 10) {
    h1 = "0";
    h2 = "" + h;
  } else {
    h1 = "" + Math.floor(h / 10);
    h2 = "" + h % 10;
  }
  m = Math.floor(t / 1000 / 60 % 60);
  if (m < 10) {
    m1 = "0";
    m2 = "" + m;
  } else {
    m1 = "" + Math.floor(m / 10);
    m2 = "" + m % 10;
  }
  s = Math.floor(t / 1000 % 60);
  if (s < 10) {
    s1 = "0";
    s2 = "" + s;
  } else {
    s1 = "" + Math.floor(s / 10);
    s2 = "" + s % 10;
  }
  return h1 + h2 +':' + m1 + m2 + ':' + s1 + s2
}

/* 清注根据orderId k3使用 会修改状态位*/
function clearpostcodeOrderId(list, data) {
  list = list.filter(function (vau, index, arr) {
    if(vau.orderId == data.orderId) vau.obj.state=!1;
    return vau.orderId != data.orderId;
  })
  return list;
}

/*根据 playedId && actionData 清号*/
function clearBetId(list, data) {

  // console.log(data)

  list = list.filter(function (vau, index, arr) {
    if((vau.playedId == data.id) && (vau.actionData == data.name)) {
      vau.obj.state=false;
    };
    return ((vau.playedId != data.id) || (vau.actionData != data.name));
  })
  return list;
}


/*倍数累加 actionData k3使用*/
function addBeiShu(list, actionData) {
  list = list.filter(function (vau, index, arr) {
    if(vau.actionData==actionData){vau.beiShu++};
    return vau;
  })
  return list;
}


/* 浅拷贝 */
function copyobj(json,obj) {
  obj = obj || {};
  return json.parse(json.stringify(obj))

}

/* 返回state选中个数 */
function stateConut(list){
     var count=0;
     for(var i in list){
         list[i].state ? count++ :!1;
     }
     return count;
}

/* 返还选中子码 */
function stateSname(list) {
  var temp=[];
  for(var i in list){
    list[i].state ? temp.push(list[i].name) :!1;
  }
  return temp;
}


function stateObj(list) {
  var temp=[];
  for(var i in list){
    list[i].state ? temp.push(list[i]) :!1;
  }
  return temp;
}

function setDate(key,data){
  data=data || [];
  if(key=="vocabulary" && data==[]){
    data="";
  }
  localStorage[key]=JSON.stringify(data);
}


function getDate(key) {
   var data=localStorage[key] || false;
   data=JSON.parse(data);
   return data;
};

function setSession2(key,data){
  data=data || "";
  sessionStorage[key]=JSON.stringify(data);
}


function getSession2(key) {
   var data=sessionStorage[key] || false;
   data=JSON.parse(data);
   return data;
};

function clearSession2(key) {
  // window.sessionStorage.clear()
  window.sessionStorage.removeItem(key)
}




/* 获取随机区间*/
function randomRange (min, max) {
  return parseInt(min + (max - min) * Math.random());
}





function setSession(key,data){
  data=data || ""
  Cookies.set(key, data, { });
}

function getSession(key) {
  var data=Cookies.get(key) || false;
  return data;
};


function cleraSeeion(key){
  Cookies.remove(key);
}


/*追号_逻辑*/



function toint(str){
  str=str.toString();
  var t=str.replace(/[^\d]/g,'') || 5;
  t=parseInt(t);
  t==0? t=5 :!0;
  return t;
}

/*随机字母*/

function getchar(){
  var character = String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0));
  return character;
}


/*根据属性筛选对象*/
function filtrArr(list,name,target){
  var t={};

  list=list || [];
  list.forEach(function(val,index,arr){

    if(val[name]==target){
       t=val;
    }

  })

  return t;

}





function gongGaoState(data) {
  var mydata = getDate(data.username) || []
  var timer = getThisTime()
  if(mydata.length>0 && mydata[0].time != timer){
    setDate(data.username,'')
    return false
  }
  if(mydata.length>0){
    return mydata.some(item=>{return item.type == data.type})
  }else{
    return false
  }
}




/*_________________________彩种开奖计算_____________________________*/



function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  len=len || 32;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  // return "webIM_"+uuid.join('')+"_"+new Date().getTime();
  return uuid.join('');
}




export {randomRange,getDate,setDate,copyobj,initpostcode,clearpostcodeOrderId,addBeiShu,stateConut,stateSname,clearBetId,stateObj,setSession,getSession,setSession2,getSession2,cleraSeeion,toint,getchar,filtrArr,getorderId,uuid,gongGaoState,clearSession2,videoTimeFilter}
export default tmep


