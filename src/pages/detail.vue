<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back" @click="back"></span>
      <span class="header-title">详情确认</span>
    </my-header>

    <div class="page-content">
      <div class="panel">
        <div class="title">状态：<span class="sign-status">{{signStatusMap[signatoryStatus]}}</span></div>
      </div>

      <div class="panel">
        <div class="title">身份信息</div>
        <div class="content">
          <p>姓名：<span>{{signatoryName}}</span></p>
          <p>身份证号：<span>{{signatoryIdno}}</span></p>
          <p>手机号：<span>{{signatoryMobile}}</span></p>
        </div>
      </div>

      <div class="panel">
        <div class="title">活体照片</div>
        <div class="content">
          <div class="living-default" v-if="!faceObjectName"></div>
          <div class="living-img" v-else>
            <img :src="faceObjectName" alt="活体照片">
          </div>
        </div>
      </div>

      <div class="panel" v-if="contractList.length > 0">
        <div class="title">签署合同</div>
        <div class="content">
          我已阅读并同意：<span class="protocol" v-for="(item, index) in contractList" :key="index" @click="preview(item)">《{{item.fileName}}》</span>
        </div>
      </div>

      <div class="align-center btn-groups" v-if="signatoryStatus === 4">
        <my-button @click="submit">重新签署</my-button>
      </div>
    </div>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64

export default {
  data () {
    return {
      // protocolArr: [
      //   {
      //     fileName: '《个人消费贷款合同》',
      //     url: 'https://zmcustprod.zmxy.com.cn/auth/protocol.htm?merchantId=268820000154396373223&type=03&platform=aop'
      //   },
      //   {
      //     fileName: '《客户保障计划服务合同》',
      //     url: 'https://www.baidu.com'
      //   }
      // ],
      contractList: [],
      signatoryStatus: 0,
      signatoryName: '',
      signatoryIdno: '',
      signatoryMobile: '',
      faceObjectName: ''
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.com.projectInfo
    },
    processStatus () {
      return this.$store.state.com.processStatus
    },
    signStatusMap () {
      return this.$store.state.com.signStatusMap
    }
  },
  created () {
    this.getContract()
    this.projectSignatoryDetail()
  },
  methods: {
    back () {
      this.goBack()
    },
    // 拉取合同列表
    getContract () {
      let options = {
        url: 'i/getContract',
        params: {
          projectSignatoryId: this.processStatus.projectSignatoryId,
          signatoryName: this.projectInfo.signatoryName,
          signatoryIdno: this.projectInfo.signatoryIdno,
          signatoryMobile: this.projectInfo.signatoryMobile
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          this.contractList = res.list || []
        }
      })
    },
    preview (contract) {
      // this.$router.push({ name: 'PDF', query: { url: Base64.encode(contract.url), fileName: Base64.encode(contract.fileName) } })
      this.$router.push({ name: 'VuePDF', query: { url: Base64.encode(contract.url), fileName: Base64.encode(contract.fileName) } })
      // this.$router.push({ name: 'VuePDF', query: { url: Base64.encode('http://fintek-static.maimob.net/rzzl/2/六合一贷后页面设计规范.pdf') } })
      // this.$router.push({ name: 'VuePDF', query: { url: Base64.encode('http://xfjr.ledaikuan.cn/六合一贷后页面设计规范.pdf') } })
    },
    // 查询项目签约人全部明细接口
    projectSignatoryDetail () {
      let options = {
        url: 'i/projectSignatoryDetail',
        params: {
          projectSignatoryId: this.processStatus.projectSignatoryId
        }
      }
      this.$http(options).then(res => {
        let signatoryStatus = res.data.signatoryStatus
        let projectSignatory = res.data.projectSignatory

        this.signatoryName = projectSignatory.signatoryName
        this.signatoryIdno = projectSignatory.signatoryIdno
        this.signatoryMobile = projectSignatory.signatoryMobile

        this.signatoryStatus = signatoryStatus.signatoryStatus
        this.faceObjectName = signatoryStatus.faceObjectName
      })
    },
    submit () {
      console.log('重新签署')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/style/index.styl'
.page-content
  padding-bottom: 30px
.panel
  padding: 42px 36px
  margin-top: 30px
  border-radius: 10px
  background-color #f5f5f6
  .title
    padding-top: 6px
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
  .living-default
    width: 260px
    height: 260px
    margin: 0 auto
    background: url('../assets/img/border.png') no-repeat center/260px 260px
  .living-img
    width: 260px
    margin: 0 auto
    img
      width: 100%
  .protocol
    color: $color-theme

.btn-groups
  margin-top: 78px
</style>
