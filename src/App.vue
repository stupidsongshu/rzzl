<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    '$route': (to, from) => {
      let blackList = ['/idcard', '/sign', '/video']
      let bool = blackList.some(item => {
        return item === from.path
      })
      if (bool) {
        this.$router.replace('/list')
      }
    }
  }
}
</script>
