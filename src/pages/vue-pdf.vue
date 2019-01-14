<template>
  <div>
    <!-- <p>{{currentPage}} / {{pageCount}}</p> -->
    <pdf :src="pdfUrl" @num-pages="pageCount = $event" @page-loaded="currentPage = $event"></pdf>
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
      pdfUrl: ''
    }
  },
  created () {
    this.pdfUrl = Base64.decode(this.$route.query.url)
    console.log(this.pdfUrl)
  }
}
</script>
