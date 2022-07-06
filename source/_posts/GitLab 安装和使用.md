---
title: GitLab 安装和使用
tags:
  - Git
  - GitLab
categories: 
  - [编程, Git] 
category_bar: [Git]
index_img: 'https://www.loquy.cn/images/GitLab.png'
abbrlink: e2e5d3b3
date: 2021-07-01 09:27:14
updated: 2021-07-01 14:12:10
---
# 环境

[GitLab 官方安装要求](https://docs.gitlab.com/ee/install/requirements.html)
    
    系统：可自由选择，我虚拟机上的是 CentOS Stream release 8

    CPU：4 核是建议的最低核数，最多支持 500 个用户

    内存：4GB RAM 是所需的最小内存大小，最多支持 500 个用户

    硬盘：必要的硬盘空间在很大程度上取决于您要存储在 GitLab 中的存储库的大小，但根据经验，您应该拥有至少与所有存储库组合占用的空间一样多的可用空间

# 安装

- 安装和配置必要的依赖项

``` bash
sudo dnf install -y curl policycoreutils openssh-server perl
sudo systemctl enable sshd
sudo systemctl start sshd

# Check if opening the firewall is needed with: sudo systemctl status firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld
```

- 下载 gitlab-ce 社区版的 [rpm](https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el8/) 包

``` bash
rpm -ivh gitlab-ce-12.10.0-ce.0.el8.x86_64.rpm
```

- 修改 gitlab 默认配置


    编辑 /etc/gitlab/gitlab.rb 搜索 external_url 

    把后面的地址修改为你自己的域名或者 IP，是单引号，而且前面的 http 不要改

    默认填写 http:// 加上本机 IP 即可，如需自定义域名需加入到 /etc/hosts 中

``` bash
vim /etc/gitlab/gitlab.rb
```

- 重新加载配置后重启 gitlab

``` bash
gitlab-ctl reconfigure
gitlab-ctl restart
```

# 使用

## 初始化账户与创建仓库

    打开浏览器输入配置的 external_url

    进行初始化账户设定密码，这个密码为 root 管理员账户的密码

    设置完密码之后会自动跳转到登录页面

    可以使用 root 登录，也可以在登录界面创建一个账户登录，登录后创建仓库

## 安装 Git 后配置 SSH-Key

- 安装 [Git](https://git-scm.com/book/zh/v2) 安装后设置你的用户名和邮件地址

``` bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

- 在 Git Bash 上生成 SSH-Key

``` bash
ssh-keygen -t rsa -C 'email' -f ~/.ssh/local_gitlab_rsa
```

- 在 ~/.ssh 目录下新建一个 config 文件

``` 
#gitlab
HostName gitlab 的主机 IP
IdentityFile  ~/.ssh/local_gitlab_rsa
```

- 添加秘钥


    点击右上角头像，Settings -> SSH 

    把刚刚生成的 ~/.ssh/local_gitlab_rsa.pua 文件的内容粘贴上

    添加一个 Title，然后 Add Key

- Git 工作流

``` 
git clone
git add
git commit
git push
git pull
...
```

# 参考
- [GitLab 官方安装文档](https://about.gitlab.com/install/#centos-8)
- [GitLab 官方安装要求](https://docs.gitlab.com/ee/install/requirements.html)
- [Git Book](https://git-scm.com/book/zh/v2)
- [清华大学镜像](https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el8/)
- [GitLab 安装与基础使用](https://cloud.tencent.com/developer/article/1728804)
- [Git 配置多个 SSH-Key](https://gitee.com/help/articles/4229#article-header0)
