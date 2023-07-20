---
title: 在 C# 中创建 Excel 文件
category_bar:
  - C#
tags: C#
categories:
  - - 编程
    - C#
index_img: images/excel.png
abbrlink: 29482ab7
date: 2023-07-20 14:01:35
updated: 2023-07-20 14:01:35
description:
---
在本篇博客中，我们将介绍如何使用 EPPlus 库在 C# 中创建 Excel 文件。EPPlus 是一个用于操作 Excel 文件的强大开源库，它支持 .NET Framework 和 .NET Core 平台。

## 安装 EPPlus

首先，我们需要安装 EPPlus 库。你可以使用 NuGet 包管理器来安装 EPPlus。以下是安装过程：

1. 打开 Visual Studio 项目。
2. 在解决方案资源管理器中，右键单击项目，然后选择“管理 NuGet 程序包”。
3. 在 NuGet 程序包管理器中，搜索“EPPlus”。
4. 选择 EPPlus，并点击“安装”按钮完成安装过程。

## 导出数据到 Excel

首先，我们需要对 `ExcelUtils` 类进行扩展，以便它能够接受不同类型的数据源。为实现这个目标，我们将使用泛型方法，使得该方法可以处理各种类型的数据源。

```csharp
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;

namespace DEMO
{
    public class ExcelUtils
    {
        public static string DataGridViewToExcel(DataGridView dataGridView, string filePath, string sheetName)
        {
            // 导出表头
            List<string> headers = new List<string>();
            foreach (DataGridViewColumn column in dataGridView.Columns)
            {
                headers.Add(column.HeaderText);
            }

            // 导出数据
            List<List<object>> data = new List<List<object>>();
            foreach (DataGridViewRow row in dataGridView.Rows)
            {
                List<object> rowData = new List<object>();
                foreach (DataGridViewCell cell in row.Cells)
                {
                    rowData.Add(cell.Value);
                }
                data.Add(rowData);
            }

            // 调用通用导出方法
            return ExportToExcel(filePath, sheetName, headers, data);
        }

        public static string ExportToExcel<T>(string filePath, string sheetName, List<string> headers, List<List<T>> data)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (ExcelPackage excelPackage = new ExcelPackage())
                {
                    ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets.Add(sheetName);

                    // 导出表头
                    for (int i = 0; i < headers.Count; i++)
                    {
                        worksheet.Cells[1, i + 1].Value = headers[i];
                    }

                    // 导出数据
                    for (int i = 0; i < data.Count; i++)
                    {
                        for (int j = 0; j < data[i].Count; j++)
                        {
                            worksheet.Cells[i + 2, j + 1].Value = data[i][j];
                        }
                    }

                    // 保存 Excel 文件
                    FileInfo excelFile = new FileInfo(filePath);
                    excelPackage.SaveAs(excelFile);
                }

                return "导出完成！";
            }
            catch (Exception ex)
            {
                return "导出发生错误：" + ex.Message;
            }
        }
    }
}
```

现在，`ExcelUtils` 类有两个方法：
1. `DataGridViewToExcel` 方法：用于导出 DataGridView 的数据到 Excel 文件。
2. `ExportToExcel` 泛型方法：可以处理各种类型的数据源，包括二维列表、DataTable 等。

- **使用示例：**
```csharp
// 示例1：使用 DataGridView 数据源
string filePath1 = "C:\\Example\\Sample1.xlsx";
string sheetName1 = "Sheet1";
string result1 = ExcelUtils.ExportToExcel(dataGridView1, filePath1, sheetName1);
Console.WriteLine(result1);

// 示例2：使用二维列表数据源
string filePath2 = "C:\\Example\\Sample2.xlsx";
string sheetName2 = "Sheet2";
List<string> headers = new List<string> { "Name", "Age", "City" };
List<List<object>> data = new List<List<object>>
{
    new List<object> { "John", 30, "New York" },
    new List<object> { "Alice", 25, "Los Angeles" },
    new List<object> { "Bob", 35, "Chicago" }
};
string result2 = ExcelUtils.ExportToExcel(filePath2, sheetName2, headers, data);
Console.WriteLine(result2);

```

现在你可以根据数据源的类型来选择适当的导出方法，`DataGridViewToExcel` 用于 DataGridView 数据，而 `ExportToExcel` 用于其他类型的数据源。这样，你可以方便地将各种数据导出到 Excel 文件中。

希望这篇博客对你有所帮助！