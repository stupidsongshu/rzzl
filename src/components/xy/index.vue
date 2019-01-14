<template>
  <div class="component xy-component" v-if="xyData.length > 0">
    <slot></slot>
    <label class="xy-label" for="my-xy"><slot name="agreeText">我已阅读并同意</slot></label>
    <div class="content">
      <a class="xy-url color-theme" :href="xy.url" v-for="(xy, index) in xyData" :key="index" @click="xyClick(index, xy)" v-if="xy.url" target="_blank">{{splitTitle(xy.fileName)}}</a>
      <a class="xy-url color-theme" v-for="(xy, index) in xyData" :key="index" @click="xyClick(index, xy)" v-if="!xy.url">{{splitTitle(xy.fileName)}}</a>
      <span class="color-theme">{{xyTail}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myXy',
  props: {
    xyData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      xyTail: ''
    }
  },
  methods: {
    // 英文逗号后面的文字不是链接部分
    splitTitle (val) {
      if (val.indexOf(',') !== -1) {
        let arr = val.split(',')
        this.xyTail = arr[1]
        return arr[0]
      } else {
        return val
      }
    },
    // 协议点击事件
    xyClick (index, xy) {
      this.$emit('xyClick', index, xy)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../assets/style/index.styl'

.xy-label:before
  border: 1px solid $color-theme; /*no*/
.xy-input:checked + .xy-label:before
  content: ''
  background: url('../../assets/img/checkbox_checked.png') no-repeat center center
  background-size: 100% auto

.xy-component
  // width: 100%
  // text-overflow: hidden
  // white-space: normal
  // overflow: hidden
  line-height: 1.8
  font-size: $fs-26
  .xy-input
    display: none
    // opacity: 0
  .xy-label
    // position: relative
    &:before
      content: ""
      display: inline-block
      // position: absolute
      // top: -2px
      // left: 10px
      width: 22px
      height: 22px
      margin-right: 10px
      border-radius: 4px
  .color-theme
    color: $color-theme
</style>
