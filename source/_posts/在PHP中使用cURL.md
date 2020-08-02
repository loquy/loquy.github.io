---
title: 在PHP中使用cURL
tags:
  - PHP
  - cURL
categories: PHP
index_img: https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/img/curl.png
abbrlink: b4a5aa5
date: 2020-06-10 17:15:08
---
# 什么是cURL

- 先来看下维基百科的解释：

        cURL是一个开源项目，主要的产品是curl（命令行工具）和libcurl（C语言的API库），两者功能均是：基于网络协议，对指定URL进行网络传输。

        cURL涉及是任何网络协议传输，不涉及对具体数据的具体处理。（如：html的渲染等）

- 简单讲就是我们不用浏览器，在curl命令行工具就可以访问任意网址

- PHP中集成了cURL库，那么我们就可以在代码上使用它的功能

# 在PHP中使用cURL

  使用 cURL 函数的基本思想是先使用 **curl_init()** 初始化 cURL会话，接着可以通过 **curl_setopt()** 设置需要的全部选项，然后使用 **curl_exec()** 来执行会话，当执行完会话后使用 **curl_close()** 关闭会话

  - 其中最需要我们配置的是curl_setopt()这步,我们来看下这个函数的说明

  ```php
    /**
    *  为 cURL 会话句柄设置选项。
    *  @param resource $ch 返回的 cURL 句柄
    *  @param int $option 需要设置的CURLOPT_XXX选项。
    *  @param mixed $value 将设置在option选项上的值，可以接收多种类型的参数。
    *  @return bool 成功时返回 TRUE， 或者在失败时返回 FALSE 
    */
    curl_setopt( resource $ch, int $option, mixed $value) : bool

    /*
     * 为 cURL 传输会话批量设置选项
     * @param resource $ch 返回的 cURL 句柄
     * @param array $options 一个 array 用来确定将被设置的选项及其值。数组的键值必须是一个有效的curl_setopt()常量或者是它们对等的整数值。 
     */
    curl_setopt_array( resource $ch, array $options) : bool
  ```
  - [option参数选项和值具体看官方文档，用的时候在查询](https://www.php.net/curl_setopt)

  - 我们看下官方文档中使用cURL发送POST和GET封装后的函数
  
  ```php 
      /** 
      * Send a POST requst using cURL                              
      * @param string $url to request 
      * @param array $post values to send 
      * @param array $options for cURL 
      * @return string 
      */ 
      function curl_post($url, array $post = array(), array $options = array()) 
      { 
          $defaults = array( 
              CURLOPT_POST => 1, // 发送 POST 请求
              CURLOPT_HEADER => 0, // 启用时会将头文件的信息作为数据流输出，这边不启用。 
              CURLOPT_URL => $url, // 需要获取的 URL 地址，也可以在curl_init() 初始化会话的时候
              CURLOPT_FRESH_CONNECT => 1, // 强制获取一个新的连接，而不是缓存中的连接
              CURLOPT_RETURNTRANSFER => 1, // 将curl_exec()获取的信息以字符串返回，而不是直接输出。
              CURLOPT_FORBID_REUSE => 1, // 在完成交互以后强制明确的断开连接，不能在连接池中重用
              // CURLOPT_TIMEOUT => 10, // 允许 cURL 函数执行的最长秒数，这边先不限制
              CURLOPT_POSTFIELDS => http_build_query($post), // 全部数据使用HTTP协议中的 "POST" 操作来发送，http_build_query返回一个 URL 编码后的字符串
              // 以下两个设置是为了防止访问没有SSL证书的网站报错
              CURLOPT_SSL_VERIFYPEER => 0, // 禁止 cURL 验证对等证书（peer'scertificate）。要验证的交换证书可以在 CURLOPT_CAINFO 选项中设置，或在 CURLOPT_CAPATH中设置证书目录。
              CURLOPT_SSL_VERIFYHOST => 0 // 设置为 1 是检查服务器SSL证书中是否存在一个公用名, 0 为不检查名称
          ); 

          $ch = curl_init(); 
          curl_setopt_array($ch, ($options + $defaults));
          if( ! $result = curl_exec($ch)) 
          { 
              trigger_error(curl_error($ch)); 
          } 
          curl_close($ch); 
          return $result; 
      } 

      /** 
      * Send a GET requst using cURL 
      * @param string $url to request 
      * @param array $get values to send 
      * @param array $options for cURL 
      * @return string 
      */ 
      function curl_get($url, array $get = array(), array $options = array()) 
      {    
          $defaults = array( 
              CURLOPT_URL => $url. (strpos($url, '?') === FALSE ? '?' : ''). http_build_query($get), // 需要获取的 URL 地址，也可以在curl_init() 初始化会话的时候。 
              CURLOPT_HEADER => 0, // 启用时会将头文件的信息作为数据流输出。 
              CURLOPT_RETURNTRANSFER => TRUE, 
              // CURLOPT_TIMEOUT => 10,
              CURLOPT_SSL_VERIFYPEER => 0, 
              CURLOPT_SSL_VERIFYHOST => 0            
          ); 
          
          $ch = curl_init(); 
          curl_setopt_array($ch, ($options + $defaults)); 
          if( ! $result = curl_exec($ch)) 
          { 
              trigger_error(curl_error($ch)); 
          } 
          curl_close($ch); 
          return $result; 
      }
  ```
# 发送GET/POST请求到接口交互数据

- 首先我们得有个运行PHP的环境，我这边使用phpStudy

- 其次在站点域名那里配置我们测试的demo的域名

![phpStudy](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1591845702.jpg)
- 以下为测试demo
  
  新建两个php文件：一个是提供数据的接口，创建一个数组然后转成json格式输出到浏览器；另个是使用curl获取数据的接口，使用上面封装好的curl_get和curl_post函数获取数据。

```php
  <?php
  /**
   * 提供数据的类，
   */
  class Data
  {
      public function creatData()
      {
          $data = ['car'=>'Benz','book'=>'Little Prince','house'=>'The Ocean Villas'];
          echo json_encode($data);
      }
  }

  $data = new Data;
  $data->creatData();
```

```php
  <?php
  /**
  * 获取数据的类
  */
  class GetData
  {
      public $url = 'http://127.0.0.1:1000/data.php';

      public function test_curl_get()
      {
          $result = $this->curl_get($this->url);
          var_dump(json_decode($result,true));
      }

      public function test_curl_post()
      {
          $result = $this->curl_post($this->url);
          var_dump(json_decode($result,true));
      }
      
      /**
      * Send a POST requst using cURL
      * @param string $url to request
      * @param array $post values to send
      * @param array $options for cURL
      * @return string
      */
      public function curl_post($url, array $post = array(), array $options = array())
      {
          $defaults = array(
              CURLOPT_POST => 1, // 发送 POST 请求
              CURLOPT_HEADER => 0, // 启用时会将头文件的信息作为数据流输出，这边不启用。
              CURLOPT_URL => $url, // 需要获取的 URL 地址，也可以在curl_init() 初始化会话的时候
              CURLOPT_FRESH_CONNECT => 1, // 强制获取一个新的连接，而不是缓存中的连接
              CURLOPT_RETURNTRANSFER => 1, // 将curl_exec()获取的信息以字符串返回，而不是直接输出。
              CURLOPT_FORBID_REUSE => 1, // 在完成交互以后强制明确的断开连接，不能在连接池中重用
              // CURLOPT_TIMEOUT => 10, // 允许 cURL 函数执行的最长秒数，这边先不限制
              CURLOPT_POSTFIELDS => http_build_query($post), // 全部数据使用HTTP协议中的 "POST" 操作来发送，http_build_query返回一个 URL 编码后的字符串
              // 以下两个设置是为了防止访问没有SSL证书的网站报错
              CURLOPT_SSL_VERIFYPEER => 0, // 禁止 cURL 验证对等证书（peer'scertificate）。要验证的交换证书可以在 CURLOPT_CAINFO 选项中设置，或在 CURLOPT_CAPATH中设置证书目录。
              CURLOPT_SSL_VERIFYHOST => 0 // 设置为 1 是检查服务器SSL证书中是否存在一个公用名, 0 为不检查名称
          );

          $ch = curl_init();
          curl_setopt_array($ch, ($options + $defaults));
          if (! $result = curl_exec($ch)) {
              trigger_error(curl_error($ch));
          }
          curl_close($ch);
          return $result;
      }

      /**
      * Send a GET requst using cURL
      * @param string $url to request
      * @param array $get values to send
      * @param array $options for cURL
      * @return string
      */
      public function curl_get($url, array $get = array(), array $options = array())
      {
          $defaults = array(
              CURLOPT_URL => $url. (strpos($url, '?') === false ? '?' : ''). http_build_query($get), // 需要获取的 URL 地址，也可以在curl_init() 初始化会话的时候。
              CURLOPT_HEADER => 0, // 启用时会将头文件的信息作为数据流输出。
              CURLOPT_RETURNTRANSFER => true,
              // CURLOPT_TIMEOUT => 10,
              CURLOPT_SSL_VERIFYPEER => 0,
              CURLOPT_SSL_VERIFYHOST => 0
          );
          
          $ch = curl_init();
          curl_setopt_array($ch, ($options + $defaults));
          if (! $result = curl_exec($ch)) {
              trigger_error(curl_error($ch));
          }
          curl_close($ch);
          return $result;
      }
  }

  $GetData = new GetData;
  $GetData->test_curl_get();
  $GetData->test_curl_post();

```

- 在浏览器访问写好的demo

![phpStudy](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1591846206.jpg)

![phpStudy](https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/images/1591846227.jpg)

**到此便使用curl成功获取到数据**









