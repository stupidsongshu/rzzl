<template>
  <div class="component header-component">
    <div class="header-inner">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myHeader'
}
</script>

<style lang="stylus" scoped>
@import '../../assets/style/index.styl'
.header-component
  position: fixed
  top: 0
  left: 0
  z-index: 1000
  width: 100%
  height: 128px
  color: $color-text-3
  border-bottom: 1px solid #eee; /*no*/
  .header-inner
    display: flex
    justify-content: space-between
    align-items: center
    width: 100%
    height: 100%
    padding: 0 30px
    .header-back
      display: inline-block
      width: 30px
      height: 30px
      border-color: $color-text-3
      border-left: 1px solid; /*no*/
      border-top: 1px solid; /*no*/
      transform: rotate(-45deg)
      // background: url('./img/back.png') no-repeat center/100% 100%
    .header-title
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, 0)
      font-size: $fs-36
    .header-right
      font-size: $fs-30
</style>
