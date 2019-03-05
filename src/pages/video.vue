<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back" @click="back"></span>
      <span class="header-title">视频认证</span>
    </my-header>

    <div class="page-content">
      <div class="video">
        <img src="../assets/img/video.png" alt="">
        <input class="video-input" type="file" accept="video/*" capture="camcorder" @change="videoChange($event)">
        <p class="hint" v-if="file">已录制</p>
      </div>
      <p class="title1">*温馨提示：</p>
      <p class="title2">您需要录用前置摄像头录制一段承诺视频，话术如下：</p>
      <div class="panel">本人承诺向金巍融资租赁签署文件真实有效、遵守合约，同意上报征信。</div>

      <div class="align-center">
        <my-button @click="submit">提交</my-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      file: null
    }
  },
  computed: {
    processStatus () {
      return this.$store.state.com.processStatus
    }
  },
  methods: {
    back () {
      this.goBack()
    },
    videoChange (e) {
      let files = e.target.files
      if (files.length === 0) {
        this.file = null
        return
      }
      this.file = files[0]
      this.toast('视频已录制成功，请点击按钮进行提交')
      console.log(this.file)
      console.log('fileType:', this.file.type)
      console.log('fileSize:', this.file.size / 1024 / 1024 + 'MB')
    },
    submit () {
      if (!this.file) {
        this.toast('请先录制视频')
        return
      }
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('projectSignatoryId', this.processStatus.projectSignatoryId)
      let options = {
        url: 'i/uploadVideo',
        params: formData,
        loadingMsg: '正在上传，请耐心等待'
      }
      this.$fileHttp(options).then(res => {
        if (res.returnCode === '000000') {
          this.toast('视频上传成功，请等待审核', 5000)
          this.$store.commit('ProcessStatus', res.data)
          // this.processCtrl()
          this.$router.replace('/detail')
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

.page-content
  line-height: 54px
.video
  position: relative
  width: 205px
  height: 205px
  margin: 74px auto 56px auto
  .video-input
    position: absolute
    top: 0
    right: 0
    opacity: 0
    width: 100%
    height: 100%
  img
    width: 100%
  .hint
    text-align: center
    font-size: $fs-28
    color: $color-theme
.title1
  font-size: $fs-26
  color: $color-theme
.title2
  font-size: $fs-26
  color: #2a2a2a
.panel
  padding: 30px 26px
  margin: 20px 0 56px 0
  font-size: $fs-32
  text-indent: 2em
  background-color: #f5f5f6
  border-radius: 10px
  color: $color-theme
</style>
