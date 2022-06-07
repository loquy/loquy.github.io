---
title: 在 PHP 中使用单元测试
tags:
  - 单元测试
  - PHPUnit
categories: PHP
description: Use unit tests in PHP
abbrlink: ef77815d
date: 2021-05-30 08:17:04
index_img: https://www.loquy.cn/images/unit_testing.jpg
---
# 相关概念
- `单元测试`
单元测试是针对程序的最小单元进行测试，方法、类等都可以是一个单元，根据实际情况判定，一般指的是方法。
- `断言`
在程序设计中，断言（assertion）是一种放在程序中的一阶逻辑（如一个结果为真或是假的逻辑判断式），目的是为了标示与验证程序开发者预期的结果－当程序运行到断言的位置时，对应的断言应该为真。若断言不为真时，程序会中止运行，并给出错误消息。
- `PHPUnit` 
是一个轻量级的 PHP 测试框架

# PHPUnit 的安装和配置
目前支持的版本是PHPUnit 9

## [安装](https://phpunit.de/getting-started/phpunit-9.html)

### PHP 档案包（PHAR）
    ➜ wget -O phpunit https://phar.phpunit.de/phpunit-9.phar

    ➜ chmod +x phpunit

    ➜ ./phpunit --version
    PHPUnit 9.0.0 by Sebastian Bergmann and contributors.

### Composer 
    ➜ composer require --dev phpunit/phpunit ^9

    ➜ ./vendor/bin/phpunit --version
    PHPUnit 9.0.0 by Sebastian Bergmann and contributors.

## 配置

### [XML 配置文件](https://phpunit.readthedocs.io/zh_CN/latest/configuration.html)
用于编排测试套件，示例如下：
```xml
<phpunit bootstrap="./bootstrap.php"
         colors="true"
         verbose="true"
>

    <php>
        <ini name="error_reporting" value="-1"/>
    </php>

    <testsuites>
        <testsuite name="test">
            <directory>./Tests/</directory>
        </testsuite>
    </testsuites>

</phpunit>
```

### Bootstrap 启动文件
在启动 PHPUnit 时会加载的文件，用于自动加载依赖等，示例如下：
```php
<?php

$classNameMap = [
    'single' => __DIR__ . DIRECTORY_SEPARATOR . 'single',
];

spl_autoload_register(function($className) use ($classNameMap) {
    $position = strpos($className, '\\');
    if ($position) {
        $namespace = substr($className, 0, $position);
        $directory = $classNameMap[$namespace] ?? '';
        if ($directory) {
            $classFile = $directory . substr($className, $position) . '.php';
            is_file($classFile) && require $classFile;
        }
    }
});
```
### 在 PhpStorm 里配置使用
- 文件 -> 设置 -> PHP，设置 cli 解释器。
- 文件 -> 设置 -> PHP -> 测试框架，设置 phpunit.phar 路径或 composer 下的 phpunit 路径， 设置 xml 配置文件。
- 使用 IDE 自动帮我们执行 PHPUnit 的命令，便不用手动操作了，测试时只需点击文件里的执行按钮即可。

# 编写 PHPUnit 测试  

## 步骤
- 针对类 Class 的测试写在类 ClassTest 中。
- ClassTest（通常）继承自 PHPUnit\Framework\TestCase。
- 测试都是命名为 test* 的公用方法。
- 也可以在方法的文档注释块（docblock）中使用 @test 标注将其标记为测试方法。在测试方法内，类似于 assertSame()（[参见断言](https://phpunit.readthedocs.io/zh_CN/latest/assertions.html)）这样的断言方法用来对实际值与预期值的匹配做出断言。

## 示例
- 类
```php
<?php

namespace single;

class test
{
    public $attr;

    public function hello(): string
    {
        return 'hello';
    }
}
```
- 测试类
```php
<?php

use PHPUnit\Framework\TestCase;
use single\test;

final class Assert extends TestCase
{
    public function testIsTheContrastEqual()
    {
        $this->assertEquals('hello', (new test)->hello());
    }

    public function testIsThereAnyAttribute()
    {
        $this->assertClassHasAttribute('attr', test::class);
    }
}
```
- 执行结果
![execution](https://www.loquy.cn/images/PHPUnit.jpg)
