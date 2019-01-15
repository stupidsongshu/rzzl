<template>
  <div class="page-preview has-header">
    <my-header>
      <span class="header-back" @click="back"></span>
      <span class="header-title">{{title}}</span>
    </my-header>
    <!-- <p>{{currentPage}} / {{pageCount}}</p> -->
    <pdf :src="pdfUrl" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"></pdf>
    <!-- <iframe class="iframe" :src="pdfUrl" frameborder="0"></iframe> -->
  </div>
</template>

<script>
import pdf from 'vue-pdf'
let Base64 = require('js-base64').Base64

export default {
  components: {
    pdf
  },
  data () {
    return {
      currentPage: 0,
      pageCount: 0,
      title: '',
      pdfUrl: ''
    }
  },
  created () {
    this.title = Base64.decode(this.$route.query.fileName)
    this.pdfUrl = Base64.decode(this.$route.query.url)
    console.log(this.pdfUrl)
  },
  methods: {
    back () {
      this.goBack()
    }
  }
}
</script>

<style scoped>
.page-preview {
  width: 100%;
  height: 100%;
}
.iframe {
  width: 100%;
  height: 100%;
}
</style>
