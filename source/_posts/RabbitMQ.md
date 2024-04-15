---
#文章标题
title: RabbitMQ
#文章创建日期
date: 2023-02-28 10:30:00
#文章更新日期
updated: 2023-02-28 10:30:00
#文章标签
tags: [SpringBoot,SpringCloud,RabbitMQ] 
#文章分类
categories: 
	- [分布式,异步通信]
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



# RabbitMQ

> MQ（MessageQueue），消息队列，用来存放消息的队列

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228154952550.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228154912614.png)



## Docker安装RabbitMQ



### 拉取镜像

```sh
docker pull rabbitmq:3-management
```

### 运行

```
docker run \
 -e RABBITMQ_DEFAULT_USER=heroxin \
 -e RABBITMQ_DEFAULT_PASS=heroxin \
 --name mq \
 --hostname mq1 \
 -p 15672:15672 \
 -p 5672:5672 \
 -d \
 rabbitmq:3-management
```

### 访问



服务器IP:15672



![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228155422009.png)



## SpringAMQP初体验

> **A**dvanced **M**essage **Q**ueuing **P**rotocol，是用于在应用程序之间传递业务消息的开放标准。该协议与语言和平台无关，更符合微服务中独立性的要求。
>
> Spring AMQP是基于AMQP协议定义的一套API规范，提供了模板来发送和接收消息。包含两部分，其中spring-amqp是基础抽象，spring-rabbit是底层的默认实现。
>
> SpringAmqp网址：[Spring AMQP](https://spring.io/projects/spring-amqp)

### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.amqp</groupId>
	<artifactId>spring-rabbit-test</artifactId>
</dependency>
```

### publisher

#### yml

```yaml
spring:
  rabbitmq:
    host: 192.168.196.101
    port: 5672
    username: heroxin
    password: heroxin
    virtual-host: /
```

#### test-java

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAMQP {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void testSendMessage(){
        String queueName = "simple.queue";
        String message = "hello,spring amqp";
        rabbitTemplate.convertAndSend(queueName,message);
    }
}
```



![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228161841551.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228161910891.png)

### consumer

#### yml

```yaml
spring:
  rabbitmq:
    host: 192.168.196.101
    port: 5672
    username: heroxin
    password: heroxin
    virtual-host: /
```

#### java

```java
@Component
public class SpringRabbitListener {

//   监听队列,自动绑定消息
   @RabbitListener(queues = "simple.queue")
   public void listenSimpleQueue(String msg){
      System.out.println("消费者接收到simple.queue的消息为："+msg);
   }
}

```

#### 运行启动类

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228162734853.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228162859899.png)



## WorkQueue模式

> 模拟workqueue，实现一个队列绑定多个消费者
>
> 1. 在publisher服务中，定义测试方法，每秒产生50条消息，发送到simple.queue
> 2. 在consumer服务中定义两个监听者，都监听simple.queue
> 3. 消费者01每秒处理50条消息，消费者02每秒处理10条消息



Publisher发布的消息存于 queue 消息队列中，两个 consumer 消费者绑定这个消息队列，两个消费者获取不到相同的消息

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228170348663.png)

### publisher

```java
@Test
public void testSendMessage02() throws InterruptedException {
    String queueName = "simple.queue";
    String message = "hello,spring amqp_";
    for (int i = 0; i < 50; i++) {
        rabbitTemplate.convertAndSend(queueName, message + 1);
        Thread.sleep(20);
    }
}
```

### consumer

```java
@RabbitListener(queues = "simple.queue")
public void listenSimpleQueue01(String msg) throws InterruptedException {
    System.out.println("消费者01 接收到simple.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(20);
}

@RabbitListener(queues = "simple.queue")
public void listenSimpleQueue02(String msg) throws InterruptedException {
    System.err.println("消费者02 接收到simple.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(200);
}
```

### 运行

先启动 consumer ，后启动 publisher 发布消息，通过查看日志得知，50条消息被两个消费者平均分配

**这是因为消息预取机制（虽然没有处理完消息，但是可以获取下一条消息），消息发布到队列当中时，两个消费者轮流从中接收消息，应为消费者02处理较慢，所以最后的日志都是消费者02**

```java
消费者02 接收到simple.queue的消息为：hello,spring amqp_0,16:48:51.241
消费者01 接收到simple.queue的消息为：hello,spring amqp_1,16:48:51.273
消费者01 接收到simple.queue的消息为：hello,spring amqp_3,16:48:51.336
消费者01 接收到simple.queue的消息为：hello,spring amqp_5,16:48:51.397
消费者02 接收到simple.queue的消息为：hello,spring amqp_2,16:48:51.441
消费者01 接收到simple.queue的消息为：hello,spring amqp_7,16:48:51.459
消费者01 接收到simple.queue的消息为：hello,spring amqp_9,16:48:51.520
消费者01 接收到simple.queue的消息为：hello,spring amqp_11,16:48:51.585
消费者02 接收到simple.queue的消息为：hello,spring amqp_4,16:48:51.643
消费者01 接收到simple.queue的消息为：hello,spring amqp_13,16:48:51.644
消费者01 接收到simple.queue的消息为：hello,spring amqp_15,16:48:51.706
消费者01 接收到simple.queue的消息为：hello,spring amqp_17,16:48:51.770
消费者01 接收到simple.queue的消息为：hello,spring amqp_19,16:48:51.829
消费者02 接收到simple.queue的消息为：hello,spring amqp_6,16:48:51.845
消费者01 接收到simple.queue的消息为：hello,spring amqp_21,16:48:51.891
消费者01 接收到simple.queue的消息为：hello,spring amqp_23,16:48:51.953
消费者01 接收到simple.queue的消息为：hello,spring amqp_25,16:48:52.014
消费者02 接收到simple.queue的消息为：hello,spring amqp_8,16:48:52.061
消费者01 接收到simple.queue的消息为：hello,spring amqp_27,16:48:52.078
消费者01 接收到simple.queue的消息为：hello,spring amqp_29,16:48:52.138
消费者01 接收到simple.queue的消息为：hello,spring amqp_31,16:48:52.202
消费者02 接收到simple.queue的消息为：hello,spring amqp_10,16:48:52.262
消费者01 接收到simple.queue的消息为：hello,spring amqp_33,16:48:52.262
消费者01 接收到simple.queue的消息为：hello,spring amqp_35,16:48:52.326
消费者01 接收到simple.queue的消息为：hello,spring amqp_37,16:48:52.389
消费者01 接收到simple.queue的消息为：hello,spring amqp_39,16:48:52.452
消费者02 接收到simple.queue的消息为：hello,spring amqp_12,16:48:52.465
消费者01 接收到simple.queue的消息为：hello,spring amqp_41,16:48:52.512
消费者01 接收到simple.queue的消息为：hello,spring amqp_43,16:48:52.583
消费者01 接收到simple.queue的消息为：hello,spring amqp_45,16:48:52.638
消费者02 接收到simple.queue的消息为：hello,spring amqp_14,16:48:52.668
消费者01 接收到simple.queue的消息为：hello,spring amqp_47,16:48:52.705
消费者01 接收到simple.queue的消息为：hello,spring amqp_49,16:48:52.764
消费者02 接收到simple.queue的消息为：hello,spring amqp_16,16:48:52.874
消费者02 接收到simple.queue的消息为：hello,spring amqp_18,16:48:53.076
消费者02 接收到simple.queue的消息为：hello,spring amqp_20,16:48:53.279
消费者02 接收到simple.queue的消息为：hello,spring amqp_22,16:48:53.481
消费者02 接收到simple.queue的消息为：hello,spring amqp_24,16:48:53.685
消费者02 接收到simple.queue的消息为：hello,spring amqp_26,16:48:53.887
消费者02 接收到simple.queue的消息为：hello,spring amqp_28,16:48:54.101
消费者02 接收到simple.queue的消息为：hello,spring amqp_30,16:48:54.304
消费者02 接收到simple.queue的消息为：hello,spring amqp_32,16:48:54.505
消费者02 接收到simple.queue的消息为：hello,spring amqp_34,16:48:54.708
消费者02 接收到simple.queue的消息为：hello,spring amqp_36,16:48:54.911
消费者02 接收到simple.queue的消息为：hello,spring amqp_38,16:48:55.112
消费者02 接收到simple.queue的消息为：hello,spring amqp_40,16:48:55.328
消费者02 接收到simple.queue的消息为：hello,spring amqp_42,16:48:55.529
消费者02 接收到simple.queue的消息为：hello,spring amqp_44,16:48:55.734
消费者02 接收到simple.queue的消息为：hello,spring amqp_46,16:48:55.939
消费者02 接收到simple.queue的消息为：hello,spring amqp_48,16:48:56.144
```

可以通过更改配置来解决这个问题

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        prefetch: 1 #  每次只能获取一条消息，处理完成才能获取下一条消息
```



## 发布，订阅模式

> 发布订阅模式与之前案例的区别就是允许将同一消息发送给多个消费者。实现方式是加入了exchange（交换机）。
>
> 常见的exchange类型：
>
> - Fanout：广播
> - Direct：路由
> - Topic：话题
>
> exchange 负责消息路由，而不是存储，路由失败则消息丢失

**交换机将消息路由给两个队列，这样与queue01绑定的消费者和与queue02绑定的消费者接收的消息就一样了**

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228170639037.png)

 

### FanoutExchange

> FanoutExchange会将接收到的消息路由到每一个跟其绑定的queue
>
> 实现方法：
>
> 1. 在consumer服务中，利用代码声明队列和交换机，并将两者绑定
> 2. 在consumer服务中，编写两个消费者的方法，分别监听fanout.queue01和fanout.queue02
> 3. 在publisher中编写测试方法，向 itcast.fanout发送消息

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228175728702.png)



#### consumer

**添加配置类**

```java
package com.heroxin.consumer.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FanoutConfig {
//  交换机  heroxin.fanout
   @Bean
   public FanoutExchange fanoutExchange(){
      return new FanoutExchange("heroxin.fanout");
   }
//  队列一 heroxin.queue01
   @Bean
   public Queue fanoutQueue01(){
      return new Queue("fanout.queue01");
   }
//  队列二 heroxin.queue02
   @Bean
   public Queue fanoutQueue02(){
      return new Queue("fanout.queue02");
   }
//   绑定队列一到交换机
   @Bean
   public Binding fanoutBinding01(Queue fanoutQueue01,FanoutExchange fanoutExchange){
      return BindingBuilder.bind(fanoutQueue01).to(fanoutExchange);
   }
//   绑定队列二到交换机
   @Bean
   public Binding fanoutBinding02(Queue fanoutQueue02,FanoutExchange fanoutExchange){
      return BindingBuilder.bind(fanoutQueue02).to(fanoutExchange);
   }
}

```

**新建两个消费者**

```java
@RabbitListener(queues = "fanout.queue01")
public void listenFanoutQueue01(String msg) throws InterruptedException {
    System.out.println("消费者01 接收到fanout.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(200);
}
@RabbitListener(queues = "fanout.queue02")
public void listenFanoutQueue02(String msg) throws InterruptedException {
    System.out.println("消费者02 接收到fanout.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(200);
}
```

启动 consumer，可以看到成功添加了交换机

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228180833370.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228180932886.png)

#### publisher

```java
@Test
public void testSendFanoutExchange(){
    //        交换机名称
    String exchangeName = "heroxin.fanout";
    //        消息
    String message = "hello , my exchange";
    //        发送消息
    rabbitTemplate.convertAndSend(exchangeName,"",message);
}
```

#### 发布消息

两个消费者都接收到了相同的消息

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228182320998.png)



### DirectExchange

> Direct Exchange 会将接收到的消息根据规则路由到指定的Queue，因此称为路由模式（routes）。
>
> - 每一个Queue都与Exchange设置一个BindingKey
> - 发布者发布消息时，指定消息的RoutingKey
> - Exchange将消息路由到BindingKey与RoutingKey移植的队列。
>
> 实现思路：
>
> 1. 利用@RabbitListener声明Exchange，Queue，Routingkey
> 2. 在consumer服务中，编写两个消费者方法，分别监听direct.queue01和direct.queue02
> 3. 在publisher中编写测试方法，向heroxin.direct发送消息

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228182917543.png)

#### consumer

```java
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "direct.queue01"),
    exchange = @Exchange(name = "heroxin.direct"),
    key = {"red","blue"}))
public void listenDirectqueue01(String msg) throws InterruptedException {
    System.out.println("消费者01 接收到direct.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(200);
}
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "direct.queue02"),
    exchange = @Exchange(name = "heroxin.direct"),
    key = {"red","yellow"}))
public void listenDirectqueue02(String msg) throws InterruptedException {
    System.out.println("消费者02 接收到direct.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(200);
}
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228184151922.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228184234795.png)

#### publisher

此时，设定的 routing key 为 ‘blue’，只有binding key 为 ‘blue’ 的消费者能接收到消息

```java
@Test
public void testSendDirectExchange() {
    //        交换机名称
    String exchangeName = "heroxin.direct";
    //        消息
    String message = "hello , my direct exchange";
    //        发送消息
    rabbitTemplate.convertAndSend(exchangeName, "blue", message);
}
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228184738653.png)



### TopicExchange

> TopicExchange与DirectExchange类似，区别在于routingKey必须是多个单词的列表，并且以 **.** 分割。
>
> Queue与Exchange指定BindingKey时可以使用通配符：
>
> - #：代指0个或多个单词
> - *：代指一个单词
>
> ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228185301033.png)



这个写法和DirectExchange一样，只是消费者的routing不一样，这里就不演示了
