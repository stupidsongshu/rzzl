<template>
  <div class="component btn-component" :class="{'btn-disabled': disabled}" @click="clickFun">
    <span class="btn-name">
      <slot></slot>
    </span>
  </div>
</template>
<script>
export default {
  name: 'myButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickFun () {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../assets/style/index.styl'
.btn-component
  display: inline-block
  width: 80%
  padding: 4.5% 0
  color: #fff
  text-align: center
  border-radius: 3.4% / 20%
  font-size: $fs-36
  position: relative
  overflow: hidden
  background-color: $color-theme
  &.btn-2
    width: 46%
    border-radius: 4% / 16%
.btn-component:after
  content: ''
  display: block
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0
  pointer-events: none
  background-image: radial-gradient(circle, #666 10%, transparent 10.01%)
  background-repeat: no-repeat
  background-position: 50%
  transform: scale(10, 10)
  opacity: 0;
  transition: transform .5s, opacity .5s
.btn-component:active:after
    transform: scale(0, 0)
    opacity: .3
    transition: 0s
  &.btn-disabled
    background: $color-bg-btn-disabled
  &.btn-default
    background: #fff
    color: #666
</style>
