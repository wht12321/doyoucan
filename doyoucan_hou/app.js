//1:引入第三方模块
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const session = require("express-session");
const multiparty = require("multiparty");
const formidable = require("formidable");
const fs = require("fs");
const bodyParser=require("body-parser");
//2:配置第三方模块
 //2.1:配置连接池
 var pool = mysql.createPool({
   host:"127.0.0.1",
   user:"root",
   password:"",
   port:3306,
   database:"doyoucan",
   connectionLimit:60
 })
 //2.2:跨域
 var server = express();
//  server.use(cors({
  // origin:["http://127.0.0.1:8080","http://localhost:8080"],//数组内可以配置多个地址
  // origin:["https://47.240.81.172:80","http://47.240.81.172:80"],//数组内可以配置多个地址
  //  credentials:true
//  }))
 //2.3:session
 server.use(session({
   secret:"加密专用",
   resave:true,
   saveUninitialized:true
 }))
 //端口监听
 server.listen(3000);

//如此可用req.body获得post请求参数 
 server.use(bodyParser.json());
 server.use(bodyParser.urlencoded({extended:false}));
 
//测试接口    测试方式  http://localhost:3000/cs
server.get("/cs",(req,res)=>{
  function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress; //如非反向代理则是这一行起效果
  };
  var resText=getClientIP(req);//【结果1】::ffff:123.203.107.57【结果2】::1
//   if(resText.length>7){
//     resText=`IP地址是${resText.substring(7)}，是真实地址而非反向代理地址`;
//   }else{
//     resText="本地测试或者IP获取错误"
//   }
  res.send(resText)

})

//功能一：用于上传图片formdata
server.post("/uploadFile",(req,res,next)=>{
  let form = new formidable.IncomingForm();
  let dir = "./public/image/";
  form.uploadDir =dir;
  form.parse(req, function(err, fields, files) {
      let oldPath = files.fileName.path; //fileName就是我们刚在前台模板里面配置的后台接受的名称；
      // let extname = files.fileName.name; //获取图片名称
      let extname = Date.now()+"_"+files.fileName.name; //获取图片名称
      //新的路径由组成：原父路径 + 拓展名
      let newPath = dir + extname;
      //改名     把之前存的图片换成真的图片的完整路径
      fs.rename(oldPath, newPath, function(err) {
          if(err) {
              res.send({isOk:false,err});
          }
          let resPath = newPath.replace("./public","https://www.doyoucan.com/nodejs_hou/public"); //处理图片路径  让前端能访问
          res.send({isOk:true,url:[resPath]}) //返回图片路径
      });
  });
})

//功能二：主页的查询
server.get("/selectarticleList",(req,res)=>{
  //一：获得IP
  function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress; //如非反向代理则是这一行起效果
  };
  var IPString=getClientIP(req);//【结果1】::ffff:123.203.107.57【结果2】::1
//   if(IPString!=="127.0.0.1"&&IPString.length>7){
//     IPString=IPString.substring(7);
//   }else{
//     IPString="127.0.0.1";
//   }
  //二：首页查询文章
  var searchValue = req.query.searchValue;//undefined或["参数一","参数二"...]
  var radioValue = req.query.radioValue;// "0" 发布时间 ↓；"1" 浏览次数 ↓；"2" 喜欢人数 ↓
  var sql = `SELECT * FROM doyoucan_article ORDER BY ${radioValue=="0" ? "atime" : radioValue=="1" ? "aviewN" :radioValue=="2" ? "aloveN" : "atime"} DESC`;
  pool.query(sql,[],(err,result)=>{
      if(err)throw err;
      if(result.length==0){//情况一：数据库文章为空
        res.send({data:[],IP:IPString});
      }else{
        if(typeof(searchValue)==="undefined"){//情况二：查询关键字为空
          res.send({data:result,IP:IPString});
        }else{//情况三：数据库有文章，并且有至少一个查询关键字
          var articles=result.filter((elem,i,arr)=>{
            var title=elem.atitle;//关键词查找地一：文章标题
            var getText=function(str){
              return str
                .replace(/<[^<>]+>/g, "")
                .replace(/&nbsp;/gi, "");
            }
            var details=getText(decodeURIComponent(elem.adetails));//关键词查找地二：文章内容【已经将富文本转换为去标签的纯文本】
            var tabs=elem.atags;//关键词查找地三：文章标签
            // console.log(details);
            var bool=searchValue.some((elem2,i,arr)=>{ //变量所有查询关键词，任意一个满足就判断该文章true符合
              var reg=new RegExp(elem2,"i")
              var titleOK=title.search(reg)==-1 ? false : true;
              var detailsOK=details.search(reg)==-1 ? false : true;
              var tabsOK=tabs.search(reg)==-1 ? false : true;
              // console.log(`${titleOK}--${detailsOK}`)
              return titleOK || detailsOK || tabsOK; //三大条件任意一种满足当前关键字即可
            })
            return bool;
          })
          res.send({data:articles,IP:IPString});
        }
      }
  })
})

//功能三：文章点赞
server.get("/addLove",(req,res)=>{
  var IP=req.query.ip;
  var aid=req.query.aid;
  var sql=`SELECT * FROM doyoucan_article WHERE aid = ?`;
  pool.query(sql,[aid],(err,result)=>{
      if(err)throw err;
      var aloveSList=result[0].aloveS.split(",");
      aloveSList=aloveSList.filter((elem,i,arr)=>{//避免上一步【"".split(",")】→【[""]】
        return elem!==""
      })
      if(aloveSList.indexOf(IP)===-1){
        aloveSList.push(IP);
        var aloveS=aloveSList.join(",");
        var aloveN=aloveSList.length;
        pool.query("UPDATE doyoucan_article SET aloveN=?,aloveS=? WHERE aid=?",[aloveN,aloveS,aid],(err,result)=>{
          if(err)throw err;
          if(result.affectedRows>0){
            res.send("改变成功");
          }else{
            res.send("未作出改变");
          };
        })
      }else{
        res.send("未作出改变");
      }
  })
})

//功能四：编辑页面查询文章
server.get("/selectarticle",(req,res)=>{
  var aid = req.query.aid;
  var sql = `SELECT * FROM doyoucan_article WHERE aid = ?`;
  pool.query(sql,[aid],(err,result)=>{
      if(err)throw err;
      if(result.length==0){//情况一：数据库文章为空
        res.send({data:[]});
      }else{//情况二：正常情况查找到一篇匹配的aid文章
        res.send({data:[result[0]]});
      }
  })
})

//功能五：新增文章
server.post("/addarticle",(req,res)=>{
  var aimg=req.body.aimg;
  var atags=req.body.atags;
  var atitle=req.body.atitle;
  var adetails=req.body.adetails;
  var atime=req.body.atime;
  var uname=req.body.uname;
  var upwd=req.body.upwd;
  var sql1 = `SELECT * FROM doyoucan_user WHERE uname = ? AND upwd = ?`;
  pool.query(sql1,[uname,upwd],(err1,result1)=>{
      if(err1)throw err1;
      if(result1.length==0){//情况一：用户名或密码错误
        res.send({isTrue:false});
      }else{//情况二：用户名和密码匹配到正确的管理员账户，开始新建文章
        //开始新建文章
        var sql2=`INSERT INTO doyoucan_article VALUES(NULL,?,?,?,?,0,'',0,'',0,?,?)`;
        pool.query(sql2,[aimg,atags,atitle,adetails,result1[0].uid,atime],(err2,result2)=>{
            if(err2)throw err2;
            res.send({isTrue:true});
        })
      }
  })
})

//功能六：编辑文章
server.post("/updatearticle",(req,res)=>{
  var aid=req.body.aid;
  var aimg=req.body.aimg;
  var atags=req.body.atags;
  var atitle=req.body.atitle;
  var adetails=req.body.adetails;
  var atime=req.body.atime;
  var uname=req.body.uname;
  var upwd=req.body.upwd;
  var sql1 = `SELECT * FROM doyoucan_user WHERE uname = ? AND upwd = ?`;
  pool.query(sql1,[uname,upwd],(err1,result1)=>{
      if(err1)throw err1;
      if(result1.length==0){//情况一：用户名或密码错误
        res.send({isTrue:false});
      }else{//情况二：用户名和密码匹配到正确的管理员账户，开始编辑文章
        var sql2=`UPDATE doyoucan_article SET aimg=?,atags=?,atitle=?,adetails=?,uid=?,atime=? WHERE aid=?`;
        pool.query(sql2,[aimg,atags,atitle,adetails,result1[0].uid,atime,aid],(err2,result2)=>{
            if(err2)throw err2;
            if(result2.affectedRows>0){
              res.send({isTrue:true});
            }else{
              res.send({isTrue:false});
            };
        })
      }
  })
})

//功能七：删除文章
server.post("/delarticle",(req,res)=>{
  var aid=req.body.aid;
  var uname=req.body.uname;
  var upwd=req.body.upwd;
  var sql1 = `SELECT * FROM doyoucan_user WHERE uname = ? AND upwd = ?`;
  pool.query(sql1,[uname,upwd],(err1,result1)=>{
      if(err1)throw err1;
      if(result1.length==0){//情况一：用户名或密码错误
        res.send({isTrue:false});
      }else{//情况二：用户名和密码匹配到正确的管理员账户，删除文章以及相关评论留言
        //开始删除评论
        var sql2=`DELETE FROM doyoucan_comment WHERE aid=?`;
        pool.query(sql2,[aid],(err2,result2)=>{
            if(err2)throw err2;
            var sql3=`DELETE FROM doyoucan_article WHERE aid=?`;
            pool.query(sql3,[aid],(err3,result3)=>{
              if(err3)throw err3;
              if(result3.affectedRows>0){
                res.send({isTrue:true});
              }else{
                res.send({isTrue:false});
              };
            })
        })
      }
  })
})

//功能八：文章详情页查询
server.get("/getDeatils",(req,res)=>{
  var returnObject={};//最终返回的数据对象
  //一：获得IP
  function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress; //如非反向代理则是这一行起效果
  };
  var IPString=getClientIP(req);//【结果1】::ffff:123.203.107.57【结果2】::1
//   if(IPString!=="127.0.0.1"&&IPString.length>7){
//     IPString=IPString.substring(7);
//   }else{
//     IPString="127.0.0.1";
//   }
  returnObject.IPString=IPString;
  //二：可能的浏览量+1 & 查询文章主体
  var aid = req.query.aid;
  var sql1 = `SELECT * FROM doyoucan_article WHERE aid = ?`;
  pool.query(sql1,[aid],(err1,result1)=>{
    if(err1)throw err1;
    if(result1.length===1){
      var uid=result1[0].uid;
      var aviewN=result1[0].aviewN;
      var aviewS=result1[0].aviewS;
      returnObject.article=result1[0];
      if(aviewS.indexOf(IPString)==-1){//原先没有浏览过，需要+1
        ++aviewN;
        if(aviewS.length===0){
          aviewS=IPString;
        }else{
          aviewS=aviewS+","+IPString;
        }
        returnObject.article.aviewN=aviewN;
        returnObject.article.aviewS=aviewS;
        var sql2=`UPDATE doyoucan_article SET aviewN=?,aviewS=? WHERE aid=?`;
        pool.query(sql2,[aviewN,aviewS,aid],(err2,result2)=>{
            if(err2)throw err2;
        })
      }else{//原先浏览过，无需+1
        returnObject.article=result1[0];
      }
      // 三：查询文章最后修改管理员用户名
      var sql3=`SELECT * FROM doyoucan_user WHERE uid=?`;
      pool.query(sql3,[uid],(err3,result3)=>{
          if(err3)throw err3;
          if(result3.length===1){
            returnObject.user={};
            returnObject.user.uname=result3[0].uname;
            returnObject.user.uhead=result3[0].uhead;
            returnObject.isTrue=true;
            res.send(returnObject);
            // 返回对象returnObject{}
              // 参数1：isTrue       bool类型判断查询是否成功
              // 参数2：IPString     IP地址
              // 参数3：user         当前文章管理员基本信息
              // 参数4：article      当前文章下的主体内容
          }else{
            returnObject.isTrue=false;
            res.send(returnObject);
          }
      })
    }else{
      returnObject.isTrue=false;
      res.send(returnObject);
    }
  })
})

//功能九：查询评论
server.get("/selectcomment",(req,res)=>{
  //一：获得IP
  function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress; //如非反向代理则是这一行起效果
  };
  var IPString=getClientIP(req);//【结果1】::ffff:123.203.107.57【结果2】::1
//   if(IPString!=="127.0.0.1"&&IPString.length>7){
//     IPString=IPString.substring(7);
//   }else{
//     IPString="127.0.0.1";
//   }
  var aid = req.query.aid;//aid>0是对应文章页的评论，aid=0是给我留言页的评论
  var sql=`SELECT * FROM doyoucan_comment WHERE aid=? ORDER BY ctime DESC`;
  pool.query(sql,[aid],(err,result)=>{
    if(err)throw err;
    res.send({data:result,IP:IPString});
  })
})

//功能十：新增留言评论，并返回最新留言
server.post("/addComment",(req,res)=>{
  var aid=req.body.aid;
  var fcid=req.body.fcid;
  var fname=req.body.fname;
  var fscid=req.body.fscid;
  var ctime=req.body.ctime;
  var cname=req.body.cname;
  var caddress=req.body.caddress;
  var cdetails=req.body.cdetails;
  //一：新增doyoucan_comment表的评论
  var sql1=`INSERT INTO doyoucan_comment VALUES(NULL,?,?,?,?,?,?,?,0,"",?)`;
  pool.query(sql1,[aid,fcid,fname,fscid,ctime,cname,caddress,cdetails],(err1,result1)=>{
      if(err1)throw err1;
      //二：获得最新当前文章评论总数
      var sql2=`SELECT * FROM doyoucan_comment WHERE aid=?`;
      pool.query(sql2,[aid],(err2,result2)=>{
        if(err2)throw err2;
        var acomN=result2.length;
        //三：同步doyoucan_article表的当前文章评论数
        var sql3=`UPDATE doyoucan_article SET acomN=? WHERE aid=?`;//当然如果aid=0是的情况自然就查不到，也无需修改
        pool.query(sql3,[acomN,aid],(err3,result3)=>{
            if(err3)throw err3;
            //四：查询并返回最新评论
            var sql4=`SELECT * FROM doyoucan_comment WHERE aid=? ORDER BY ctime DESC`;
            pool.query(sql4,[aid],(err4,result4)=>{
              if(err4)throw err4;
              res.send(result4);
            })
        })
      })
  })
})

//功能十一：评论点赞&返回当前文章的所有评论
server.get("/addCommentLove",(req,res)=>{
  var IP=req.query.ip;
  var cid=req.query.cid;
  var aid=req.query.aid;
  //一：查询被点赞的当前评论
  var sql1=`SELECT * FROM doyoucan_comment WHERE cid = ?`;
  pool.query(sql1,[cid],(err1,result1)=>{
      if(err1)throw err1;
      if(result1.length===1){
        var cloveSList=result1[0].cloveS.split(",");
        cloveSList=cloveSList.filter((elem,i,arr)=>{//避免上一步【"".split(",")】→【[""]】
          return elem!==""
        })
        if(cloveSList.indexOf(IP)===-1){
          cloveSList.push(IP);
          var cloveS=cloveSList.join(",");
          var cloveN=cloveSList.length;
          // 二：修改被点赞的当前评论的数据
          var sql2=`UPDATE doyoucan_comment SET cloveN=?,cloveS=? WHERE cid=?`;
          pool.query(sql2,[cloveN,cloveS,cid],(err2,result2)=>{
            if(err2)throw err2;
            if(result2.affectedRows>0){
              //三：查询并返回最新评论
              var sql3=`SELECT * FROM doyoucan_comment WHERE aid=? ORDER BY ctime DESC`;
              pool.query(sql3,[aid],(err3,result3)=>{
                if(err3)throw err3;
                res.send({data:result3,isTrue:true});
              })
            }else{
              res.send({isTrue:false});
            };
          })
        }else{
          res.send({isTrue:false});
        };
      }else{
        res.send({isTrue:false});
      }
  })
})
