---
title: SpringBoot 中使用 Mybatis
category_bar: true
tags:
  - Mybatis
  - SpringBoot
  - Java
categories: Java
index_img: 'https://www.loquy.cn/images/springboot-mybatis.jpg'
abbrlink: d45b7e43
date: 2022-06-14 10:42:48
updated: 2022-06-14 10:42:48
description:
---
# 概述

    MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

详细使用教程参见 [官方文档](https://mybatis.net.cn/) 。

# 表结构

创建名为 mybatis 数据库，执行以下 sql 语句创建 user 表。

```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
```

# Maven 项目结构
![](https://www.loquy.cn/images/springboot-05-mybatis.jpg)

    springboot-05-mybatis
    ├─src
    │  ├─main
    │  │  ├─java
    │  │  │  └─com
    │  │  │      └─example
    │  │  │          │  Springboot05MybatisApplication.java
    │  │  │          │
    │  │  │          ├─controller
    │  │  │          │      UserController.java
    │  │  │          │
    │  │  │          ├─mapper
    │  │  │          │      UserMapper.java
    │  │  │          │
    │  │  │          └─pojo
    │  │  │                  User.java
    │  │  │
    │  │  └─resources
    │  │      │  application.properties
    │  │      │
    │  │      └─mybatis
    │  │          └─mapper
    │  │                  UserMapper.xml
    │  │
    │  └─test
    │      └─java
    │          └─com
    │              └─example
    │                      Springboot05MybatisApplicationTests.java


# Pom.xml 依赖配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>springboot-05-mybatis</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springboot-05-mybatis</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.3</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```

# Application.properties 配置

- **mybatis.type-aliases-package：** 类型别名可为 Java 类型设置一个缩写名字。 它仅用于 XML 配置，意在降低冗余的全限定类名书写。
- **mybatis.mapper-locations：** xml 映射器的位置，*.xml 代表目录下所有的 xml 文件

```properties
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis?serverTimezone=UTC&setUnicode=true&charterEncoding=utf-8
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

#整合mybatis
mybatis.type-aliases-package=com.example.pojo
mybatis.mapper-locations=classpath:mybatis/mapper/*.xml
```

# POJO 对象

```java
package com.example.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private int id;
    private String name;
    private String pwd;

}

```

# XML 映射器

- 在对应的标签中添加 sql 语句。
- mapper 标签的 namespace 属性值为映射的接口类路径。
- select、insert、update、delete 标签的 id 属性值为接口类下的方法，resultType 属性值为返回的对象类型。
- 标签详细的属性含义 [参见此处](https://mybatis.net.cn/sqlmap-xml.html) 。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    <select id="queryUserList" resultType="User">
        select * from user
    </select>

    <select id="queryUserById" resultType="User">
        select * from user where id = #{id}
    </select>

    <insert id="addUser" parameterType="User">
        insert into user(id, name, pwd) values (#{id}, #{name}, #{pwd})
    </insert>

    <update id="updateUser" parameterType="User">
        update user set name=#{name},pwd=#{pwd} where id = #{id}
    </update>

    <delete id="deleteUser" parameterType="int">
        delete from user where id = #{id}
    </delete>


</mapper>
```

# 接口类

```java
package com.example.mapper;

import com.example.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface UserMapper {
    List<User> queryUserList();

    User queryUserById(int id);

    int addUser(User user);

    int updateUser(User user);

    int deleteUser(int id);
}

```

# 测试

- 新建控制器，添加 REST 请求接口。

```java
package com.example.controller;

import com.example.mapper.UserMapper;
import com.example.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/queryUserList")
    public List<User> queryUserList(){
        List<User> userList = userMapper.queryUserList();
        for (User user : userList) {
            System.out.println(user);
        }
        return userList;
    }

    @GetMapping("/addUser")
    public String addUser(){
        userMapper.addUser(new User(5, "啊啊", "123123"));
        return "ok";
    }

    @GetMapping("/updateUser")
    public String updateUser(){
        userMapper.updateUser(new User(5, "AA", "123123"));
        return "ok";
    }

    @GetMapping("/deleteUser")
    public String deleteUser(){
        userMapper.deleteUser(5);
        return "ok";
    }

}

```

- 请求结果。

```json
[
  {
    "id": 5,
    "name": "AA",
    "pwd": "123123"
  }
]
```

![](https://www.loquy.cn/images/queryUserList.jpg)

# 源码

[参见此仓库](https://github.com/loquy/spring-boot/tree/main/springboot-05-mybatis)
