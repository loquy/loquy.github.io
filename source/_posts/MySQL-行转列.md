---
title: MySQL 行转列
category_bar:
  - MySQL
tags:
  - SQL
  - MySQL
categories:
  - - 编程
    - Oracle
index_img: images/mysq行转列.png
description: MySQL 中使用 CASE 函数达成行转列。
abbrlink: aad432c8
date: 2022-09-01 14:49:46
updated: 2022-09-01 14:49:46
---
# 列表数据

```sql
mysql> select * from score;
+----+--------+---------+-------+
| id | name   | subject | score |
+----+--------+---------+-------+
|  1 | 张三   | 语文    |    10 |
|  2 | 张三   | 数学    |    30 |
|  3 | 张三   | 英语    |    40 |
|  4 | 张三   | 化学    |    50 |
|  5 | 李四   | 语文    |    60 |
|  6 | 李四   | 数学    |    70 |
|  7 | 李四   | 英语    |    80 |
|  8 | 王五   | 英语    |    90 |
|  9 | 王五   | 语文    |   100 |
| 10 | 王五   | 数学    |   110 |
| 11 | 王五   | 数学    |   120 |
+----+--------+---------+-------+
```

# 行转列写法

- CASE 函数定义和用法

```sql
CASE
    WHEN 条件1 THEN 结果1
    WHEN 条件2 THEN 结果2
    WHEN 条件N THEN 结果N
    ELSE 结果
END;
```

- 查询语句：

  按 name 字段进行 group by 分组，分组后使用 case 函数达成行转列，如果符合条件的 subject 字段对应有多行数据，取其中最大的 score 字段的值，如果不符合条件则设为 0。

  要注意在 case 函数中使用的字段不可用来 group by 分组，选取其他具有相同值的字段进行分组。

```sql
SELECT `name`,
	max( CASE `subject` WHEN '语文' THEN score ELSE 0 END ) AS '语文',
	max( CASE `subject` WHEN '数学' THEN score ELSE 0 END ) AS '数学',
	max( CASE `subject` WHEN '英语' THEN score ELSE 0 END ) AS '英语',
	max( CASE `subject` WHEN '化学' THEN score ELSE 0 END ) AS '化学' 
FROM
	score 
GROUP BY
	`name`
```

- 查询结果：

```sql
+--------+--------+--------+--------+--------+
| name   | 语文   | 数学   | 英语   | 化学   |
+--------+--------+--------+--------+--------+
| 张三   |     10 |     30 |     40 |     50 |
| 李四   |     60 |     70 |     80 |      0 |
| 王五   |    100 |    120 |     90 |      0 |
+--------+--------+--------+--------+--------+
```

# 创建表和导入数据

- 表结构：

```sql
CREATE TABLE `score` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
- 测试数据：

```sql
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (1, '张三', '语文', 10);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (2, '张三', '数学', 30);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (3, '张三', '英语', 40);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (4, '张三', '化学', 50);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (5, '李四', '语文', 60);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (6, '李四', '数学', 70);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (7, '李四', '英语', 80);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (8, '王五', '英语', 90);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (9, '王五', '语文', 100);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (10, '王五', '数学', 110);
INSERT INTO `score` (`id`, `name`, `subject`, `score`) VALUES (11, '王五', '数学', 120);
```
