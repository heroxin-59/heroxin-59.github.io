---
#文章标题
title: ZooKeeper
#文章创建日期
date: 2022-06-10 10:30:00
#文章更新日期
updated: 2022-10-25 10:30:00
#文章标签
tags: [ZooKeeper,Linux,分布式] 
#文章分类
categories: 
	- [分布式]
	- [技术栈]
#文章关键字
keywords: ZooKeeper
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---
# Zookeeper

## 入门

#### 概述

​	ZooKeeper是一个分布式的，开放源码的**分布式应用程序**协调服务，是Google的Chubby一个开源的实现，是	`Hadoop`和`Hbase`的重要组件。它是一个为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。

​	ZooKeeper的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。

​	ZooKeeper包含一个简单的原语集，提供Java和C的接口。

​	ZooKeeper代码版本中，提供了**分布式独享锁、选举、队列**的接口

#### 工作机制

​	从设计模式角度来理解：是一个基于观察者模式设计的分布式服务管理框架，它负责存储和管理大家都关心的数据，然后接受观察者的注册，一旦这些数据的状态发生变化，Zookeeper就将负责通知已经在Zookeeper上注册过的那些观察者做出相应的反应。

#### 特点

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220610160548905.png)

1. zookeeper：一个领导者，多个跟随者组成的集群；(一主多从 ？)
2. 集群中只要有半数以上节点存活，zookeeper集群就能够正常服务，所以zookeeper适合安装奇数台服务器
3. 全局数据一致性：每个 Server 保存一份相同的数据副本，Client 无论连接到哪个 Server ，数据都是一致的
4. 更新请求顺序执行：来自同一个Client的更新请求按其发送顺序依次执行
5. 数据更新原子性：一次数据要么成功，要么失败
6. 实时性：在一定时间范围内，Client能够读取到最新数据

#### 应用场景

###### 	统一命名服务

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220610161040584.png)

###### 	统一配置管理

​	![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220610161131997.png)

###### 	统一集群管理

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220610161309289.png)

###### 	服务器动态上下线

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220610161328882.png)

###### 	软负载均衡

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220610161328882.png)

#### 安装单机版

1. 安装 JDK ，推荐 1.8

   ```
   [root@heroxin001 ~]# java -version
   openjdk version "1.8.0_262"
   OpenJDK Runtime Environment (build 1.8.0_262-b10)
   OpenJDK 64-Bit Server VM (build 25.262-b10, mixed mode)
   ```

3. 将 `apache-zookeeper-3.5.7tar.gz`上传至`software`后进行解压

   ```
   tar -zxvf /usr/software/apache-zookeeper-3.5.7.tar.gz -C /usr/local/zookeeper-3.5.7
   ```

4. 修改缓存路径

   ```
   # 放置缓存文件的文件夹
   mkdir /usr/local/zookeeper-3.5.7/data
   # 进入配置文件目录
   cd /usr/local/zookeeper-3.5.7/conf/
   # 修改zoo_sample.cfg 中的dataDir
   dataDir=/usr/software/zookeeper-3.5.7/data
   ```

5. 更改配置文件名

   ```
   #进入配置文件目录后
   mv zoo_sample.cfg zoo.cfg
   ```

#### 启动

1. 启动服务

   ```
   [root@heroxin001 ~]# /usr/local/zookeeper-3.5.7/bin/zkServer.sh start
   /usr/bin/java
   ZooKeeper JMX enabled by default
   Using config: /opt/module/apache-zookeeper-3.5.7-bin/bin/../conf/zoo.cfg
   Starting zookeeper ... STARTED
   ```

2. 查看状态

   ```
   [root@heroxin001 ~]# /usr/local/zookeeper-3.5.7/bin/zkServer.sh status
   /usr/bin/java
   ZooKeeper JMX enabled by default
   Using config: /opt/module/apache-zookeeper-3.5.7-bin/bin/../conf/zoo.cfg
   Client port found: 2181. Client address: localhost.
   Mode: standalone
   ```

3. 启动客户端

   ```
   [root@heroxin001 ~]# /usr/local/zookeeper-3.5.7/bin/zkCli.sh 
   /usr/bin/java
   Connecting to localhost:2181
   ```

4. 退出客户端

   ```
   [zk: localhost:2181(CONNECTED) 2] quit
   ```

4. 关闭服务

   ```
   [root@heroxin001 ~]# /usr/local/zookeeper-3.5.7/bin/zkServer.sh stop
   /usr/bin/java
   ZooKeeper JMX enabled by default
   Using config: /opt/module/apache-zookeeper-3.5.7-bin/bin/../conf/zoo.cfg
   Stopping zookeeper ... STOPPED
   ```



## 配置文件

​	![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016160316598.png)

1. tickTime=2000：通信心跳时间，Zookeeper服务器与客户端心跳时间，单位毫秒。

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016161012316.png)

2. initLimit=10：LF初始通信时限

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016160947816.png)

   集群中的Follower跟随者与Leader领导者服务器之间初始连接时能容忍的最大心跳数（tickTime的数量）。就是集群刚启动，第一次初始化连接时，如果超过 initLimit * tickTime，则判断死亡

3. syncLimit=5：LF同步通信时限

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016160931739.png)

   Leader和Follower之间通信时间(响应时间)如果超过==syncLimit * tickTime==，Leader认为Follwer死

4. dataDir：缓存文件路径

   默认的tmp目录，容易被Linux系统定期删除，所以一般不用默认的tmp目录

5. clientPort=2181：端口号

6. server.A=B:C:D

   A：表示这是第几号服务器(/data/myid)

   B：服务器地址

   C：是此服务器Follower与集群中Leader服务器交换信息的端口号

   D：万一Leader挂了，需要一个端口来重新进行选举，选出一个新的Leader，而这个端口就是用来执行选举时期服务器相互通信的端口

## 集群操作

#### 选举机制

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016163354196.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016163425427.png)

#### 配置集群

1. 将解压后的 `apache-zookeeper-3.5.7-bin` 复制三份到 `/usr/local/zookeeper`下

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016145826789.png)

2. 对每一个zookeeper文件都创建 data 目录

   ```
   mkdir zookeeper01/data
   ```

3. 对每一个zookeeper文件都创建 myid文件，内容分别为 1，2，3

   ```
   echo 1 >> zookeeper01/data/myid
   ```

4. 修改每一个zookeeper的配置文件(缓存路径，端口号，集群配置)

   ==zookeeper01==

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016150502691.png)

   ==zookeeper02==

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016150622646.png)

   ==zookeeper03==

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016150659069.png)

5. 依次启动zookeeper，查看其状态，一个leader，两个follower

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221016155010187.png)

   

## 命令

#### 数据结构

> Zookeeper数据模型的结构与Unix文件系统很类似，整体上可以看作是一棵树
>
> 每个节点称作一个ZNode，每个ZNode默认能够存储 `1MB`的数据
>
> 每个节点上都会保存自己的数据和节点信息
>
> 每个ZNode都可以通过其他路径唯一标识

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220610160909204.png)



节点可以分为四大类

- PERSISTENT 持久化节点 
- EPHEMERAL 临时节点 -e  ==只在当前的会话中有效，当客户端断开后丢失==
- PERSISTENT_SWQUENTIAL 持久化顺序节点 -s
- EPHEMERAL_SEQUENTIAL 临时顺序节点 -es ==节点后会有 _1==

#### 客户端命令

1. 连接客户端

   ```
    ./zkCli.sh -server localhost:2181
   ```

2. 查看节点

   ```
    ls /
    #查看详细信息
    ls -s /	
   ```

3. 新建节点

   ```shell
   create /newNode heroxin
   #新建空节点
   create /newNode
   #新建临时节点
   create -e /newNode
   #新建顺序节点
   create -s /newNode
   #新建临时顺序节点
   create -es /newNode
   ```

4. 获取节点信息

   ```
   get /newNode
   ```

5. 设置节点信息

   ```
   set /newNode hero
   ```

6. 删除节点

   ```
   delete /newNode
   #当该节点下还有其他节点时
   deleteall /newNode
   ```

## JavaAPI

```
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.api.BackgroundCallback;
import org.apache.curator.framework.api.CuratorEvent;
import org.apache.curator.retry.ExponentialBackoffRetry;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.Stat;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

public class CuratorTest {


    private CuratorFramework client;

    /**
     * 建立连接
     */
    @Before
    public void testConnect() {

        //重试策略
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);
        //2.第二种方式
        //CuratorFrameworkFactory.builder();
        client = CuratorFrameworkFactory.builder()
                .connectString("192.168.196.101:2181,192.168.196.101:2182,192.168.196.101:2183")
                .sessionTimeoutMs(60 * 1000)
                .connectionTimeoutMs(15 * 1000)
                .retryPolicy(retryPolicy)
//                .namespace("itheima")
                .build();

        //开启连接
        client.start();

    }

    @Test
    public void testCreate() throws Exception {
        //1. 基本创建
        //如果创建节点，没有指定数据，则默认将当前客户端的ip作为数据存储
        String path = client.create().forPath("/app1");
        System.out.println(path);

    }

    @Test
    public void testCreate2() throws Exception {
        //2. 创建节点 带有数据
        //如果创建节点，没有指定数据，则默认将当前客户端的ip作为数据存储
        String path = client.create().forPath("/app2", "hehe".getBytes());
        System.out.println(path);

    }

    @Test
    public void testCreate3() throws Exception {
        //3. 设置节点的类型
        //默认类型：持久化
        String path = client.create().withMode(CreateMode.EPHEMERAL).forPath("/app3");
        System.out.println(path);
    }

    @Test
    public void testCreate4() throws Exception {
        //4. 创建多级节点  /app1/p1
        //creatingParentsIfNeeded():如果父节点不存在，则创建父节点
        String path = client.create().creatingParentsIfNeeded().forPath("/app4/p1");
        System.out.println(path);
    }

    /**
     * 查询节点：
     * 1. 查询数据：get: getData().forPath()
     * 2. 查询子节点： ls: getChildren().forPath()
     * 3. 查询节点状态信息：ls -s:getData().storingStatIn(状态对象).forPath()
     */

    @Test
    public void testGet1() throws Exception {
        //1. 查询数据：get
        byte[] data = client.getData().forPath("/app1");
        System.out.println(new String(data));
    }

    @Test
    public void testGet2() throws Exception {
        // 2. 查询子节点： ls
        List<String> path = client.getChildren().forPath("/");

        System.out.println(path);
    }

    @Test
    public void testGet3() throws Exception {
        Stat status = new Stat();
        System.out.println(status);
        //3. 查询节点状态信息：ls -s
        client.getData().storingStatIn(status).forPath("/app1");
        System.out.println(status);

    }

    @Test
    public void testSet() throws Exception {
        client.setData().forPath("/app1", "itcast".getBytes());
    }
    @Test
    public void testSetForVersion() throws Exception {
        Stat status = new Stat();
        //3. 查询节点状态信息：ls -s
        client.getData().storingStatIn(status).forPath("/app1");
        int version = status.getVersion();//查询出来的 3
        System.out.println(version);
        client.setData().withVersion(version).forPath("/app1", "hehe".getBytes());
    }

    /**
     * 删除节点： delete deleteall
     * 1. 删除单个节点:delete().forPath("/app1");
     * 2. 删除带有子节点的节点:delete().deletingChildrenIfNeeded().forPath("/app1");
     * 3. 必须成功的删除:为了防止网络抖动。本质就是重试。  client.delete().guaranteed().forPath("/app2");
     * 4. 回调：inBackground
     * @throws Exception
     */
    @Test
    public void testDelete() throws Exception {
        // 1. 删除单个节点
        client.delete().forPath("/app1");
    }
    @Test
    public void testDelete2() throws Exception {
        //2. 删除带有子节点的节点
        client.delete().deletingChildrenIfNeeded().forPath("/app4");
    }
    @Test
    public void testDelete3() throws Exception {
        //3. 必须成功的删除
        client.delete().guaranteed().forPath("/app2");
    }
    @Test
    public void testDelete4() throws Exception {
        //4. 回调
        client.delete().guaranteed().inBackground(new BackgroundCallback(){
            @Override
            public void processResult(CuratorFramework client, CuratorEvent event) throws Exception {
                System.out.println("我被删除了~");
                System.out.println(event);
            }
        }).forPath("/app1");
    }
    @After
    public void close() {
        if (client != null) {
            client.close();
        }
    }
}

```

## CuratorAPI

#### Watch事件监听

> Zookeeper 允许客户在指定节点上注册一些Watcher，并且在一些特定事件触发的时候，Zookeeper服务器会将时间通知到感兴趣的客户端上去，该机制时Zookeeper实现分布式协调服务的重要特征
>
> Curator引入了Cache来实现对Zookeeper服务端事件的监听
>
> Zookeeper提供了三种Watcher：
>
> - NodeCache：只是监听某个特定的节点
> - PathChildrenCache：监听一个ZNode的子节点
> - TreeCache：可以监控整个树上的所有节点，类似前两种方式的组合

```
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.api.BackgroundCallback;
import org.apache.curator.framework.api.CuratorEvent;
import org.apache.curator.framework.recipes.cache.*;
import org.apache.curator.retry.ExponentialBackoffRetry;
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.data.Stat;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

public class CuratorWatcherTest {

    private CuratorFramework client;
    @Before
    public void testConnect() {
        //重试策略
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);
        //2.第二种方式
        //CuratorFrameworkFactory.builder();
        client = CuratorFrameworkFactory.builder()
                .connectString("192.168.149.135:2181")
                .sessionTimeoutMs(60 * 1000)
                .connectionTimeoutMs(15 * 1000)
                .retryPolicy(retryPolicy)
//                .namespace("itheima")
                .build();

        //开启连接
        client.start();

    }

    @After
    public void close() {
        if (client != null) {
            client.close();
        }
    }

    /**
     * 演示 NodeCache：给指定一个节点注册监听器
     */
    @Test
    public void testNodeCache() throws Exception {
        //1. 创建NodeCache对象
        final NodeCache nodeCache = new NodeCache(client,"/app1");
        //2. 注册监听
        nodeCache.getListenable().addListener(new NodeCacheListener() {
            @Override
            public void nodeChanged() throws Exception {
                System.out.println("节点变化了~");

                //获取修改节点后的数据
                byte[] data = nodeCache.getCurrentData().getData();
                System.out.println(new String(data));
            }
        });
        //3. 开启监听.如果设置为true，则开启监听是，加载缓冲数据
        nodeCache.start(true);
        while (true){

        }
    }
    /**
     * 演示 PathChildrenCache：监听某个节点的所有子节点们
     */

    @Test
    public void testPathChildrenCache() throws Exception {
        //1.创建监听对象
        PathChildrenCache pathChildrenCache = new PathChildrenCache(client,"/app2",true);

        //2. 绑定监听器
        pathChildrenCache.getListenable().addListener(new PathChildrenCacheListener() {
            @Override
            public void childEvent(CuratorFramework client, PathChildrenCacheEvent event) throws Exception {
                System.out.println("子节点变化了~");
                System.out.println(event);
                //监听子节点的数据变更，并且拿到变更后的数据
                //1.获取类型
                PathChildrenCacheEvent.Type type = event.getType();
                //2.判断类型是否是update
                if(type.equals(PathChildrenCacheEvent.Type.CHILD_UPDATED)){
                    System.out.println("数据变了！！！");
                    byte[] data = event.getData().getData();
                    System.out.println(new String(data));
                }
            }
        });
        //3. 开启
        pathChildrenCache.start();

        while (true){

        }
    }

    /**
     * 演示 TreeCache：监听某个节点自己和所有子节点们
     */
    @Test
    public void testTreeCache() throws Exception {
        //1. 创建监听器
        TreeCache treeCache = new TreeCache(client,"/app2");

        //2. 注册监听
        treeCache.getListenable().addListener(new TreeCacheListener() {
            @Override
            public void childEvent(CuratorFramework client, TreeCacheEvent event) throws Exception {
                System.out.println("节点变化了");
                System.out.println(event);
            }
        });

        //3. 开启
        treeCache.start();

        while (true){

        }
    }

}
```

