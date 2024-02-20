---
#文章标题
title: Maven锁定版本与版本常量
#文章创建日期
date: 2023-04-18 10:30:00
#文章更新日期
updated: 2023-04-18 10:30:00
#文章标签
tags: [Maven] 
#文章分类
categories: 
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





# Maven锁定版本与版本常量

今天在添加微服务模块是出现了个有趣的现象：

​	创建了多个微服务；

​	它们都引用同一个微服务--common；

​	在common中配置这些微服务的共同依赖；

​	common中使用锁定版本与版本常量的方式配置好了 spring cloud 、spring cloud alibaba；

​	在common中配置好 nacos

​	其他的微服务是通过 Spring Initializr 的方式生成的（没选择其他依赖），所以只有 springboot 的依赖

​	启动微服务，报错：nacos 和 spring cloud 版本不兼容。



纳尼？

版本不能出错，我之前使用过。



在微服务模块中加入 spring cloud 依赖，启动成功！

纳尼？？？



我不是在 common中配置好了吗？ 根据依赖传递，其他微服务中应该不用配置啊？





```xml
<dependencyManagement></dependencyManagement>
```

dependencyManagement 叫做版本锁定，是为了避免因依赖冲突而产生的路径声明、声明顺序等问题，它不会真正的导入依赖，只有在你导入依赖后，进行对应的版本锁定。



```xml
<properties></properties>
```

properties 叫做版本常量，在使用坐标时，对于同一个框架，引入多次时，它的版本信息就好多次出现，所以可以借用常量的思想，将这些版本号提取出来，在需要用到的地方，直接写版本常量名就可以了。

