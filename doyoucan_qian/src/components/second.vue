<template>
  <div class="ooo">
    
    <div class="out">
      <div class="top">
        <img :src="bilibili" class="iconsize">
        BILIBILI
      </div>
      <div class="in">
        <div @click="tobilibilicutcomments">B站视频评论批量截图</div>
        <p style="clear:both;"></p>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'second',
  data() {
    return {
      bilibili:require("@/assets/icon/bilibili.png"),
    }
  },
  methods: {
    tobilibilicutcomments(){//B站视频评论批量截图
      // var routeUrl = this.$router.resolve({
      //   name: "bilibilicutcomments",
      //   // params: {id:0}
      // });
      // window.open(routeUrl.href, '_blank');
      this.$toast('工具开发中...');
    },

  },
}
</script>

<style lang="scss" scoped>
  .ooo{
    margin:0.3rem;
  }
	.out{
    margin:1.25rem 0rem;
    padding: 0.6rem 0.5rem;
    position:relative;
    box-shadow: 0.5rem 0.575rem 0.375rem rgba(39,44,49,0.6), 0.0625rem 0.1875rem 0.5rem rgba(39,44,49,0.3);
    background-color: rgba(255,255,255,0.9);
    border-radius: 0.5rem;
  }
  .iconsize{
    height:0.35rem;
  }
	.top{
    background:#249FFD;
    position: absolute;
    top:-0.38rem; 
    left:0.8rem; 
    line-height:0.5rem; 
    font-size:0.35rem; 
    color:#FFFFFF; 
    font-weight:bold;
    padding:0.1rem 0.4rem;
    border-radius: 0.25rem;
    box-shadow: 0.1rem 0.2rem 0.2rem rgba(36,159,253,0.2);
  }
  .in{
    text-align:left;
  }
  .in>div{
    float: left; 
    box-sizing: border-box;
    width: 4.8rem;
    margin: 0.4375rem;
    padding: 0.225rem 0.2575rem;
    font-size: 0.325rem;
    font-weight: bold;
    text-align: center;
    letter-spacing: 0.0625rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    border: none;
    box-shadow: 0 0 0.0625rem 0 rgba(8,11,14,.06), 0 0.1875rem 0.1875rem -0.0625rem rgba(8,11,14,.1), 0 0 0.1875rem 0 rgba(8,11,14,.02);
    transition:all 0.6s;
  }
  .in>div:hover{
    color:#FFFFFF;
    transform: translateY(-0.125rem);
    box-shadow: 0 0 0.0625rem 0 rgba(8,11,14,.06), 0 0.375rem 0.375rem -0.0625rem rgba(8,11,14,.1);
    background-color: #249FFD;
  }
</style>