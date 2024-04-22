---
# 布局模板
layout: post
# 文章作者
author: Heroxin
# 文章标题
title: RabbitMQ高级特性
# 文章标签
tags: [RabbitMQ] 
# 文章分类
categories: 
	- [技术栈,消息队列]
# 是否生成目录 true/false
toc:
# 网页标题
seo_title:
# 文章标题(在group列表中显示)
short_title:
# 文章创建日期
date: 2024-04-17 10:30:00
# 文章更新日期
updated: 2024-04-17 10:30:00
# 外部文章网站
link:
# 内部音乐控件 
music:
# robots
robots:
# 文章关键字
keywords:
# 文章描述
description:
# 是否显示封面 true/false
cover:
# 是否显示文章或页面顶部的meta信息 true/false
top_meta:
# 是否显示文章或页面底部的meta信息 true/false
bottom_meta:
# 页面侧边栏
sidebar:
# 页面主体元素
body:
# 缩略图
thumbnail:
# 图标 []
icons:
# 是否置顶 true/false
pin:
# 指定优先级 1-10
sticky: 
# 文章头图 url
headimg:
# 阅读更多按钮
readmore:
---



> 1. 如何确保消息发送成功，被消费者接收？
> 2. 如何实现消息的延迟投递？
> 3. 如何解决数百万消息堆积，无法及时消费的问题？
> 4. 如何避免单点的MQ故障而导致的不可用问题？



<!-- more -->



## 消息可靠性

如何保证消息发送成功？

消息发送过程中，有三处地方会丢失消息

1. 消息未发送到交换机 -------> {% span red:: 消息确认 %}
2. 消息发送到交换机，但是未发送到队列 -------> {% span red:: 消息回退 %}
3. 队列接收到消息，未来得及处理消息就宕机 ------->

### 消息确认

发送消息时，需要为每个消息设置一个 id 

```properties
# 消息确认（消息发送到交换机后返回确认码）
spring.rabbitmq.publisher-confirm-type=correlated
```

publisher-confirm

- 消息发送到交换机，返回 ack
- 消息未发送到交换机，返回 nack

### 消息回退

消息发送到交换机，但是没有路由到队列。返回 ack 以及路由失败的原因

publisher-return

- 

```properties
# 消息回退（交换机发送消息到队列后返回确认码）
spring.rabbitmq.publisher-returns=true
```



消息回退后的处理方式

- true：调用ReturnCallback
- false：丢弃消息	

```properties
spring.rabbitmq.template.mandatory=false
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/6422ad8f7c5a4a07a62cb1063004c324.png)

## 延迟消息

## 消息堆积

## 高可用



> 参考文章：
>
> ​	[RabbitMQ高级特性](https://blog.csdn.net/qq_39249094/article/details/120881578)