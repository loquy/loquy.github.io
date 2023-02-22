---
title: 在 Java 中使用 Hutool 进行数据加密和解密
category_bar:
  - Java
tags:
  - Java
  - SpringBoot
categories:
  - - 编程
    - Java
index_img: images/JavaCrypto.png
abbrlink: 3c28698d
description:
---
## 概述

加密分为三种：1、对称加密，又称为私钥加密、共享密钥加密，使用相同的密钥；2、 非对称加密，它需要两个密钥，一个是公开密钥，另一个是私有密钥；公钥用作加密，私钥则用作解密；3、摘要加密，无论用户输入什么长度的原始数据，经过计算后输出的密文都是固定长度的，不可逆。

hutool 针对这三种加密类型分别封装，并提供常用的大部分加密算法。我在此之上使用工厂模式针对这三种算法创建了一个加密和解密的模块，方便业务调用，可以根据需求继续添加其他算法，添加对象时实现共同的接口即可，以下为用到的算法：非对称加密：RSA 、SM2；对称加密：AES、DES、DESede、SM4；摘要算法：MD5、SHA-1、SHA-256、SM3。

## 依赖

在项目的 pom.xml 的 dependencies 中加入以下内容:

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.12</version>
</dependency>
```
国密算法中的 SM2、SM3、SM4 需要引入 Bouncy Castle 依赖

```xml
<dependency>
  <groupId>org.bouncycastle</groupId>
  <artifactId>bcprov-jdk15to18</artifactId>
  <version>1.69</version>
</dependency>
```

> 说明 bcprov-jdk15to18 的版本请前往 Maven 中央库搜索，查找对应 JDK 的最新版本。

## 接口

### 加密接口

接口 `Crypto` 提供加密和解密以及生成秘钥的方法。

#### 生成密钥（对）

创建一个名为 `Key` 的类，用于表示密钥。`Key` 类有两个构造函数，一个用于对称加密密钥，另一个用于非对称加密的公钥和私钥。密钥可以使用 `generateKey()` 方法生成。

对称加密密钥的生成使用 `SecureUtil.generateKey()` 方法，传入参数 `AlgorithmConstant.AES` 表示使用 AES 算法生成密钥。生成的密钥会被封装成 `SecretKey` 对象，然后作为参数传递给 `Key` 类的第一个构造函数，最终生成一个 `Key` 对象，其中包含了生成的密钥以及它们的 base64 编码形式。

非对称加密的公钥和私钥的生成使用 `SecureUtil.generateKeyPair()` 方法，传入参数 `AlgorithmConstant.RSA` 表示使用 RSA 算法生成密钥对。生成的密钥对会被封装成 `KeyPair` 对象，然后作为参数传递给 `Key` 类的第二个构造函数，最终生成一个 `Key` 对象，其中包含了生成的公钥和私钥以及它们的 base64 编码形式。

在 `Key` 类中，使用 `Base64` 类将密钥和密钥对的 byte 数组进行 base64 编码，然后存储在对应的字符串变量中，方便后续处理和传输。

1、秘钥：

```java
@Override
public Key generateKey() {
    return new Key(SecureUtil.generateKey(AlgorithmConstant.AES));
}
```

2、秘钥对：

```java
@Override
public Key generateKey() {
    return new Key(SecureUtil.generateKeyPair(AlgorithmConstant.RSA));
}
```

3、对于 `SecureUtil` 不支持使用 SM4 算法生成的秘钥可以这样获取：

```java
@Override
public Key generateKey() {
    return new Key(new SymmetricCrypto(AlgorithmConstant.SM4).getSecretKey());
}
```

4、自定义 `Key` 类：

```java
package crypto.model;

import cn.hutool.core.codec.Base64;

import javax.crypto.SecretKey;
import java.security.KeyPair;

/**
 * The type Key.
 *
 * @author loquy
 * @date 2023 /02/07 13:51
 */
public class Key {

    private SecretKey secretKey;
    
    private KeyPair keyPair;
    
    private String base64SecretKey;
    
    private String base64PrivateKey;
    
    private String base64PublicKey;
    
    public Key(SecretKey secretKey) {
        this.secretKey = secretKey;
        setBase64SecretKey(secretKey);
    }

    public Key(KeyPair keyPair) {
        this.keyPair = keyPair;
        setBase64PrivateKey(keyPair);
        setBase64PublicKey(keyPair);
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(SecretKey secretKey) {
        this.secretKey = secretKey;
    }

    public KeyPair getKeyPair() {
        return keyPair;
    }

    public void setKeyPair(KeyPair keyPair) {
        this.keyPair = keyPair;
    }

    public String getBase64SecretKey() {
        return base64SecretKey;
    }

    public void setBase64SecretKey(SecretKey secretKey) {
        this.base64SecretKey = Base64.encodeWithoutPadding(secretKey.getEncoded());
    }

    public String getBase64PrivateKey() {
        return base64PrivateKey;
    }

    public void setBase64PrivateKey(KeyPair keyPair) {
        this.base64PrivateKey = Base64.encodeWithoutPadding(keyPair.getPrivate().getEncoded());
    }

    public String getBase64PublicKey() {
        return base64PublicKey;
    }

    public void setBase64PublicKey(KeyPair keyPair) {
        this.base64PublicKey = Base64.encodeWithoutPadding(keyPair.getPublic().getEncoded());
    }
}

```

#### 对称算法

在 `SymmetricCrypto` 类的构造方法中，使用 `Base64.decode(secretKey)` 将 Base64 编码的密钥解码为字节数组，并作为参数传递给构造方法。然后，使用 `encryptHex` 方法对明文数据进行加密并以十六进制形式返回加密后的密文。

对于解密部分的代码，实现方法和加密部分非常相似。这里使用的是 `SymmetricCrypto` 类的 `decryptStr` 方法将十六进制的密文解密为明文，并指定解密后的编码格式为 UTF-8。

需要注意的是，代码中还有一个 `isBase64()` 方法，用于检查给定的密钥字符串是否是合法的 Base64 编码格式。如果密钥不是合法的 Base64 编码格式，会抛出异常。

```java
default String symmetricEncrypt(String data, String secretKey, String algorithm) throws Exception {
    isBase64(secretKey, "密钥");
    SymmetricCrypto symmetricCrypto = new SymmetricCrypto(algorithm, Base64.decode(secretKey));
    return symmetricCrypto.encryptHex(data);
}

default String symmetricDecrypt(String data, String secretKey, String algorithm) throws Exception {
    isBase64(secretKey, "密钥");
    SymmetricCrypto symmetricCrypto = new SymmetricCrypto(algorithm, Base64.decode(secretKey));
    return symmetricCrypto.decryptStr(data, CharsetUtil.CHARSET_UTF_8);
}
```

#### 非对称算法

`AsymmetricCrypto` 类的构造方法中传入指定算法名称和公钥参数，并调用 `encryptHex()` 方法对待加密的数据进行加密，最终返回加密后的十六进制字符串。

在解密过程中，首先使用 `isBase64()` 函数对私钥参数进行验证，确保其为 Base64 编码格式。接着，使用 `AsymmetricCrypto` 类的构造方法中传入指定算法名称和私钥参数，并调用 `decryptStr()` 方法对待解密的数据进行解密，最终返回解密后的字符串。

需要注意的是，这里的加密和解密使用的是不同的密钥，因此需要分别使用公钥和私钥。这种非对称加密方式相对对称加密更加安全，因为不同的密钥用于加密和解密，不易被攻击者破解。

```java

default String asymmetricEncrypt(String data, String publicKey, String algorithm) throws Exception {
    isBase64(publicKey, "公钥");
    AsymmetricCrypto asymmetricCrypto = new AsymmetricCrypto(algorithm, null, publicKey);
    return asymmetricCrypto.encryptHex(data, KeyType.PublicKey);
}

default String asymmetricDecrypt(String data, String privateKey, String algorithm) throws Exception {
    isBase64(privateKey, "私钥");
    AsymmetricCrypto asymmetricCrypto = new AsymmetricCrypto(algorithm, privateKey, null);
    return asymmetricCrypto.decryptStr(data, KeyType.PrivateKey);
}
```

### 摘要接口

接口 `Digest` 的 `digestHex(String data, String algorithm)` 方法接收两个参数：一个是数据，另一个是指定算法。它利用 Hutool 库中的 `Digester` 类来计算消息摘要，并返回摘要的 16 进制字符串表示。

```java
default String digestHex(String data, String algorithm) throws Exception {
    Digester digester = new Digester(algorithm);
    return digester.digestHex(data);
}
```



## 工厂

1、使用加密工厂创建加密接口的算法：

```java
package crypto;

import crypto.asymmetric.RSA;
import crypto.asymmetric.SM2;
import crypto.constant.AlgorithmConstant;
import crypto.model.Algorithm;
import crypto.symmetric.AES;
import crypto.symmetric.DES;
import crypto.symmetric.DESede;
import crypto.symmetric.SM4;

/**
 * 加密算法工厂类
 *
 * @author loquy
 * @date 2023/02/07 10:03
 */
public class CryptoFactory {

    public static Crypto getCryptoFactory(Algorithm algorithm) throws Exception {
        switch (algorithm.getPkAlgorithm()) {
            case AlgorithmConstant.DES:
                return new DES(algorithm);
            case AlgorithmConstant.DES3:
                return new DESede(algorithm);
            case AlgorithmConstant.AES:
                return new AES(algorithm);
            case AlgorithmConstant.SM4:
                return new SM4(algorithm);
            case AlgorithmConstant.RSA:
                return new RSA(algorithm);
            case AlgorithmConstant.SM2:
                return new SM2(algorithm);
            default:
                throw new Exception("没有找到此算法：" + algorithm.getPkAlgorithm());
        }
    }
}

```

2、使用摘要工厂创建摘要接口的算法：

```java
package crypto;

import crypto.constant.AlgorithmConstant;
import crypto.digest.MD5;
import crypto.digest.SHA1;
import crypto.digest.SHA256;
import crypto.digest.SM3;
import crypto.model.Algorithm;

/**
 * @author loquy
 * @date 2023/02/09 9:23
 */
public class DigestFactory {

    public static Digest getDigestFactory(Algorithm algorithm) throws Exception {
        switch (algorithm.getHashAlgorithm()) {
            case AlgorithmConstant.MD5:
                return new MD5(algorithm);
            case AlgorithmConstant.SHA1:
                return new SHA1(algorithm);
            case AlgorithmConstant.SHA256:
                return new SHA256(algorithm);
            case AlgorithmConstant.SM3:
                return new SM3(algorithm);
            default:
                throw new Exception("没有找到此算法：" + algorithm.getHashAlgorithm());
        }
    }
}
```

3、调用示例：

```java
String encrypt = CryptoFactory.getCryptoFactory(algorithm).encrypt();
String decrypt = CryptoFactory.getCryptoFactory(algorithm).decrypt();
String digest = DigestFactory.getDigestFactory(algorithm).digestHex();
```


## 测试

```java
package crypto;

import crypto.constant.AlgorithmConstant;
import crypto.model.Algorithm;
import crypto.model.Key;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * @author loquy
 * @date 2023/02/21 15:14
 */
@SpringBootTest
public class CryptoTests {

    @Test
    void asymmetricTest() throws Exception {
        cryptoTest(AlgorithmConstant.RSA, "RSA");
        cryptoTest(AlgorithmConstant.SM2, "SM2");
    }

    @Test
    void symmetricTest() throws Exception {
        cryptoTest(AlgorithmConstant.AES, "AES");
        cryptoTest(AlgorithmConstant.DES, "DES");
        cryptoTest(AlgorithmConstant.DES3, "DESede");
        cryptoTest(AlgorithmConstant.SM4, "SM4");
    }

    @Test
    void digestTest() throws Exception {
        digestTest(AlgorithmConstant.MD5, "MD5");
        digestTest(AlgorithmConstant.SHA1, "SHA1");
        digestTest(AlgorithmConstant.SHA256, "SHA256");
        digestTest(AlgorithmConstant.SM3, "SM3");
    }

    private void cryptoTest(String algorithmName, String data) throws Exception {
        Algorithm algorithm = new Algorithm(algorithmName, null, null, null, null, data);
        Key key = CryptoFactory.getCryptoFactory(algorithm).generateKey();
        algorithm.setKey(key.getBase64SecretKey());
        algorithm.setPrivateKey(key.getBase64PrivateKey());
        algorithm.setPublicKey(key.getBase64PublicKey());
        String encrypt = CryptoFactory.getCryptoFactory(algorithm).encrypt();
        algorithm.setRawData(encrypt);
        String decrypt = CryptoFactory.getCryptoFactory(algorithm).decrypt();
        System.out.println("=====================");
        System.out.println(encrypt);
        System.out.println(decrypt);
    }

    private void digestTest(String algorithmName, String data) throws Exception {
        Algorithm algorithm = new Algorithm(null, null, null, null, algorithmName, data);
        String encrypt = DigestFactory.getDigestFactory(algorithm).digestHex();
        System.out.println("=====================");
        System.out.println(encrypt);
    }
}

```

输出：

`asymmetricTest`

```text
=====================
075f2c0e81a54517cd61631668e9b5568e6082e69bf70e93a0996861ce365cad6385b25eaa75f77107595743dd6892e98e78b126369371068f68ff18e0d70cc86a42a74a3726b24d8bd6e53e4635c8faccb4185bdafc4d2ba9c6270db14ddff8633be84d78625775a7c8948719761245bcdc9a8e3a02b42b5e6d0a28352ca2bb
RSA
=====================
0403196b4d211e9af36725da6782f31ff524804057ec7e32b27ae1a79c6065fdb33d2f9a5304a6e039528d53cc7a46dac318497558c00b7865d5f859a6eca28caf0bddf74dcb337d14c58d2392be6fc92ecde35fdb3213a3dfe474ea853ad891260028c5
SM2

```
`digestTest`

```text
=====================
7f138a09169b250e9dcb378140907378
=====================
e1744a525099d9a53c0460ef9cb7ab0e4c4fc939
=====================
b3abe5d8c69b38733ad57ea75e83bcae42bbbbac75e3a5445862ed2f8a2cd677
=====================
17a7fa246c4b9b527fb778792b91e3ec1cc51301311801613e1a7783ebcfe2e5


```
`symmetricTest`

```text
=====================
6c073cdf45fa0fdf8e5bdb10d3615a0e
AES
=====================
e3512db314d44c2e
DES
=====================
54c3bf117d4c10b5
DESede
=====================
8b3be8b1fb505de0baa48cb5181a7974
SM4
```


## 源码

[参见此仓库](https://github.com/loquy/spring-boot-demo)
