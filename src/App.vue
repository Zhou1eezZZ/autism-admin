<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if (!this.$store.state.user.isLogin) {
      this.$router.push('/login')
    }
  }
}
</script>
<style>
.page-container{
  padding: 20px;
}
</style>
