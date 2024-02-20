---
#文章标题
title: MD5&MD5加盐
#文章创建日期
date: 2023-06-04 10:30:00
#文章更新日期
updated: 2023-06-04 10:30:00
#文章标签
tags: [Java,Spring] 
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

# MD5

👀 MD5 是一种常见的加密方式，常用于加密存储密码。全称为：Message-Digest Algoorithm 5，信息摘要算法

它具有以下特性：⛏

- 压缩性：任意长度的数据，算出的 MD5 值都是固定的
- 容易计算：从原数据计算出 MD5 值很容易
- 抗修改性：改变原数据后，所得到的 MD5 值都有很大的差别
- 强抗碰撞：想找到两个不同的数据，使它们具有相同的 MD5 值是非常困难的。



综上：**每个数据都对应一个唯一的 MD5 值**



> 例如：123456 的 MD5 值为：e10adc3949ba59abbe56e057f20f883e
>
> MD5值 e10adc3949ba59abbe56e057f20f883e 对应的原数据为 123456



也就是说，如果知道了 MD5 值，就可以反向推出加密前的数据（应为MD5是唯一的）

详情请看：[彩虹表](https://www.zhihu.com/question/19790488)



<u>所以我们就无法单独使用 MD5 来进行数据的加密存储。</u>



MD5 的实现方式有很多种，JDK自带的 MessageDigest 和 Spring 封装好的 DigestUtils

{% tabs note %}
<!-- tab MessageDigest -->

```java
import org.junit.jupiter.api.Test;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
@Test
public void messageDigest(){
    try {
        String password = "heroxin";
        MessageDigest md = MessageDigest.getInstance("md5");
        md.update(password.getBytes());
        String hashedPwd = new BigInteger(1, md.digest()).toString(16);
        System.out.println(hashedPwd);
        //            ec76c5758966b3f63639fd84f524955a
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    }
}
```

<!-- endtab -->

<!-- tab DigestUtils-->

```java
import org.apache.commons.codec.digest.DigestUtils;
import org.junit.jupiter.api.Test;
@Test
public void digestUtils(){
    String s = DigestUtils.md5Hex("heroxin");
    System.out.println(s);
}
```

<!-- endtab -->

{% endtabs %}



# MD5加盐

为了提高安全性，可以采取加盐的方式。

就是生成一些随机数与 MD5 值进行组合，这些随机数称为 盐 (salt)

这样获取到的新字符串是服务解密为原数据的。



在存储时，数据库同时存储 MD5 值和 salt 值。验证正确性时使用 salt 进行 MD5即可。



具体的实现可以使用 Spring Security 中的 **BCryptPasswordEncoder**



> BCryptPasswordEncoder方法采用SHA-256 +随机盐+密钥对密码进行加密。SHA系列是[Hash](https://so.csdn.net/so/search?q=Hash&spm=1001.2101.3001.7020)算法，不是加密算法，使用加密算法意味着可以解密（这个与编码/解码一样），但是采用Hash处理，其过程是不可逆的。
>
> 详情请看：[BCryptPasswordEncoder](https://blog.csdn.net/u012888704/article/details/107406374)



{% tabs note %}
<!-- tab 加密-->

```java
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Test
public void bCryptPasswordEncoder(){
    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    String encode = bCryptPasswordEncoder.encode("heroxin");
    //        $2a$10$4Xvl1DviJqS.ggItgMKmTO6JjbGbiX3btz/qdneVkPmNZ.zhO6br2
    System.out.println(encode);
}
```

<!-- endtab -->

<!-- tab 验证-->

```java
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Test
public void bCryptPasswordEncoder(){
    BCryptPasswordEncoder bc = new BCryptPasswordEncoder();
    //   	  前者为明文，后者为密文
    boolean b = bc.matches("heroxin", "$2a$10$4Xvl1DviJqS.ggItgMKmTO6JjbGbiX3btz/qdneVkPmNZ.zhO6br2");
    //        true
    System.out.println(b);
}
```

<!-- endtab -->

{% endtabs %}

