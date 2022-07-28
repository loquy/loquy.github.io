---
title: SpringBoot 中使用 MongoDb 上传文件
category_bar:
  - Java
tags:
  - MongoDb
  - SpringBoot
  - Java
categories:
  - - 编程
    - Java
index_img: 'https://www.loquy.cn/images/MongoDb.png'
abbrlink: e153eef8
date: 2022-07-28 09:37:38
updated: 2022-07-28 09:37:38
description:
---
# 概述

## 什么是 MongoDb

MongoDB 是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。

在高负载的情况下，添加更多的节点，可以保证服务器性能。

MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。

MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

![](https://www.loquy.cn/images/crud-annotated-document.png)

## MongoDB GridFS

GridFS 用于存储和恢复那些超过16M（BSON文件限制）的文件(如：图片、音频、视频等)。

GridFS 也是文件存储的一种方式，但是它是存储在MonoDB的集合中。

GridFS 可以更好的存储大于16M的文件。

GridFS 会将大文件对象分割成多个小的chunk(文件片段),一般为256k/个,每个chunk将		作为MongoDB的一个文档(document)被存储在chunks集合中。

GridFS 用两个集合来存储一个文件：fs.files与fs.chunks。

每个文件的实际内容被存在chunks(二进制数据)中,和文件有关的meta数据(filename,content_type,还有用户自定义的属性)将会被存在files集合中。

以下是简单的 fs.files 集合文档：

```
{
   "filename": "test.txt",
   "chunkSize": NumberInt(261120),
   "uploadDate": ISODate("2014-04-13T11:32:33.557Z"),
   "md5": "7b762939321e146569b07f72c62cca4f",
   "length": NumberInt(646)
}
```

以下是简单的 fs.chunks 集合文档：

```
{
   "files_id": ObjectId("534a75d19f54bfec8a2fe44b"),
   "n": NumberInt(0),
   "data": "Mongo Binary Data"
}
```

## MongoDB 下载

- [官网下载页面](https://www.mongodb.com/try/download/community)
- [Windows 平台安装 MongoDB](https://www.runoob.com/mongodb/mongodb-window-install.html)

# Maven 项目结构

![](https://www.loquy.cn/images/spring-boot-mongodb.jpg)

    spring-boot-demo
    │  .gitignore
    │  pom.xml
    │  spring-boot-demo.iml
    │
    └─spring-boot-mongodb
    │  .gitignore
    │  pom.xml
    │  spring-boot-mongodb.iml
    │
    ├─src
    │  ├─main
    │  │  ├─java
    │  │  │  └─com
    │  │  │      └─example
    │  │  │          └─mongodb
    │  │  │              │  SpringBootMongodbApplication.java
    │  │  │              │
    │  │  │              ├─controller
    │  │  │              │      MongoFileController.java
    │  │  │              │
    │  │  │              └─utils
    │  │  │                      MongoFileUtils.java
    │  │  │
    │  │  └─resources
    │  │          application.properties
    │  │
    │  └─test
    │      └─java
    │          └─com
    │              └─example
    │                  └─mongodb
    │                          SpringBootMongodbApplicationTests.java

# Pom.xml 依赖配置

- spring-boot-demo 项目配置

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

- spring-boot-mongodb 子模块配置

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
    <artifactId>spring-boot-mongodb</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>spring-boot-mongodb</name>
    <description>spring-boot-mongodb</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-data-mongodb -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
            <version>2.7.2</version>
        </dependency>
    </dependencies>

</project>

```

# Application.properties 配置

```properties
server.port = 8088
spring.profiles.active=default

spring.data.mongodb.uri=mongodb://localhost:27017/GridFS
spring.data.mongodb.database=GridFS
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.username=
spring.data.mongodb.password=

```

# 控制器

```java
package com.example.mongodb.controller;

import com.example.mongodb.utils.MongoFileUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;

/**
 * The type Mongo file controller.
 *
 * @author loquy
 */
@RestController
@RequestMapping(value = "/mongoFile")
public class MongoFileController {

    /**
     * 上传文件
     *
     * @param multipartFile the multipart file
     * @return the string
     */
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile multipartFile) {
        String originFilename = multipartFile.getOriginalFilename();
        String fileId;
        try {
            fileId = MongoFileUtils.uploadFileToGridFs(StringUtils.getFilename(originFilename), multipartFile.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
            return "上传失败，" + e.getMessage();
        }
        return "上传成功，文件ID：" + fileId;
    }

    /**
     * 删除文件
     *
     * @param fileId the file id
     * @return the string
     */
    @PostMapping("/remove")
    public String removeFile(@RequestParam("fileId") String fileId) {
        try {
            MongoFileUtils.deleteByObjectId(fileId);
        } catch (Exception e) {
            e.printStackTrace();
            return "删除失败，" + e.getMessage();
        }

        return "删除成功";
    }

    /**
     * 显示图片
     *
     * @param fileId   the file id
     * @param response the response
     */
    @GetMapping(value = "/showImage/{fileId}")
    public Object showImage(@PathVariable(name = "fileId") String fileId, HttpServletResponse response)  {
        try {
            MongoFileUtils.showImage(fileId, response);
        } catch (Exception e) {
            e.printStackTrace();
            return "显示失败，" + e.getMessage();
        }

        return "";
    }

    /**
     * 下载附件
     *
     * @param fileId   the file id
     * @param response the response
     */
    @GetMapping(value = "/download/{fileId}")
    public Object download(@PathVariable(name = "fileId") String fileId, HttpServletResponse response) {
        try {
            MongoFileUtils.downloadFile(fileId, response);
        } catch (Exception e) {
            e.printStackTrace();
            return "下载失败，" + e.getMessage();
        }
        return "";
    }
}

```

# 工具类

```java
package com.example.mongodb.utils;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.GridFSDownloadStream;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.io.OutputStream;


/**
 * The type Mongo file utils.
 *
 * @author loquy
 */
@Component
public class MongoFileUtils {

    private static String database;

    /**
     * Sets database.
     *
     * @param database the database
     */
    @Value("${spring.data.mongodb.database}")
    public void setDatabase(String database) {
        MongoFileUtils.database = database;
    }

    /**
     * Gets database.
     *
     * @return the database
     */
    public static MongoDatabase getMongoDatabase() {
        MongoClient mongoClient = MongoClients.create();
        return mongoClient.getDatabase(database);
    }

    /**
     * Upload file to grid fs string.
     *
     * @param filename the filename
     * @param in       the in
     * @return the string
     * @throws Exception the exception
     */
    public static String uploadFileToGridFs(String filename, InputStream in) throws Exception {
        GridFSBucket bucket = GridFSBuckets.create(getMongoDatabase());
        ObjectId fileId = bucket.uploadFromStream(filename, in);
        in.close();
        return fileId.toHexString();
    }

    /**
     * Download to stream.
     *
     * @param objectId the object id
     * @param out      the out
     */
    public static void downloadToStream(String objectId, OutputStream out) {
        GridFSBucket bucket = GridFSBuckets.create(getMongoDatabase());
        bucket.downloadToStream(new ObjectId(objectId), out);
    }

    /**
     * Download file.
     *
     * @param objectId the object id
     * @param response the response
     * @throws Exception the exception
     */
    public static void downloadFile(String objectId, HttpServletResponse response) throws Exception {
        OutputStream os;
        String outFileName = findFileNameById(objectId);
        response.setHeader("content-disposition", "attachment;filename=" + java.net.URLEncoder.encode(outFileName, "UTF-8"));
        os = response.getOutputStream();
        downloadToStream(objectId, os);
        os.close();
    }

    /**
     * Show image.
     *
     * @param objectId the object id
     * @param response the response
     * @throws Exception the exception
     */
    public static void showImage(String objectId, HttpServletResponse response) throws Exception {
        response.setContentType("image/jpeg");
        OutputStream out = response.getOutputStream();
        downloadToStream(objectId, out);
        out.flush();
        out.close();
    }

    /**
     * Delete by object id.
     *
     * @param objectId the object id
     */
    public static void deleteByObjectId(String objectId) {
        GridFSBucket bucket = GridFSBuckets.create(getMongoDatabase());
        bucket.delete(new ObjectId(objectId));
    }

    /**
     * Find file name by id string.
     *
     * @param objectId the object id
     * @return the string
     */
    public static String findFileNameById(String objectId) {
        GridFSBucket bucket = GridFSBuckets.create(getMongoDatabase());
        GridFSDownloadStream stream;
        stream = bucket.openDownloadStream(new ObjectId(objectId));
        GridFSFile file = stream.getGridFSFile();
        return file.getFilename();
    }
}

```

# 测试

## 上传文件

![](https://www.loquy.cn/images/mongoFileUpload.jpg)

## 下载文件

![](https://www.loquy.cn/images/mongoFileDownload.jpg)

## 显示图片

![](https://www.loquy.cn/images/mongoFileShowImage.jpg)

## 删除文件

![](https://www.loquy.cn/images/mongoFileRemove.jpg)

# 源码

[参见此仓库](https://github.com/loquy/spring-boot-demo)

