---
# 布局模板
layout: post
# 文章作者
author: Heroxin
# 文章标题
title: Login
# 文章标签
tags: [Java] 
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
date: 2024-04-05 10:30:00
# 文章更新日期
updated: 2024-04-05 10:30:00
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


用户登录



1. 用户提交登录信息（用户名、密码、验证码、UUID）

2. 验证码校验

   - 验证码功能是否开启

   - 验证码是否存在缓存当中（“captcha_codes:”+UUID）

     ```java
     String verifyKey = CacheConstants.CAPTCHA_CODE_KEY + StringUtils.nvl(uuid, "");
     String captcha = redisCache.getCacheObject(verifyKey);
     redisCache.deleteObject(verifyKey);
     ```

     

     - false：验证码过期

       ```java
       if (captcha == null) {
           AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.expire")));
           throw new CaptchaExpireException();
       }
       ```

       

     - true：验证码是否一致

       ```java
       if (!code.equalsIgnoreCase(captcha)) {
           AsyncManager.me().execute(AsyncFactory.recordLogininfor(username, Constants.LOGIN_FAIL, MessageUtils.message("user.jcaptcha.error")));
           throw new CaptchaException();
       }
       ```

       

