---
#文章标题
title: Nginx
#文章创建日期
date: 2022-09-05 10:30:00
#文章更新日期
updated: 2022-09-05 10:30:00
#文章标签
tags: [Nginx,分布式] 
#文章分类
categories: 
	- [分布式]
	- [技术栈]
#文章关键字
keywords: Nginx
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---
# Nginx

> 提到Nginx，首先想到的就是**负载均衡**和**反向代理**啥的。
>
> 也不明白这是啥意思，今天来学学



### 简介

​		Nginx 是高性能的 HTTP 和反向代理的服务器，处理高并发能力是十分强大的，同时也提供了IMAP/POP3/SMTP服务， 能经受高负载的考验。

1. ###### 正向代理

   - 所谓正向代理就是内网服务器主动要去请求外网的地址或服务，所进行的一种行为。
   - 例如在大陆访问不到谷歌，但可以通过设置代理服务器来访问，这个过程就叫正向代理
   - 内网服务---访问--->外网

   - Nginx的正向代理，只能代理Http、Tcp等，不能代理Https请求。

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220905094703570.png)

2. ###### 反向代理

   - 所谓反向代理就是外网要访问内网服务而进行的一种行为。

   - 反向代理，其实客户端对代理是无感知的，因为客户端不需要任何配置就可以访问，我们只
     需要将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据后，再返
     回给客户端，此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器
     地址，隐藏了真实服务器 IP 地址(8001,8002)。

   -  外网----请求--->内网服务

     ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220905095140747.png)

3. ###### 负载均衡

   - 增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器上的
     情况改为将请求分发到多个服务器上，将负载分发到不同的服务器。

   - 分摊压力,轮询算法

     ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220905095324756.png)

4. ###### 动静分离

   - 为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器来解析，加快解析速
     度。降低原来单个服务器的压力。
   
     
   
     ![1](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220905095447122.png)

### Nginx安装

> [Nginx1.12.2](https://nginx.org/en/download.html) 

1. `gcc-c++`

   ```
   yum -y install gcc-c++
   ```

2. `pcre`

   ```
   yum -y install pcre pcre-devel
   ```

3. `zlib`

   ```
   yum -y install zlib zlib-devel
   ```

2. `openssl`

   ```
   yum -y install openssl openssl-devel
   ```

5. Nginx解压到 `Software`后，进入`nginx-1.12.2`目录进行检测，编译，安装

   ```
   ./configurel'l
   make && make install
   ```

6. 安装成功后会在 `/usr/local/nginx/sbin/`下生成`nginx`的启动脚本

7. 进入 `sbin`目录后执行脚本

   ```
   ./nginx
   ```

8. 查看进程，`nginx`正在运行

   ```
   ps -ef |grep nginx
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220905202809895.png)

9. 防火墙添加`nginx`端口

   ```
   firewall-cmd --add-port=80/tcp --permanent
   firewall-cmd --reload
   ```

   

10. 打开浏览器，在地址栏输入你服务器的 IP 地址，成功访问。(如果失败，请检查防火墙或者端口)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220905203203568.png)

### Nginx命令

1. 将`nginx`添加到环境变量中，这样以后启动`nginx`就不必去`sbin`目录了

   ```
   # 源文件目录，环境变量目录
   ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/
   ```

2. 查看版本号

   ```
   nginx -v
   ```

3. 启动

   ```
   nginx
   ```

4. 关闭

   ```
   nginx -s stop
   ```

5. 重载

   ```
   nginx -s reload
   ```

### 配置实例--反向代理01

1. 安装并启动tomcat

   ```
   cd /usr/Software/apache-tomcat-8.5.82/bin/
   ./startup.sh 
   ```

2. 防火墙开放8080端口

   ```
   firewall-cmd --list-all
   firewall-cmd --add-port=8080/tcp --permanent
   systemctl restart firewalld
   ```

3. 浏览器输入 IP:8080,成功访问Tomcat

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220906092255682.png)

4. 在windows的host文件里配置域名映射的ip地址(C:\Windows\System32\drivers\etc\host)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907104219772.png)

5. `nginx`中配置反向代理，在配置文件中做如下修改

   ```
   #目录
   /usr/local/nginx/conf/nginx.conf
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907103910353.png)
   
6. 重载 `nginx`

   ```
   nginx -s reload
   ```

7. 在浏览器中输入之前定义的域名，成功访问到服务器的Tomcat，暴露的是Nginx服务器的IP，隐藏Tomcat的IP

   (如果不成功，报 `HTTP ERROR 502`,建议多次重启电脑和服务器)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907105015261.png)

### 配置实例--反向代理02

> 实现效果：
>
> ​	使用 Nginx 反向代理，根据访问的路径跳转到不同端口的服务器当中
>
> ​	Nginx 监听端口为 9001
>
> ​	访问 http://192.168.196.101:9001/hero/ 跳转到 127.0.0.1:8080
>
> ​	访问 http://192.168.196.101:9001/xin/    跳转到 127.0.0.1:8081

1. 准备两个 Tomcat ，端口为 8080，8081 (配置文件目录：/conf/server.xml，记得防火墙开放端口)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907112334658.png)

2. 创建访问文件，可以正常访问

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907114044167.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907114127632.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907150132547.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907150037381.png)

3. 配置`nginx`配置文件，在原有 server 下方添加即可(顺便防火墙开放 9001 端口)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907115243747.png)

4. 访问成功！！

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907120007997.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907120101185.png)

### 配置实例--负载均衡

> 轮询算法：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除
>
> 权重：weight代表权重，默认为 1, 权重越高被分配的客户端越多
>
> ip_hash：每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题
>
> fair：按后端服务器的响应时间来分配请求，响应时间短的优先分配。

1. 准备两个Tomcat，都有`/webapp/heroxin/a.html`（电脑较渣，就用同一个服务器，开两个Tomcat来模拟）

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907151107707.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907151154459.png)

2. `nginx`配置文件中做如下修改

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907152947509.png)

3. 访问成功! 刷新浏览器，会显示不同的内容，说明负载均衡起作用，每个服务器都轮流访问一次

   (如果没有变化，可以先清除浏览器缓存试试)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907152409251.png)

   ![image-20220907152440914](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907152440914.png)

### 配置实例--动静分离

1. 在根目录创建访问资源

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907164741712.png)

2. 修改`nginx`配置文件，添加如下内容即可

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907160336452.png)

3. 访问成功！

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907165400479.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220907165452604.png)

### 完结撒花

​	这次学习包括Nginx基本概念和配置实例，总不算是一头雾水了。

​	还不够。

​	Nginx更高端的操作或者运行原理以后更新吧。



