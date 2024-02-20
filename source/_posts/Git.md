---
#文章标题
title: Git
#文章创建日期
date: 2022-06-07 10:30:00
#文章更新日期
updated: 2022-06-07 10:30:00
#文章标签
tags: [Git,分布式] 
#文章分类
categories: 
	- [分布式] 
	- [技术栈]
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
# Git

## Git概述

> Git是一个免费的、开源的 <u>**分布式版本控制**</u>系统 ，可以快速高效地处理从小型到大型的各种
> 项目 。
> Git易于学习，占地面积小，性能 极快 。 它具有廉价的本地 库 ，方便的暂存区域和多个工作
> 流 分支 等 特性。 其性能优于 Subversion、 CVS、 Perforce和 ClearCase等 版本控制 工具。

#### 版本控制

​		版本控制是一种记录文件内容变化，以便将来查阅特定版本修订情况的系统。
​		版本控制其实最重要的是可以记录文件修改历史记录，从而让用户能够查看历史版本，方便版本切换。

#### 版本控制工具

- **集中式版本控制工具**

  `CVS`、`SVN(Subversion)`、`VSS`……

  ​		集中化的版本控制系统诸如 CVS、SVN 等，都有一个单一的集中管理的服务器，保存所有文件的修订版本,而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。

  ​		多年以来，这已成为版本控制系统的标准做法。这种做法带来了许多好处，每个人都可以在一定程度上看到项目中的其他人正在做些什么。而管理员也可以轻松掌控每个开发者的权限，并且管理一个集中化的版本控制系统，要远比在各个客户端上维护本地数据库来得轻松容易。

  ​		事分两面，有好有坏。这么做显而易见的缺点是中央服务器的单点故障。如果服务器宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作。

  ![image-20220607092014057](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607092014057.png)

- **分布式版本控制工具**

  `Git`、 `Mercurial`、 `Bazaar`、 `Darcs`……

  ​		像Git这种分布式版本控制工具 ，客户端提取的不是 最新版本的文件快照，而是把代码仓库完整地镜像下来 (本地库) 。这 样任何一处协同工作用的文件发生故障，事后都可以用其他客户端的本地仓库进行恢复。因为 每个客户端的每一次文件提取操作，实际上都是一次对整个文件仓库的完整备份 。

  分布式的版本控制系统出现问题之后，解决了集中式版本控制系统的缺陷：

  1. 服务器断网的情况下也可以进行开发，因为版本控制是在本地进行的
  2. 每个客户保存的也都是整个完整的项目，包含历史记录，更加安全

  ![image-20220607092531828](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607092531828.png)

#### 工作机制

​	![工作机制](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607092645850.png)



## Git命令

| 命令名称                             |      作用      |
| :----------------------------------- | :------------: |
| git config --global user.name 用户名 |  设置用户签名  |
| git config --global user.email 邮箱  |  设置用户邮箱  |
| git init                             |  初始化本地库  |
| git status                           | 查看本地库状态 |
| git add 文件名                       |  添加到暂存区  |
| git commit -m "日志信息" 文件名      |  提交到本地库  |
| git reflog / git log                 |  查看历史记录  |
| git reset --hard 版本号              |    版本穿梭    |

> - 签名的作用是区分不同操作者身份。用户的签名信息在每一个版本的提交信息中能够看到，以此确认本次提交是谁做的。 Git首次安装必须设置一下用户签名，否则无法提交代码。
> - Git版本切换实质是移动 hard 指针

## Git分支

#### 分支概述

> - 在版本控制过程中，同时推进多个任务，为每个任务，我们就可以创建每个任务的单独分支。使用分支意味着程序员可以把自己的工作从开发主线上分离开来，开发自己分支的时候，不会影响主线分支的运行。对于初学者而言，分支可以简单理解为副本，一个分支就是一个单独的副本。（分支底层其实也是指针的引用）
> - 同时并行推进多个功能开发，提高开发效率。各个分支在开发过程中，如果某一个分支开发失败，不会对其他分支有任何影响。失败的分支删除重新开始即可。

#### 分支操作

| 命令名称            | 作用                         |
| ------------------- | ---------------------------- |
| git branch 分支名   | 创建分支                     |
| git branch -v       | 查看分支                     |
| git checkout 分支名 | 切换分支                     |
| git merge 分支名    | 把指定的分支合并到当前分支上 |

- 命令行后面的括号内表示当前分支
- 合并分支时，两个分支在同一个文件的同一个位置 有两套完全不同的修改。 Git无法替我们决定使用哪一个。必须 人为决定 新代码内容。
- 解决冲突以后，文件需要重新添加到暂存区再进行提交，提交时不能写文件名





## Github

#### 创建远程库

1. 打开个人仓库

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607155239415.png)

2. 新建仓库

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607155849752.png)

3. 复制远程链接

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607155938274.png)

4. 在本地新建一个本地仓库，用来放以后推拉的代码

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607160109968.png)

5. 右键 git bash hear

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607160143459.png)

6. 初始化本地仓库

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607160232529.png)

7. 建立远程链接，别名

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607160445967.png)

8. 查看远程库

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607160415664.png)

#### 代码推送Push

​	<u>git push 别名 分支</u>

1. 查看本地仓库状态

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607161836937.png)

2. 将文件添加到暂存区

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607161924259.png)

   ```
   // 或者
   git add .
   ```

   

3. 将文件提交到本地仓库

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607161758921.png)

4. 查看本地仓库状态

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607162138456.png)

5. 代码推送到远程仓库

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607162505833.png)

#### 代码拉取Pull

> 当远程库中代码发生改变时，可以将变化的部分拉取过来

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607165101038.png)

#### 代码克隆Clone

> 本地没有远程仓库中的代码，就是下载别人的源代码

​	![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607164728907.png)

#### 跨团队工作

> 就是修改别人的代码，发送 pull request

1. 打开别人的仓库，点击右上角fork

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607172021554.png)

2. 修改

3. 提交 pull request

4. 主人 merge pull request

#### 邀请队友

1. 在远程仓库中打开settings

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607170145476.png)

2. 邀请

   ![image-20220607170251143](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607170251143.png)

## IDEA集成Github

#### 配置忽略文件

> 项目中很多文件是不需要上传到远程仓库的

- 在C盘用户目录下创建 `git.ignore`文件

- 填写以下内容

  ```
  # Compiled class file
  *.class
  # Log file
  *.log
  # BlueJ files
  *.ctxt
  # Mobile Tools for Java (
  .mtj.
  # Package Files
  *.jar
  *.war
  *.nar
  *.ear
  *.zip
  *.tar.gz
  *.rar
  # virtual machine crash logs, see http://www.java.com/en/download/help/error_hotspot.xml
  hs_err_pid*
  .classpath
  .project
  .settings
  target
  .idea
  *.iml
  ```

- 在 .gitconfig文件中引用忽略配置文件(和 `git.ignore`在同一目录)

  ```
  [core]
  	excludesfile = C:/Users/hero_/git.ignore
  ```

#### 定位Git

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607185544398.png)

#### 初始化本地库

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607190115701.png)

添加到暂存区

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607190533336.png)

#### 提交的本地仓库

![image-20220607190633483](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607190633483.png)

<img src="https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607192935371.png" style="zoom:150%;" />

#### 版本切换

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607194333823.png)

新建分支

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607194450052.png)

#### 切换分支

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607194632540.png)

#### 合并分支

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607194933316.png)

#### 集成 Github 账号

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607195318634.png)

#### 分享到GitHub

![image-20220607195731902](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607195731902.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607195828302.png)

#### 克隆仓库

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607200339332.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220607200403488.png)





## 总结

​	这个笔记适用于有基础但记忆模糊的读者使用，感谢您的来访。