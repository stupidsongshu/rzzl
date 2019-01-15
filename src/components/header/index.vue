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
  background-color: #fff
  .header-inner
    display: flex
    justify-content: space-between
    align-items: center
    width: 100%
    height: 100%
    padding: 0 30px
    .header-back
      display: inline-block
      width: 25px
      height: 25px
      border-color: $color-text-3
      border-left: 1px solid; /*no*/
      border-top: 1px solid; /*no*/
      transform: translateY(20px) rotate(-45deg)
      // background: url('./img/back.png') no-repeat center/100% 100%
    .header-title
      position: absolute
      top: 50%
      left: 50%
      width: 80%
      transform: translate(-50%, 0)
      text-align: center
      font-size: $fs-36
      text-overflow: ellipsis
      white-space: nowrap
      overflow: hidden
    .header-right
      font-size: $fs-30
</style>
