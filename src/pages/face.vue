<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back" @click="back"></span>
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

      <div class="panel" v-if="contractList.length > 0">
        <div class="title">签署合同</div>
        <my-xy :xyData="contractList" @xyClick="preview">
          <input class="xy-input" type="checkbox" id="my-xy" v-model="agreeProtocol">
        </my-xy>
      </div>

      <div class="panel">
        <div class="title">验证码</div>
        <div class="smsCode-wrapper">
          <span class="name">验证码</span>
          <input type="number" placeholder="请输入验证码" v-model="smsCode" oninput="if(value.length>6)value=value.slice(0,6)">
          <span class="btn" @click="getSMSCode">{{smsCodeBtnText}}</span>
        </div>
      </div>

      <div class="align-center btn-groups">
        <my-button @click="submit">确认</my-button>
      </div>
    </div>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64

export default {
  data () {
    return {
      // 活体状态 0未做活体检测 1成功 2失败
      livingStatus: 0,
      // 活体成功图片
      livingImg: '',
      livingImgDefault: require('../assets/img/living_success@2x.png'),
      agreeProtocol: false,
      contractList: [],
      smsCode: '',
      countdown: 60
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.com.projectInfo
    },
    processStatus () {
      return this.$store.state.com.processStatus
    },
    faceBizIdInfo () {
      return this.$store.state.com.faceBizIdInfo
    },
    smsCodeBtnText () {
      if (this.countdown === 60) {
        return '获取验证码'
      } else {
        return this.countdown + 's'
      }
    }
  },
  activated () {
    console.log('processStatus:', this.processStatus)
    console.log('faceBizIdInfo:', typeof this.faceBizIdInfo, this.faceBizIdInfo)
    console.log('query:', this.$route.query)
    if (this.faceBizIdInfo && this.$route.query.from === 'face') {
      console.log('face-----')
      sessionStorage.setItem('appFrom', 'face')
      this.getFaceResult()
    }
    this.getContract()
  },
  watch: {
    '$route' (to, from) {
      if (
        (from.path === '/face' && to.path === '/pdf') ||
        (from.path === '/pdf' && to.path === '/face')
      ) {
        console.log('no need refresh')
      } else {
        console.log('need refresh')
        this.resetData()
      }
    }
  },
  methods: {
    back () {
      this.goBack()
    },
    resetData () {
      this.livingStatus = 0
      this.livingImg = ''
      this.agreeProtocol = false
      this.contractList = []
      this.smsCode = ''
      this.countdown = 60
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
    // 获取Face活体认证Token
    getFaceToken () {
      let idCardName = this.projectInfo.signatoryName
      let idCardNumber = this.projectInfo.signatoryIdno
      let projectSignatoryId = this.processStatus.projectSignatoryId
      if (!idCardName) {
        this.toast('身份证姓名为空')
        return
      }
      if (!idCardNumber) {
        this.toast('身份证号为空')
        return
      }

      // let returnUrl = ''
      // if (window.location.href.indexOf('?') === -1) {
      //   returnUrl = window.location.href
      // } else {
      //   returnUrl = window.location.href.split('?')[0]
      // }

      let query = this.$route.query
      let returnUrl = ''
      if (query.from) {
        returnUrl = window.location.href
      } else {
        returnUrl = window.location.href + '?from=face'
      }

      let options = {
        url: 'i/getFaceToken',
        params: {
          // 网页跳转的目标URL
          return_url: returnUrl, // 'http://xfjr.ledaikuan.cn/fintek/rzzl/index.html#/face?from=face' 'http://xfjr.ledaikuan.cn/fintek/rzzl/index.html?channel=mm#/face?from=face'
          // 验证网页展示用的标题文字
          web_title: '活体识别',
          // 使用场景的scene_id
          scene_id: '',
          // 身份对象的姓名
          idcard_name: idCardName,
          // 身份对象的身份证号
          idcard_number: idCardNumber,
          projectSignatoryId,
          projectId: projectSignatoryId
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          this.$store.commit('FaceBizIdInfo', {
            bizId: res.data.biz_id
          })
          window.location.href = res.data.url
        } else {
          this.toast(res.returnMsg)
        }
      })
    },
    // 获取Face活体认证结果
    getFaceResult () {
      let bizIdInfo = this.faceBizIdInfo
      console.log('bizIdInfo:', typeof bizIdInfo, bizIdInfo)
      if (typeof bizIdInfo === 'string') {
        bizIdInfo = JSON.parse(bizIdInfo)
      }
      let options = {
        url: 'i/getFaceResult',
        params: {
          // 活体业务编号
          biz_id: bizIdInfo.bizId,
          projectSignatoryId: this.processStatus.projectSignatoryId,
          projectId: this.projectInfo.projectId
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          this.livingStatus = 1
          this.livingImg = res.result.image || this.livingImgDefault
          this.$store.commit('FaceBizIdInfo', null)
          this.$store.commit('ProcessStatus', res.data)
        } else {
          this.livingStatus = 2
          this.toast(res.returnMsg)
        }
      })
    },
    livingCheck () {
      if (this.livingStatus !== 1) {
        this.getFaceToken()
      }
    },
    smsCountDown () {
      let timer = setInterval(() => {
        if (this.countdown === 0) {
          clearInterval(timer)
          this.countdown = 60
        } else {
          this.countdown--
        }
      }, 1000)
    },
    getSMSCode () {
      if (this.processStatus.faceStatus === 0) {
        this.toast('请先完成活体认证')
        return
      }
      let signatoryMobile = this.projectInfo.signatoryMobile
      if (!signatoryMobile) {
        this.toast('请输入手机号')
        return
      }
      if (!/^1[3456789]\d{9}$/.test(signatoryMobile)) {
        this.toast('请输入正确的手机号')
        return
      }
      if (this.countdown !== 60) return

      let options = {
        url: 'i/yzm',
        params: {
          signatoryMobile
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          this.toast('验证码发送成功')
          this.smsCountDown()
        } else {
          this.toast(res.returnMsg)
        }
      })
    },
    // 签约
    signContract () {
      if (!this.smsCode) {
        this.toast('请输入验证码')
        return
      }
      let options = {
        url: 'i/signContract',
        params: {
          projectSignatoryId: this.processStatus.projectSignatoryId,
          signatoryName: this.projectInfo.signatoryName,
          signatoryIdno: this.projectInfo.signatoryIdno,
          signatoryMobile: this.projectInfo.signatoryMobile,
          yzm: this.smsCode
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          this.$store.commit('ProcessStatus', res.data)
          // this.processCtrl()
          this.$router.replace('/video')
        } else {
          this.toast(res.returnMsg)
        }
      })
    },
    submit () {
      if (this.processStatus.faceStatus === 0) {
        this.toast('请先完成活体认证')
        return
      }
      if (this.contractList.length > 0 && !this.agreeProtocol) {
        this.toast('请仔细阅读并同意合同')
        return
      }
      this.signContract()
    },
    preview (index, xy) {
      this.$router.push({ name: 'VuePDF', query: { url: Base64.encode(xy.url), fileName: Base64.encode(xy.fileName) } })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/style/index.styl'

.panel
  padding: 30px 36px 44px 36px
  margin-top: 30px
  border-radius: 10px
  background-color #f5f5f6
  .title
    padding-top: 6px
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
    width: 20%
    color: $color-text-3
  input
    width: 65%
    height: 100%
    border: none
    outline: none
    background-color: transparent
  .btn
    display: flex;
    justify-content: center
    align-items: center
    width: 25%
    height: 46px
    border: 1px solid; /*no*/
    border-color: $color-theme;
    border-radius: 8px;
    font-size: $fs-24
    color: $color-theme;
.btn-groups
  padding: 70px 0
</style>
