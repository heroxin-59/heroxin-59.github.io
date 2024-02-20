---
#文章标题
title: Gateway统一网关
#文章创建日期
date: 2023-02-01 10:30:00
#文章更新日期
updated: 2023-02-01 10:30:00
#文章标签
tags: [SpringCloud,SpringBoot,Gateway] 
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

# Gateway

## Gateway是什么

> Spring Cloud Gateway是Spring官方基于Spring 5.0，Spring Boot 2.0和Project Reactor等技术开发的网关，Spring Cloud Gateway旨在为微服务架构提供一种简单而有效的统一的API路由管理方式。Spring Cloud Gateway作为Spring Cloud生态系中的网关，目标是替代ZUUL，其不仅提供统一的路由方式，并且基于Filter链的方式提供了网关基本的功能，例如：安全，监控/埋点，和限流等。

<u>**简单来说就是用于处理前来访问服务的每一个请求。可以对这些请求做出身份认证和权限校验，服务路由，负载均衡，请求限流等操作**</u>

- 服务路由：将请求发往具体的服务
- 负载均衡：每个服务都有多个实例，从中挑一个实例 
- 请求限流：限制请求数量
- 断言：表示为一些布尔表达式，用于判断；路由断言即为判断路由请求是否合规

![image-20230201110256858](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230201110256858.png)



## SpringCloudGatew搭建

### 引入module

​	SpringCloudGateway的依赖和Nacos的服务发现依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
</dependencies>
```



### 创建启动器

```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class,args);
    }
}
```



### 配置gateway与nacos

```yaml
server:
  port: 10010 #网关端口
spring:
  application:
    name: gateway # 服务器名称
  cloud:
    nacos:
        server-addr: localhost:8848 # nacos地址
    gateway:
        routes: # 网关路由配置
          - id: user-service #路由 id ，自定义，只要唯一即可
#            路由目标地址，http是固定地址，lb是负载均衡，后面跟服务名称
#            uri：http://127.0.0.1
            uri: lb://userservice
            predicates: # 路由断言，判断请求是否符合路由规则的条件
              - Path=/user/** # 按照路径匹配，只要以 /user/ 开头就符合要求
          - id: order-service
            uri:lb//orderservice
            predicates:
              - Path=/order/**
```

