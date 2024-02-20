---
#文章标题
title: SolrCloud
#文章创建日期
date: 2022-10-07 10:30:00
#文章更新日期
updated: 2022-10-07 10:30:00
#文章标签
tags: [Linux,Solr,分布式] 
#文章分类
categories: 
	- [分布式]
	- [技术栈]
#文章关键字
keywords: SolrCloud
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---
# SolrCloud

### 环境

> Linux：Centos7.9
>
> Jdk：[1.8.0_151](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/software/jdk-8u151-linux-x64.tar.gz)
>
> Solr：[4.10.3](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/software/solr-4.10.3.tgz.tgz)
>
> Tomcat：[7.0.47](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/software/apache-tomcat-7.0.47.tar.gz)
>
> Zookeeper：[3.4.6](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/software/zookeeper-3.4.6.tar.gz)

##### 前面：hhh

如果出现503，可以重启服务器，会有奇迹，不行的话，就回去检查，一般是代码写错了

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007165259861.png)

##### 准备zookeeper

1. 将`Solr` `Tomcat` `Zookeeper`上传至虚拟机，并解压 （`Jdk`自行安装）

2. 将`Zookeeper`复制三份到 `/usr/local/solrcloud`，并命名为`zookeeper01` `zookeeper02` ` zookeeper03`

   ```
   #创建文件夹
   [root@Heroxin005 ~]# mkdir /usr/local/solrcloud
   #复制文件到该目录
   [root@Heroxin005 ~]# cp -r zookeeper-3.4.6 /usr/local/solrcloud/zookeeper01
   [root@Heroxin005 ~]# cp -r zookeeper-3.4.6 /usr/local/solrcloud/zookeeper02
   [root@Heroxin005 ~]# cp -r zookeeper-3.4.6 /usr/local/solrcloud/zookeeper03
   ```

3. 在每个`zookeeper` 目录下创建文件夹`data` ，并在`data`目录中创建`myid`文件，其内容为`zookeeper`编号

   ```
   #创建文件夹
   [root@Heroxin005 zookeeper01]# mkdir data
   [root@Heroxin005 zookeeper01]# cd data/
   #创建文件
   [root@Heroxin005 data]# echo 1 >> myid
   
   #对zookeeper02和zookeeper03也进行相同操作
   ```

4. 修改每个`zookeeper`下的配置文件

   ```
   #复制一份 .cof
   [root@Heroxin005 zookeeper01]# cd conf/
   [root@Heroxin005 conf]# cp zoo_sample.cfg zoo.cfg
   #编辑配置文件
   [root@Heroxin005 conf]# vim zoo.cfg 
   
   #对另外两个zookeeper也进行该操作，注意端口号
   ```

   `zookeeper01`

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007150313625.png)

   `zookeeper02`

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007150648413.png)

   `zookeeper03`

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007150749035.png)

5. 启动服务

   ```
   [root@Heroxin005 solrcloud]# zookeeper01/bin/zkServer.sh start
   [root@Heroxin005 solrcloud]# zookeeper02/bin/zkServer.sh start
   [root@Heroxin005 solrcloud]# zookeeper03/bin/zkServer.sh start
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007151018193.png)

6. 查看状态，可以看到一个`leader`两个`follower`

   ```
   [root@Heroxin005 solrcloud]# zookeeper01/bin/zkServer.sh status
   [root@Heroxin005 solrcloud]# zookeeper02/bin/zkServer.sh status
   [root@Heroxin005 solrcloud]# zookeeper03/bin/zkServer.sh status
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007151250508.png)

##### 准备Tomcat

1. 将解压后的`Tomcat`复制四份到`/usr/local/tomcats`

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007151744422.png)

2. 修改端口

   ```
   [root@Heroxin005 tomcats]# vim tomcat8080/conf/server.xml
   
   #修改这三处的端口号，每一个tomcat的端口号递增就可
   #如tomcat8080：端口分别为8005，8080，8009
   #  tomcat8081：端口分别为8006，8081，8009
   ...
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007152259799.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007152327545.png)

   ![image-20221007152349936](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007152349936.png)

3. 将 `solr`中的`solr-4.10.3.war` 复制到每一个tomcat 的`webapps`下

   ```
   [root@Heroxin005 solr-4.10.3]# mv dist/solr-4.10.3.war /usr/local/tomcats/tomcat8080/webapps/solr.war
   
   ```

4. 开放tomcat端口

   ```
   [root@Heroxin005 ~]# firewall-cmd --add-port=8080/tcp --permanent
   [root@Heroxin005 ~]# firewall-cmd --add-port=8081/tcp --permanent
   [root@Heroxin005 ~]# firewall-cmd --add-port=8082/tcp --permanent
   [root@Heroxin005 ~]# firewall-cmd --add-port=8083/tcp --permanent
   [root@Heroxin005 ~]# systemctl restart firewalld.service 
   ```

5. 启动所有tomcat (用脚本启动吧，附件里有，记得加777权限)

   ```
   [root@Heroxin005 ~]# ./tomcat-startup.sh 
   ```

   可以访问到每一个tomcat

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007153832387.png)

6. 关闭tomcat后，删除之前每个tomcat中webapps下的 solr.war（此时可以在webapps目录下看到solr文件夹）

   ```
   [root@Heroxin005 ~]# ./tomcat-shutdown.sh 
   [root@Heroxin005 ~]# rm -rf /usr/local/tomcats/tomcat8080/webapps/solr.war 
   ```

7. 复制日志文件，到每个tomcat下

   ```
   [root@Heroxin005 solr-4.10.3]# cp example/lib/ext/* /usr/local/tomcats/tomcat8080/webapps/solr/WEB-INF/lib/
   ```

8. 创建solrhome，每一个solr都需要一个solrhome来存放文件

   ```
   [root@Heroxin005 solr-4.10.3]# cp -r example/solr /usr/local/tomcats/solrhome1
   [root@Heroxin005 solr-4.10.3]# cp -r example/solr /usr/local/tomcats/solrhome2
   [root@Heroxin005 solr-4.10.3]# cp -r example/solr /usr/local/tomcats/solrhome3
   [root@Heroxin005 solr-4.10.3]# cp -r example/solr /usr/local/tomcats/solrhome4
   
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007154826043.png)

9. 为每个solr指定它的solrhome

   ```
   [root@Heroxin005 tomcats]# vim tomcat8080/webapps/solr/WEB-INF/web.xml 
   #按下图，在配置文件中修改就好
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007154953067.png)

10. 启动tomcat，访问solr

    ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007155132412.png)

##### 搭建solr集群

1. 进入`solr-4.10.3/example/scripts/cloud-scripts`,上传solrhome配置

   ```
   [root@Heroxin005 cloud-scripts]# ./zkcli.sh -zkhost 192.168.196.105:2181,192.168.196.105:2182,192.168.196.105:2183 -cmd upconfig -confdir /usr/local/tomcats/solrhome1/collection1/conf -confname myconf
   ```

2. 进入`/usr/local/tomcats`，修改每个solrhome的solr.xml

   ```
   [root@Heroxin005 tomcats]# vim solrhome1/solr.xml 
   
   #为每个solr指定一个实例
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007170302812.png)

3. 为每个tomcat添加指定配置

   ```
   #进入目录
   [root@Heroxin005 ~]# cd /usr/local/tomcats
   #修改文件
   [root@Heroxin005 tomcats]# vim tomcat8080/bin/catalina.sh
   [root@Heroxin005 tomcats]# vim tomcat8081/bin/catalina.sh
   [root@Heroxin005 tomcats]# vim tomcat8082/bin/catalina.sh
   [root@Heroxin005 tomcats]# vim tomcat8083/bin/catalina.sh
   ```

   ```
   JAVA_OPTS="-DzkHost=192.168.196.105:2181,192.168.196.105:2182,192.168.196.105:2183"
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007164232507.png)

4. 访问任一solr，成功！

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007170528295.png)

5. 创建一个两片的collection，每片是一主一备

   ```
   #浏览器中输入
   http://192.168.196.105:8080/solr/admin/collections?action=CREATE&name=collection2&numShards=2&replicationFactor=2
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007170842671.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007170948548.png)

6. 删除collection1

   ```
   http://192.168.196.105:8080/solr/admin/collections?action=DELETE&name=collection1
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221007171230288.png)

