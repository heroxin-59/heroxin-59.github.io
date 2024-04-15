---
# 布局模板
layout: post
# 文章作者
author: Heroxin
# 文章标题
title: WebSocket
# 文章标签
tags: [WebSocket] 
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
date: 2024-04-10 10:30:00
# 文章更新日期
updated: 2024-04-10 10:30:00
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


## WebSocket

> WebSocket 一次握手就可以使客户端和服务端建立长连接，并进行双向数据传输。
>
> 由于其双向传输特性，服务端可主动向客户端发送信息，实时性很高。
>
> 而与 HTTP 协议比起来 WebSocket 协议每次数据传输的头信息都较小，节约带宽。
>
> 在获取实时数据这方面时，那是比 ajax 轮询方式高到不知道哪去了。

## 事件

1. `@OnOpen`：当一个 WebSocket 连接成功时触发；
2. `@OnClose`：当一个 WebSocket 连接被关闭时触发；
3. `@OnError`：当一个 WebSocket 连接因错误而关闭时触发；
4. `@OnMessage`：当通过 WebSocket 收到数据时触发；



## 导包

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```



## 配置ws服务

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
public class WSConfig {
    //启动ws服务
    @Bean
    public ServerEndpointExporter getWebSocketServer() throws Exception {
        return new ServerEndpointExporter();
    }
}

```



## 配置服务

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// 该注解可以将类定义成一个WebSocket服务器端
@ServerEndpoint("/{name}")
@Component
public class LuckySheetWebSocketServer {
    //存储连接及昵称
    static final Map<Session, String> connMap = new ConcurrentHashMap<>();

    private String name;

    @OnOpen
    public void onOpen(Session conn) {
       
    }

    @OnClose
    public void onClose(Session conn) {
    }

    @OnMessage
    public void onMessage(String message, Session conn) {
        if (null != message && message.length() != 0) {
        }
    }

    @OnError
    public void onError(Session conn, Throwable ex) {
        log.warn("链接错误", ex);
        try {
            conn.close();
        } catch (IOException e) {
            log.error("错误链接关闭失败", e);
        }
    }
     /**
     * 指定发消息
     *
     * @param message
     */
    public void sendMessage(String message) {
        try {
            this.session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    /**
     * 群发消息
     *
     * @param message
     */
    public static void fanoutMessage(String message) {
        SESSIONS.forEach(ws -> ws.sendMessage(message));
    }

}

```

