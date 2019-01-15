<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back" @click="back"></span>
      <span class="header-title">身份证认证</span>
    </my-header>

    <div class="page__content">
      <div class="idcard__panel">
        <div class="idcard__panel__inner idcard__panel__inner--front">
          <div class="idcard__panel__img">
            <!-- <div class="idcard__panel__img__inner" @click="idcardFrontOCR"> -->
            <div class="idcard__panel__img__inner">
              <img class="idcard__panel__img__origin" :src="idCardFrontImg" alt="人像面" v-show="idCardFrontImg">
              <img class="idcard__panel__img__origin" src="../assets/img/shooting_facade_bg.png" alt="人像面" v-if="!idCardFrontImg">
              <!-- <img class="idcard__panel__img__success" src="../assets/img/shooting_correct.png" alt="人像面通过" v-if="idCardFrontStatus"> -->
            </div>
            <input class="idcard_input" type="file" capture="camera" accept="image/*" @change="idcardOCR(0, $event)">
          </div>
          <!-- <p class="idcard__panel__text" :class="{'fail': idStatusFail}">{{idCardImgFrontText}}</p> -->
          <p class="idcard__panel__text">身份证人像面</p>
        </div>
        <div class="idcard__panel__inner idcard__panel__inner--back">
          <div class="idcard__panel__img">
            <!-- <div class="idcard__panel__img__inner" @click="idcardBackOCR"> -->
            <div class="idcard__panel__img__inner">
              <img class="idcard__panel__img__origin" :src="idCardBackImg" alt="国徽面" v-if="idCardBackImg">
              <img class="idcard__panel__img__origin" src="../assets/img/shooting_back_bg.png" alt="国徽面" v-if="!idCardBackImg">
              <!-- <img class="idcard__panel__img__success" src="../assets/img/shooting_correct.png" alt="国徽面通过" v-if="idCardBackStatus"> -->
            </div>
            <input class="idcard_input" type="file" capture="camera" accept="image/*" @change="idcardOCR(1, $event)">
          </div>
          <p class="idcard__panel__text">身份证国徽面</p>
        </div>
      </div>

      <div class="idcard__info">
        <div class="form-group">
          <label class="form-group__label" for="">姓名</label>
          <!-- <input class="form-group__input" type="text" placeholder="中文姓名" v-model="customerName"> -->
          <p class="form-group__input">{{projectInfo.signatoryName}}</p>
        </div>
        <div class="form-group margiB">
          <label class="form-group__label" for="">身份证号</label>
          <!-- <input class="form-group__input" type="text" placeholder="身份证号" v-model="customeIdCardNo" :disabled="!isTest"> -->
          <p class="form-group__input">{{projectInfo.signatoryIdno}}</p>
        </div>
      </div>
      <div class="align-center">
        <!-- <my-button :disabled="processStatus.ocrStatus === 0" @click="submit">确认</my-button> -->
        <my-button @click="submit">确认</my-button>
      </div>
    </div>
  </div>
</template>

<script>
import EXIF from 'exif-js'

export default {
  data () {
    return {
      idCardFrontImg: '',
      idCardBackImg: ''
    }
  },
  computed: {
    isTest () {
      return process.env.NODE_ENV.indexOf('development') !== -1
    },
    projectInfo () {
      return this.$store.state.com.projectInfo
    },
    processStatus () {
      return this.$store.state.com.processStatus
    }
  },
  // beforeRouteLeave (to, from, next) {
  //   this.routerBeforeEach(to, from, next)
  // },
  // beforeRouteLeave (to, from, next) {
  //   const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  //   if (answer) {
  //     next()
  //   } else {
  //     next(false)
  //   }
  // },
  methods: {
    back () {
      this.goBack()
    },
    // type: 0人像面 1国徽面
    idcardOCR (type, e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length === 0) return
      let file = files[0]
      console.log(file)
      console.log('fileType:', file.type)
      console.log('fileSize:', file.size / 1024 / 1024 + 'MB')
      if (file.type !== 'image/jpeg') {
        this.toast('只支持jpg或jpeg格式图片')
        return
      }

      let base64
      let compressRate = 1
      function compressBase64 (canvas) {
        console.log('compressRate:', compressRate)
        base64 = canvas.toDataURL('image/jpeg', compressRate)
        if (base64.length / 1024 / 1024 > 2 && compressRate > 0) {
          compressRate -= 0.05
          compressBase64(canvas)
        }
        return base64
      }

      let orientation
      EXIF.getData(file, function () {
        orientation = EXIF.getTag(this, 'Orientation')
        console.log('orientation:', orientation)
      })

      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (ev) => {
        // 注：图片的文件大小小于2MB。支持的图片最小是400x400像素，最大是4096x4096像素。
        let img = new Image()
        // img.src = reader.result
        img.src = ev.target.result
        img.onload = () => {
          let w = img.width
          let h = img.height
          console.log('w:', w, 'h:', h)
          if (w < 400 || h < 400) {
            this.toast('图片尺寸过小，请更换手机进行拍照', 3000)
            return
          }
          if (w > 4000) {
            w = 4000
          }
          if (h > 4000) {
            h = 4000
          }
          let canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          let ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w, h)
          base64 = compressBase64(canvas)
          console.log(base64.length / 1024 / 1024 + 'MB')

          e.target.value = ''

          this.uploadIdCardOcr(base64, type)
        }
      }
    },
    uploadIdCardOcr (base64, imageType) {
      if (!base64) {
        this.toast('请重新拍摄身份证')
        return
      }
      let image = base64.split('data:image/jpeg;base64,')[1]
      let options = {
        url: 'i/ocr',
        params: {
          // 身份证照片
          image,
          // 身份证照片类型:0正面 1反面
          imageType,
          projectSignatoryId: this.processStatus.projectSignatoryId
        }
      }
      this.$http(options).then(res => {
        if (res.returnCode === '000000') {
          if (imageType === 0) {
            this.idCardFrontImg = base64
          } else if (imageType === 1) {
            this.idCardBackImg = base64
          }
          this.$store.commit('ProcessStatus', res.data)
        } else if (res.returnCode === '000055') {
          let ocr = res.ocr
          let msg = '身份信息不一致:' + ocr.name + ' ' + ocr.idcard_number
          this.toast(msg, 5000)
        } else {
          this.toast(res.returnMsg, 5000)
        }
      })
    },
    submit () {
      // this.processCtrl()
      // TODO
      this.$router.replace('/sign')
    }
  }
}
</script>

<style lang="stylus" scoped>
.page__content
  padding-top: 5.6%
  .idcard__panel
    font-size: 0
    .idcard__panel__inner
      display: inline-block
      width: 47.3%
      font-size: 24px
      text-align: center
      font-family: 'Microsoft Yahei'
      color: #333
      margin-bottom: 7.2%
      &.idcard__panel__inner--front
        margin-right: 5.4%
      .idcard__panel__text
        &.fail
          color: red
      .idcard__panel__img
        position: relative
        margin-bottom: 6%
        border: 1px solid #DEDEDE; /*no*/
        border-radius: 10px
        .idcard_input
          position: absolute
          top: 0
          right: 0
          opacity: 0
          width: 316px
          height: 200px
        .idcard__panel__img__inner
          width: 316px
          height: 200px
          .idcard__panel__img__origin
            width: 100%
            height: 100%
          .idcard__panel__img__success
            position: absolute
            top: 32%
            left: 39%
            width: 22%
            height: auto
  .idcard__info
    margin-bottom: 4.6%
  .form-group
    position: relative
    padding: 6px 0 30px
    border-bottom: 1px solid #ECECEC; /*no*/
    padding-top: 28px
    color: #333
    font-size: 0
    .form-group__label
      display: inline-block
      width: 27%
      font-size: 30px
    .form-group__input
      display: inline-block
      width: 66%
      font-size: 30px
      color: #333
  .margiB
    margin-bottom: 110px

  .btn-component
    width: 90%
</style>
