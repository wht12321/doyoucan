SET NAMES UTF8;
DROP DATABASE IF EXISTS doyoucan;
CREATE DATABASE doyoucan CHARSET=UTF8;
USE doyoucan;
/*数据表创建*/
/*doyoucan_user用户表，包含可操作权限的用户*/
CREATE TABLE doyoucan_user(
    uid      INT PRIMARY KEY AUTO_INCREMENT,    #用户的ID，为用户的唯一标识，NULL自动生成
    uname    varchar(20),                       #用户名，不可重复，具有唯一性，注册时需要进行判断
    upwd     varchar(20),                       #密码
    uhead    varchar(500)                       #头像图片路径
);

/*doyoucan_article文章集*/
CREATE TABLE doyoucan_article(
    aid      INT PRIMARY KEY AUTO_INCREMENT,    #文章的ID，为文章的唯一标识，NULL自动生成
    aimg     varchar(500),                      #文章封面路径
    atags    varchar(500),                      #文章标签【中文，分隔】
    atitle   varchar(100),                      #文章标题
    adetails longtext,                          #文章内容
    aviewN   INT,                               #文章浏览次数
    aviewS   longtext,                          #文章浏览IP们
    aloveN   INT,                               #文章喜欢次数
    aloveS   longtext,                          #文章喜欢IP们
    acomN    INT,                               #文章评论次数
    uid      INT,                               #文章最后编辑用户ID
    atime    bigint                             #文章最近编辑时间
);

/*doyoucan_comment留言回复*/
CREATE TABLE doyoucan_comment(
    cid      INT PRIMARY KEY AUTO_INCREMENT,    #评论ID为评论的唯一标识符，NULL自动生成
    aid      INT,                               #评论归属于的文章ID，在“给我留言”页面的则没有归属为0
    fcid     INT,                               #评论归属于的上一级评论ID，若属于一级留言则没有归属为0
    fname    varchar(20),                       #评论归属于的上一级评论发布人名称
    fscid    INT,                               #评论归属于的一级评论ID，若属于一级留言则没有归属为0
    ctime    bigint,                            #评论发布时间
    cname    varchar(20),                       #评论发布人名称，无需唯一，没有标识意义，但不可为空
    caddress varchar(100),                      #评论发布人IP地址解析后的粗略中文地址
    cloveN   INT,                               #评论点赞次数
    cloveS   longtext,                          #评论点赞IP们
    cdetails longtext                           #评论内容
);


/*数据插入*/
/*doyoucan_user用户表*/
INSERT INTO doyoucan_user VALUES(1,"深井烈阳","wht85144829","http://www.doyoucan.com/nodejs_hou/public/header_image/1.jpg");

/*doyoucan_article文章集*/
INSERT INTO doyoucan_article VALUES(1,"http://www.doyoucan.com/nodejs_hou/public/image/cs1.jpg","美丽，Nodejs，mySql，JavaScript，doyoucan","测试长标题，为什么说是长标题呢？因为这个标题长啊，为什么呢？因为要省略啊，嘿嘿","%3Cp%3E%E5%B1%85%3Cspan%20style%3D%22color%3A%20rgb(249%2C%20150%2C%2059)%3B%22%3E%E4%B8%AD%2B-*%E3%80%81%5C%2F%3C%2Fspan%3E%3C%2Fp%3E",2,"127.0.0.1,192.618.263.13",0,"",4,1,1577863087000);
INSERT INTO doyoucan_article VALUES(2,"http://www.doyoucan.com/nodejs_hou/public/image/cs2.jpg","深井烈阳，doyoucan，mysql","正常标题呜啦啦啦啦~","%3Cp%3E%3Cspan%20style%3D%22background-color%3A%20rgb(77%2C%20128%2C%20191)%3B%22%3E%E6%B5%8B%E8%AF%95%E7%BB%A7%E6%89%BF%E6%A0%B7%E5%BC%8F%3C%2Fspan%3E%3C%2Fp%3E",0,"",2,"127.0.0.1,192.618.263.13",1,1,1583375405000);
INSERT INTO doyoucan_article VALUES(3,"http://www.doyoucan.com/nodejs_hou/public/image/cs3.jpg","nodejs，MYSQL，Javascript，ID，数据库，code，vscode，vue，angular，typescript，React，vant，响应式布局","标题在此","%3Cp%3E%3Cimg%20src%3D%22https%3A%2F%2Fwww.doyoucan.com%2Fnodejs_hou%2Fpublic%2Fimage%2F1590134623412_chicken.jpg%22%20style%3D%22max-width%3A30%25%3B%22%3E%3Cbr%3E%3C%2Fp%3E",1,"115.193.185.13",2,"173.16.186.5,115.193.185.13",0,1,1590135440000);

/*doyoucan_comment留言回复*/
INSERT INTO doyoucan_comment VALUES(1,1,0,"",0,1577863087000,"深井烈阳","浙江省杭州市西湖区",2,"173.16.186.5,115.193.185.13","呜啦啦啦啦~");
INSERT INTO doyoucan_comment VALUES(2,1,1,"深井烈阳",1,1577899986000,"江南才子","浙江省杭州市江干区",2,"127.0.0.1,192.618.263.13","测试留言不要介意");
INSERT INTO doyoucan_comment VALUES(3,1,2,"江南才子",1,1578984654000,"笔墨餐盆","浙江省杭州市拱墅区",0,"","头疼了。。。");
INSERT INTO doyoucan_comment VALUES(4,1,1,"深井烈阳",1,1590546534000,"深井烈阳","浙江省杭州市西湖区",1,"192.618.263.13","最怕假数据了");
INSERT INTO doyoucan_comment VALUES(5,2,0,"",0,1576513478000,"呼哒朦朦","浙江省富阳市",0,"","老实说也是假数据");
INSERT INTO doyoucan_comment VALUES(6,0,0,"",0,1579876543000,"约德尔上校","浙江省绍兴市",0,"","内容不能为空，嘿嘿");