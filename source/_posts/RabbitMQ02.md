---
#文章标题
title: RabbitMQ工作模式与实现方式
#文章创建日期
date: 2023-03-21 10:30:00
#文章更新日期
updated: 2023-11-01 10:30:00
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
headimg: https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228170639037.png
sticky: 
---
## Work queues

- 不需要设置交换机，只需指定唯一的消息队列即可进行消息传递
- 可以有多个消费者，多个消费者通过轮询从队列中取消息
- 消息被接受后，队列将消息移除
- 消费在可以在没有处理完消息的情况下继续获取消息
- 通过设置 **spring.rabbitmq.listener.simple.prefetch: 1** 来设置每次处理完消息后才能获取下一条



![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228170348663.png)

**监听队列，自动绑定消息。通过设置休眠来模拟不同的消费能力**
{% tabs Workqueues %}
<!-- tab consumer -->

```java
@Component
public class SpringRabbitListener {
//   workqueue

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
}
```

<!-- endtab -->
<!-- tab publisher -->


```java
//    workqueue
@Test
public void testSendMessage02() throws InterruptedException {
    String queueName = "simple.queue";
    String message = "hello,spring amqp_";
    for (int i = 0; i < 50; i++) {
        rabbitTemplate.convertAndSend(queueName, message + i);
        Thread.sleep(20);
    }
}
```
<!-- endtab -->

{% endtabs %}

## Publish/Subscribe

- 需要设置交换机，并将队列绑定到交换机
- 常见的交换机类型有 fanout、direct、topic
- 可以通过基于配置和基于注解的方式来声明交换机、声明队列、绑定队列到交换机



![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230228170639037.png)



> - fanout：广播模式，路由key 为空
> - direct：定义路由 key
> - topic：路由key支持通配符
>   1. *：匹配一个
>   2. #：匹配零个或多个
> - headers：
>   - whereAny：匹配任意一个
>   - whereAll：必须都满足



## Config

{% tabs config %}
<!-- tab Fanout-->

```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalTime;

@Configuration
public class RabbitMQConfig {
    //  声明交换机  heroxin.fanout
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange("heroxin.fanout");
    }


    //  声明队列一 queue01
    @Bean
    public Queue queue01() {
        return new Queue("queue01");
    }

    //  声明队列二 queue02
    @Bean
    public Queue queue02() {
        return new Queue("queue02");
    }

    //   fanout 绑定队列一到交换机
    @Bean
    public Binding fanoutBinding01() {
        return BindingBuilder.bind(queue01()).to(fanoutExchange());
    }

    //   fanout 绑定队列二到交换机
    @Bean
    public Binding fanoutBinding02() {
        return BindingBuilder.bind(queue02()).to(fanoutExchange());
    }


}

```

<!-- endtab -->

<!-- tab Direct-->

```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {
    //  声明交换机  heroxin.direct
    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange("heroxin.direct");
    }

    //  声明队列一 queue01
    @Bean
    public Queue queue01() {
        return new Queue("queue01");
    }

    //  声明队列二 queue02
    @Bean
    public Queue queue02() {
        return new Queue("queue02");
    }
    //    direct 绑定队列一到交换机
    @Bean
    public Binding directBinding01() {
        return BindingBuilder.bind(queue01()).to(directExchange()).with("hero");
    }

    //    direct 绑定队列二到交换机
    @Bean
    public Binding directBinding02() {
        return BindingBuilder.bind(queue02()).to(directExchange()).with("xin");
    }
}
```

<!-- endtab -->

<!-- tab Topic-->

```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {

    //  声明交换机  heroxin.topic
    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange("heroxin.topic");
    }

    //  声明队列一 queue01
    @Bean
    public Queue queue01() {
        return new Queue("queue01");
    }

    //  声明队列二 queue02
    @Bean
    public Queue queue02() {
        return new Queue("queue02");
    }

    //    topic 绑定队列一到交换机
    @Bean
    public Binding topicBinding01() {
        return BindingBuilder.bind(queue01()).to(topicExchange()).with("#.hero.#");
    }

    //    topic 绑定队列二到交换机
    @Bean
    public Binding topicBinding02() {
        return BindingBuilder.bind(queue02()).to(topicExchange()).with("*.xin.*");
    }


}

```

<!-- endtab -->

<!-- tab Headers -->

```java
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {

   	//  声明交换机  heroxin.headers
    @Bean
    public HeadersExchange headersExchange() {
        return new HeadersExchange("heroxin.headers");
    }

    //  声明队列一 queue01
    @Bean
    public Queue queue01() {
        return new Queue("queue01");
    }

    //  声明队列二 queue02
    @Bean
    public Queue queue02() {
        return new Queue("queue02");
    }

    //    headers 绑定队列一到交换机
    @Bean
    public Binding headersBinding01() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("color", "red");
        map.put("speed", "low");
        return BindingBuilder.bind(queue01()).to(headersExchange()).whereAny(map).match();
    }

    //    headers 绑定队列二到交换机
    @Bean
    public Binding headersBinding02() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("color", "red");
        map.put("speed", "fast");
        return BindingBuilder.bind(queue02()).to(headersExchange()).whereAll(map).match();
    }


}

```

<!-- endtab -->

{% endtabs %}


## 服务提供者

{% tabs 服务提供者 %}
<!-- tab Fanout-->

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MQSender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendFanout(Object msg) {
        rabbitTemplate.convertAndSend("heroxin.fanout", "", msg);
    }
}

```

<!-- endtab -->

<!-- tab Direct-->

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MQSender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendDirect01(Object msg) {
        log.info("发送 [hero] 消息" + msg);
        rabbitTemplate.convertAndSend("heroxin.direct", "hero", msg);
    }
    public void sendDirect02(Object msg) {
        log.info("发送 [xin] 消息" + msg);
        rabbitTemplate.convertAndSend("heroxin.direct", "xin", msg);
    }

}

```

<!-- endtab -->

<!-- tab Topic-->

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MQSender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendTopic01(Object msg) {
        log.info("发送 [#.hero.#] 消息" + msg);
        rabbitTemplate.convertAndSend("heroxin.topic", "hero.xin", msg);
    }

    public void sendTopic02(Object msg) {
        log.info("发送 [*.xin.*] 消息" + msg);
        rabbitTemplate.convertAndSend("heroxin.topic", "hero.xin.heroxin", msg);
    }

}

```

<!-- endtab -->

<!-- tab Headers -->

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MQSender {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendHeaders01(String msg) {
        log.info("发送 [都能接收到] 消息" + msg);
        MessageProperties properties = new MessageProperties();
        properties.setHeader("color", "red");
        properties.setHeader("speed", "fast");
        Message message = new Message(msg.getBytes(), properties);
        rabbitTemplate.convertAndSend("heroxin.headers", "", message);
    }

    public void sendHeaders02(String msg) {
        log.info("发送 [只有队列一接受] 消息" + msg);
        MessageProperties properties = new MessageProperties();
        properties.setHeader("color", "red");
        properties.setHeader("speed", "low");
        Message message = new Message(msg.getBytes(), properties);
        rabbitTemplate.convertAndSend("heroxin.headers", "", message);
    }

}

```

<!-- endtab -->

{% endtabs %}

## 服务消费者

{% tabs 服务消费者 %}

<!-- tab Fanout , Direct , Topic-->

```java
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
public class MQReceiver {

    // 监听队列一
    @RabbitListener(queues = "queue01")
    public void listenQueue01(String msg) throws InterruptedException {
        System.out.println("消费者01 接收到queue01的消息为：" + msg + "," + LocalTime.now());
        Thread.sleep(200);
    }

    //  监听队列二
    @RabbitListener(queues = "queue02")
    public void listenQueue02(String msg) throws InterruptedException {
        System.out.println("消费者02 接收到queue02的消息为：" + msg + "," + LocalTime.now());
        Thread.sleep(200);
    }
}
```

<!-- endtab -->

<!-- tab Headers-->

```java
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
public class MQReceiver {

    // 监听队列一
    @RabbitListener(queues = "queue01")
    public void listenQueue01(Message msg) throws InterruptedException {
        System.out.println("消费者01 接收到queue01的消息为：" + new String(msg.getBody()) + "," + LocalTime.now());
        Thread.sleep(200);
    }

    //  监听队列二
    @RabbitListener(queues = "queue02")
    public void listenQueue02(Message msg) throws InterruptedException {
        System.out.println("消费者02 接收到queue02的消息为：" + new String(msg.getBody()) + "," + LocalTime.now());
        Thread.sleep(200);
    }
}

```

<!-- endtab -->

{% endtabs %}

## 测试

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/mq")
public class UserController {
    @Autowired
    private MQSender mqSender;

    /**
     * 测试rabbitMQ---fanout
     */
    @RequestMapping("/fanout")
    @ResponseBody
    public void mqFanout() {
        mqSender.sendFanout("Heroxin Hello Fei");
    }

    /**
     * 测试rabbitMQ---direct
     */
    @RequestMapping("/direct01")
    @ResponseBody
    public void mqDirect01() {
        mqSender.sendDirect01("Heroxin Hello Fei");
    }

    @RequestMapping("/direct02")
    @ResponseBody
    public void mqDirect02() {
        mqSender.sendDirect02("Heroxin Hello Fei");
    }

    /**
     * 测试rabbitMQ---topic
     */
    @RequestMapping("/topic01")
    @ResponseBody
    public void mqTopic01() {
        mqSender.sendTopic01("Heroxin Hello Fei");
    }

    @RequestMapping("/topic02")
    @ResponseBody
    public void mqTopic02() {
        mqSender.sendTopic02("Heroxin Hello Fei");
    }

    /**
     * 测试rabbitMQ---headers
     */
    @RequestMapping("/headers01")
    @ResponseBody
    public void mqHeaders01() {
        mqSender.sendHeaders01("Heroxin Hello Fei");
    }

    @RequestMapping("/headers02")
    @ResponseBody
    public void mqHeaders02() {
        mqSender.sendHeaders02("Heroxin Hello Fei");
    }
}

```



## 补充：基于注解配置

```java
//    directExchange

    // 监听队列一
@RabbitListener(
    bindings = @QueueBinding(
        value = @Queue(name = "direct.queue01"),
        exchange = @Exchange(name = "heroxin.direct"),
        key = {"red", "blue"}
    )
)
public void listenDirectqueue01(String msg) throws InterruptedException {
    System.out.println("消费者01 接收到direct.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(200);
}


    // 监听队列二
@RabbitListener(
    bindings = @QueueBinding(
        value = @Queue(name = "direct.queue02"),
        exchange = @Exchange(name = "heroxin.direct"),
        key = {"red", "yellow"}
    )
)
public void listenDirectqueue02(String msg) throws InterruptedException {
    System.out.println("消费者02 接收到direct.queue的消息为：" + msg + "," + LocalTime.now());
    Thread.sleep(200);
}
```

