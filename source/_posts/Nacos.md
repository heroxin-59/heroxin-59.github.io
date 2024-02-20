---
#文章标题
title: Nacos注册中心
#文章创建日期
date: 2022-11-28 10:30:00
#文章更新日期
updated: 2022-11-29 10:30:00
#文章标签
tags: [SpringCloud,SpringBoot,注册中心,Nacos] 
#文章分类
categories: 
	- [分布式]
	- [技术栈]
#文章描述
description: 
#文章顶部图片
top_img: 
#评论模块，默认true
comments: 
#缩略图，如果没有top_img，文章顶部将显示缩略图
cover:

---

# Nacos注册中心

> Nacos是阿里巴巴的产品，现在是SpringCloud的一个组件，相较于Eureka功能更加丰富，在国内受欢迎程度较高



## Nacos和Eureka的区别

### 共同点

1. 都支持服务注册和服务拉取
2. 都支持服务提供者心跳方式做健康检测

### 区别

1. Nacos支持服务端主动检测提供者状态：
   - 临时实例采用心跳模式
   - 非临时实例采用主动检测模式
2. 临时实例心跳不正常会被剔除，非临时实例则不会被剔除
3. Nacos支持服务列表变更的消息推送模式，服务列表更新更及时
4. Nacos集群默认采用AP方式，当集群中存在非临时实例时，采用CP模式；Eureka采用AP方式

## 入门

> [下载地址](https://nacos.io/zh-cn/)
>
> 解压之后进入bin目录
>
> ```
> cmd: startup.cmd -m standalone
> ```
>
> 默认端口：8848
>
> 浏览器访问：
>
> ```
> http://你的IP:8848/nacos/index.html#/login
> ```
>
> 账号：nacos
>
> 密码：nacos

### 配置

#### 父工程

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.5.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

#### 客户端

```xml
<!-- nacos客户端依赖包 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

#### yml

```yaml
spring:
  application:
    name: userServer
  cloud:
    nacos:
      discovery: #nacos服务地址
        server-addr: localhost:8848
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128152350211.png)

### 集群配置

```yaml
spring:
  application:
    name: userServer
  cloud:
    nacos:
      discovery: #nacos服务地址
        server-addr: localhost:8848
        cluster-name: hero #集群名称
```

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128153749290.png)

### NacosRule负载均衡

> 优先"同名"的集群，随机调用实例

```yaml
#nacos配置
userServer:
  ribbon: # 负载均衡规则
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule
```

实例权重配置

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128155513949.png)

### 环境隔离

![image-20221128160129627](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128160129627.png)

![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221128160254583.png)

```yaml
spring:
  application:
    name: orderServer
  cloud:
    nacos:
      discovery: #nacos服务地址
        server-addr: localhost:8848
        namespace: 2bb013e0-6e0a-4b8b-9ee7-743fb3783e2c
```



## Nacos配置管理

### 统一配置管理

在前端操作很方便

1. 新增配置

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221129141248080.png)

2. 填写配置内容

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221129141841252.png)

3. 本地调用远程配置

   - 导入依赖

     ```xml
     <!-- Nacos 配置管理依赖-->
     <dependency>
         <groupId>com.alibaba.cloud</groupId>
         <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
     </dependency>
     ```

   - 在userservice中的resource目录添加一个`bootstrap.yml`文件，这个文件是引导文件，优先级高于`application.yml`（注意删除application中与bootstrap相同的配置）

     ```yaml
     spring:
       application:
         # 服务名称
         name: userServer
       profiles:
         # 开发环境
         active: dev
       cloud:
         nacos:
           # Nacos地址
           server-addr: localhost:8848
           config:
             # 文件后缀名
             file-extension: yaml
     ```

4. 设置为热部署

   
   在使用配置的类上添加注解 @RefreshScope
   
5. 配置共享

   > 微服务启动时会从nacos读取多个配置文件：
   >
   > - [spring.application.name]-[spring.profiles.active].yaml，例如：userservice-dev.yaml
   > - [spring.application.name].yaml，例如：userservice.yaml
   >
   > 无论profile如何变化，[spring.application.name].yaml这个文件一定会加载，因此多环境共享配置可以写入这个文件

   
   优先级：*-profile.yaml > *.yaml > 本地配置
   

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221129150928046.png)

## 搭建集群

> 此次是在Windows环境下搭建的，Linux环境之前搭建过，都差不多。这次也是学习，就Windows凑合凑合吧
>
> Nacos：1.4.1
>
> Nginx：1.18.0

### 数据库

创建数据库 `nacos`，执行查询

```sql
CREATE TABLE `config_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  `c_desc` varchar(256) DEFAULT NULL,
  `c_use` varchar(64) DEFAULT NULL,
  `effect` varchar(64) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `c_schema` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfo_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_aggr   */
/******************************************/
CREATE TABLE `config_info_aggr` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) NOT NULL COMMENT 'group_id',
  `datum_id` varchar(255) NOT NULL COMMENT 'datum_id',
  `content` longtext NOT NULL COMMENT '内容',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfoaggr_datagrouptenantdatum` (`data_id`,`group_id`,`tenant_id`,`datum_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='增加租户字段';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_beta   */
/******************************************/
CREATE TABLE `config_info_beta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `beta_ips` varchar(1024) DEFAULT NULL COMMENT 'betaIps',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfobeta_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_beta';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_tag   */
/******************************************/
CREATE TABLE `config_info_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `tag_id` varchar(128) NOT NULL COMMENT 'tag_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfotag_datagrouptenanttag` (`data_id`,`group_id`,`tenant_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_tag';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_tags_relation   */
/******************************************/
CREATE TABLE `config_tags_relation` (
  `id` bigint(20) NOT NULL COMMENT 'id',
  `tag_name` varchar(128) NOT NULL COMMENT 'tag_name',
  `tag_type` varchar(64) DEFAULT NULL COMMENT 'tag_type',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `nid` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`nid`),
  UNIQUE KEY `uk_configtagrelation_configidtag` (`id`,`tag_name`,`tag_type`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_tag_relation';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = group_capacity   */
/******************************************/
CREATE TABLE `group_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `group_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Group ID，空字符表示整个集群',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数，，0表示使用默认值',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='集群、各Group容量信息表';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = his_config_info   */
/******************************************/
CREATE TABLE `his_config_info` (
  `id` bigint(64) unsigned NOT NULL,
  `nid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `data_id` varchar(255) NOT NULL,
  `group_id` varchar(128) NOT NULL,
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL,
  `md5` varchar(32) DEFAULT NULL,
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `src_user` text,
  `src_ip` varchar(50) DEFAULT NULL,
  `op_type` char(10) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`nid`),
  KEY `idx_gmt_create` (`gmt_create`),
  KEY `idx_gmt_modified` (`gmt_modified`),
  KEY `idx_did` (`data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='多租户改造';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = tenant_capacity   */
/******************************************/
CREATE TABLE `tenant_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Tenant ID',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='租户容量信息表';


CREATE TABLE `tenant_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `kp` varchar(128) NOT NULL COMMENT 'kp',
  `tenant_id` varchar(128) default '' COMMENT 'tenant_id',
  `tenant_name` varchar(128) default '' COMMENT 'tenant_name',
  `tenant_desc` varchar(256) DEFAULT NULL COMMENT 'tenant_desc',
  `create_source` varchar(32) DEFAULT NULL COMMENT 'create_source',
  `gmt_create` bigint(20) NOT NULL COMMENT '创建时间',
  `gmt_modified` bigint(20) NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_info_kptenantid` (`kp`,`tenant_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='tenant_info';

CREATE TABLE `users` (
	`username` varchar(50) NOT NULL PRIMARY KEY,
	`password` varchar(500) NOT NULL,
	`enabled` boolean NOT NULL
);

CREATE TABLE `roles` (
	`username` varchar(50) NOT NULL,
	`role` varchar(50) NOT NULL,
	UNIQUE INDEX `idx_user_role` (`username` ASC, `role` ASC) USING BTREE
);

CREATE TABLE `permissions` (
    `role` varchar(50) NOT NULL,
    `resource` varchar(255) NOT NULL,
    `action` varchar(8) NOT NULL,
    UNIQUE INDEX `uk_role_permission` (`role`,`resource`,`action`) USING BTREE
);

INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);

INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');
```

### nacos

1. 解压后进入conf，修改配置文件cluster.conf.example，重命名为cluster.conf

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221129173647828.png)

2. 在`cluster.conf`中加入（实际生产环境就配置服务器ip）

   ```conf
   127.0.0.1:8845
   127.0.0.1.8846
   127.0.0.1.8847
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221129173829487.png)

3. 然后修改application.properties文件，添加数据库配置

   ```properties
   spring.datasource.platform=mysql
   db.num=1
   db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
   db.user.0=root
   db.password.0=你的密码
   ```

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221129174117515.png)

4. 将nacos复制三份，并修改`application.properties`中端口号，分别为`8845`,`8846`,`8847`

   ![image-20221129174328949](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20221129174328949.png)

5. 启动三个nacos

   ```cmd
   cmd: startup.cmd
   ```
   
   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230223175034394.png)

### nginx

1. 解压后进入conf目录，修改conf/nginx.conf文件，配置如下，放在 `http{ }`内即可

   ```conf
   upstream nacos-cluster {
       server 127.0.0.1:8845;
   	server 127.0.0.1:8846;
   	server 127.0.0.1:8847;
   }
   
   server {
       listen       80;
       server_name  localhost;
   
       location /nacos {
           proxy_pass http://nacos-cluster;
       }
   }
   ```

2. 修改之前`bootstrap.yml` 中配置

   ```yaml
   spring:
     cloud:
       nacos:
       # Nacos地址
         server-addr: localhost:80 
   ```

3. 启动服务，浏览器访问 http://localhost/nacos

   ![](https://heroxin.oss-cn-beijing.aliyuncs.com/blog/img/image-20230223175008565.png)
