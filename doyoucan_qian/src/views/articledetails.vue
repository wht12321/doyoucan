<template>
  <div>
    <div class="title">
      {{article.atitle}}
    </div>
    <div class="details" v-html="decodeURIComponent(article.adetails)">
    </div>
    <div class="other">
      <div class="other_left">
        <van-image width="2rem" height="2rem" fit="fill" :src="article.aimg"/>
        <div class="other_left_text">
          <div>
            <van-icon name="underway" style="vertical-align:baseline"/>
            {{$time(article.atime).format('YYYY-MM-DD HH:mm:ss')}}
          </div>
          <div>
            <van-icon name="eye" style="vertical-align:top"/>
            {{article.aviewN>=10000 ? Math.round(article.aviewN/10000)+"w" : article.aviewN}}
          </div>
          <div>
            <van-icon name="good-job" style="vertical-align:top"/>
            {{article.aloveN>=10000 ? Math.round(article.aloveN/10000)+"w" : article.aloveN}}
          </div>
        </div>
      </div>
      <div class="dashed"></div>
      <div class="other_center">
        <van-icon name="good-job-o" color="#FF0000" class="other_center_good" v-if="article.aloveS.split(',').indexOf(IP)===-1" @click.stop="addLove(article.aid)"/>
        <van-icon name="good-job" color="#FF0000" class="other_center_good" v-if="article.aloveS.split(',').indexOf(IP)!==-1"/>
        <div style="font-size:0.3rem;">点赞</div>
      </div>
      <div class="dashed"></div>
      <div class="other_right">
        <van-image round width="1.5rem" height="1.5rem" fit="fill" :src="user.uhead"/>
        <div style="font-size:0.3rem;">{{user.uname}}</div>
      </div>
    </div>
    <comment :aid="aid" style="margin:0.3rem"></comment>
  </div>
</template>

<script>
import comment from "../components/comment.vue"
export default {
  name: 'articledetails',
  components:{
    comment
  },
  created(){
    this.aid=parseInt(this.$route.params.id)
    if(this.aid!==0){
      this.getDeatils();
    }
  },
  data() {
    return {
      aid:0,

      IP:"127.0.0.1",//当前客户端IP
      user:{uanme:"",uhead:""},//当前文章管理员基本信息
      article:{aid:0,aimg:"",atags:"",atitle:"",adetails:"",aviewN:0,aviewS:"",aloveN:0,aloveS:"",acomN:0,uid:0,atime:0},//当前文章主体内容
    };
  },
  methods: {
    getDeatils(){//初始化查询所有渲染所需内容，并且浏览量+1
      this.$axios.get("/getDeatils",{
        params:{
          aid:this.aid
        }
      }).then((res)=>{//形参result接收返回的数据，但不仅是返回的数据
        //返回数据对象res.data
          // 参数1：isTrue       bool类型判断查询是否成功
          // 参数2：IPString     IP地址
          // 参数3：user         当前文章管理员基本信息
          // 参数4：article      当前文章下的主体内容
        if(res.data.isTrue){
          // console.dir(res.data);
          this.IP=res.data.IPString;
          this.user=res.data.user;
          // res.data.article.adetails=decodeURIComponent(res.data.article.adetails);
          this.article=res.data.article;
        }else{
          this.$toast('数据查询错误');
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    addLove(aid){
      if(this.article.aloveS.split(',').indexOf(this.IP)===-1){
        this.article.aloveS=this.article.aloveS+","+this.IP;
        ++this.article.aloveN;
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


  },
}
</script>

<style lang="scss" scoped>
  .title{
    background: rgba(240, 129, 240, 0.5);
    font-size: 0.46333rem;
    line-height: 1.17333rem;
    text-align: center;
    font-weight: bold;
    border-top: skyblue 0.1rem solid;
    border-right: skyblue 0.1rem solid;
    border-bottom: yellowgreen 0.1rem solid;
    border-left: yellowgreen 0.1rem solid;
    color:#000;
  }
  .details{
    margin:0.2rem 0.3rem;
    font-size:0.37rem;// 默认字体大小
    text-align: left;// 默认文本对齐
    color:#353535;// 默认字体颜色
    background:rgba(255,255,255,0.5);// 默认背景颜色
    padding:0.2rem;// 默认内边距
    border:rgba(245, 222, 179,0.5) 0.1rem solid
  }
  .other{
    justify-content: space-evenly;
    display: flex;
    background:#FFFFFF;
    margin: 0.5rem 0.3rem;
    padding:0.2rem;
    border-radius: 0.5rem;
    border:#000000 0.1rem solid;
    color:#000000;
    font-weight:bold;
    box-shadow: -0.1rem 0.2rem 0.3rem 0.1rem rgba(0,0,0,0.5);
  }
  .other_left{
    display: flex;
  }
  /deep/.other_left .van-image__img{
    border-radius:0.1rem;
  }
  .other_left_text{
    font-size:0.3rem;
    text-align:left;
    margin-left:0.3rem;
    display: flex;
    flex-direction:column;
    justify-content:space-around;
  }
  .other_center{
    // margin: 0rem 0.6rem;
    display:flex;
    flex-direction:column;
    justify-content:center;
  }
  .other_center_good{
    font-size:1rem;
  }
  .other_center_good:hover{
    cursor: pointer;
  }
  .other_right{
    // margin: 0rem 0.6rem;
    display:flex;
    flex-direction:column;
    justify-content:center;
  }
  .dashed{
    border-right:#000 0.1rem dashed;
  }
</style>