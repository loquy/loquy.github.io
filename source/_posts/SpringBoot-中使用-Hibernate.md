---
title: SpringBoot 中使用 Hibernate
category_bar:
  - Java
tags:
  - Hibernate
  - SpringBoot
  - Java
categories:
  - - 编程
    - Java
index_img: 'https://www.loquy.cn/images/hibernate.jpg'
abbrlink: fb332309
date: 2022-08-11 09:20:09
updated: 2022-08-11 09:20:09
description:
---
# 概述

    Hibernate是一个开放源代码的对象关系映射框架，它对JDBC进行了非常轻量级的对象封装，它将POJO与数据库表建立映射关系，
    是一个全自动的orm框架，hibernate可以自动生成SQL语句，自动执行，使得Java程序员可以随心所欲的使用对象编程思维来操纵数据库。 
    Hibernate可以应用在任何使用JDBC的场合，既可以在Java的客户端程序使用，也可以在Servlet/JSP的Web应用中使用，
    最具革命意义的是，Hibernate可以在应用EJB的JaveEE架构中取代CMP，完成数据持久化的重任。


# 表结构

创建名为 hibernate 数据库，执行以下 sql 语句创建 user 表。

```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
```

# Maven 项目结构

![](https://www.loquy.cn/images/spring-boot-hibernate.jpg)

    spring-boot-demo
    │  .gitignore
    │  pom.xml
    │  README.md
    │
    ├─spring-boot-hibernate
    │  │  .gitignore
    │  │  pom.xml
    │  │
    │  ├─src
    │  │  ├─main
    │  │  │  ├─java
    │  │  │  │  └─com
    │  │  │  │      └─example
    │  │  │  │          └─hibernate
    │  │  │  │              │  SpringBootHibernateApplication.java
    │  │  │  │              │
    │  │  │  │              ├─config
    │  │  │  │              │      DataSourceConfig.java
    │  │  │  │              │
    │  │  │  │              ├─dao
    │  │  │  │              │  │  UserDao.java
    │  │  │  │              │  │
    │  │  │  │              │  └─common
    │  │  │  │              │          BaseDao.java
    │  │  │  │              │          BaseDaoImpl.java
    │  │  │  │              │          Page.java
    │  │  │  │              │
    │  │  │  │              └─entity
    │  │  │  │                      User.java
    │  │  │  │
    │  │  │  └─resources
    │  │  │          application.properties
    │  │  │
    │  │  └─test
    │  │      └─java
    │  │          └─com
    │  │              └─example
    │  │                  └─hibernate
    │  │                          SpringBootHibernateApplicationTests.java
    │
    └─spring-boot-mongodb


​


# Pom.xml 依赖配置

- spring-boot-demo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <packaging>pom</packaging>

    <modules>
        <module>spring-boot-mongodb</module>
    </modules>

    <groupId>com.example</groupId>
    <artifactId>spring-boot-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-boot-demo</name>
    <description>spring-boot-demo</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.8.5</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.apache.commons/commons-lang3 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.8.1</version>
        </dependency>

    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```

- spring-boot-hibernate
    - 导入 hibernate 核心的对象关系映射（简称ORM）功能的包
    - 导入使用 hibernate 实现 java 持久化接口（简称JPA）的包

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>spring-boot-demo</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    <artifactId>spring-boot-hibernate</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-boot-hibernate</name>
    <description>spring-boot-hibernate</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.hibernate.javax.persistence/hibernate-jpa-2.1-api -->
        <dependency>
            <groupId>org.hibernate.javax.persistence</groupId>
            <artifactId>hibernate-jpa-2.1-api</artifactId>
            <version>1.0.2.Final</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.hibernate/hibernate-core -->
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-core</artifactId>
            <version>5.6.9.Final</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework/spring-orm -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-orm</artifactId>
            <version>5.3.22</version>
        </dependency>
    </dependencies>
</project>

```

# Application.properties 配置

```properties
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.url=jdbc:mysql://localhost:3306/hibernate?serverTimezone=UTC&setUnicode=true&charterEncoding=utf-8
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

# Entity 对象

```java
package com.example.hibernate.entity;

import javax.persistence.*;

/**
 * @author loquy
 */
@Entity
@Table(name = "user")
public class User {

    @Id
    private int id;

    private String name;

    private String pwd;

    public User() {
    }

    public User(int id, String name, String pwd) {
        this.id = id;
        this.name = name;
        this.pwd = pwd;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pwd='" + pwd + '\'' +
                '}';
    }
}

```

# DataSource 数据源配置

```java
package com.example.hibernate.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import java.util.Properties;

/**
 * @author loquy
 */
@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Bean(name = "datasource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(dbUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);

        Properties propertiesJpa = new Properties();
        dataSource.setConnectionProperties(propertiesJpa);
        return dataSource;
    }
}

```

# Dao 层封装 CRUD

## JPA 实体管理器（EntityManager）

    实体管理器（EntityManager）用于管理系统中的实体，它是实体与数据库之间的桥梁，
    通过调用实体管理器的相关方法可以把实体持久化到数据库中，
    同时也可以把数据库中的记录打包成实体对象。

配置好数据源后可以通过 @PersistenceContext 注解注入 EntityManager 到上下文里管理实体，也可以执行原始的sql查询语句。
详情查看此教程 [JPA 实体管理器](https://www.w3cschool.cn/java/jpa-entitymanager.html)

## 通用 BaseDao

- BaseDao

```java
package com.example.hibernate.dao.common;


import java.util.List;

/**
 * The interface Base dao.
 *
 * @author loquy
 */
public interface BaseDao<T> {

    /**
     * Insert.
     *
     * @param model the model
     */
    void insert(Object model);

    /**
     * Update t.
     *
     * @param entity the entity
     * @return the t
     */
    T update(T entity);

    /**
     * Delete.
     *
     * @param model the model
     */
    void delete(Object model);

    /**
     * Find one t.
     *

     * @param primaryKey  the primary key
     * @return the t
     */
    T findOne(Object primaryKey);

    /**
     * Find all list.
     *

     * @return the list
     */
    List<T> findAll();

    /**
     * 获取查询列表
     *
     * @param queryStr    the query str

     * @return 返回的是list<Entity> 对象
     */
    List<T> getNativeQueryList(final String queryStr);

    /**
     * 获取查询分页列表
     *
     * @param queryStr    the query str
     * @param page        the page

     * @return 返回的是Page<list<Entity>> 对象
     */
    Page<T> getNativeQueryListByPage(String queryStr, Page<T> page);

}

```

- BaseDaoImpl

```java
package com.example.hibernate.dao.common;

import cn.hutool.core.bean.BeanUtil;
import org.hibernate.query.internal.NativeQueryImpl;
import org.hibernate.transform.Transformers;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * @author loquy
 */
public class BaseDaoImpl<T> implements BaseDao<T> {

    @PersistenceContext
    private EntityManager entityManager;

    private final Class<T> entityClass;

    public BaseDaoImpl(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    @Override
    public void insert(Object model) {
        this.entityManager.persist(model);
    }

    @Override
    public T update(T entity) {
        return entityManager.merge(entity);
    }

    @Override
    public void delete(Object model) {
        this.entityManager.remove(model);
    }

    @Override
    public T findOne(Object primaryKey) {
        return entityManager.find(entityClass, primaryKey);
    }

    @Override
    @SuppressWarnings("unchecked")
    public  List<T> findAll() {
        return this.entityManager.createQuery("select obj from " + entityClass.getName() + " obj").getResultList();
    }

    /**
     * 获取查询列表
     *
     * @return 返回的是list<Entity>对象
     */
    @Override
    @SuppressWarnings("unchecked")
    public  List<T> getNativeQueryList(final String queryStr) {
        Query query = createNativeQuery(queryStr);
        query.unwrap(NativeQueryImpl.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        List<T> tmpResult = query.getResultList();
        List<T> result = new ArrayList<>();
        for (Object object : tmpResult) {
            result.add(BeanUtil.toBean(object, entityClass));
        }
        return result;
    }

    /**
     * 获取查询分页列表
     *
     * @return 返回的是Page<list<Entity>> 对象
     */
    @Override
    @SuppressWarnings("unchecked")
    public  Page<T> getNativeQueryListByPage(String queryStr, Page<T> page) {
        queryStr += page.getOrderString();

        Query query = createNativeQuery(queryStr);
        query.unwrap(NativeQueryImpl.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);

        int totalCount = countSqlResult(queryStr).intValue();
        page.setTotalCount(totalCount);
        if (totalCount == 0) {
            return page;
        }
        setPageParameter(query, page);
        List<T> tmpResult = query.getResultList();
        List<T> result = new ArrayList<>();
        for (Object object : tmpResult) {
            result.add(BeanUtil.toBean(object, entityClass));
        }
        page.setResult(result);
        return page;
    }

    /**
     * 统计条数
     *
     */
    protected Long countSqlResult(final String sql) {
        String countHql = "select count(*) from (" + sql + ") count";
        try {
            String valueStr = createNativeQuery(countHql).getSingleResult().toString();
            return new BigDecimal(valueStr.trim()).longValue();
        } catch (NoResultException e) {
            return 0L;
        } catch (Exception e) {
            throw new RuntimeException("sql can't be auto count, sql is:" + countHql, e);
        }
    }


    private Query createNativeQuery(final String queryString, Object... params) {
        Assert.hasText(queryString, "queryString can not empty");
        Query query;
        query = entityManager.createNativeQuery(queryString);
        if (params != null) {
            for (int i = 0; i < params.length; i++) {
                query.setParameter(i + 1, params[i]);
            }
        }
        return query;
    }

    /**
     * 设置分页参数
     *
     */
    protected  void setPageParameter(final Query q, final Page<T> page) {
        q.setFirstResult(page.getOffset());
        q.setMaxResults(page.getLimit());
    }
}

```

- Page

```java
package com.example.hibernate.dao.common;

import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author loquy
 */
public class Page<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private final int limit;

    private int offset;

    private final int currentPage;

    private List<T> result = new ArrayList<>();

    private int totalCount = 0;

    private String sortField;

    private int totalPage = 0;

    public Page(Integer page, Integer limit) {
        this.currentPage = page - 1;
        this.limit = limit;
    }

    public int getOffset() {
        if (offset == 0) {
            this.offset = currentPage * limit;
        }
        return offset;
    }

    public int getLimit() {
        return limit;
    }

    public List<T> getResult() {
        return result;
    }

    public void setResult(final List<T> result) {
        this.result = result;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(final int totalCount) {
        this.totalCount = totalCount;
        this.totalPage = this.totalCount / this.limit;
        if (totalCount % limit > 0) {
            this.totalPage++;
        }
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public String getOrderString() {
        String orderString = "";
        if (StringUtils.isNotBlank(sortField)) {
            orderString = " order by " + sortField;
        }
        return orderString;
    }
}

```

## 业务 UserDao

```java
package com.example.hibernate.dao;

import com.example.hibernate.dao.common.BaseDaoImpl;
import com.example.hibernate.entity.User;
import org.springframework.stereotype.Repository;

/**
 * @author loquy
 */
@Repository
public class UserDao extends BaseDaoImpl<User> {
    public UserDao() {
        super(User.class);
    }
}

```

# 测试

```java
package com.example.hibernate;

import com.example.hibernate.dao.UserDao;
import com.example.hibernate.dao.common.Page;
import com.example.hibernate.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.util.List;

@SpringBootTest
@Transactional
class SpringBootHibernateApplicationTests {

    @Autowired
    public UserDao userDao;

    @Test
    void contextLoads() {
        User one = userDao.findOne(1);

        System.out.println("========");
        System.out.println(one);
        if (one != null) {
            userDao.delete(one);
        }

        User user = new User(1, "insert", "insert");
        userDao.insert(user);
        List<User> all = userDao.findAll();

        System.out.println("========");
        for (User user1 : all) {
            System.out.println(user1.toString());
        }

        user.setName("update");
        user.setPwd("update");
        User update = userDao.update(user);

        System.out.println("========");
        System.out.println(update);

        List<User> nativeQueryList = userDao.getNativeQueryList("select * from user");
        System.out.println("========");
        System.out.println(nativeQueryList);

        Page<User> page = new Page<>(1, 10);
        page.setSortField("id");
        Page<User> nativeQueryListByPage = userDao.getNativeQueryListByPage("select * from user", page);
        System.out.println("========");
        System.out.println(nativeQueryListByPage.getResult());
        System.out.println(nativeQueryListByPage.getTotalCount());
        System.out.println(nativeQueryListByPage.getTotalPage());
        System.out.println(nativeQueryListByPage.getOrderString());
    }

}

```

输出
![](https://www.loquy.cn/images/SpringBootHibernateApplicationTests.jpg)

# 源码

[参见此仓库](https://github.com/loquy/spring-boot-demo)
