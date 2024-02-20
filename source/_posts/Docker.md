---
#文章标题
title: Docker
#文章创建日期
date: 2023-02-23 10:30:00
#文章更新日期
updated: 2023-04-13 10:30:00
#文章标签
tags: [Docker,Linux] 
#文章分类
categories: 
	- [Docker]
	- [技术栈]
#文章关键字
keywords: 
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:

---



# Docker常用命令



> ```
> docker run [OPTIONS] IMAGE [COMMOND] [ARGS...]
> ```
>
> ```
> --name="容器新名字": 为容器指定一个名称；
> -d: 后台运行容器，并返回容器ID，也即启动守护式容器；
> -i：以交互模式运行容器，通常与 -t 同时使用；
> -t：为容器重新分配一个伪输入终端，通常与 -i 同时使用；
> -P: 随机端口映射；
> -p: 指定端口映射，有以下四种格式
>       ip:hostPort:containerPort
>       ip::containerPort
>       hostPort:containerPort
>       containerPort
> -w: 指定命令执行时，所在的路径
> ```
>
>  
>

## 基础命令



systemctl start docker





docker version





docker pull zookeeper:3.6  /  docker pull zookeeper （latest）





docker images





docker save -o zookeeper.tar zookeeper:3.6



docker rmi zookeeper:3.6



docker load -i zookeeper.tar



## 容器相关命令



docker run --name nginx -p 80:80 -d nginx:latest



docker logs nginx  /  docker logs -f nginx



docker ps  /  docker ps -a



docker pause nginx



docker unpause nginx



docker stop nginx



docker start nginx



docker rm nginx  /  docker rm -f nginx



docker exec -it nginx bash



docker rename [旧容器名] [新容器名]



设置容器自动重启

参数：

```sh
--restart=always
```

​			no // 默认策略

​			no-failure // 在容器非正常退出时（退出状态非 0 ）才重新启动容器

​			no-failure // 在容器非正常退出时重启容器，最多重启 3 次

​			always // 无论退出状态如何，都重启容器

​			unless-stopped // 在容器退出时总书重启容器，但是不考虑在Docker守护进程启动时就已经停止了的容器

1. 在创建容器时设置

   ```sh
   docker run -d --restart=always -- name name
   ```

   

2. 修改已创建的容器

   ```sh
   docker update --restart=always name
   ```







## 网络管理

查看网络：docker network ls



查看网络详情：docker network inspect bridge 



创建自定义网络：docker network create name



运行容器时，加入到网络中，使用参数 --network=name



移除网络：docker network rm name





## 数据卷

> 数据卷的作用：将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230224142744932.png)



docker volume create html



docker volume ls



docker volume inspect html



docker volume rm html



 docker run --name mn -p 80:80 -v html:/usr/share/nginx/html -d nginx





## MySQL

```sh
docker pull mysql:5.7.16
```

设置了密码，挂载到 /usr/local/docker/mysql

mysql 8.0

```sh
docker run --name mysql \
    -e MYSQL_ROOT_PASSWORD=heroxin \
    -p 3306:3306 \
    -v /usr/local/docker/mysql/conf/hmy.cnf:/etc/mysql/conf.d/hmy.cnf \
    -v /usr/local/docker/mysql/data:/var/lib/mysql \
-d mysql:latest
```

mysql 5.7

```sh
docker run --name mysql-5.7 \
	-e MYSQL_ROOT_PASSWORD=12345 \
	-p 3306:3306 \
	-v /usr/local/docker/mysql-5.7/conf:/etc/mysql/conf.d \
	-v /usr/local/docker/mysql-5.7/logs:/logs \
	-v /usr/local/docker/mysql-5.7/data:/var/lib/mysql \
-d mysql:5.7
```



## ActiveMQ

```sh
docker pull webcenter/activemq
```

设置了用户名和密码，挂载到 /usr/local/docker/activemq

```sh
docker run --name='activemq' \
    -itd \
    -p 8161:8161 \
    -p 61616:61616 \
    -e ACTIVEMQ_ADMIN_LOGIN=heroxin \
    -e ACTIVEMQ_ADMIN_PASSWORD=heroxin \
    --restart=always \
    -v /usr/local/docker/activemq/data:/data/activemq \
    -v /usr/local/docker/activemq/log:/var/log/activemq \
webcenter/activemq:latest
```

## ElasticSearch

```sh
docker pull elasticsearch:7.12.1
```

```
docker pull kibana:7.12.1
```

```sh
docker network create es-net
```

指定jvm内存大小，挂载到数据卷，连接到 es-net

```sh
docker run -d \
	--name elasticsearch \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -v es-data:/usr/share/elasticsearch/data \
    -v es-plugins:/usr/share/elasticsearch/plugins \
    --privileged \
    --network es-net \
    -p 9200:9200 \
    -p 9300:9300 \
elasticsearch:7.12.1
```

```sh
docker run -d \
    --name kibana \
    -e ELASTICSEARCH_HOSTS=http://elasticsearch:9200 \
    --network=es-net \
    -p 5601:5601  \
kibana:7.12.1
```

## Redis

```sh
docker pull redis
```

```sh
docker run --name redis -p 6379:6379 -d redis redis-server --appendonly yes
```

## Nginx

先随便启动一个nginx

```sh
docker run -p 80:80 --name nginx -d nginx
```

创建挂载目录`/usr/local/docker/nginx`

```sh
# 创建挂载目录
mkdir -p /usr/local/docker/nginx/conf
mkdir -p /usr/local/docker/nginx/log
mkdir -p /usr/local/docker/nginx/html
mkdir -p /usr/local/docker/nginx/ssl/ce


docker cp nginx:/etc/nginx/nginx.conf /usr/local/docker/nginx/conf/nginx.conf
docker cp nginx:/etc/nginx/conf.d /usr/local/docker/nginx/conf/conf.d
docker cp nginx:/usr/share/nginx/html /usr/local/docker/nginx/

```

删除容器，重新创建容器

```sh
docker rm -f nginx
```

```sh
docker run -p 80:80 --name nginx --restart=always \
  -v /usr/local/docker/nginx/conf/nginx.conf/:/etc/nginx/nginx.conf \
  -v /usr/local/docker/nginx/conf/conf.d/:/etc/nginx/conf.d \
  -v /usr/local/docker/nginx/html/:/usr/share/nginx/html \
  -v /usr/local/docker/nginx/log/:/var/log/nginx \
  -v /usr/local/docker/nginx/ssl/cert/:/etc/nginx/cert 
  -d nginx:latest
```



## AList

```sh
docker run -d --restart=unless-stopped \
	-v /etc/alist:/usr/local/docker/alist/data \
	-p 5244:5244 \
	-e PUID=0 \
	-e PGID=0 \
	-e UMASK=022 \
	--name="alist" \
	xhofe/alist:latest
```

