---
#文章标题
title: Http客户端Feign
#文章创建日期
date: 2022-11-30 10:30:00
#文章更新日期
updated: 2022-11-30 10:30:00
#文章标签
tags: [SpringCloud,SpringBoot,Feign] 
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

# Http客户端Feign

## 介绍

> Feign 是 Netflix 开发的声明式、模板化的HTTP客户端， Feign可以帮助我们更快捷、优雅地调用HTTP API。
>
> Spring Cloud Feign帮助我们定义和实现依赖服务接口的定义。在Spring Cloud feign的实现下，只需要创建一个接口并用注解方式配置它，即可完成服务提供方的接口绑定，简化了在使用Spring Cloud Ribbon时自行封装服务调用客户端的开发量。
>
> Spring Cloud对Feign进行了增强，使Feign支持了Spring MVC注解，并整合了Ribbon和Eureka，从而让Feign的使用更加方便。



## 使用

### 引入依赖

```xml
<!-- feign客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

### 启动类添加注解开启Feign的功能



@EnableFeignClients



![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221130090618989.png)

### 编写Feign客户端

```java
// 指定服务名称
@FeignClient("userServer")
public interface UserClient {

//    请求方法和请求路径
    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```



如果出现依赖注入失败，可以在启动类上添加配置，指定所要扫描的客户端

@EnableFeignClients(clients = {UserClient.class}）



### 用Feign客户端代替RestTemplate

```java
@Autowired
private UserClient userClient;
@Override
public Order queryOrderById(Long orderId) {
    // 1.查询订单
    Order order = orderMapper.findById(orderId);
    // 2. 利用RestTemplate发起http请求，查询用户
    // String url = "http://userServer/user/" + order.getUserId();
    // User user = restTemplate.getForObject(url, User.class);
    // 2. 利用 Feign发起 http请求，查询用户
    User user = userClient.findById(order.getUserId());
    // 3. 封装user到order
    order.setUser(user);
    // 4.返回
    return order;
}
```



## Feign的配置



从Feign优化的角度考虑，Feign一般只对日志进行配置，且只配置为NONE或BASIC



| 类型                | 作用             | 说明                                                   |
| ------------------- | ---------------- | ------------------------------------------------------ |
| feign.Logger.Level  | 修改日志级别     | 包含四种不同的级别：NONE、BASIC、HEADERS、FULL         |
| feign.codec.Decoder | 响应结果的解析器 | http远程调用的结果做解析，例如解析json字符串为java对象 |
| feign.codec.Encoder | 请求参数编码     | 将请求参数编码，便于通过http请求发送                   |
| feign. Contract     | 支持的注解格式   | 默认是SpringMVC的注解                                  |
| feign. Retryer      | 失败重试机制     | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试 |

> - NONE：没有日志
> - BASIC：只有基础的请求信息
> - HEADERS：有请求头
> - FULL：有请求体和响应体等所有信息


<!-- tab 配置文件方式-->



全局配置



```yaml
feign:
  client:
    config:
      default:
        loggerLevel: BASIC
```



局部配置



```yaml
feign:
  client:
    config:
      userServer:
        loggerLevel: BASIC
```

<!-- endtab -->

<!-- tab Java代码方式-->

先声明一个Bean

```java
public class FeignClientConfiguration {
    @Bean
    public Logger.Level feignLogLevel(){
        return Logger.Level.BASIC;
    }
}
```



全局配置



在启动类中配置

```java
@EnableFeignClients(defaultConfiguration = FeignClientConfiguration.class)
```



局部配置



在Feign客户端中配置

```java
@FeignClient(value = "userServer", configuration = FeignClientConfiguration.class)
```

<!-- endtab -->



## HttpClient

> feign默认是使用 jdk 的`URLConnection`,这个既不优雅，也不支持连接池等。
>
> 为了提高feign性能，我们使用`HttpClient`

### 导入依赖

```xml
<!-- feign的httpclient依赖-->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

### 配置

```yaml
feign:
  httpclient:
    #    开启对httpclient的支持
    enabled: true
    #    最大连接数
    max-connections: 200
    #    每个路径的最大连接数
    max-connections-per-route: 50
```



