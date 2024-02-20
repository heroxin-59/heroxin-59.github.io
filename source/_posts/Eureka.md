---
#文章标题
title: Eureka注册中心
#文章创建日期
date: 2022-11-25 10:30:00
#文章更新日期
updated: 2022-11-25 10:30:00
#文章标签
tags: [SpringCloud,SpringBoot,Eureka,注册中心] 
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



# 搭建Eureka服务

## Eureka的作用

- 消费者如何获取服务提供者的具体信息
  - eureka也是服务，它会将自己也提交到注册中心，用于eureka集群之间通信
  - 服务提供者启动时，向eureka注册自己的信息
  - eureka保存这些信息
  - 服务消费者根据服务名称向eureka拉取提供者的信息
- 如果有多个服务提供者，消费者该如何选择
  - 服务消费者根据负载均衡算法，从服务列表中挑选一个
- 先非洲如何感知服务提供者的健康状态
  - 服务提供者会每隔30s向注册中心发送心跳请求，报告健康状态
  - eureka会更新记录服务列表信息，心跳不正常会被剔除
  - 消费者就可以拉取到最新的信息

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230223153409938.png)

## 添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

## 启动注解


@EnableEurekaServer


```java
@EnableEurekaServer
@SpringBootApplication
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class,args);
    }
}
```

## 配置文件


​	application.yml


```yaml
server:
  port: 5901
spring:
  application:
    name: eurekaserver # eureka的服务名称
eureka:
  client:
    service-url:  # eureka 的地址信息
      defaultZone: http://127.0.0.1:5901/eureka
```

## 注册服务

### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

### 配置文件



```yaml
spring:
  application:
    name: userServer # 你的服务名称
eureka:
  client:
    service-url:  # eureka 的地址信息
      defaultZone: http://127.0.0.1:5901/eureka
```

### 部署多个实例


IDEA

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128105225169.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128105449663.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128105958510.png)

## 服务拉取


Service,OrderService

```java
@Override
public Order queryOrderById(Long orderId) {
    // 1.查询订单
    Order order = orderMapper.findById(orderId);
    // 2. 利用RestTemplate发起http请求，查询用户
    String url = "http://userServer/user/" + order.getUserId();
    User user = restTemplate.getForObject(url, User.class);
    //3. 封装user到order
    order.setUser(user);
    // 4.返回
    return order;
}
```


启动类，@LoadBalanced负载均衡配置



```java
/**
*  创建 RestTemplate 并注入Spring容器
*  @return
*/
@Bean
@LoadBalanced
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

## Ribbon负载均衡

### 负载均衡原理

![image-20221128114515696](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128114515696.png)

### 负载均衡策略

> Ribbon的负载均衡规则是一个叫做`IRule`的接口来定义的，每一个子接口都是一种规则

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128114554160.png)

| 类名                      | 规则描述                                         |
| :------------------------ | :----------------------------------------------- |
| RoundRobinRule            | 轮询规则，默认方法                               |
| AvailabilityFilteringRule | 忽略并发过高和短路状态的服务器                   |
| WeightedResponseTimeRule  | 权重规则                                         |
| ZoneAvoidanceRule         | 以区域可用的服务器为基础进行服务器的选择。       |
| BestAvailableRule         | 忽略那些短路的服务器，并选择并发数较低的服务器。 |
| RandomRule                | 随机规则                                         |
| RetryRule                 | 重试机制的选择逻辑                               |

#### 配置方法

1. 在启动类中重写方法，返回值为你要的规则

   ```java
   @Bean
   public IRule randomRule(){
       return new RandomRule();
   }
   ```

2. 或者在`application.yml`中配置

   ```yaml
   userServer:
   	ribbon:
   		NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule# 负载均衡规则 
   ```

### 懒加载

> Ribbon默认是采用懒加载，即第一次访问时才会去创建LoadBalanceClient，请求时间会很长。
>
> 而饥饿加载则会在项目启动时创建，降低第一次访问的耗时。

```yaml
ribbon:
  eager-load:
    enabled: true #开启饥饿加载
    clients: userServer
```

