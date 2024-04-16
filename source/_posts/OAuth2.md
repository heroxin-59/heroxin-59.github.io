---
# 布局模板
layout: post
# 文章作者
author: Heroxin
# 文章标题
title: OAuth2
# 文章标签
tags: [OAuth2] 
# 文章分类
categories: 
	- [知识点,认证授权]
# 是否生成目录 true/false
toc:
# 网页标题
seo_title:
# 文章标题(在group列表中显示)
short_title:
# 文章创建日期
date: 2024-04-15 10:30:00
# 文章更新日期
updated: 2024-04-15 10:30:00
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

OAuth2是一种用于授权的开放标准，允许用户授权第三方应用程序访问其在其他服务提供商上存储的受保护资源，而无需共享其凭据（用户名和密码）。OAuth2在许多Web应用程序和移动应用程序中被广泛使用，以提供安全的身份验证和授权机制。

<!-- more -->



## OAuth2的核心概念包括以下几个角色：

1. **资源所有者（Resource Owner）：** 即用户，是资源的拥有者。用户可以授权第三方应用程序访问其受保护的资源。
2. **客户端（Client）：** 即第三方应用程序，需要访问用户的受保护资源。客户端通过OAuth2协议向授权服务器请求授权，并通过令牌来访问受保护的资源。
3. **授权服务器（Authorization Server）：** 负责验证用户身份并颁发访问令牌（Access Token）给客户端。授权服务器通常由服务提供商维护，用于处理用户的身份验证和授权请求。
4. **资源服务器（Resource Server）：** 存储受保护资源的服务器。资源服务器通过验证访问令牌来确定是否允许客户端访问受保护资源。



## OAuth2协议主要包括以下几种授权方式：

1. **授权码授权（Authorization Code）：** 
   - 客户端重定向用户到授权服务器，并请求授权。
   - 用户登录并授权客户端访问其受保护资源。
   - 授权服务器将授权码返回给客户端。
   - 客户端使用授权码向授权服务器请求访问令牌。
   - 授权服务器验证授权码，并返回访问令牌给客户端。
   - ![授权码模式](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/20191013151012592.png)
2. **密码授权（Password）：** 
   - 客户端直接使用资源所有者的用户名和密码向授权服务器请求访问令牌。
   - 授权服务器验证用户名和密码，并返回访问令牌给客户端。
   - 这种方式一般用于用户对客户端高度信任的情况，例如第一方应用程序。
3. **隐式授权（Implicit）：**
   - 客户端将用户重定向到授权服务器，并请求授权。
   - 用户登录并授权客户端访问其受保护资源。
   - 授权服务器直接将访问令牌返回给客户端，而不是授权码。
   - 客户端使用访问令牌来访问受保护资源。
4. **客户端凭证授权（Client Credentials）：** 
   - 客户端向授权服务器请求访问令牌，包含客户端ID和客户端秘钥。
   - 授权服务器验证客户端的身份，并颁发访问令牌给客户端。







## ACCESS_TOKEN（访问令牌）

`access_token` 是一种用于访问受保护资源的令牌，通常由授权服务器颁发给客户端。当客户端成功通过OAuth 2.0的授权流程获取到 `access_token` 后，就可以使用该令牌来访问用户的受保护资源。`access_token` 的有效期通常较短，一般情况下在几分钟到几小时之间，以提高安全性。

**作用：**

- 允许客户端访问受保护资源。
- 通常用于在HTTP请求的Authorization头中传递，或作为查询参数传递给资源服务器。

**特点：**

- 短暂性：`access_token` 的有效期通常较短，以减少泄露的风险。
- 无法刷新：`access_token` 一旦失效，就需要重新进行授权流程获取新的访问令牌。

## REFRESH_TOKEN（刷新令牌）

`refresh_token` 是一种用于获取新的 `access_token` 的凭证，通常由授权服务器颁发给客户端。与 `access_token` 不同，`refresh_token` 的有效期较长，可以用来定期刷新 `access_token`，以延长客户端访问受保护资源的能力。

**作用：**

- 允许客户端获取新的 `access_token`。
- 通常在 `access_token` 过期或失效时使用，用来更新令牌。

**特点：**

- 长期性：`refresh_token` 的有效期相对较长，通常比 `access_token` 更长。
- 安全性：由于 `refresh_token` 用于获取新的 `access_token`，因此需要妥善保管，以防止被非法获取和滥用。



> 1. access_token用于访问受保护的资源，refresh_token用于获取新的access_token
>
> 2. access_token的获取需要用户进行登录操作，加入refresh_token后可以定期刷新access_token，无需用户登录
>
> 3. access_token存活时间短，减少泄露风险
>
> 4. refresh_token可以降低系统对单一令牌的直接依赖，refresh_token可以定期刷新access_token，分散了系统安全风险
>
>    
>
>    ​	
>
>    ​		
>
>    参考文档：[【OAuth2】详细讲解](https://blog.csdn.net/Huang_Ds/article/details/125533523)