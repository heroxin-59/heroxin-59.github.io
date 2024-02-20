---
#文章标题
title: Vsftpd
#文章创建日期
date: 2022-09-11 10:30:00
#文章更新日期
updated: 2022-09-11 10:30:00
#文章标签
tags: [Ftp,Linux] 
#文章分类
categories: 
	- [技术栈]
#文章关键字
keywords: Vsftpd
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:
---
# Vsftpd

### 安装&配置

1. 安装

   ```
   [root@Heroxin003 ~]# yum -y install vsftpd
   ```

2. 创建用户(默认不允许root用户访问，如果你有其他非root用户，可以不创建)

   ```
   # 添加用户
   [root@Heroxin003 ~]# useradd Heroxin
   # 添加密码
   [root@Heroxin003 ~]# passwd Heroxin
   ```

3. 开放 21 端口

   ```
   [root@heroxin003 ~]# firewall-cmd --add-port=21/tcp --permanent
   ```

4. 修改 selinux

   ```
   [root@Heroxin003 ~]# setsebool -P allow_ftpd_full_access on
   # Centos6 为 ftp_home_dir 而 Centos7 为 tftp_home_dir , 注意区别
   [root@Heroxin003 ~]# setsebool -P tftp_home_dir on
   ```

   修改后效果如下：

   ```
   # 查看命令
   [root@Heroxin003 ~]# getsebool -a | grep ftp
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220911122745487.png)

5. 修改配置文件

   ```
    # vsftpd 配置文件目录 /etc/vsftpd/vsftpd.conf
   ```

   - 关闭匿名访问

     ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220911123044850.png)

   - 开启被动模式，在配置文件的末尾添加端口范围

     ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220911123152891.png)

6. 开放 30000~30999 端口

   ```
   [root@heroxin003 ~]# firewall-cmd --add-port=30000-30999/tcp --permanent
   # 重启防火墙
   [root@Heroxin003 ~]# systemctl restart firewalld
   ```

7. 启动 vsftpd

   ```
   [root@Heroxin003 ~]# systemctl start vsftpd
   ```

8. 设置开机自启动

   ```
   [root@Heroxin003 ~]# systemctl enable vsftpd
   ```

### Java操纵Ftp

1. 导入 `commons-net`,建议版本为 `3.8.0`

   ```
   <dependency>
   	<groupId>commons-net</groupId>
   	<artifactId>commons-net</artifactId>
   	<version>3.8.0</version>
   </dependency>
   ```

2. Java代码

   ```java
     public void FtpTest(){
         String hostname = "192.168.196.103";  // 服务器 IP
         int port = 21; 					  // 端口号
         FTPClient ftpClient = new FTPClient();
         ftpClient.setControlEncoding("utf-8");
   
         System.out.println("connecting...ftp服务器:" + hostname + ":" + port);
         try {
   
            ftpClient.connect(hostname, port);
            // 连接ftp服务器
            ftpClient.login("username", "password"); // 登录ftp服务器 用户名和密码
            ftpClient.enterLocalPassiveMode();
   
            int replyCode = ftpClient.getReplyCode(); // 是否成功登录服务器
            if (!FTPReply.isPositiveCompletion(replyCode)) {
               System.out.println("connect failed...ftp服务器:" + hostname + ":" + port);
            }
            ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
             // 选择你要上传到的文件夹(文件夹得存在)，建议在所登录用户目录即可
            boolean boo = ftpClient.changeWorkingDirectory("/home/Heroxin/www/");
            if (boo) {
               System.out.println("进入文件夹成功");
            }
             // 读取本地文件
            InputStream inputStream = new FileInputStream("D://aniya.jpg");
             // 上传到服务器后文件的名字
            System.out.println(ftpClient.storeFile("1.jpg", inputStream));
            inputStream.close();
            ftpClient.logout();
         } catch (IOException e) {
            e.printStackTrace();
         }
      }
   ```

3. 打开服务器目录，可以看到上传成功

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220911131234789.png)

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220911131320194.png)

4. 注意

   - 此错误代表用户对文件夹没有操作权限

     - 解决方法：更改文件夹所属用户与登录用户相同

       ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220911130408293.png)

   - 此错误代表指定文件夹不存在

     - 解决方法：创建文件夹

       ![image-20220911131059655](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20220911131059655.png)

   