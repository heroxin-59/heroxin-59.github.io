# 缓存预热

缓存预热是指系统上线后，提前将相关的缓存数据加载到缓存系统。

避免在系统上线初期，大量请求访问到数据库当中，对数据库造成巨大的压力

如果不进行预热，那么 Redis 初始状态数据为空，系统上线初期，对于高并发的流 量，都会访问到数据库中， 对数据库造成流量的压力。 

缓存预热解决方案： 

- 数据量不大的时候，工程启动的时候进行加载缓存动作； 
- 数据量大的时候，设置一个定时任务脚本，进行缓存的刷新； 
- 数据量太大的时候，优先保证热点数据进行提前加载到缓存。



# Redis缓存预热

> InitializingBean是Spring提供的拓展性接口，InitializingBean接口为bean提供了属性初始化后的处理方法，它只有一个afterPropertiesSet方法，凡是继承该接口的类，在bean的属性初始化后都会执行该方法。



```java

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;



@Controller
public class SeckillController implements InitializingBean {

    @Autowired
    private RedisTemplate redisTemplate;


    /**
     * 系统初始化，把商品库存数量加载到redis  缓存预热
     *
     * @throws Exception
     */
    @Override
    public void afterPropertiesSet() throws Exception {
       /**
        *
        *	缓存操作
        *
	    */
    }


}

```

