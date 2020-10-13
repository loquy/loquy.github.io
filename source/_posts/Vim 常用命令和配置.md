---
title: Vim 常用命令和配置
abbrlink: 3f5e4d56
date: 2020-10-12 23:00:00
tags:
    - Vim
    - Linux
categories: Linux
index_img: https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/Vim.png
description: Vim
---
# 模式
在其他模式下使用 `Esc` 切换回普通模式，命令行模式下使用 `:命令` + `Enter` 执行命令。

 命令 | 模式 | 描述 
 :---|:---|:---
 `默认`       | 普通模式    | 控制光标移动，可对文本进行复制、粘贴等操作
 `i`          | 插入模式    | 写入和编辑文本
 `:`          | 命令行模式  | 保存或退出文本等，设置 Vim 的配置项
 `v`          | 可视模式    | 配合方向键选取某一块文本区域，像使用鼠标一样

# 命令
注意 `n` 为数字，`+` 表示组合使用，其他的字符对应键盘上的按键。

1. 普通模式：

    常用的光标移动命令。

    命令 | 描述
    :---|:---
    `n + h` 或 `n + ←`  | 光标左移 n 个位置 
    `n + l` 或 `n + →`  | 光标右移 n 个位置 
    `n + j` 或 `n + ↓`  | 光标下移 n 个位置 
    `n + k` 或 `n + ↑`  | 光标上移 n 个位置 
    `ctrl + f`  | 向下滚动一屏
    `ctrl + b`  | 向上滚动一屏
    `ctrl + d`  | 向下滚动半屏
    `ctrl + u`  | 向上滚动半屏
    `0`         | 跳到首行，可以理解为无穷大的h
    `^`         | 跳到行首开始的第一个非空白字符
    `$`         | 跳到行尾，可以理解为无穷大的l
    `gg` 或 `1 + G`| 跳到首行，可以理解为无穷大的k
    `G`         | 跳到末行，可以理解为无穷大的j
    `w`         | 跳到下一个词首
    `b`         | 跳到上一个词首
    `e`         | 跳到下一个词尾
    `ge`        | 跳到上一个词尾
    `H`         | 移动到屏幕的最上方那一行的第一个字符
    `M`         | 移动到屏幕的最中央那一行的第一个字符
    `L`         | 移动到屏幕的最下方那一行的第一个字符
    `n + Enter` | 光标向下移动 n 行
    `c`         | 删除当前光标后面的部分. 进入插入模式
    `cc`        | 将当前行替换为空行，进入插入模式
    `cw`        | 删除当前单词的光标右侧部分，进入插入模式
    `s`         | 删除当前字母，进入插入模式
    `r`         | 替换当前字母，输入一个字母后自动返回普通模式
    `a`         | 在光标右侧插入文本
    `A`         | 在行末插入文本
    `i`         | 在光标左侧插入文本
    `I`         | 在行首插入文本
    `o`         | 在光标下插入新行
    `O`         | 在光标上插入新行
    `n`         | 跳转下一个搜索词
    `N`         | 跳转上一个搜索词

    常用的复制、黏贴、删除、撤销、查找等操作。

    命令 | 描述 
    :---|:---
    `n + x`    | 剪切（删除）光标右边n个字符 
    `n + X`    | 剪切（删除）光标左边n个字符 
    `y`        | 复制在可视模式下选中的文本
    `y + n`    | 复制在可视模式下选中的文本
    `yy`       | 复制光标所在整行
    `n + yy`     | 复制光标所在的向下 n 行
    `y + n + w`  | 复制1(n)个词
    `y + n + l`  | 复制光标右边1(n)个字符
    `y + n + h`  | 复制光标左边1(n)个字符
    `y + $`      | 从光标当前位置复制到行尾
    `y + 0`      | 从光标当前位置复制到行首
    `y + 0`      | 从光标当前位置复制到行首。
    `y + 1 + G` 或 `y + gg` | 复制光标以上的所有行
    `d`        | 剪切（删除）在可视模式下选中的文本
    `dd`       | 剪切（删除）光标所在整行
    `n + dd`     | 剪切（删除）光标所在的向下 n 行
    `d + n + w`  | 剪切（删除）1(n)个词
    `d + n + l`  | 剪切（删除）光标右边1(n)个字符
    `d + n + h`  | 剪切（删除）光标左边1(n)个字符
    `d + $`      | 从光标当前位置剪切（删除）到行尾
    `d + 0`      | 从光标当前位置剪切（删除）到行首
    `d + 1 + G` 或 `d + gg` | 剪切（删除）光标以上的所有行
    `d + G`    | 剪切光标以下的所有行
    `p`        | 粘贴光标上一行
    `P`        | 粘贴到光标下一行
    `u`        | 撤销
    `ctrl + r` | 恢复上一步撤销

2. 命令行模式：

    命令 | 描述
    :---|:---
    `:w`            | 保存
    `:q`            | 退出
    `:wq` 或 `ZZ`   | 保存退出
    `:q!` 或 `ZQ`   | 强制退出（放弃对文档的修改内容）
    `:wq!`          | 强制保存退出
    `:set nu`       | 显示行号
    `:set nonu`     | 不显示行号
    `:整数`          | 跳转到该行
    `?字符串`	     | 在文本中从下至上搜索该字符串
    `/字符串`	     | 在文本中从上至下搜索该字符串
    `:s/one/two`	| 将当前光标所在行的第一个one替换成two
    `:s/one/two/g`	| 将当前光标所在行的所有one替换成two
    `:%s/one/two/g` | 将全文中的所有one替换成two
    `:m,ny<cr>`     | 复制m行到n行的内容
    `:m,nd<cr>`     | 剪切（删除）m行到n行的内容
    `:help 命令`     | 查看命令帮助信息

# 配置
1. Vim 的全局配置一般在`/etc/vim/vimrc或者/etc/vimrc`，对所有用户生效。用户个人的配置在`~/.vimrc`。

2. 配置项一般都有"打开"和"关闭"两个设置。"关闭"就是在"打开"前面加上前缀"no"，双引号开始的行表示注释。

3. 加上 `:` 可在命令行模式运行，一些常用配置：
    ```vim
        " 显示行号
        set number

        " 不显示行号
        set nonumber

        " 不与 Vi 兼容（采用 Vim 自己的操作命令）
        set nocompatible

        " 打开语法高亮。自动识别代码，使用多种颜色显示。
        syntax on

        " 在底部显示，当前处于普通模式还是插入模式。
        set showmode

        " 普通模式下，在底部显示，当前键入的指令。
        set showcmd

        " 支持使用鼠标。
        set mouse=a

        " 使用 utf-8 编码。
        set mouse=a

        " 启用256色。
        set t_Co=256

        " 启文件类型检查，并且载入与该类型对应的缩进规则。
        filetype indent on

        " 按下回车键后，下一行的缩进会自动跟上一行的缩进保持一致。
        set autoindent

        " Tab 转为多少个空格。
        set softtabstop=2

        " 设置行宽，即一行显示多少个字符。
        set textwidth=80

        " 光标所在的当前行高亮。
        set cursorline

        " 自动折行，即太长的行分成几行显示。
        set wrap

        " 输入搜索模式时，每输入一个字符，就自动跳到第一个匹配的结果。
        set incsearch

        " 搜索时，高亮显示匹配结果。
        set hlsearch

        " 搜索时忽略大小写。
        set ignorecase

        " 递归的按键映射，按 a 和 c 等于按 b。
        :map a b
        :map c a
    
        " 非递归的按键映射，表示按 d 等于按 a。
        :noremap d a
    ```

# 插件
1. Unix 安装 [vim-plus](https://github.com/junegunn/vim-plug)（一个极简的Vim插件管理器）：

        curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
        https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

2. 配置：

    在~/.vimrc中添加要下载的vim插件，然后重启。    
    ```vim
        " 开始标签

        call plug#begin('~/.vim/plugged')

        " 单引号内些上你需要安装的插件

            Plug 'xxx'

        " 结束标签

        call plug#end()
    ```

3. 使用和卸载：

    在命令行模式输入命令使用插件。

    命令 | 描述
    :---|:---
    `:PlugInstall [name ...] [#threads]` | 安装插件
    `:PlugUpdate [name ...] [#threads]` | 安装或更新插件
    `:PlugClean[!]` | 删除未列出的插件
    `:PlugUpgrade`	 | 升级vim-plug
    `:PlugStatus`	 | 检查插件状态
    `:PlugDiff`	 | 检查来自先前更新的更改以及未决的更改
    `:PlugSnapshot[!] [output path]` | 生成脚本以还原插件的当前快照

    更多插件参见 [vim Awesome](https://vimawesome.com)。

# 参考
 - [Vim编辑器与Shell命令脚本](https://www.linuxprobe.com/chapter-04.html)
 - [Linux vi/vim](https://www.runoob.com/linux/linux-vim.html)
 - [史上最全的Vim命令](https://zhuanlan.zhihu.com/p/51440836)
 - [Vim 配置入门](http://www.ruanyifeng.com/blog/2018/09/vimrc.html)
 - [vim-plus](https://github.com/junegunn/vim-plug)
 - [vim Awesome](https://vimawesome.com)
 - [Vim 入门教程](https://github.com/vim-china/hello-vim/blob/master/quick-start-guide.md)