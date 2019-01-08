<template>
  <div class="page has-header">
    <my-header>
      <span class="header-back"></span>
      <span class="header-title">视频认证</span>
    </my-header>

    <div class="page-content">
      <div class="video">
        <img src="../assets/img/video.png" alt="">
      </div>
      <p class="title1">*温馨提示：</p>
      <p class="title2">您需要录用前置摄像头录制一段承诺视频，话术如下：</p>
      <div class="panel">本人承诺向XXX借款/担保，提供真实资料，遵守合约，同意上报征信。本人承诺向XXX借款/担保，提供真实资料，遵守合约，同意上报征信。本人承诺向XXX借款/担保，提供真实资料，遵守合约，同意上报征信。</div>

      <div class="align-center">
        <my-button @click="submit">提交</my-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    submit () {
      this.$router.replace('/detail')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/style/index.styl'

.page-content
  line-height: 54px
.video
  padding: 74px 0 56px 0
  text-align: center
  img
    width: 205px
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

.btn-component
  width: 100%!important
</style>
