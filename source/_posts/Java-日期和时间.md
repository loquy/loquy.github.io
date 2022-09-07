---
title: Java 日期和时间
category_bar:
  - Java
tags:
  - Java
categories:
  - - 编程
  - Java
index_img: images/watch.png
abbrlink: 8ce0f8c6
description:
---
# 概述

Java 提供了两套日期和时间的接口。

1. 旧版：`Date`、`Calendar` 等，`Date` 类主要封装了系统的日期和时间的信息，`Calendar` 类则会根据系统的日历来解释 `Date` 对象。

2. 从 Java 8 开始，`java.time` 包提供了新的日期和时间 API，主要涉及的类有：

    - 本地日期和时间：`LocalDateTime`，`LocalDate`，`LocalTime`；
    - 带时区的日期和时间：`ZonedDateTime`；
    - 时刻：`Instant`；
    - 时区：`ZoneId`，`ZoneOffset`；
    - 时间间隔：`Duration`。


以及一套新的用于取代 `SimpleDateFormat` 的格式化类 `DateTimeFormatter`。和旧的 API 相比，新 API 严格区分了时刻、本地日期、本地时间和带时区的日期时间，并且对日期和时间进行运算更加方便。新 API 的类型几乎全部是不变类型（和 String 类似），可以放心使用不必担心被修改。

3. `SimpleDateFormat` 是线程不安全的类，一般不要定义为 static 变量，如果定义为 static，必须加锁，或者使用 `DateUtils` 工具类。 正例：注意线程安全，使用 `DateUtils`。亦推荐如下处理：
```java
private static final ThreadLocal<DateFormat> df = new ThreadLocal<DateFormat>() {
    @Override
    protected DateFormat initialValue() {
    	return new SimpleDateFormat("yyyy-MM-dd");
    }
};
```
说明：如果是 JDK8 的应用，可以使用 `Instant` 代替 `Date`，`LocalDateTime` 代替 `Calendar`，`DateTimeFormatter` 代替  `SimpleDateFormat`，官方给出的解释：simple beautiful strong immutable thread-safe。——引用《阿里巴巴Java开发手册》

4. 日期和时间类相关的操作方法用到时查询即可，无需记忆，用着用着就熟悉了。

# 格式化模式


| 字母 | 含义                  | 示例                                                         |
| ---- | --------------------- | ------------------------------------------------------------ |
| y    | 年份                  | 使用 yy 表示的年份，如 11； 使用 yyyy 表示的年份，如 2011    |
| M    | 月份                  | 使用 MM 表示的月份，如 05； 使用 MMM 表示月份，在 Locale.CHINA 语言环境下，如“十月”；在 Locale.US 语言环境下，如 Oct |
| d    | 月份中的天数          | 使用 dd 表示的天数，如 10                                    |
| D    | 年份中的天数          | 使用 D 表示的年份中的天数，如 360                            |
| E    | 星期几                | 使用 E 表示星期几，在 Locale.CHINA 语言环境下，如“星期四”；在 Locale.US 语 言环境下，如 Thu |
| H    | 一天中的小时数（0~23) | 使用 HH 表示的小时数，如 18                                  |
| h    | 一天中的小时数（1~12) | 使用 hh 表示的小时数，如 10 (注意 10 有 可能是 10 点，也可能是 22 点） |
| m    | 分钟数                | 使用 mm 表示的分钟数，如 29                                  |
| s    | 秒数                  | 使用 ss 表示的秒数，如 38                                    |
| S    | 毫秒数                | 使用 SSS 表示的毫秒数，如 156                                |

# 代码示例

## 日期和字符串相互转换

- 旧版

```java
public static String dateToStr(Date date) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return sdf.format(date);
}
```
```java
public static Date strToDate(String strDate) throws ParseException {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return sdf.parse(strDate);
}
```

- Java 8

```java
public static String localDateTimeToStr(LocalDateTime localDate) {
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    return localDate.format(dateTimeFormatter);
}
```
```java
public static LocalDateTime strToLocalDateTime(String strDate){
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    return LocalDateTime.parse(strDate, dateTimeFormatter);
}
```


## LocalDate 和 Date 相互转换

```java
public static LocalDateTime dateToLocalDateTime(Date date){
    return date.toInstant()
        //设置当前系统时区
        .atZone(ZoneId.systemDefault())
        .toLocalDateTime();
}

public static Date localDateTimeToDate(LocalDateTime localDateTime){
    return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
}
```

## 获取当天零点

- 旧版

```java
public static Date getTodayZeroByDate() {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(new Date());
    calendar.set(Calendar.HOUR_OF_DAY, 0);
    calendar.set(Calendar.MINUTE, 0);
    calendar.set(Calendar.SECOND, 0);
    return calendar.getTime();
}
```

- Java 8

```java
public static LocalDateTime getTodayZeroByLocalDateTime() {
    LocalDateTime now = LocalDateTime.now();
    // 当天的 00:00
    return LocalDateTime.of(now.toLocalDate(), LocalTime.MIN);
}
```

## 获取两个日期之间的所有月份

- 旧版

```java
public static List<String> getMonthBetweenByCalendar(String minDate, String maxDate) throws ParseException {
    ArrayList<String> result = new ArrayList<>();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
    Calendar min = Calendar.getInstance();
    Calendar max = Calendar.getInstance();
    min.setTime(sdf.parse(minDate));
    max.setTime(sdf.parse(maxDate));
    while (min.before(max) || min.get(Calendar.MONTH) == max.get(Calendar.MONTH)) {
        result.add(sdf.format(min.getTime()));
        min.add(Calendar.MONTH, 1);
    }
    return result;
}
```

- Java 8

```java
public static List<String> getMonthBetweenByLocalDate(String minDate, String maxDate) {
    List<String> localDateList = new ArrayList<>();
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
    LocalDate min = LocalDate.parse(minDate);
    LocalDate max = LocalDate.parse(maxDate);
    while (min.isBefore(max) || min.getMonth() == max.getMonth()) {
        localDateList.add(min.format(dateTimeFormatter));
        min = min.plusMonths(1);
    }
    return localDateList;
}
```

