<template>
  <div>
      <h1 style="color:#1968E7;">B站视频评论批量截图</h1>
  </div>
</template>

<script>

export default {
  name: 'bilibilicutcomments',
  data() {
    return {
      av:"",
      bv:"BV1bZ4y1W7k5",
    }
  },
  created() {
    this.bvtoav();
  },
  methods:{
    bvtoav(){//将bv号转换为av号
      var url=`https://api.bilibili.com/x/web-interface/view?bvid=${this.bv}`;
      this.$jsonp(url).then(e => {
        if(e.code===0){//此时是正常情况
          console.dir(e.data)
        }else{
          this.$toast('BV号转换AV号失败');
        }
      });

    //   this.$axios.get(url).then((res)=>{//形参result接收返回的数据，但不仅是返回的数据
    //       console.log("AAAAAAAAAAA")
    //       console.dir(res);
    //   }).catch((err)=>{
    //     console.log(err);
    //   })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>