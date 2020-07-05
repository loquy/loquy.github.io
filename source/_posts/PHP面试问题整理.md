---
title: PHP面试问题整理
tags: 
- PHP
- 面试
categories:
- [PHP]
- [面试]
abbrlink: babcce42
date: 2020-06-25 10:05:23
index_img: /images/php_logo.png
---
# PHP的生命周期是什么？

PHP生命周期有5个阶段：

- **模块初始化阶段** （module init） 
  - Zend引擎的初始化操作。SAPI、FPM（master 进程 ）启动，加载扩展、模块初始化 
- **请求初始化阶段** （request init） 
  - FPM里worker进程接收一个请求并读取请求数据，PHP初始化本次请求所需的环境变量
- **PHP脚本执行阶段**
  - Zend引擎接将PHP代码编译成opcodes并顺次执行
- **请求关闭阶段** （request shutdown） 
  - 按顺序调用各个模块的RSHUTDOWN方法，对每个变量调用unset函数
- **模块关闭阶段** （module shutdown） 
  - SAPI关闭，进行资源的清理，关闭各个模块，关闭FPM

# 数据库事务的理解 ？

 [数据库](https://baike.baidu.com/item/数据库/103728)事务( transaction)是访问并可能操作各种[数据项](https://baike.baidu.com/item/数据项/3227309)的一个数据库操作序列，这些操作要么全部执行,要么全部不执行，是一个不可分割的工作单位。事务由事务开始与事务结束之间执行的全部数据库操作组成。 

 - 原子性（Atomic）	
   -  事务`要么全部完成，要么全部取消`。 如果事务崩溃，状态回到事务之前（事务回滚）。 
 - 一致性（Consitency）
   - 只有合法的数据（依照关系约束和函数约束）才能写入数据库。
 - 隔离性（Isolation）
   - 如果2个事务 T1 和 T2 同时运行，事务 T1 和 T2 最终的结果是相同的，不管 T1和T2谁先结束。
 - 持久性（Durability）
   - 一旦事务提交，不管发生什么（崩溃或者出错），数据要保存在数据库中。


 # 数据库设计范式是什么 ？

- 第一范式（1NF）
  -  表中的列只能含有原子性(不可再分)的值。

- 第二范式（2NF）
  -  满足第一范式 ，没有部分依赖 

- 第三范式（3NF）
  -  满足第二范式，没有传递依赖  

# PHP Swoole是什么？

- php协程框架


  ```
  Swoole 使 PHP 开发人员可以编写高性能高并发的 TCP、UDP、Unix Socket、HTTP、 WebSocket 等服务，让 PHP 不再局限于 Web 领域。Swoole4 协程的成熟将 PHP 带入了前所未有的时期， 为性能的提升提供了独一无二的可能性。Swoole 可以广泛应用于互联网、移动通信、云计算、 网络游戏、物联网（IOT）、车联网、智能家居等领域。使用 PHP + Swoole 可以使企业 IT 研发团队的效率大大提升，更加专注于开发创新产品 
  ```



# PHP和Nginx怎么交互的？

Nginx+PHP的工程模式下，两位主角分工明确，Nginx负责承载HTTP请求的响应与返回，以及超时控制记录日志等HTTP相关的功能，而PHP则负责处理具体请求要做的业务逻辑，它们俩的这种合作模式也是常见的分层架构设计中的一种，在它们各有专注面的同时，FastCGI又很好的将两块衔接，保障上下游通信交互

- 发送HTTP请求Nginx接收
- Nginx解析到对应PHP文件
- 加载Nginx的 FastCGI 模块启动对应端口
- PHP-FPM监听对应端口，接收请求，启用worker进程处理
- PHP-FPM处理完请求，返回给Nginx

#  **MySQL** 存储引擎有什么？

 存储引擎其实就是对于数据库文件的一种存取机制  ，如何实现存储数据，如何为存储的数据建立索引以及   如何更新，查询数据等技术实现的方法。 

-  **InnoDB** 
   - 优点支持事务处理、崩溃修复能力和并发控制。缺点是读写效率较差，占用空间大。 
-  **MyISAM** 
   - 优点占用空间小，处理速度快。缺点是不支持事务的完整性和并发性。 
-  **MEMORY**
   - 所有的数据存储在内存中，关闭机器数据消失。 
-  **ARCHIVE**
   - 提供了压缩功能，拥有高效的插入速度，不支持索引，所查询性能较差 

# PHP 网页跳转的方式？

- header()函数;
 ```php 
header('location:http://www.baidu.com');
 ```
- meta标签
 ```php 
 echo '<meta http-equiv="refresh" content="1;url=http://www.baidu.com">';
 ```

- script标签;
 ```php 
 echo'<script>window.location.href="http://www.baidu.com"</script>';
 ```


# Redis有几种类型?

-  **String（字符串）** 
   -  一个 key 对应一个 value。 
   -  一个 key 最大能存储 512MB
   -  常用命令：set、get、decr、incr、mget
-  **Hash（哈希）** 
   -  键值(key=>value)对集合，是一个 string 类型的 field 和 value 的映射表， 特别适合用于存储对象
   -  每个 hash 可以存储2<sup>32</sup>  - 1键值对（40多亿）
   -  常用命令：hget、hset、hgetall
-  **List（列表）** 
   - 字符串列表，按照插入顺序排序。可以添加一个元素到列表的头部（左边）  或者尾部（右边）
   - 列表最多可以包含2<sup>32</sup>  - 1个元素 (40多亿)
   - list类型经常会被用于消息队列的服务，以完成多程序之间的消息交换
   - 常用命令：lpush、rpush、lpop、rpop、lrange
-  **Set（集合）** 
   - Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据
   - 集合中最大的成员数为 2<sup>32</sup> - 1 (40多亿)
   - 常用命令：sadd、spop、smembers、sunion
-  **Sorted Set（有序集合)** 
   - 有序集合和集合一样也是string类型元素的集合,且不允许重复的成员
   - 不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序
   - 有序集合的成员是唯一的,但分数(score)却可以重复  
   - 集合中最大的成员数为 2<sup>32</sup> - 1 (40多亿)
   - 常用命令：zadd、zrange、zrem、zcard

# PHP数组在底层怎么实现的？

 HashTable是zend的核心数据结构，在PHP里面几乎并用来实现所有常见功能，我们知道的PHP数组即是其典型应用，此外，在zend内部，如函数符号表、全局变量等也都是基于hash table来实现 

- 散列表（hashTable） 具有如下特点 
  - 支持典型的key->value查询
  - 可以当做数组使用
  - 添加、删除节点是O(1)复杂度
  - key支持混合类型：同时存在关联数组合索引数组
  - Value支持混合类型：array("string",2332)
  - 支持线性遍历：如foreach



# 微信授权登录的流程？

- 调用 [wx.login()](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html) 获取 **临时登录凭证code** ，并回传到开发者服务器。
- 调用 [auth.code2Session](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html) 接口，换取 **用户唯一标识 OpenID** 和 **会话密钥 session_key**。
- 具体思路如下

  - 在main.js 中封装公共函数，用于判断用户是否登录
  - 在main.js 中分定义全局变量，用于存储接口地址
  - 如果没有登录、则跳转至登录页面
  - 进入登录页面
  - 通过 wx.login 获取用户的 code
  - 通过 code 获取用户的 SessionKey、OpenId 等信息
  - 通过 openId 调用后台 Api 获取用户的信息
  - 获取成功，则说明已经授权过了,直接登录成功
  - 获取失败，则说明没有授权过，需要授权之后才能进行登录
  - 用户点击页面微信登录按钮 open-type="getUserInfo"
  - 获取用户数据，然后调用后台接口写入数据库

#  什么是消息队列 (Message Queue) ？

- 从本质上说消息对列就是一个队列结构的中间件，也就是说消息放入这个中间件之后就可以直接返回，并不需要系统立即处理，而另外会有一个程序读取这些数据，并按顺序进行逐次处理。
- 它有三个好处

    - **异步**
        - 用户注册后，需要发注册邮件和注册短信。传统的做法有两种 1.串行的方式；2.并行方式
        - 串行方式：将注册信息写入数据库成功后，发送注册邮件，再发送注册短信。以上三个任务全部完成后，返回给客户端
        - 并行方式：将注册信息写入数据库成功后，发送注册邮件的同时，发送注册短信。以上三个任务完成后，返回给客户端。
        - 消息队列：将注册信息写入数据库成功后，写入消息队列，异步读取需要发送的邮件和短信

    - **解耦**
        - 订单系统：用户下单后，订单系统完成持久化处理，将消息写入消息队列，返回用户订单下单成功
        - 库存系统：订阅下单的消息，采用拉/推的方式，获取下单信息，库存系统根据下单信息，进行库存操作
        - 假如：在下单时库存系统不能正常使用。也不影响正常下单，因为下单后，订单系统写入消息队列就不再关心其他的后续操作了。实现订单系统与库存系统的应用解耦 

    - **削峰/限流**
        - 秒杀活动，一般会因为流量过大，导致流量暴增，应用挂掉。为解决这个问题，一般需要在应用前端加入消息队列
        - 可以控制活动的人数，缓解短时间内高流量压垮应用  
        - 用户的请求，服务器接收后，首先写入消息队列。假如消息队列长度超过最大数量，则直接抛弃用户请求或跳转到错误页面 
        - 秒杀业务根据消息队列中的请求信息，再做后续处理 


- 使用PHP的数组函数**array_push、array_shift**实现一个队列

```php 
<?php

class QueueArray
{
    public $arr = array();
    
    public function tailEnqueue($val)
    {
        return array_push($this->arr, $val); // 队尾入队
    }
    
    public function tailDequeue()
    {
        return array_pop($this->arr); // 队尾出队
    }
    
    public function headEnqueue($val)
    {
        return array_unshift($this->arr, $val); // 队首入队
    }
    
    public function headDequeue()
    {
        return array_shift($this->arr); //队首出队
    }
    
    public function length()
    {
        return count($this->arr); // 队列长度
    }
    
    public function head()
    {
        return reset($this->arr); // 获取队首元素
    }
    
    public function tail()
    {
        return end($this->arr); // 获取队尾元素
    }
    
    public function clear()
    {
        unset($this->arr); // 清空队列
        return true;
    }
}
```









