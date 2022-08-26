---
title: SpringBoot 中使用 Hutool 跨数据库增删改查
category_bar:
  - Java
tags:
  - Hutool
  - SpringBoot
  - Java
categories:
  - - 编程
    - Java
index_img: 'https://www.loquy.cn/images/crossdatabase.png'
abbrlink: f2cc0d20
date: 2022-08-26 11:36:47
updated: 2022-08-26 11:36:47
description:
---
# 概述

    Hutool 是一个小而全的Java工具类库，通过静态方法封装，降低相关 API 的学习成本，
    提高工作效率，使 Java 拥有函数式语言般的优雅，让 Java 语言也可以“甜甜的”。
    
    Hutool 中的工具方法来自每个用户的精雕细琢，它涵盖了 Java 开发底层代码中的方方面面，
    它既是大型项目开发中解决小问题的利器，也是小型项目中的效率担当；
    
    Hutool 是项目中“util”包友好的替代，它节省了开发人员对项目中公用类和公用工具方法的封装时间，
    使开发专注于业务，同时可以最大限度的避免封装不完善带来的 bug。


# 表结构

我们以 MySQL 为例，分别在两个数据库创建名为 test 和 test_1 的数据库，执行以下 sql 语句创建 user 表。

```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
```

# 项目结构

![](https://www.loquy.cn/images/spring-boot-crossdatabase.jpg)

    spring-boot-demo
    │  .gitignore
    │  pom.xml
    │  README.md
    │  spring-boot-demo.iml
    │
    ├─spring-boot-crossdatabase
    │  │  .gitignore
    │  │  pom.xml
    │  │  spring-boot-crossdatabase.iml
    │  │
    │  ├─src
    │  │  ├─main
    │  │  │  ├─java
    │  │  │  │  └─com
    │  │  │  │      └─example
    │  │  │  │          └─crossdatabase
    │  │  │  │              │  SpringBootCrossdatabaseApplication.java
    │  │  │  │              │
    │  │  │  │              └─utils
    │  │  │  │                      CrossDatabaseUtils.java
    │  │  │  │
    │  │  │  └─resources
    │  │  │      │  application.properties
    │  │  │      │
    │  │  │      └─config
    │  │  │              db.setting
    │  │  │
    │  │  └─test
    │  │      └─java
    │  │          └─com
    │  │              └─example
    │  │                  └─crossdatabase
    │  │                          SpringBootCrossdatabaseApplicationTests.java
    │
    ├─spring-boot-hibernate
    │
    └─spring-boot-mongodb

# 引入依赖

在项目的 pom.xml 的 dependencies 中加入以下内容:

- 导入 hutool-all 包

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.5</version>
</dependency>
```

- 引入 MySQL JDBC 驱动 jar

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>${mysql.version}</version>
</dependency>
```

# 数据库配置

在 src/main/resources/config 目录下添加 db.setting 文件：

```setting
[test]
url = jdbc:mysql://localhost:3306/test?serverTimezone=UTC&setUnicode=true&charterEncoding=utf-8
username = root
password = root
driver = com.mysql.jdbc.Driver

[test_1]
url = jdbc:mysql://192.168.8.117:3306/test_1?serverTimezone=UTC&setUnicode=true&charterEncoding=utf-8
username = root
password = root
driver = com.mysql.jdbc.Driver
```

# 编写工具类

```java
package com.example.crossdatabase.utils;

import cn.hutool.db.Db;
import cn.hutool.db.ds.DSFactory;

import javax.sql.DataSource;
import java.util.HashMap;


/**
 * @author loquy
 */
public class CrossDatabaseUtils {

    private static final HashMap<String, Db> DBS = new HashMap<>();

    /**
     * 初始化数据源
     *
     */
    public static Db initDb(String dataBase) {
        Db db;
        if (DBS.containsKey(dataBase)) {
            db = DBS.get(dataBase);
        } else {
            DataSource ds = DSFactory.get(dataBase);
            db = Db.use(ds);
            DBS.put(dataBase,db);
        }
        return db;
    }
}

```


# 测试

```java
package com.example.crossdatabase;

import cn.hutool.db.Db;
import cn.hutool.db.Entity;
import com.example.crossdatabase.utils.CrossDatabaseUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.SQLException;
import java.util.List;

@SpringBootTest
class SpringBootCrossdatabaseApplicationTests {

    @Test
    void contextLoads() {
        try {
            Db testDb = CrossDatabaseUtils.initDb("test");
            Db testDb1 = CrossDatabaseUtils.initDb("test_1");
            System.out.println("============test=============");
            crud(testDb);
            System.out.println("============test_1=============");
            crud(testDb1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void crud(Db db) throws SQLException {
        // 删除所有
        int deleteAll = db.execute("delete from user");
        // 新增
        int insert = db.execute("insert into user values (?, ?, ?)", 1, "张三", 123123);
        int insert1 = db.execute("insert into user values (?, ?, ?)", 2, "李四", 123123);
        // 更新
        int update = db.execute("update user set pwd = ? where name = ?", 123456, "张三");
        // 删除
        int delete = db.execute("delete from user where name = ?", "张三");
        // 查询
        List<Entity> query = db.query("select * from user");
        System.out.println(deleteAll);
        System.out.println(insert);
        System.out.println(insert1);
        System.out.println(update);
        System.out.println(delete);
        System.out.println(query);
    }
}

```

输出
![](https://www.loquy.cn/images/SpringBootCrossdatabaseApplicationTests.jpg)

# 源码

[参见此仓库](https://github.com/loquy/spring-boot-demo)
