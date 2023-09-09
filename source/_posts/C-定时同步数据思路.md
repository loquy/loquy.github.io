---
title: C# 定时同步数据思路
category_bar:
  - C#
tags: C#
categories:
  - - 编程
    - C#
abbrlink: 903dbbbd
date: 2023-09-08 15:43:29
updated: 2023-09-08 15:43:29
index_img: images/cron.jpg
description:
---

在许多应用程序中，数据同步是一个关键的任务，用于保持应用程序的数据与外部源（如 API 或其他数据库）同步。这篇博客将介绍如何使用 C# 来实现定时数据同步的思路，以确保数据的准确性和一致性。

## 思路

1. 定时执行同步数据的程序，使用互斥锁或者信号量来控制程序的并发执行，确保定时任务在前一个任务完成之后再触发。
1.1. 发送网络请求，请求接口数据，构造数据对应的实体类。
1.2. 批量插入或批量更新到数据库 。
1.3. 把查询放到循环外减少查询次数，去除循环内重复的查询语句，O(n)->O(1) 减小时间复杂度。
2. 减少锁表时间，需要过滤数据，减少数据量，然后进行同步。
2.1. 配置增量或全量同步，把接口数据分批次 IN 查询，然后和数据库的数据进行对比，不存在则更新 。
2.2. 配置同步天数，去同步多少天前的数据。
    
## 1. 控制并发执行

在定时执行同步数据的程序中，一个重要的考虑因素是如何控制程序的并发执行，以避免可能的冲突和数据不一致。这可以通过以下方式来实现：

### 1.1 使用互斥锁或信号量

可以使用互斥锁（Mutex）或信号量（Semaphore）来确保定时任务在前一个任务完成之后再触发。这样可以防止多个任务同时执行，避免数据竞争和不一致性问题。

>定时同步，代码示例：
```csharp
using Quartz;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JobNamespace
{
    public class DataSyncJob : IJob
    {
        private static SemaphoreSlim semaphore = new SemaphoreSlim(1);

        public async Task Execute(IJobExecutionContext context)
        {
            try
            {
                await semaphore.WaitAsync();

                SyncData("示例", () =>
                {
                    // 执行数据同步操作
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"定时任务发生异常：{ex.Message}");
            }
            finally
            {
                semaphore.Release();
            }
        }

        private void SyncData(string operationType, Action syncAction)
        {
            Console.WriteLine($"开始同步数据：{operationType}");
            syncAction.Invoke();
            Console.WriteLine($"完成同步数据：{operationType}");
        }
    }
}
```
```csharp
using Quartz.Impl;
using Quartz;
using System;
using System.Threading.Tasks;
using JobNamespace.Job;

namespace Demo
{
    internal static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main()
        {
            // 启动定时任务
            StartScheduler();
        }

        static async void StartScheduler()
        {
            await RunScheduler();
        }

        static async Task RunScheduler()
        {
            // 创建调度器工厂
            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
            IScheduler scheduler = await schedulerFactory.GetScheduler();

            // 创建一个触发器，使用 Cron 表达式触发定时任务
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("SyncDataTrigger", "Sync")
                .WithCronSchedule("0/30 * * * * ?") // 每30秒触发一次
                .Build();

            // 创建一个任务
            IJobDetail job = JobBuilder.Create<SyncErpData>()
                .WithIdentity("SyncDataJob", "Sync")
                .Build();

            // 将任务和触发器关联到调度器
            await scheduler.ScheduleJob(job, trigger);

            // 启动调度器
            await scheduler.Start();
        }

    }
}

```
## 2. 数据请求和处理

在同步数据的过程中，需要执行以下步骤来获取和处理数据：

### 2.1 发送网络请求

首先，需要向外部源发送网络请求，以获取需要同步的数据。这通常涉及与外部 API 进行通信，然后将返回的数据转化为 C# 中的实体类。

>发送请求，代码示例：
```csharp
using System;
using System.Net;
using System.Text;
using System.IO;
using Newtonsoft.Json;

public static T ExecutePostRequest<T>(string url, object requestData)
{
    try
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "POST";
        request.ContentType = "application/json";

        string jsonRequestData = JsonConvert.SerializeObject(requestData);
        byte[] data = Encoding.UTF8.GetBytes(jsonRequestData);

        using (Stream requestStream = request.GetRequestStream())
        {
            requestStream.Write(data, 0, data.Length);
        }

        using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
        {
            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"接口调用失败，状态码：{response.StatusCode}");
            }

            using (Stream responseStream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(responseStream))
            {
                string jsonResponseData = reader.ReadToEnd();
                return JsonConvert.DeserializeObject<T>(jsonResponseData);
            }
        }
    }
    catch (Exception ex)
    {
        throw new Exception($"接口调用发生异常：{ex.Message}");
    }
}

```
### 2.2 数据插入或更新

获取数据后，可以将其批量插入或批量更新到数据库中。这可以通过使用 SqlBulkCopy 来实现，以提高性能和效率。

>批量插入，代码示例：
```csharp
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

public static void BulkInsertOrders(List<Order> orders, string connectionString)
{
    try
    {
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();

            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
            {
                bulkCopy.DestinationTableName = "Orders"; // 表名
                bulkCopy.BatchSize = 1000; // 每批次的行数
                bulkCopy.BulkCopyTimeout = 60; // 超时时间（秒）

                // 定义数据映射，将源数据列映射到目标表的列
                bulkCopy.ColumnMappings.Add("ID", "ReferenceID");
                bulkCopy.ColumnMappings.Add("CustomerID", "CustomerID");
                bulkCopy.ColumnMappings.Add("OrderDate", "OrderDate");
                bulkCopy.ColumnMappings.Add("TotalAmount", "Amount");

                DataTable dataTable = new DataTable();
                dataTable.Columns.Add("ID", typeof(int));
                dataTable.Columns.Add("CustomerID", typeof(int));
                dataTable.Columns.Add("OrderDate", typeof(DateTime));
                dataTable.Columns.Add("TotalAmount", typeof(decimal));

                foreach (var order in orders)
                {
                    // 将数据添加到DataTable
                    dataTable.Rows.Add(order.ID, order.CustomerID, order.OrderDate, order.TotalAmount);
                }

                // 执行批量插入
                bulkCopy.WriteToServer(dataTable);
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("批量插入失败：" + ex.Message);
    }
}

```

>批量更新，代码示例：
```csharp
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

public static void BulkUpdateOrders(List<Order> updatedOrders, string connectionString)
{
    try
    {
        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            connection.Open();

            // 创建一个临时表，用于存储要更新的数据
            using (SqlBulkCopy bulkCopy = new SqlBulkCopy(connection))
            {
                bulkCopy.DestinationTableName = "TempOrders"; // 临时表名
                bulkCopy.BatchSize = 1000; // 每批次的行数
                bulkCopy.BulkCopyTimeout = 60; // 超时时间（秒）

                // 定义数据映射，将源数据列映射到临时表的列
                bulkCopy.ColumnMappings.Add("ID", "ReferenceID");
                bulkCopy.ColumnMappings.Add("CustomerID", "CustomerID");
                bulkCopy.ColumnMappings.Add("OrderDate", "OrderDate");
                bulkCopy.ColumnMappings.Add("TotalAmount", "Amount");

                DataTable dataTable = new DataTable();
                dataTable.Columns.Add("ID", typeof(int));
                dataTable.Columns.Add("CustomerID", typeof(int));
                dataTable.Columns.Add("OrderDate", typeof(DateTime));
                dataTable.Columns.Add("TotalAmount", typeof(decimal));

                foreach (var order in updatedOrders)
                {
                    // 将要更新的数据添加到DataTable
                    dataTable.Rows.Add(order.ID, order.CustomerID, order.OrderDate, order.TotalAmount);
                }

                // 执行将数据插入到临时表的操作
                bulkCopy.WriteToServer(dataTable);
            }

            // 使用SQL语句执行批量更新操作
            using (SqlCommand updateCommand = new SqlCommand("UPDATE [Orders] SET [CustomerID] = [Temp].[CustomerID], [OrderDate] = [Temp].[OrderDate], [TotalAmount] = [Temp].[Amount] FROM [Orders] INNER JOIN [TempOrders] AS [Temp] ON [Orders].[ReferenceID] = [Temp].[ID]", connection))
            {
                updateCommand.ExecuteNonQuery();
            }

            // 清空临时表
            using (SqlCommand truncateCommand = new SqlCommand("TRUNCATE TABLE [TempOrders]", connection))
            {
                truncateCommand.ExecuteNonQuery();
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("批量更新失败：" + ex.Message);
    }
}

```
### 2.3 减少查询次数

为了优化性能，建议将查询操作放到循环外部，以减少查询次数。这可以通过在循环之外查询数据，然后在循环内部对数据进行处理，从而减少数据库查询的次数。这将大大降低时间复杂度，从 O(n) 减小到 O(1)。

## 3. 减少锁表时间

为了减少锁表时间，可以采取以下措施：

### 3.1 数据过滤

在同步数据之前，可以对数据进行过滤，减少需要同步的数据量。这可以通过配置增量同步或全量同步来实现。对于增量同步，可以将接口数据分成批次，并将其与数据库数据进行对比，然后仅同步不存在的数据。对于全量同步，可以定期同步所有数据，确保数据的一致性。

>增量同步或全量同步，代码示例：
```csharp
public static List<Order> FindOrdersToUpdate(List<Order> orders, SqlTransaction transaction)
{
    bool fullSync = ConfigReader.ReadConfigValue<bool>("syncMode");

    if (fullSync)
    {
        // 全量更新
        return orders;
    }

    // 增量更新
    List<Order> missingOrders = new List<Order>();
    int batchSize = 100;
    List<Order> ordersToRemove = new List<Order>();

    for (int i = 0; i < orders.Count; i += batchSize)
    {
        List<Order> batch = orders.Skip(i).Take(batchSize).ToList();

        string inClause = string.Join(",", batch.Select(order => "'" + order.ID.ToString() + "'"));

        string query = $"SELECT [ReferenceID] FROM [dbo].[Orders] WHERE [ReferenceID] IN ({inClause})";
        using (SqlCommand cmd = new SqlCommand(query, transaction.Connection, transaction))
        {
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    if (!reader.IsDBNull(0))
                    {
                        string referenceID = reader.GetString(0);
                        var matchingOrder = batch.FirstOrDefault(order => order.ID == Convert.ToInt32(referenceID));

                        if (matchingOrder != null)
                        {
                            ordersToRemove.Add(matchingOrder);
                        }
                    }
                }
            }
        }
    }

    // 执行删除操作
    foreach (var orderToRemove in ordersToRemove)
    {
        orders.Remove(orderToRemove);
    }

    return orders;
}

```
### 3.2 同步天数配置

可以配置同步天数，以确定要同步多少天前的数据。这有助于控制同步的范围，并避免同步过多的历史数据，从而减少锁表时间。

>读取 Json 配置文件，代码示例：
```csharp
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace Demo
{
    public static class ConfigReader
    {
        public static T ReadConfigValue<T>(string settingName, string configFilePath = "config.json")
        {
            string configJson = File.ReadAllText(configFilePath);

            JObject config = JObject.Parse(configJson);

            if (config.TryGetValue(settingName, out var value))
            {
                try
                {
                    return (T)Convert.ChangeType(value.ToString(), typeof(T));
                }
                catch
                {
                    // 转换失败，返回默认值
                    return default(T);
                }
            }

            return default(T);
        }
    }
}
```

```csharp
// 读取配置文件
bool isFullSync = ConfigReader.ReadConfigValue<bool>("isFullSync");
int syncDay = ConfigReader.ReadConfigValue<int>("SyncDay");
syncDay = Math.Max(syncDay, 0);
```
通过以上的思路和方法，可以有效地实现定时数据同 步任务，并确保数据的准确性、一致性和性能。这将有助于维护应用程序的数据质量和稳定性。希望本篇博客对你理解和实现 C# 数据同步任务有所帮助。