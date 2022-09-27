---
title: Java IO 流
category_bar:
  - Java
tags:
  - Java
categories:
  - - 编程
    - Java
index_img: images/input-output.jpg
abbrlink: cda4c274
description:
---
# 概述

## IO

通过[数据流](https://baike.baidu.com/item/数据流?fromModule=lemma_inlink)、[序列化](https://baike.baidu.com/item/序列化/2890184?fromModule=lemma_inlink)和文件系统提供系统输入和输出。

## 流

流是一个很形象的概念，当程序需要读取数据的时候，就会开启一个通向[数据源](https://baike.baidu.com/item/数据源?fromModule=lemma_inlink)的流，这个数据源可以是文件，内存，或是网络连接。类似的，当程序需要写入数据的时候，就会开启一个通向目的地的流。这时候你就可以想象数据好像在这其中“流”动一样。

## 原理

[Java](https://baike.baidu.com/item/Java/85979?fromModule=lemma_inlink) 把这些不同来源和目标的数据都统一抽象为数据流。Java 语言的输入输出功能是十分强大而灵活的，美中不足的是看上去输入输出的代码并不是很简洁，因为你往往需要包装许多不同的对象。

在 Java 类库中，IO 部分的内容是很庞大的，因为它涉及的领域很广泛:[标准输入输出](https://baike.baidu.com/item/标准输入输出?fromModule=lemma_inlink)，文件的操作，网络上的数据流，字符串流，对象流，zip 文件流。

# File 文件类

在 Java 中，File 类是 java.io 包中唯一代表磁盘文件本身的对象，也就是说，如果希望在程序中操作文件和目录，则都可以通过 File 类来完成。File 类定义了一些方法来操作文件，如新建、删除、重命名文件和目录等。

File 类不能访问文件内容本身，如果需要访问文件内容本身，则需要使用输入/输出流。

File 类提供了如下三种形式构造方法。

1. File(String path)：如果 path 是实际存在的路径，则该 File 对象表示的是目录；如果 path 是文件名，则该 File 对象表示的是文件。
2. File(String path, String name)：path 是路径名，name 是文件名。
3. File(File dir, String name)：dir 是路径对象，name 是文件名。


使用任意一个构造方法都可以创建一个 File 对象，然后调用其提供的方法对文件进行操作。在表中列出了 File 类的常用方法及说明。

| 方法名称                      | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| boolean canRead()             | 测试应用程序是否能从指定的文件中进行读取                     |
| boolean canWrite()            | 测试应用程序是否能写当前文件                                 |
| boolean delete()              | 删除当前对象指定的文件                                       |
| boolean exists()              | 测试当前 File 是否存在                                       |
| String getAbsolutePath()      | 返回由该对象表示的文件的绝对路径名                           |
| String getName()              | 返回表示当前对象的文件名或路径名（如果是路径，则返回最后一级子路径名） |
| String getParent()            | 返回当前 File 对象所对应目录（最后一级子目录）的父目录名     |
| boolean isAbsolute()          | 测试当前 File 对象表示的文件是否为一个绝对路径名。该方法消除了不同平台的差异，可以直接判断 file 对象是否为绝对路径。在 UNIX/Linux/BSD 等系统上，如果路径名开头是一条斜线`/`，则表明该 File 对象对应一个绝对路径；在 Windows 等系统上，如果路径开头是盘符，则说明它是一个绝对路径。 |
| boolean isDirectory()         | 测试当前 File 对象表示的文件是否为一个路径                   |
| boolean isFile()              | 测试当前 File 对象表示的文件是否为一个“普通”文件             |
| long lastModified()           | 返回当前 File 对象表示的文件最后修改的时间                   |
| long length()                 | 返回当前 File 对象表示的文件长度                             |
| String[] list()               | 返回当前 File 对象指定的路径文件列表                         |
| String[] list(FilenameFilter) | 返回当前 File 对象指定的目录中满足指定过滤器的文件列表       |
| boolean mkdir()               | 创建一个目录，它的路径名由当前 File 对象指定                 |
| boolean mkdirs()              | 创建一个目录，它的路径名由当前 File 对象指定                 |
| boolean renameTo(File)        | 将当前 File 对象指定的文件更名为给定参数 File 指定的路径名   |

# IO 流的分类

## 流向和数据类型

根据数据的流向分为：**输入流** 和 **输出流**。

- **输入流** ：把数据从`其他设备`上读取到`内存`中的流。
- **输出流** ：把数据从`内存` 中写出到`其他设备`上的流。

根据数据的类型分为：**字节流** 和 **字符流**。

- **字节流** ：以字节为单位，读写数据的流。
- **字符流** ：以字符为单位，读写数据的流。

分类之后对应的父类

|        | 输入流                     | 输出流                      |
| ------ | -------------------------- | --------------------------- |
| 字节流 | 字节输入流 **InputStream** | 字节输出流 **OutputStream** |
| 字符流 | 字符输入流 **Reader**      | 字符输出流 **Writer**       |

注：
由这四个类的子类名称基本都是以其父类名作为子类名的后缀。
如：InputStream 的子类 FileInputStream。
如：Reader的子 类 FileReader。

## 具体分类

|    分类    |        字节输入流        |        字节输出流        |     字符输入流      |     字符输出流      |
| :--------: | :----------------------: | :----------------------: | :-----------------: | :-----------------: |
|  抽象基类  |      *InputStream*       |      *OutputStream*      |      *Reader*       |      *Writer*       |
|  访问文件  |   **FileInputStream**    |   **FileOutputStream**   |   **FileReader**    |   **FileWriter**    |
|  访问数组  | **ByteArrayInputStream** | **ByteArrayOutpuStream** | **CharArrayReader** | **CharArrayWriter** |
|  访问管道  |   **PipedInputStream**   |  **PipedOutputStream**   |   **PipedReader**   |   **PipedWr**iter   |
| 访问字符串 |                          |                          |  **StringReader**   |  **StringWriter**   |
|   缓冲流   |   BufferedInputStream    |   BufferedOutputStream   |   BufferedReader    |   BufferedWriter    |
|   转换流   |                          |                          |  InputStreamReader  | OutputStreamWriter  |
|   对象流   |    ObjectInputStream     |    ObjectOutputStream    |                     |                     |
|   过滤流   |   *FilterInputStream*    |   *FilterOutputStream*   |   *FilterReader*    |   *FilterWriter*    |
|   打印流   |                          |       PrintStream        |                     |     PrintWriter     |
| 推回输入流 |   PushbackInputStream    |                          |   PushbackReader    |                     |
|   数据流   |     DataInputStream      |     DataOutputStream     |                     |                     |

注：倾斜代表抽象类，无法创建实例，红色表示节点流，必须直接与指定物理节点关联。

![思维导图](images/java-io.png)

# 代码示例

## File 类

- 获取文件属性

```java
import java.io.File;
import java.util.Date;

public class FileTest {

    public static void main(String[] args) {
        // 指定文件所在的目录
        String path = "D:/";
        // 建立 File 变量，并设定由 f 变量引用
        File f = new File(path, "notepad.exe");
        System.out.println("D:\\notepad.exe文件信息如下：");
        System.out.println("============================================");
        System.out.println("文件长度：" + f.length() + "字节");
        System.out.println("文件或者目录：" + (f.isFile() ? "是文件" : "不是文件"));
        System.out.println("文件或者目录：" + (f.isDirectory() ? "是目录" : "不是目录"));
        System.out.println("是否可读：" + (f.canRead() ? "可读取" : "不可读取"));
        System.out.println("是否可写：" + (f.canWrite() ? "可写入" : "不可写入"));
        System.out.println("是否隐藏：" + (f.isHidden() ? "是隐藏文件" : "不是隐藏文件"));
        System.out.println("最后修改日期：" + new Date(f.lastModified()));
        System.out.println("文件名称：" + f.getName());
        System.out.println("文件路径：" + f.getPath());
        System.out.println("绝对路径：" + f.getAbsolutePath());
    }
}

```
输出：

    D:\test.txt文件信息如下：
    ============================================
    文件长度：0字节
    文件或者目录：是文件
    文件或者目录：不是目录
    是否可读：可读取
    是否可写：可写入
    是否隐藏：不是隐藏文件
    最后修改日期：Tue Sep 27 16:06:10 GMT+08:00 2022
    文件名称：test.txt
    文件路径：D:\test.txt
    绝对路径：D:\test.txt

- 创建和删除文件

```java
import java.io.File;
import java.io.IOException;

public class FileTest01 {

    public static void main(String[] args) throws IOException {
        // 创建指向文件的 File 对象
        File f = new File("D:\\test.txt");
        // 判断文件是否存在
        if (f.exists()) {
            // 存在则先删除
            boolean delete = f.delete();
            System.out.println(delete);
        }
        // 再创建
        boolean newFile = f.createNewFile();
        System.out.println(newFile);
    }
}

```
输出：

    true
    true


- 创建和删除目录

```java
import java.io.File;

public class FileTest02 {

    public static void main(String[] args) {
        // 指定目录位置
        String path = "D:/config/";
        // 创建 File 对象
        File f = new File(path);
        if (f.exists()) {
            boolean delete = f.delete();
            System.out.println(delete);
        }
        // 创建目录
        boolean mkdir = f.mkdir();
        System.out.println(mkdir);
    }
}

```
输出：

    true
    true


- 遍历目录

```java
import java.io.File;

public class FileTest03 {

    public static void main(String[] args) {
        // 建立 File 变量,并设定由 f 变量变数引用
        File f = new File("D:/");
        System.out.println("文件名称\t\t文件类型\t\t文件大小");
        System.out.println("===================================================");
        // 调用不带参数的 list() 方法
        String[] fileList = f.list();
        assert fileList != null;
        // 遍历返回的字符数组
        for (String s : fileList) {
            System.out.print(s + "\t\t");
            System.out.print((new File("C:/", s)).isFile() ? "文件" + "\t\t" : "文件夹" + "\t\t");
            System.out.println((new File("C:/", s)).length() + "字节");
        }
    }
}

```

输出：

    文件名称		文件类型		文件大小
    ===================================================
    $RECYCLE.BIN		文件夹		0字节
    config		文件夹		0字节
    data		文件夹		0字节
    home		文件夹		0字节
    JamWorkspaceAndroid		文件夹		0字节
    note		文件夹		0字节
    oracle		文件夹		0字节
    pagefile.sys		文件夹		0字节
    picture		文件夹		0字节
    Program Files		文件夹		8192字节
    Program Files (x86)		文件夹		12288字节
    project		文件夹		0字节
    study		文件夹		0字节
    System Volume Information		文件夹		4096字节
    test.txt		文件夹		0字节
    test1.txt		文件夹		0字节
    Users		文件夹		4096字节
    virtual		文件夹		0字节
    软件		文件夹		0字节


## 字节流

文件的复制（字节流）

```java
import java.io.*;

public class InputOutputTest {

    public static void main(String[] args)throws IOException {
        // 源文件和目标文件
        File source = new File("D:\\test.txt") ;
        File target = new File("D:\\test1.txt") ;
        // 字节输入流和输出流
        InputStream inStream = new FileInputStream(source) ;
        OutputStream outStream = new FileOutputStream(target) ;
        // 字节读入和写出
        byte[] byteArr = new byte[1024];
        int readSign ;
        while ((readSign = inStream.read(byteArr)) != -1){
            outStream.write(readSign);
        }
        // 关闭流
        outStream.close();
        inStream.close();
    }
}

```

## 字符流

文件的复制（字符流），其速度效率要快于字节流读取，对于非文本文件（视频文件、音频文件、图片），只能使用字节流！

```java
import java.io.*;

public class ReaderWriterTest {

    public static void main(String[] args) throws Exception {
        // 读文本和写文本
        File readerFile = new File("D:\\test.txt") ;
        File writerFile = new File("D:\\test1.txt") ;
        // 字符输入和输出流
        Reader reader = new FileReader(readerFile) ;
        Writer writer = new FileWriter(writerFile);
        // 字符读入和写出
        int readSign;
        while ((readSign = reader.read()) != -1) {
            writer.write(readSign);
        }
        writer.flush();
        // 关闭流
        writer.close();
        reader.close();
    }
}

```

## 字节缓冲流

文件的复制（字节缓冲流，加速字节读取）

```java
import java.io.*;

public class BufferedInputOutputTest {

    public static void main(String[] args) throws Exception {
        // 源文件 目标文件
        File source = new File("D:\\test.txt");
        File target = new File("D:\\test1.txt");
        // 缓冲：字节输入流字符输出流
        InputStream bufInStream = new BufferedInputStream(new FileInputStream(source));
        OutputStream bufOutStream = new BufferedOutputStream(new FileOutputStream(target));
        // 字节读入和写出
        int readSign;
        while ((readSign = bufInStream.read()) != -1) {
            bufOutStream.write(readSign);
        }
        // 关闭流
        bufOutStream.close();
        bufInStream.close();
    }
}

```

## 字符缓冲流

文件的复制（字符缓冲流，加速字符读取）

```java
import java.io.*;

public class BufferedReaderWriterTest {

    public static void main(String[] args) throws Exception {
        // 读文本和写文本
        File readerFile = new File("D:\\test.txt") ;
        File writerFile = new File("D:\\test1.txt") ;
        // 缓冲：字符输入和输出流
        BufferedReader bufReader = new BufferedReader(new FileReader(readerFile)) ;
        BufferedWriter bufWriter = new BufferedWriter(new FileWriter(writerFile)) ;
        // 字符读入和写出
        String line;
        while ((line = bufReader.readLine()) != null){
            bufWriter.write(line);
            bufWriter.newLine();
        }
        bufWriter.flush();
        // 关闭流
        bufWriter.close();
        bufReader.close();
    }
}

```

## 转换流

转换流可以将字节流读取到的字节，按指定字符集解码成字符。

```java
import java.io.*;
import java.nio.charset.StandardCharsets;

public class InputOutputStreamReaderTest {

    public static void main(String[] args) {
        try {
            // 解码，把字节数组变成字符流
            InputStreamReader isr = new InputStreamReader(new FileInputStream("D:\\test.txt"));
            BufferedReader br = new BufferedReader(isr);

            // 编码，把字符流变成字节数组
            FileOutputStream fos = new FileOutputStream("D:\\test.txt");
            // 指定字符集
            OutputStreamWriter osr = new OutputStreamWriter(fos, StandardCharsets.UTF_8);
            BufferedWriter bw = new BufferedWriter(osr);

            int len;
            char[] c = new char[8 * 1024];
            while ((len = br.read(c)) != -1) {
                bw.write(c, 0, len);
                bw.flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

## 数据流

数据流：用来处理基本数据类型、String、字节数组的数据。

```java
import java.io.*;

public class DataInputOutputStream {

    public static void main(String[] args) throws Exception  {
        DataOutputStream dataOutputStream = new DataOutputStream(new FileOutputStream("D:\\test.txt"));
        dataOutputStream.writeUTF("我爱你，而你不知道");
        dataOutputStream.writeBoolean(true);
        dataOutputStream.writeInt(12);
        dataOutputStream.close();

        DataInputStream dataInputStream = new DataInputStream(new FileInputStream("D:\\test.txt"));
        System.out.println(dataInputStream.readUTF());
        System.out.println(dataInputStream.readBoolean());
        System.out.println(dataInputStream.readInt());
        dataInputStream.close();
    }
}

```

输出：


    我爱你，而你不知道
    true
    12


## 对象流

序列化：对象转换为流的过程，反序列化：流转换为对象的过程。

```java
import java.io.*;

public class ObjectInputOutputStreamTest {

    public static void main(String[] args) throws Exception {
        // 序列化对象
        OutputStream outStream = new FileOutputStream("D:\\test.txt");
        ObjectOutputStream objOutStream = new ObjectOutputStream(outStream);
        objOutStream.writeObject(new User(1,"test"));
        objOutStream.close();

        // 反序列化对象
        InputStream inStream = new FileInputStream("D:\\test.txt");
        ObjectInputStream objInStream = new ObjectInputStream(inStream) ;
        User user = (User) objInStream.readObject();
        System.out.println(user);
        System.out.println(user.id);
        System.out.println(user.name);
        inStream.close();
    }

    static class User implements Serializable {
        private final Integer id ;
        private final String name ;

        public User(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }
}

```

输出：

    ObjectInputOutputStreamTest$User@47f6473
    1
    test

# 参考

- [Java IO 百度百科](https://baike.baidu.com/item/java.io/5179754)
- [史上最骚最全最详细的 IO 流教程，没有之一](https://www.cnblogs.com/yichunguo/p/11775270.htm)
- [CS Notes Java IO](http://www.cyc2018.xyz/Java/Java%20IO.html)
- [Java Note IO 流](http://www.cyc2018.xyz/Java/Java%20IO.html)
- [Java 基础 IO流【示例篇】](https://blog.csdn.net/weixin_44050211/article/details/126909966)
- [Java File类（文件操作类）详解](http://c.biancheng.net/view/1133.html)
