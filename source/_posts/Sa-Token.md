---
# 布局模板
layout: post
# 文章作者
author: 
# 文章标题
title: Sa-Tocken
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
date: 2024-04-16 10:30:00
# 文章更新日期
updated: 2024-04-16 10:30:00
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
headimg: https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/Snipaste_2024-04-16_11-38-56.png
# 阅读更多按钮
readmore:
---

> Sa-Token 是一个轻量级 Java 权限认证框架，主要解决：登录认证、权限认证、单点登录、OAuth2.0、分布式Session会话、微服务网关鉴权 等一系列权限相关问题。
>
> Sa-Token 旨在以简单、优雅的方式完成系统的权限认证部分.



<!-- more -->



{% span red :: 访问官网：%}{% link Sa-Token :: https://sa-token.cc/index.html :: https://sa-token.cc/logo.png%}



## 导包

```xml
<!-- Sa-Token 权限认证，在线文档：https://sa-token.cc -->
<dependency>
    <groupId>cn.dev33</groupId>
    <artifactId>sa-token-spring-boot-starter</artifactId>
    <version>1.37.0</version>
</dependency>
```

## Yml

```yaml
server:
    # 端口
    port: 8081
    
############## Sa-Token 配置 (文档: https://sa-token.cc) ##############
sa-token: 
    # token 名称（同时也是 cookie 名称）
    token-name: satoken
    # token 有效期（单位：秒） 默认30天，-1 代表永久有效
    timeout: 2592000
    # token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
    active-timeout: -1
    # 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录）
    is-concurrent: true
    # 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个 token, 为 false 时每次登录新建一个 token）
    is-share: true
    # token 风格（默认可取值：uuid、simple-uuid、random-32、random-64、random-128、tik）
    token-style: uuid
    # 是否输出操作日志 
    is-log: true
```

## 测试类

```java
/**
 * 登录测试 
 */
@RestController
@RequestMapping("/acc/")
public class LoginController {

    // 测试登录  ---- http://localhost:8081/acc/doLogin?name=zhang&pwd=123456
    @RequestMapping("doLogin")
    public SaResult doLogin(String name, String pwd) {
        // 此处仅作模拟示例，真实项目需要从数据库中查询数据进行比对 
        if("zhang".equals(name) && "123456".equals(pwd)) {
            StpUtil.login(10001);
            return SaResult.ok("登录成功");
        }
        return SaResult.error("登录失败");
    }

    // 查询登录状态  ---- http://localhost:8081/acc/isLogin
    @RequestMapping("isLogin")
    public SaResult isLogin() {
        return SaResult.ok("是否登录：" + StpUtil.isLogin());
    }
    
    // 查询 Token 信息  ---- http://localhost:8081/acc/tokenInfo
    @RequestMapping("tokenInfo")
    public SaResult tokenInfo() {
        return SaResult.data(StpUtil.getTokenInfo());
    }
    
    // 测试注销  ---- http://localhost:8081/acc/logout
    @RequestMapping("logout")
    public SaResult logout() {
        StpUtil.logout();
        return SaResult.ok();
    }
    
}
```



## 注解鉴权

### 注册拦截器

```java
@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {
    // 注册 Sa-Token 拦截器，打开注解式鉴权功能 
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册 Sa-Token 拦截器，打开注解式鉴权功能 
        registry.addInterceptor(new SaInterceptor()).addPathPatterns("/**");    
    }
}

```

### 使用注解鉴权

```java
// 登录校验：只有登录之后才能进入该方法 
@SaCheckLogin                        
@RequestMapping("info")
public String info() {
    return "查询用户信息";
}

// 角色校验：必须具有指定角色才能进入该方法 
@SaCheckRole("super-admin")        
@RequestMapping("add")
public String add() {
    return "用户增加";
}

// 权限校验：必须具有指定权限才能进入该方法 
@SaCheckPermission("user-add")        
@RequestMapping("add")
public String add() {
    return "用户增加";
}

// 二级认证校验：必须二级认证之后才能进入该方法 
@SaCheckSafe()        
@RequestMapping("add")
public String add() {
    return "用户增加";
}

// Http Basic 校验：只有通过 Basic 认证后才能进入该方法 
@SaCheckBasic(account = "sa:123456")
@RequestMapping("add")
public String add() {
    return "用户增加";
}

// 校验当前账号是否被封禁 comment 服务，如果已被封禁会抛出异常，无法进入方法 
@SaCheckDisable("comment")                
@RequestMapping("send")
public String send() {
    return "查询用户信息";
}

```



## 路由拦截器

### 注册 Sa-Token 路由拦截器

{% tabs SaInterceptor %}
<!-- tab 方法一 -->

```java
@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {
    // 注册拦截器
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册 Sa-Token 拦截器，校验规则为 StpUtil.checkLogin() 登录校验。
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
                .addPathPatterns("/**")
                .excludePathPatterns("/user/doLogin"); 
    }
}
```

<!-- endtab -->
<!-- tab 方法二 -->

```java
@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册 Sa-Token 拦截器，定义详细认证规则 
        registry.addInterceptor(new SaInterceptor(handler -> {
            // 指定一条 match 规则
            SaRouter
                .match("/**")    // 拦截的 path 列表，可以写多个 */
                .notMatch("/user/doLogin")        // 排除掉的 path 列表，可以写多个 
                .check(r -> StpUtil.checkLogin());        // 要执行的校验动作，可以写完整的 lambda 表达式
                
            // 根据路由划分模块，不同模块不同鉴权 
            SaRouter.match("/user/**", r -> StpUtil.checkPermission("user"));
            SaRouter.match("/admin/**", r -> StpUtil.checkPermission("admin"));
            SaRouter.match("/goods/**", r -> StpUtil.checkPermission("goods"));
            SaRouter.match("/orders/**", r -> StpUtil.checkPermission("orders"));
            SaRouter.match("/notice/**", r -> StpUtil.checkPermission("notice"));
            SaRouter.match("/comment/**", r -> StpUtil.checkPermission("comment"));
        })).addPathPatterns("/**");
    }
}

```

<!-- endtab -->
{% endtabs %}