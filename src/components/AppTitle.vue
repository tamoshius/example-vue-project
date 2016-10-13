<template>
  <div class="AppTitle">
    <div class="heading">
      <span class="title-icon classic pull-left"><i class="fa" :class="fontawesome"></i></span>
      <h2 class="title classic">{{ title }}</h2>
    </div>          
  </div>
</template>

<script>
export default {
  name: 'AppTitle',
  props: {
    'title': {
      type: String
    },
    'fontawesome': {
      type: String,
      default: 'fa-question'
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/bootstrap/bootstrap';

/* Deafult title */

.heading{
  padding-bottom: 50px;
  margin-top: 10px;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -ms-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
}

.title-icon{
  font-size: 32px;
  margin-right: 15px;
  margin-top: 9px;
  color: #959595;
}

.title-icon.classic{
  margin-top: 0;
}

.title{
  position: relative;
  margin: 0;
  line-height: 32px;
  border-left: 2px solid #e7e7e7;
  display: inline-block;
  padding-left: 15px;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -ms-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
 }

 .title.classic{
  line-height: 40px;
    height: 34px;
}

 .title-desc{
  font-size: 16px;
  line-height: 18px;
  font-weight: 400;
  text-transform: capitalize;
  display: block;
  color: #6A6A6A
 }

</style>
