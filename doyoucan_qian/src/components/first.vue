<template>
  <div>
    <van-swipe-cell style="background:rgba(146,155,120,0.5);margin:0px 0px 5px 0px;">
      <van-row type="flex" justify="space-between">
        <van-col span="13" style="margin:auto 0;">
          <van-search @search="search" v-model="searchValue" maxlength="50" background="transparent" placeholder="请输入搜索关键词，多个请用中文 ，隔开" />
        </van-col>
        <van-col span="8" style="margin:auto 0;">
            <van-radio-group v-model="radioValue" direction="horizontal">
              <van-radio name="0" checked-color="rgba(25,137,250,0.8)">发布时间 ↓</van-radio>
              <van-radio name="1" checked-color="rgba(25,137,250,0.8)">浏览次数 ↓</van-radio>
              <van-radio name="2" checked-color="rgba(25,137,250,0.8)">喜欢人数 ↓</van-radio>
            </van-radio-group>
        </van-col>
        <van-col span="3">
          <van-button square id="searchbutton" color="linear-gradient(to right, rgba(75,176,255,0.8), rgba(97,73,246,0.8))" @click.native="search">搜索</van-button>
        </van-col>
      </van-row>
      <template #right>
        <van-button square type="warning" id="addbutton" @click.native="add">新增</van-button>
      </template>
    </van-swipe-cell>
    <van-row type="flex" justify="space-between" style="margin:0.5rem;">
      <van-col span="17">
        <van-empty description="数据为空，没有匹配的资料" :image="emptyImg" class="empty-image" v-show="allitems===0" />
        <van-swipe-cell v-for="(elem,i) of allarticles" :key="i" v-show="(i>=pagesizes*(currentPage-1))&&(i<=pagesizes*currentPage-1)">
          <van-card
            :tag="new Date().getTime()-elem.atime<=2592000000 ? 'New' : ''"
            :desc="elem.adetails"
            :title="elem.atitle"
            :thumb="elem.aimg"
            @click.native="toDetails(elem.aid)"
          >
            <template #tags>
              <div id="tags" @click.stop="">
                <van-tag plain :color="colors[ini % colors.length]" v-for="(inelem,ini) of elem.atags.split('，')" :key="ini">{{inelem}}</van-tag>
              </div>
              <div class="fourthings" @click.stop="">
                <div>
                  <van-icon name="underway" style="vertical-align:top"/>
                  {{$time(elem.atime).format('YYYY-MM-DD')}}
                </div>
                <div>
                  <van-icon name="eye" style="vertical-align:top"/>
                  {{elem.aviewN>=10000 ? Math.round(elem.aviewN/10000)+"w" : elem.aviewN}}
                </div>
                <div>
                  <van-icon name="comment" style="vertical-align:top"/>
                  {{elem.acomN>=10000 ? Math.round(elem.acomN/10000)+"w" : elem.acomN}}
                </div>
                <div>
                  <van-icon name="good-job-o" color="#FF0000" v-if="elem.aloveS.split(',').indexOf(IP)===-1"  style="vertical-align:top;cursor:pointer;" @click.stop="addLove(i,elem.aid)"/>
                  <van-icon name="good-job" color="#FF0000" v-if="elem.aloveS.split(',').indexOf(IP)!==-1"  style="vertical-align:top"/>
                  {{elem.aloveN>=10000 ? Math.round(elem.aloveN/10000)+"w" : elem.aloveN}}
                </div>
              </div>
            </template>
          </van-card>
          <template #right>
            <van-button square type="warning" id="editbutton" @click.native="edit(elem.aid)">编辑</van-button>
            <van-button square type="danger" id="deletebutton" @click.native="del(elem.aid,i)">删除</van-button>
          </template>
        </van-swipe-cell>

        <div style="opacity:0.7">
          <van-pagination v-model="currentPage" :total-items="allitems" :items-per-page="pagesizes" :show-page-size="showpages" force-ellipses @change="changePage"/>
        </div>
      </van-col>
      <van-col span="6">
        <van-calendar title="日历" :poppable="false" :show-confirm="false"/><!-- 日历 -->
        <div id="weather-view-he"></div><!-- 天气预报 -->
        <div class="HOTtabs">
          <div class="HOTtabstitle">热门标签</div>
          <div id="tags" >
            <van-tag @click.native="selectThisTab(i)" plain :color="colors[i % colors.length]" v-for="(elem,i) of hotTabs" :key="i">{{elem}}</van-tag>
          </div>
        </div>
        <h1>广告位待招中~</h1>
      </van-col>
    </van-row>
    <van-dialog @confirm="delReally" v-model="show" title="删除——管理员登录" show-cancel-button>
      <van-field v-model="uname" label="用户名" placeholder="用户名注意大小写" maxlength="20" />
      <van-field v-model="upwd" label="密码" placeholder="密码注意大小写" maxlength="20" />
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'first',
  data() {
    return {
      searchValue:"",//查询输入框，多个用关键词中文，隔开
      radioValue:"0",// "0" 发布时间 ↓；"1" 浏览次数 ↓；"2" 喜欢人数 ↓
      currentPage:1,//当前页码
      showpages:10,//屏幕最多显示几个分页切换页数
      pagesizes:10,//每页显示记录数量
      allitems:0,//总记录数
      IP:"127.0.0.1",//当前客户端IP
      allarticles:[],//所有符合检索条件的文章
      emptyImg:require("@/assets/empty.png"),
      colors:['#ff0000','#eb4310','#f6941d','#fbb417','#ffff00','#cdd541','#99cc33','#3f9337','#219167','#239676','#24998d','#1f9baa','#0080ff','#3366cc','#333399','#003366','#800080','#a1488e','#c71585','#bd2158'],
      show:false,//管理员登录弹窗是否显示
      uname:"",//管理员用户名
      upwd:"",//管理员密码
      delaid:0,//需要删除的文章aid
      delindex:0,//需要删除的文章所在allarticles的下标
      hotTabs:["HTML5","CSS3","Less","Sass","MYSQL","Bootstrap","JavaScript","jQuery","ES6","DOM","BOM","TypeScript","Vue","Vue-cli3","Vue-Router","Vuex","MintUI","ElementUI","MVVM","Flutter","Dart","Android","H5","APP","Iconfont","Echarts","Angular","Dcloud","uni-app","iView","Layui","Vant Weapp","NG-ZORRO","Ionic","MUI","NodeJS","AJAX","Git","小程序","PhotoShop","视频剪辑","PHONEGAP","React","Python","Webpack","宝塔面板","Fiddler","Jenkins","Linux","Maven","npm","yarn","pub","Tomcat","ES5","This指向","响应式"],//热门标签
    }
  },
  created() {
    window.WIDGET = { ID: 'Daoq5olt0h' };
    (function (d) {
      var cs = d.createElement('link')
      cs.rel = 'stylesheet'
      cs.href = 'https://apip.weatherdt.com/view/static/js/r.css?v=1111'
      var s = d.createElement('script')
      s.src = 'https://apip.weatherdt.com/view/static/js/r.js?v=1111'
      var sn = d.getElementsByTagName('script')[0]
      sn.parentNode.insertBefore(cs, sn)
      sn.parentNode.insertBefore(s, sn)
    })(document)
    this.search();
  },
  methods: {
    changePage(e){
      console.log(`页码被切换了，切换到第${e}页码`);
      // 由于切换页面无需发起新请求而是采用v-show进行展示对应内容，所以此事件无需操作
    },
    search(){
      this.$axios.get("/selectarticleList",{
        params:{
          searchValue: this.searchValue.length>0 ? this.searchValue.split("，") : new Array(),
          radioValue:this.radioValue
        }
      }).then((res)=>{//形参result接收返回的数据，但不仅是返回的数据
          this.searchValue="";
          this.allitems=res.data.data.length;
          this.IP=res.data.IP;
          // res.data.data可能是“[]”或“[文章1,文章2...]”
          // console.dir("-------------------------------");
          // console.dir(res.data);
          var getText=function(str){
            return str
              .replace(/<[^<>]+>/g, "")
              .replace(/&nbsp;/gi, "");
          }
          this.allarticles=res.data.data.map((elem,i,arr) => {
            elem.adetails=getText(decodeURIComponent(elem.adetails));  //将文章内容的Unicode转换问人类可识别的纯文字，用于显示概要
            return elem;
          })
          this.$toast('查询成功');
      }).catch((err)=>{
        console.log(err);
      })
    },
    add(){
      // console.log("新增按钮被点击了");
      this.$dialog.confirm({
        title: '注意',
        message: '新增文章需要有管理员权限哦~',
      }).then(() => {// 点击确定
        var routeUrl = this.$router.resolve({
          name: "edit",
          params: {id:0}
        });
        window.open(routeUrl.href, '_blank');
      }).catch(() => {// 点击取消
      });
    },
    edit(aid){
      // console.log("编辑按钮被点击了");
      this.$dialog.confirm({
        title: '注意',
        message: '编辑文章需要有管理员权限哦~',
      }).then(() => {// 点击确定
        var routeUrl = this.$router.resolve({
          name: "edit",
          params: {id:aid}
        });
        window.open(routeUrl.href, '_blank');
      }).catch(() => {// 点击取消
      });
    },
    del(aid,i){
      // console.log("删除按钮被点击了");
      this.delaid=aid;
      this.delindex=i;
      this.show=true;//管理员登录弹窗显示
    },
    delReally(){
      this.$axios.post('/delarticle',{
        aid:this.delaid,
        uname:this.uname,
        upwd:this.upwd
      }).then((res) => {
        if(res.data.isTrue){
          this.allarticles.splice(this.delindex,1);//删除本地data内的文章列表数据
          this.allitems=this.allarticles.length;//同步总记录数
          this.$toast('文章及相关评论已被删除');
        }else{
          this.$toast('用户名或密码错误');
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    addLove(i,aid){//【给文章点赞】参数一：当前文章在前端allarticles数组的下标  参数二：当前文章在数据库的aid标识
      if(this.allarticles[i].aloveS.split(',').indexOf(this.IP)===-1){
        this.allarticles[i].aloveS=this.allarticles[i].aloveS+","+this.IP;
        ++this.allarticles[i].aloveN;
        this.$toast('点赞成功');
        this.$axios.get("/addLove",{
          params:{
            ip:this.IP,
            aid:aid
          }
        }).then((res)=>{//形参result接收返回的数据，但不仅是返回的数据
            // console.dir("-------------------------------");
            console.dir(res.data);
        }).catch((err)=>{
          console.log(err);
        })
      }
    },
    toDetails(aid){
      // console.log("卡片被点击，需要去到详情页");
      var routeUrl = this.$router.resolve({
        name: "articledetails",
        params: {id:aid}
      });
      window.open(routeUrl.href, '_blank');
    },
    selectThisTab(i){
      // console.log(this.hotTabs[i]);
      this.searchValue=this.hotTabs[i];
      this.search();
    }
  },
}
</script>

<style lang="scss" scoped>
  .van-swipe__track{
    height:500px !important;
  }
  .van-swipe-item {
    color: #fff;
    // font-size: 20px;
    // line-height: 150px;
    // text-align: center;
    background-color: #39a9ed;
  }
  #addbutton,#editbutton,#deletebutton{
    height:100%;
  }
  #searchbutton{
    height:100%;
    width:100%;
  }
  .van-search__content{
    background-color:transparent;
  }
  .van-radio-group--horizontal{
    justify-content:space-around;
  }
  .van-radio-group{
    font-weight:bolder;
  }
  .van-pagination__item--active{
    background-color:red;
  }
  .van-pagination__item{
    background-color:green !important;
  }
  .empty-image{
    opacity: 0.5;
    pointer-events:none;
  }
  /deep/ .van-image__img{
    object-fit: fill !important;
  }
  .van-card{
    text-align: left;
    opacity: 0.7;
    background:#FFF5FF;
  }
  .van-card__title{
    font-weight:bold;
  }
  #tags{
    text-align: left;
  }
  #tags>.van-tag{
    cursor: pointer;
    display:inline-block;
    height:0.3rem;
    line-height:0.3rem;
    font-size:0.264rem;
    // vertical-align: center;
    margin:1px;
  }
  .fourthings{
    display:flex;
    justify-content:space-between;
    margin-top:0.1rem;
  }
  .van-card__content>div{
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
  }
  .van-calendar{
    background: rgba(255, 192, 203,0.8);
    height:8.5rem !important;
    border-radius:0.1rem;
  }
  /deep/.van-calendar__days>.van-calendar__day, /deep/.van-calendar__selected-day{
    height:1rem;
  }
  /deep/.van-calendar__header-subtitle, /deep/.van-calendar__header-title{
    height:0.8rem;
  }
  /deep/ #weather-view-he{
    margin:0.3rem 0rem;
    width:100% !important;
    opacity: 0.8 !important;
  }
  .HOTtabs{
    padding:0.2rem;
    border-radius:0.1rem;
    background:#FFFFFF;
  }
  .HOTtabstitle{
    background: -webkit-linear-gradient(45deg, #FF0000, #EE005F,#B62A8F,#6D4B9A,#325082,#2F4858);
    background: -moz-linear-gradient(45deg, #FF0000, #EE005F,#B62A8F,#6D4B9A,#325082,#2F4858);
    background: linear-gradient(45deg, #FF0000, #EE005F,#B62A8F,#6D4B9A,#325082,#2F4858);
    -webkit-background-clip: text;
    color: transparent;
    font-weight:bold;
    font-size:0.4rem;
    border-bottom:turquoise 0.1rem solid;
    border-image: -webkit-linear-gradient(45deg, #FF0000, #EE005F,#B62A8F,#6D4B9A,#325082,#2F4858) 30 30;
    border-image: -moz-linear-gradient(45deg, #FF0000, #EE005F,#B62A8F,#6D4B9A,#325082,#2F4858) 30 30;
    border-image: linear-gradient(45deg, #FF0000, #EE005F,#B62A8F,#6D4B9A,#325082,#2F4858) 30 30;
  }
</style>