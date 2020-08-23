<template>
  <div id="app">
    <vue-particles color="#994C93" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle" :particleSize="4" linesColor="#D1598A" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="lizi"></vue-particles><!-- 点线性背景 -->
    <div class="tanxin">
      <div class="outdiv" :style="curHeight">
        <div style="position:relative;overflow:hidden;">
          <img alt="深井烈阳_LOGO" :src="LOGO" style="width:15%;cursor: pointer;" @click="toHome"/>
          <img alt="Gitee_LOGO" :src="Gitee" class="gitee" @click="toGitee"/>
          <img alt="GitHub_LOGO" :src="GitHub" class="github" @click="toGitHub"/>
          <img alt="BiliBili_LOGO" :src="BiliBili" class="bilibili" @click="toBiliBili"/>
          <img alt="CSDN_LOGO" :src="CSDN" class="csdn" @click="toCSDN"/>
        </div>
        <router-view></router-view>
      </div>
      <img :src="bywho" :style="curWidth"/>
    </div>
  </div>
</template>

<script>
export default {
    data(){
      return{
        curHeight:{height:"0px"},
        curWidth:{"width":"0px","z-index":"1","position":"absolute","left":"0","bottom":"0","pointer-events":"none","opacity":"0.1"},
        LOGO:require("@/assets/LOGO.png"),
        Gitee:require("@/assets/Gitee.png"),
        GitHub:require("@/assets/GitHub.png"),
        BiliBili:require("@/assets/BiliBili.png"),
        CSDN:require("@/assets/CSDN.png"),
        bywho:require("@/assets/by_深井烈阳.png"),
      }
    },
    beforeMount() {//获得初始化屏幕高度&宽度，并监听屏幕高度&宽度变化
      var h = document.documentElement.clientHeight || document.body.clientHeight;
      this.curHeight ={height:h+"px"};
      var w = document.documentElement.clientWidth || document.body.clientWidth;
      this.curWidth['width'] =(w/7)+"px";
      window.onresize = () => {
        return (() => {
          h = document.documentElement.clientHeight || document.body.clientHeight;
          this.curHeight = {height:h+"px"};
          w = document.documentElement.clientWidth || document.body.clientWidth;
          this.curWidth['width'] =(w/7)+"px";
        })();
      };
    },
    methods: {
      toGitee(){
        window.open("https://gitee.com/wht12321");
      },
      toGitHub(){
        window.open("https://github.com/wht12321");
      },
      toBiliBili(){
        window.open("https://space.bilibili.com/18045348");
      },
      toCSDN(){
        window.open("https://blog.csdn.net/wht12321");
      },
      toHome(){
        // console.log("去主页");
        if (this.$route.name === 'Home') return false
        this.$router.push({name:"Home"});
      }
    }
}
</script>

<style>
#particles-js{
  width: 100%;
  height: calc(100%);
  position: absolute;
}

.tanxin{
  display:flex;
  justify-content:center;
}

.outdiv{
  position: relative;
  background:rgba(213,100,100,0.5);
  width:70%;
  /* height:1000px; */
  overflow:auto;
  overflow-x:hidden;
  /* overflow-y:hidden; */
  scrollbar-width: none; /* firefox：隐藏滚动条 */
  -ms-overflow-style: none; /* IE 10+：隐藏滚动条 */
  z-index:100;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari：隐藏滚动条 */
}

.lizi{ /* 此类用于给点线性背景设置额外样式 */
  background: #2e2733;
}

html,body{
  margin:0;
  padding:0;
}

.gitee{
  width: 8%;
  position: absolute;
  top:-7%;
  left:-1%;
  -webkit-transition:2s;
  -moz-transition:2s;
  -o-transition:2s;
}
.gitee:hover{
  -webkit-transform:translate(15%,15%);
  -moz-transform:translate(15%,15%);
  -o-transition:translate(15%,15%);
  cursor: pointer;
}
.github{
  width: 8%;
  position: absolute;
  top:-7%;
  right:-1%;
  -webkit-transition:2s;
  -moz-transition:2s;
  -o-transition:2s;
}
.github:hover{
  -webkit-transform:translate(-15%,15%);
  -moz-transform:translate(-15%,15%);
  -o-transition:translate(-15%,15%);
  cursor: pointer;
}
.bilibili{
  width: 8%;
  position: absolute;
  bottom:-7%;
  left:-1%;
  -webkit-transition:2s;
  -moz-transition:2s;
  -o-transition:2s;
}
.bilibili:hover{
  -webkit-transform:translate(15%,-15%);
  -moz-transform:translate(15%,-15%);
  -o-transition:translate(15%,-15%);
  cursor: pointer;
}
.csdn{
  width: 8%;
  position: absolute;
  bottom:-7%;
  right:-1%;
  -webkit-transition:2s;
  -moz-transition:2s;
  -o-transition:2s;
}
.csdn:hover{
  -webkit-transform:translate(-15%,-15%);
  -moz-transform:translate(-15%,-15%);
  -o-transition:translate(-15%,-15%);
  cursor: pointer;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
