---
#文章标题
title: Centos7 磁盘扩容，vgdisplay 显示为空
#文章创建日期
date: 2023-06-06 10:30:00
#文章更新日期
updated: 2023-06-06 10:30:00
#文章标签
tags: [Linux] 
#文章分类
categories: 
	- [安装手册]
#文章关键字
keywords: Linux
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---




# 本文适用情况：

- 配置虚拟机时，分区是自行配置，没有使用默认分区
- 使用 vgdisplay 命令，什么也没有显示
- Centos7 64x，根目录分区为 xfs 格式



# 扩容磁盘空间

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606150810153.png)



# 查看当前分区信息

> **可见根目录挂载在 sda3**

```sh
lsblk
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606145544073.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606151817362.png)





# 安装分区工具

```sh
yum install cloud-utils-growpart gdisk -y
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606145606881.png)



# 卷扩容

> **3 就是根目录所在分区**

```sh
growpart /dev/sda 3
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606145759615.png)



> **此时，分区大小已经变为调整后的大小**

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606145857428.png)

# 文件系统扩容

```sh
xfs_growfs /
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606150005116.png)

> **扩容成功**

```sh
df -h
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230606150043589.png)







# 参考文档

> 🖋 [解决centos7 根目录扩容vgdisplay数据卷为空不能扩容问题](https://blog.csdn.net/qq_40068214/article/details/124812732)
>
> 🖍[Linux操作系统之centos7根目录扩容（根目录在sda3 vgdisplay为空）](https://blog.csdn.net/weixin_43730142/article/details/129067852?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129067852-blog-124812732.235%5Ev38%5Epc_relevant_sort_base1&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129067852-blog-124812732.235%5Ev38%5Epc_relevant_sort_base1&utm_relevant_index=3)
>
> ✏[VMware虚拟机扩展磁盘容量](https://blog.csdn.net/Chen_qi_hai/article/details/108814596)
>
> 🖌[对VMware已经创建的虚拟机进行磁盘扩容过程以及会遇到的问题](https://blog.csdn.net/weixin_44295084/article/details/125725574)