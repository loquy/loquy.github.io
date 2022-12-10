---
title: Java 代码生成器
category_bar:
  - Java
tags:
  - Java
  - SpringBoot
  - FreeMarker
categories:
  - - 编程
    - Java
abbrlink: b97e84d6
index_img: /images/code-generator.png
description:
---
# 概述

    代码生成器的主要目的是提高开发效率，减少重复劳动，并确保生成的代码符合一定的规范。

    可以使用它来自动生成那些具有一定规律性的代码，包括但不限于数据库访问层、业务逻辑层和用户界面层。

    它可以根据给定的数据库和表信息，使用模板生成代码，这个过程包括以下步骤：
    
    1、确定需要生成的代码。

    2、编写代码生成器的逻辑。

    3、使用模板引擎来帮助你生成代码。

    4、编写工具来调用你的代码生成器，并将生成的代码写入文件。

# 实现思路

参考：自定义代码生成器。[^1]

![](/images/codeGenIdea.png)

- 使用 Java 中的 JDBC API 来连接到数据库，并使用 SQL 查询或 `DatabaseMetaData` 接口来获取数据库表的元数据，例如表名、列名和数据类型。

- 使用模板引擎（如 [Freemarker](http://freemarker.foofun.cn/) 或 [Velocity](https://velocity.apache.org/)）来定义代码生成模板。模板可能包括普通文本和特殊标记，用于在生成代码时插入元数据。

- 使用 Java 代码从模板引擎加载模板，并将元数据插入模板中。最后，将生成的代码写入文件输出到控制台。

# 模板引擎

参考：FreeMarker 快速入门。[^2]

    FreeMarker 是一款用 java 语言编写的模版引擎，

    它通过提供一组指令来处理模板文件，并将数据和模板文件合并成最终的文件。
    
    FreeMarker 模板文件可以包含特殊的指令，这些指令可以控制模板的渲染方式，例如条件判断、循环语句等。
    
    程序员可以通过在模板文件中插入这些指令来定制模板的渲染方式。

- 特点：

  - 轻量级模版引擎，不需要 Servlet 环境就可以很轻松的嵌入到应用程序中。

  - 能生成各种文本，如 html，xml，java 等。

  - 入门简单，它是用 java 编写的，很多语法和 java 相似。

- 工作原理：
![](/images/FreeMarker.jpg)

- 使用步骤：
  - 加载 FreeMarker 模板引擎的类库。
  
  - 设置模板文件的路径和存储数据的 Map 对象。
  
  - 创建 FreeMarker 模板引擎的 `Configuration` 对象。

  - 创建模板文件的模板对象。
  
  - 程序可以通过调用 FreeMarker 的 `process` 方法，将模板文件和数据进行合并，并将合并后的结果通过 IO 流输出到指定的文件。
  
# 数据库元数据

参考：使用 JDBC 提取数据库元数据。[^3]

Java 数据库元数据（`DatabaseMetaData`）是一个接口，它提供了有关数据库的元数据（即数据库的数据字典）的信息。

它可以用来获取表详细信息、获取列详细信息、获取主键详细信息等。

要使用数据库元数据，需要先使用 JDBC（Java Database Connectivity，Java 数据库连接）连接数据库，然后通过 `Connection` 对象的 `getMetaData` 方法获取 `DatabaseMetaData` 对象。

- 获取表信息： `getTables(...)`。

- 获取列信息： `getColumns(...)`。

- 获取主键信息： `getPrimaryKeys(...)`。

下面是一个简单的示例，展示了如何使用数据库元数据获取表详细信息、获取列详细信息、获取主键详细信息：

```java
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MetaDataExample {
    public static void main(String[] args) throws SQLException {
        // 连接 URL
        String url = "jdbc:mysql://localhost:3306/mydatabase";
        // 数据库用户名
        String username = "user";
        // 数据库密码
        String password = "password";

        // 建立与数据库的连接
        Connection conn = DriverManager.getConnection(url, username, password);

        // 获取数据库元数据
        DatabaseMetaData dbMetaData = conn.getMetaData();

        // 获取表的详细信息
        ResultSet tables = dbMetaData.getTables(null, null, null, new String[] {"TABLE"});
        while (tables.next()) {
            String tableName = tables.getString("TABLE_NAME");
            String tableType = tables.getString("TABLE_TYPE");
            String tableRemarks = tables.getString("REMARKS");
            // 输出表信息
            System.out.println("Table Name: " + tableName);
            System.out.println("Table Type: " + tableType);
            System.out.println("Table Remarks: " + tableRemarks);
        }

        // 获取列的详细信息
        ResultSet columns = dbMetaData.getColumns(null, null, "my_table", null);
        while (columns.next()) {
            String columnName = columns.getString("COLUMN_NAME");
            String columnType = columns.getString("TYPE_NAME");
            String columnSize = columns.getString("COLUMN_SIZE");
            String columnRemarks = columns.getString("REMARKS");
            // 输出列信息
            System.out.println("Column Name: " + columnName);
            System.out.println("Column Type: " + columnType);
            System.out.println("Column Size: " + columnSize);
            System.out.println("Column Remarks: " + columnRemarks);
        }

        // 获取主键的详细信息
        ResultSet primaryKeys = dbMetaData.getPrimaryKeys(null, null, "my_table");
        while (primaryKeys.next()) {
            String primaryKeyName = primaryKeys.getString("COLUMN_NAME");
            String primaryKeySeq = primaryKeys.getString("KEY_SEQ");
            String primaryKeyTableName = primaryKeys.getString("TABLE_NAME");
            // 输出主键信息
            System.out.println("Primary Key Name: " + primaryKeyName);
            System.out.println("Primary Key Sequence: " + primaryKeySeq);
            System.out.println("Primary Key Table Name: " + primaryKeyTableName);
        }
    }
}
```

# 表结构

创建名为 test 数据库，执行以下 sql 语句创建 user 表。

```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL COMMENT '主键',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `pwd` varchar(255) NOT NULL COMMENT '密码',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_date` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';
```

# 项目结构

![](/images/spring-boot-code-generator.jpg)

    spring-boot-code-generator
    │
    ├─src
    │  ├─main
    │  │  ├─java
    │  │  │  └─com
    │  │  │      └─example
    │  │  │          └─codegenerator
    │  │  │              │  SpringBootCodeGeneratorApplication.java
    │  │  │              │
    │  │  │              ├─common
    │  │  │              │      BaseDao.java
    │  │  │              │      BaseDaoImpl.java
    │  │  │              │      Page.java
    │  │  │              │      ResultModel.java
    │  │  │              │
    │  │  │              ├─config
    │  │  │              │      DataSourceConfig.java
    │  │  │              │
    │  │  │              ├─constant
    │  │  │              │      DbConstant.java
    │  │  │              │      TemplateConstant.java
    │  │  │              │
    │  │  │              ├─param
    │  │  │              │      ColumnParam.java
    │  │  │              │      TableParam.java
    │  │  │              │      TemplatePathParam.java
    │  │  │              │
    │  │  │              └─utils
    │  │  │                      CodeGenerateUtils.java
    │  │  │                      DbUtils.java
    │  │  │                      FreeMarkerTemplateUtils.java
    │  │  │                      StrUtils.java
    │  │  │
    │  │  └─resources
    │  │      │  application.properties
    │  │      │
    │  │      └─templates
    │  │              controller.ftl
    │  │              dao.ftl
    │  │              entity.ftl
    │  │              param.ftl
    │  │              service.ftl
    │  │              serviceImpl.ftl
    │  │
    │  └─test
    │      └─java
    │          └─com
    │              └─example
    │                  └─codegenerator
    │                          SpringBootCodeGeneratorApplicationTests.java


# 依赖配置

在项目的 pom.xml 的 dependencies 中导入需要的依赖包:
```xml
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>${mysql.version}</version>
</dependency>

<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.5</version>
</dependency>

<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.8.1</version>
</dependency>

<dependency>
    <groupId>org.hibernate.javax.persistence</groupId>
    <artifactId>hibernate-jpa-2.1-api</artifactId>
    <version>1.0.2.Final</version>
</dependency>

<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>5.6.9.Final</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-orm</artifactId>
    <version>5.3.22</version>
</dependency>
```

# 全局配置
在项目的 application.properties 文件里添加所需配置：
```properties
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.url=jdbc:mysql://localhost:3306/test?serverTimezone=UTC&setUnicode=true&charterEncoding=utf-8
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

# 编码

## 1、常量类

### 1.1、数据库常量

- 该类定义了三个数组常量：`COLUMNTYPE_TIME`、`COLUMNTYPE_NUMBER`，分别用于存储数据库时间类型和数字类型。

- 还定义了四个字符串常量：`TYPE_STRING`、`TYPE_INTEGER`、`TYPE_LONG` 和 `TYPE_BIGDECIMAL`，用于表示不同类型的数据。

- 例如，`TYPE_STRING` 表示字符串类型，`TYPE_INTEGER` 表示整型，`TYPE_LONG` 表示长整型，`TYPE_BIGDECIMAL` 表示高精度计算类型。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.constant;

/**
 * @author loquy
 */
public class DbConstant {

    /**
     * 数据库时间类型
     */
    public static final String[] COLUMNTYPE_TIME = {"datetime", "time", "date", "timestamp"};

    /**
     * 数据库数字类型
     */
    public static final String[] COLUMNTYPE_NUMBER = {"tinyint", "smallint", "mediumint", "int", "number", "integer",
            "bit", "bigint", "float", "double", "decimal"};

    /**
     * 字符串类型
     */
    public static final String TYPE_STRING = "String";

    /**
     * 整型
     */
    public static final String TYPE_INTEGER = "Integer";

    /**
     * 长整型
     */
    public static final String TYPE_LONG = "Long";

    /**
     * 高精度计算类型
     */
    public static final String TYPE_BIGDECIMAL = "BigDecimal";


    /**
     * 时间类型
     */
    public static final String TYPE_DATE = "Date";
}

```
</details>

### 1.2、模板常量

- 该类中包含了几个静态常量，这些常量定义了一些模板的文件路径。通过这些常量，可以引用不同的模板文件。

- 例如，`ENTITY_TEMPLATE` 常量指向了一个实体类的模板文件，`DAO_TEMPLATE` 常量指向了 dao 的模板文件，以此类推。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.constant;

/**
 * @author loquy
 */
public class TemplateConstant {

    /**
     * 实体类模板
     */
    public static final String ENTITY_TEMPLATE = "templates/entity.ftl";

    /**
     * dao模板
     */
    public static final String DAO_TEMPLATE = "templates/dao.ftl";

    /**
     * param模板
     */
    public static final String PARAM_TEMPLATE = "templates/param.ftl";

    /**
     * service模版
     */
    public static final String SERVICE_TEMPLATE = "templates/service.ftl";

    /**
     * service实现类模版
     */
    public static final String SERVICE_IMPL_TEMPLATE = "templates/serviceImpl.ftl";

    /**
     * controller模版
     */
    public static final String CONTROLLER_TEMPLATE = "templates/controller.ftl";
}

```
</details>

## 2、参数类

### 2.1、字段参数

- 该类用于封装从数据库表中读取的字段信息。

- 该类包含了字段名、字段类型、字段注释、主键信息以及 Java 类型等信息。

- 通过这些信息，可以在后续的代码生成过程中使用这些信息。

- 例如，在生成实体类时，可以使用字段名、字段类型以及 Java 类型来生成对应的属性和 getter/setter 方法。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.param;

import lombok.Data;

/**
 * @author loquy
 */
@Data
public class ColumnParam {

    /**
     * 数据库字段名称
     */
    private String columnName;

    /**
     * 数据库字段类型
     */
    private String columnType;

    /**
     * 数据库字段首字母小写且去掉下划线字符串
     */
    private String changeColumnName;

    /**
     * 数据库字段注释
     */
    private String columnComment;

    /**
     * 主键
     */
    private String primaryKey;

    /**
     * java 类型
     */
    private String javaType;
}

```
</details>

### 2.2、表参数

- 该类用于封装从数据库表中读取的表信息。

- 该类包含了表名、表注释、表中数据的日期时间格式、是否包含日期字段、是否包含浮点型字段以及表主键类型等信息。

- 通过这些信息，可以在后续的代码生成过程中使用这些信息。

- 例如，在生成实体类时，可以根据表主键类型来生成对应的主键属性。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.param;

import lombok.Data;

/**
 * @author loquy
 */
@Data
public class TableParam {

    /**
     * 表名
     */
    private String tableName;

    /**
     * 表注释
     */
    private String tableComment;

    /**
     * 日期时间格式化模式
     */
    private String datePattern = "yyyy-MM-dd HH:mm:ss";

    /**
     * 是否存在日期
     */
    private boolean exitDate;

    /**
     * 是否存在浮点型
     */
    private boolean exitBigDecimal;

    /**
     * 表主键类型
     */
    private String primaryKeyType;

}

```
</details>

### 2.3、模板参数

- 该类用于封装代码生成过程中需要使用的一些路径信息。

- 该类包含了包名、项目名称、作者、生成代码的基础路径以及各个模板文件生成的绝对路径等信息。

- 通过这些信息，可以在后续的代码生成过程中使用这些信息。

- 例如，在生成实体类时，可以使用实体类生成的绝对路径来指定实体类文件的存储路径。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.param;

import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * The type Template path param.
 *
 * @author loquy
 */
@Data
public class TemplatePathParam {

    private String currentDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

    /**
     * 包名
     */
    private String packageName;

    /**
     * 代码生成路径
     */
    private String basePath;

    /**
     * 项目名称
     */
    private String projectName;

    /**
     * 作者
     */
    private String author;

    /**
     * 实体类生成的绝对路径
     */
    private String entityPath;

    /**
     * dao生成的绝对路径
     */
    private String daoPath;

    /**
     * param生成的绝对路径
     */
    private String paramPath;

    /**
     * service接口生成的绝对路径
     */
    private String servicePath;

    /**
     * service实现类生成的绝对路径
     */
    private String serviceImplPath;

    /**
     * controller生成的绝对路径
     */
    private String controllerPath;

    /**
     * @param packageName 包名
     * @param basePath    生成代码的基础路径
     * @param projectName 项目名称
     * @param author      作者
     */
    public TemplatePathParam(String packageName, String basePath, String projectName, String author) {
        if (StringUtils.isBlank(packageName)
                || StringUtils.isBlank(basePath)
                || StringUtils.isBlank(author)) {
            throw new RuntimeException("参数不能为空");
        }
        this.packageName = packageName;
        this.basePath = basePath;
        this.author = author;
        this.projectName = projectName;

        String[] split = packageName.split("\\.");

        StringBuilder javaModelPath;
        if (StringUtils.isBlank(projectName)) {
            javaModelPath = new StringBuilder(basePath + "\\src\\main\\java\\");
        } else {
            javaModelPath = new StringBuilder(basePath + "\\" + projectName + "\\src\\main\\java\\");
        }

        for (String s : split) {
            javaModelPath.append(s);
            javaModelPath.append("\\");
        }
        this.setEntityPath(javaModelPath + "\\entity");
        this.setDaoPath(javaModelPath + "\\dao");
        this.setParamPath(javaModelPath + "\\param");
        this.setServicePath(javaModelPath + "\\service");
        this.setServiceImplPath(javaModelPath + "\\service\\impl");
        this.setControllerPath(javaModelPath + "\\controller");
    }

}

```
</details>

## 3、工具类

### 3.1、代码生成器工具类

- 该类主要用于根据给定的 FreeMarker 模板和数据模型生成代码。`generate()` 方法接受表名作为输入，并从数据库中检索相应的表信息。然后，它使用此信息基于指定的 FreeMarker 模板为应用程序的不同层生成代码（例如实体，DAO，服务，控制器）。

- 生成的代码写入指定的输出目录中的文件系统。该类期望模板位于 classpath 目录下，并使用 `FreeMarkerTemplateUtils` 类加载模板。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.utils;

import com.example.codegenerator.constant.TemplateConstant;
import com.example.codegenerator.param.ColumnParam;
import com.example.codegenerator.param.TableParam;
import com.example.codegenerator.param.TemplatePathParam;
import freemarker.template.Template;
import org.apache.commons.lang3.StringUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 代码生成器入口
 * @author loquy
 */
public class CodeGenerateUtils {

    private TemplatePathParam templatePathParam = null;

    public static void main(String[] args) throws Exception {
        CodeGenerateUtils codeGenerateUtils = new CodeGenerateUtils();
        codeGenerateUtils.templatePathParam = new TemplatePathParam("com.example.codegenerator.modules.test",
                "D:\\study\\spring-boot-demo\\spring-boot-code-generator",
                "",
                "loquy");
        codeGenerateUtils.generate("user");
    }

    public void generate(String tableName) throws Exception {
        //数据库相关
        DbUtils dbUtil = new DbUtils();
        List<TableParam> allTables = dbUtil.getAllTables(tableName);
        if (allTables.get(0).getTableName() == null) {
            //获取所有表
            List<TableParam> allTable = dbUtil.getAllTables("");
            for (TableParam tableClass : allTable) {
                generateOne(dbUtil, tableClass);
            }
        } else {
            generateOne(dbUtil, allTables.get(0));
        }

        dbUtil.closeConnection();
    }

    public void generateOne(DbUtils dbUtil, TableParam tableClass) throws Exception {
        //表名
        String table = tableClass.getTableName();
        //获取所有列
        List<ColumnParam> allColumns = dbUtil.getAllColumns(table);

        boolean date = allColumns.stream().anyMatch(m -> "Date".equals(m.getJavaType()));
        boolean bigDecimal = allColumns.stream().anyMatch(m -> "BigDecimal".equals(m.getJavaType()));
        ColumnParam columnParam = allColumns.stream().filter(m -> m.getColumnName().equals(m.getPrimaryKey())).findFirst().orElse(null);

        tableClass.setExitDate(date);
        tableClass.setExitBigDecimal(bigDecimal);
        tableClass.setPrimaryKeyType("String");
        if (columnParam != null) {
            tableClass.setPrimaryKeyType(columnParam.getJavaType());
        }

        System.out.println("============正在生成 " + table + " 表相关文件============");

        //生成实体类
        System.out.println("生成 entity 类");
        generateEntityFile(tableClass, allColumns);

        //生成dao层文件
        System.out.println("生成 dao 类");
        generateDaoFile(tableClass);

        //生成param参数类
        System.out.println("生成 param 类");
        generateParamFile(tableClass, allColumns);

        //生成service接口
        System.out.println("生成 service 接口");
        generateServiceFile(tableClass);

        //生成service实现类
        System.out.println("生成 service 实现类");
        generateServiceImplFile(tableClass);

        //生成Controller层文件
        System.out.println("生成 controller 类");
        generateControllerFile(tableClass);

        System.out.println("============ 全部生成完成！ =============");
    }


    /**
     * 生成实体文件
     */
    private void generateEntityFile(TableParam tableClass, List<ColumnParam> allColumns) throws Exception {
        String suffix = ".java";
        String filePath = templatePathParam.getEntityPath();
        String file = templatePathParam.getEntityPath() + "\\" + StrUtils.changeTableStr(tableClass.getTableName()) + suffix;

        Map<String, Object> dataMap = new HashMap<>(6);
        dataMap.put("model_column", allColumns);
        dataMap = getCommonModel(dataMap, tableClass);
        generateFileByTemplate(TemplateConstant.ENTITY_TEMPLATE, filePath, file, dataMap);
    }

    /**
     * 生成dao层文件
     */
    private void generateDaoFile(TableParam tableClass) throws Exception {
        String suffix = "Dao.java";
        String filePath = templatePathParam.getDaoPath();
        String file = templatePathParam.getDaoPath() + "\\" + StrUtils.changeTableStr(tableClass.getTableName()) + suffix;

        Map<String, Object> dataMap = new HashMap<>(6);
        dataMap = getCommonModel(dataMap, tableClass);
        generateFileByTemplate(TemplateConstant.DAO_TEMPLATE, filePath, file, dataMap);
    }

    /**
     * 生成参数类
     */
    private void generateParamFile(TableParam tableClass, List<ColumnParam> allColumns) throws Exception {
        String suffix = "Param.java";
        String filePath = templatePathParam.getParamPath();
        String file = templatePathParam.getParamPath() + "\\" + StrUtils.changeTableStr(tableClass.getTableName()) + suffix;

        Map<String, Object> dataMap = new HashMap<>(6);
        dataMap.put("model_column", allColumns);
        dataMap = getCommonModel(dataMap, tableClass);
        generateFileByTemplate(TemplateConstant.PARAM_TEMPLATE, filePath, file, dataMap);
    }

    /**
     * 生成业务接口层
     */
    private void generateServiceFile(TableParam tableClass) throws Exception {
        String suffix = "Service.java";
        String filePath = templatePathParam.getServicePath();
        String file = templatePathParam.getServicePath() + "\\" + StrUtils.changeTableStr(tableClass.getTableName()) + suffix;

        Map<String, Object> dataMap = new HashMap<>(6);
        dataMap = getCommonModel(dataMap, tableClass);
        generateFileByTemplate(TemplateConstant.SERVICE_TEMPLATE, filePath, file, dataMap);
    }

    /**
     * 生成业务实现层
     */
    private void generateServiceImplFile(TableParam tableClass) throws Exception {
        String suffix = "ServiceImpl.java";
        String filePath = templatePathParam.getServiceImplPath();
        String file = templatePathParam.getServiceImplPath() + "\\" + StrUtils.changeTableStr(tableClass.getTableName()) + suffix;

        Map<String, Object> dataMap = new HashMap<>(6);
        dataMap = getCommonModel(dataMap, tableClass);
        generateFileByTemplate(TemplateConstant.SERVICE_IMPL_TEMPLATE, filePath, file, dataMap);
    }

    /**
     * 生成控制层
     */
    private void generateControllerFile(TableParam tableClass) throws Exception {
        String suffix = "Controller.java";
        String filePath = templatePathParam.getControllerPath();
        String file = templatePathParam.getControllerPath() + "\\" + StrUtils.changeTableStr(tableClass.getTableName()) + suffix;

        Map<String, Object> dataMap = new HashMap<>(6);
        dataMap = getCommonModel(dataMap, tableClass);
        generateFileByTemplate(TemplateConstant.CONTROLLER_TEMPLATE, filePath, file, dataMap);
    }

    /**
     * 模版通用参数
     *
     * @param dataMap    模型map
     * @param tableClass 表名和表注释参数
     */
    public Map<String, Object> getCommonModel(Map<String, Object> dataMap, TableParam tableClass) {
        dataMap.put("table_name", StrUtils.changeTableStr(tableClass.getTableName()));
        dataMap.put("table_name_small", StrUtils.changeColumnStr(tableClass.getTableName()));
        dataMap.put("table", tableClass.getTableName());
        dataMap.put("datePattern", tableClass.getDatePattern());
        dataMap.put("exitDate", tableClass.isExitDate());
        dataMap.put("exitBigDecimal", tableClass.isExitBigDecimal());
        dataMap.put("author", templatePathParam.getAuthor());
        dataMap.put("date", templatePathParam.getCurrentDate());
        dataMap.put("package_name", templatePathParam.getPackageName());
        dataMap.put("project_name", templatePathParam.getProjectName());
        dataMap.put("table_annotation", StringUtils.isNotBlank(tableClass.getTableComment()) ? tableClass.getTableComment() : null);
        return dataMap;
    }

    /**
     * 静态化方法
     *
     * @param templateName  模版名称
     * @param filePathParam 文件所在目录 绝对路径
     * @param fileParam     文件 绝对路径
     * @param dataMap       数据模型
     */
    private void generateFileByTemplate(final String templateName,
                                        String filePathParam,
                                        String fileParam,
                                        Map<String, Object> dataMap) throws Exception {
        Template template = FreeMarkerTemplateUtils.getTemplate(templateName);
        System.out.println(fileParam);
        //文件夹不存在创建文件夹
        File filePath = new File(filePathParam);
        if (!filePath.exists() && !filePath.isDirectory()) {
            boolean mkdirs = filePath.mkdirs();
            if (!mkdirs) {
                System.out.println(filePathParam + "创建失败！");
            }
        }
        //文件不存在创建文件夹
        File file = new File(fileParam);
        if (!file.exists()) {
            try {
                boolean newFile = file.createNewFile();
                if (!newFile) {
                    System.out.println(fileParam + "创建失败！");
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        FileOutputStream fos = new FileOutputStream(file);
        Writer out = new BufferedWriter(new OutputStreamWriter(fos, StandardCharsets.UTF_8), 10240);
        template.process(dataMap, out);
    }

}

```
</details>

### 3.2、数据库工具类

- 该类主要用于连接数据库、获取数据库信息，如表名、字段名、字段类型等，并封装成对象返回。

- 该类中主要用到了 JDBC 连接数据库的 API，包括 `DriverManager.getConnection()` 方法用于获取数据库连接，`DatabaseMetaData` 类中的方法用于获取数据库元数据信息。

- 其中 `getAllTables()` 方法用于获取所有表名及注释，`getAllColumns()` 方法用于获取某张表的所有列信息，`getJavaType()` 方法用于将数据库字段类型转换成 Java 类型。

- 需要注意的是，该类中使用到的配置信息，例如数据库链接地址、用户名、密码等，需要通过读取 `application.properties` 文件获取，读取文件使用了第三方库 `hutool` 的 Props 类。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.utils;

import cn.hutool.setting.dialect.Props;
import com.example.codegenerator.constant.DbConstant;
import com.example.codegenerator.param.ColumnParam;
import com.example.codegenerator.param.TableParam;
import org.apache.commons.lang3.StringUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

/**
 * 数据库工具类
 *
 * @author loquy
 */
public class DbUtils {

    private final Props props = new Props("application.properties");

    private final String url = getProps().getProperty("spring.datasource.url");

    private final String username = getProps().getProperty("spring.datasource.username");

    private final String password = getProps().getProperty("spring.datasource.password");

    private final String driver = getProps().getProperty("spring.datasource.driver-class-name");

    private Connection connection = null;

    /**
     * 获取jdbc链接
     */
    public Connection getConnection() throws Exception {
        Properties pro = new Properties();
        pro.setProperty("user", username);
        pro.setProperty("password", password);
        String mysql = "mysql";
        String oracle = "oracle";
        if (url.contains(mysql)) {
            //获取mysql表注释
            pro.setProperty("useInformationSchema", "true");
        } else if (url.contains(oracle)) {
            //获取oracle表注释
            pro.setProperty("remarksReporting", "true");
        }

        Class.forName(driver);
        connection = DriverManager.getConnection(url, pro);
        return connection;
    }

    /**
     * 获取当前数据库下的所有表名称及注释
     */
    public List<TableParam> getAllTables(String table) throws Exception {
        String tableName = StringUtils.isNotEmpty(table) ? table : "%";
        List<TableParam> list = new ArrayList<>();
        //获取链接
        Connection conn = getConnection();
        //获取元数据
        DatabaseMetaData metaData = conn.getMetaData();
        //获取所有的数据库表信息
        ResultSet rs = metaData.getTables(conn.getCatalog(), "%", tableName, new String[]{"TABLE"});
        while (rs.next()) {
            TableParam tableClass = new TableParam();
            tableClass.setTableName(rs.getString(3));
            tableClass.setTableComment(rs.getString(5));
            list.add(tableClass);
        }

        if (list.size() == 0) {
            throw new Exception(tableName + "表不存在！");
        }
        return list;
    }

    /**
     * 获取某张表的所有列
     */
    public List<ColumnParam> getAllColumns(String tableName) throws Exception {
        List<ColumnParam> list = new ArrayList<>();
        //获取链接
        Connection conn = getConnection();
        //获取元数据
        DatabaseMetaData metaData = conn.getMetaData();
        //获取所有的数据库某张表所有列信息
        ResultSet rs = metaData.getColumns(conn.getCatalog(), "%", tableName, "%");
        //获取主键字段
        ResultSet rsPk = metaData.getPrimaryKeys(conn.getCatalog(), null, tableName);
        String primaryKey = "";
        while (rsPk.next()) {
            primaryKey = rsPk.getString("COLUMN_NAME");
        }
        while (rs.next()) {
            ColumnParam columnClass = new ColumnParam();
            columnClass.setPrimaryKey(primaryKey);
            columnClass.setColumnName(rs.getString("COLUMN_NAME"));
            columnClass.setColumnType(rs.getString("TYPE_NAME"));
            columnClass.setJavaType(getJavaType(rs.getString("TYPE_NAME")));
            columnClass.setColumnComment(rs.getString("REMARKS"));
            columnClass.setChangeColumnName(StrUtils.changeColumnStr(rs.getString("COLUMN_NAME")));
            list.add(columnClass);
        }

        if (list.size() == 0) {
            throw new Exception(tableName + "表不存在！");
        }
        return list;
    }

    /**
     * 获取数据库表字段类型对应的java类型
     */
    public String getJavaType(String columnType) {
        columnType = columnType.toLowerCase();
        String dataType = getDbType(columnType);
        if (arraysContains(DbConstant.COLUMNTYPE_TIME, dataType)) {
            // 时间类型
            return DbConstant.TYPE_DATE;
        } else if (arraysContains(DbConstant.COLUMNTYPE_NUMBER, dataType)) {
            String[] str = StringUtils.split(StringUtils.substringBetween(columnType, "(", ")"), ",");
            if (str != null && str.length == 2 && Integer.parseInt(str[1]) > 0) {
                // 如果是浮点型 统一用BigDecimal
                return DbConstant.TYPE_BIGDECIMAL;
            }else if (str != null && str.length == 1 && Integer.parseInt(str[0]) <= 10) {
                // 如果是整形
                return DbConstant.TYPE_INTEGER;
            }else {
                // 长整形
                return DbConstant.TYPE_LONG;
            }
        } else {
            // 字符串
            return DbConstant.TYPE_STRING;
        }
    }

    /**
     * 校验数组是否包含指定值
     *
     * @param arr         数组
     * @param targetValue 值
     * @return 是否包含
     */
    public static boolean arraysContains(String[] arr, String targetValue) {
        return Arrays.asList(arr).contains(targetValue);
    }

    /**
     * 获取数据库类型字段
     *
     * @param columnType 列类型
     * @return 截取后的列类型
     */
    public static String getDbType(String columnType)
    {
        if (StringUtils.indexOf(columnType, "(") > 0)
        {
            return StringUtils.substringBefore(columnType, "(");
        }
        else
        {
            return columnType;
        }
    }

    /**
     * 关闭链接
     */
    public void closeConnection() {
        try {
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Props getProps() {
        return props;
    }
}

```
</details>

### 3.3、FreeMarker 工具类

- 该类用于加载并获取 FreeMarker 模板文件。

- FreeMarker 是一种模板引擎，可以通过模板文件来生成静态文本，模板文件中可以使用 FreeMarker 的指令和数据变量来动态控制文本的生成。

- `FreeMarkerTemplateUtils` 类中，`CONFIGURATION` 对象表示一个 FreeMarker 模板配置，该对象用于设置 FreeMarker 的各种属性，包括模板文件的加载方式、编码方式、异常处理方式等。

- `getTemplate()` 方法用于根据模板文件名称获取一个 `Template` 对象，该对象表示一个 FreeMarker 模板文件，可以通过它来生成静态文本。

- 在这个工具类中，模板文件的加载方式采用的是 `FileTemplateLoader` 类，即从 classpath 目录下加载模板文件。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.utils;

import freemarker.cache.FileTemplateLoader;
import freemarker.cache.NullCacheStorage;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

/**
 * FreeMarker模版工具类
 * @author loquy
 */
public class FreeMarkerTemplateUtils {
    private FreeMarkerTemplateUtils() {
    }

    private static final Configuration CONFIGURATION = new Configuration(Configuration.VERSION_2_3_22);

    static {
        //ClassTemplateLoader方式：需要将模版放在FreeMarkerTemplateUtils类所在的包，加载模版时会从该包下加载
        try {
            String path = java.net.URLDecoder.decode(Objects.requireNonNull(
                    FreeMarkerTemplateUtils.class.getClassLoader().getResource("")).getPath(), "utf-8");
            //FileTemplateLoader方式：需要将模版放置在classpath目录下 目录有中文也可以
            CONFIGURATION.setTemplateLoader(new FileTemplateLoader(new File(path)));
        } catch (IOException e) {
            e.printStackTrace();
        }
        CONFIGURATION.setDefaultEncoding("UTF-8");
        CONFIGURATION.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        CONFIGURATION.setCacheStorage(NullCacheStorage.INSTANCE);
    }

    public static Template getTemplate(String templateName) throws IOException {
        return CONFIGURATION.getTemplate(templateName);
    }
}

```
</details>

### 3.4、字符串工具类

- 该类包含两个方法：`changeColumnStr` 和 `changeTableStr`。

- `changeColumnStr` 方法用于将一个带下划线的字符串转换为驼峰命名法，例如将 "user_name" 转换为 "userName"。

- `changeTableStr` 方法用于将一个带下划线的字符串转换为驼峰命名法，并且首字母大写，例如将 "tb_user" 转换为 "TbUser"。

- 两个方法都会通过递归调用来处理多个下划线的情况。

<details>
  <summary>点击查看代码</summary>

```java
package com.example.codegenerator.utils;

/**
 * 字符串处理工具类
 * @author loquy
 */
 public class StrUtils {
    /**
     * 去掉下划线转驼峰  user_name  -> userName
     */
     public static String changeColumnStr(String str) {
        String name = str;
        String underline = "_";
        if (name.indexOf(underline) > 0 && name.length() != name.indexOf(underline) + 1) {
            int lengthPlace = name.indexOf(underline);
            name = name.replaceFirst(underline, "");
            String s = name.substring(lengthPlace, lengthPlace + 1);
            s = s.toUpperCase();
            str = name.substring(0, lengthPlace) + s + name.substring(lengthPlace + 1);
        } else {
            return str;
        }
        return changeColumnStr(str);
     }

    /**
     * 去掉下划线转驼峰  tb_user  -> TbUser
     */
     public static String changeTableStr(String str) {
        String s = changeColumnStr(str);
        return s.substring(0, 1).toUpperCase() + s.substring(1);
     }
  }

```
</details>

# 制作通用模板

在 resources/templates 目录下创建模版文件，模板内容可自定义成你所需要的。

## 1、entity 模版

- 该模板中使用了 Freemarker 模板语言的语法，通过传入的参数（例如表名、字段信息等）来生成对应的实体类代码。

- 例如，在模板中可以使用 `${package_name}` 来表示包名，使用 `${table_name}` 来表示实体类名称，使用 `${model_column}` 来表示表中所有的字段信息。

- 通过这些变量，可以生成完整的实体类代码。例如，通过循环遍历 `${model_column}` 中的每一个字段信息，可以生成对应的属性和 getter/setter 方法。

<details>
  <summary>点击查看代码</summary>

```java
package ${package_name}.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.Id;
<#if exitBigDecimal>
import java.math.BigDecimal;
</#if>
<#if exitDate>
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
</#if>
import java.io.Serializable;

/**
* <#if table_annotation??>${table_annotation}</#if>Entity
* @author ${author}
* @date ${date}
*/
@Entity
@Table(name = "${table}")
public class ${table_name} implements Serializable {
<#if model_column?exists>
    <#list model_column as model>
    /**
    * ${model.columnComment!}
    */
    <#if (model.primaryKey! = model.columnName)>
    @Id
    @Column(name = "${model.columnName?uncap_first}")
    private ${model.javaType} ${model.changeColumnName?uncap_first};

    <#else>
    @Column(name = "${model.columnName?uncap_first}")
    <#if model.javaType == 'Date'>
    @JsonFormat(pattern = "${datePattern}", timezone = "GMT+8")
    @DateTimeFormat(pattern = "${datePattern}")
    </#if>
    private ${model.javaType} ${model.changeColumnName?uncap_first};

    </#if>
    </#list>
</#if>
<#if model_column?exists>
    <#list model_column as model>
    public ${model.javaType} get${model.changeColumnName?cap_first }() {
        return ${model.changeColumnName};
    }

    public void set${model.changeColumnName?cap_first }(${model.javaType} ${model.changeColumnName?uncap_first }) {
        this.${model.changeColumnName} = ${model.changeColumnName};
    }

    </#list>
</#if>
}

```
</details>

## 2、dao 模板

- 该模板中使用了 Freemarker 模板语言的语法，通过传入的参数（例如包名、实体类名等）来生成对应的 Dao 类代码。

- 该 Dao 类继承自 `BaseDaoImpl`，并在构造函数中调用父类的构造函数传入实体类的类型，以便在操作数据库时获取到实体类的信息。

- 该 Dao 类还使用了 `@Repository` 注解，用于将该类标识为 Spring 的数据访问对象。

<details>
  <summary>点击查看代码</summary>

```java
package ${package_name}.dao;

import com.example.codegenerator.common.BaseDaoImpl;
import ${package_name}.entity.${table_name};
import org.springframework.stereotype.Repository;

/**
* <#if table_annotation??>${table_annotation}</#if>Dao
* @author ${author}
* @date ${date}
*/
@Repository
public class ${table_name}Dao extends BaseDaoImpl<${table_name}> {
    public ${table_name}Dao() {
        super(${table_name}.class);
    }
}

```
</details>

## 3、param 模板

- 该模板中使用了 Freemarker 模板语言的语法，通过传入的参数（例如包名、表名等）来生成对应的查询参数类代码。

- 该查询参数类实现了 `Serializable` 接口，表示该类的对象可以被序列化。

- 该查询参数类中定义了与数据库表中列名相同的属性，并提供了对应的 getter 和 setter 方法。

- 该类还使用了 `@JsonFormat` 和 `@DateTimeFormat` 注解来格式化日期类型的属性。

<details>
  <summary>点击查看代码</summary>

```java
package ${package_name}.param;

import java.io.Serializable;
<#if exitBigDecimal>
    import java.math.BigDecimal;
</#if>
<#if exitDate>
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
</#if>

/**
* <#if table_annotation??>${table_annotation}</#if>Param
* @author ${author}
* @date ${date}
*/
public class ${table_name}Param implements Serializable {
<#if model_column?exists>
    <#list model_column as model>
    /**
    * ${model.columnComment!}
    */
    <#if model.javaType == 'Date'>
    @JsonFormat(pattern = "${datePattern}", timezone = "GMT+8")
    @DateTimeFormat(pattern = "${datePattern}")
    </#if>
    private ${model.javaType} ${model.changeColumnName?uncap_first};

    </#list>
</#if>
<#if model_column?exists>
    <#list model_column as model>
    public ${model.javaType} get${model.changeColumnName?cap_first }() {
        return ${model.changeColumnName};
    }

    public void set${model.changeColumnName?cap_first }(${model.javaType} ${model.changeColumnName?uncap_first }) {
        this.${model.changeColumnName} = ${model.changeColumnName};
    }

    </#list>
</#if>
}

```
</details>

## 4、service 模版

- 这段代码定义了一个接口，用于创建一个服务类，该服务类可以可以用来对名为 `${table_name}` 的实体执行 CRUD（创建、读取、更新、删除）操作。

- 该服务暴露了几个方法，例如 `list`、`getById`、`save`、`updateById` 和 `removeById`，

- 它们分别允许用户获取实体列表、根据 ID 获取单个实体、创建新实体、更新现有实体和删除实体。

- 服务方法都会返回一个 `ResultModel` 对象，其中包含操作结果。

- `ResultModel` 类是一个自定义类，它提供了一种统一的方式来表示应用程序中操作的结果。

<details>
  <summary>点击查看代码</summary>

```java
package ${package_name}.service;

import com.example.codegenerator.common.Page;
import com.example.codegenerator.common.ResultModel;
import ${package_name}.entity.${table_name};

/**
* <#if table_annotation??>${table_annotation}</#if>Service
* @author ${author}
* @date ${date}
*/
public interface ${table_name}Service {

    /**
    * 查询所有
    *
    * @param page the page
    * @return the list
    */
    ResultModel<Page<${table_name}>> list(Page<${table_name}> page);

    /**
    * 查询一个
    *
    * @param id the id
    * @return the by id
    */
    ResultModel<${table_name}> getById(Object id);

    /**
    * 新增
    *
    * @param ${table_name_small} the ${table_name_small}
    * @return the boolean
    */
    ResultModel<Object> save(${table_name} ${table_name_small});

    /**
    * 修改
    *
    * @param ${table_name_small} the ${table_name_small}
    * @return the boolean
    */
    ResultModel<Object> updateById(${table_name} ${table_name_small});

    /**
    * 删除
    *
    * @param id the id
    * @return the boolean
    */
    ResultModel<Object> removeById(Object id);
}

```
</details>

## 5、service 实现类模版

- 这段代码定义了一个前面定义的 `${table_name}Service` 接口的具体实现。

- 该类使用了 `@Service` 和 `@Transactional` 注解，表示它是一个 Spring 服务 Bean ，并且它使用了 Spring 框架的事务支持。

- 这意味着这个类中使用了 `@Transactional` 注解的任何方法都将在数据库事务中执行。

- 该类的构造函数接收一个 `${table_name}Dao` 实例，这个实例可能是一个数据访问对象（DAO）类，用于对 `${table_name}` 实体执行数据库操作。

- 该类实现了 `${table_name}Service` 接口定义的方法，为每个方法提供了具体的实现。

- 例如，`list` 方法使用 DAO 执行一个 SQL 查询，从数据库中使用提供的 `Page` 对象分页来检索 `${table_name}` 实体的列表。

- 然后该方法返回一个包含实体列表的 `ResultModel` 对象。

- 类中的其他方法也都使用了 DAO 来在数据库中对 `${table_name}` 实体执行 CRUD 操作，并返回一个包含操作结果的 `ResultModel` 对象。

<details>
  <summary>点击查看代码</summary>

```java
package ${package_name}.service.impl;

import com.example.codegenerator.common.Page;
import com.example.codegenerator.common.ResultModel;
import ${package_name}.entity.${table_name};
import ${package_name}.service.${table_name}Service;
import ${package_name}.dao.${table_name}Dao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
* <#if table_annotation??>${table_annotation}</#if>ServiceImpl
* @author ${author}
* @date ${date}
*/
@Service
@Transactional(rollbackFor = Exception.class)
public class ${table_name}ServiceImpl implements ${table_name}Service{

    public final ${table_name}Dao ${table_name_small}Dao;

    public ${table_name}ServiceImpl(${table_name}Dao ${table_name_small}Dao) {
        this.${table_name_small}Dao = ${table_name_small}Dao;
    }

    @Override
    public ResultModel<Page<${table_name}>> list(Page<${table_name}> page) {
        String sql = "select * from ${table_name_small}";
        return ResultModel.success(${table_name_small}Dao.getNativeQueryListByPage(sql, page));
    }

    @Override
    public ResultModel<${table_name}> getById(Object id) {
        return ResultModel.success(${table_name_small}Dao.findOne(id));
    }

    @Override
    public ResultModel<Object> save(${table_name} ${table_name_small}) {
        ${table_name} ${table_name_small}Old = ${table_name_small}Dao.findOne(${table_name_small}.getId());
        if (${table_name_small}Old == null) {
            ${table_name_small}Dao.insert(${table_name_small});
            return ResultModel.success("保存成功！");
        }
        return ResultModel.fail("已存在数据，保存失败！");
    }

    @Override
    public ResultModel<Object> updateById(${table_name} ${table_name_small}) {
        ${table_name} ${table_name_small}Old = ${table_name_small}Dao.findOne(${table_name_small}.getId());
        if (${table_name_small}Old != null) {
            ${table_name_small}Dao.update(${table_name_small});
            return ResultModel.success();
        }
        return ResultModel.fail("更新失败！");
    }

    @Override
    public ResultModel<Object> removeById(Object id) {
        ${table_name} ${table_name_small} = ${table_name_small}Dao.findOne(id);
        if (${table_name_small} != null) {
            ${table_name_small}Dao.delete(${table_name_small});
            return ResultModel.success();
        }
        return ResultModel.fail("删除失败！");
    }
}

```
</details>

## 6、controller 模版

- 这段代码是一个 Java 控制器，它提供了一系列用于管理 `${table_name}` 实体的 RESTful API 接口。

- 具体来说，它提供了以下接口：

  - `/list`：用于获取 `${table_name}` 实体的分页列表。
  
  - `/read/{id}`：用于获取一个 `${table_name}` 实体的详细信息。
  
  - `/create`：用于新建 `${table_name}` 实体。
  
  - `/update`：用于更新 `${table_name}` 实体。
  
  - `/delete/{id}`：用于删除 `${table_name}` 实体。
  
- 该控制器使用 `@RestController` 注解声明了它是一个 RESTful 控制器，并通过 `@RequestMapping("/${table_name_small}")` 注解指定了它的基础路径为 `/${table_name_small}`。

- 除了接口的基础路径之外，每个接口还有一个方法级别的路径。例如，新增接口的完整路径为 `/${table_name_small}/create`。

- 每个接口都有一个对应的方法，该方法实现了接口的具体逻辑。每个方法都通过 `@GetMapping`、`@PostMapping` 或 `@DeleteMapping` 注解来指定它的 HTTP 方法和路径。

- 该控制器还使用了 `@Validated` 和 `@PathVariable` 注解，分别用于对参数进行验证和从路径中获取参数值。

<details>
  <summary>点击查看代码</summary>

```java
package ${package_name}.controller;

import com.example.codegenerator.common.Page;
import com.example.codegenerator.common.ResultModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;
import ${package_name}.entity.${table_name};
import ${package_name}.param.${table_name}Param;
import ${package_name}.service.${table_name}Service;

/**
 * <#if table_annotation??>${table_annotation}</#if>Controller
 * @author ${author}
 * @date ${date}
 */
@RestController
@RequestMapping("/${table_name_small}")
public class ${table_name}Controller {

    private final ${table_name}Service ${table_name_small}Service;

    public ${table_name}Controller(${table_name}Service ${table_name_small}Service) {
        this.${table_name_small}Service = ${table_name_small}Service;
    }

    /**
     * 查询所有
     */
    @GetMapping("/list")
    public ResultModel<Page<${table_name}>> list(@RequestParam(value = "currentPage") Integer currentPage,
            @RequestParam(value = "pageSize") Integer pageSize) {
        try {
            Page<${table_name}> page = new Page<>(currentPage, pageSize);
            return ${table_name_small}Service.list(page);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultModel.fail(e.getMessage());
        }
    }

    /**
     * 查询一个
     */
    @GetMapping("read/{id}")
    public ResultModel<${table_name}> get(@PathVariable ${primaryKeyType} id) {
        try {
            return ${table_name_small}Service.getById(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultModel.fail(e.getMessage());
        }
    }

    /**
     * 新增
     */
    @PostMapping("/create")
    public ResultModel<Object> save(@Validated @RequestBody ${table_name}Param ${table_name_small}Param) {
        try {
            ${table_name} ${table_name_small} = new ${table_name}();
            BeanUtils.copyProperties(${table_name_small}Param, ${table_name_small});
            return ${table_name_small}Service.save(${table_name_small});
        } catch (Exception e) {
            e.printStackTrace();
            return ResultModel.fail(e.getMessage());
        }
    }

    /**
     * 修改
     */
    @PostMapping("/update")
    public ResultModel<Object> update(@Validated @RequestBody ${table_name}Param ${table_name_small}Param) {
        try {
            ${table_name} ${table_name_small} = new ${table_name}();
            BeanUtils.copyProperties(${table_name_small}Param, ${table_name_small});
            return ${table_name_small}Service.updateById(${table_name_small});
        } catch (Exception e) {
            e.printStackTrace();
            return ResultModel.fail(e.getMessage());
        }
    }

    /**
     * 删除
     */
    @PostMapping("/delete/{id}")
    public ResultModel<Object> delete(@PathVariable ${primaryKeyType} id) {
        try {
            return ${table_name_small}Service.removeById(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultModel.fail(e.getMessage());
        }
    }
}

```
</details>

# 测试

- 执行代码生成器工具类 `CodeGenerateUtils` 输出如下。

```text
============正在生成 user 表相关文件============
生成 entity 类
D:\study\spring-boot-demo\spring-boot-code-generator\src\main\java\com\example\codegenerator\modules\test\\entity\User.java
生成 dao 类
D:\study\spring-boot-demo\spring-boot-code-generator\src\main\java\com\example\codegenerator\modules\test\\dao\UserDao.java
生成 param 类
D:\study\spring-boot-demo\spring-boot-code-generator\src\main\java\com\example\codegenerator\modules\test\\param\UserParam.java
生成 service 接口
D:\study\spring-boot-demo\spring-boot-code-generator\src\main\java\com\example\codegenerator\modules\test\\service\UserService.java
生成 service 实现类
D:\study\spring-boot-demo\spring-boot-code-generator\src\main\java\com\example\codegenerator\modules\test\\service\impl\UserServiceImpl.java
生成 controller 类
D:\study\spring-boot-demo\spring-boot-code-generator\src\main\java\com\example\codegenerator\modules\test\\controller\UserController.java
============ 全部生成完成！ =============
```

- 文件创建成功，相关模块文件如下。

![](/images/codeGenFiles.jpg)

- 启动项目测试刚生成的模块接口是否正常，调用增删改查接口如下。

![](/images/codeGenList.jpg)
![](/images/codeGenRead.jpg)
![](/images/codeGenCreate.jpg)
![](/images/codeGenDelete.jpg)

# 源码

[参见此仓库](https://github.com/loquy/spring-boot-demo)

# 参考
[^1]: [自定义代码生成器](https://yun.itheima.com/jishu/419.html?bilibi)
[^2]: [FreeMarker 快速入门](https://segmentfault.com/a/1190000011768799)
[^3]: [使用 JDBC 提取数据库元数据](https://blog.csdn.net/niugang0920/article/details/119530050)
