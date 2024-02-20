---
#文章标题
title: Screen
#文章创建日期
date: 2023-03-02 10:30:00
#文章更新日期
updated: 2023-03-02 10:30:00
#文章标签
tags: [Linux] 
#文章分类
categories: 
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





# Screen（Linux）

<div id="zm_mhz">之前开饥荒服务器就一直使用screen命令，但具体的细节都封装在脚本内。知其然而不知其所以然</div>





## screen的功能

### 会话恢复

​	    只要Screen本身没有终止，在其内部运行的会话都可以恢复。这一点对于远程登录的用户特别有用——即使网络连接中断，用户也不会失去对已经打开的命令行会话的控制。只要再次登录到主机上执行screen -r就可以恢复会话的运行。同样在暂时离开的时候，也可以执行分离命令detach，在保证里面的程序正常运行的情况下让Screen挂起（切换到后台）。这一点和图形界面下的VNC很相似。

### 多窗口

​        在Screen环境下，所有的会话都独立的运行，并拥有各自的编号、输入、输出和窗口缓存。用户可以通过快捷键在不同的窗口下切换，并可以自由的重定向各个窗口的输入和输出。

### 会话共享

​        Screen可以让一个或多个用户从不同终端多次登录一个会话，并共享会话的所有特性（比如可以看到完全相同的输出）。它同时提供了窗口访问权限的机制，可以对窗口进行密码保护。



## 状态介绍

### Attached：

​	表示当前screen正在作为主终端使用，为活跃状态

### Detached：

​	表示当前screen正在后台使用，为非激发状态

## 安装

```sh
# CentOS
yum install screen
# Debian/Ubuntu
apt install screen		
```

## 命令

<div id="zm_tkzj">screen [-opts] [cmd [args]]</div>

```sh
screen -ls
```

```sh
# 创建一个叫做 heroxin 的虚拟终端
screen -S heroxin  # 如果存在，则创建同名screen
screen -R heroxin  # 如果存在，则进入 heroxin
```

```sh
# 退出
ctrl + a + d
```

```sh
# 回到 scree
screen -R heroxin/pid
screen -r heroxin/pid
```

```sh
# 清除终端
exit

screen -R heroxin/pid -X quit
```




参考：[Linux终端命令神器--Screen命令详解。助力Linux使用和管理 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1844735)

