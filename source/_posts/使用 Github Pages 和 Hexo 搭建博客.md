---
title: 使用 Github Pages 和 Hexo 搭建博客
tags:
  - Github Pages
  - Hexo
  - 博客搭建
categories: 博客搭建
index_img: https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/img/h&g.jpg
abbrlink: 3b0a6c12
date: 2020-05-26 15:59:13
---
# 项目简介
当前项目是使用 [Github Pages](https://pages.github.com/) 和 [Hexo](https://Hexo.io/zh-cn/docs/) 搭建的静态博客

    Github Pages是 GitHub 提供的一个网页寄存服务，于2008年推出。
    可以用于存放静态网页，包括博客、项目文档甚至整本书。
    Jekyll 软件可以用于将文档转换成静态网页，该软件提供了将网页上传到 Github Pages 的功能。
    一般 Github Pages 的网站使用 github.io 的子域名，但是用户也可以使用第三方域名。

    Hexo 是一个快速、简洁且高效的博客框架。
    Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

- 首先搭建 Github Pages
- 然后使用 Hexo 部署到 Github 远程仓库

## Github Pages的搭建方式
如果之前未使用过 Git，可以学习，[Git 小白教程](http://rogerdudler.github.io/git-guide/index.zh.html)
- 创建名为 username.github.io 的仓库，username 是你的 github 的用户名，不是昵称
- 克隆到本地 
    git clone https://github.com/username/username.github.io
- 进入文件夹创建 index.html 文件
- 推送到 github 远程仓库
    git add --all
    git commit -m "Initial commit"
    git push -u origin master
- 搭建完成，在浏览器打开 https://username.github.io 即可访问

# Hexo安装

##### 安装前提
安装 hexo 相当简单，只需要先安装下列应用程序即可：
- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

##### 安装 Hexo
所有必备的应用程序安装完成后，即可使用 npm 安装 hexo。

    $ npm install -g hexo-cli

对于熟悉 npm 的进阶用户，可以仅局部安装 Hexo 包。

    $ npm install hexo
    
##### 新建一个网站和启动服务器运行

    $ hexo init <folder> 如果没有设置 folder hexo 默认在目前的文件夹建立网站

    $ hexo server 简写 $ hexo s 默认情况下，访问网址为： http://localhost:4000/

##### 部署到 Github Pages
- 编辑 **_config.yml** 配置文件

        deploy:
            type: git
            repo: https://github.com/username/username.github.io.git
            branch: master  

- **hexo generate** 生成静态文件。
- **hexo deploy**
- 以上两步可以简写为 **hexo g -d** 或 **hexo d -g**


# Hexo 目录结构
    .
    ├── _config.yml 
    ├── package.json
    ├── scaffolds
    ├── source
    |   ├── _drafts
    |   └── _posts
    └── themes
    └── node_modules
    └── public
    └── .deploy_git

#### _config.yml
[Hexo配置文件](https://Hexo.io/zh-cn/docs/configuration)

#### package.json
应用程序的信息

#### scaffolds
模版件夹。当您新建文章时，Hexo 会根据 scaffold 来建立文件。Hexo 的模板是指在新建的文章文件中默认填充的内容。

#### source
资源文件夹是存放用户资源的地方。除 _posts 文件夹之外，开头命名为 _ (下划线)的文件 / 文件夹和隐藏的文件将会被忽略。Markdown 和 HTML 文件会被解析并放到 public 文件夹，而其他文件会被拷贝过去。

#### themes
主题文件夹。Hexo 会根据主题来生成静态页面。

#### 特殊目录
- node_modules， **npm install hexo** 生成的包和依赖
- public ，**hexo g** 部署之前预先生成的静态文件
- .deploy_git， **hexo d** 部署提交到 git 主干的目录

# Hexo发布文章
- 创建文章 **hexo new "article title"**
- 本地预览 **hexo server**
- 部署网站 **hexo g -d** 或 **hexo d -g**

# 多台电脑同步 Hexo 版本
**问题：远程仓库存的是静态文件，换电脑就无法使用 hexo**
**解决思路：创建分支管理 hexo 源代码**

- 克隆 username.github.io 仓库到本地

        git clone https://github.com/username/username.github.io.git

- 除 git 外的文件都删掉

- 整个 hexo 文件复制过来

- 切换并创建一个叫 hexo 的分支

        git checkout -b Hexo

- 提交到 hexo 分支

        git add .
        git commit -m "新建分支"
        git remote add origin https://github.com/username/username.github.io.git
        git push -u origin hexo