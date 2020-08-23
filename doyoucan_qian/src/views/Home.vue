<template>
  <div class="home">
    <van-tabs v-model="active" color="#f77825" background="rgba(191,171,134,0.5)" title-active-color="#000000" title-inactive-color="#FFFFFF" swipe-threshold="5">
      <van-tab title="首页"><first></first></van-tab>
      <van-tab title="工具 & 资源"><second></second></van-tab>
      <van-tab title="给我留言"><third></third></van-tab>
      <van-tab title="交流合作"><fourth></fourth></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import first from "@/components/first.vue"
import second from "@/components/second.vue"
import third from "@/components/third.vue"
import fourth from "@/components/fourth.vue"
export default {
  name: 'Home',
  components:{first,second,third,fourth},
  data() {
    return {
      active: 0,
    };
  },
}
</script>

<style lang="scss" scoped>

</style>