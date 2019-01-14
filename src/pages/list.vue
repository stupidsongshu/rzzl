<template>
  <div class="page has-header">
    <my-header>
      <span class="header-title">项目列表</span>
    </my-header>

    <div class="page-content">
      <ul>
        <!-- <li class="item" v-for="(item, index) in list" :key="item.projectId" @click="viewProject(item)"> -->
        <li class="item" v-for="(item, index) in list" :key="index" @click="viewProject(item)">
          <div class="left">
            <p class="name">{{item.project.projectName}}</p>
            <p class="desp">项目描述：{{item.project.projectDesc}}</p>
          </div>
          <div class="right">
            <div class="content">
              <p class="status1">{{signStatusMap[item.project.projectStatus]}}</p>
              <p class="status2">状态</p>
            </div>
            <div class="arrow-right arrow"></div>
          </div>
        </li>
      </ul>
      <p class="no-data" v-if="listHttp && list.length === 0">暂无签约项目</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      listHttp: false
    }
  },
  computed: {
    mobileNo () {
      return this.$store.state.com.mobileNo
    },
    signStatusMap () {
      return this.$store.state.com.signStatusMap
    }
  },
  created () {
    this.checkContract()
  },
  methods: {
    // 检查是否有合同需要签署
    checkContract () {
      let options = {
        url: 'i/checkContract',
        params: {
          signatoryMobile: this.mobileNo
        }
      }
      this.$http(options).then(res => {
        this.listHttp = true
        if (res.returnCode === '000000') {
          this.list = res.list
        } else {
          this.toast(res.returnMsg)
        }
      })
    },
    // 获取签约人状态
    signatoryStatus (item) {
      return new Promise(resolve => {
        let options = {
          url: 'i/signatoryStatus',
          params: {
            projectId: item.projectId,
            signatoryIdno: item.signatoryIdno,
            signatoryMobile: item.signatoryMobile,
            signatoryName: item.signatoryName
          }
        }
        this.$http(options).then(res => {
          if (res.returnCode === '000000') {
            this.$store.commit('ProjectInfo', item)
            this.$store.commit('ProcessStatus', res.data)
            this.processCtrl()
          } else {
            this.toast(res.returnMsg)
          }
        })
      })
    },
    viewProject (item) {
      if (item.project.projectStatus === '1' || item.project.projectStatus === '2') {
        this.signatoryStatus(item)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/style/index.styl'

.item
  display: flex
  justify-content: space-between
  align-items: center
  width: 100%
  height: 170px
  padding: 0 10px
  border-bottom: 1px solid #eee; /*no*/
  .left
    .name
      margin-bottom: 20px
      font-size: $fs-40
      color: $color-theme
    .desp
      font-size: $fs-26
      color: $color-text-9
  .right
    display: flex
    align-items: center
    .content
      text-align: center
      .status1
        margin-bottom: 20px
        font-size: $fs-36
        color: $color-text-6
      .status2
        font-size: $fs-26
        color: $color-text-9
    .arrow
      margin-left: 20px
      color: $color-theme
</style>
