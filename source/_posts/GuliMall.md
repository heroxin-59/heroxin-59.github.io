---
#文章标题
title: GuliMall-报错集锦
#文章创建日期
date: 2023-03-23 10:30:00
#文章更新日期
updated: 2023-05-10 10:30:00
#文章标签
tags: [Wrong] 
#文章分类
categories: 
	- [疑难杂症]
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




## renren-fast

### pom.xml爆红，插件下载不到

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323212102463.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323212117041.png)

#### 解决方法：

把插件注释掉就好，不影响启动。

pom.xml 此时还是爆红，别在意，启动项目



### 项目启动失败

找不到实体中的 get 和 set 方法

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323212409337.png)



首先引入 lombok 插件，还是出问题。

查看lombok插件使用的版本是 1.18.24，而 renren-fast 引用的是 1.18.4，版本不一致。

![image-20230323212615039](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323212615039.png)





#### 解决方法：

将 renren-fast 应用的版本也改为 1.18.24，启动成功



![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323212918791.png)

## renren-fast-vue

### cnpm install报错

#### 解决方法：

1. 查找资料得知，nodejs 和 node-sess 有对应的版本要求 [详见](https://www.npmjs.com/package/node-sass?activeTab=readme)

   我得nodejs版本是18+，所以我需要8.0+的node-sess

   修改renren-fast-vue目录下的 package.json 和 package-lock.json

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323211350109.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323211436217.png)

2. 报错：**chromedriver@2.27.2install: node install.js** 

   解决方法：

   ​	先删除 renren-fast-vue 下的 node_modules 文件夹

   ​	执行：

   ```
   cnpm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
   ```

   再次执行 cnpm install ，不报错

### cnpm run dev 报错，有些依赖未找到

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230323210638031.png)

#### 解决方法：

​	重新下载依赖

```
cnpm install qs
cnpm install svg-baker-runtime
cnpm install vue-hot-reload-api
```



## renren-generator

### ServiceImpl层报错

![image-20230325190846909](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230325190846909.png)



#### 解决方法：

​	从github 上clone 的renren-generator 的项目中，pageutils和query等工具类是不全的，有很多bug，导入课程提供的utils后解决



## Feign

### 启动项目失败：

**<u>No Feign Client for loadBalancing defined. Did you forget to include spring-cloud-starter-loadbalancer?</u>**

![image-20230327184014499](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230327184014499.png)

#### 解决方法：

> ​	由于SpringCloud Feign在Hoxton.M2 RELEASED版本之后不再使用Ribbon而是使用spring-cloud-loadbalancer，所以不引入spring-cloud-loadbalancer会报错

由于SpringCloud Feign在Hoxton.M2 RELEASED版本之后不再使用Ribbon而是使用spring-cloud-loadbalancer，所以不引入spring-cloud-loadbalancer会报错。

我们这里使用的是nacoss，所以从nacoss中排除ribbon的依赖，并加入loadbalancer依赖

在pom中引入依赖即可

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>2.2.5.RELEASE</version>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-loadbalancer</artifactId>
    <version>2.2.2.RELEASE</version>
</dependency>

```



## GateWay

![image-20230329173832511](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230329173832511.png)



### 原因：

引入了Mybatis依赖，它是有默认的数据库配置，而网关显然没有数据库

### 解决方法：

排除数据库配置的扫描

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230329174053938.png)





## 报错：java: 找不到符号
符号:   方法 allowedOriginPatterns(java.lang.String)
位置: 类 org.springframework.web.servlet.config.annotation.CorsRegistration



![image-20230330115142087](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230330115142087.png)

### 解决方法：

​	SpringBoot升级后，Lombok版本对应的Api发生改动，这个方法名已经不对了。改为

**.allowedOrigins("*")**

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230330115446476.png)

## 报错：When allowCredentials is true, allowedOrigins cannot contain the special value "*" since that cannot be set on the "Access-Control-Allow-Origin" response header. To allow credentials to a set of origins, list them explicitly or consider using "allowedOriginPatterns" instead.

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230330135620481.png)



### 解决方法：

这是因为springboot升级成2.4.0以上时对AllowedOrigin设置发生了改变，不能有”*“




将

```java
corsConfiguration.addAllowedOrigin("*");
```



替换为

```java
corsConfiguration.addAllowedOriginPattern("*");
```





## 文件上传

![image-20230402170025876](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230402170025876.png)



### 解决办法：

前后端数据应当统一，原来项目给的是 ：后端accessId，前端accessid，改为一致即可

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230402170107622.png)



![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230402170137755.png)



## cascader级联菜单不显示样式

### 报错：

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230406095221286.png)

### 解决方法：

在  /renren-fast-vue/src/main.js 中引入



```js
import 'element-ui/lib/theme-chalk/index.css'
```



## 报错：Parameter 'name' not found. Available parameters are [arg1, arg0, param1, param2]



说是name字段找不到，但是我前后命名都是统一的，检查了几次没问题

![image-20230406170822772](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230406170822772.png)

### 解决方法：

错误原因是应为mapper文件中，一个方法如果有多个参数，最好使用@param来与表中字段绑定



![image-20230406171133811](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230406171133811.png)



## 报错：Error in mounted hook: "ReferenceError: PubSub is not defined"



![image-20230407201844387](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230407201844387.png)





## 使用 multi-upload 组件上传图片报错：InvalidAccessKeyId



![image-20230409155438612](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230409155438612.png)



报错原因：

​	它说是 accessKeyId 获取不到，看请求数据中的 **ossaccessKeyId** 值为 undefined，也就是发送请求时，没有发送这个值。但我使用的是组件，后端发送的签名也咩问题。

​	此时应该去前端代码中看看 accessKeyId 是否被定义，名称是否一致。

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230409155948788.png)



前端引用的是 accessid 而后端传的是 assessId ，改为一致即可。有事一个前后端数据不一致造成的







## 发布商品-规格参数没有显示



上架商品时，报错sql语句有问题，查看发现：查询规格参数那步，查到一个空列表。

**控制台报错：Cannot read properties of null (reading 'forEach')**

![image-20230509195136824](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230509195136824.png)

### 解决方法：[(27条消息) 谷粒商城P85问题记录—发布商品时规格参数不显示-2022/4/8_猴急猴急的博客-CSDN博客](https://blog.csdn.net/weixin_46626422/article/details/124030177)





## SwitchHost：无法访问gulimall.com

### 解决方法：关闭代理



## 添加search功能，nginx中server_name：*.gulimall.com 不起作用



### 解决方法：server_name gulimall.com *.gulimall.com;

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230514153822904.png)
