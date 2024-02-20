---
#文章标题
title: Public Key Retrieval is not allowed
#文章创建日期
date: 2022-11-30 10:30:00
#文章更新日期
updated: 2022-11-30 10:30:00
#文章标签
tags: [Wrong,MySql] 
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



# Public Key Retrieval is not allowed

## 报错



java.sql.SQLNonTransientConnectionException: Public Key Retrieval is not allowed



## 解决



url: jdbc:mysql://localhost:3306/cloud_order?useSSL=false&allowPublicKeyRetrieval=true

