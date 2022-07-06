---
title: Yii 中活动记录（Active Record）类的使用
tags:
  - PHP
  - Yii
categories: 
  - [编程, PHP]
category_bar: [PHP]
index_img: 'https://www.loquy.cn/images/Yii.jpg'
description: Yii中活动记录（Active Record）类的使用
abbrlink: 6a73a53a
date: 2020-08-21 11:33:12
updated: 2020-08-21 17:50:12
---
# Yii中活动记录（Active Record）类的使用

## 查询数据

```php
/** 
定义 Active Record 类后，你可以从相应的数据库表中查询数据。 查询过程大致如下三个步骤：
1.通过 yii\db\ActiveRecord::find() 方法创建一个新的查询生成器对象；
2.使用查询生成器的构建方法来构建你的查询；
3.调用查询生成器的查询方法来取出数据到 Active Record 实例中。
正如你看到的，是不是跟查询生成器的步骤差不多。 唯一有区别的地方在于你用 yii\db\ActiveRecord::find() 去获得一个新的查询生成器对象，这个对象是 yii\db\ActiveQuery， 而不是使用 new 操作符创建一个查询生成器对象。 
下面是一些例子，介绍如何使用 Active Query 查询数据：
**/

// SELECT * FROM `customer` WHERE `id` = 123 
$customer = Customer::find()->where(['id' => 123])->one();
$customer = Customer::findOne(123);
$customer = Customer::findOne(['id' => 123]);

// 取回所有活跃客户并以他们的 ID 排序：
$customers = Customer::find()
    ->where(['status' => Customer::STATUS_ACTIVE])
    ->orderBy('id')
    ->all();

// 返回 id 是 100, 101, 123, 124 的客户
// SELECT * FROM `customer` WHERE `id` IN (100, 101, 123, 124)
$customers = Customer::findAll([100, 101, 123, 124]);

// 返回 id 是 123 的活跃客户
// SELECT * FROM `customer` WHERE `id` = 123 AND `status` = 1
$customer = Customer::findOne([
    'id' => 123,
    'status' => Customer::STATUS_ACTIVE,
]);

// 返回所有不活跃的客户
// SELECT * FROM `customer` WHERE `status` = 0
$customers = Customer::findAll([
    'status' => Customer::STATUS_INACTIVE,
]);

// 取回活跃客户的数量：
// SELECT COUNT(*) FROM `customer` WHERE `status` = 1
$count = Customer::find()
    ->where(['status' => Customer::STATUS_ACTIVE])
    ->count();

// 以客户 ID 索引结果集：
// SELECT * FROM `customer`
$customers = Customer::find()
    ->indexBy('id')
    ->all();

// 警告： 如果你需要将用户输入传递给这些方法，请确保输入值是标量或者是 数组条件，确保数组结构不能被外部所改变：

// yii\web\Controller 确保了 $id 是标量
public function actionView($id)
{
    $model = Post::findOne($id);
    // ...
}

// 明确了指定要搜索的列，在此处传递标量或数组将始终只是查找出单个记录而已
$model = Post::findOne(['id' => Yii::$app->request->get('id')]);

// 不要使用下面的代码！可以注入一个数组条件来匹配任意列的值！
$model = Post::findOne(Yii::$app->request->get('id'));
```

## 数据转换 

```php
class Customer extends ActiveRecord
{
    // ...

    public function getBirthdayText()
    {
        return date('Y/m/d', $this->birthday);
    }
    
    public function setBirthdayText($value)
    {
        $this->birthday = strtotime($value);
    }
}

// 访问$customer->birthdayText
```

## 以数组形式获取数据    

``` php
// 返回所有客户
// 每个客户返回一个关联数组
$customers = Customer::find()
    ->asArray()
    ->all();

// 提示： 虽然这种方法可以节省内存并提高性能，但它更靠近较低的 DB 抽象层 你将失去大部分的 Active Record 提供的功能。 一个非常重要的区别在于列值的数据类型。 当您在 Active Record 实例中返回数据时，列值将根据实际列类型，自动类型转换； 然而，当您以数组返回数据时，列值将为 字符串（因为它们是没有处理过的 PDO 的结果），不管它们的实际列是什么类型。
```

## 批量获取数据

```php
// 每次获取 10 条客户数据
foreach (Customer::find()->batch(10) as $customers) {
    // $customers 是个最多拥有 10 条数据的数组
}

// 每次获取 10 条客户数据，然后一条一条迭代它们
foreach (Customer::find()->each(10) as $customer) {
    // $customer 是个 `Customer` 对象
}

// 贪婪加载模式的批处理查询
foreach (Customer::find()->with('orders')->each() as $customer) {
    // $customer 是个 `Customer` 对象，并附带关联的 `'orders'`
}
```

## 保存数据
```php
// 插入新记录
$customer = new Customer();
$customer->name = 'James';
$customer->email = 'james@example.com';
$customer->save();

// 更新已存在的记录
$customer = Customer::findOne(123);
$customer->email = 'james@newexample.com';
$customer->save();

// save() 方法可能插入或者更新表的记录，这取决于 Active Record 实例的状态。 如果实例通过 new 操作符实例化，调用 save() 方法将插入新记录； 如果实例是一个查询方法的结果，调用 save() 方法 将更新这个实例对应的表记录行。
```

## 数据验证


    因为 yii\db\ActiveRecord 继承于 yii\base\Model，它共享相同的 输入验证 功能。 你可以通过重写 rules() 方法声明验证规则并执行， 通过调用 validate() 方法进行数据验证。
    
    当你调用 save() 时，默认情况下会自动调用 validate()。 只有当验证通过时，它才会  真正地保存数据; 否则将简单地返回 false， 您可以检查 errors 属性来获取验证过程的错误消息。
    
    提示： 如果你确定你的数据不需要验证（比如说数据来自可信的场景）， 你可以调用 save(false) 来跳过验证过程。

## 快赋值

```php
  // 和普通的 模型 一样，你亦可以享受 Active Record 实例的 块赋值 特性。 使用此功能，您可以在单个 PHP 语句中，给 Active Record 实例的多个属性批量赋值， 如下所示。 记住，只有 安全属性 才可以批量赋值。

$values = [
    'name' => 'James',
    'email' => 'james@example.com',
];

$customer = new Customer();

$customer->attributes = $values;
$customer->save();
```

  

## 更新计数
```php
// 在数据库表中增加或减少一个字段的值是个常见的任务。我们将这些列称为“计数列”。 您可以使用 updateCounters() 更新一个或多个计数列。 例如，
    
$post = Post::findOne(100);

// UPDATE `post` SET `view_count` = `view_count` + 1 WHERE `id` = 100
$post->updateCounters(['view_count' => 1]);

// 同样，你可以调用 updateAllCounters() 同时更新多条记录的计数列
// UPDATE `customer` SET `age` = `age` + 1
Customer::updateAllCounters(['age' => 1]);
```

## 更新多个数据行
```php
// UPDATE `customer` SET `status` = 1 WHERE `email` LIKE `%@example.com%`
Customer::updateAll(['status' => Customer::STATUS_ACTIVE], ['like', 'email', '@example.com']);
```

## 删除数据
```php
// 要删除单行数据，首先获取与该行对应的 Active Record 实例，然后调用 yii\db\ActiveRecord::delete() 方法。

$customer = Customer::findOne(123);
$customer->delete();

// 你可以调用 yii\db\ActiveRecord::deleteAll() 方法删除多行甚至全部的数据。例如,

Customer::deleteAll(['status' => Customer::STATUS_INACTIVE]);
```

## 事务操作
```php
$customer = Customer::findOne(123);

Customer::getDb()->transaction(function($db) use ($customer) {
    $customer->id = 200;
    $customer->save();
    // ...其他 DB 操作...
});
    
// 或者

$transaction = Customer::getDb()->beginTransaction();
try {
    $customer->id = 200;
    $customer->save();
    // ...other DB operations...
    $transaction->commit();
} catch(\Exception $e) {
    $transaction->rollBack();
    throw $e;
} catch(\Throwable $e) {
    $transaction->rollBack();
    throw $e;
}
    
    // 提示： 在上面的代码中，我们有两个catch块用于兼容 PHP 5.x 和 PHP 7.x。 \Exception 继承于 \Throwable interface 由于 PHP 7.0 的改动，如果您的应用程序仅使用 PHP 7.0 及更高版本，您可以跳过 \Exception 部分。
```

## 乐观锁


    乐观锁是一种防止此冲突的方法：一行数据 同时被多个用户更新。例如，同一时间内，用户 A 和用户 B 都在编辑 相同的 wiki 文章。用户 A 保存他的编辑后，用户 B 也点击“保存”按钮来 保存他的编辑。实际上，用户 B 正在处理的是过时版本的文章， 因此最好是，想办法阻止他保存文章并向他提示一些信息。
    
    乐观锁通过使用一个字段来记录每行的版本号来解决上述问题。 当使用过时的版本号保存一行数据时，yii\db\StaleObjectException 异常 将被抛出，这阻止了该行的保存。乐观锁只支持更新 yii\db\ActiveRecord::update() 或者删除 yii\db\ActiveRecord::delete() 已经存在的单条数据行。
    
    使用乐观锁的步骤，
    
    1.在与 Active Record 类相关联的 DB 表中创建一个列，以存储每行的版本号。 这个列应当是长整型（在 MySQL 中是 BIGINT DEFAULT 0）。
    2.重写 yii\db\ActiveRecord::optimisticLock() 方法返回这个列的命名。
    3.在你的 Model 类里实现 OptimisticLockBehavior 行为（注：这个行为类在 2.0.16 版本加入），以便从请求参数里自动解析这个列的值。 然后从验证规则中删除 version 属性，因为 OptimisticLockBehavior 已经处理它了.
    4.在用于用户填写的 Web 表单中，添加一个隐藏字段（hidden field）来存储正在更新的行的当前版本号。
    5.在使用 Active Record 更新数据的控制器动作中，要捕获（try/catch） yii\db\StaleObjectException 异常。 实现一些业务逻辑来解决冲突（例如合并更改，提示陈旧的数据等等）。
    例如，假定版本列被命名为 version。您可以使用下面的代码来实现乐观锁。
```php
// ------ 视图层代码 -------

use yii\helpers\Html;

// ...其他输入栏
echo Html::activeHiddenInput($model, 'version');


// ------ 控制器代码 -------

use yii\db\StaleObjectException;

public function actionUpdate($id)
{
    $model = $this->findModel($id);

    try {
        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('update', [
                'model' => $model,
            ]);
        }
    } catch (StaleObjectException $e) {
        // 解决冲突的代码
    }
}

// ------ Model 代码 -------

use yii\behaviors\OptimisticLockBehavior;

public function behaviors()
{
    return [
        OptimisticLockBehavior::className(),
    ];
}
```

## 使用关联数据
```php
// 声明关联关系
class Customer extends ActiveRecord
{
    // ...

    public function getOrders()
    {
        return $this->hasMany(Order::className(), ['customer_id' => 'id']);
    }
}

class Order extends ActiveRecord
{
    // ...

    public function getCustomer()
    {
        return $this->hasOne(Customer::className(), ['id' => 'customer_id']);
    }
}

/** 上述的代码中，我们为 Customer 类声明了一个 orders 关联， 和为 Order 声明了一个 customer 关联。

 每个关联方法必须这样命名：getXyz。然后我们通过 xyz（首字母小写）调用这个关联名。 请注意关联名是大小写敏感的。

当声明一个关联关系的时候，必须指定好以下的信息：

关联的对应关系：通过调用 hasMany() 或者 hasOne() 指定。在上面的例子中，您可以很容易看出这样的关联声明： 一个客户可以有很多订单，而每个订单只有一个客户。
相关联 Active Record 类名：用来指定为 hasMany() 或者 hasOne() 方法的第一个参数。 推荐的做法是调用 Xyz::className() 来获取类名称的字符串，以便您 可以使用 IDE 的自动补全，以及让编译阶段的错误检测生效。
两组数据的关联列：用以指定两组数据相关的列（hasOne()/hasMany() 的第二个参数）。 数组的值填的是主数据的列（当前要声明关联的 Active Record 类为主数据）， 而数组的键要填的是相关数据的列。

一个简单的口诀，先附表的主键，后主表的主键。 正如上面的例子，customer_id 是 Order 的属性，而 id是 Customer 的属性。 （译者注：hasMany() 的第二个参数，这个数组键值顺序不要弄反了）**/
    
// 访问关联数据
    
// SELECT * FROM `customer` WHERE `id` = 123
$customer = Customer::findOne(123);

// SELECT * FROM `order` WHERE `customer_id` = 123
// $orders 是由 Order 类组成的数组
$orders = $customer->orders;

//  当你通过 getter 方法 getXyz() 声明了一个叫 xyz 的关联属性，你就可以像 属性 那样访问 xyz。注意这个命名是区分大小写的。

// 提示： 虽然这个概念跟 这个 属性 特性很像， 但是还是有一个很重要的区别。普通对象属性的属性值与其定义的 getter 方法的类型是相同的。 而关联方法返回的是一个 yii\db\ActiveQuery 活动查询生成器的实例。只有当访问关联属性的的时候， 才会返回 yii\db\ActiveRecord Active Record 实例，或者 Active Record 实例组成的数组。

$customer->orders; // 获得 `Order` 对象的数组
$customer->getOrders(); // 返回 ActiveQuery 类的实例
```

## 动态关联查询

```php 
$customer = Customer::findOne(123);

// SELECT * FROM `order` WHERE `customer_id` = 123 AND `subtotal` > 200 ORDER BY `id`
$orders = $customer->getOrders()
    ->where(['>', 'subtotal', 200])
    ->orderBy('id')
    ->all();

class Customer extends ActiveRecord
{
    public function getBigOrders($threshold = 100) // 老司机的提醒机的提醒threshold 参数一定一定要给个默认值一定要给个默认值{
        return $this->hasMany(Order::className(), ['customer_id' => 'id'])
            ->where('subtotal > :threshold', [':threshold' => $threshold])
            ->orderBy('id');
    }
}

// 然后你就可以执行以下关联查询：

// SELECT * FROM `order` WHERE `customer_id` = 123 AND `subtotal` > 200 ORDER BY `id`
$orders = $customer->getBigOrders(200)->all();

// SELECT * FROM `order` WHERE `customer_id` = 123 AND `subtotal` > 100 ORDER BY `id`
$orders = $customer->bigOrders;
```

## 中间表关联
```php
// 在数据库建模中，当两个关联表之间的对应关系是多对多时， 通常会引入一个连接表。例如，order 表 和 item 表可以通过名为 order_item 的连接表相关联。一个 order 将关联多个 order items， 而一个 order item 也会关联到多个 orders。

// 当声明这种表关联后，您可以调用 via() 或 viaTable() 指明连接表。via() 和 viaTable() 之间的区别是 前者是根据现有的关联名称来指定连接表，而后者直接使用 连接表。例如，

class Order extends ActiveRecord
{
    public function getItems()
    {
        return $this->hasMany(Item::className(), ['id' => 'item_id'])
            ->viaTable('order_item', ['order_id' => 'id']);
    }
}

// 或者,

class Order extends ActiveRecord
{
    public function getOrderItems()
    {
        return $this->hasMany(OrderItem::className(), ['order_id' => 'id']);
    }

    public function getItems()
    {
        return $this->hasMany(Item::className(), ['id' => 'item_id'])
            ->via('orderItems');
    }
}

// 使用连接表声明的关联和正常声明的关联是等同的，例如，

// SELECT * FROM `order` WHERE `id` = 100
$order = Order::findOne(100);

// SELECT * FROM `order_item` WHERE `order_id` = 100
// SELECT * FROM `item` WHERE `item_id` IN (...)
// 返回 Item 类组成的数组
$items = $order->items;
```

## 通过多个表来连接关联声明
```php
// 通过使用 via() 方法，它还可以通过多个表来定义关联声明。 再考虑考虑上面的例子，我们有 Customer，Order 和 Item 类。 我们可以添加一个关联关系到 Customer 类，这个关联可以列出了 Customer（客户） 的订单下放置的所有 Item（商品）， 这个关联命名为 getPurchasedItems()，关联声明如下代码示例所示：

class Customer extends ActiveRecord
{
    // ...

    public function getPurchasedItems()
    {
        // 客户的商品，将 Item 中的 'id' 列与 OrderItem 中的 'item_id' 相匹配
        return $this->hasMany(Item::className(), ['id' => 'item_id'])
                    ->via('orderItems');
    }

    public function getOrderItems()
    {
        // 客户订单中的商品，将 `Order` 的 'id' 列和 OrderItem 的 'order_id' 列相匹配
        return $this->hasMany(OrderItem::className(), ['order_id' => 'id'])
                    ->via('orders');
    }

    public function getOrders()
    {
        // 见上述列子
        return $this->hasMany(Order::className(), ['customer_id' => 'id']);
    }
}
```

## 延迟加载和即时加载
```php
// 在 访问关联数据 中，我们解释说可以像问正常的对象属性那样 访问 Active Record 实例的关联属性。SQL 语句仅在 你第一次访问关联属性时执行。我们称这种关联数据访问方法为 延迟加载。 例如，

// SELECT * FROM `customer` WHERE `id` = 123
$customer = Customer::findOne(123);

// SELECT * FROM `order` WHERE `customer_id` = 123
$orders = $customer->orders;

// 没有 SQL 语句被执行
$orders2 = $customer->orders;
// 延迟加载使用非常方便。但是，当你需要访问相同的具有多个 Active Record 实例的关联属性时， 可能会遇到性能问题。请思考一下以下代码示例。 有多少 SQL 语句会被执行？

// SELECT * FROM `customer` LIMIT 100
$customers = Customer::find()->limit(100)->all();

foreach ($customers as $customer) {
    // SELECT * FROM `order` WHERE `customer_id` = ...
    $orders = $customer->orders;
}
// 你瞅瞅，上面的代码会产生 101 次 SQL 查询！ 这是因为每次你访问 for 循环中不同的 Customer 对象的 orders 关联属性时，SQL 语句 都会被执行一次。

// 为了解决上述的性能问题，你可以使用所谓的 即时加载，如下所示，

// SELECT * FROM `customer` LIMIT 100;
// SELECT * FROM `orders` WHERE `customer_id` IN (...)
$customers = Customer::find()
    ->with('orders')
    ->limit(100)
    ->all();

foreach ($customers as $customer) {
    // 没有任何的 SQL 执行
    $orders = $customer->orders;
}
// 通过调用 yii\db\ActiveQuery::with() 方法，你使 Active Record 在一条 SQL 语句里就返回了这 100 位客户的订单。 结果就是，你把要执行的 SQL 语句从 101 减少到 2 条！

// 你可以即时加载一个或多个关联。 你甚至可以即时加载 嵌套关联 。嵌套关联是一种 在相关的 Active Record 类中声明的关联。例如，Customer 通过 orders 关联属性 与 Order 相关联， Order 与 Item 通过 items 关联属性相关联。 当查询 Customer 时，您可以即时加载 通过嵌套关联符 orders.items 关联的 items。

// 以下代码展示了 with() 的各种用法。我们假设 Customer 类 有两个关联 orders 和 country，而 Order 类有一个关联 items。

//  即时加载 "orders" and "country"
$customers = Customer::find()->with('orders', 'country')->all();
// 等同于使用数组语法 如下
$customers = Customer::find()->with(['orders', 'country'])->all();
// 没有任何的 SQL 执行
$orders= $customers[0]->orders;
// 没有任何的 SQL 执行
$country = $customers[0]->country;

// 即时加载“订单”和嵌套关系“orders.items”
$customers = Customer::find()->with('orders.items')->all();
// 访问第一个客户的第一个订单中的商品
// 没有 SQL 查询执行
$items = $customers[0]->orders[0]->items;
// 你也可以即时加载更深的嵌套关联，比如 a.b.c.d。所有的父关联都会被即时加载。 那就是, 当你调用 with() 来 with a.b.c.d, 你将即时加载 a, a.b, a.b.c and a.b.c.d。

// 提示： 一般来说，当即时加载 N 个关联，另有 M 个关联 通过 连接表 声明，则会有 N+M+1 条 SQL 语句被执行。 请注意这样的的嵌套关联 a.b.c.d 算四个关联。

// 当即时加载一个关联，你可以通过匿名函数自定义相应的关联查询。 例如，

// 查找所有客户，并带上他们国家和活跃订单
// SELECT * FROM `customer`
// SELECT * FROM `country` WHERE `id` IN (...)
// SELECT * FROM `order` WHERE `customer_id` IN (...) AND `status` = 1
$customers = Customer::find()->with([
    'country',
    'orders' => function ($query) {
        $query->andWhere(['status' => Order::STATUS_ACTIVE]);
    },
])->all();
// 自定义关联查询时，应该将关联名称指定为数组的键 并使用匿名函数作为相应的数组的值。匿名函数将接受一个 $query 参数 它用于表示这个自定义的关联执行关联查询的 yii\db\ActiveQuery 对象。 在上面的代码示例中，我们通过附加一个关于订单状态的附加条件来修改关联查询。

// 提示： 如果你在即时加载的关联中调用 select() 方法，你要确保 在关联声明中引用的列必须被 select。否则，相应的模型（Models）可能 无法加载。例如，

$orders = Order::find()->select(['id', 'amount'])->with('customer')->all();
// $orders[0]->customer 会一直是 `null`。你应该这样写，以解决这个问题：
$orders = Order::find()->select(['id', 'amount', 'customer_id'])->with('cus
```

## 关联关系的 JOIN 查询
```php
// 提示： 这小节的内容仅仅适用于关系数据库， 比如 MySQL，PostgreSQL 等等。

// 到目前为止，我们所介绍的关联查询，仅仅是使用主表列 去查询主表数据。实际应用中，我们经常需要在关联表中使用这些列。例如， 我们可能要取出至少有一个活跃订单的客户。为了解决这个问题，我们可以 构建一个 join 查询，如下所示：

// SELECT `customer`.* FROM `customer`
// LEFT JOIN `order` ON `order`.`customer_id` = `customer`.`id`
// WHERE `order`.`status` = 1
// 
// SELECT * FROM `order` WHERE `customer_id` IN (...)
$customers = Customer::find()
    ->select('customer.*')
    ->leftJoin('order', '`order`.`customer_id` = `customer`.`id`')
    ->where(['order.status' => Order::STATUS_ACTIVE])
    ->with('orders')
    ->all();
// 提示： 在构建涉及 JOIN SQL 语句的连接查询时，清除列名的歧义很重要。 通常的做法是将表名称作为前缀加到对应的列名称前。

// 但是，更好的方法是通过调用 yii\db\ActiveQuery::joinWith() 来利用已存在的关联声明：

$customers = Customer::find()
    ->joinWith('orders')
    ->where(['order.status' => Order::STATUS_ACTIVE])
    ->all();
// 两种方法都执行相同的 SQL 语句集。然而，后一种方法更干净、简洁。

// 默认的，joinWith() 会使用 LEFT JOIN 去连接主表和关联表。 你可以通过 $joinType 参数指定不同的连接类型（比如 RIGHT JOIN）。 如果你想要的连接类型是 INNER JOIN，你可以直接用 innerJoinWith() 方法代替。

// 调用 joinWith() 方法会默认 即时加载 相应的关联数据。 如果你不需要那些关联数据，你可以指定它的第二个参数 $eagerLoading 为 false。

// 注意： 即使在启用即时加载的情况下使用 joinWith() 或 innerJoinWith()， 相应的关联数据也不会从这个 JOIN 查询的结果中填充。 因此，每个连接关系还有一个额外的查询，正如即时加载部分所述。

// 和 with() 一样，你可以 join 多个关联表；你可以动态的自定义 你的关联查询；你可以使用嵌套关联进行 join。你也可以将 with() 和 joinWith() 组合起来使用。例如：

$customers = Customer::find()->joinWith([
    'orders' => function ($query) {
        $query->andWhere(['>', 'subtotal', 100]);
    },
])->with('country')
    ->all();
// 有时，当连接两个表时，你可能需要在 JOIN 查询的 ON 部分中指定一些额外的条件。 这可以通过调用 yii\db\ActiveQuery::onCondition() 方法来完成，如下所示：

// SELECT `customer`.* FROM `customer`
// LEFT JOIN `order` ON `order`.`customer_id` = `customer`.`id` AND `order`.`status` = 1 
// 
// SELECT * FROM `order` WHERE `customer_id` IN (...)
$customers = Customer::find()->joinWith([
    'orders' => function ($query) {
        $query->onCondition(['order.status' => Order::STATUS_ACTIVE]);
    },
])->all();
// 以上查询取出 所有 客户，并为每个客户取回所有活跃订单。 请注意，这与我们之前的例子不同，后者仅取出至少有一个活跃订单的客户。

// 提示： 当通过 onCondition() 修改 yii\db\ActiveQuery 时， 如果查询涉及到 JOIN 查询，那么条件将被放在 ON 部分。如果查询不涉及 JOIN ，条件将自动附加到查询的 WHERE 部分。 因此，它可以只包含 包含了关联表的列 的条件。（译者注：意思是 onCondition() 中可以只写关联表的列，主表的列写不写都行）
```

## 反向关联
```php
// 两个 Active Record 类之间的关联声明往往是相互关联的。例如，Customer 是 通过 orders 关联到 Order ，而Order 通过 customer 又关联回到了 Customer。

class Customer extends ActiveRecord
{
    public function getOrders()
    {
        return $this->hasMany(Order::className(), ['customer_id' => 'id']);
    }
}

class Order extends ActiveRecord
{
    public function getCustomer()
    {
        return $this->hasOne(Customer::className(), ['id' => 'customer_id']);
    }
}
// 现在考虑下面的一段代码：

// SELECT * FROM `customer` WHERE `id` = 123
$customer = Customer::findOne(123);

// SELECT * FROM `order` WHERE `customer_id` = 123
$order = $customer->orders[0];

// SELECT * FROM `customer` WHERE `id` = 123
$customer2 = $order->customer;

// 显示 "not the same"
echo $customer2 === $customer ? 'same' : 'not the same';
// 我们原本认为 $customer 和 $customer2 是一样的，但不是！其实他们确实包含相同的 客户数据，但它们是不同的对象。 访问 $order->customer 时，需要执行额外的 SQL 语句， 以填充出一个新对象 $customer2。

// 为了避免上述例子中最后一个 SQL 语句被冗余执行，我们应该告诉 Yii customer 是 orders 的 反向关联，可以通过调用 inverseOf() 方法声明， 如下所示：

class Customer extends ActiveRecord
{
    public function getOrders()
    {
        return $this->hasMany(Order::className(), ['customer_id' => 'id'])->inverseOf('customer');
    }
}
// 这样修改关联声明后：

// SELECT * FROM `customer` WHERE `id` = 123
$customer = Customer::findOne(123);

// SELECT * FROM `order` WHERE `customer_id` = 123
$order = $customer->orders[0];

// No SQL will be executed
$customer2 = $order->customer;

// 输出 "same"
echo $customer2 === $customer ? 'same' : 'not the same';

// 注意： 反向关联不能用在有 连接表 关联声明中。 也就是说，如果一个关联关系通过 via() 或 viaTable() 声明， 你就不能再调用 inverseOf() 了。
```

## 保存关联数据
```php
// 在使用关联数据时，您经常需要建立不同数据之间的关联或销毁 现有关联。这需要为定义的关联的列设置正确的值。通过使用 Active Record， 你就可以编写如下代码：

$customer = Customer::findOne(123);
$order = new Order();
$order->subtotal = 100;
// ...

// 为 Order 设置属性以定义与 "customer" 的关联关系
$order->customer_id = $customer->id;
$order->save();
Active Record 提供了 link() 方法，可以更好地完成此任务：

$customer = Customer::findOne(123);
$order = new Order();
$order->subtotal = 100;
// ...

$order->link('customer', $customer);
// link()方法需要指定关联名 和要建立关联的目标 Active Record 实例。该方法将修改属性的值 以连接两个 Active Record 实例，并将其保存到数据库。在上面的例子中，它将设置 Order 实例的 customer_id 属性 为 Customer 实例的 id 属性的值，然后保存 到数据库。

// 注意： 你不能关联两个新的 Active Record 实例。
// 使用 link() 的好处在通过 junction table 定义关系时更加明显。 例如，你可以使用以下代码关联 Order 实例 和 Item 实例：

$order->link('items', $item);
// 上述代码会自动在 order_item 关联表中插入一行，以关联 order 和 item 这两个数据记录。

// 信息： link() 方法在保存相应的 Active Record 实例时， 将不会执行任何数据验证。在调用此方法之前， 您应当验证所有的输入数据。

//link() 方法的反向操作是 unlink() 方法， 这将可以断掉两个 Active Record 实例间的已经存在了的关联关系。例如，

$customer = Customer::find()->with('orders')->where(['id' => 123])->one();
$customer->unlink('orders', $customer->orders[0]);
// 默认情况下，unlink() 方法将设置指定的外键值， 以把现有的关联指定为 null。此外，你可以选择通过将 $delete 参数设置为true 传递给方法， 删除包含此外键值的表记录行。

// 当关联关系中有连接表时，调用 unlink() 时， 如果 $delete 参数是 true 的话，将导致 连接表中的外键或相应的行被删除。
```

## 跨数据库关联
```php
// Active Record 允许您在不同数据库驱动的 Active Record 类之间声明关联关系。 这些数据库可以是不同的类型（例如 MySQL 和 PostgreSQL ，或是 MS SQL 和 MongoDB），它们也可以运行在 不同的服务器上。你可以使用相同的语法来执行关联查询。例如，

// Customer 对应的表是关系数据库中（比如 MySQL）的 "customer" 表
class Customer extends \yii\db\ActiveRecord
{
    public static function tableName()
    {
        return 'customer';
    }

    public function getComments()
    {
        // 一个 customer 有很多条评论（comments）
        return $this->hasMany(Comment::className(), ['customer_id' => 'id']);
    }
}

// Comment 对应的是 MongoDB 数据库中的  "comment" 集合（译者注：MongoDB 中的集合相当于 MySQL 中的表）
class Comment extends \yii\mongodb\ActiveRecord
{
    public static function collectionName()
    {
        return 'comment';
    }

    public function getCustomer()
    {
        // 一条评论对应一位 customer
        return $this->hasOne(Customer::className(), ['id' => 'customer_id']);
    }
}

$customers = Customer::find()->with('comments')->all();
// 本节中描述的大多数关联查询功能，你都可以抄一抄。

// 注意： joinWith() 这个功能限制于某些数据库是否支持跨数据库 JOIN 查询。  因此，你再上述的代码里就不能用此方法了，因为 MongoDB 不支持 JOIN 查询。
```

## 自定义查询类
```php
// 默认情况下，yii\db\ActiveQuery 支持所有 Active Record 查询。要在 Active Record 类中使用自定义的查询类， 您应该重写 yii\db\ActiveRecord::find() 方法并返回一个你自定义查询类的实例。 例如，

// file Comment.php
namespace app\models;

use yii\db\ActiveRecord;

class Comment extends ActiveRecord
{
    public static function find()
    {
        return new CommentQuery(get_called_class());
    }
}
// 现在，对于 Comment 类，不管你执行查询（比如 find()、findOne()），还是定义一个关联（比如 hasOne()）， 你都将调用到 CommentQuery 实例，而不再是 ActiveQuery 实例。

// 现在你可以定义 CommentQuery 类了，发挥你的奇技淫巧，以改善查询构建体验。例如，

// file CommentQuery.php
namespace app\models;

use yii\db\ActiveQuery;

class CommentQuery extends ActiveQuery
{
    // 默认加上一些条件（可以跳过）
    public function init()
    {
        $this->andOnCondition(['deleted' => false]);
        parent::init();
    }

    // ... 在这里加上自定义的查询方法 ...

    public function active($state = true)
    {
        return $this->andOnCondition(['active' => $state]);
    }
}
// 注意： 作为 onCondition() 方法的替代方案，你应当调用 andOnCondition() 或 orOnCondition() 方法来附加新增的条件， 不然在一个新定义的查询方法，已存在的条件可能会被覆盖。

// 然后你就可以先下面这样构建你的查询了：

$comments = Comment::find()->active()->all();
$inactiveComments = Comment::find()->active(false)->all();
// 提示： 在大型项目中，建议您使用自定义查询类来容纳大多数与查询相关的代码， 以使 Active Record 类保持简洁。

// 您还可以在 Comment 关联关系的定义中或在执行关联查询时，使用刚刚新建查询构建方法：

class Customer extends \yii\db\ActiveRecord
{
    public function getActiveComments()
    {
        return $this->hasMany(Comment::className(), ['customer_id' => 'id'])->active();
    }
}

$customers = Customer::find()->joinWith('activeComments')->all();

// 或者这样
class Customer extends \yii\db\ActiveRecord
{
    public function getComments()
    {
        return $this->hasMany(Comment::className(), ['customer_id' => 'id']);
    }
}

$customers = Customer::find()->joinWith([
    'comments' => function($q) {
        $q->active();
    }
])->all();
// 提示： 在 Yii 1.1 中，有个概念叫做 命名范围。命名范围在 Yii 2.0 中不再支持， 你依然可以使用自定义查询类、查询方法来达到一样的效果。
```

## 选择额外的字段
```php
// 当 Active Record 实例从查询结果中填充时，从数据结果集中， 其属性的值将被相应的列填充。

// 你可以从查询中获取其他列或值，并将其存储在 Active Record 活动记录中。 例如，假设我们有一个名为 room 的表，其中包含有关酒店可用房间的信息。 每个房间使用字段 length，width，height 存储有关其空间大小的信息。 想象一下，我们需要检索出所有可用房间的列表，并按照体积大小倒序排列。 你不可能使用 PHP 来计算体积，但是，由于我们需要按照它的值对这些记录进行排序，你依然需要 volume （体积） 来显示在这个列表中。 为了达到这个目标，你需要在你的 Room 活动记录类中声明一个额外的字段，它将存储 volume 的值：

class Room extends \yii\db\ActiveRecord
{
    public $volume;

    // ...
}
// 然后，你需要撰写一个查询，它可以计算房间的大小并执行排序：

$rooms = Room::find()
    ->select([
        '{{room}}.*', // select all columns
        '([[length]] * [[width]] * [[height]]) AS volume', // 计算体积
    ])
    ->orderBy('volume DESC') // 使用排序
    ->all();

foreach ($rooms as $room) {
    echo $room->volume; // 包含了由 SQL 计算出的值
}
// 额外字段的特性对于聚合查询非常有用。 假设您需要显示一系列客户的订单数量。 首先，您需要使用 orders 关系声明一个 Customer 类，并指定额外字段来存储 count 结果：

class Customer extends \yii\db\ActiveRecord
{
    public $ordersCount;

    // ...

    public function getOrders()
    {
        return $this->hasMany(Order::className(), ['customer_id' => 'id']);
    }
}
// 然后你可以编写一个查询来 JOIN 订单表，并计算订单的总数：

$customers = Customer::find()
    ->select([
        '{{customer}}.*', // select customer 表所有的字段
        'COUNT({{order}}.id) AS ordersCount' // 计算订单总数
    ])
    ->joinWith('orders') // 连接表
    ->groupBy('{{customer}}.id') // 分组查询，以确保聚合函数生效
    ->all();
// 使用此方法的一个缺点是，如果数据不是从 SQL 查询上加载的，它必须再单独计算一遍。 因此，如果你通过常规查询获取个别的数据记录时，它没有额外的 select 语句，那么它 将无法返回额外字段的实际值。新保存的记录一样会发生这种情。

$room = new Room();
$room->length = 100;
$room->width = 50;
$room->height = 2;

$room->volume; // 为 `null`, 因为它没有被声明（赋值）
// 通过 __get() 和 __set() 魔术方法 我们可以将属性赋予行为特性：

class Room extends \yii\db\ActiveRecord
{
    private $_volume;
    
    public function setVolume($volume)
    {
        $this->_volume = (float) $volume;
    }
    
    public function getVolume()
    {
        if (empty($this->length) || empty($this->width) || empty($this->height)) {
            return null;
        }
        
        if ($this->_volume === null) {
            $this->setVolume(
                $this->length * $this->width * $this->height
            );
        }
        
        return $this->_volume;
    }

    // ...
}
// 当 select 查询不提供 volume 体积时，这模型将能够自动计算体积的值出来， 当访问模型的属性的时候。

// 当定义关联关系的时候，你也可以计算聚合字段：

class Customer extends \yii\db\ActiveRecord
{
    private $_ordersCount;

    public function setOrdersCount($count)
    {
        $this->_ordersCount = (int) $count;
    }

    public function getOrdersCount()
    {
        if ($this->isNewRecord) {
            return null; // 这样可以避免调用空主键进行查询
        }

        if ($this->_ordersCount === null) {
            $this->setOrdersCount($this->getOrders()->count()); // 根据关联关系按需计算聚合字段
        }

        return $this->_ordersCount;
    }

    // ...

    public function getOrders()
    {
        return $this->hasMany(Order::className(), ['customer_id' => 'id']);
    }
}
// 使用此代码，如果 'select' 语句中存在 'ordersCount' - 它会从查询结果集获取数据填充 Customer::ordersCount 属性， 否则它会在被访问的时候，使用 Customer::orders 关联按需计算。

// 这种方法也适用于创建一些关联数据的快捷访问方式，特别是对于聚合。 例如：

class Customer extends \yii\db\ActiveRecord
{
    /**
     * 为聚合数据定义一个只读的虚拟属性
     */
    public function getOrdersCount()
    {
        if ($this->isNewRecord) {
            return null; //  这样可以避免调用空主键进行查询
        }
        
        return empty($this->ordersAggregation) ? 0 : $this->ordersAggregation[0]['counted'];
    }

    /**
     * 声明一个常规的 'orders' 关联
     */
    public function getOrders()
    {
        return $this->hasMany(Order::className(), ['customer_id' => 'id']);
    }

    /**
     * 基于 'orders' 关联，声明一个用于查询聚合的新关联
     */
    public function getOrdersAggregation()
    {
        return $this->getOrders()
            ->select(['customer_id', 'counted' => 'count(*)'])
            ->groupBy('customer_id')
            ->asArray(true);
    }

    // ...
}

foreach (Customer::find()->with('ordersAggregation')->all() as $customer) {
    echo $customer->ordersCount; // 输出关联的聚合数据，而不需要额外的查询，因为我们用了即时加载
}

$customer = Customer::findOne($pk);
$customer->ordersCount; // 从延迟加载的关联中，输出聚合数据
```

————————————————
文章来源于Yii官方文档：[活动记录（Active Record）](https://www.yiiframework.com/doc/guide/2.0/zh-cn/db-active-record) 
