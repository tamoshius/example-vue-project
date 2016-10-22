<template>
  <div class="page-title">
       
        <div class="heading">
          <span class="title-icon pull-left"><i class="fa" :class="titleIcon" v-if="title"></i></span>
          <h2 class="title" :class="{ 'no-sub': !subtitle }"  v-if="title">
            {{ title }}
            <span class="subtitle">{{ subtitle }}</span>
          </h2>
        </div>  

  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {

    /**
     * Title
     * @var String
     */
    'title': {
      type: String
    },

    /**
     * A subtitle/description that appears below the title.
     * @var String
     */
    'subtitle': {
      type: String
    },

    /**
     * A font-awesome icon class, ie. 'fa-user'
     * @var {String}
     */
    'titleIcon': {
      type: String
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

.page-title {
  margin-top: -18px;
  color: #000;
  margin-bottom: 20px;
}

.heading {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-top: 10px;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -ms-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;
  transition: all 0.3s ease 0s;
}

.title-icon {
  margin-right: 15px;
  margin-top: 0px;
  color: #959595;
  font-size: 40px;
}

.title {
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

 .title.no-sub {
  line-height: 55px;
 }

 .subtitle {
  font-size: 16px;
  line-height: 18px;
  font-weight: normal;
  text-transform: capitalize;
  display: block;
  color: #7c7c7c;
  font-family: 'LatoWeb';
 }

</style>
