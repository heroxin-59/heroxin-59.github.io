---
# 布局模板
layout: post
# 文章作者
author: Heroxin
# 文章标题
title: Slf4j
# 文章标签
tags: [Slf4j,Java] 
# 文章分类
categories: 
	- [知识点]
# 是否生成目录 true/false
toc:
# 网页标题
seo_title:
# 文章标题(在group列表中显示)
short_title:
# 文章创建日期
date: 2024-04-11 10:30:00
# 文章更新日期
updated: 2024-04-11 10:30:00
# 是否参与归档 true/false
archive: 
# 是否显示评论 true/false
comment:
# 外部文章地址
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
# 页面侧边栏，不需要侧边栏：[]，指定侧边栏：[grid, toc, tags] 
sidebar:
# 页面主体元素
body:
# 缩略图 url
thumbnail:
# 标题右边显示的图标 [fas fa-fire red, fas fa-star green]，图标仅在归档页面中显示，可以用来标注热门文章。
# 图标可选颜色 red / blue / green / yellow / orange / theme / accent 
icons:
# 是否置顶 true/false
pin:
# 指定优先级 1-10
sticky: 
# 文章头图 url
headimg:
# 阅读更多按钮，默认在有摘要的情况下，会显示阅读更多按钮
readmore:
# 页面插件
plugins:
    
---

## 使用方法
通常在打印日志的使用 {% span red::LoggerFactory.getLogger %} 和 {% span red::@Slf4j %} 和两种方法

LoggerFactory：是slf4j框架下的一个工厂类，可以通过指定类命来创建 Logger 实例记录日志；

@Slf4j：是Lombok提供的一个注解，标注在类上，它会自动创建一个名为 log 的 Logger 实例；



两种方法生成的Logger实例对象一样，区别在于@Slf4j是自动生成的。

{% tabs Slf4j %}


<!-- tab Slf4j -->
```java
import lombok.extern.slf4j.Slf4j;
 
@Slf4j
public class Test {
    public void test() {
        log.info("This is a log message");
    }
}
```
<!-- endtab -->
<!-- tab LoggerFactory -->

```java
import lombok.extern.slf4j.Slf4j;
 
public class Test {
        public static final Logger log = LoggerFactory.getLogger(DynamicDataSourceContextHolder.class);

    public void test() {
        log.info("This is a log message");
    }
}
```
<!-- endtab -->
{% endtabs %}

## Slf4j有五个日志级别

```java
log.info("This is a log message");
log.debug("This is a log message");
log.error("This is a log message");
log.warn("This is a log message");
log.trace("This is a log message");
```

## 日志内容可以使用字符串拼接和占位符等方式

> String字符串拼接低层是使用StringBuilder的append方法，有一定的性能耗损
>
> 使用占位符仅仅是替换动作，可以有效提升性能

```java
log.info("This is a log {}", "message");
```

