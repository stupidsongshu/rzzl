<template>
  <div class="component xy-component" v-if="xyData.length > 0">
    <slot></slot>
    <label class="xy-label" for="my-xy"><slot name="agreeText">我已阅读并同意</slot></label>
    <div class="content">
      <a class="xy-url" :href="xy.url" v-for="(xy, index) in xyData" :key="index" @click="xyClick(index, xy)" v-if="xy.url" target="_blank">{{splitTitle(xy.title)}}</a>
      <a class="xy-url" v-for="(xy, index) in xyData" :key="index" @click="xyClick(index, xy)" v-if="!xy.url">{{splitTitle(xy.title)}}</a>
      <span>{{xyTail}}</span>
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
  // mounted () {
  //   // console.log('产品配置2', productSetting.loan_xy)
  //   // this.xyList = productSetting.loan_xy
  // },
  // computed: {
  //   xyList () {
  //     return this.$store.state.loan.xy
  //   }
  // },
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
.xy-component
  width: 100%
  font-size: $fs-26
  text-overflow: hidden
  white-space: normal
  overflow: hidden
  line-height: 1.8
  .xy-input
    // display: none
    display: block
  .xy-label
    position: relative
    padding-left: 70px
    &:after
      position: absolute
      top: -2px
      left: 10px
      display: inline-block
      content: ""
      width: 22px
      height: 22px
      border-radius: 4px
  .content
    padding-left: 70px
    a, span
      color: $color-theme
</style>
