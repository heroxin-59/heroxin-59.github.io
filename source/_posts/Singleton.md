---
#文章标题
title: 单例模式
#文章创建日期
date: 2023-06-13 10:30:00
#文章更新日期
updated: 2024-04-15 10:30:00
#文章标签
tags: [设计模式,Singleton] 
#文章分类
categories: 
    - [知识点,设计模式]
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

# 设计模式

> 设计模式是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。
>
> 使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。





设计模式分为三大类（23种）：

- 创建模型模式：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式
- 结构型模式：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式
- 行为型模式：策略模式、模板方法模式、观察者模式、迭代子模式、责任模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式





# 单例模式

> 单例模式（singleton）：某个类只能生成一个实例，该类提供了一个全局访问点（一个公共方法）供外部获取该实例。

优点：

- 只有一个实例，节约内存资源，提高系统性能。

- 某些类创建比较频繁，对于一些大型的对象，这是一笔很大的系统开销。
- 省去了new操作符，降低了系统内存的使用频率，减轻GC压力。
- 有些类如交易所的核心交易引擎，控制着交易流程，如果该类可以创建多个的话，系统完全乱了。（比如一个军队出现了多个司令员同时指挥，肯定会乱成一团），所以只有使用单例模式，才能保证核心交易服务器独立控制整个流程。

缺点：

- 没有抽象层，不能拓展



> 在登录场景下使用单例模式是很常见的，因为登录状态通常是全局的，需要在应用程序的多个地方进行访问。通过单例模式，可以确保在整个应用程序生命周期内只有一个登录实例存在，从而避免了多次登录或者状态不一致的情况



## 饿汉式

{% tabs note %}
<!-- tab 代码-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin

    @Create 2023-06-13-15:03

    @Description:

    1. 饿汉式
      构造私有：其他类无法调用构造方法创建实例对象
      提供静态成员变量，类型为单例类型，值为私有构造创建的唯一实例
      公有静态方法 getInstance()，方法的实现为返回静态成员变量
*/

import java.io.Serializable;

public class Singleton01 implements Serializable {
    private Singleton01() {
        //      防止反射构造单例
        if (INSTANCE != null) {
            throw new RuntimeException("单例对象不能重复创建");
        }
        System.out.println("private Singleton01()：饿汉式");
    }

    private static final Singleton01 INSTANCE = new Singleton01();

    public static Singleton01 getInstance() {
        return INSTANCE;
    }

    public static void otherMethod() {
        System.out.println("otherMethod()");
    }

    //    防止反序列化构造单例
    public Object readResolve() {
        return INSTANCE;
    }
}

```

<!-- endtab -->

<!-- tab 测试-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin

    @Create 2023-06-13-15:13

    @Description:
*/

import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class TestSingleton01 {
    public static void main(String[] args) throws Exception {
        Singleton01.otherMethod();
        System.out.println("===============");
        System.out.println(Singleton01.getInstance());
        System.out.println(Singleton01.getInstance());

        //        反射破坏单例
        //        reflection(Singleton01.class);

        //        反序列化破坏单例
        //        serializable(Singleton01.getInstance());
    }

    private static void serializable(Object instance) throws IOException, ClassNotFoundException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(instance);
        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bos.toByteArray()));
        System.out.println("反序列化创建实例：" + ois.readObject());
    }

    private static void reflection(Class<?> clazz) throws NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {
        for (Constructor<?> constructor : clazz.getDeclaredConstructors()) {
            System.out.println(constructor);
        }
        Constructor<?> constructor = clazz.getDeclaredConstructor();
        constructor.setAccessible(true);
        System.out.println("反射创建实例：" + constructor.newInstance());
    }
}

```

<!-- endtab -->

{% endtabs %}

## 饿汉式 --- 枚举

{% tabs note %}
<!-- tab 代码-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin

    @Create 2023-06-13-15:03

    @Description:

    1. 枚举饿汉式
        不怕反射破坏单例，
        不怕反序列化破坏单例，

*/


public enum Singleton02 {
    INSTANCE;

    Singleton02() {
        System.out.println("private Singleton02()：饿汉式 --- m");
    }

    public static Singleton02 getInstance() {
        return INSTANCE;
    }

    public static void otherMethod() {
        System.out.println("otherMethod()");
    }

    @Override
    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
}

```

<!-- endtab -->

<!-- tab 测试-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin
    
    @Create 2023-06-13-15:13

    @Description:
*/

import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class TestSingleton02 {
    public static void main(String[] args) throws Exception {
        Singleton02.otherMethod();
        System.out.println("===============");
        System.out.println(Singleton02.getInstance());
        System.out.println(Singleton02.getInstance());
    }

}

```

<!-- endtab -->

{% endtabs %}

## 懒汉式

{% tabs note %}
<!-- tab 代码-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin
    
    @Create 2023-06-13-15:03

    @Description:

    1. 懒汉式
      懒惰式加载，只有在第一次调用时才创建
      在多线程下，会创建多个实例，可以通过加锁来防止
*/

import java.io.Serializable;

public class Singleton03 implements Serializable {
    private Singleton03() {

        System.out.println("private Singleton03()：懒汉式");
    }

    private static Singleton03 INSTANCE = null;

    public static synchronized Singleton03 getInstance() {
//        有值就不重复创建
        if (INSTANCE == null) {
            INSTANCE = new Singleton03();
        }
        return INSTANCE;
    }

    public static void otherMethod() {
        System.out.println("otherMethod()");
    }

}

```

<!-- endtab -->

<!-- tab 测试-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin
    
    @Create 2023-06-13-15:13

    @Description:
*/

import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class TestSingleton03 {
    public static void main(String[] args) throws Exception {
        Singleton03.otherMethod();
        System.out.println("===============");
        System.out.println(Singleton03.getInstance());
        System.out.println(Singleton03.getInstance());
    }

}

```

<!-- endtab -->

{% endtabs %}

## 懒汉式 --- DCL

{% tabs note %}
<!-- tab 代码-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin

    @Create 2023-06-13-15:03

    @Description:

    1. 懒汉式 --- DCL 双检索
*/

import java.io.Serializable;

public class Singleton04 implements Serializable {
    private Singleton04() {

        System.out.println("private Singleton04()：懒汉式 -- DCL");
    }

    private static volatile Singleton04 INSTANCE = null;

    public static Singleton04 getInstance() {
        //        有值就不重复创建
        if (INSTANCE == null) {
            synchronized (Singleton04.class) {
                if (INSTANCE == null) {
                    INSTANCE = new Singleton04();
                }
            }
        }
        return INSTANCE;
    }

    public static void otherMethod() {
        System.out.println("otherMethod()");
    }

}

```

<!-- endtab -->

<!-- tab 测试-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin

    @Create 2023-06-13-15:13

    @Description:
*/

import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class TestSingleton04 {
    public static void main(String[] args) throws Exception {
        Singleton04.otherMethod();
        System.out.println("===============");
        System.out.println(Singleton04.getInstance());
        System.out.println(Singleton04.getInstance());
    }

}

```

<!-- endtab -->

{% endtabs %}



## 懒汉式 --- 内部类

{% tabs note %}
<!-- tab 代码-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin

    @Create 2023-06-13-15:03

    @Description:

    1. 懒汉式 --- 内部类
    对象的创建放在静态代码块中，由 jvm保证线程安全
*/

import java.io.Serializable;

public class Singleton05 implements Serializable {
    private Singleton05() {
        System.out.println("private Singleton05()：懒汉式 -- 内部类");
    }

    //    静态内部类，可以访问外部的私有变量，私有构造
    //    懒惰式加载，在调用时执行类的加载初始化链接
    private static class Holder{
        static Singleton05 INSTANCE = new Singleton05();
    };

    public static Singleton05 getInstance() {
        //        调用内部类
        return Holder.INSTANCE;
    }

    public static void otherMethod() {
        System.out.println("otherMethod()");
    }

}

```

<!-- endtab -->

<!-- tab 测试-->

```java
package com.heroxin.singleton;

/*
    @Author Heroxin

    @Create 2023-06-13-15:13

    @Description:
*/

import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class TestSingleton05 {
    public static void main(String[] args) throws Exception {
        Singleton05.otherMethod();
        System.out.println("===============");
        System.out.println(Singleton05.getInstance());
        System.out.println(Singleton05.getInstance());
    }
}

```

<!-- endtab -->

{% endtabs %}



> 参考文章：
>
> ​	[Java中常用的设计模式](https://blog.csdn.net/sugar_no1/article/details/88317950)
>
> ​	[单例模式](https://www.bilibili.com/video/BV15b4y117RJ/?p=60&spm_id_from=pageDriver&vd_source=58f742b47eee869bcdb1d4967d8bf5f5)

