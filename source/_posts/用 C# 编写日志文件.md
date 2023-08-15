---
title: 用 C# 编写日志文件
category_bar:
  - C#
tags: C#
categories:
  - - 编程
    - C#
index_img: images/logFile.jpg
abbrlink: ef2f8f88
date: 2023-08-15 13:41:27
updated: 2023-08-15 13:41:27
description:
---
在软件开发中，日志记录是一项至关重要的任务，它可以帮助我们跟踪应用程序的状态、故障排除和性能优化。在本篇博客中，我们将深入介绍一个用于日志记录的 C# 类库，展示其如何实现灵活、可靠且易于使用的特性。

### 背景

在开发过程中，我们常常需要记录应用程序的运行状态、异常情况和重要事件，以便后续分析和调试。传统的日志记录方式可能相对繁琐且难以管理，而这个 C# 类库则提供了一个高效的解决方案，可以帮助开发人员更轻松地实现日志记录功能。

### 功能概述

这个 C# 类库（命名为 `LogWrite`）旨在提供一个灵活、可靠且易于使用的日志记录工具。它具有以下主要功能：

1. **日志写入功能**：提供了三个不同的方法来写入日志，分别是 `WriteLog`、`WriteLogWithSQL` 和 `WriteLogWithException`。开发人员可以根据需要选择适当的方法，并附加额外的信息，如执行的 SQL 语句或异常信息。

2. **日志文件夹管理**：类库会自动创建日志文件夹，以确保日志文件的安全存储。如果日志文件夹不存在，它会在需要时自动创建。

3. **日志文件清理**：提供了 `DeleteLog` 方法，可以删除指定文件夹中过期的日志文件。这有助于保持日志文件夹的整洁，并避免占用过多磁盘空间。

4. **日志编号**：每条日志都带有一个唯一的编号，以帮助区分不同的日志条目。该编号会自动递增，确保日志的顺序和唯一性。

### 代码解析

以下是`LogWrite` 类的详细代码示例：

```csharp
using System;
using System.IO;
using System.Text.RegularExpressions;

namespace Demo
{
    public class LogWrite
    {
        private const string DirectoryPathD = @"D:\log\";

        public void WriteLog(string filePath, string content)
        {
            EnsureLogDirectoryExists();

            string logFilePath = GetLogFilePath(filePath);
            WriteLogEntry(logFilePath, content);
        }

        public void WriteLogWithSQL(string filePath, string content, string sql)
        {
            EnsureLogDirectoryExists();

            string logFilePath = GetLogFilePath(filePath);
            WriteLogEntry(logFilePath, content, $"Executed SQL: {sql}");
        }

        public void WriteLogWithException(string filePath, string content, Exception ex)
        {
            EnsureLogDirectoryExists();

            string logFilePath = GetLogFilePath(filePath);
            WriteLogEntry(logFilePath, content, $"Exception Message: {ex.Message}\nStack Trace: {ex.StackTrace}");
        }

        public void DeleteLog(string folderPath)
        {
            try
            {
                DirectoryInfo dir = new DirectoryInfo(folderPath);
                FileSystemInfo[] fileinfo = dir.GetFileSystemInfos();

                foreach (FileSystemInfo info in fileinfo)
                {
                    if (info is DirectoryInfo subdir)
                    {
                        subdir.Delete(true);
                    }
                    else if (info.CreationTime < DateTime.Now.AddDays(-7))
                    {
                        File.Delete(info.FullName);
                    }
                }
            }
            catch { }
        }

        private void EnsureLogDirectoryExists()
        {
            if (!Directory.Exists(DirectoryPathD))
            {
                Directory.CreateDirectory(DirectoryPathD);
            }
        }

        private string GetLogFilePath(string filePath)
        {
            return Path.Combine(DirectoryPathD, $"{DateTime.Now:yyyyMMdd}_{filePath}");
        }

        private void WriteLogEntry(string logFilePath, string content, string additionalInfo = "")
        {
            int logNumber = GetNextLogNumber(logFilePath);

            using (FileStream aFile = new FileStream(logFilePath, FileMode.Append))
            using (StreamWriter sw = new StreamWriter(aFile, System.Text.Encoding.UTF8))
            {
                sw.WriteLine($"[{logNumber}] {DateTime.Now};{content}");
                if (!string.IsNullOrEmpty(additionalInfo))
                {
                    sw.WriteLine(additionalInfo);
                }
                sw.WriteLine();
            }
        }

        private int GetNextLogNumber(string logFilePath)
        {
            int logNumber = 1;

            if (File.Exists(logFilePath))
            {
                string[] lines = File.ReadAllLines(logFilePath);
                foreach (string line in lines)
                {
                    if (!string.IsNullOrWhiteSpace(line) && Regex.IsMatch(line, @"^\[(\d+)\]"))
                    {
                        int logIndex = int.Parse(Regex.Match(line, @"^\[(\d+)\]").Groups[1].Value);
                        logNumber = logIndex + 1;
                    }
                }
            }

            return logNumber;
        }
    }
}
```

当我们深入了解上述代码中每个方法的实现时，可以更清楚地理解其工作原理和实现方式：

1. `WriteLog`：
    - 首先，方法调用 `EnsureLogDirectoryExists` 以确保日志文件夹存在，若不存在则创建。
    - 然后，通过调用 `GetLogFilePath` 构建完整的日志文件路径，包括当前日期作为前缀。
    - 最后，调用 `WriteLogEntry` 方法，将传递的日志内容写入到指定的日志文件中。

2. `WriteLogWithSQL`：
    - 与 `WriteLog` 类似，先确保日志文件夹存在并构建日志文件路径。
    - 调用 `WriteLogEntry` 方法，将传递的日志内容和附加信息（执行的 SQL 语句）一同写入到日志文件中。

3. `WriteLogWithException`：
    - 同样，确保日志文件夹存在并构建日志文件路径。
    - 调用 `WriteLogEntry` 方法，将传递的日志内容和附加信息（异常消息和堆栈跟踪）一同写入到日志文件中。

4. `DeleteLog`：
    - 方法首先尝试获取指定文件夹中的所有文件和子文件夹。
    - 然后，对于每个文件和子文件夹，检查其创建时间。如果是文件夹，则递归删除；如果是文件且创建时间早于7天前，则删除文件。
    - 这样，可以确保过期的日志文件被及时清理，避免过多占用磁盘空间。

5. `EnsureLogDirectoryExists`：
    - 这个方法检查日志文件夹路径是否存在，如果不存在则调用 `Directory.CreateDirectory` 创建文件夹。

6. `GetLogFilePath`：
    - 方法将当前日期格式化为字符串，并将其与传递的文件路径结合，形成完整的日志文件路径。

7. `WriteLogEntry`：
    - 该方法将日志内容写入日志文件。
    - 首先，获取下一个可用的日志编号，调用 `GetNextLogNumber` 。
    - 然后，使用文件流 `FileStream` 和写入器 `StreamWriter` 打开指定的日志文件，使用 UTF-8 编码。
    - 将日志内容和附加信息（如果提供）写入到文件中，确保写入操作的原子性。

8. `GetNextLogNumber`：
    - 方法读取已有的日志文件内容，分析每行中的日志编号，找到最大的编号。
    - 在找到最大编号后，将其加一作为下一个可用的日志编号，确保日志编号的连续性和唯一性。

通过这些方法的具体实现，`LogWrite` 类提供了一个可靠且易于使用的日志记录工具，帮助开发人员有效地管理和记录应用程序的各种信息，从而更好地进行故障排除和性能优化。

### 使用示例

下面是一个更详细的使用示例，展示了如何使用`LogWrite`类来记录日志：

```csharp
using System;

namespace Demo
{
    class Program
    {
        static void Main(string[] args)
        {
            LogWrite logger = new LogWrite();

            try
            {
                // 模拟执行SQL语句
                string sql = "SELECT * FROM Customers";
                // 模拟异常
                throw new Exception("An error occurred!");

                logger.WriteLogWithSQL("app.log", "Application started", sql);
            }
            catch (Exception ex)
            {
                logger.WriteLogWithException("error.log", "An error occurred", ex);
            }

            logger.DeleteLog(@"D:\log\"); // 清理过期日志

            Console.WriteLine("Log entries recorded.");
        }
    }
}
```

### 总结

通过这个详细的`LogWrite`类库，我们展示了一个灵活、可靠且易于使用的日志记录工具，它可以帮助开发人员轻松地实现各种日志记录需求。无论是记录常规信息、SQL 语句还是异常信息，这个类库都提供了简单且可靠的方法。此外，它还具备自动创建日志文件夹和清理过期日志的功能，确保了日志的有效管理。在开发和维护过程中，这样的日志记录工具将成为宝贵的助手，帮助我们更好地理解和优化