---
#文章标题
title: InvalidDefinitionException
#文章创建日期
date: 2023-10-26 10:30:00
#文章更新日期
updated: 2023-10-26 10:30:00
#文章标签
tags: [] 
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

---

# 报错



com.fasterxml.jackson.databind.exc.InvalidDefinitionException



![](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20231026162750342.png)

# 解决



为报错类添加无参构造方法



![](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20231026163124933.png)

# 原因

源代码时要获取 Json 中的返回信息，也就是需要反序列化

**反序列化过程中，它的父类如果没有实现序列化接口，那么将需要提供无参构造函数**

而`RespBean`并没有实现`Serializable`接口

![](https://heroxin.oss-cn-beijing.aliyuncs.com/img/blog/image-20231026164052331.png)

## 参考

[java序列化与反序列化全讲解](https://blog.csdn.net/mocas_wang/article/details/107621010)

[com.fasterxml.jackson.databind.exc.InvalidDefinitionException]([com.fasterxml.jackson.databind.exc.InvalidDefinitionException-CSDN博客](https://blog.csdn.net/weixin_43091089/article/details/125201732))

