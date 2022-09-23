---
title: Java 自定义注解
category_bar:
  - Java
tags:
  - Java
categories:
  - - 编程
    - Java
index_img: images/JavaCustomAnnotations.png
abbrlink: f96fd70c
description:
---

# 注解知识点
- 思维导图

![Java注解](images/javaAnnotation.jpg)

# 自定义注解

## 编写规则

 1. Annotation 型定义为 @interface，所有的 Annotation 会自动继承 java.lang.Annotation 这一接口，并且不能再去继承别的类或是接口。
 2. 参数成员只能用 public 或默认(default) 这两个访问权修饰。
 3. 参数成员只能用基本类型 byte、short、char、int、long、float、double、boolean 八种基本数据类型和 String、Enum、Class、annotations 等数据类型，以及这一些类型的数组。
 4. 要获取类方法和字段的注解信息，必须通过 Java 的反射技术来获取 Annotation 对象，因为你除此之外没有别的获取注解对象的方法。

## 代码示例

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author loquy
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface FieldInfo {
    String description();
    int length();
}

```

```java
import java.lang.reflect.Field;

/**
 * @author loquy
 */
public class FieldInfoTest {

    @FieldInfo(description = "用户名", length = 10)
    private String username;

    public static void main(String[] args) {
        // 获取类模板
        Class<FieldInfoTest> c = FieldInfoTest.class;

        // 获取所有字段
        for(Field f : c.getDeclaredFields()){
            // 判断这个字段是否有 FieldInfo 注解
            if(f.isAnnotationPresent(FieldInfo.class)){
                FieldInfo annotation = f.getAnnotation(FieldInfo.class);
                System.out.println(
                        "字段:[" + f.getName() + "]," +
                        "描述:[" + annotation.description() + "]," +
                        "长度:[" + annotation.length() +"]"
                );
            }
        }
    }

}
```

输出：


	字段：[username]，描述：[用户名]，长度：[10]

