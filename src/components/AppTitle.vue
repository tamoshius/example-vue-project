<template>
  <div class="AppTitle">
    <div class="heading">
      <span class="title-icon classic pull-left"><i class="fa" :class="fontawesome"></i></span>
      <h2 class="title" :class="{ noDesc: !titleDesc }">
        {{ title }}
        <span class="title-desc">{{ titleDesc }}</span>
      </h2>
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
    'titleDesc': {
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
@import '../assets/style/variables';

.heading{
  padding-bottom: 40px;
  margin-top: 10px;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -ms-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
}

.title-icon{
  margin-right: 15px;
  margin-top: 0px;
  color: #959595;
  font-size: 40px;
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
  font-family: 'LatoWebBlack';
  text-transform: uppercase;
  font-size: $font-size-h3;
 }

 .title.noDesc{
  line-height: 55px;
 }

 .title-desc{
  font-size: 16px;
  line-height: 18px;
  font-weight: normal;
  text-transform: capitalize;
  display: block;
  color: #6A6A6A;
  font-family: 'LatoWeb';
 }

</style>
