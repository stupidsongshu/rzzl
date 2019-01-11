<template>
  <div class="page has-header">
    <my-header>
      <span class="header-title">登录</span>
    </my-header>

    <div class="page-content">
      <div class="login-form">
        <div class="form-group-1">
          <label for="" class="form-label icon-phone">
            <img src="../assets/img/icon-phone.png" alt="手机号码">
          </label>
          <input type="number" class="form-input" v-model="mobileNo" oninput="if(value.length>11)value=value.slice(0,11)" placeholder="请输入手机号码">
        </div>
        <div class="form-group-1 has-btn">
          <label for="" class="form-label icon-msgcode">
            <img src="../assets/img/icon-msgcode.png" alt="短信验证码">
          </label>
          <input type="number" class="form-input" v-model="msgCode" oninput="this.value=this.value.replace(/[^\d]/g,'');if(this.value.length>6)this.value=this.value.slice(0,6);" placeholder="请输入手机验证码">
          <button class="form-btn color-theme-text" @click="getSMSCode">{{smsCodeBtnText}}</button>
        </div>
      </div>
    </div>

    <div class="btn-group">
      <my-button @click="login">登录</my-button>
    </div>
  </div>
</template>

<script>
// import http from '@/http'

export default {
  data () {
    return {
      mobileNo: '',
      msgCode: '',
      countdown: 60
    }
  },
  computed: {
    smsCodeBtnText () {
      if (this.countdown === 60) {
        return '获取验证码'
      } else {
        return this.countdown + 's'
      }
    }
  },
  methods: {
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
      if (!this.mobileNo) {
        this.toast('请输入手机号')
        return
      }
      if (!/^1[3456789]\d{9}$/.test(this.mobileNo)) {
        this.toast('请输入正确的手机号')
        return
      }
      if (this.countdown !== 60) return

      let options = {
        url: 'i/yzm',
        params: {
          signatoryMobile: this.mobileNo
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
    login () {
      if (!this.mobileNo) {
        this.toast('请输入手机号')
        return
      }
      if (!/^1[3456789]\d{9}$/.test(this.mobileNo)) {
        this.toast('请输入正确的手机号')
        return
      }
      if (!this.msgCode) {
        this.toast('请输入验证码')
        return
      }

      let options = {
        url: 'i/login',
        params: {
          signatoryMobile: this.mobileNo,
          yzm: this.msgCode
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          this.$store.commit('MobileNo', this.mobileNo)
          this.$router.replace('/list')
        } else {
          this.toast(res.returnMsg)
        }
      })
    }
  }
}
</script>

<style scoped>
.login-form{
  width: 90%;
  margin: 12% auto 0;
}
.form-group-1{
  display: flex;
  align-items: center;
  width: 100%;
  height: 120px;
  font-size: 0;
  border-bottom: 1px solid #d9d9d9; /*no*/
}
.form-group-1 .form-label{
  width: 80px;
  padding-left: 10px;
}
.form-group-1 .form-label.icon-phone>img{
  width: 26px;
}
.form-group-1 .form-label.icon-msgcode>img{
  width: 34px;
}
.form-group-1 .form-input{
  width: 84%;
  border: none;
  height: 100%;
  font-size: 30px;
}
.form-group-1 .form-input.readonly{
  color: #999;
}
.form-group-1.has-btn .form-input{
  width: 54%;
}
.form-group-1.has-btn .form-btn{
  width: 30%;
  text-align: right;
  border: none;
  background: transparent;
  outline: none;
}
.btn-group{
  margin-top: 22%;
  text-align: center;
}
</style>
