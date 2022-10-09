---
title: Windows 下定时重启 Tomcat
category_bar:
  - Java
  - Windows
tags:
  - Java
  - Tomcat
  - Windows
categories:
  - [编程, Java]
  - [编程, Windows]
index_img: images/tomcat.png
abbrlink: 36df66f4
description:
---
# 前言

    维护很老的项目时，tomcat 隔几天会死掉一次；
    
    其中代码肯定有问题的，但是历史遗留的代码必然有很多坑且非原作者很难去改动；
    
    无奈出此下策：写个批处理脚本加入任务计划去定时重启 tomcat；
    
    脚本原理是根据端口关闭 tomcat 所在的进程，杀死进程后调用 startup.bat 重新启动 tomcat。

# 批处理脚本

1、先查看 tomcat 配置目录 conf 下的 server.xml 文件里的两个端口号

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Server port="8005" shutdown="SHUTDOWN">
    <!-- 省略 -->
  <Service name="Catalina">
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
     <!-- 省略 -->
  </Service>
</Server>
```

2、把端口写入到重启 tomcat 的批处理脚本里

```bat
@echo off & setlocal EnableDelayedExpansion 
title 定时重启 tomcat

:: Tomcat 路径和端口
set tomcat_root_path=H:
set tomcat_ports=8005,8080
set tomcat_path=H:\environment\apache-tomcat-8.5.72\bin

::循环关闭端口对应的进程
for %%a in (%tomcat_ports%) do (
	set pid=0
	for /f "tokens=2,5" %%b in ('netstat -ano ^| findstr ":%%a"') do (
		set temp=%%b
		for /f "usebackq delims=: tokens=1,2" %%i in (`set temp`) do (
				if %%j==%%a (
					taskkill /f /pid %%c
				set pid=%%c
					echo 端口号【%%a】相关进程已杀死
			) else (
				echo 不是本机占用端口【%%a】
			)
		)
	)
	if !pid!==0 (
	echo 端口号【%%a】没有占用
	)
) 
echo tomcat 相关进程已杀死 
::延迟 10 秒
TIMEOUT /T 10

echo 切换到 tomcat 目录，调用 startup.bat 
%tomcat_root_path%
cd %tomcat_path%
call startup.bat 
echo tomcat 已启动!
 
echo 操作完成!
exit
```

# 定时重启

1、底部任务栏搜索框输入：任务计划程序，然后打开；

2、创建基本任务，添加任务描述；

3、触发器，选择定时的时间；

4、操作，启动程序，选择重启 tomcat 的批处理脚本；

5、完成。
