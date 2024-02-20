---
#文章标题
title: Connection Failed
#文章创建日期
date: 2023-03-07 10:30:00
#文章更新日期
updated: 2023-03-07 10:30:00
#文章标签
tags: [Linux,Wrong] 
#文章分类
categories: 
	- [疑难杂症]
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








## 问题



Xshell 连接不到虚拟机，显示 **Connection faild**

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230308105905410.png)



但是之前可以连接，配置什么的也没动，防火墙也开放了



在虚拟机内查看 ens33 也发现没问题

```
vim /etc/sysconfig/network-scripts/ifcfg-ens33 
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230308110408855.png)



查看 ifconfg 时发现 ip 为 127.0.0.1 ，不对劲，应该是网卡出问题了

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230308105844632.png)

此时查看 network 状态，发现是 faild 

```+
systemctl status network
```

重启 network 报错：**Job for network.service failed because the  control process exited with error code. See "systemctl status  network.service" and "journalctl -xe" for details.**

## 原因



在CentOS系统上，有NetworkManager和network两种网络管理工具。如果两种都配置会引起冲突，而且NetworkManager在网络断开的时候，会清理路由，如果一些自定义的路由，没有加入到NetworkManager的配置文件中，路由就被清理掉，网络连接后需要自定义添加上去。



## 解决



- 关闭 NetworkManager 

  ```
  systemctl stop NetworkManager
  ```

- 重启网络

  ```
  systemctl restart network
  ```

  ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230308113758339.png)



查看IP，成功

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230308113932427.png)

连接虚拟机，成功

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230308113852226.png)