---
title: 在线运行 Java 代码的原理及实现
category_bar:
  - Java
tags:
  - Java
  - SpringBoot
categories:
  - - 编程
    - Java
index_img: images/JavaCompilerCover.png
abbrlink: def20d69
description:
---
## 简介

在线运行 Java 代码是指用户在浏览器中输入 Java 代码，通过在线编译和加载，最终在服务器上运行代码并返回结果。这种技术被广泛应用于在线编程学习、在线面试和在线评测等场景。

##  原理

### 动态编译

Java 的动态编译是指在运行时将 Java 代码编译成字节码的过程。Java 提供了一个标准的 API：`JavaCompiler` 和 `ToolProvider`，可以用来进行动态编译。在动态编译时，需要将 Java 代码转换为 `JavaFileObject` 对象，然后通过 `JavaCompiler.getTask()` 方法来编译 `JavaFileObject` 对象。在编译过程中，可以使用 `DiagnosticCollector` 类来收集编译过程中的错误和警告信息。

### 动态加载

Java 的动态加载是指在运行时将编译好的字节码加载到内存中，并生成对应的 class 对象的过程。Java 提供了一个标准的 API：`ClassLoader`，可以用来进行动态加载。通过自定义 `ClassLoader` 类来加载字节码，然后调用 `ClassLoader.loadClass()` 方法即可加载类。

### 线程的限制

在线运行 Java 代码需要考虑线程的限制和安全性控制。为了避免在线运行的代码对服务器产生过多的负载，可以使用线程池来限制并发访问以及设置超时时间停止线程。

### 安全性控制

为了保证在线运行的代码安全性，需要限制在线运行的代码只能访问一些受控的资源，并且禁止访问其他资源。Java 提供了一个安全管理器（`SecurityManager`）来控制代码的安全性，可以在代码运行前启用安全管理器，限制代码的访问权限。

## 实现

### 编译器

`ScriptCompiler` 类实现了一个动态编译和执行 Java 代码，主要功能包括：

- 编译 Java 代码字符串为 Java Class，并加载该 Class。
- 执行该 Class 中的 Main 方法，并将输出结果返回。

包括以下几个主要步骤：

- 使用 Java Compiler API 编译 Java 代码字符串为 Java Class。
   - 利用 Java Compiler API 获取系统默认的 `JavaCompiler`，然后创建一个 `DiagnosticCollector` 用于收集编译过程中的诊断信息。
   - 使用 `StandardJavaFileManager` 创建一个 `JavaFileObject` 对象，表示一个源代码文件，将 Java 代码字符串作为文件内容。
   - 设置编译选项，这里设置了编译输出目录和编译源文件列表。
   - 调用 `CompilationTask` 的 `call()` 方法编译 Java 代码，如果编译失败，则将诊断信息拼接成字符串并抛出异常。
- 使用自定义的 `ClassLoader` 加载编译好的 Java Class。
   - `ScriptLoader` 首先将类名转换成类文件名，然后从指定的路径中加载对应的类文件，返回该类的 class 对象。
- 执行编译好的 Java Class 的 Main 方法，并将输出结果返回。
   - 创建一个 `ByteArrayOutputStream` 对象用于缓存执行结果。
   - 使用 `System.setOut()` 方法将 `System.out` 的输出重定向到缓存输出流中。
   - 通过反射获取 Main 方法并执行，将传入的参数作为 Main 方法的参数，执行过程中会输出内容到缓存输出流中。
   - 将缓存输出流中的内容转换成字符串并返回，同时将 `System.out` 重定向回原来的输出流。
- 对执行 Main 方法进行安全控制，防止代码执行恶意操作。
   - 在执行 Main 方法之前和之后，调用 `ScriptSecurityManager` 的相关方法进行安全控制，限制了代码执行的权限和行为，防止代码执行恶意操作。

<details>
  <summary>点击查看代码</summary>


```java
package script;

import javax.tools.*;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;

/**
 * @author loquy
 */
public class ScriptCompiler {

    public Class<?> compile(String javaSource) throws Exception {
        JavaCompiler javaCompiler = ToolProvider.getSystemJavaCompiler();
        DiagnosticCollector<JavaFileObject> diagnosticsCollector = new DiagnosticCollector<>();
        StandardJavaFileManager standardFileManager = javaCompiler.getStandardFileManager(null, null, null);
        JavaFileObject file = new StringObject(ScriptConstant.CLASS_NAME, javaSource);
        Iterable<String> options = Arrays.asList("-d", ScriptConstant.CLASS_PATH);
        Iterable<? extends JavaFileObject> files = Collections.singletonList(file);

        JavaCompiler.CompilationTask task = javaCompiler.getTask(null, standardFileManager, diagnosticsCollector, options, null, files);
        Boolean result = task.call();
        if (!result) {
            StringBuilder diagnosticString = new StringBuilder();
            List<Diagnostic<? extends JavaFileObject>> diagnostics = diagnosticsCollector.getDiagnostics();
            for (Diagnostic<? extends JavaFileObject> diagnostic : diagnostics) {
                diagnosticString.append(diagnostic);
            }
            throw new Exception("编译失败，请检查语法是否正确，具体错误：" + diagnosticString);
        }
        return loadClass("Main");
    }

    /**
     * 加载CLASS
     *
     * @param className 类名
     * @return class文件
     */
    public Class<?> loadClass(String className) throws Exception {
        //用自定义classLoader加载这个class
        ScriptLoader scriptLoader = new ScriptLoader(getClass().getClassLoader());
        return scriptLoader.loadClass(className);
    }

    public String executeMainMethod(Class<?> clazz, Long timeLimit, String[] args) throws ScriptException {
        final ExecutorService executorService = Executors.newFixedThreadPool(10);
        List<FutureTask<String>> futureTaskList = new ArrayList<>();
        Callable<String> mainMethodExecuteCallable = () -> executeMainMethodWithClass(clazz, args);
        FutureTask<String> futureTask = new FutureTask<>(mainMethodExecuteCallable);
        futureTaskList.add(futureTask);
        executorService.submit(futureTask);
        String result = null;
        FutureTask<String> taskItem = futureTaskList.get(0);
        try {
            result = taskItem.get(timeLimit, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            taskItem.cancel(true);
            e.printStackTrace();
            throw new ScriptException("运行超时了！限定时间为:" + timeLimit + "毫秒");
        } catch (SecurityException | ExecutionException | InterruptedException e) {
            e.printStackTrace();
            throw new ScriptException("执行失败，请检查代码是否含有危险操作，具体错误：" + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    private String executeMainMethodWithClass(Class<?> clazz, String[] args) throws ScriptException {
        ByteArrayOutputStream baoStream = new ByteArrayOutputStream(1024);
        PrintStream cacheStream = new PrintStream(baoStream);
        PrintStream oldStream = System.out;
        System.setOut(cacheStream);
        //执行Main方法
        try {
            long threadId = Thread.currentThread().getId();
            ScriptSecurityManager.initPermission(threadId);
            Method method = clazz.getMethod("main", String[].class);
            method.invoke(null, (Object) args);
            ScriptSecurityManager.destroyPermission();
        } catch (InvocationTargetException e) {
            // 获取目标异常
            Throwable t = e.getTargetException();
            t.printStackTrace();
            throw new ScriptException(t.getMessage());
        } catch (IllegalAccessException | NoSuchMethodException e) {
            e.printStackTrace();
            throw new ScriptException(e.getMessage());
        } finally {
            ScriptSecurityManager.destroyPermission();
        }
        System.setOut(oldStream);
        return baoStream.toString();
    }

    private static class StringObject extends SimpleJavaFileObject {
        private final String contents;

        public StringObject(String className, String contents) {
            super(URI.create("String:///" + className + Kind.SOURCE.extension), Kind.SOURCE);
            this.contents = contents;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return contents;
        }
    }

    public static void main(String[] args) {
        String code = "    import java.io.*;\n" +
                "    public class Main {\n" +
                "        public static void main(String[] args) throws InterruptedException{\n" +
                "            File file = new File(\"D:\\\\test\");\n" +
                "            System.out.println(args[0]);\n" +
//                "            boolean delete = file.delete();\n" +
//                " for (int i = 10; i>=0; i--) {\n" +
//                " Thread.sleep(1000);  \n" +
//                " }\n" +
//                "            System.out.println(delete);\n" +
//                "            System.exit(0);\n" +
                "        }\n" +
                "    }";
        System.out.println(code);
        ScriptCompiler scriptCompiler = new ScriptCompiler();
        try {
            Class<?> clazz = scriptCompiler.compile(code);
            String string = scriptCompiler.executeMainMethod(clazz, 1000L, new String[]{"123"});
            System.out.println("--------->" + string);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
    }
}
```

</details>

### 常量

- `CLASS_NAME` 常量为字符串 "Main"。
- `CLASS_PATH` 常量为调用了 `createScriptDir()` 方法的返回值。
- `createScriptDir()` 是一个静态方法，它的作用是创建一个名为 "custom-script" 的目录，并返回该目录的路径作为 CLASS_PATH 常量的值。具体实现如下：
   - 通过 `ScriptConstant.class.getProtectionDomain().getCodeSource().getLocation().getPath()` 方法获取当前类的绝对路径。
   - 将路径字符串按照 UTF-8 编码方式进行解码，以避免因为路径中存在特殊字符导致的问题。
   - 获取当前路径的父目录和其父目录的路径，即 `resource` 目录。
   - 将 `resource + File.separator + "custom-script" + File.separator` 赋值给 `customScriptPath` 变量，表示要创建的目录名。
   - 创建 `customScript` 目录，并将 `customScriptPath` 作为 CLASS_PATH 常量的值返回。


综上，ScriptConstant 类的作用是为编译脚本文件提供一个固定的目录，该目录下的脚本文件会被编译为 Java 类并在运行时执行。

<details>
  <summary>点击查看代码</summary>




```java
package script;

import java.io.File;
import java.io.UnsupportedEncodingException;

/**
 * @author loquy
 */
public class ScriptConstant {

    public static final String CLASS_NAME = "Main";
    public static final String CLASS_PATH = createScriptDir();

    public static String createScriptDir() {
        String path = ScriptConstant.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        try {
            path = java.net.URLDecoder.decode(path, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        File file = new File(path);
        File parent = new File(file.getParent());
        File resource = new File(parent.getParent());
        String customScriptPath = resource + File.separator + "custom-script" + File.separator;
        File customScript = new File(customScriptPath);
        if (!customScript.exists()) {
            customScript.mkdirs();
        }
        return customScriptPath;
    }
}
```

</details>

### 异常

`ScriptException` 的异常类继承自 `SecurityException` 类。该类通过 `public ScriptException(String message)` 构造函数提供了一个带有字符串参数的构造函数，用于创建一个新的 `ScriptException` 对象，这个对象包含了给定的字符串消息。

这个自定义的异常类可能用于在处理脚本时发生错误时抛出异常。例如，当脚本执行时发生安全性异常时，就可以抛出这个自定义的异常，以便在调用脚本的代码中处理异常并采取适当的措施。

<details>
  <summary>点击查看代码</summary>


```java
package script;

/**
 * @author loquy
 */
public class ScriptException extends SecurityException {
    public ScriptException(String message) {
        super(message);
    }
}
```

</details>

### 类加载器

继承自 `ClassLoader` 的 `ScriptLoader` 类，用于在运行时动态加载自定义脚本。

该类重写了 `findClass()` 方法，在此方法中，将类名转换为类文件的路径，然后通过 `getClassFileBytes()` 方法读取该路径下的 class 文件，并返回其字节码。最后，使用 `defineClass()` 方法将字节码转化为 Java 类的实例，并返回该类的 class 对象。

`getClassFileBytes()` 方法使用了 NIO 的方式读取 class 文件。该方法通过 `FileInputStream` 打开 class 文件，然后通过 `FileChannel` 读取文件数据，并使用 `ByteBuffer` 缓存数据，最后通过 `WritableByteChannel` 将数据写入到 `ByteArrayOutputStream` 中，并返回其字节数组。

该脚本加载器通过在 `findClass()` 方法中动态加载 class 文件，使得程序可以在运行时动态的调用一些自定义的 Java脚本。

<details>
  <summary>点击查看代码</summary>


```java
package script;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.WritableByteChannel;

/**
 * @author loquy
 */
public class ScriptLoader extends ClassLoader {

    public ScriptLoader(ClassLoader parent) {
        super(parent);
    }

    @Override
    protected Class<?> findClass(String name) {
        //将包转为目录
        String classPath = name.replace(".", "\\") + ".class";
        String classFile = ScriptConstant.CLASS_PATH + classPath;
        Class<?> clazz = null;
        try {
            byte[] data = getClassFileBytes(classFile);
            clazz = defineClass(name, data, 0, data.length);
            if (null == clazz) {
                throw new Exception("类加载器里不能找到这个类");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return clazz;

    }

    private byte[] getClassFileBytes(String classFile) throws Exception {
        //采用NIO读取
        FileInputStream fis = new FileInputStream(classFile);
        FileChannel fileC = fis.getChannel();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        WritableByteChannel outC = Channels.newChannel(baos);
        ByteBuffer buffer = ByteBuffer.allocateDirect(1024);
        while (true) {
            int i = fileC.read(buffer);
            if (i == 0 || i == -1) {
                break;
            }
            buffer.flip();
            outC.write(buffer);
            buffer.clear();
        }
        fis.close();
        return baos.toByteArray();
    }
}
```

</details>

### 安全管理器

`SecurityManager` 类是控制应用程序的安全权限，以保护系统安全。主要方法为 `initPermission()` 和 `destroyPermission()`。

`initPermission()` 方法用于设置应用程序的安全管理器，如果还没有设置，则会创建一个 `ScriptSecurityManager` 实例并将其设置为应用程序的安全管理器。它需要一个线程 ID 参数作为标识，以便在 `check()` 方法中检查权限时确定当前线程是否具有特定权限。

`destroyPermission()` 方法用于撤销应用程序的安全管理器，它将之前设置的安全管理器设置为 null，并且将 `destroy` 标志设置为 true。在 `check()` 方法中检查权限时，如果 `destroy` 标志为 true，则不允许任何权限，因为应用程序的安全管理器已被撤销。

`ScriptSecurityManager` 类的 `check()` 方法是由`SecurityManager` 类提供的，用于检查应用程序中的权限请求。`ScriptSecurityManager`类重写了这个方法，实现了对特定权限的检查和控制。如果请求的权限不被允许，它将抛出一个 `SecurityException` 异常，以防止应用程序的不安全行为。

在 `check()` 方法中，根据权限的类型和名称，执行不同的检查。如果权限是 `RuntimePermission`，它会检查请求的名称是否包含 `setSecurityManager` 并且`destroy` 标志为 false，如果是，则不允许该请求。对于其他权限类型，它会检查请求的名称或操作是否包含特定字符串，并且如果包含，则不允许该请求。如果请求的权限被允许，则不会发生任何操作。

总之，`ScriptSecurityManager` 类是一个用于控制 Java 应用程序的安全权限的自定义安全管理器，通过 `initPermission()` 和 `destroyPermission()` 方法控制应用程序的安全管理器，并通过 `check()` 方法检查和控制权限请求。

<details>
  <summary>点击查看代码</summary>


```java
package script;

import java.security.Permission;

/**
 * @author loquy
 */
public class ScriptSecurityManager extends SecurityManager {

    private static boolean destroy = false;
    private static long threadId;

    public static void initPermission(long threadId) {
        SecurityManager originalSecurityManager = System.getSecurityManager();
        if (originalSecurityManager == null) {
            SecurityManager sm = new ScriptSecurityManager();
            System.setSecurityManager(sm);
        }
        ScriptSecurityManager.threadId = threadId;
    }

    public static void destroyPermission() {
        ScriptSecurityManager.destroy = true;
        System.setSecurityManager(null);
    }

    private void check(Permission perm) throws ScriptException {
        long threadId = Thread.currentThread().getId();
        if (threadId == ScriptSecurityManager.threadId) {
            String name = perm.getName();
            String actions = perm.getActions();
            if (perm instanceof RuntimePermission) {
                String setSecurityManager = "setSecurityManager";
                if (name.contains(setSecurityManager) && !destroy) {
                    throw new SecurityException("不允许设置安全管理器！");
                }
                checkPerm(name, "exitVM", "不允许调用exit方法！");
                checkPerm(name, "loadLibrary", "不允许链接库！");
                checkPerm(name, "createClassLoader", "不允许创建类加载器！");
                checkPerm(name, "getClassLoader", "不允许获取类加载器！");
                checkPerm(name, "writeFileDescriptor", "不允许写入文件描述符！");
                checkPerm(name, "queuePrintJob", "不允许调用线程发起打印作业请求！");
                checkPerm(name, "setContextClassLoader", "不允许线程使用的上下文类装入器的设置！");
                checkPerm(name, "enableContextClassLoaderOverride", "不允许线程上下文类装入器方法的子类实现！");
                checkPerm(name, "closeClassLoader", "不允许关闭类加载器！");
                checkPerm(name, "createSecurityManager", "不允许创建一个新的安全管理器！");
                checkPerm(name, "shutdownHooks", "不允许注册和取消虚拟机关机钩子！");
                checkPerm(name, "setFactory", "不允许设置ServerSocket或socket使用的套接字工厂，或URL使用的流处理程序工厂！");
                checkPerm(name, "setIO", "不允许System.out、 System.in 和 System.err 的设置！");
                checkPerm(name, "modifyThread", "不允许线程的修改！");
                checkPerm(name, "defineClassInPackage", "不允许在参数指定的包中定义类！");
                checkPerm(name, "modifyThread", "不允许线程的修改！");
                checkPerm(name, "stopThread", "不允许通过调用Thread stop方法停止线程！");
                checkPerm(name, "modifyThreadGroup", "不允许修改线程组！");
                checkPerm(name, "getProtectionDomain", "不允许获取特定代码源的策略信息！");
                checkPerm(name, "getFileSystemAttributes", "不允许文件系统属性的检索！");
                checkPerm(name, "loadLibrary", "不允许指定库的动态链接！");
                checkPerm(name, "accessClassInPackage", "不允许通过类装入器的loadClass方法访问指定的包！");
                checkPerm(name, "defineClassInPackage", "不允许通过类装入器的defineClass方法定义指定包中的类！");
                checkPerm(name, "accessDeclaredMembers", "不允许对类的已声明成员的访问！");
                checkPerm(name, "queuePrintJob", "不允许打印作业请求的启动！");
                checkPerm(name, "getStackTrace", "不允许获取另一个线程的堆栈跟踪信息！");
                checkPerm(name, "setDefaultUncaughtExceptionHandler", "不允许设置当线程因未捕获异常而突然终止时使用的默认处理程序！");
                checkPerm(name, "preferences", "不允许允许在Preferences持久备份存储中检索或更新操作！");
                checkPerm(name, "usePolicy", "不允许授予禁用Java插件的默认安全提示行为！");
            }
            if (perm instanceof java.io.FilePermission) {
                checkPerm(actions, "execute", "不允许调用exec方法！");
                checkPerm(actions, "write", "不允许写入文件！");
                checkPerm(actions, "delete", "不允许删除文件！");
            }
            if (perm instanceof java.net.SocketPermission) {
                checkPerm(name, "resolve,connect", "不允许打开到指定主机和端口号的套接字连接！");
                checkPerm(name, "listen", "不允许在指定的本地端口号上等待连接请求！");
                checkPerm(name, "connect,accept", "不允许接受来自指定主机和端口号的套接字连接！");
            }
            if (perm instanceof java.util.PropertyPermission) {
                checkPerm(name, "read,write", "不允许访问或修改系统属性！");
            }
            if (perm instanceof java.security.SecurityPermission) {
                checkPerm(name,"createAccessControlContext,getDomainCombiner,getPolicy,setPolicy,createPolicy,getProperty," +
                                "setProperty,insertProvider,removeProvider,clearProviderProperties,putProviderProperty,removeProviderProperty",
                        "不允许具有指定权限目标名称的权限！");
            }
        }
    }

    @Override
    public void checkPermission(Permission perm) throws ScriptException {
        check(perm);

    }

    @Override
    public void checkPermission(Permission perm, Object context) throws ScriptException {
        check(perm);
    }

    private void checkPerm(String perm, String checks, String msg) throws ScriptException {
        String[] check = checks.split(",");
        for (String checkPerm : check) {
            if (perm.contains(checkPerm)) {
                throw new ScriptException(msg);
            }
        }
    }
}
```

</details>

# 源码

[参见此仓库](https://github.com/loquy/spring-boot-demo)
