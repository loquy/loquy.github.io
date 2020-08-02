---
title: 安装LNMP环境
tags:
  - Linux
  - LNMP
categories:
  - - Linux
index_img: https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/LNMP.jpeg
abbrlink: 5ca3d0c3
date: 2020-07-05 11:37:09
---
# 安装
- 虚拟机中安装centos 8（自行搜索,安装后只有命令行，图形界面需要另外安装）
- 切换 root 账号

        su root

- 使用`dhclient`命令为centos 8分配一个ip地址

![](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1593925975.jpg)

- 使用vim编辑网卡配置，将上面分配所得的ip地址写入配置文件

        vim /etc/sysconfig/network-scripts/ifcfg-enp0s3

- 注意红框的修改的配置按`i`键插入编辑

![](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1593924179.jpg)

- 按`Esc`键然后`:wq`保存退出
- 重启网卡使用`nmcli c reload`命令，ping下百度发现网络可以用了

![](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1593925621.jpg)

- 使用dnf取代了yum来进行包管理，安装nginx、php、mysql

        dnf install nginx php mariadb-server php-mysqlnd

- 把nginx、php-fpm、mariadb加入到开机启动

        systemctl enable nginx
        systemctl enable php-fpm
        systemctl enable mariadb

- 启动nginx、php-fpm、mariadb

        systemctl start nginx
        systemctl start php-fpm
        systemctl start mariadb

- 设置防火墙开放tcp80和tcp3306端口

        firewall-cmd --zone=public --add-port=80/tcp --permanent
        firewall-cmd --zone=public --add-port=3306/tcp --permanent
        firewall-cmd --reload

# 使用

## nginx
- 浏览器访问服务器ip

![](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1593924883.jpg)

## mysql

- 设置mysql数据库root账号密码

        mysqladmin -uroot  password  'your password'

- root账号登陆mysql

        mysql -uroot -p

- 创建一个新用户web，密码为123456，授权远程计算机使用账号web登陆数据库，并立刻刷新权限  

        MariaDB[(none)]>grant all on *.* to 'web'@'%'  identified by '123456';
        MariaDB[(none)]>flush privileges;

- 退出mysql数据库
    
        MariaDB[(none)]> quit; 

![](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1593925030.jpg)    

## php
- 创建文件index.php

        touch /usr/share/nginx/html/index.php
        echo  "<?php  phpinfo();  ?>" > /usr/share/nginx/html/index.php

- 重启nginx服务，使用浏览器访问服务器ip

        systemctl restart  nginx        


![](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1593924755.jpg)        