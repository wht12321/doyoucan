<template>
  <div>
    <van-divider :hairline=false :style="dividerStyle"><h1>{{title}}</h1></van-divider>
    <van-row>
      <van-col span="18" style="opacity:0.7">
          <van-field v-model="atitle" label="标题" placeholder="为文章设置标题" maxlength="100" />
          <van-field v-model="atags" label="标签" placeholder="多个标签用中文逗号，分隔" maxlength="500" />
      </van-col>
      <van-col span="6">
        <van-uploader v-model="fileIMG" :max-count="1"  upload-text="上传封面" multiple />
      </van-col>
    </van-row>
    <van-field v-model="detailCode" @blur="blurCode" rows="1" :autosize="{ maxHeight: 600, minHeight: 50 }" label="富文本代码" type="textarea" placeholder="【非同步】失焦后同步至富文本"/>
    <wang-editor v-model="detail" :isClear="isClear" @change="change"></wang-editor>
    <van-button type="primary" color="#7232dd" style="opacity:0.7" @click.native="submit" block>提交</van-button>

    <van-dialog @confirm="submitIMG" v-model="show" title="管理员登录" show-cancel-button>
      <van-field v-model="uname" label="用户名" placeholder="用户名注意大小写" maxlength="20" />
      <van-field v-model="upwd" label="密码" placeholder="密码注意大小写" maxlength="20" />
    </van-dialog>
  </div>
</template>

<script>
import wangEditor from "../components/wangEditor.vue"
export default {
  name: 'edit',
  components:{
    wangEditor
  },
  created(){
    this.aid=parseInt(this.$route.params.id)
    if(this.aid===0){//aid为0则为新建文章页面
      this.title="新建文章";
    }else{//aid不为0则为编辑文章页面
      this.title="编辑文章";
      this.queryThis();
    }
  },
  data() {
    return {
      isClear: false,
      detail:"",//富文本处文本值的代码
      detailCode:"",//代码块处文本值的代码
      title:"新建文章",
      dividerStyle:{opacity:0.5,color:'#1989FA',borderColor:'#1989FA',padding:'0 16px'},

      aid:0,//当前文章标识aid，【0为新增文章页面，>0则对应aid文章的编辑页面】
      aimg:"",//当前文章封面aimg【需要将fileIMG的图片上传到服务器后绑定返回的图片地址】
      atags:"",//当前文章标签atags
      atitle:"",//当前文章标题atitle
      adetails:"",//当前文章内容【需要将detail编译后再传递给后端数据库】
      atime:0,//当前文章最后编辑时间【毫秒数】

      fileIMG:[],
      show:false,//管理员登录弹窗是否显示
      uname:"",//管理员用户名
      upwd:"",//管理员密码
    };
  },
  methods: {
    change(val) {//富文本内容发生变化将数据同步至代码块
      this.detailCode=this.detail;
      // console.log(val)
      // var a=encodeURIComponent(val);
      // console.log(a);
      // console.log(decodeURIComponent(a));
    },
    blurCode(val){//代码块失去焦点时才将数据同步至富文本
      this.detail=this.detailCode;
    },
    queryThis(){//编辑页面时，加载当前文章原有内容
      this.$axios.get("/selectarticle",{
        params:{
          aid: this.aid,
        }
      }).then((res)=>{//形参result接收返回的数据，但不仅是返回的数据
        if(res.data.data.length===1){//只有如此才是查找到匹配文章的正确情况
          var article=res.data.data[0];
          this.aid=article.aid;
          this.aimg=article.aimg;
          this.fileIMG=[{url:article.aimg}];
          this.atags=article.atags;
          this.atitle=article.atitle;
          this.adetails=article.adetails;
          this.detailCode=decodeURIComponent(article.adetails);
          this.detail=decodeURIComponent(article.adetails);
          this.atime=article.atime;
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    submit(){
      // console.log("提交按钮被点击了...");
      var isTrue=true;//条件十分符合（没有空的）
      var errText="";//如果为空需要的提示文字
      if(this.fileIMG.length===0){
        errText+="封面不能为空&#10";
        isTrue=false;
      }
      if(this.atitle.length===0){
        errText+="标题不能为空&#10";
        isTrue=false;
      }
      if(this.atags.length===0){
        errText+="标签不能为空&#10";
        isTrue=false;
      }
      var getText=function(str){
        return str
          .replace(/<[^<>]+>/g, "")
          .replace(/&nbsp;/gi, "");
      }
      if(getText(this.detail).length===0){
        errText+="文章不能为空";
        isTrue=false;
      }
      if(!isTrue){//如果有条件为空，则弹出问题
        this.$dialog.confirm({ title:'警告',message: errText });
        return;
      }
      //如果条件全部符合，弹出用户名&密码输入框
      this.show=true;//管理员登录弹窗显示
    },
    submitIMG(){//上传封面
      if(this.fileIMG[0].url){//封面未变
        this.aimg=this.fileIMG[0].url
        this.submitALL();
      }else{//封面已经变
        let formData = new FormData()
        formData.append('fileName', this.fileIMG[0].file)
        // this.$axios.post('http://www.doyoucan.com:3000/uploadFile', formData, {//本地测试：用这行
        this.$axios.post('/uploadFile', formData, {//上线：用这行
          headers: {'enctype': 'multipart/form-data'}
        }).then((res) => {
          if(res.data.isOk){//上传封面成功
            this.aimg=res.data.url[0];
            this.submitALL();
          }else{//上传封面失败
            this.$toast('封面上传失败');
          }
        }).catch((err)=>{
          console.log(err);
        })
      }
    },
    submitALL(){//最终上传内容的方法，并校验管理员用户名&密码
      this.adetails=encodeURIComponent(this.detail);//将文章转译
      if(this.aid===0){//情况1：新建文章
        this.$axios.post('/addarticle',{
          aimg:this.aimg,
          atags:this.atags,
          atitle:this.atitle,
          adetails:this.adetails,
          atime:new Date().getTime(),
          uname:this.uname,
          upwd:this.upwd
        }).then((res) => {
          if(res.data.isTrue){
            const toast = this.$toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true,
              message: '新建文章成功，倒计时 10 秒后自动关闭页面',
            });
            let second = 10;
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = `新建文章成功，倒计时 ${second} 秒后自动关闭页面`;
              } else {
                clearInterval(timer);
                // 手动清除 Toast
                this.$toast.clear();
                window.close();
              }
            }, 1000);
          }else{
            this.$toast('用户名或密码错误');
          }
        }).catch((err)=>{
          console.log(err);
        })
      }else{//情况2：编辑文章
        this.$axios.post('/updatearticle',{
          aid:this.aid,
          aimg:this.aimg,
          atags:this.atags,
          atitle:this.atitle,
          adetails:this.adetails,
          atime:new Date().getTime(),
          uname:this.uname,
          upwd:this.upwd
        }).then((res) => {
          if(res.data.isTrue){
            const toast = this.$toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true,
              message: '编辑文章成功，倒计时 10 秒后自动关闭页面',
            });
            let second = 10;
            const timer = setInterval(() => {
              second--;
              if (second) {
                toast.message = `编辑文章成功，倒计时 ${second} 秒后自动关闭页面`;
              } else {
                clearInterval(timer);
                // 手动清除 Toast
                this.$toast.clear();
                window.close();
              }
            }, 1000);
          }else{
            this.$toast('用户名或密码错误');
          }
        }).catch((err)=>{
          console.log(err);
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .van-divider::after, .van-divider::before{
    border-width:0.22667rem 0 0
  }
  .van-cell{
    background-color: transparent;
  }
  /deep/ .van-uploader__upload{
    background-color: transparent;
  }
</style>