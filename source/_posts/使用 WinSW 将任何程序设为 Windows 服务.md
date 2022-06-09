---
title: 使用 WinSW 将任何程序设为 Windows 服务
abbrlink: 10bdb19a
date: 2022-06-08 10:13:03
tags: 
     - WinSW
     - Windows
categories: Windows
index_img: 'https://www.loquy.cn/images/WinSW.jpg'
---
# 下载

最新版本和预发布的 WinSW 二进制文件可在 [GitHub Releases](https://github.com/winsw/winsw) 上获得。

# 使用

## 将 WinSW 用作捆绑工具

- 从发行版中获取 **WinSW.exe** 或 **WinSW.zip**，然后根据您的喜好重命名.exe（例如 myapp.exe）。
- 编写 **myapp.xml** 。
- 将这两个文件并排放置，因为这就是 WinSW 发现其相关配置的方式。
- 运行 [myapp.exe install](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#install-command) 以安装服务。
- 运行 [myapp.exe start](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#status-command) 以启动服务。

# 配置

您编写定义服务的配置文件。
下面的示例是 Jenkins 项目中使用的原始示例：

```xml
<service>
    <id>jenkins</id>
    <name>Jenkins</name>
    <description>This service runs Jenkins continuous integration system.</description>
    <env name="JENKINS_HOME" value="%BASE%"/>
    <executable>java</executable>
    <arguments>-Xrs -Xmx256m -jar "%BASE%\jenkins.war" --httpPort=8080</arguments>
    <log mode="roll"></log>
</service>
```

配置文件的完整规范可在 [此处](https://github.com/winsw/winsw/blob/v3/docs/xml-config-file.md) 获得。
[您可以在此处](https://github.com/winsw/winsw/tree/v3/samples) 找到更多示例。

# 命令

WinSW 由 [ XML 配置文件](https://github.com/winsw/winsw/blob/v3/docs/xml-config-file.md) 管理。

您重命名的 **WinSW.exe** 二进制文件还接受以下命令：   

| 命令 | 说明 |
| -------- | ------------ |
| [install](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#install-command) | 安装服务。|
| [uninstall](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#uninstall-command) | 卸载服务。|
| [start](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#start-command) | 启动服务。|
| [stop](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#stop-command) | 停止服务。|
| [restart](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#restart-command) | 停止然后启动服务。|
| [status](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#status-command) | 检查服务的状态。|
| [refresh](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#refresh-command) | 无需重新安装即可刷新服务属性。|
| [customize](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#customize-command) | 自定义包装器可执行文件。|

实验命令：

| 命令 | 说明 |
| -------- | ------------ |
| [dev-ps](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#dev-ps-command) | 绘制与服务关联的进程树。|
| [dev-kill](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#dev-kill-command) | 如果服务停止响应，则终止服务。|
| [dev-list](https://github.com/winsw/winsw/blob/v3/docs/cli-commands.md#dev-list-command) | 列出由当前可执行文件管理的服务。|

大多数命令需要管理员权限才能执行。WinSW 将在非提升会话中提示输入 UAC。

# 例子

## Nacos

### 下载

最新版本的 Nacos 文件可在 [GitHub Releases](https://github.com/alibaba/nacos/releases) 上获得。

### 配置

编写 **nacos-service.xml** 配置执行 **startup.cmd**。
```xml
<service>
    <id>nacos service</id>
    <name>Nacos Service</name>
    <description>Nacos-service</description>
    <logpath>H:\environment\nacos\bin\logs\</logpath>
    <logmode>roll</logmode>
    <executable>H:\environment\nacos\bin\startup.cmd</executable>
    <stopexecutable>H:\environment\nacos\bin\shutdown.cmd</stopexecutable>
</service>
```

### 安装  

- 将 **WinSW.exe** 重命名为 **nacos-service.exe** 和 **nacos-service.xml** 放到同一个目录。
- 在 **CMD** 中运行 **nacos-service.exe install**。
 
## Redis

### 下载

最新版本的 Redis 文件可在 [GitHub Releases](https://github.com/redis/redis/releases) 上获得。

### 配置

编写 **Redis.xml** 配置执行 **redis-server.exe**。
```xml
<service>
 <!--服务ID-->
 <id>Redis</id>
 <!--服务名-->
 <name>Redis</name>
 <!--服务描述-->
 <description>Redis</description>
 <!--运行方式-->
 <executable>
     H:\environment\Redis-x64-5.0.14\redis-server.exe
 </executable>
 <!-- 日志配置 -->
 <logpath>H:\environment\Redis-x64-5.0.14\log</logpath>
 <!--日志重置 (rotate循环追加)-->
 <logmode>reset</logmode>
</service>
``` 

### 安装

- 将 **WinSW.exe** 重命名为 **Redis.exe** 和 **Redis.xml** 放到同一个目录。
- 在 **CMD** 中运行 **Redis.exe install**。

## Virtualbox

### 下载

最新版本的 VirtualBox 文件可在 [官网](https://www.virtualbox.org/wiki/Downloads) 上获得。

### 配置

编写 **startup.bat** 执行脚本, 命令为启动两个虚拟机。     
``` bat
@ECHO OFF
cd C:\Program Files\Oracle\VirtualBox\
start VBoxManage.exe startvm  CentOS-Stream-9 --type headless
cd C:\Program Files\Oracle\VirtualBox\
start VBoxManage.exe startvm startvm cs --type headless
EXIT
```

编写 **VirtualBox.xml** 配置执行 **startup.bat** 文件。
```xml
<service>
 <!--服务ID-->
 <id>VirtualBox</id>
 <!--服务名-->
 <name>VirtualBox</name>
 <!--服务描述-->
 <description>VirtualBox</description>
 <!--运行方式-->
 <executable>
     H:\environment\VirtualBox\startup.bat
 </executable>
 <!-- 日志配置 -->
 <logpath>H:\environment\VirtualBox\log</logpath>
 <!--日志重置 (rotate循环追加)-->
 <logmode>reset</logmode>
</service>
``` 

### 安装

- 将 **WinSW.exe** 重命名为 **VirtualBox.exe** 和 **VirtualBox.xml** 放到同一个目录。
- 在 **CMD** 中运行 **VirtualBox.exe install**。

## Sentinel

### 下载

最新版本的 Redis 文件可在 [GitHub Releases](https://github.com/alibaba/Sentinel/releases) 上获得。

### 配置

编写 **startup.bat** 执行脚本, 命令为启动 jar 包。
``` bat
@ECHO OFF
java -Dserver.port=8718 -Dcsp.sentinel.dashboard.server=localhost:8718 -Dproject.name=sentinel-dashboard -jar "H:\environment\sentinel\sentinel-dashboard.jar"
EXIT
``` 

编写 **sentinel-dashboard.xml** 配置执行 **startup.bat** 文件。
```xml
<service>
 <!--服务ID-->
 <id>sentinel-dashboard</id>
 <!--服务名-->
 <name>sentinel-dashboard</name>
 <!--服务描述-->
 <description>sentinel-dashboard</description>
 <!--运行方式-->
 <executable>
     H:\environment\sentinel\startup.bat
 </executable>
 <!-- 日志配置 -->
 <logpath>H:\environment\sentinel\log</logpath>
 <!--日志重置 (rotate循环追加)-->
 <logmode>reset</logmode>
</service>
```

### 安装

- 将 **WinSW.exe** 重命名为 **sentinel-dashboard.exe** 和 **sentinel-dashboard.xml** 放到同一个目录。
- 在 **CMD** 中运行 **sentinel-dashboard.exe install**。

# 参考

- [WinSW](https://github.com/winsw/winsw)
