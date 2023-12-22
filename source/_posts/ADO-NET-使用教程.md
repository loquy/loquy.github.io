---
title: ADO.NET 使用教程
category_bar:
  - C#
tags: C#
categories:
  - - 编程
    - C#
index_img: images/ADO.NET.png
abbrlink: 2a04719d
date: 2023-12-22 14:58:38
updated: 2023-12-22 14:58:38
description:
---
## 1. 引言

### 1.1 ADO.NET简介
#### 1.1.1 ADO.NET是什么？ ####
ADO.NET（ActiveX Data Objects for .NET）是Microsoft.NET平台上用于数据访问和操作的一组技术。它提供了一种灵活而强大的框架，使开发人员能够连接各种数据源，执行查询、更新和其他数据库操作。

#### 1.1.2 为什么使用ADO.NET？ ####
ADO.NET的设计旨在满足数据访问的多样性和复杂性。通过分离数据访问和数据表示，支持多种数据源，以及提供高性能的数据访问机制，ADO.NET为.NET应用程序提供了强大而可扩展的数据管理工具。

### 1.2 ADO.NET的核心组件
#### 1.2.1 连接（Connection） ####
连接是与数据源建立通信的关键组件。ADO.NET提供了连接对象，允许应用程序建立到数据库的连接，以便执行后续的数据操作。

#### 1.2.2 命令（Command） ####
命令对象允许应用程序定义并执行SQL命令。通过命令对象，可以执行查询、更新、插入和删除等数据库操作。

#### 1.2.3 数据读取器（DataReader） ####
数据读取器提供了一种只进的、高性能的读取数据的方式。它以流的形式逐行检索数据，适用于大型数据集的快速读取。

#### 1.2.4 数据适配器（DataAdapter） ####
数据适配器用于填充数据集（DataSet）并更新数据库。它充当数据源和数据集之间的桥梁，支持将数据在内存中进行操作和缓存。

在接下来的章节中，我们将深入探讨每个核心组件的使用方法，以及如何利用它们来实现灵活、高效的数据访问。


# 2. 连接数据库

## 2.1 数据库连接字符串

### 2.1.1 常见连接字符串示例
数据库连接字符串是连接到数据库时的关键配置信息。不同数据库系统有不同的连接字符串格式，以下是一些常见数据库的连接字符串示例：

#### 2.1.1.1 SQL Server连接字符串

```csharp
Data Source=myServerAddress;Initial Catalog=myDataBase;User Id=myUsername;Password=myPassword;
```

#### 2.1.1.2 MySQL连接字符串

```csharp
Server=myServerAddress;Database=myDataBase;Uid=myUsername;Pwd=myPassword;
```

#### 2.1.1.3 Oracle连接字符串

```csharp
Data Source=myOracleDB;User Id=myUsername;Password=myPassword;
```

### 2.1.2 连接字符串中的重要参数

连接字符串中包含各种参数，以下是一些常见的参数及其作用：

#### 2.1.2.1 Data Source（或 Server）

指定数据库服务器的地址或名称。

#### 2.1.2.2 Initial Catalog（或 Database）

指定要连接的数据库的名称。

#### 2.1.2.3 User Id（或 Uid）和 Password（或 Pwd）

指定连接数据库所使用的用户名和密码。

## 2.1. 建立数据库连接

### 2.1.1 使用SqlConnection类

在.NET中，可以使用`SqlConnection`类来建立与SQL Server数据库的连接。以下是一个简单的连接示例：

```cs
string connectionString = "Data Source=myServerAddress;Initial Catalog=myDataBase;User Id=myUsername;Password=myPassword;";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();
    // 在此执行数据库操作
}
```

### 2.1.2 打开和关闭连接

连接成功后，务必在不再需要连接时将其关闭，以释放资源。使用`Open`方法打开连接，使用`Close`方法关闭连接：

```cs
connection.Open(); // 打开连接
// 执行数据库操作
connection.Close(); // 关闭连接
```

通过以上介绍，读者现在应该了解到如何构建数据库连接字符串以及如何使用`SqlConnection`类来建立和关闭数据库连接。在下一章节中，我们将深入研究执行SQL命令的方式，包括使用`SqlCommand`对象和参数化查询。

# 3. 执行SQL命令

## 3.1  创建SqlCommand对象

### 3.1.1 常见构造方法

`SqlCommand`是执行与SQL Server数据库交互的关键类。以下是一些创建`SqlCommand`对象的常见方式：

#### 3.1.1.1 基本构造方法

```csharp
SqlCommand command = new SqlCommand();
```

#### 3.1.1.2 指定SQL语句和连接的构造方法

```csharp
string queryString = "SELECT * FROM TableName";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlCommand command = new SqlCommand(queryString, connection);
}
```

### 3.1.2 参数化查询

参数化查询是一种防止SQL注入攻击的重要方式。通过使用参数，可以安全地将用户输入嵌入到SQL命令中。以下是参数化查询的示例：

```csharp
string queryString = "SELECT * FROM TableName WHERE ColumnName = @param1";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlCommand command = new SqlCommand(queryString, connection);
    command.Parameters.AddWithValue("@param1", userValue);
}
```

## 3.2 执行SQL命令

### 3.2.1 ExecuteNonQuery方法

`ExecuteNonQuery`方法用于执行不返回结果集的SQL语句，如INSERT、UPDATE和DELETE。示例：

```csharp
string queryString = "INSERT INTO TableName (ColumnName) VALUES (@param1)";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlCommand command = new SqlCommand(queryString, connection);
    command.Parameters.AddWithValue("@param1", userValue);
    
    connection.Open();
    int rowsAffected = command.ExecuteNonQuery();
    connection.Close();
}
```

### 3.2.2 ExecuteScalar方法

`ExecuteScalar`方法用于执行查询并返回结果集的第一行第一列。通常用于获取聚合函数的结果或查询单一值。示例：

```csharp
string queryString = "SELECT COUNT(*) FROM TableName";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlCommand command = new SqlCommand(queryString, connection);

    connection.Open();
    object result = command.ExecuteScalar();
    connection.Close();
}
```

### 3.2.3 ExecuteReader方法

`ExecuteReader`方法用于执行查询并返回`SqlDataReader`对象，用于逐行读取查询结果。示例：

```csharp
string queryString = "SELECT * FROM TableName";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlCommand command = new SqlCommand(queryString, connection);

    connection.Open();
    using (SqlDataReader reader = command.ExecuteReader())
    {
        while (reader.Read())
        {
            // 处理每一行数据
        }
    }
    connection.Close();
}
```

通过以上介绍，读者应该了解如何创建`SqlCommand`对象，执行不同类型的SQL命令，并且学会了如何使用参数化查询提高应用程序的安全性。在下一章节中，我们将深入研究数据的读取和处理，包括使用`DataReader`逐行读取数据。

# 4. 数据读取和处理

## 4.1 使用DataReader读取数据

### 4.1.1 逐行读取数据

`DataReader`提供了一种高效的逐行读取数据的方式，适用于大量数据的快速检索。以下是一个基本的使用示例：

```csharp
string queryString = "SELECT * FROM TableName";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlCommand command = new SqlCommand(queryString, connection);

    connection.Open();
    using (SqlDataReader reader = command.ExecuteReader())
    {
        while (reader.Read())
        {
            // 读取每一行数据
            int column1Value = reader.GetInt32(0); // 通过列索引获取值
            string column2Value = reader.GetString(1); // 通过列索引获取值
            // 处理数据...
        }
    }
    connection.Close();
}
```

### 4.1.2 获取列数据

`DataReader`提供了多种方法用于获取不同数据类型的列值。以下是一些常见的获取列数据的方法：

- `GetInt32(int ordinal)`：获取整数类型列的值。
- `GetString(int ordinal)`：获取字符串类型列的值。
- `GetDateTime(int ordinal)`：获取日期时间类型列的值。
- 其他类型的获取方法，如`GetBoolean`、`GetDecimal`等。

## 4.2 数据类型映射

### 4.2.1 ADO.NET数据类型

ADO.NET支持与数据库中的多种数据类型进行映射。以下是一些常见的ADO.NET数据类型：

- `Int32`：整数类型
- `String`：字符串类型
- `DateTime`：日期时间类型
- `Boolean`：布尔类型
- `Decimal`：十进制类型
- ...

### 4.2.2 数据库数据类型

不同的数据库系统支持不同的数据类型，因此在读取数据时，需要确保数据类型的正确映射。例如，SQL Server中的`int`类型对应于C#中的`Int32`类型，而MySQL中的`INT`类型也对应于C#中的`Int32`类型。

通过`DataReader`逐行读取数据，并理解数据类型的映射关系，开发人员可以灵活处理不同类型的数据，并确保应用程序对数据的正确解释和使用。

在下一章节中，我们将介绍数据适配器和数据集的概念，以及如何使用它们进行离线数据处理和缓存。

# 5. 数据适配器和数据集

## 5.1 数据适配器的作用

数据适配器是ADO.NET中的关键组件之一，用于在数据源（如数据库）和数据集之间建立桥梁。它负责将数据源中的数据填充到数据集中，以及将数据集中的更改提交回数据源。

### 5.1.1 数据适配器的基本用法

数据适配器通过执行命令（如SELECT、INSERT、UPDATE、DELETE）来与数据库进行交互，将数据填充到数据集中，并通过数据集将修改反馈给数据库。以下是数据适配器的基本用法：

```csharp
string queryString = "SELECT * FROM TableName";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlDataAdapter adapter = new SqlDataAdapter(queryString, connection);

    DataSet dataSet = new DataSet();
    
    // 使用数据适配器填充数据集
    adapter.Fill(dataSet, "TableName");

    // 对数据集进行操作...

    // 提交更改到数据库
    adapter.Update(dataSet, "TableName");
}
```

## 5.2 使用DataSet和DataTable

### 5.2.1 创建DataSet和DataTable对象

在使用数据集和数据表之前，需要创建相应的对象。以下是创建`DataSet`和`DataTable`对象的示例：

```csharp
DataSet dataSet = new DataSet("MyDataSet");

// 创建DataTable
DataTable dataTable = new DataTable("MyDataTable");

// 将DataTable添加到DataSet中
dataSet.Tables.Add(dataTable);
```

### 5.2.2 数据关系和约束

数据集支持数据表之间的关系和约束，以维护数据的完整性。

#### 5.2.2.1 创建数据关系

数据关系定义了不同数据表之间的关联，方便在应用程序中进行更复杂的查询和操作。以下是创建数据关系的示例：

```csharp
DataRelation relation = new DataRelation("MyRelation", parentTable.Columns["ParentColumn"], childTable.Columns["ChildColumn"]);
dataSet.Relations.Add(relation);
```

#### 5.2.2.2 添加约束

约束用于定义数据表中列的规则，确保数据的正确性和完整性。以下是添加约束的示例：

```csharp
UniqueConstraint uniqueConstraint = new UniqueConstraint(dataTable.Columns["ColumnName"]);
dataTable.Constraints.Add(uniqueConstraint);
```

通过以上介绍，读者应该了解了数据适配器的作用，以及如何使用`DataSet`和`DataTable`进行离线数据处理和数据关系、约束的操作。在下一章节中，我们将深入探讨数据库事务的概念和在ADO.NET中的实际应用。


# 6. 数据库事务

## 6.1 事务的基本概念

### 6.1.1 什么是事务？

事务是数据库管理系统执行的一个操作序列，它要么完全执行，要么完全不执行，不会结束在中间的某个状态。事务可以包含一个或多个数据库操作，如插入、更新、删除等。

### 6.1.2 事务的特性

事务具有以下四个特性，通常被称为ACID特性：

- **原子性（Atomicity）**：事务中的所有操作要么全部完成，要么全部撤销。如果事务中的任何一个操作失败，整个事务将被回滚，所有的更改都不会生效。

- **一致性（Consistency）**：事务使数据库从一个一致性状态转移到另一个一致性状态。事务执行前后，数据库应保持一致性。

- **隔离性（Isolation）**：事务的执行不受其他事务的干扰。即使有其他事务在同时执行，一个事务的执行不应影响其他事务。

- **持久性（Durability）**：一旦事务完成，其结果就是永久性的。即使系统崩溃，数据库也应该能够在恢复后保持事务的结果。

## 6.2 ADO.NET中的事务处理

### 6.2.1 事务的开启和提交

在ADO.NET中，可以使用`SqlTransaction`类来实现事务处理。以下是事务的开启和提交的基本用法：

```csharp
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();

    // 开始事务
    SqlTransaction transaction = connection.BeginTransaction();

    try
    {
        // 在事务中执行数据库操作
        SqlCommand command = new SqlCommand("UPDATE TableName SET ColumnName = Value", connection, transaction);
        command.ExecuteNonQuery();

        // 提交事务
        transaction.Commit();
    }
    catch (Exception ex)
    {
        // 发生异常，回滚事务
        transaction.Rollback();
    }
}
```

### 6.2.2 事务的回滚

如果在事务执行过程中发生异常或者事务操作不符合预期，可以通过回滚来撤销事务中的所有更改：

```csharp
transaction.Rollback();
```

通过使用事务，可以确保数据库操作的一致性和完整性。在下一章节中，我们将介绍异常处理和错误处理的最佳实践，以确保应用程序在面临异常情况时能够做出适当的处理。


# 7 异常处理和错误处理

## 7.1 ADO.NET中的异常

### 7.1.1 常见的异常类型

在ADO.NET中，可能发生各种异常，例如数据库连接失败、SQL语法错误等。以下是一些常见的异常类型：

- `SqlException`：与SQL Server相关的异常。
- `DbException`：通用数据库异常类型。
- `InvalidOperationException`：在无效操作时引发的异常。
- `ArgumentException`：参数无效时引发的异常。
- 其他与数据库操作相关的异常类型。

### 7.1.2 异常处理的最佳实践

在处理异常时，建议使用适当的异常类型来捕获和处理异常。以下是一些最佳实践：

#### 7.1.2.1 使用多个`catch`块

```csharp
try
{
    // 数据库操作...
}
catch (SqlException ex)
{
    // 处理数据库相关的异常
    Console.WriteLine($"SQL Exception: {ex.Message}");
}
catch (DbException ex)
{
    // 处理通用数据库异常
    Console.WriteLine($"Database Exception: {ex.Message}");
}
catch (Exception ex)
{
    // 处理其他异常
    Console.WriteLine($"Exception: {ex.Message}");
}
finally
{
    // 在这里执行清理工作，如关闭连接等
}
```

#### 7.1.2.2 使用`finally`块进行清理

`finally`块中的代码总是会执行，无论是否发生异常。这里可以放置一些清理资源的代码，如关闭数据库连接。

```csharp
try
{
    // 数据库操作...
}
catch (SqlException ex)
{
    // 处理数据库相关的异常
    Console.WriteLine($"SQL Exception: {ex.Message}");
}
finally
{
    // 在这里执行清理工作，如关闭连接等
}
```

#### 7.1.2.3 使用`using`语句自动释放资源

对于需要手动释放的资源，可以使用`using`语句，确保资源在使用完毕后被正确释放。

```csharp
using (SqlConnection connection = new SqlConnection(connectionString))
{
    try
    {
        connection.Open();
        // 数据库操作...
    }
    catch (SqlException ex)
    {
        // 处理数据库相关的异常
        Console.WriteLine($"SQL Exception: {ex.Message}");
    }
    // 不需要显式关闭连接，using语句会自动调用connection.Dispose()
}
```

通过以上最佳实践，可以有效地处理异常，并确保应用程序在发生异常时能够保持稳定。在下一章节中，我们将介绍最佳实践和性能优化，以确保应用程序的高效运行。

# 8. 最佳实践和性能优化

## 8.1 参数化查询的重要性

### 8.1.1 什么是参数化查询？

参数化查询是通过将参数传递给SQL查询，而不是直接将用户输入嵌入到查询字符串中，从而防止SQL注入攻击。参数化查询可以提高查询性能，并提高应用程序的安全性。

### 8.1.2 参数化查询的示例

```csharp
string queryString = "SELECT * FROM TableName WHERE ColumnName = @param1";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    SqlCommand command = new SqlCommand(queryString, connection);
    command.Parameters.AddWithValue("@param1", userValue);

    connection.Open();
    using (SqlDataReader reader = command.ExecuteReader())
    {
        // 处理查询结果...
    }
    connection.Close();
}
```

## 8.2 数据库连接池

### 8.2.1 什么是数据库连接池？

数据库连接池是一种维护和管理数据库连接的技术，它允许应用程序在需要时从连接池中获取连接，而不是每次都重新创建连接。连接池可以提高应用程序的性能和资源利用率。

### 8.2.2 使用数据库连接池的示例

```csharp
// 使用连接字符串创建连接，连接会自动添加到连接池
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();
    // 执行数据库操作...
}
// 连接会被自动放回连接池
```

## 8.3 数据缓存和性能提升

### 8.3.1 什么是数据缓存？

数据缓存是将一部分数据存储在内存中，以提高对这些数据的访问速度。在某些情况下，缓存可以减少对数据库的频繁访问，提高应用程序性能。

### 8.3.2 使用数据缓存的示例

```csharp
// 使用缓存库（如MemoryCache）存储数据
MemoryCache cache = new MemoryCache(new MemoryCacheOptions());
List<DataItem> data = null;

// 尝试从缓存中获取数据
if (!cache.TryGetValue("CachedData", out data))
{
    // 数据不在缓存中，从数据库中获取数据
    data = GetDataFromDatabase();

    // 将数据存入缓存，设置过期时间等
    cache.Set("CachedData", data, TimeSpan.FromMinutes(10));
}

// 使用数据...
```

通过以上最佳实践和性能优化方法，可以提高应用程序的性能、安全性，并有效地管理数据库连接。这些方法有助于确保应用程序在处理大量数据时仍能保持高效。

# 9. 实例演练

## 9.1 基于ADO.NET的简单CRUD操作示例

### 9.1.1 连接数据库

```csharp
string connectionString = "YourConnectionString";
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();

    // 执行CRUD操作...
    
    connection.Close();
}
```

### 9.1.2 插入数据

```csharp
string insertQuery = "INSERT INTO TableName (Column1, Column2) VALUES (@Value1, @Value2)";
using (SqlCommand command = new SqlCommand(insertQuery, connection))
{
    command.Parameters.AddWithValue("@Value1", value1);
    command.Parameters.AddWithValue("@Value2", value2);

    int rowsAffected = command.ExecuteNonQuery();
}
```

### 9.1.3 查询数据

```csharp
string selectQuery = "SELECT * FROM TableName";
using (SqlCommand command = new SqlCommand(selectQuery, connection))
{
    using (SqlDataReader reader = command.ExecuteReader())
    {
        while (reader.Read())
        {
            // 处理查询结果...
        }
    }
}
```

### 9.1.4 更新数据

```csharp
string updateQuery = "UPDATE TableName SET Column1 = @NewValue WHERE Column2 = @OldValue";
using (SqlCommand command = new SqlCommand(updateQuery, connection))
{
    command.Parameters.AddWithValue("@NewValue", newValue);
    command.Parameters.AddWithValue("@OldValue", oldValue);

    int rowsAffected = command.ExecuteNonQuery();
}
```

### 9.1.5 删除数据

```csharp
string deleteQuery = "DELETE FROM TableName WHERE Column = @Value";
using (SqlCommand command = new SqlCommand(deleteQuery, connection))
{
    command.Parameters.AddWithValue("@Value", value);

    int rowsAffected = command.ExecuteNonQuery();
}
```

## 10.2 数据库事务的实际应用

### 10.2.1 开启事务

```csharp
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();

    // 开始事务
    SqlTransaction transaction = connection.BeginTransaction();

    try
    {
        // 执行数据库操作...

        // 提交事务
        transaction.Commit();
    }
    catch (Exception ex)
    {
        // 发生异常，回滚事务
        transaction.Rollback();
    }
    finally
    {
        connection.Close();
    }
}
```

### 10.2.2 事务中的多个操作

```csharp
using (SqlConnection connection = new SqlConnection(connectionString))
{
    connection.Open();

    // 开始事务
    SqlTransaction transaction = connection.BeginTransaction();

    try
    {
        // 执行数据库操作1
        SqlCommand command1 = new SqlCommand("UPDATE TableName SET Column1 = Value1", connection, transaction);
        command1.ExecuteNonQuery();

        // 执行数据库操作2
        SqlCommand command2 = new SqlCommand("UPDATE TableName SET Column2 = Value2", connection, transaction);
        command2.ExecuteNonQuery();

        // 提交事务
        transaction.Commit();
    }
    catch (Exception ex)
    {
        // 发生异常，回滚事务
        transaction.Rollback();
    }
    finally
    {
        connection.Close();
    }
}
```

通过以上实例演练，读者应该能够掌握基于ADO.NET进行简单CRUD操作的方法以及数据库事务的实际应用。这些实例有助于将理论知识转化为实际应用。

# 11 总结

## 11.1 ADO.NET的优势和局限性

### 11.1.1 优势

- **性能：** ADO.NET 提供了高性能的数据访问，支持连接池和参数化查询，提高了数据库操作的效率。
  
- **灵活性：** ADO.NET 提供了多种数据访问组件，如连接对象、命令对象、数据读取器等，使得开发人员可以根据需要灵活选择合适的组件。

- **与数据库的广泛兼容性：** ADO.NET 可以与多种数据库系统进行集成，包括但不限于 Microsoft SQL Server、MySQL、Oracle 等。

- **事务支持：** ADO.NET 提供了对事务的良好支持，开发人员可以通过事务来确保数据库操作的原子性、一致性、隔离性和持久性。

### 11.1.2 局限性

- **手动管理连接：** ADO.NET 需要开发人员手动管理数据库连接的打开和关闭，如果不谨慎，可能会导致连接未正确关闭而产生资源泄漏。

- **较低的抽象级别：** ADO.NET 的较低抽象级别可能使一些开发任务相对繁琐，相较于一些 ORM 框架，需要更多手动操作。

- **与数据库紧耦合：** 使用 ADO.NET 进行数据库操作时，应用程序与特定数据库的交互较为紧密，切换数据库系统时可能需要进行较大的改动。

## 11.2 推荐学习资源

### 11.2.1 官方文档

- [Microsoft ADO.NET Documentation](https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/)

通过深入学习和实践，你可以更好地掌握 ADO.NET，并将其应用于实际项目中。希望读者能够在使用ADO.NET中取得良好的效果，不断提升自己的数据访问和处理能力。