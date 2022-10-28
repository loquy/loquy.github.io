---
title: Java 调用 Web Service
category_bar:
  - Java
tags:
  - Java
categories:
  - - 编程
    - Java
index_img: images/webService.png
abbrlink: b10633f0
description:
---
# 概述

## Web 服务

Web 服务是一种服务导向架构的技术，通过标准的 Web 协议提供服务，目的是保证不同平台的应用服务可以互操作。

根据 W3C 的定义，Web 服务（Web service）应当是一个软件系统，用以支持网络间不同机器的互动操作。网络服务通常是许多应用程序接口（API）所组成的，它们透过网络，例如国际互联网（Internet）的远程服务器端，执行客户所提交服务的请求。

尽管 W3C 的定义涵盖诸多相异且无法介分的系统，不过通常我们指有关于主从式架构（Client-Server）之间根据 SOAP 协议进行传递 XML 格式消息。无论定义还是实现，Web 服务过程中会由服务器提供一个机器可读的描述（通常基于 WSDL）以辨识服务器所提供的 WEB 服务。另外，虽然 WSDL 不是 SOAP 服务端点的必要条件，但目前基于 Java 的主流 Web 服务开发框架往往需要 WSDL 实现客户端的源代码生成。一些工业标准化组织，比如 WS-I，就在 Web 服务定义中强制包含 SOAP 和 WSDL。

## 定义

核心定义
考虑到并没某个独立文档包含一切相关内容，可采用模块化的方式给出对 Web 服务的描述，但不能给出一个“绝对全面和准确”的定义。受外部环境和实现技术影响，各方给出的核心定义可能稍有出入，但通常包括：

**SOAP**
一个基于 XML 的可扩展消息信封格式，需同时绑定一个网络传输协议。这个协议通常是 HTTP 或 HTTPS，但也可能是 SMTP 或 XMPP。

**WSDL**
一个 XML 格式文档，用以描述服务端口访问方式和使用协议的细节。通常用来辅助生成服务器和客户端代码及配置信息。

**UDDI**
一个用来发布和搜索 WEB 服务的协议，应用程序可借由此协议在设计或运行时找到目标WEB服务。
这些标准由这些组织制订：W3C 负责 XML、SOAP 及 WSDL；OASIS 负责 UDDI。

# 代码示例

- 先引入 axis 包

```xml
<!-- https://mvnrepository.com/artifact/org.apache.axis/axis -->
<dependency>
    <groupId>org.apache.axis</groupId>
    <artifactId>axis</artifactId>
    <version>1.4</version>
</dependency>

```

- 具体代码实现

```java
package com.example.webService;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.axis.encoding.XMLType;
import javax.xml.namespace.QName;

/**
 * @author loquy
 */
public class CallWebService {

    private static final String ENDPOINT = "http://localhost:3000/test?wsdl";
    private static final String NAMESPACE = "http://tempuri.org/";
   

    private static String getGuid() throws Exception {
        Service service = new Service();
        Call call = (Call) service.createCall();
        call.setTargetEndpointAddress(ENDPOINT);
        // WSDL 里面描述的接口名称(要调用的方法)
        call.setOperationName(new QName(NAMESPACE, "login"));
        // 接口方法的参数名, 参数类型, 参数模式  IN(输入), OUT(输出) or INOUT(输入输出)
        call.addParameter("userId", XMLType.XSD_STRING, ParameterMode.IN);
        call.addParameter("password", XMLType.XSD_STRING, ParameterMode.IN);
        // 设置被调用方法的返回值类型
        call.setReturnType(XMLType.XSD_STRING);
        // 设置超时
        call.setTimeout(30 * 60 * 1000);
        // 设置方法中参数的值
        Object[] paramValues = new Object[] {"test", "test"};
        // 给方法传递参数，并且调用方法
        String result = (String) call.invoke(paramValues);

        System.out.println(result);

        return result;
    }
}


```

# 参考

- [维基百科](https://zh.wikipedia.org/wiki/Web%E6%9C%8D%E5%8A%A1)
- [CSDN](https://blog.csdn.net/coolcoffee168/article/details/48490263)
