<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      blackList: [
        '/idcard',
        '/sign',
        '/video'
      ]
    }
  },
  watch: {
    '$route': (to, from) => {
      let bool = this.blackList.some(item => {
        return item === from.path
      })
      if (bool) {
        this.$router.replace('/list')
      }
    }
  }
}
</script>
