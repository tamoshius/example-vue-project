<template>
  <div class="col-sm-4 col-sm-offset-4">

    <app-title fontawesome="fa-user-plus" title="Sign Up" titleDesc="For a free account"></app-title>

    <p>Todo</p>
  </div>
</template>

<script>
import AppTitle from './AppTitle.vue'

export default {
  name: 'signup',
  components: { AppTitle },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>


</style>
