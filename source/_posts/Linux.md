---
#文章标题
title: Linux基础命令
#文章创建日期
date: 2022-05-06 10:30:00
#文章更新日期
updated: 2022-09-10 10:30:00
#文章标签
tags: [Linux] 
#文章分类
categories: 
	- [知识点]
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
# Linux基础命令

## 文件目录

1. pwd 显示当前工作目录的绝对路径

2. ls 列出目录内容

   | 按键 | 功能                                   |
   | :--: | -------------------------------------- |
   |  -a  | 全部的文件，连同隐藏的文件也一起列出来 |
   |  -l  | 显示文件的详细信息， ls -l 等价于 ll   |

3. cd 切换目录

   |     按键      | 功能                               |
   | :-----------: | ---------------------------------- |
   | cd [绝对路径] | 切换目录                           |
   | cd [相对路径] | 切换目录                           |
   |  cd ~ 或 cd   | 回到用户目录                       |
   |     cd -      | 回到上次所在目录                   |
   |     cd ..     | 回到当前目录的上一级目录           |
   |     cd -P     | 回到实际物理路径，而非快捷方式路径 |

4. mkdir 创建文件夹

   | 按键 | 功能         |
   | :--: | ------------ |
   |  -p  | 创建多层目录 |

   ```
   #创建一个目录(hero目录存在)
   mkdir heroxin
   mkdir hero/heroxin
   
   #创建一个多级目录(hero，xin，heroxin三者都不存在)
   mkdir -p hero/xin/heroxin
   ```

5. rmdir 删除一个空的目录

   ```
   rmdir heroxin
   ```

6. touch 创建文件

   ```
   touch heroxin.txt
   ```

7. cp 复制文件或目录

   | 按键 | 功能                     |
   | :--: | ------------------------ |
   |  -r  | 递归复制整个文件夹       |
   | /cp  | 直接覆盖同名文件，不询问 |

   ```
   #将文件复制到 /root/Desktop 目录下
   cp /root/heroxin.txt /root/Desktop/ 
   ```

8. rm 删除文件或目录

   | 按键 | 功能                     |
   | :--: | ------------------------ |
   |  -r  | 递归删除目录中所有内容   |
   |  -f  | 强制执行删除操作，不询问 |
   |  -v  | 显示指令的详细执行过程   |

9. mv 移动文件与目录或重命名

   ```
   #重命名
   mv hero.txt heroxin.txt
   #移动文件
   mv /root/heroxin.txt /root/Desktop/
   ```

10. cat 查看文件内容

   ```
   cat heroxin.txt
   #显示行号
   cat -n heroxin.txt
   ```

   

11. more 分屏查看文件内容 

    |   按键   | 功能                 |
    | :------: | -------------------- |
    |  空格键  | 向下翻一页           |
    |  enter   | 向下翻一行           |
    |    q     | 退出                 |
    | ctrl + f | 向下滚动一屏         |
    | ctrl + b | 返回上一屏           |
    |    =     | 输出当前行的行号     |
    |    :f    | 输出文件名和当前行号 |

    ```
    more heroxin.txt
    ```

12. less 分屏查看文件内容

    |    按键    | 功能                                     |
    | :--------: | ---------------------------------------- |
    |   空格键   | 向下翻一页                               |
    | [pagedown] | 向下翻一页                               |
    |  [pageup]  | 向上翻一页                               |
    |   /字串    | 向下搜寻[字串]；n查找下一个，N查找上一个 |
    |   ?字串    | 向上搜寻[字串]；n查找下一个，N查找上一个 |
    |     q      | 退出                                     |

    ```
    less heroxin.txt
    ```

13. echo 输出内容到控制台

    | 按键 | 功能                |
    | :--: | :------------------ |
    | \\\  | 输出 \              |
    |  \n  | 换行                |
    |  \t  | 制表符，也就是tab键 |
    |  -e  | 启用转义符          |

    ```
    echo "heroxin"
    echo -e "hero\\xin"
    echo -e "hero\nxin"
    echo -e "hero\txin"
    ```

14. head 显示文件头部内容

    | -num | 显示头部内容的行数，默认显示10行 |
    | :--: | -------------------------------- |

    ```
    head -9 heroxin.txt
    ```

15. tail 显示文件尾部内容

    | 按键 | 功能                                 |
    | :--: | ------------------------------------ |
    | -num | 显示文件尾部的行数，默认显示10行     |
    |  -f  | 显示文件最新追加的内容，监视文件变化 |

    ```
    tail -3 heroxin.txt
    tail -3f heroxin.txt
    ```

16. 输出重定向 > 和追加 >>

    ```
    #将 ll 查看的信息写到文件中
    ll > heroxin.txt
    #将 ll 查看到的信息追加到文件中
    ll >> heroxin.txt
    #采用echo将hello追加到文件中
    echo hello >> heroxin.txt
    ```

17.  ln 软连接

    > 类似Windows中的快捷方式

    ```
    #创建软连接
    ln -s [原文件或目录] [软连接名]
    ln -s /root/Desktop/ heroxin
    #删除软连接(软连接名称后面没有/)
    rm -rf heroxin
    ```

18. history 查看已经执行过的历史命令

    ```
    history
    ```

## 时间日期

关于时间日期

|      按键       | 功能                                         |
| :-------------: | -------------------------------------------- |
| -d [时间字符串] | 显示指定的时间字符串表示的时间，而非当前时间 |
| -s [日期字符串] | 设置系统日期时间                             |
| [+日期时间格式] | 使用指定格式显示当前时间                     |

| date                      | 显示当前日期     |
| :------------------------ | ---------------- |
| date+%Y                   | 显示当前年份     |
| date+%m                   | 显示当前月份     |
| date+%d                   | 显示当前是哪一天 |
| date “+%Y-%m-%d %H:%M:%S” | 显示年月日时分秒 |

1. date 显示当前时间

   ```
   date
   date "+%Y-%m-%d %H:%M:%S"
   ```

2. date 显示非当前时间

   ```
   #前一天时间
   date -d "1 days ago"
   #明天的时间
   date -d "-1 dats ago"
   ```

3. date 设置系统时间

   ```
   date -s "2017-06-19 20:52:18"
   ```

4. cal 查看日历

   ```
   cal 2022
   ```

## 用户管理

1. useradd 添加新用户

   |  -g  | 为用户添加分组 |
   | :--: | -------------- |

   ```
   useradd heroxin
   useradd -g hero heroxin
   ```

2. passwd 设置用户密码

   ```
   #为用户 heroxin 添加密码
   passwd heroxin
   ```

3. id 查看用户是否存在

   ```
   id heroxin
   ```

4. 查看创建了哪些用户

   ```
   cat /etc/passwd
   ```

5. su 切换用户

   ```
   #切换用户
   su heroxin
   #切换用户，并获得用户的环境变量及执行权限
   su - heroxin
   ```

6. userdel 删除用户

   |  -r  | 删除用户和用户目录 |
   | :--: | ------------------ |

   ```
   userdel heroxin
   userdel -r heroxin
   ```

7. who 查看登录用户信息

   ```
   #显示自生用户名
   whoani
   #显示登录用户的用户名
   who am i
   ```

8. sudo 设置普通用户具有root权限

   ```
   #非管理员用户登录系统
   sudo mkdir heroxin
   ```

9. usermod 修改用户

   |  -g  | 修改用户的初始登录组，给定的组必须是存在的 |
   | :--: | ------------------------------------------ |

   ```
   usermod -g root heroxin
   ```

## 用户组管理

1. groupadd 新增组

   ```
   groupadd hero
   ```

2. groupdel 删除组

   ```
   groupdel hero
   ```

3. groupmod 修改组

   |  -n  | 指定工作组的新组名 |
   | :--: | ------------------ |

   ```
   groupmod -n hero xin
   ```

4. 查看有哪些组

   ```
   cat /etc/group
   ```

## 文件权限

1. chmode 改变权限

   > 这里就只用二进制的方法了

   |  -R  | 递归操作，对整个文件夹里的所有内容执行 |
   | :--: | -------------------------------------- |

   ```
   chmode 777 heroxin.txt
   #更改整个文件夹里面的所有文件权限
   chmode -R 777 heroxin/
   ```
   
2. chown 改变所有者

   ```
   chown heroxin heroxin.txt
   ```

3. chgrp 改变所属组

   ```
   chgrp hero heroxin.txt
   ```

## 搜索查找

1. find 查找文件或目录

   | 按键  | 功能                                                         |
   | :---: | ------------------------------------------------------------ |
   | -name | 按指定的文件名查找模式查找文件                               |
   | -user | 查找属于指定用户的文件                                       |
   | -size | 按照指定的文件大小查找文件；+n表示大于，-n表示小于，n表示等于 |

   ```
   find /root/ -name "*.txt"
   find /root/ -user heroxin
   find /root/ -size +1024
   ```

2. grep 过滤查找以及 | 管道符

   |  -n  | 显示匹配行及行号 |
   | :--: | ---------------- |

   ```
   ll | grep heroxin
   ```

## 解压缩

> 只写 .tar.gz 了

1. tar 打包

   | 按键 | 功能               |
   | :--: | ------------------ |
   |  -c  | 产生 .tar打包文件  |
   |  -v  | 显示详细信息       |
   |  -f  | 指定压缩后的文件名 |
   |  -z  | 打包同时压缩       |
   |  -x  | 解压 .tar文件      |
   |  -C  | 解压到指定目录     |
   
   ```
   #压缩多个文件
   tar -zcvf heroxin.tar.gz hero.txt xin.txt
   #压缩目录
   tar -zcvf heroxin.tar.gz heroxin/
   #解压到当前目录
   tar -zxvf heroxin.tar.gz
   #解压到指定目录
   tar -zxvf heroxin.tar.gz -C /root
   ```

## 磁盘分区

1. du 查看文件和目录占用的磁盘空间

   | 按键 | 功能                                 |
   | :--: | ------------------------------------ |
   |  -h  | 以G，mb，kb等格式显示                |
   |  -a  | 查看子目录及文件大小                 |
   |  -c  | 显示所有文件和子目录大小后，显示总和 |
   |  -s  | 只显示总和                           |

   ```
   du -sh
   ```

2. df 查看磁盘空间使用情况

   ```
   df -h
   ```

## 进程管理

1. ps 查看当前系统进程状态

   | 按键 | 功能               |
   | :--: | ------------------ |
   |  -e  | 列出所有进程       |
   |  -f  | 显示进程的完整信息 |

   ```
   ps -ef | grep redis
   ```

2. kill 终止进程

   |  -9  | 表示强制终止 |
   | :--: | ------------ |

   ```
   kill PID
   ```

3. pstree 查看进程树

   | 按键 | 功能               |
   | :--: | ------------------ |
   |  -p  | 显示进程的PID      |
   |  -u  | 显示进程的所属用户 |

   ```
   pstree -up
   ```

4. top 实时监控系统进程状态

   |  按键   | 功能                                   |
   | :-----: | -------------------------------------- |
   | -d 秒数 | 指定top命令在每个几秒后进行更新        |
   |   -i    | 使top不显示任何闲置或者僵死的进程      |
   |   -p    | 通过指定进程ID来仅仅监控某个进程的状态 |
   |    P    | 以 CUP 使用率排序   **默认**           |
   |    M    | 以内存的使用率排序                     |
   |    N    | 以 PID 排序                            |
   |    q    | 退出top                                |

   ```
   top -d 1
   tio -i
   top -p 2575
   ```

5. netstat 显示网络状态和端口占用信息

   | 按键 | 功能                                             |
   | :--: | ------------------------------------------------ |
   |  -a  | 显示所有正在监听(listen)和未监听的嵌套字(socket) |
   |  -n  | 拒绝显示别名，能显示数字的全部转化成数字         |
   |  -l  | 仅列出在监听的服务状态                           |
   |  -p  | 表示显示哪个进程在调用                           |
   
   ```
   #查看sshd进程的网络信息
   netstat -anp | grep sshd
   #查看某个端口是否被占用
   netstat -nltp | grep 22
   ```

## 其他设置

1. 查看防火墙开放端口

   ```shell
   firewall-cmd --list-all
   ```

2. 开放指定端口

   ```shell
   firewall-cmd --add-port=8080/tcp --permanent
   ```

3. 开放范围端口

   ```shell
   firewall-cmd --add-port=30000-30999/tcp --permanent
   ```

4. 重启防火墙

   ```shell
   systemctl restart firewalld
   ```

5. 修改 IP

   ```
   vim /etc/sysconfig/network-scripts/ifcfg-ens33
   ```

   ```
   TYPE="Ethernet"
   PROXY_METHOD="none"
   BROWSER_ONLY="no"
   BOOTPROTO="static"
   DEFROUTE="yes"
   IPV4_FAILURE_FATAL="no"
   IPV6INIT="yes"
   IPV6_AUTOCONF="yes"
   IPV6_DEFROUTE="yes"
   IPV6_FAILURE_FATAL="no"
   IPV6_ADDR_GEN_MODE="stable-privacy"
   NAME="ens33"
   UUID="1274a009-858f-4012-a5b3-8f5ef1800444"
   DEVICE="ens33"
   ONBOOT="yes"
   #IP 地址
   IPADDR=192.168.196.101
   #网关
   GATEWAY=192.168.196.2
   #域名解析器
   DNS1=192.168.196.2
   
   ```
   
6. 改hoshname

   ```
    vim /etc/hostname 
   ```

   