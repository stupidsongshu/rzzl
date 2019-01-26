<template>
  <div class="page-preview has-header">
    <my-header>
      <span class="header-back" @click="back"></span>
      <span class="header-title">{{title}}</span>
    </my-header>

    <pdf
      v-for="i in numPages"
      :key="i"
      :src="src"
      :page="i"></pdf>
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
      title: '',
      pdfUrl: '',
      src: '',
      numPages: undefined
    }
  },
  created () {
    this.title = Base64.decode(this.$route.query.fileName)
    this.pdfUrl = Base64.decode(this.$route.query.url)
    console.log(this.pdfUrl)

    this.src = pdf.createLoadingTask(this.pdfUrl)
    this.src.then(pdf => {
      this.numPages = pdf.numPages
    })
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
