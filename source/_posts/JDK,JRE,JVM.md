---
#文章标题
title: JDK,JRE,JVM
#文章创建日期
date: 2022-11-17 10:30:00
#文章更新日期
updated: 2022-11-17 10:30:00
#文章标签
tags: [Java] 
#文章分类
categories: 
	- [知识点]
#文章关键字
keywords: JDK,JRE,JVM
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---



# JDK,JRE,JVM的联系和区别

## JDK

1. JDK(Java Development Kit) 是Java的核心
2. 包含了Java运行环境(JRE : Java Runtime Environment)，一些Java工具(javac,jaca,jdb等)，和Java的基础类库(即JavaAPI)。

## JRE

1. JRE(Java Runtime Environment)是Java的运行环境
2. 包含了JVM标准实现和Java核心类库(lib类库)
3. 见名知意，它是Java运行时需要的

## JVM

1. JVM(Java Virtual Machine)，即Java虚拟机

## 三者的联系

1. JDK由JRE和一些Java工具以及基础类库组成，而JRE由JVM和lib类库组成
2. JDK是一个开发环境，它里面有将 java文件编译成 .class文件的 javac程序，也有jre.exe,javadoc.exe等用于开发的可执行指令文件。
3. JRE则是一个运行环境，它下面不包含任何的开发工具。
4. JVM执行 .class文件时，需要JRE下lib类库的支持，尤其是rt.jar