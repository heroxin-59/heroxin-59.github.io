---
#文章标题
title: Docker Registry
#文章创建日期
date: 2023-05-30 10:30:00
#文章更新日期
updated: 2023-05-30 10:30:00
#文章标签
tags: [Docker] 
#文章分类
categories: 
	- [Docker]
	- [安装手册]
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

# Docker Registry 本地私有仓库配置

## 查询本机IP

```shell
ifconfig
```

## 生成自签名证书

要确保DockerRegistry本地镜像仓库的安全信，还需要一个安全认证证书，来保证其他Docker机器不能随意访问该机器上的本地镜像仓库。（如果已购买证书，就不需要生成了）

```shell
mkdir /usr/local/docker/registry
mkdir /usr/local/docker/registry/certs
cd /usr/local/docker/registry/certs/
```

```shell
openssl req -x509 -days 3560 -subj '/CN=192.168.196.101:5000/' -nodes -newkey rsa:2048 -keyout domain.key -out domain.crt
```

> - -x509：是一个自签发证书的格式
> - -days 3650：证书的有效时间
> - 192.168.196.101:5000：仓库的地址和端口
> - rsa:2048：证书算法长度
> - domain.key和domain.crt：生成的证书文件



![](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20230530194542601.png)

## 生成用户名和密码

```shell
mkdir /usr/local/docker/registry/auth
```

```shell
yum install -y httpd-tools
```

```shell
htpasswd -Bbn heroxin   > /usr/local/docker/registry/auth/htpasswd
```

## 启动Docker Registry 本地镜像仓库服务

```shell
docker run -d \
	-p 5000:5000 \
	--restart=always \
	--name registry \
	-v /usr/local/docker/registry:/var/lib/registry \
	-v /usr/local/docker/registry/auth:/auth \
	-e "REGISTRY_AUTH=htpasswd" \
	-e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
	-e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
	-v /usr/local/docker/registry/certs:/certs \
	-e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
	-e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
	registry:2
```

## 配置Docker Registry 访问接口

```shell
mkdir -p /etc/docker/certs.d/192.168.196.101:5000
cp /usr/local/docker/registry/certs/domain.crt /etc/docker/certs.d/192.168.196.101\:5000/
```

## Docker Registry 私有仓库使用登记

```shell
vim /etc/docker/daemon.json
```

```json
{
  "registry-mirrors": ["https://sdo6tk7g.mirror.aliyuncs.com"],"insecure-registries": ["192.168.196.101:5000"]
}

```

## 重启

```shell
systemctl daemon-reload 
systemctl restart docker
```

## 准备镜像文件

```shell
docker tag tomcat:latest 192.168.196.101:5000/mytomca
```

## 登录

```
docker login 192.168.196.101:5000
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20230531090428080.png)

## 推送

```
docker push 192.168.196.101:5000/mytomcat
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20230531090636807.png)

## 查看 DockerRegistry 仓库推送的文件

```shell
ll /usr/local/docker/registry/docker/registry/v2/repositories/
```

![image-20230531091157912](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20230531091157912.png)