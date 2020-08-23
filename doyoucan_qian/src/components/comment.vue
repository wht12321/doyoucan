<template>
  <div class="comment">
      <div class="title">添加新评论</div>
      <van-field v-model="cname" required label="称呼" placeholder="必填" maxlength="10" :formatter="formatter">
        <template #button>
          <van-button style="margin-bottom:0.3rem;"  :disabled="(!cname)||(!cdetails)" @click.native="addTopComment" type="default" size="small" class="submit_float_right">提交</van-button>
        </template>
      </van-field>
      <van-field v-model="cdetails" required label="评论" placeholder="必填" maxlength="500" show-word-limit rows="1" autosize type="textarea" :formatter="formatter"/>
      <van-divider :hairline=false :style="dividerStyle" content-position="right">已有<span style="color:#FF0000;font-weight:bold;">{{commentsNumber}}</span>条评论</van-divider>
      <div class="title">评论区</div>
      <div class="topComment" v-for="(elem,i) of commentIndex" :key="i" v-show="commentIndex.length>0">
        <!-- <h1>{{commentDetails[elem].self.aid}}</h1> -->
        <div class="flexBetween">
          <div>
            <span style="color:#E74851;">{{commentDetails[elem].self.cname}}</span>&nbsp;
            <span style="color:#DBDBDB;">[{{commentDetails[elem].self.caddress}}网友]</span>
          </div>
          <div>
            <span style="color:#DBDBDB;">{{$time(commentDetails[elem].self.ctime).format('YYYY年MM月DD日 HH:mm')}}</span>&nbsp;
            <span @click="showReply(commentDetails[elem].self.cid)" style="cursor:pointer;padding:1px 4px;background:rgba(25, 137, 250,0.5);border-radius:5px;color:#FFFFFF;font-size:0.28rem;">回复</span>&nbsp;
            <van-icon name="good-job-o" color="#FF0000" v-if="commentDetails[elem].self.cloveS.split(',').indexOf(IP)===-1" @click.stop="addCommentLove(commentDetails[elem].self.cid)" style="cursor:pointer;"/>
            <van-icon name="good-job" color="#FF0000" v-if="commentDetails[elem].self.cloveS.split(',').indexOf(IP)!==-1"/>
            <span style="color:#FF0000;">{{commentDetails[elem].self.cloveN}}</span>
          </div>
        </div>
        <div style="margin: 0.2rem 0rem 0.2rem 0.5rem;">{{commentDetails[elem].self.cdetails}}</div>
        <div style="margin-left:0.5rem;" v-if="commentDetails[elem].self.cid===showReplyCid">
          <div class="title">回复</div>
          <van-field v-model="cname" required label="称呼" placeholder="必填" maxlength="10" :formatter="formatter">
            <template #button>
              <van-button :disabled="(!cname)||(!cdetails)" @click.native="addChindComment(commentDetails[elem].self.cid,commentDetails[elem].self.fcid===0 ? commentDetails[elem].self.cid : commentDetails[elem].self.fcid,commentDetails[elem].self.cname)" type="default" size="small" class="submit_float_right">提交</van-button>
            </template>
          </van-field>
          <van-field style="margin-bottom:0.3rem;"  v-model="cdetails" required label="评论" placeholder="必填" maxlength="500" show-word-limit rows="1" autosize type="textarea" :formatter="formatter"/>
        </div>
        <div class="childComment" v-if="commentDetails[elem].sons.length!==0">
          <div v-for="(inelem,ini) of commentDetails[elem].sons" :key="ini">
            <div class="flexBetween">
              <div>
                <span style="color:#E74851;">{{inelem.cname}}</span>&nbsp;
                <span style="font-size:0.26rem;font-weight:bold;">回复</span>&nbsp;
                <span style="color:#E74851;">@{{inelem.fname}}</span>&nbsp;
              </div>
              <div>
                <span style="color:#DBDBDB;">{{$time(inelem.ctime).format('YYYY年MM月DD日 HH:mm')}}</span>&nbsp;
                <span @click="showReply(inelem.cid)" style="cursor:pointer;padding:1px 4px;background:rgba(25, 137, 250,0.5);border-radius:5px;color:#FFFFFF;font-size:0.28rem;">回复</span>&nbsp;
                <van-icon name="good-job-o" color="#FF0000" v-if="inelem.cloveS.split(',').indexOf(IP)===-1" @click.stop="addCommentLove(inelem.cid)" style="cursor:pointer;"/>
                <van-icon name="good-job" color="#FF0000" v-if="inelem.cloveS.split(',').indexOf(IP)!==-1"/>
                <span style="color:#FF0000;">{{inelem.cloveN}}</span>
              </div>
            </div>
            <div style="margin: 0.1rem 0rem 0.1rem 0.5rem;">{{inelem.cdetails}}</div>
            <div style="margin-left:0.5rem;" v-if="inelem.cid===showReplyCid">
              <div class="title">回复</div>
              <van-field v-model="cname" required label="称呼" placeholder="必填" maxlength="10" :formatter="formatter">
                <template #button>
                  <van-button :disabled="(!cname)||(!cdetails)" @click.native="addChindComment(inelem.cid,inelem.fscid,inelem.cname)" type="default" size="small" class="submit_float_right">提交</van-button>
                </template>
              </van-field>
              <van-field style="margin-bottom:0.3rem;" v-model="cdetails" required label="评论" placeholder="必填" maxlength="500" show-word-limit rows="1" autosize type="textarea" :formatter="formatter"/>
            </div>
          </div>
        </div>
      </div>
      <van-empty description="暂无评论" v-show="commentIndex.length===0"/>
  </div>
</template>

<script>

export default {
  name: 'comment',
  props:["aid"],//aid>0是对应文章页的评论，aid=0是给我留言页的评论
  data() {
    return {
      commentsNumber:0,//存储当前文章评论数据
      commentDetails:{},//存储当前文章所有评论数据。格式：{一级留言cid:{self:{...},sons:[子孙留言①,...]},...}
      commentIndex:[],//存储一级留言的cid（即commentDetails的下标）
      IP:"127.0.0.1",
      caddress:"地球人",//评论的网友IP转化的物理地址
      cname:"",//评论的网友称呼
      cdetails:"",//评论的内容
      dividerStyle:{opacity:0.5,color:'#1989FA',borderColor:'#1989FA'},
      showReplyCid:null,//显示哪个评论cid对应的回复框
    }
  },
  created() {
    this.selectComment();
  },
  methods: {
    selectComment(){
      this.$axios.get("/selectcomment",{
        params:{
          aid:this.aid
        }
      }).then((res)=>{//形参result接收返回的数据，但不仅是返回的数据
        this.IP=res.data.IP;
        this.commentsNumber=res.data.data.length;
        var commentDetails={};
        var commentIndex=[];
        res.data.data.forEach((val,index)=>{
          if(val.fscid===0){//一级评论
            commentDetails[val.cid]={self:{},sons:[]};
            commentDetails[val.cid].self=val;
            commentIndex.push(val.cid);
          }
        })
        res.data.data.forEach((val,index)=>{
          if(val.fscid!==0){//子孙级评论
            commentDetails[val.fscid].sons.push(val);
          }
        })
        this.commentDetails=commentDetails;
        this.commentIndex=commentIndex;
        // console.log("----------------------------------")
        // console.dir(this.commentDetails)
        // console.dir(this.commentIndex)
        //测试使用
        // var url=`https://api.map.baidu.com/location/ip?ip=${"125.120.108.109"}&ak=TmA9HpyheQw5ELjEpGBtiI6xIkg9Y7IT&coor=bd09ll`;
        //线上发布
        var url=`https://api.map.baidu.com/location/ip?ip=${this.IP}&ak=TmA9HpyheQw5ELjEpGBtiI6xIkg9Y7IT&coor=bd09ll`;
        this.$jsonp(url).then(e => {
          if(e.status===0){//此时是正常情况
            this.caddress=e.content.address;
          }
        });
      }).catch((err)=>{
        console.log(err);
      })
    },
    formatter(value){//格式化输入框的内容，取消一切起始和结尾的空格
      return value.replace(/^\s|\s$/g, '');
    },
    addTopComment(){//新增一级留言
      this.$axios.post('/addComment',{
        aid:this.aid,
        fcid:0,
        fname:"",
        fscid:0,
        ctime:new Date().getTime(),
        cname:this.cname,
        caddress:this.caddress,
        cdetails:this.cdetails
      }).then((res) => {
        this.commentsNumber=res.data.length;
        var commentDetails={};
        var commentIndex=[];
        res.data.forEach((val,index)=>{
          if(val.fscid===0){//一级评论
            commentDetails[val.cid]={self:{},sons:[]};
            commentDetails[val.cid].self=val;
            commentIndex.push(val.cid);
          }
        })
        res.data.forEach((val,index)=>{
          if(val.fscid!==0){//子孙级评论
            commentDetails[val.fscid].sons.push(val);
          }
        })
        this.commentDetails=commentDetails;
        this.commentIndex=commentIndex;
        this.cdetails="";//清空已发布的留言评论内容
        this.$toast('新增评论成功');
      }).catch((err)=>{
        console.log(err);
      })
    },
    addChindComment(fcid,fscid,fname){//新增子孙级留言
      this.$axios.post('/addComment',{
        aid:this.aid,
        fcid:fcid,
        fname:fname,
        fscid:fscid,
        ctime:new Date().getTime(),
        cname:this.cname,
        caddress:this.caddress,
        cdetails:this.cdetails
      }).then((res) => {
        this.commentsNumber=res.data.length;
        var commentDetails={};
        var commentIndex=[];
        res.data.forEach((val,index)=>{
          if(val.fscid===0){//一级评论
            commentDetails[val.cid]={self:{},sons:[]};
            commentDetails[val.cid].self=val;
            commentIndex.push(val.cid);
          }
        })
        res.data.forEach((val,index)=>{
          if(val.fscid!==0){//子孙级评论
            commentDetails[val.fscid].sons.push(val);
          }
        })
        this.commentDetails=commentDetails;
        this.commentIndex=commentIndex;
        this.cdetails="";//清空已发布的留言评论内容
        this.$toast('回复成功');
        this.showReplyCid=null;//隐藏显示的回复框
      }).catch((err)=>{
        console.log(err);
      })
    },
    showReply(cid){//回复按钮被点击，哪个对应cid的回复框进行展示
      this.showReplyCid=cid;
    },
    addCommentLove(cid){//给指定cid留言点赞
      this.$axios.get("/addCommentLove",{
        params:{
          ip:this.IP,
          cid:cid,
          aid:this.aid,
        }
      }).then((res)=>{//形参result接收返回的数据，但不仅是返回的数据
        if(res.data.isTrue){
        var commentDetails={};
        var commentIndex=[];
        res.data.data.forEach((val,index)=>{
          if(val.fscid===0){//一级评论
              commentDetails[val.cid]={self:{},sons:[]};
              commentDetails[val.cid].self=val;
              commentIndex.push(val.cid);
            }
          })
          res.data.data.forEach((val,index)=>{
            if(val.fscid!==0){//子孙级评论
              commentDetails[val.fscid].sons.push(val);
            }
          })
          this.commentDetails=commentDetails;
          this.commentIndex=commentIndex;
          this.$toast('点赞成功');
        }else{
          this.$toast('点赞失败');
        }
      }).catch((err)=>{
        console.log(err);
      })
    }






  },
}
</script>

<style lang="scss" scoped>
  .comment{
    background:#F9F9F9;
    padding:0rem 0.2rem;
    text-align:left;
  }
  .title{
    font-size: 0.4rem;
    font-weight:bold;
    padding:0.3rem 0rem;
  }
  .submit_float_right{
    float: right;
    margin-top:0.2rem;
  }
  .van-divider::after, .van-divider::before{
    border-width:0.42667rem 0 0
  }
  .topComment{
    font-size:0.3rem;
    margin:0.1rem 0rem;
    padding-bottom:0.3rem;
  }
  .flexBetween{
    display:flex;
    justify-content:space-between;
  }
  .childComment{
    margin-left:0.5rem;
    padding:0.1rem;
    background:#FFFBF0;
    border-radius:0.2rem;
    border: 0.05rem solid #DEE49E;
  }
</style>