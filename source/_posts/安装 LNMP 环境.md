---
title: 安装 LNMP 环境
tags:
  - Linux
categories: 
  - [编程, Linux]
category_bar: [Linux]
index_img: https://www.loquy.cn/images/LNMP.jpeg
abbrlink: 5ca3d0c3
date: 2020-07-05 11:37:09
updated: 2020-07-05 11:37:09
---
# 安装
- 虚拟机中安装 centos 8（自行搜索,安装后只有命令行，图形界面需要另外安装）
- 切换 root 账号

        su root

- 使用 `dhclient` 命令为 centos 8 分配一个 ip 地址

![](https://www.loquy.cn/images/1593925975.jpg)

- 使用vim编辑网卡配置，将上面分配所得的ip地址写入配置文件

        vim /etc/sysconfig/network-scripts/ifcfg-enp0s3

- 注意红框的修改的配置按 `i` 键插入编辑

![](https://www.loquy.cn/images/1593924179.jpg)

- 按 `Esc` 键然后 `:wq` 保存退出
- 重启网卡使用 `nmcli c reload` 命令，ping 下百度发现网络可以用了

![](https://www.loquy.cn/images/1593925621.jpg)

- 使用 dnf 取代了 yum 来进行包管理，安装 nginx、php、mysql

        dnf install nginx php mariadb-server php-mysqlnd

- 把 nginx、php-fpm、mariadb 加入到开机启动

        systemctl enable nginx
        systemctl enable php-fpm
        systemctl enable mariadb

- 启动 nginx、php-fpm、mariadb

        systemctl start nginx
        systemctl start php-fpm
        systemctl start mariadb

- 设置防火墙开放 tcp 80 和 tcp 3306 端口

        firewall-cmd --zone=public --add-port=80/tcp --permanent
        firewall-cmd --zone=public --add-port=3306/tcp --permanent
        firewall-cmd --reload

# 使用

## nginx
- 浏览器访问服务器 ip

![](https://www.loquy.cn/images/1593924883.jpg)

## mysql

- 设置 mysql 数据库 root 账号密码

        mysqladmin -uroot  password  'your password'

- root 账号登陆 mysql

        mysql -uroot -p

- 创建一个新用户 web，密码为 123456，授权远程计算机使用账号 web 登陆数据库，并立刻刷新权限  

        MariaDB[(none)]>grant all on *.* to 'web'@'%'  identified by '123456';
        MariaDB[(none)]>flush privileges;

- 退出 mysql 数据库
    
        MariaDB[(none)]> quit; 

![](https://www.loquy.cn/images/1593925030.jpg)    

## php
- 创建文件 index.php

        touch /usr/share/nginx/html/index.php
        echo  "<?php  phpinfo();  ?>" > /usr/share/nginx/html/index.php

- 重启 nginx 服务，使用浏览器访问服务器 ip

        systemctl restart  nginx        


![](https://www.loquy.cn/images/1593924755.jpg)        
