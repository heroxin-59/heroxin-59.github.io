---
#文章标题
title: 线程池
#文章创建日期
date: 2023-04-28 10:30:00
#文章更新日期
updated: 2023-05-28 10:30:00
#文章标签
tags: [JUC,Java] 
#文章分类
categories: 
	- [知识点]
#文章关键字
keywords: 
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图

---


# 线程池



## 七大参数

| 参数名                            | 释义                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| int corePoolSize                  | 核心线程数，线程池创建好之后就准备就绪的线程数量，就等待来接收异步任务；只要线程池不销毁，就一直存在 |
| int maximumPoolSize               | 最大线程数量，控制资源                                       |
| long keepAliveTime                | 当前线程数量大于核心数量， 只要线程空闲大于指定时间，就会释放。核心线程是不释放的。 |
| TimeUnit unit                     | 超时单位                                                     |
| BlockingQueue<Runnable> workQueue | 阻塞队列，如果任务数超过核心程数量，就会将多余的任务放到队列当中，只要线程空闲，就会从队列中取出任务 |
| ThreadFactory threadFactory       | 线程的创建工厂，通常默认，不做修改                           |
| RejectedExecutionHandler handler  | 拒接策略，如果队列满了，按照我们的定义的拒绝策略来拒绝任务。 |

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```



## 四种拒绝策略

| 拒绝策略名            | 释义                                                         |
| --------------------- | ------------------------------------------------------------ |
| AbortPolicy()         | 队列满了，抛出异常                                           |
| CallerRunsPolicy()    | 直接 **同步** 调用它的这个任务的 run 方法，因为使用继承 runnable 接口实现多线程时，runnable 里的 run 方法是同步调用，想要异步调用就得使用 new thread().start(); |
| DiscardPolicy()       | 队列满了，丢掉任务，不会抛出异常                             |
| DiscardOldestPolicy() | 队列满了，尝试和最早进来的，还未执行的线程竞争，如果成功就执行，不成功就丢弃，不会抛出异常 |




<!-- tab AbortPolicy-->

```java
public static class AbortPolicy implements RejectedExecutionHandler {
    /**
     * Creates an {@code AbortPolicy}.
     */
    public AbortPolicy() { }

    /**
     * Always throws RejectedExecutionException.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     * @throws RejectedExecutionException always
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        throw new RejectedExecutionException("Task " + r.toString() +
                                             " rejected from " +
                                             e.toString());
    }
}
```

<!-- endtab -->

<!-- tab CallerRunsPolicy-->

```java
public static class CallerRunsPolicy implements RejectedExecutionHandler {
    /**
     * Creates a {@code CallerRunsPolicy}.
     */
    public CallerRunsPolicy() { }

    /**
     * Executes task r in the caller's thread, unless the executor
     * has been shut down, in which case the task is discarded.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            r.run();
        }
    }
}
```

<!-- endtab -->

<!-- tab DiscardPolicy-->

```java
public static class DiscardPolicy implements RejectedExecutionHandler {
    /**
     * Creates a {@code DiscardPolicy}.
     */
    public DiscardPolicy() { }

    /**
     * Does nothing, which has the effect of discarding task r.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
    }
}
```

<!-- endtab -->

<!-- tab DiscardOldestPolicy-->

```java
public static class DiscardOldestPolicy implements RejectedExecutionHandler {
    /**
     * Creates a {@code DiscardOldestPolicy} for the given executor.
     */
    public DiscardOldestPolicy() { }

    /**
     * Obtains and ignores the next task that the executor
     * would otherwise execute, if one is immediately available,
     * and then retries execution of task r, unless the executor
     * is shut down, in which case task r is instead discarded.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            e.getQueue().poll();
            e.execute(r);
        }
    }
}
```

<!-- endtab -->



## 三大方法

| 方法名                           | 释义                     |
| -------------------------------- | ------------------------ |
| newSingleThreadExecutor()        | 单个线程                 |
| newFixedThreadPool(int nThreads) | 创建一个固定大小的线程池 |
| newCachedThreadPool()            | 大小可变化的线程池       |

> 其他方法：newScheduledThreadPool()，创建一个定长线程池，支持定时及周期性任务执行。



<!-- tab newSingleThreadExecutor-->

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

<!-- endtab -->

<!-- tab newFixedThreadPool-->

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```

<!-- endtab -->

<!-- tab newCachedThreadPool-->

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

<!-- endtab -->





## 线程池运行流程

1、线程池创建，准备好 core 数量的核心线程，准备接受任务

2、新的任务进来，用 core 准备好的空闲线程执行。

- core 满了，就将再进来的任务放入阻塞队列中。空闲的 core 就会自己去阻塞队 列获取任务执行 
- 阻塞队列满了，就直接开新线程执行，最大只能开到 max 指定的数量 
- max 都执行好了。Max-core 数量空闲的线程会在 keepAliveTime 指定的时间后自 动销毁。最终保持到 core 大小
- 如果线程数开到了 max 的数量，还有新任务进来，就会使用 reject 指定的拒绝策 略进行处理

3、所有的线程创建都是由指定的 factory 创建的。



## 线程池的优点

- 降低资源的消耗

  通过重复利用已经创建好的线程降低线程的创建和销毁带来的损耗 

- 提高响应速度

  因为线程池中的线程数没有超过线程池的最大上限时，有的线程处于等待分配任务 的状态，当任务来时无需创建新的线程就能执行

- 提高线程的可管理性

  线程池会根据当前系统特点对池内的线程进行优化处理，减少创建和销毁线程带来 的系统开销。无限的创建和销毁线程不仅消耗系统资源，还降低系统的稳定性，使 用线程池进行统一分配

## 最大线程定义方法

- CPU密集型：电脑核数为几，就定义为几，可以保证CPU效率最高

  ```java
  // 获取电脑逻辑处理器个数
  System.out.println(Runtime.getRuntime().availableProcessors());
  ```

  

- IO密集型：设置为 IO 任务数量的两倍

## 实例

```JAVA
import java.util.concurrent.*;

public class test01 {
    public static void main(String[] args) {
        /*
        * 线程池的三大方法
        * */
        //        单个线程
        //        ExecutorService threadPool = Executors.newSingleThreadExecutor();
        //        创建一个固定大小的线程池
        //        ExecutorService threadPool = Executors.newFixedThreadPool(5);
        //        可变化的线程池
        //        ExecutorService threadPool = Executors.newCachedThreadPool();
        //        定时任务线程池

        /*
        * 其他方法：创建定时任务线程池
        * */
        //        ScheduledExecutorService threadPool = Executors.newScheduledThreadPool(10);



        //        手动创建线程池
        ThreadPoolExecutor threadPool = new ThreadPoolExecutor(
            2,
            Runtime.getRuntime().availableProcessors(),
            3,
            TimeUnit.SECONDS,
            new LinkedBlockingDeque<>(3),
            Executors.defaultThreadFactory(),
            // 有四种拒绝策略
            new ThreadPoolExecutor.AbortPolicy()   // 队列满了，抛出异常
        );

        try {
            //            最大接受 maximumPoolSize + capacity，超过就会被拒绝策略接收
            for (int i = 0; i < 10; i++) {
                threadPool.execute(() -> {
                    System.out.println(Thread.currentThread().getName() + "   ok");
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            //            线程池用完，程序结束，关闭线程池
            threadPool.shutdown();
        }
    }
}
```



## 面试问题



问题：一个线程池中，core：7，max：20，queue：50，100个并发进来怎么分配 ？





7个会立即得到执行，50个进入队列，再开  13 个线程进行执行。剩下的 30 个使用拒绝策略执行。

