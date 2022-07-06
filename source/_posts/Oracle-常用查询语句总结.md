---
title: Oracle 常用查询语句总结
category_bar: [Oracle]
tags:
  - SQL
  - Oracle
categories: 
  - [编程, Oracle]
index_img: /images/Oracle常用查询语句.png
abbrlink: e95076da
date: 2022-07-06 16:27:48
updated: 2022-07-06 16:27:48
description: 整理记录常用 Oracle 常用查询语句，以此备忘，持续更新中...
---
# ROWNUM 字段

rownum 是 Oracle 系统顺序分配为从查询返回的行的编号，返回的第一行分配的是 1，返回的第二行分配的是 2，这个伪字段可以用于限制返回查询的总行数，且 rownum 不可以以任何表的名称作为前缀。

1. rownum 对于等于某值的查询条件：如果想找到第一条查询数据，可以使用 rownum = 1 作为查询条件，但是想找到第二条查询数据，使用 rownum = 2 则查不到数据，原因是：rownum 都是从 1开始，但是 1 以上的自然数与 rownum 做等于时，都认为是 false 条件，所以无法查询到 rownum = n（ n > 1 的自然数）；
2. rownum 对于大于某值的查询条件：要是想查询出第二行以后的记录，直接使用 rownum > 2 是查不出数据的，原因是 rownum 是一个总是以 1 开始的伪列，rownum > n（ n > 1 的自然数）依然不成立。可以使用子查询来解决，注意子查询中的 rownum 必须要有别名，否则还是不会查出记录来，这是因为 rownum 不是某个表的列，如果不起别名的话，无法知道 rownum 是子查询的列还是主查询的列。

# DUAL 表

Oracle 提供的最小的工作表，只有一行一列，具有某些特殊功用。

## 表结构

| Name  | Type       |
| ----- | ---------- |
| DUMMY | Varchar(1) |

## 特性

1. Oracle 提供的最小的表，不论进行何种操作（不要删除记录），它都只有一条记录——'X'。例如：执行 select * from dual，里面只有一条记录；执行 insert into dual values('Y')后，再次查询 dual表，仍然显示一条记录。
2. 是 sys 用户下的一张内部表，所有用户都可以使用 DUAL 名称访问，无论什么时候这个表总是存在。例如：执行一个查看当前日期的语句 select sysdate from dual，这条语句在放在放在任何一个 oracle 数据库当中都不会报错，所以一般做一些特定查询的时候用这个表是最稳妥的。

## 用途

1. select 计算常量表达式、伪列等值 oracle 内部处理使它只返回一行数据，而使用其它表时可能返回多个数据行。
2. 查看当前用户 select user from dual;select count(*) from dual;
3. 用做计算器 select 7*9*10-10 from dual；
4. 调用系统函数
   - 获得当前系统时间 select to_char(sysdate,'yyyy-mm-dd hh24:mi:ss') from dual;
   - 获得主机名 select sys_context('userenv','terminal') from dual;
   - 获得当前 locale select sys_context('userenv','language') from dual;
   - 获得一个随机数 select DBMS_RANDOM.random from dual;
5. 查看序列值
   - 创建序列 aaa 以1开始，每次加1 create sequence aaa increment by 1 start with 1;
   - 获得序列 aaa 的下一个序列值 select aaa.nextval from dual;
   - 获得序列 aaa 的当前序列值 select aaa.currval from dual;

# UNION 与 UNION ALL 的区别

1. UNION：对两个结果集进行并集操作，不包括重复行，同时进行默认规则的排序。
2. UNION ALL：对两个结果集进行并集操作，包括重复行，不进行排序。

# 查询最新的一条数据

```sql
SELECT
	* 
FROM
	( SELECT * FROM BOOK ORDER BY CREATE_DATE DESC ) 
WHERE
	ROWNUM = 1
```

# 保留 N 位小数

```sql
-- round(m,n)，四舍五入，0.87。
SELECT
	ROUND( 0.866, 2 ) 
FROM
	DUAL;
-- trunc(m,n)，不四舍五入，0.86。
SELECT
	TRUNC( 0.866, 2 ) 
FROM
	DUAL;
```

# 查询当天时间

```sql
-- 使用 trunc 函数截断时间
-- 2022-07-06 00:00:00，今天的日期
SELECT
	TRUNC( SYSDATE ) 
FROM
	DUAL;
-- 2022-07-01 00:00:00，返回当月第一天.
SELECT
	TRUNC( SYSDATE, 'mm' ) 
FROM
	DUAL;
-- 2022-01-01 00:00:00，返回当年第一天
SELECT
	TRUNC( SYSDATE, 'yy' ) 
FROM
	DUAL;
-- 2022-07-06 00:00:00，返回当前年月日
SELECT
	TRUNC( SYSDATE, 'dd' ) 
FROM
	DUAL;
-- 2022-01-01 00:00:00，返回当年第一天
SELECT
	TRUNC( SYSDATE, 'yyyy' ) 
FROM
	DUAL;
-- 2022-07-03 00:00:00，返回当前星期的第一天
SELECT
	TRUNC( SYSDATE, 'd' ) 
FROM
	DUAL;
-- 2022-07-06 10:00:00，当前时间
SELECT
	TRUNC( SYSDATE, 'hh' ) 
FROM
	DUAL;
-- 2022-07-06 10:51:00，RUNC()函数没有秒的精
SELECT
	TRUNC( SYSDATE, 'mi' ) 
FROM
	DUAL;
```

# 补空行

```sql
SELECT
	* 
FROM
	( SELECT id, name FROM BOOK UNION ALL SELECT NULL id, 'book' name FROM DUAL CONNECT BY ROWNUM < 11 ) 
WHERE
	ROWNUM < 11
```

# 分页查询

```sql
-- where 条件：rn > (page - 1) * pageSize and rn <= (page) * pageSize
SELECT
	* 
FROM
	( SELECT t.*, ROWNUM rn FROM BOOK t ) 
WHERE
	rn > ( 1 - 1 ) * 10 
	AND rn <= ( 1 ) * 10
```

# TO_CHAR 和 TO_DATE 日期转换

## 语法

TO_DATE('字符串', '格式')
TO_CHAR('日期', '格式')

## 含义

TO_DATE：将字符串转化为日期型。
TO_CHAR：将日期或数字转换为 char 数据类型。

## 示例

```sql
SELECT SYSDATE, TO_DATE('2022-7-06','yyyy-mm-dd') FROM DUAL; -- 2022-07-06 00:00:00
SELECT SYSDATE, TO_DATE('2022-7-06','yyyy.mm.dd') FROM DUAL; -- 2022-07-06 00:00:00
SELECT SYSDATE, TO_DATE('2022-7-06','yyyy/mm/dd') FROM DUAL; -- 2022-07-06 00:00:00
SELECT SYSDATE, TO_DATE('2022-7-06','yyyy-mm-dd hh24:mi:ss') FROM DUAL; -- 2022-07-06 00:00:00
SELECT SYSDATE, TO_DATE('2022.7.06','yyyy-mm-dd') FROM DUAL; -- 2022-07-06 00:00:00
SELECT SYSDATE, TO_DATE('2022/7/06','yyyy-mm-dd') FROM DUAL; -- 2022-07-06 00:00:00
SELECT SYSDATE, TO_DATE('20220706','yyyy-mm-dd') FROM DUAL; -- 2022-07-06 00:00:00

SELECT SYSDATE, TO_DATE(SYSDATE,'yyyy-mm-dd') FROM DUAL; -- 2022-07-06
SELECT SYSDATE, TO_DATE(SYSDATE,'yyyy/mm/dd') FROM DUAL; -- 2022/07/06
SELECT SYSDATE, TO_DATE(SYSDATE,'yyyymmdd') FROM DUAL; -- 20220706
SELECT SYSDATE, TO_DATE(SYSDATE,'yyyy-mm-dd hh24:mi:ss') FROM DUAL; -- 2022-07-06 16:14:34

SELECT SYSDATE, TO_DATE(SYSDATE,'yyyy') FROM DUAL; -- 2022
SELECT SYSDATE, TO_DATE(SYSDATE,'mm') FROM DUAL; -- 07
SELECT SYSDATE, TO_DATE(SYSDATE,'hh24') FROM DUAL; -- 16
SELECT SYSDATE, TO_DATE(SYSDATE,'mi') FROM DUAL; -- 14
```

# DECODE 条件取值

## 语法

decode(条件, 值1, 翻译值1, 值2, 翻译值2, ..., 值n, 翻译值n, 缺省值)

## 含义

```sql
IF 条件=值1 THEN
RETURN(翻译值1)
ELSIF 条件=值2 THEN
RETURN(翻译值2)
......
ELSIF 条件=值n THEN
RETURN(翻译值n)　　
ELSE
RETURN(缺省值)
END IF　　
```

# NVL 和 NVL2 为空值赋值

## NVL

### 语法

NVL (expr1, expr2)

### 含义

若 expr1 为NULL，返回 expr2；expr1不为 NULL，返回 expr1。
注意两者的类型要一致。

## NVL2

### 语法

NVL2 (expr1, expr2, expr3)

### 含义

expr1 不为 NULL，返回 expr2；expr2 为 NULL，返回 expr3。
expr2 和 expr3 类型不同的话，expr3 会转换为 expr2 的类型。

# CONNECT BY LEVEL 递归查询

## 构造连续的数字

```sql
SELECT LEVEL 
FROM
	DUAL CONNECT BY LEVEL <= 5;
```

## 构造连续的日期

```sql
SELECT SYSDATE
	+ LEVEL 
FROM
	DUAL CONNECT BY LEVEL <= 5;
```

## 按逗号分隔字符串

```sql
SELECT
	REGEXP_SUBSTR( 'a,b,c', '[^,]+', 1, LEVEL ) 
FROM
	DUAL CONNECT BY REGEXP_SUBSTR( 'a,b,c', '[^,]+', 1, LEVEL ) IS NOT NULL
```

原理说明：

1. dual 只有 1 条记录，所以构造树时，每层都只有 1 个记录，可能形成了包含本记录的 n 次不同  level 的重复。
2. connect by 条件：按层级截取表达不能为空，因为只有 3 个元素，所以只到 3 级。
3. 正则表达式的含义：
   pattern =` '[^,]+'，[] `表示待选集合，但以 ^ 开头，表示非逗号的所有元素。
   是从左开始截取、直到遇到不符合 pattern 的元素。

