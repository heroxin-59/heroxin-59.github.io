---
#文章标题
title: Redis
#文章创建日期
date: 2022-05-10 10:30:00
#文章更新日期
updated: 2023-03-07 10:30:00
#文章标签
tags: [Redis,分布式] 
#文章分类
categories: 
	- [技术栈]
	- [分布式]
#文章关键字
keywords: Redis
#文章描述
description: 
#文章顶部图片
top_img: 
sticky: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---
# **Redis新手入门笔记**

## Redis安装

1. [Redis-7.0.0](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/software/redis-7.0.0.tar.gz)，将压缩包上传至服务器并解压

2. 安装 gcc 编译环境

   ```sh
   yum install centos-release-scl scl-utils-build
   yum install -y devtoolset-8-toolchain
   scl enable devtoolset-8 bash
   ```

3. 测试 gcc 版本

   ```shell
   gcc --version
   ```

5. 进入redis目录

   ```shell
   cd redis-7.0.0/
   ```

6. 执行 make 命令，对文件进行编译

   ```shell
   make
   ```

7. 执行 make install 命令，进行安装

   ```shell
   make install
   ```

8.  redis程序 默认安装在 /usr/local/bin 目录,这样就可以在任何地方通过命令运行redis

8. 

   **一般来说我们使用redis并不在解压后的redis目录下。**

   **通常在一个习惯的位置创建一个文件夹，里面自己更改好的配置文件（redis.conf）。**

   **通过启动命令来加载这个配置文件进而使用redis的。**

   

   所以我们把解压文件中的 redis.conf  复制到自定义的位置

   ```shell
   cp /opt/redis-7.0.0/redis.conf /etc
   ```

10. 将复制后的 redis.conf 中 **daemonize** 属性改为  **yes**  ，这样 redis 就可以在后台启动

    

## Redis启动与关闭

1. 在任意目录下执行（后面那个就是指定你要加载的配置文件，重点）

   ```shell
   redis-server /etc/redis.conf
   ```

2. 查看 redis 运行进程

   ```shell
   ps -ef | grep redis
   ```

3. 客户端访问 redis

   ```shell
   redis-cli
   ```

4. 退出客户端

   ```shell
   exit
   ```

5. 关闭 redis

   - 在客户端内执行 shutdown
   - 退出客户端后查询 redis 进程， kill PID

## Redis介绍



> ​	端口号：6379
>
> ​	默认有 16 个数据库，下标从 0 开始，初始默认实验 0 号库
>
> ​	所有库密码相同



**Redis是单线程+多路IO复用技术**

多路复用是指使用一个线程来检查多个文件描述符（Socket）的就绪状态，比如调用select和poll函数，传入多个文件描述符，如果有一个文件描述符就绪，则返回，否则阻塞直到超时。得到就绪状态后进行真正的操作可以在同一个线程里执行，也可以启动线程执行（比如使用线程池）



## Redis常用数据类型

#### Redis 键(key)

1. 查看当前库中所有 key

   ```
   keys *
   ```

2. 判断某个 key 是否存在

   ```
   exists <key>
   ```

3. 查看 key 的数据类型

   ```
   type <key>
   ```

4. 删除指定的 key 数据

   ```
   del <key>
   ```

5. 根据 value 选择非阻塞删除(仅将 keys 从 keyspace 元数据中删除，真正的删除会在后续异步操作)

   ```
   unlink <key> 
   ```

6. 设置 key 的过期时间(数字以秒为单位)

   ```
   expire <key> <num>
   ```

7. 查看 key 还有多少秒过期( -1 表示永不过期，-2 表示已经过期 )

   ```
   ttl <key>
   ```

8. 切换数据库(数据库下标从0开始，一共有16个，默认使用数据库[0] )

   ```
   select <num>
   ```

9. 查看当前数据库 key 的数量

   ```
   dbsize
   ```

10. 清空当前数据库

    ```
    flushdb
    ```

11. 清空全部数据库

    ```
    flushall
    ```

    

#### Redis字符串(String)

###### 	简介

> String是Redis最基本的类型，你可以理解成与Memcached一模一样的类型，一个key对应一个value。
>
> String类型是二进制安全的。意味着Redis的string可以包含任何数据。比如jpg图片或者序列化的对象。
>
> String类型是Redis最基本的数据类型，一个Redis中字符串value最多可以是512M

###### 	常用命令

1. 添加键值对

   ```
   set <key> <value>
   ```

2. 添加键值对(仅在 key 不存在时，设置 key 的值)

   ```
   setnx <key> <value>
   ```

3. 查询对应键值

   ```
   get <key> 
   ```

4. 将给定< value >添加到原< value >的末尾，返回 < value >的长度

   ```
   append <key> <value>
   ```

5. 获取< value >的长度

   ```
   strlen <key>
   ```

6. 将 < value > 的数字值增加 1 (只能对数字值进行操作，如果为空，则新增值为 1 )，返回增加后的< value >

   ```
   incr <key>
   ```

7. 将 < value > 的数字值减少 1 (只能对数字值进行操作，如果为空，则新增值为 -1 )，返回减少后的 < value >

   ```
   decr <key>
   ```

8. 自定义步长(与 6，7 类似)

   ```
   incrby/decrby <key> <num>
   ```

9. 同时设置一个或多个 < key >-< value >

   ```
   mset <key01> <value01> <key02> <value02>...
   ```

10. 同时设置一个或多个 < key >-< value > ( 当且仅当给定所有 key 都不存在时 )

    (<u>原子性，有一个失败则都失败</u>)

    ```
    msetnx <key01> <value01> <key02> <value02>...
    ```

11. 同时获取一个或多个 < value>

    ```
    mget <key01> <key02> <key03>...
    ```

12. 获得指定范围的 < value > ,下标从 0 开始

    ```
    getrange <key> <startNum> <endNum>
    ```

13. 用给定 < value > 覆盖 < key > 所存储的字符串值，从 < num >开始，索引从 0 开始，返回 < value >长度

    ```
    setrange <key> <num> <value>
    ```

14. 设置键的同时设置过期时间

    ```
    setex <key> <过期时间> <value>
    ```

15. 新 < value > 覆盖 原 < value >,并返回 原< value >

    ```
    getset <key> <value>
    ```

###### 	数据结构

> ​	String的数据结构为简单动态字符串(Simple Dynamic String,缩写SDS)。是可以修改的字符串，内部结构实现上类似于Java的ArrayList，采用预分配冗余空间的方式来减少内存的频繁分配.
>
> ![image-20220511153542429](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511153542429.png)
>
> 如图中所示，内部为当前字符串实际分配的空间capacity一般要高于实际字符串长度len。当字符串长度小于1M时，扩容都是加倍现有的空间，如果超过1M，扩容时一次只会多扩1M的空间。需要注意的是字符串最大长度为512M。

#### Redis列表(List)

###### 	简介

> 单键多值
>
> Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）。
>
> 它的底层实际是个双向链表，对两端的操作性能很高，通过索引下标的操作中间的节点性能会较差。
>
> ![image-20220511160647982](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511160647982.png)

###### 	常用命令

1. 从左边/右边插入一个或多个值

   ```
   lpush/rpush <key01> <value01> <key02> <value02>...
   ```

2. 从左边/右边弹出一个值 (当值全部弹出时，键销毁)

   ```
   lpop/rpop <key>
   ```

3. 从< key01> 列表右边弹出一个值，插入到 < key02 >列表左边

   ```
   rpoplpush <key01> <key02>
   ```

4. 按照下标获取范围内元素，下标从 0 开始 ( 0 -1 代表获取列表所有元素)

   ```
   lrange <key> <startNum> <endNum>
   ```

5. 按照下标获取列表元素

   ```
   lindex <key> <index>
   ```

6. 获取列表长度

   ```
   llen <key>
   ```

7. 在 < value> 的 **<u>后面</u>** 插入元素< newvalue>

   ```
   linsert <key> before <value> <newvalue>
   ```

8. 从左边开始删除 < num > **个** 列表元素 < value> (从左到右)

   ```
   lrem <key> <num> <value>
   ```

9. 将列表中下标为 < index > 的值替换成 < value >

   ```
   lset <key> <index> <value>
   ```

###### 	数据结构

> List的数据结构为快速链表quickList。
>
> 首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是ziplist，也即是压缩列表。
>
> 它将所有的元素紧挨着一起存储，分配的是一块连续的内存。
>
> 当数据量比较多的时候才会改成quicklist。
>
> 因为普通的链表需要的附加指针空间太大，会比较浪费空间。比如这个列表里存的只是int类型的数据，结构上还需要两个额外的指针prev和next。
>
> ![image-20220511163615399](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511163615399.png)
>
> Redis将链表和ziplist结合起来组成了quicklist。也就是将多个ziplist使用双向指针串起来使用。这样既满足了快速的插入删除性能，又不会出现太大的空间冗余。



#### Redis集合(Set)

###### 	简介

> Redis set对外提供的功能与list类似是一个列表的功能，特殊之处在于set是可以**自动排重**的，当你需要存储一个列表数据，又不希望出现重复数据时，set是一个很好的选择，并且set提供了判断某个成员是否在一个set集合内的重要接口，这个也是list所不能提供的。
>
> Redis的Set是string类型的无序集合。它底层其实是一个value为null的hash表，所以添加，删除，查找的**复杂度都是 O(1).**
>
> 一个算法，随着数据的增加，执行时间的长短，如果是O(1)，数据增加，查找数据的时间不变

###### 常用命令

1. 将一个或多个元素添加到集合当中，已存在的元素将被忽略

   ```
   sadd <key> <value01> <value02>...
   ```

2. 取出集合中所有元素

   ```
   smembers <key> 
   ```

3. 判断集合中是否含有该 < value>, 有 1，没有 0

   ```
   sismember <key> <value>
   ```

4. 返回集合中元素个数

   ```
   scard <key>
   ```

5. 删除集合中的一个或多个元素

   ```
   srem <key> <value01> <value02>...
   ```

6. 随机从集合中弹出一个元素，弹完后，销毁 key

   ```
   spop <key>
   ```

7. 随机从集合中取出 < num > 个值 (不会从集合中删除)

   ```
   srandmember <key> <num>
   ```

8. 将集合中的一个元素移动到另一个集合当中

   ```
   smove <key01> <key02> <value>
   ```

9. 返回两个集合的 交集 元素

   ```
   sinter <key01> <key02>
   ```

10. 返回两个集合的 并集 元素

    ```
    sunion <key01> <key02>
    ```

11. 返回两个集合的 差集 元素

    ```
    sdiff <key01> <key02>
    ```

###### 数据结构

> Set数据结构是dict字典，字典是用哈希表实现的。
>
> Java中HashSet的内部实现使用的是HashMap，只不过所有的value都指向同一个对象。
>
> Redis的set结构也是一样，它的内部也使用hash结构，所有的value都指向同一个内部值。



#### Redis哈希(Hash)

###### 	简介

> Redis hash 是一个键值对集合。
>
> Redis hash是一个string类型的field和value的映射表，hash特别适合用于存储对象。
>
> 类似Java里面的Map<String,Object>
>
> 就是 key-value 的嵌套
>
> 
>
> ![image-20220511183713711](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511183713711.png)
>
> 通过 key(用户ID) + field(属性标签) 就可以操作对应属性数据了，既不需要重复存储数据，也不会带来序列化和并发修改控制的问题

###### 常用命令

1. 给哈希表中的 < field > 键赋值 < value >

   ```
   hset <key> <filed> <value>
   ```

2. 给哈希表中的 < field > 键赋值 < value > (当且仅当 < field > 不存在时 )

   ```
   hsetnx <key> <field> <value>
   ```

3. 从哈希表中的 < field> 取出值 < value>

   ```
   hget <key> <field>
   ```

4. 设置一个或多个 hash 值

   ```
   hmset <key> <field01> <value01> <field02> <value02>
   ```

5. 查看哈希表中给定 < field> 是否存在，有 1，没有 0

   ```
   hexists <key> <field>
   ```

6. 列出哈希表中所有 < field >

   ```
   hkeys <key>
   ```

7. 列出哈希表中所有 < value>

   ```
   hvals <key>
   ```

8. 给哈希表中域 < field> 的 < value> 值增加 < num >

   ```
   hincrby <key> <field> <num>
   ```

###### 数据结构

> Hash类型对应的数据结构是两种：ziplist（压缩列表），hashtable（哈希表）。
>
> 当field-value长度较短且个数较少时，使用ziplist，否则使用hashtable。

#### Redis有序集合Zset(sorted set)

###### 	简介

> Redis有序集合zset与普通集合set非常相似，是一个**没有重复元素**的字符串集合。
>
> 不同之处是有序集合的每个成员都关联了一个评分（score）,这个评分（score）被用来按照从最低分到最高分的方式排序集合中的成员。集合的成员是唯一的，但是评分可以是重复了 。
>
> 这里的 score 有点类似 **权重**
>
> 因为元素是有序的, 所以你也可以很快的根据评分（score）或者次序（position）来获取一个范围的元素。
>
> 访问有序集合的中间元素也是非常快的,因此你能够使用有序集合作为一个没有重复成员的智能列表。

###### 	常用命令

1. 将一个或多个元素及其 score 加入到有序集合中

   ```
   zadd <key> <score01> <value01> <score02> <value02>...
   ```

2. 返回有序集合中指定范围的元素，下标从 0 开始 ( 0 -1表示获取所有 )

   ```
   zrange <key> <startNum> <endNum>
   ```

3. 返回有序集合中指定范围的元素( score 和值一起返回)

   ```
   zrange <key> <startNum> <endNum> [withscores]
   ```

4. 返回有序集合中 score 介于 min 和 max 之间(包括等于 min，max)的元素，元素按 score 值升序排序

   ```
   zrangebyscore <key> <min> <max> [withscores]
   ```

5. 返回有序集合中 score 介于 min 和 max 之间(包括等于 min，max)的元素，元素按 score 值降序排序

   ```
   zrevrangebyscore <key> <max> <min> [withscore]
   ```

6. 增大元素的 score 值，返回增大后的值

   ```
   zincrby <key> <num> <value>
   ```

7. 删除有序集合中指定 < value > 的元素

   ```
   zrem <key> <value>
   ```

8. 统计有序集合中，score 在指定区间内的元素个数

   ```
   zcount <key> <min> <max>
   ```

9. 返回 < value > 值在有序集合中的排名，下标从 0 开始

   ```
   zrank <key> <value>
   ```

###### 	数据结构

> SortedSet(zset)是Redis提供的一个非常特别的数据结构，一方面它等价于Java的数据结构
>
> Map<String, Double>，可以给每一个元素value赋予一个权重score，另一方面它又类似于TreeSet，内部的元素会按照权重score进行排序，可以得到每个元素的名次，还可以通过score的范围来获取元素的列表。
>
> zset底层使用了两个数据结构
>
> （1）hash，hash的作用就是关联元素value和权重score，保障元素value的唯一性，可以通过元素value找到相应的score值。
>
> （2）跳跃表，跳跃表的目的在于给元素value排序，根据score的范围获取元素列表。

> **跳跃表**
>
> 1. 简介
>
>    有序集合在生活中比较常见，例如根据成绩对学生排名，根据得分对玩家排名等。对于有序集合的底层实现，可以用数组、平衡树、链表等。数组不便元素的插入、删除；平衡树或红黑树虽然效率高但结构复杂；链表查询需要遍历所有效率低。Redis采用的是跳跃表。跳跃表效率堪比红黑树，实现远比红黑树简单。
>
> 2. 实例
>
>    对比有序链表和跳跃表，从链表中查询出51
>
>    1. 有序链表
>
>       ![image-20220511193306982](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511193306982.png)
>
>       要查找值为51的元素，需要从第一个元素开始依次查找、比较才能找到。共需要6次比较。
>
>    2. 跳跃表
>
>       ![image-20220511193352203](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511193352203.png)
>
>       从第2层开始，1节点比51节点小，向后比较。
>
>       21节点比51节点小，继续向后比较，后面就是NULL了，所以从21节点向下到第1层
>
>       在第1层，41节点比51节点小，继续向后，61节点比51节点大，所以从41向下
>
>       在第0层，51节点为要查找的节点，节点被找到，共查找4次。 
>
>       <u>从此可以看出跳跃表比有序链表效率要高</u>



## Redis配置文件



> 听说此处面试问到的概率还不小，但对于入门来说懂几个关键点即可
>
> 博主只更改几个相对常用的地方
>
> 如有其他需求，可以查看[官方文档](https://redis.io/docs/)



> 博主在 Redis安装这里已经将 配置文件 redis.conf 备份到 /etc 目录下，所有本部分操作都在此目录下进行

1. 默认情况 bind=127.0.0.1  只能接受本机访问的请求，注释掉它，以便远程连接

   ```
   # bind=127.0.0.1
   ```

2. 将本机访问保护设置为 no 以便远程连接

   ```
   protected-mode no
   ```

3. 端口设置，默认6379

   ```
   port 6379
   ```
   
4. tcp-backlog

   > tcp的backlog是一个连接队列，backlog队列总和=未完成三次握手队列 + 已经完成三次握手队列。
   >
   > 在高并发环境下你需要一个高backlog值来避免慢客户端连接问题。

   ```
   tcp-backlog 511
   ```

5. 心跳检测，对客户端连接状态的一种检测，每 n 秒检测一次，0表示永不检测，建议设置为60

   ```
   tcp-keepalive 60
   ```

6. 超时连接，一个**空闲的**客户端维持多少秒后会关闭，0表示关闭该功能，即永不关闭

   ```
   timeout 0
   ```

7. redis运行是否为后台运行，yes为后台运行

   ```
   daemonize yes
   ```

8. 日志级别，默认为 notice

   > debug  verbose  notice  warning

   ```
   loglevel notice
   ```

9. 设定数据库数量，默认16

   ```
   databases 16
   ```

10. redis同时可以和多少客户端连接，默认10000

   ```
   maxclients 10000
   ```

11. redis可以使用的内存量，防止将内存占满造成服务器宕机。(内存超过上限，redis会一次内部数据，移除规则通过 maxmemory-policy来指定)

    ```
    maxmemory <bytes>
    ```

12. 设置密码

    ```
    requirepass xxxx
    ```

    > 设置密码后重启redis
    >
    > 登录后需要输入密码才能执行命令
    >
    > 进入客户端 redis-cli
    >
    > 输入 auth password

## Redis发布和订阅

##### 	介绍

> Redis 发布订阅 (pub/sub) 是一种**消息通信模式**：发送者 (pub) 发送消息，订阅者 (sub) 接收消息。
>
> Redis 客户端可以订阅任意数量的频道。

##### 	发布和订阅

​	客户端订阅频道

​	![image-20220511211828323](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511211828323.png)

​	当频道发布消息后，消息就会发送给订阅的客户端

​	![image-20220511211838270](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220511211838270.png)

##### 	发布订阅命令的实现

1. 打开两个会话，连接到相同的服务器

2. 其中一个会话订阅 channel01

   ```
   subscribe channel01
   ```

3. 另一个会话给 channel01发布消息 hello，返回订阅这个频道的订阅者(客户端)数量

   ```
   publish channel01 hello
   ```

4. 返回第一个会话，就看到发来的消息

​	

## Redis事务

#### 简介

> Redis事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
>
> Redis事务的主要作用就是串联多个命令防止别的命令插队。
>
> ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220512201422965.png)
>
> 从输入Multi命令开始，输入的命令都会依次进入命令队列中，但不会执行，直到输入Exec后，Redis会将之前的命令队列中的命令依次执行。
>
> 组队的过程中可以通过discard来放弃组队。
>
> multi 开启事务
>
> exec 提交事务
>
> discard 回滚事务

#### 事务的错误处理

> 组队时某个命令出现了报告错误，执行时整个的所有队列都会被取消。
>
> ![image-20220512201925271](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220512201925271.png)
>
> 如果执行阶段某个命令报出了错误，则只有报错的命令不会被执行，而其他的命令都会执行，不会回滚。
>
> ![image-20220512201941584](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220512201941584.png)
>
> 没有原子性

#### 事务的冲突

###### 	悲观锁

​		**悲观锁(Pessimistic Lock)**, 顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会block直到它拿到锁。**传统的关系型数据库里边就用到了很多这种锁机制**，比如**行锁**，**表锁**等，**读锁**，**写锁**等，都是在做操作之前先上锁。

###### 	乐观锁

​		**乐观锁(Optimistic Lock),** 顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。**乐观锁适用于多读的应用类型，这样可以提高吞吐量**。Redis就是利用这种check-and-set机制实现事务的。

###### watch key

> ​	在执行 multi 之前，限执行 watch key1 [key2]，可以监视一个或多个 key，
>
> ​	如果在事务执行之前，这个 key 被其他命令所改动，那么事务将被打断。

```
watch key01
multi
... // 操作
exec
```



#### 事务的三特性

###### 	单独隔离操作

​		事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。

###### 	没有隔离级别

​		队列中的命令没有提交之前都不会实际被执行，因为事务提交前任何指令都不会被实际执行

###### 	不保证原子性

​		事务中如果有一条命令执行失败，其后的命令仍然会被执行，没有回滚 



## Redis持久化

> Redis的所有数据都是保存在内存中，redis崩掉的话，会丢失。
>
> Redis持久化就是把数据保存到磁盘上（可永久保存的存储设备中），以便数据恢复。
>
> Redis提供两种方式进行持久化，
>
> - RDB持久化（原理是将Reids在内存中的数据库记录定时dump到磁盘上的RDB持久化）
> - AOF（append only file）持久化（原理是将Reids的操作日志以追加的方式写入文件）

#### RDB

> RDB持久化是指在指定的时间间隔内将内存中的数据集快照写入磁盘
>
> Redis会单独创建（fork）一个子进程来进行持久化，会先将数据写入到 一个临时文件中，待持久化过程都结束了，再用这个临时文件替换上次持久化好的文件。 整个过程中，主进程是不进行任何IO操作的，这就确保了极高的性能 如果需要进行大规模数据的恢复，且对于数据恢复的完整性不是非常敏感，那RDB方式要比AOF方式更加的高效。
>
> **RDB**的缺点是最F后一次持久化后的数据可能丢失。

###### Fork

- Fork的作用是复制一个与当前进程一样的进程。新进程的所有数据（变量、环境变量、程序计数器等） 数值都和原进程一致，但是是一个全新的进程，并作为原进程的子进程；
- 在Linux程序中，fork()会产生一个和父进程完全相同的子进程，但子进程在此后多会exec系统调用，出于效率考虑，Linux中引入了“**写时复制技术**”；
-  **一般情况父进程和子进程会共用同一段物理内存**，只有进程空间的各段的内容要发生变化时，才会将父进程的内容复制一份给子进程。

###### RDB持久化流程

​	![image-20220515110413828](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515110413828.png)

​	Redis每次完成持久化操作之后，会在启动 redis-server 服务的目录下生成 dump.rdb (默认名称)文件，保存了 Redis 数据。

###### 配置文件中关于 Redis 持久化的配置

1. rdp文件名称

   ```
   dbfilename dump.rdb
   ```

2. rdb 文件保存路径

   ```
   dir ./
   ```

3. 快照策略：num 秒后，至少有多少个 key 发生变化，就执行快照

   eg: 3600秒后，如果至少有一个key发生变化，执行快照

   ```
   (默认配置)
   save 3600 1
   save 300 10 
   save 60 10000
   ```

4. 命令 save 和 bgsave

   > save ：save时只管保存，其它不管，全部阻塞。手动保存。不建议。
   >
   > **bgsave：Redis会在后台异步进行快照操作，快照同时还可以响应客户端请求。**
   >
   > 可以通过lastsave 命令获取最后一次成功执行快照的时间

5. 执行flushall命令，也会产生dump.rdb文件，但里面是空的，无意义

6. 当 Redis 无法写入磁盘(磁盘满了)，直接关闭 Redis 的写操作

   ```
   stop-writes-on-bgsave-error yes
   ```

7. 完整性检查

   ```
   rdbchecksum yes
   ```

###### RDB优势

- 适合大规模数据恢复
- 对数据完整性和一致性要求不高时适用
- 节省磁盘空间
- 恢复速度快

###### RDB劣势

- Fork时，内存中的数据被克隆了一份，大致2倍的膨胀下需要考虑
- 虽然Redis在fork时采用了**写时拷贝技术**，但是如果数据庞大时，还是比较消耗性能的
- 在一定时间间隔内做一次备份，如果出现意外，会丢失最后一次快照后的所有修改

#### AOF

> 以**日志**的形式来记录每个写操作（增量保存），将Redis执行过的所有写指令记录下来(**读操作不记录**)
>
>  **只许追加文件但不可以改写文件**，redis启动之初会读取该文件重新构建数据
>
> 换言之，redis 重启的话就根据日志文件的内容将写指令从前到后执行一次以完成数据的恢复工作

###### AOF持久化流程

1. 客户端的请求写命令会被 append 追加到 AOF 的缓冲区内；
2. AOF缓冲区根据AOF持久化策略[always,everysec,no]将操作sync同步到磁盘的AOF文件中；
3. AOF文件大小超过重写策略或手动重写时，会对AOF文件rewrite重写，压缩AOF文件容量；
4. Redis服务重启时，会重新load加载AOF文件中的写操作达到数据恢复的目的；

​	![image-20220515122221724](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515122221724.png)

###### 配置文件中关于AOF持久化的配置

1. AOF 默认不开启

   ```
   appendonly no
   ```

2. AOF持久化生成的文件默认为 appendonly.aof，与 dump.rdb 在同一路径下

3. AOF与RDB同时开启，系统默认取 **.aof** 文件中的数据

4. AOF 同步频率设置

   > appendfsync always  : 始终同步，每次Redis的写入都会立刻记入日志；性能较差但数据完整性比较好
   >
   > appendfsync everysec : 每秒同步，每秒记入日志一次，如果宕机，本秒的数据可能丢失。
   >
   > appendfsync no : redis不主动进行同步，把同步时机交给操作系统。

   ```
   appendfsync everysec (默认)
   ```

###### AOF优势

​	![image-20220515123112419](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515123112419.png)

- 备份机制更稳健，丢失数据概率更低
- 可读的日志文本，通过操作AOF文件，可以处理失误操作

###### AOF劣势

- 比起RDB占用更多的磁盘空间
- 恢复备份速度要慢
- 每次读写都同步的话，有一定的性能压力
- 存在个别bug，造成恢复失败



#### RDB&AOF

- 官方推荐两个都启用
- 如果对数据不敏感，可以单独用RDB
- 不建议单独使用AOF，可以回有BUG
- 如果只是做纯内存缓存，可以都不用



## Redis主从复制

###### 	简介

> 主机数据更新后，根据配置和策略， 自动同步到从机的master/slaver机制
>
> **Master以写为主，Slave以读为主**
>
> 优点：
>
> - 读写分离，性能扩展
> - 容灾快速恢复(从服务器挂掉后，快速切换到另一台从服务器进行读操作)
>
> ![image-20220515143835776](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515143835776.png)

#### 配置主从复制

> 从简单配置一主二从入手，使用一台服务器
>
> 主机端口 6380，从机端口6381，6382 
>
> ip ：127.0.0.1
>
> 博主的主从复制在 /root/Redis/master_slaver 下进行，方便后期管理与复习

1. 创建文件夹 master_slaver

   ```
   mkdir /root/Redis/master_slaver
   ```

2. 将原来的配置文件复制到当前目录

   ```
   cp /etc/redis.conf /root/Redis/master_slaver
   ```

3. 在 master_slaver 下创建文件 redis-6380.conf 填写以下内容

   ```
   include /root/Redis/master_slaver/redis.conf
   pidfile /var/run/redis_6380.pid
   port 6380
   dbfilename dump6380.rdb
   ```

4. 依照步骤 3 ，创建文件 redis-6381.conf 和 redis-6382.conf，并填写对应内容

5. 如果你配置果密码则需要在 /root/Redis/master_slaver/redis.conf 中，

   masterauth < master-password> 这一行下，配置你的密码

   ```
   masterauth xxxx
   ```

6. 任意目录下，更具你的三个配置文件，运行三个 redis-server

   ![image-20220515160535150](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515160535150.png)

7. 打开三个会话，每个会话通过不同端口号，连接不同客户端

   ```
   redis-cli -p 6380
   ```

8. 查看主从状态

   ```
   info replication
   ```

   ![image-20220515162001102](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515162001102.png)

9. 从机连接主机，主机不需要连接

   ```
   slaveof 127.0.0.1 6380
   ```

10. 再次查看主从状态

    ```
    info replication
    ```

    主机  

    ​	![image-20220515161759775](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515161759775.png)

​	   从机

​		![image-20220515161630380](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515161630380.png)

###### 	效果

> ​	主从复制，主机用来写，从机用来读，达到读写分离
>
> ​	主机写完后，从机自动复制，就可以读了
>
> ​	从机只能读，不能写

###### 常用操作

1. 一主二仆

   > 当连接上主服务器之后，从服务器向主服务器发送进行数据同步消息
   >
   > 主服务器接到从服务器发过来的同步消息，把主服务器数据进行持久化，rdb文件，把rdb文件发送到从服务器，从服务器拿到rdb进行读取
   >
   > 每次主服务器进行写操作之后，都会和从服务器进行数据同步

   当主机挂掉，再重启，它还是主机

   当从机挂掉，再重启，需要重新连接主机，自动同步主机所有数据

2. 薪火相传

   主机有从机，从机也可以有从机，从机的从机不在主机的从机列表里显示[doge]

3. 反客为主

   主机挂掉后，从机可以升职为主机，其它从机不用做任何修改。

   ```
   slaveof no noe
   ```

#### 哨兵模式

> 反客为主的自动版，能够监控主机是否故障，如果出现故障，则根据投票数自动将从服务器转变为主服务器
>
> ![image-20220515195500797](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220515195500797.png)

###### 	配置哨兵

1. 在 /root/Redis/master_slaver/ 下新建 sentinel.conf 文件，名字不能写错，否则无法识别

   ```
   vim /root/Redis/master_slaver/sentinel.conf
   ```

2. 填写内容

   ```
   sentinel monitor mymaster 127.0.0.1 6380 1
   
   #如果设置有密码的话，还需要在填写这个
   #sentinel auth-pass mymaster xxxx
   
   ```

3. 启动哨兵

   ```
   redis-sentinel /root/Redis/master_slaver/sentinel.conf
   ```

## Redis集群

###### 	简介

> Redis 集群实现了对Redis的水平扩容，即启动N个redis节点，将整个数据库分布存储在这N个节点中，每个节点存储总数据的1/N。
>
> Redis 集群通过分区（partition）来提供一定程度的可用性（availability）： 即使集群中有一部分节点失效或者无法进行通讯， 集群也可以继续处理命令请求。

#### 创建集群

> 博主的集群在 `/root/Redis/redis_cluster`下创建，方便后期管理与复习

###### 	创建步骤

1. 创建文件夹 redis_cluster

   ```
   mkdir /root/Redis/redis_cluster
   ```

2. 将**主从复制**中的 redis-6380.conf 和 redis.conf 复制过来

   ```
   cp /root/Redis/master_slaver/redis-6380.conf /root/Redis/redis_cluster/redis-6380.conf
   cp /root/Redis/master_slaver/redis.conf /root/Redis/redis_cluster/redis.conf
   ```

3. 修改 redis-6380.conf 内容

   ```
   include /root/Redis/redis_cluster/redis.conf
   
   pidfile /var/run/redis_6380.pid
   
   port 6380
   
   dbfilename dump6380.rdb
   
   cluster-enabled yes
   
   cluster-config-file nodes-6380.conf
   
   cluster-node-timeout 15000
   ```

4. 修改 redis.conf 中 文件生成位置

   ```
   dir /root/Redis/redis_cluster
   ```

5. 复制 redis-6380.conf 文件，并更改内容为对应端口

   ![image-20220516190217384](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516190217384.png)

6. 启动 redis 服务，共六个

   ```sh
   # 一个简陋的脚本
   
   #!/bin/bash
   redis-server Redis/redis_cluster/redis-7001.conf
   redis-server Redis/redis_cluster/redis-7002.conf
   redis-server Redis/redis_cluster/redis-7003.conf
   redis-server Redis/redis_cluster/redis-7004.conf
   redis-server Redis/redis_cluster/redis-7005.conf
   redis-server Redis/redis_cluster/redis-7006.conf
   redis-server Redis/redis_cluster/redis.conf
   
   echo ""
   echo -e "\e[32m redis集群启动成功！ \e[0m"
   echo ""
   
   ```

   ![image-20220516190302138](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516190302138.png)

7. 检查 /root/Redis/redis_cluster 下是否生成 六个 节点文件

   ![image-20220516190331945](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516190331945.png)

8. 到这儿就算是启动了集群，如果想在服务器推荐在windows端使用**[RedisDesktopManager](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/software/redis-7.0.0.tar.gz)**进行连接（记得开放端口）

###### 	简单问题

1. 集群如何分配节点

   > 一个集群至少要有三个主节点。
   >
   > 选项 --cluster-replicas 1 表示我们希望为集群中的每个主节点创建一个从节点。
   >
   > 分配原则尽量保证每个主数据库运行在不同的IP地址，每个从库和主库不在一个IP地址上。

2. 什么是插槽(slots)

   > 一个 Redis 集群包含 16384 个插槽（hash slot）， 数据库中的每个键都属于这 16384 个插槽的其中一个， 
   >
   > 集群使用公式 CRC16(key) % 16384 来计算键 key 属于哪个槽， 其中 CRC16(key) 语句用于计算键 key 的 CRC16 校验和 。
   >
   > 集群中的每个节点负责处理一部分插槽。 举个例子， 如果一个集群可以有主节点， 其中：
   >
   > 节点 A 负责处理 0 号至 5460 号插槽。
   >
   > 节点 B 负责处理 5461 号至 10922 号插槽。
   >
   > 节点 C 负责处理 10923 号至 16383 号插槽。

3. 故障恢复

   > 如果所有某一段插槽的主从节点都宕掉，redis服务是否还能继续?
   >
   > 如果某一段插槽的主从都挂掉，而cluster-require-full-coverage 为yes ，那么 ，整个集群都挂掉
   >
   > 如果某一段插槽的主从都挂掉，而cluster-require-full-coverage 为no ，那么，该插槽数据全都不能使用，也无法存储。
   >
   > redis.conf中的参数 cluster-require-full-coverage

###### 	优点

- 实现扩容
- 分摊压力
- 无中性化，配置相对简单

###### 	不足

- 多键操作不被支持
- 多键的 redis 食物不被支持
- lua脚本不被支持
- 由于集群方案出现较晚，很多公司已经采用了其他的集群方案，而代理或者客户端分片的方案想要迁移至redis cluster，需要整体迁移而不是逐步过渡，复杂度较大。

​	

## Redis应用问题

#### 缓存穿透

###### 	问题描述

> key对应的数据在数据源并不存在，每次针对此key的请求从缓存获取不到，请求都会压到数据源，从而可能压垮数据源。比如用一个不存在的用户id获取用户信息，不论缓存还是数据库都没有，若黑客利用此漏洞进行攻击可能压垮数据库。
>
> ![image-20220516195541685](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516195541685.png)

###### 	解决方案	

> 一个一定不存在缓存及查询不到的数据，由于缓存是不命中时被动写的，并且出于容错考虑，如果从存储层查不到数据则不写入缓存，这将导致这个不存在的数据每次请求都要到存储层去查询，失去了缓存的意义。

1. **对空值缓存：**如果一个查询返回的数据为空（不管是数据是否不存在），我们仍然把这个空结果（null）进行缓存，设置空结果的过期时间会很短，最长不超过五分钟；

2. **设置可访问的名单（白名单）：**

   使用bitmaps类型定义一个可以访问的名单，名单id作为bitmaps的偏移量，每次访问和bitmap里面的id进行比较，如果访问id不在bitmaps里面，进行拦截，不允许访问。

3. **采用布隆过滤器**：(布隆过滤器（Bloom Filter）是1970年由布隆提出的。它实际上是一个很长的二进制向量(位图)和一系列随机映射函数（哈希函数）。布隆过滤器可以用于检索一个元素是否在一个集合中。它的优点是空间效率和查询时间都远远超过一般的算法，缺点是有一定的误识别率和删除困难。)

   将所有可能存在的数据哈希到一个足够大的bitmaps中，一个一定不存在的数据会被 这个bitmaps拦截掉，从而避免了对底层存储系统的查询压力。

4. **进行实时监控：**当发现Redis的命中率开始急速降低，需要排查访问对象和访问的数据，和运维人员配合，可以设置黑名单限制服务

#### 缓存击穿

###### 	问题描述

> key对应的数据存在，但在redis中过期，此时若有大量并发请求过来，这些请求发现缓存过期一般都会从后端DB加载数据并回设到缓存，这个时候大并发的请求可能会瞬间把后端DB压垮。
>
> ![image-20220516195531246](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516195531246.png)

###### 	解决方案

> key可能会在某些时间点被超高并发地访问，是一种非常“热点”的数据。这个时候，需要考虑一个问题：缓存被“击穿”的问题。。

1. **预先设置热门数据：**在redis高峰访问之前，把一些热门数据提前存入到redis里面，加大这些热门数据key的时长

2. **实时调整：**现场监控哪些数据热门，实时调整key的过期时长

3. **使用锁**

   1. 就是在缓存失效的时候（判断拿出来的值为空），不是立即去load db。

   2. 先使用缓存工具的某些带成功操作返回值的操作（比如Redis的SETNX）去set一个mutex key

   3. 当操作返回成功时，再进行load db的操作，并回设缓存,最后删除mutex key；

   4. 当操作返回失败，证明有线程在load db，当前线程睡眠一段时间再重试整个get缓存的方法。

      ![image-20220516195828891](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516195828891.png)

#### 缓存雪崩

###### 	问题描述

> key对应的数据存在，但在redis中过期，此时若有大量并发请求过来，这些请求发现缓存过期一般都会从后端DB加载数据并回设到缓存，这个时候大并发的请求可能会瞬间把后端DB压垮。
>
> 缓存雪崩与缓存击穿的区别在于这里针对很多key缓存，前者则是某一个key
>
> 
>
> 正常访问
>
> ![image-20220516195905239](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516195905239.png)
>
> 缓存失效瞬间
>
> ![image-20220516195946074](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516195946074.png)

###### 	解决方案

> 缓存失效时的雪崩效应对底层系统的冲击非常可怕！

1. **构建多级缓存架构：**nginx缓存 + redis缓存 +其他缓存（ehcache等）

2. **使用锁或队列：**

   ​		用加锁或者队列的方式保证来保证不会有大量的线程对数据库一次性进行读写，从而避免失效时大量的并发请求落到底层存储系统上。不适用高并发情况

3. **设置过期标志更新缓存：**

   记录缓存数据是否过期（设置提前量），如果过期会触发通知另外的线程在后台去更新实际key的缓存。

4. **将缓存失效时间分散开：**

   比如我们可以在原有的失效时间基础上增加一个随机值，比如1-5分钟随机，这样每一个缓存的过期时间的重复率就会降低，就很难引发集体失效的事件。

#### 分布式锁

###### 	问题描述

> 随着业务发展的需要，原单体单机部署的系统被演化成分布式集群系统后，由于分布式系统多线程、多进程并且分布在不同机器上，这将使原单机部署情况下的并发控制锁策略失效，单纯的Java API并不能提供分布式锁的能力。为了解决这个问题就需要一种跨JVM的互斥机制来控制共享资源的访问，这就是分布式锁要解决的问题！
>
> 分布式锁主流的实现方案：
>
> 1. 基于数据库实现分布式锁
>
> 2. 基于缓存（Redis等）
>
> 3. 基于Zookeeper
>
>    每一种分布式锁解决方案都有各自的优缺点：
>
> 4. 性能：redis最高
>
> 2. 可靠性：zookeeper最高
>
> 
>
> 这里，我们就基于redis实现分布式锁。

###### 	解决方案

> redis:命令
>
> ```
> # set sku:1:info “OK” NX PX 10000
> ```
>
> EX second ：设置键的过期时间为 second 秒。 SET key value EX second 效果等同于 SETEX key second value 。
>
> PX millisecond ：设置键的过期时间为 millisecond 毫秒。 SET key value PX millisecond 效果等同于 PSETEX key millisecond value 。
>
> NX ：只在键不存在时，才对键进行设置操作。 SET key value NX 效果等同于 SETNX key value 。
>
> XX ：只在键已经存在时，才对键进行设置操作。
>
> ![image-20220516200223491](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220516200223491.png)
>
> 
>
> 1. 多个客户端同时获取锁（setnx）
>
> 2. 获取成功，执行业务逻辑{从db获取数据，放入缓存}，执行完成释放锁（del）
>
> 3. 其他客户端等待重试

## 总结

​		首先非常感谢耐心看到这里的朋友！

​		这篇文章是博主在学习 Redis 时做的笔记，主要目的是留点印象，方便日后翻阅复习。这篇文章毕竟是面向新手小白，内容略有浅显，一些深入的地方未加探讨。博主也在努力学习新知中，或许后续会发布些较为深入的文章，期待您的来访！

​		如发现文中有错误的地方，还望能联系博主，定及时更改。
