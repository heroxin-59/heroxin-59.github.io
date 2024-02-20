---
#文章标题
title: Dubbo注册中心
#文章创建日期
date: 2022-10-18 10:30:00
#文章更新日期
updated: 2022-10-18 10:30:00
#文章标签
tags: [Dubbo,分布式] 
#文章分类
categories: 
	- [分布式]
	- [技术栈]
#文章关键字
keywords: Dubbo
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---

### 引入

#### 分布式系统

​	分布式系统是若干独立计算机的集合，这些计算机对于用户来说就像单个相关系统

#### 架构演变

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018165231960.png)

1. 单一应用架构

   > 当网站流量很小时，只需一个应用，将所有功能都部署在一起，以减少部署节点和成本。此时，用于简化增删改查工作量的数据访问框架(ORM)是关键。

   大致就是将所有的逻辑和业务写在同一个项目中 一般网站流量小 并且只需要一个应用 将所有代码部署在一起 可以减少开发、部署、运维的成本

   缺点：

   - 性能扩展难
   - 协同开发难
   - 升级维护难

2. 垂直应用架构

   > 当访问量逐渐增大，单一应用增加机器带来的加速度越来越小，将应用拆成互不相干的几个应用，以提升效率。此时，用于加速前端页面开发的 Web框架(MVC) 是关键。

   就是将单体架构拆分为多个互不相干的应用 大大提升了效率 

   缺点：

   - 公共模块无法重复利用，开发性浪费

   ![image-20221018170002760](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018170002760.png)

3. 分布式服务架构

   > 当垂直应用越来越多，应用之间交互不可避免，将核心业务抽取出来，作为独立的服务，逐渐形成稳定的服务中心，使前端应用能更快速的响应多变的市场需求。此时，用于提高业务复用及整合的**分布式服务框架(RPC)**是关键。

   ![image-20221018170549762](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018170549762.png)

   

4. 流动式计算框架

   > 当服务越来越多，容量的评估，小服务资源的浪费等问题逐渐显现，此时需增加一个调度中心基于访问压力实时管理集群容量，提高集群利用率。此时，用于提高机器利用率的资源调度和治理中心**(SOA)[ Service Oriented Architecture]**是关键。

![image-20221018170643342](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018170643342.png)

#### RPC

> RPC【Remote Procedure Call】是指==远程过程调用==，是一种进程间通信方式，他是一种技术的思想，而不是规范。它允许程序调用另一个地址空间（通常是共享网络的另一台机器上）的过程或函数，而不用程序员显式编码这个远程调用的细节。即程序员无论是调用本地的还是远程的函数，本质上编写的调用代码基本相同。

两个核心模块：通讯，序列化

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018170750291.png)

### Dubbo

> 是一款高性能、轻量级的开源Java RPC框架，它提供了三大核心能力：面向接口的远程方法调用，智能容错和负载均衡，以及服务自动注册和发现。
>
> [Apache Dubbo](https://dubbo.apache.org/zh/)
>
> ![image-20221018170946124](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018170946124.png)

- 服务提供者provider：暴露服务的提供方，服务提供者在启动时，向注册中心提供自己的服务
- 服务消费者consumer：调用远程服务的服务消费方，服务消费者在启动时，向注册中心订阅自己所需的服务，服务消费者，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。
- 注册中心registry：注册中心返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者
- 监控中心monitor：服务消费者和提供者，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心

#### zookeeper

​	参考之前的文章，配个单机版就可以

#### dubbo-admin

1. 在`dubbo-admin-develop`目录下cmd

   ```
   mvn clean package
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018193507246.png)

2. 在`dubbo-admin-develop\dubbo-admin-distribution\target`下运行jar包

   ```
   java -jar ./dubbo-admin-0.1.jar
   ```

   ![image-20221018193634644](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018193634644.png)

3. 在`dubbo-admin-develop\dubbo-admin-ui`目录下cmd

   ```
   npm run dev
   ```

   ![image-20221018193800389](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018193800389.png)

4. 浏览器访问 ，==root/root==

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221018193925430.png)

   

   

#### dubbo-monitor

1. 在`incubator-dubbo-ops-master`目录下cmd

   ```
   mvn clean package
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221019144043179.png)

2. 在`incubator-dubbo-ops-master\dubbo-monitor-simple\target`目录下解压`dubbo-monitor-simple-2.0.0-assembly.tar.gz`

3. 运行`dubbo-monitor-simple-2.0.0\assembly.bin`中的==start.bat==

4. 浏览器访问==localhost:8080==

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221019144439402.png)

