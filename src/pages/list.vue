<template>
  <div class="page has-header">
    <my-header>
      <span class="header-title">项目列表</span>
    </my-header>

    <div class="page-content">
      <ul>
        <li class="item" v-for="(item, index) in list" :key="index" @click="signatoryStatus(item)">
          <div class="left">
            <p class="name">{{item.project.projectName}}</p>
            <p class="desp">项目描述：{{item.project.projectDesc}}</p>
          </div>
          <div class="right">
            <div class="content">
              <p class="status1">{{signStatusMap[item.signatoryStatus]}}</p>
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
          this.list = res.list.filter(item => {
            // projectStatus:项目状态 0默认值 1创建成功待审核 2信息录入完成待复核 3复核通过待签约 4复核拒绝待修改 5签约完成待审核 6审核通过项目成功 7审核失败，项目结束
            let projectStatus = Number(item.project.projectStatus)
            return projectStatus === 3 || projectStatus === 5 || projectStatus === 6
          })
        } else {
          this.toast(res.returnMsg)
        }
      })
    },
    // 获取签约人状态
    signatoryStatus (item) {
      console.log(item)
      let firstQueryStatus
      if (sessionStorage.getItem('firstQueryStatus') === null) {
        firstQueryStatus = 0
      } else {
        firstQueryStatus = Number(sessionStorage.getItem('firstQueryStatus'))
      }
      return new Promise(resolve => {
        let options = {
          url: 'i/signatoryStatus',
          params: {
            firstQueryStatus,
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
            firstQueryStatus++
            sessionStorage.setItem('firstQueryStatus', firstQueryStatus)
            this.checkStatus(res.data)
          } else {
            this.toast(res.returnMsg)
          }
        })
      })
    },
    // 检查状态是否正常，非正常重置状态
    checkStatus (data) {
      let isNormal = false
      if (
        (data.ocrStatus === 0 && data.faceStatus === 0 && data.videoStatus === 0) ||
        (data.operatorStatus === 1 && data.ocrStatus === 1 && data.faceStatus === 1 && data.videoStatus === 1)
      ) {
        isNormal = true
      }

      console.log('检查状态是否正常，非正常重置状态:', isNormal ? '正常' : '异常')
      if (isNormal) {
        this.processCtrl()
      } else {
        this.$store.dispatch('resetSignatoryStatus').then(_ => {
          this.processCtrl()
        })
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
  // height: 170px
  padding: 40px 10px
  border-bottom: 1px solid #eee; /*no*/
  .left
    width: 60%
    .name
      margin-bottom: 20px
      font-size: $fs-40
      color: $color-theme
    .desp
      font-size: $fs-26
      color: $color-text-9
  .right
    width: 40%
    display: flex
    align-items: center
    justify-content: flex-end
    .content
      text-align: center
      .status1
        margin-bottom: 20px
        font-size: $fs-32
        color: $color-text-6
      .status2
        font-size: $fs-26
        color: $color-text-9
    .arrow
      flex-shrink: 0
      margin-left: 20px
      color: $color-theme
</style>
