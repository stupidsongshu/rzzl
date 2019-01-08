<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back"></span>
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
              <img class="idcard__panel__img__success" src="../assets/img/shooting_correct.png" alt="人像面通过" v-if="idCardFrontStatus">
            </div>
            <input class="idcard_input" type="file" capture="camera" accept="image/*" @change="idcardOCR(1, $event)">
          </div>
          <p class="idcard__panel__text" :class="{'fail': idStatusFail}">{{idCardImgFrontText}}</p>
        </div>
        <div class="idcard__panel__inner idcard__panel__inner--back">
          <div class="idcard__panel__img">
            <!-- <div class="idcard__panel__img__inner" @click="idcardBackOCR"> -->
            <div class="idcard__panel__img__inner">
              <img class="idcard__panel__img__origin" :src="idCardBackImg" alt="国徽面" v-if="idCardBackImg">
              <img class="idcard__panel__img__origin" src="../assets/img/shooting_back_bg.png" alt="国徽面" v-if="!idCardBackImg">
              <img class="idcard__panel__img__success" src="../assets/img/shooting_correct.png" alt="国徽面通过" v-if="idCardBackStatus">
            </div>
            <input class="idcard_input" type="file" capture="camera" accept="image/*" @change="idcardOCR(2, $event)">
          </div>
          <p class="idcard__panel__text" :class="{'fail': idStatusFail}">{{idCardImgBackText}}</p>
        </div>
      </div>

      <div class="idcard__info">
        <div class="form-group">
          <label class="form-group__label" for="">姓名</label>
          <input class="form-group__input" type="text" placeholder="中文姓名" v-model="customerName">
        </div>
        <div class="form-group margiB">
          <label class="form-group__label" for="">身份证号</label>
          <input class="form-group__input" type="text" placeholder="身份证号" v-model="customeIdCardNo" :disabled="!isTest">
        </div>
      </div>
      <div class="align-center">
        <my-button :disabled="idStatusFail" @click="submit">确认</my-button>
      </div>
    </div>
  </div>
</template>

<script>
import EXIF from 'exif-js'

export default {
  data () {
    return {
      isFail: false,
      customerName: '',
      customeIdCardNo: '', // 保存最终身份证号(可编辑方便测试)
      // 身份证正面(人像面)
      idCardFrontOCR: {
        img: '',
        idName: '',
        idNo: '',
        status: false
      },
      // 身份证反面(国徽面)
      idCardBackOCR: {
        img: '',
        office: '',
        validTerm: '',
        status: false
      }
    }
  },
  computed: {
    isTest () {
      return process.env.NODE_ENV.indexOf('development') !== -1
    },
    idCardNo () {
      return this.idCardFrontOCR.idNo
    },
    idCardName () {
      return this.idCardFrontOCR.idName
    },
    idCardFrontImg () {
      return this.idCardFrontOCR.img
    },
    idCardFrontStatus () {
      return this.idCardFrontOCR.status
    },
    idCardBackImg () {
      return this.idCardBackOCR.img
    },
    idCardBackStatus () {
      return this.idCardBackOCR.status
    },
    idStatusFail () {
      return false
    },
    idCardImgFrontText () {
      if (this.isFail) {
        return '资质认证不通过'
      } else {
        return '身份证人像面'
      }
    },
    idCardImgBackText () {
      if (this.isFail) {
        return '资质认证不通过'
      } else {
        return '身份证国徽面'
      }
    }
  },
  methods: {
    // type: 1人像面 2国徽面
    idcardOCR (type, e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length === 0) return
      let file = files[0]
      console.log(file)
      console.log('fileType:', file.type)
      console.log('fileSize:', file.size / 1024 / 1024 + 'MB')
      if (file.type !== 'image/jpeg') {
        this.toast('只支持jpg或jpeg格式图片', 2000)
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

          // this.uploadIdCardOcr(base64, type)

          if (type === 1) {
            this.idCardFrontOCR.img = base64
          } else if (type === 2) {
            this.idCardBackOCR.img = base64
          }
        }
      }
    },
    submit () {
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
