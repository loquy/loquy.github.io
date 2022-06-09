---
title: 在 PHP 中使用多进程
abbrlink: 68d862bb
date: 2021-04-04 23:38:28
updated: 2021-04-06 22:27:28
tags: PHP
categories: PHP
category_bar: true
index_img: https://www.loquy.cn/images/multi-progress.jpg
---
## 多道程序设计以及顺序和并发执行
- 所谓多道程序设计，就是允许多个程序同时进入内存并运行。多道程序设计是操作系统所采用的最基本、最重要的技术，其根本目的是提高整个系统的效率。
- 程序是一个在时间上按严格次序前后相继的操作序列，具有独立功能的程序独占处理器直到得到最终结果的过程称为程序的顺序执行。所谓程序的并发执行，是指两个或两个以上程序在计算机系统中，同时处于开始执行且尚未结束的状态。

### 进程和线程
- 进程是具有一定独立功能的程序在某个数据集合上的一次运行活动，是系统进行资源分配和调度的一个基本单位。
- 线程是进程中的一个实体，是处理器调度和分派的基本单位。线程自己基本上不拥有系统资源，只拥有少量在运行中必不可少的资源（如程序计数器、一组寄存器和栈等），但它可与同属一个进程的其他线程共享进程所拥有的全部资源。一个线程可以创建和撤销另一个线程；同一个进程中的多个线程之间可以并发执行。由于线程之间的制约，至使线程在运行中也呈现出间断性。相应的，线程也同样拥有就绪、等待和运行三种基本状态。有的系统中线程还有终止状态等。

## 相关函数
### 程序执行函数
- [escapeshellarg](https://www.php.net/manual/zh/function.escapeshellarg.php) — 把字符串转码为可以在 shell 命令里使用的参数
- [escapeshellcmd](https://www.php.net/manual/zh/function.escapeshellcmd.php) — shell 元字符转义
- [exec](https://www.php.net/manual/zh/function.exec.php) — 执行一个外部程序
- [passthru](https://www.php.net/manual/zh/function.passthru.php) — 执行外部程序并且显示原始输出
- [proc_close](https://www.php.net/manual/zh/function.proc-close.php) — 关闭由 proc_open 打开的进程并且返回进程退出码
- [proc_get_status](https://www.php.net/manual/zh/function.proc-get-status.php) — 获取由 proc_open 函数打开的进程的信息
- [proc_nice](https://www.php.net/manual/zh/function.proc-nice.php) — 修改当前进程的优先级
- [proc_open](https://www.php.net/manual/zh/function.proc-open.php) — 执行一个命令，并且打开用来输入/输出的文件指针。
- [proc_terminate](https://www.php.net/manual/zh/function.proc-terminate.php) — 杀除由 proc_open 打开的进程
- [shell_exec](https://www.php.net/manual/zh/function.shell-exec.php) — 通过 shell 环境执行命令，并且将完整的输出以字符串的方式返回。
- [system](https://www.php.net/manual/zh/function.system.php) — 执行外部程序，并且显示输出

### 文件系统函数 
- [pclose](https://www.php.net/manual/zh/function.pclose.php) — 关闭进程文件指针
- [popen](https://www.php.net/manual/zh/function.popen.php) — 打开进程文件指针

### 网络函数 
- [fsockopen](https://www.php.net/manual/zh/function.fsockopen.php) — 打开一个网络连接或者一个Unix套接字连接

## 代码示例
### 开启多个进程，检查代理节点 ip:port 是否可以连接

deadoralive.php

```php
<?php

$json = file_get_contents('./node.json');
$array = json_decode($json, true);
$array = array_chunk($array, $argv[1]);
$connection = [];
$success = 0;
$unit = $argv[2];
foreach ($array[$unit] as $value) {
    $ip = $value['server'];
    $port = $value['server_port'];
    $deadoralive = @fsockopen($ip, $port, $errno, $errstr, 1);

    if (!$deadoralive) {
        echo getmypid() . " | The IP address, $ip, is dead" . "\n";
    } else {
        $success++;
        $connection[] = $value;
        echo getmypid() . " | The IP address, $ip, is alive". "\n";
    }
}
$total = count($array[$unit]);
echo "\033[31m unit: $unit |total: $total |success: $success \033[0m \n";
$connection = print_r($connection, true);
file_put_contents('./alivenode_' . $argv[3] . '.log', $connection, FILE_APPEND);
```

process.php

```php
<?php

$time = time();
$begin = round(microtime(true), 4);
$json = file_get_contents('./node.json');
$array = json_decode($json, true);
$size = 5;
$chunk = count($array) / $size;
$chunk = ceil($chunk);
// 此处使用 popen 开启多进程，同理可以使用 proc_open、exec 等函数实现
for ($i=0; $i < $chunk; $i++) {
    $pipe[$i] = popen('php ./deadoralive.php ' . $size . ' '. $i . ' ' . $time, 'w');
}
for ($i=0; $i < $chunk; $i++) {
    $r = pclose($pipe[$i]);
}
$end = round(microtime(true), 4);
echo $end - $begin . "\n";
```

cli 模式下执行命令 php process.php ，效率还行 181 个节点 12 秒就跑完了
![ouput](https://www.loquy.cn/images/proxy_checker.jpg)
