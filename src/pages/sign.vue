<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back"></span>
      <span class="header-title">合同签署</span>
    </my-header>

    <div class="page-content">
      <div class="panel">
        <div class="title">活体认证</div>
        <div class="living__img">
          <div class="living__wrapper" @click="livingCheck">
            <img v-if="livingStatus === 0" src="../assets/img/living_click_default.png" alt="活体认证">
            <img v-if="livingStatus === 1" :src="livingImg" alt="活体认证成功">
            <img v-if="livingStatus === 2" src="../assets/img/living_faile.png" alt="活体认证失败">
          </div>
          <p v-if="livingStatus === 0">点击图标进行识别<br/>请正面对准手机，确保光线充足</p>
          <p v-if="livingStatus === 1">恭喜您<br/>活体认证成功</p>
          <p v-if="livingStatus === 2">很遗憾<br/>活体认证失败</p>
        </div>
      </div>

      <div class="panel">
        <div class="title">签署合同</div>
        <div>
          <my-xy :xyData="protocolArr">
            <input class="xy-input" type="checkbox" v-model="agreeProtocol">
          </my-xy>
        </div>
      </div>

      <div class="panel">
        <div class="title">验证码</div>
        <div class="smsCode-wrapper">
          <span class="name">验证码</span>
          <input type="number" placeholder="请输入验证码" v-model="smsCode" oninput="if(value.length>6)value=value.slice(0,6)">
          <span class="smsCode" >获取验证码</span>
        </div>
      </div>

      <div class="align-center btn-groups">
        <my-button @click="submit">确认</my-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 活体状态 0未做活体检测 1成功 2失败
      livingStatus: 0,
      // 活体成功图片
      livingImg: '',
      livingImgDefault: require('../assets/img/living_success@2x.png'),
      agreeProtocol: false,
      protocolArr: [
        {
          title: '《个人消费贷款合同》',
          url: 'https://zmcustprod.zmxy.com.cn/auth/protocol.htm?merchantId=268820000154396373223&type=03&platform=aop'
        },
        {
          title: '《客户保障计划服务合同》',
          url: 'https://www.baidu.com'
        }
      ],
      smsCode: ''
    }
  },
  methods: {
    livingCheck () {},
    submit () {
      this.$router.replace('/video')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/style/index.styl'

.panel
  padding: 30px 36px 44px 36px
  margin-top: 28px
  border-radius: 10px
  background-color #f5f5f6
  .title
    padding-left: 22px
    margin-bottom: 50px
    font-size: $fs-30
    border-left: 8px solid;
    border-color: $color-theme
    color: $color-text-3
.living__img
  width: 100%
  text-align: center
  img
    width: 50%
    height: auto
    margin-bottom: 10%
  p
    line-height: 1.6
    font-size: 26px

.smsCode-wrapper
  display: flex
  align-items: center
  padding-bottom: 28px
  font-size: $fs-30
  border-bottom: 1px solid #e1e1e1; /*no*/
  .name
    width: 140px
    color: $color-text-3
  input
    flex: 1
    height: 100%
    border: none
    outline: none
    background-color: transparent
  .smsCode
    display: flex;
    justify-content: center
    align-items: center
    width: 140px
    height: 46px
    border: 1px solid; /*no*/
    border-color: $color-theme;
    border-radius: 8px;
    font-size: $fs-24
    color: $color-theme;
.btn-groups
  padding: 70px 0
</style>
