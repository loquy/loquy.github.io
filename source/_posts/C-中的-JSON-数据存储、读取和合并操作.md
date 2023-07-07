---
title: C# 中的 JSON 数据存储、读取和合并操作
category_bar:
  - C#
tags: C#
categories:
  - - 编程
    - C#
abbrlink: 6f32793d
date: 2023-07-07 09:43:53
updated: 2023-07-07 09:43:53
index_img: images/c-development.jpg
description:
---
在博客中，我将介绍一个名为`JsonFileManager`的类，该类用于管理数据的保存和读取操作，并提供了一些数据合并的方法。下面是该类的代码及其功能的详细说明。

## 引用和命名空间

```csharp
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
```

上述代码段中的`using`语句用于引入所需的命名空间，以便在代码中使用相关的类型和方法。

## 命名空间

```csharp
namespace Demo
{
    public static class JsonFileManager
    {
        // ...
    }
}
```

在该命名空间中，定义了一个名为`JsonFileManager`的静态类，用于提供数据保存和读取的功能。

## 常量和文件路径

```csharp
private const string BACKUP_DIRECTORY = @"C:\json_backup\";
public const string INBOUND_FILE_NAME = "Inbound.json";
public const string OUTBOUND_FILE_NAME = "OutBound.json";
public const string CUSTOMER_FILE_NAME = "Customer.json";
public const string MATERIAL_FILE_NAME = "Material.json";
public const string SUPPLIER_FILE_NAME = "Supplier.json";
```

这些常量定义了备份目录的路径和各个数据文件的文件名。

## SaveData<T> 方法

```csharp
public static void SaveData<T>(List<T> data, string filename)
{
    // 检查备份目录是否存在，如果不存在则创建
    if (!Directory.Exists(BACKUP_DIRECTORY))
        Directory.CreateDirectory(BACKUP_DIRECTORY);

    // 生成文件路径
    string filePath = Path.Combine(BACKUP_DIRECTORY, filename);

    // 读取已保存的数据
    List<T> existingData = ReadData<T>(filename);

    // 合并数据，去除重复项
    List<T> newData = MergeData(existingData, data);

    // 将数据序列化为 JSON 字符串
    string json = JsonConvert.SerializeObject(newData, Formatting.Indented);

    // 保存 JSON 字符串到文件
    File.WriteAllText(filePath, json);
}
```

该方法用于保存数据到指定的文件。它接收一个泛型参数`T`表示数据类型，一个`List<T>`类型的`data`参数表示要保存的数据列表，以及一个`string`类型的`filename`参数表示文件名。方法的实现逻辑如下：

1. 检查备份目录是否存在，如果不存在则创建备份目录。
2. 生成文件路径。
3. 调用`ReadData<T>`方法读取已保存的数据。
4. 调用`MergeData`方法合并已保存的数据和新数据，去除重复项。
5. 使用`JsonConvert.SerializeObject`方法将数据序列化为 JSON 字符串。
6. 调用`File.WriteAllText`方法将 JSON 字符串写入文件。

## ReadData<T> 方法

```csharp
public static List<T> ReadData<T>(string filename)
{
    // 生成文件路径
    string filePath = Path.Combine(BACKUP_DIRECTORY, filename);

    // 检查文件是否存在
    if (!File.Exists(filePath))
        return new List<T>();

    // 读取文件内容
    string json = File.ReadAllText(filePath);

    // 反序列化 JSON 字符串为数据对象
    List<T> data = JsonConvert.DeserializeObject<List<T>>(json);

    return data ?? new List<T>();
}
```

该方法用于读取指定文件中的数据，并以`List<T>`类型的列表形式返回。它接收一个`string`类型的`filename`参数表示要读取的文件名。方法的实现逻辑如下：

1. 生成文件路径。
2. 检查文件是否存在，如果文件不存在则返回空的数据列表。
3. 读取文件内容。
4. 使用`JsonConvert.DeserializeObject`方法将 JSON 字符串反序列化为数据对象。
5. 返回反序列化后的数据列表。

## MergeData<T> 方法

```csharp
public static List<T> MergeData<T>(List<T> existingData, List<T> newData)
{
    // 获取属性名用于去重判断
    string propertyName = GetPropertyName<T>();

    // 去除重复项
    HashSet<string> existingSet = new HashSet<string>();
    foreach (var item in existingData)
    {
        var propertyValue = GetPropertyValue(item, propertyName);
        if (propertyValue != null)
        {
            existingSet.Add(propertyValue.ToString());
        }
    }

    List<T> mergedData = new List<T>(existingData);
    foreach (var item in newData)
    {
        var propertyValue = GetPropertyValue(item, propertyName);
        if (propertyValue != null && !existingSet.Contains(propertyValue.ToString()))
        {
            mergedData.Add(item);
            existingSet.Add(propertyValue.ToString());
        }
    }

    return mergedData;
}
```

该方法用于合并已保存的数据和新数据，并去除重复项。它接收两个`List<T>`类型的参数`existingData`和`newData`，表示已保存的数据和新数据。方法的实现逻辑如下：

1. 获取用于去重判断的属性名，调用`GetPropertyName<T>`方法获取属性名。
2. 创建一个`HashSet<string>`类型的集合`existingSet`，用于存储已保存数据中的属性值。
3. 遍历已保存数据列表`existingData`，获取每个数据项的属性值，并将属性值转换为字符串类型后添加到`existingSet`集合中。
4. 创建一个新的数据列表`mergedData`，初始值为已保存的数据列表`existingData`的副本。
5. 遍历新数据列表`newData`，获取每个数据项的属性值，并判断属性值是否为空以及`existingSet`集合是否包含该属性值的字符串形式。
6. 如果属性值不为空且`existingSet`集合中不包含该属性值的字符串形式，则将数据项添加到`mergedData`列表中，并将属性值的字符串形式添加到`existingSet`集合中。
7. 返回合并后的数据列表`mergedData`。

## MergeDataWithLocal<T> 方法

```csharp
public static List<T> MergeDataWithLocal<T>(List<T> newData, string filename)
{
    // 读取本地的数据 
    List<T> existingData= ReadData<T>(filename);

    // 获取属性名用于查找本地数据
    string propertyName = GetPropertyName<T>();

    // 创建字典映射
    Dictionary<string, T> existingDataMap = new Dictionary<string, T>();

    // 填充字典映射
    foreach (var item in existingData)
    {
        var propertyValue = GetPropertyValue(item, propertyName);
        if (propertyValue != null)
        {
            string key = propertyValue.ToString();
            if (!existingDataMap.ContainsKey(key))
            {
                existingDataMap.Add(key, item);
            }
        }
    }

    // 替换newData中的项
    for (int i = 0; i < newData.Count; i++)
    {
        var itemToReplace = newData[i];
        var propertyValue = GetPropertyValue(itemToReplace, propertyName);
        if (propertyValue != null)
        {
            string key = propertyValue.ToString();
            if (existingDataMap.ContainsKey(key))
            {
                newData[i] = existingDataMap[key];
            }
        }
    }

    return newData;
}
```

该方法用于将新数据与本地数据进行合并。它接收一个`List<T>`类型的参数`newData`，表示新数据列表，以及一个`string`类型的`filename`参数，表示本地数据的文件名。方法的实现逻辑如下：

1. 调用`ReadData<T>`方法读取本地数据，将结果保存在`existingData`变量中。
2. 获取用于查找本地数据的属性名，调用`GetPropertyName<T>`方法获取属性名。
3. 创建一个`Dictionary<string, T>`类型的字典`existingDataMap`，用于存储本地数据的映射关系。
4. 遍历本地数据列表`existingData`，获取每个数据项的属性值，并将属性值转换为字符串类型后作为字典的键，数据项作为字典的值。
5. 创建一个循环，遍历新数据列表`newData`中的每个数据项。
6. 获取当前要替换的数据项`itemToReplace`的属性值，并将属性值转换为字符串类型后作为字典的键。
7. 如果字典`existingDataMap`中包含该键，则从字典中获取对应的本地数据项，并将其替换为新数据列表`newData`中的对应项。
8. 返回合并后的新数据列表`newData`。

## GetPropertyName<T> 方法

```csharp
private static string GetPropertyName<T>()
{
    Type type = typeof(T);

    if (type == typeof(Repertory))
    {
        return "RepertoryId";
    }
    else if (type == typeof(Customer))
    {
        return "CustomerId";
    }
    else if (type == typeof(Item))
    {
        return "ItmId";
    }
    else if (type == typeof(Supplier))
    {
        return "SupplierId";
    }

    throw new Exception(type + "类型不匹配");
}
```

该方法用于根据数据类型`T`获取属性名。它根据不同的数据类型返回相应的属性名字符串。如果数据类型不匹配，则抛出异常。目前支持的数据类型包括`Repertory`、`Customer`、`Item`和`Supplier`, 请根据自己需要修改数据类型。

## GetPropertyValue<T> 方法

```csharp
private static object GetPropertyValue<T>(T item, string propertyName)
{
    // 根据属性名获取属性值
    var property = typeof(T).GetProperty(propertyName);
    if (property != null)
    {
        return property.GetValue(item);
    }

    throw new Exception("获取不到" + propertyName + "属性值");
}
```

该方法用于根据属性名获取数据项中的属性值。它接收一个数据项`item`和属性名字符串`propertyName`作为参数。方法的实现逻辑如下：

1. 根据数据项的类型`T`和属性名字符串`propertyName`获取属性对象。
2. 如果属性对象不为空，则通过`GetValue`方法获取属性值，并返回属性值。
3. 如果属性对象为空，则抛出异常，表示无法获取属性值。

以上就是`JsonFileManager`类的主要方法及其功能的说明。该类提供了数据的保存、读取和合并功能，可以方便地进行数据管理和操作。