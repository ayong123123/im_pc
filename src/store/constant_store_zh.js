import Vue from 'vue'
import axios from '../axios'
import qs from 'qs'
import {getDate,setDate} from '../common/common'

/*常量表*/

export default {
  state:{

    '0'     :'0'    ,  //'操作成功',
    '1'     :'1'    ,  //操作失败',
    '2'     :'2'    ,  //暂无数据',
    '3'     :'3'    ,  //参数错误',
    '4'     :'4'    ,  //验证码错误',
    '5'     :'5'    ,  //未输入验证码',
    '6'     :'6'    ,  //安全码错误',
    '10'    :'10'   ,  //'未输入用户名',
    '11'    :'11'   ,  //'未输入密码',
    '12'    :'12'   ,  //'用户未登录',
    '13'    :'13'   ,  //'用户名或密码不正确',
    '14'    :'14'   ,  //'密码不正确',
    '15'    :'15'   ,  //'账号不存在或已被冻结',
    '16'    :'16'   ,  //'提交设备不明',
    '17'    :'17'   ,  //'登录信息刷新失败',
    '18'    :'18'   ,  //'缺少推荐码或推荐码格式有误',
    '19'    :'19'   ,  //'缺少安全码',
    '20'    :'20'   ,  //'提款密码只能是6~16位的纯数字',
    '21'    :'21'   ,  //'登录密码不能和提款密码一样',
    '22'    :'22'   ,  //'用户名包含非法字符',
    '23'    :'23'   ,  //'请输入3-16位用户名',
    '24'    :'24'   ,  //'请输入6-22位密码',
    '25'    :'25'   ,  //'同IP 24小时内注册数量已满',
    '26'    :'26'   ,  //'推荐码无效',
    '27'    :'27'   ,  //'账号已存在',
    '28'    :'28'   ,  //'获取用户信息失败',
    '29'    :'29'   ,  //'修改呢称失败',
    '30'    :'30'   ,  //'彩种关闭或不存在',
    '31'    :'31'   ,  //'没有开奖信息',
    '41'    :'41'   ,  //'聊天室已关闭',
    '42'    :'42'   ,  //'聊天室禁言时段',
    '43'    :'43'   ,  //'总代理不可被拉黑或禁言',
    '44'    :'44'   ,  //'操作用户权限不足',
    '45'    :'45'   ,  //'无法对自己进行操作',
    '46'    :'46'   ,  //'该用户在禁言状态，禁止进入聊天室',
    '47'    :'47'   ,  //'该用户在黑名单，禁止进入聊天室',
    '50'    :'50'   ,  //'未绑定银行卡',
    '51'    :'51'   ,  //'银行卡号或银行卡号格式不正确',
    '52'    :'52'   ,  //'未填写开户行或填写错误',
    '53'    :'53'   ,  //'未填写开户人或填写错误',
    '54'    :'54'   ,  //'未选择银行类型',
    '55'    :'55'   ,  //'银行账号已经使用',
    '56'    :'56'   ,  //'旧手势不正确',
    '57'    :'57'   ,  //'旧密码不正确',
    '58'    :'58'   ,  //'手机格式有误',
    '59'    :'59'   ,  //'您已经绑定过手机号',
    '60'    :'60'   ,  //'邮箱格式错误',
    '61'    :'61'   ,  //'您已经绑定过邮箱',
    '62'    :'62'   ,  //'筹码金额最大为 999999',
    '63'    :'63'   ,  //'用户非代理',
    '64'    :'64'   ,  //'开始时间不能大于结束时间',
    '65'    :'65'   ,  //'用户不存在',
    '66'    :'66'   ,  //'返点格式设置有误',
    '67'    :'67'   ,  //'推广链接重复',
    '68'    :'68'   ,  //'返点设置有误',
    '69'    :'69'   ,  //'银行信息有误',
    '70'    :'70'   ,  //'提现金额包含非法字符',
    '71'    :'71'   ,  //'提款金额大于可用余额，无法提款',
    '72'    :'72'   ,  //'低于最低提现金额',
    '73'    :'73'   ,  //'高于最高提现金额',
    '74'    :'74'   ,  //'当前时间端无法提现',
    '75'    :'75'   ,  //'洗码量未达标',
    '76'    :'76'   ,  //'帐户资金不足',
    '77'    :'77'   ,  //'暂时不可充值',
    '78'    :'78'   ,  //'兑换积分不足100，无法兑换',
    '79'    :'79'   ,  //'积分输入错误',
    '80'    :'80'   ,  //"积分兑换低于最低兑换值",
    '81'    :'81'   ,  //'积分不足',
    '82'    :'82'   ,  //'充值码错误',
    '83'    :'83'   ,  //'该充值码已经使用过啦',
    '84'    :'84'   ,  //'该充值码已过期',
    '85'    :'85'   ,  //'订单号格式错误',
    '86'    :'86'   ,  //'充值金额格式有误',
    '87'    :'87'   ,  //'充值额度不符合规定范围',
    '88'    :'88'   ,  //'平台已停止投注',
    '89'    :'89'   ,  //'代理禁止投注',
    '90'    :'90'   ,  //'该彩种已停止销售！',
    '91'    :'91'   ,  //'投注失败：已过购买时间',
    '92'    :'92'   ,  //'投注号码不符合规则',
    '93'    :'93'   ,  //'游戏玩法已关闭',
    '94'    :'94'   ,  //'当前投注未达到最低投注额',
    '95'    :'95'   ,  //'投注金额有误',
    '96'    :'96'   ,  //'投注注数有误',
    '97'    :'97'   ,  //'该彩种禁止追号',
    '98'    :'98'   ,  //'追号倍率有误',
    '99'    :'99'   ,  //'账号余额不足',
    '100'   :'100'  ,  //'安全码已存在',
    '101'   :'101'  ,  //'QQ未填写或格式错误',
    '102'   :'102'  ,  //'手机未填写或格式错误',
    '103'   :'103'  ,  //'邮箱未填写或格式错误',
    '104'   :'104'  ,  //'姓名未填写或格式错误',
    '105'   :'105'  ,  //'微信未填写或格式错误',
    '106'   :'106'  ,  //'找不到定单',
    '107'   :'107'  ,  //'重复撤单',
    '108'   :'108'  ,  //'用户权限错误',
    '109'   :'109'  ,  //'已经开奖，不能撤单',
    '110'   :'110'  ,  //'测试号无法使用该功能',
    '111'   :'111'  ,  //'单个金额必须大于等于0.01',
    '112'   :'112'  ,  //'红包个数限制为1~500个',
    '113'   :'113'  ,  //'金额设置有误',
    '114'   :'114'  ,  //'红包功能维护中，请稍后再试',
    '115'   :'115'  ,  //'用户等级不足',
    '116'   :'116'  ,  //'签到活动已关闭',
    '117'   :'117'  ,  //'今天已经完成签到',
    '5000'  :'5000' ,  //'系统启动强制登录，识别用户未登录',
    '8888'  :'8888' ,  //'操作成功无返回值',
    '9999'  :'9999' ,  //'网站维护中',
    '10000' :'10000',  //'非法状态码'

  },
  /*$store.commit*/
  mutations: {},

  /*$store.dispatch*/
  actions:{},


  /*$store.getters*/
  getters:{

    getCodeStateZh:(state) => (code) => {
      if(code == state[0] || code == state[8888]){
        return true;
      }else {
        return false
      }
    }

  }

}

