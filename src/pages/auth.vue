<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back" @click="back"></span>
      <span class="header-title">运营商认证</span>
    </my-header>

    <div class="page-content">
      <div class="form-item color333">
        <div class="form-label">手机号：</div>
        <div class="form-value">{{projectInfo.signatoryMobile}}</div>
      </div>
      <div class="form-item color333">
        <div class="form-label">姓名：</div>
        <div class="form-value">{{projectInfo.signatoryName}}</div>
      </div>
      <div class="form-item color333">
        <div class="form-label">身份证号：</div>
        <div class="form-value">{{projectInfo.signatoryIdno}}</div>
      </div>
    </div>

    <div class="align-center btn-groups">
      <my-button @click="submit">确认</my-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      smsPopup: false
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.com.projectInfo
    }
  },
  methods: {
    back () {
      this.goBack()
    },
    // 运营商三要素认证
    submit () {
      let options = {
        url: 'i/checkOperator',
        params: {
          projectId: this.projectInfo.projectId,
          signatoryIdno: this.projectInfo.signatoryIdno,
          signatoryMobile: this.projectInfo.signatoryMobile,
          signatoryName: this.projectInfo.signatoryName
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          this.$store.commit('ProcessStatus', res.data)
          // this.processCtrl()
          // this.$router.replace('/ocr')
          this.$router.replace('/face')
        } else {
          this.toast(res.returnMsg)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/style/index.styl'

.page-content {
  padding-top: 15px;
}
.form-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 104px;
  padding-left: 20px;
  font-size: 30px;
  border-bottom: 1px solid #e1e1e1; /*no*/
}
.form-item .form-label {
  width: 210px;
  color: #333;
}
.form-item .form-label.w160 {
  width: 160px;
}
.form-item .form-value {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
}
.form-item .form-value .value-l {
  flex-grow: 1;
  width: 60%;
}
.form-item .form-value .value-r {
  flex-shrink: 0;
  width: 40%;
  text-align: center;
}
.forget-psw {
  margin: 20px 0 104px 0
  text-align: right
  font-size: $fs-28
  color: $color-theme
}
.desc {
  margin: 22px 0 76px 0;
  line-height: 20px;
  font-size: 12px;
}
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 45px;
  margin: 0 auto;
  border-radius: 5px;
  color: #fff;
}

.popupContainer {
  width: 80%;
}
.dialog {
  padding: 66px 54px;
}
.dialog .dialog-title {
  margin-bottom: 24px;
  text-align: center;
  font-size: $fs-36;
}
.dialog .dialog-hint {
  font-size: $fs-24;
}
.btn-groups {
  width: 100%;
  margin-top: 60px;
  text-align: center;
}
</style>
