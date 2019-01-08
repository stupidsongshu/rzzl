<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back"></span>
      <span class="header-title">详情确认</span>
    </my-header>

    <div class="page-content">
      <div class="panel">
        <div class="title">状态：<span class="sign-status">{{signMap[signStatus]}}</span></div>
      </div>

      <div class="panel">
        <div class="title">身份信息</div>
        <div class="content">
          <p>姓名：<span>安静</span></p>
          <p>身份证号：<span>111111111111111111</span></p>
          <p>手机号：<span>15323333232</span></p>
        </div>
      </div>

      <div class="panel">
        <div class="title">活体照片</div>
        <div class="content">
          <div class="living-wrapper"></div>
        </div>
      </div>

      <div class="panel">
        <div class="title">签署合同</div>
        <div class="content">
          我已阅读并同意：<a class="protocol" v-for="(item, index) in protocolArr" :key="index" :href="item.url" target="_blank">{{item.title}}</a>
        </div>
      </div>

      <div class="align-center btn-groups" v-if="signStatus === 1">
        <my-button @click="submit">重新签署</my-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      signStatus: 1,
      signMap: ['已签署', '审核未通过'],
      protocolArr: [
        {
          title: '《个人消费贷款合同》',
          url: 'https://zmcustprod.zmxy.com.cn/auth/protocol.htm?merchantId=268820000154396373223&type=03&platform=aop'
        },
        {
          title: '《客户保障计划服务合同》',
          url: 'https://www.baidu.com'
        }
      ]
    }
  },
  methods: {
    submit () {
      console.log('重新签署')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/style/index.styl'

.panel
  padding: 42px 36px
  margin-top: 28px
  border-radius: 10px
  background-color #f5f5f6
  .title
    padding-left: 22px
    font-size: $fs-30
    border-left: 8px solid;
    border-color: $color-theme
    color: $color-text-3
  .content
    margin-top: 30px
    line-height: 44px
    font-size: $fs-28
  .sign-status
    color: $color-theme
  .living-wrapper
    width: 260px
    height: 260px
    margin: 0 auto
    background: url('../assets/img/border.png') no-repeat center/100% 100%
  .protocol
    color: $color-theme

.btn-groups
  margin-top: 78px
</style>
