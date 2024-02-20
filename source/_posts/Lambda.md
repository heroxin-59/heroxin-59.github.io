---
#文章标题
title: Lambda
#文章创建日期
date: 2023-04-20 10:30:00
#文章更新日期
updated: 2023-04-20 10:30:00
#文章标签
tags: [Java] 
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
cover:

---

## 原始写法

```java
interface User{
    String UserName(String name);
}
class Iuser implements User{

    @Override
    public String UserName(String name) {
        return "我是"+name;
    }
}

public class Lambda01 {

    public static void main(String[] args) {
        User user = new Iuser();
        String userName = user.UserName("阿鑫");
        System.out.println(userName);

    }
}
```



## 静态内部类

```java
interface User {
    String UserName(String name);
}

public class Lambda01 {

    static class Iuser implements User {

        @Override
        public String UserName(String name) {
            return "我是" + name;
        }
    }

    public static void main(String[] args) {
        User user = new Iuser();
        String userName = user.UserName("阿鑫");
        System.out.println(userName);

    }
}
```



## 局部内部类

```java
interface User {
    String UserName(String name);
}

public class Lambda01 {
    public static void main(String[] args) {
        class Iuser implements User {

            @Override
            public String UserName(String name) {
                return "我是" + name;
            }
        }

        User user = new Iuser();
        String userName = user.UserName("阿鑫");
        System.out.println(userName);

    }
}
```



## 匿名内部类

```java
interface User {
    String UserName(String name);
}

public class Lambda01 {
    public static void main(String[] args) {
        User user = new User() {
            @Override
            public String UserName(String name) {
                return "我是"+name;
            }
        };

        String userName = user.UserName("阿鑫");
        System.out.println(userName);

    }
}
```



## Lambda

```java
interface User {
    String UserName(String name);
}

public class Lambda01 {
    public static void main(String[] args) {
        User user = (name) -> {
            return "我是"+name;
        };

        String userName = user.UserName("阿鑫");
        System.out.println(userName);

    }
}
```

