---
#文章标题
title: Maven
#文章创建日期
date: 2022-06-01 10:30:00
#文章更新日期
updated: 2022-06-01 10:30:00
#文章标签
tags: [Maven] 
#文章分类
categories: 
	- [技术栈]
#文章关键字
keywords: Maven
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---
# Maven

## Maven简介

> Maven的本质是一个项目管理工具，将项目开发和管理过程抽象成一个项目对象模型(POM)
>
> POM:Project Object Model 项目对象模型
>

![在这里插入图片描述](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/20210717214736482.png)

#### 基础概念

- groupId：定义当前Maven项目隶属组织名称(通常是域名反写)

- artifactId：定义当前Maven项目名称(通常是模块名称)

- version：定义当前版本号

- packaging：定义该项目的打包方式

#### 作用

1. 项目构建：提供标准的，跨平台的自动化项目构建方式
2. 依赖管理：方便快捷的管理项目依赖的资源，避免资源间版本冲突问题
3. 统一开发结构：提供标准的，统一的项目结构



## Maven项目

#### 依赖管理

###### 	依赖配置

> 依赖指的是当前项目运行所需要的 jar

```
<!--设置当前项目所依赖的所有jar-->
<dependencies>
  <!--设置具体的依赖-->
  <dependency>
    <!--依赖所属群组id-->
    <groupId></groupId>
    <!--依赖所属项目id-->
    <artifactId></artifactId>
    <!--依赖版本号-->
    <version></version>
  </dependency>
</dependencies>
```

###### 	依赖传递

> 以依赖配置的方式实现依赖传递

```
<dependencies>
   <dependency>
     <groupId>org.example</groupId>
     <artifactId>com.maven.project</artifactId>
     <version>1.0-SNAPSHOT</version>
   </dependency>
</dependencies>
```

1. **直接传递：**在当前项目中通过依赖配置建立的依赖关系（A使用B，A和B就是直接传递）
2. **间接传递：**被依赖的资源如果依赖其他资源，当前项目间接依赖其他资源（A依赖B，而B依赖C，那么A和C之间就是间接传递）
3. **依赖传递的冲突问题：**
   - 路径优先：当依赖中出现相同的资源时，层级越深，优先级越低，层级越浅，优先级越高
   - 声明优先：当资源在相同层级被依赖时，配置顺序靠前的覆盖配置顺序靠后的
   - 特殊优先：当同级配置了相同资源的不同版本，后配置的覆盖先配置的

​	![在这里插入图片描述](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/20210717215049286.png)

###### 	可选依赖

> 可选依赖是指对外界隐藏当前所依赖的资源(外界使用依赖传递时，看不到你所引用的 jar )

```
<dependency>
  <groupId></groupId>
  <artifactId></artifactId>
  <version></version>
  <!--添加下面这一行,外界看不到你的这个 jar -->
  <optional>true</optional>
</dependency>

```

###### 	排除依赖

> 排除依赖指主动断开依赖的资源，被排除的资源无需指定版本

```
<dependency>
  <groupId></groupId>
  <artifactId></artifactId>
  <version></version>
  <!--添加下面这一行-->
  <exclusions>
    <exclusion>
      <groupId></groupId>
      <artifactId></artifactId>
    </exclusion>
  </exclusions>
</dependency>

```



排除依赖和可选依赖作用对象不同

当 A 依赖 B 时，在 A 中 导入 B 的坐标，B 不想让 A 看到自己的某个 jar ，B 可以用可选依赖；A 不想用 B 的某个依赖，A 可以用排除依赖。

###### 依赖范围

依赖的 jar 默认情况可以在任何地方使用，可以通过 `scope` 标签设定其作用范围

- 主程序范围有效(main文件夹范围内)
- 测试程序范围有效(test 文件夹范围内)
- 是否参与打包(package 指令范围内)

![在这里插入图片描述](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/20210717215112315.png)



#### 生命周期与插件

###### 	构建生命周期

- Maven 对项目构建的生命周期划分为 3 套
  - clean：清理工作
  - default：核心工作，如编译，测试，打包，部署等
  - site：产生报告，发布站点等

###### 	插件

- 插件与生命周期内的阶段绑定，在执行到对应生命周期时执行对应的插件功能
- 默认 maven 在各个生命周期上绑定有预设的功能
- 通过插件可以自定义其他功能

```
<build> 
  <plugins>
	<plugin> 
      <groupId>org.apache.maven.plugins</groupId> 
      <artifactId>maven-source-plugin</artifactId> 
      <version>2.2.1</version>
	  	<executions>
			<execution> 
          		<goals>
					<goal>jar</goal> 
          		</goals>
		  	    <phase> generate-test-resources</phase> 
		  	</execution>
		</executions> 
	</plugin>
  </plugins> 
</build>

```



## 分模块开发与设计

> 一个项目多个工程，一个工程多个模块，将 dao层，service层，controller层 等分割成多个工程，使用依赖传递的方式进行调用(如，dao 层在 pom.xml 中导入 pojo 的依赖坐标，就可以使用实体类了)

![image-20220606141824161](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220606141824161.png)



- 每个模块可以执行 **compile**(编译) 命令来验证
- 被依赖的模块需要先进行 **install**(安装) 命令，将其文件放入仓库当中（如上面提到的，dao 引用 pojo ，需要先 install pojo）
- 各个模块的配置文件名不应重复(`applicationContext-dao`,`applicationContext-service`)



## 聚合

**多模块构建维护**

为了防止日后某一模块进行更新后导致其他模块无法正常调用该模块，这里创建一个父模块来管理各个模块，对他们进行统一的编译，安装操作。

![image-20220606152211005](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220606152211005.png)

1. 创建一个空模块，只保留 pom.xml 文件

2. 定义打包类型

   ```
   <packaging>pom</packaging>
   ```

3. 定义当前模块进行构建操作时关联的其他模块名称

   ```
   <modules>
     <module>../ssm_pojo</module>
     <module>../ssm_dao</module>
     <module>../ssm_service</module>
     <module>../ssm_controller</module>
   </modules>
   ```



## 继承

**模块依赖关系维护**

每个模块都有其对应的依赖，当多个模块引用同一依赖或同一依赖不同版本时，会造成配置臃肿版本冲突等问题

现在使用父模块来管理依赖，子模块继承父模块就可以，这也是 SpringBoot 管理依赖的思想

![image-20220606155948362](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220606155948362.png)

1. 在父模块的 pom.xml 中导入需要的所有依赖(位于 `dependenceManagement` 标签下)

   ```
   <!--声明此处进行依赖管理-->
   <dependencyManagement>
     <!--具体的依赖-->
     <dependencies>
       <dependency>
         <groupId></groupId>
         <artifactId></artifactId>
         <version></version>
       </dependency>
     </dependencies>
   </dependencyManagement>
   ```

2. 在子模块中继承父模块

   ```
   <!--定义该工程的父工程-->
   <parent>
     <groupId></groupId>
     <artifactId></artifactId>
     <version></version>
     <!--填写父工程的pom文件-->
     <relativePath>../ssm/pom.xml</relativePath>
   </parent>
   ```

3. 子模块中添加依赖，不用写版本，版本由父模块控制

   ```
   <dependencies>
     <dependency>
       <groupId></groupId>
       <artifactId></artifactId>
     </dependency>
   </dependencies>
   ```

4. 插件配置同理，读者自行实验



## 属性

**统一依赖版本**

像 `spring-context `, `spring-jdbc` , `spring-webmvc` 等依赖的版本是需要统一相同的，这时因某些’不可抗拒因素‘会导致版本不统一。可以通过设置属性来统一管理版本，类似 java 中的变量，一次赋值，多地调用

*由于依赖版本控制交由父模块处理，以下操作都在父模块的 pom.xml 中进行*

1. 自定义属性

   ```
   <!--定义自定义属性-->
   <properties> 
     	<spring.version>5.1.9.RELEASE</spring.version>
   	<junit.version>4.12</junit.version>
   </properties>
   ```

2. 依赖中引用属性(EL表达式？雾)

   ```
   <dependency> 
     <groupId>org.springframework</groupId> 
     <artifactId>spring-context</artifactId> 
     <version>${spring.version}</version>
   </dependency>
   ```

3. 此外还有很多的系统内置属性，有兴趣的 :running: 官方文档

   `${basedir`:表示项目的根目录，也就是包含 pom.xml 文件的目录

   `${version}`:表示项目的版本

## 版本管理

###### 工程版本

- SNAPSHOT(快照版本)
  - 项目开发过程中，为方便团队成员合作，解决模块间相互依赖和实时更新的问题，开发者对每个模块进行构建的时候，输出的临时性版本叫做快照版本(测试阶段版本)
  - 快照版本会随着开发的进展不断更新
- RELEASE(发布版本)
  - 项目开发到进入阶段里程碑后，向团队外部发布比较稳定的版本，这种版本所对应的构建文件是稳定的，即便进行功能的后续开发，也不会改变当前发布版本内容，这种版本成为发布版本

###### 工程版本号约定

- 约定规范
  - `主版本`.`次版本`.`增量版本`.`里程碑版本`
  - 主版本：表示项目重大框架的变更，如：spring5相较于spring4的迭代
  - 次版本：表示有较大的功能增加和变化，或全面系统的修复BUG
  - 增量版本：表示有重大漏洞的修复
  - 里程碑版本：表示一个版本的里程碑(版本内部)，这样的版本同下一个正式版本相比，相对来说不是很稳定，有待更多的测试
- 范例
  - 5.1.9.RELEASE

## 多环境开发

**多环境兼容**

​	我们的项目将来是要发布到多个环境的，用于更新，测试与维护。这样每个环境的配置文件要求都不同(例如日志级别)

![image-20220606181032241](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220606181032241.png)

```
<!--创建多环境-->
<profiles>
  <!--定义具体的环境：生产环境-->
  <profile>
    <!--定义环境对应的唯一名称-->
    <id>开发环境名称1</id>
    <!--定义环境中的专用的属性值-->
    <properties>
      <jdbc.url>jdbc链接</jdbc.url>
    </properties>
    <!-- 设置为默认启动项 -->
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
  </profile>
  <!--定义具体的环境：开发环境-->
  <profile>...<profile/>
</profiles>

```



