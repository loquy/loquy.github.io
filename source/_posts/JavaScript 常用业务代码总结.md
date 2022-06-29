---
title: JavaScript 常用业务代码总结
category_bar: true
index_img: 'https://www.loquy.cn/images/JavaScript.png'
abbrlink: 9296f96c
date: 2022-06-10 11:13:52
updated: 2022-06-29 11:35:52
tags: JavaScript
categories: JavaScript
description: 整理记录常用 JavaScript 业务代码，以此备忘，持续更新中...
---
# 事件和选择器
```javascript
// 元素选择器
$("p")
// #id 选择器
$("#test")
// .class 选择器
$(".test")

```

```javascript
// 点击事件
$("p").click(function(){
    // 动作触发后执行的代码!!
});
// 添加一个或多个事件处理程序
$("p").on("click",function(){
    alert("段落被点击了。");
});
```

$(*selector*).on(*event,childSelector,data,function*)

| 参数            | 描述                                                         |
| :-------------- | :----------------------------------------------------------- |
| *event*         | 必需。规定要从被选元素添加的一个或多个事件或命名空间。  由空格分隔多个事件值，也可以是数组。必须是有效的事件。 |
| *childSelector* | 可选。规定只能添加到指定的子元素上的事件处理程序（且不是选择器本身，比如已废弃的 delegate() 方法）。 |
| *data*          | 可选。规定传递到函数的额外数据。                             |
| *function*      | 可选。规定当事件发生时运行的函数。                           |

# Ajax 执行异步的 HTTP 请求方法
```javascript
$.ajax({
    type: "get",
    async: true,
    url: '',
    dataType: "json",
    data: {},
    contentType: "application/json;charset=UTF-8",
    success: function(res) {
    },
    error: function(err) {
        console.log(err)
    },
    complete: function(res) {
        reload();
    }
})
```

下面的表格中列出了可能的名称/值：

| 名称                         | 值/描述                                                      |
| :--------------------------- | :----------------------------------------------------------- |
| async                        | 布尔值，表示请求是否异步处理。默认是 true。                  |
| beforeSend(*xhr*)            | 发送请求前运行的函数。                                       |
| cache                        | 布尔值，表示浏览器是否缓存被请求页面。默认是 true。          |
| complete(*xhr,status*)       | 请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）。 |
| contentType                  | 发送数据到服务器时所使用的内容类型。默认是："application/x-www-form-urlencoded"。 |
| context                      | 为所有 AJAX 相关的回调函数规定 "this" 值。                   |
| data                         | 规定要发送到服务器的数据。                                   |
| dataFilter(*data*,*type*)    | 用于处理 XMLHttpRequest 原始响应数据的函数。                 |
| dataType                     | 预期的服务器响应的数据类型。                                 |
| error(*xhr,status,error*)    | 如果请求失败要运行的函数。                                   |
| global                       | 布尔值，规定是否为请求触发全局 AJAX 事件处理程序。默认是 true。 |
| ifModified                   | 布尔值，规定是否仅在最后一次请求以来响应发生改变时才请求成功。默认是 false。 |
| jsonp                        | 在一个 jsonp 中重写回调函数的字符串。                        |
| jsonpCallback                | 在一个 jsonp 中规定回调函数的名称。                          |
| password                     | 规定在 HTTP 访问认证请求中使用的密码。                       |
| processData                  | 布尔值，规定通过请求发送的数据是否转换为查询字符串。默认是 true。 |
| scriptCharset                | 规定请求的字符集。                                           |
| success(*result,status,xhr*) | 当请求成功时运行的函数。                                     |
| timeout                      | 设置本地的请求超时时间（以毫秒计）。                         |
| traditional                  | 布尔值，规定是否使用参数序列化的传统样式。                   |
| type                         | 规定请求的类型（GET 或 POST）。                              |
| url                          | 规定发送请求的 URL。默认是当前页面。                         |
| username                     | 规定在 HTTP 访问认证请求中使用的用户名。                     |
| xhr                          | 用于创建 XMLHttpRequest 对象的函数。                         |

# Layer 弹出层组件
```javascript
特别说明：
事件需自己绑定，以下只展现调用代码。
 
//初体验

layer.alert('内容')
 
//询问框

layer.confirm('您是如何看待前端开发？', {
  btn: ['重要','奇葩'] //按钮
}, function(){
  layer.msg('的确很重要', {icon: 1});
}, function(){
  layer.msg('也可以这样', {
    time: 20000, //20s后自动关闭
    btn: ['明白了', '知道了']
  });
});
 
//提示层

layer.msg('一段提示信息');
 
//墨绿深蓝风

layer.alert('墨绿风格，点击确认看深蓝', {
  skin: 'layui-layer-molv' //样式类名
  ,closeBtn: 0
}, function(){
  layer.alert('偶吧深蓝style', {
    skin: 'layui-layer-lan'
    ,closeBtn: 0
    ,anim: 4 //动画类型
  });
});
//捕获页

layer.open({
  type: 1,
  shade: false,
  title: false, //不显示标题
  content: $('.layer_notice'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
  cancel: function(){
    layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', {time: 5000, icon:6});
  }
});
//页面层

layer.open({
  type: 1,
  skin: 'layui-layer-rim', //加上边框
  area: ['420px', '240px'], //宽高
  content: 'html内容'
});
//自定页

layer.open({
  type: 1,
  skin: 'layui-layer-demo', //样式类名
  closeBtn: 0, //不显示关闭按钮
  anim: 2,
  shadeClose: true, //开启遮罩关闭
  content: '内容'
});
//tips层

layer.tips('Hi，我是tips', '吸附元素选择器，如#id');
//iframe 层

layer.open({
  type: 2,
  title: 'layer mobile页',
  shadeClose: true,
  shade: 0.8,
  area: ['380px', '90%'],
  content: 'mobile/' //iframe的url
}); 
//iframe 层

layer.open({
  type: 2,
  title: '很多时候，我们想最大化看，比如像这个页面。',
  shadeClose: true,
  shade: false,
  maxmin: true, //开启最大化最小化按钮
  area: ['893px', '600px'],
  content: 'https://layui.jianwoo.cn'
});
//加载层

var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
//loading层

var index = layer.load(1, {
  shade: [0.1,'#fff'] //0.1透明度的白色背景
});
//小tips

layer.tips('我是另外一个tips，只不过我长得跟之前那位稍有些不一样。', '吸附元素选择器', {
  tips: [1, '#3595CC'],
  time: 4000
});
//prompt层

layer.prompt({title: '输入任何口令，并确认', formType: 1}, function(pass, index){
  layer.close(index);
  layer.prompt({title: '随便写点啥，并确认', formType: 2}, function(text, index){
    layer.close(index);
    layer.msg('演示完毕！您的口令：'+ pass +'<br>您最后写下了：'+text);
  });
});
//tab层

layer.tab({
  area: ['600px', '300px'],
  tab: [{
    title: 'TAB1', 
    content: '内容1'
  }, {
    title: 'TAB2', 
    content: '内容2'
  }, {
    title: 'TAB3', 
    content: '内容3'
  }]
});
//相册层

$.getJSON('test/photos.json?v='+new Date, function(json){
  layer.photos({
    photos: json //格式见API文档手册页
    ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
  });
});
//显示自动关闭倒计秒数

layer.alert('在标题栏显示自动关闭倒计秒数', {
  time: 5*1000
  ,success: function(layero, index){
    var timeNum = this.time/1000, setText = function(start){
      layer.title((start ? timeNum : --timeNum) + ' 秒后关闭', index);
    };
    setText(!0);
    this.timer = setInterval(setText, 1000);
    if(timeNum <= 0) clearInterval(this.timer);
  }
  ,end: function(){
    clearInterval(this.timer);
  }
});
```

# Layui 表格
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>table模块快速使用</title>
  <link rel="stylesheet" href="/layui/css/layui.css" media="all">
</head>
<body>
 
<table id="demo" lay-filter="test"></table>
 
<script src="/layui/layui.js"></script>
<script>
layui.use('table', function(){
  var table = layui.table;
  
  //第一个实例
  table.render({
    elem: '#demo'
    ,height: 312
    ,url: '../../demo/table/user/-page=1&limit=30.js' //数据接口
    ,page: true //开启分页
    ,cols: [[ //表头
      {field: 'id', title: 'ID', width:80, sort: true, fixed: 'left'}
      ,{field: 'username', title: '用户名', width:80}
      ,{field: 'sex', title: '性别', width:80, sort: true}
      ,{field: 'city', title: '城市', width:80} 
      ,{field: 'sign', title: '签名', width: 177}
      ,{field: 'experience', title: '积分', width: 80, sort: true}
      ,{field: 'score', title: '评分', width: 80, sort: true}
      ,{field: 'classify', title: '职业', width: 80}
      ,{field: 'wealth', title: '财富', width: 135, sort: true}
    ]]
  });
  
});
</script>
</body>
</html>
```

下面是目前 table 模块所支持的全部参数一览表，我们对重点参数进行了的详细说明，你可以点击下述表格最右侧的“示例”去查看

| 参数           | 类型               | 说明                                                         | 示例值                                                       |
| :------------- | :----------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| elem           | String/DOM         | 指定原始 table 容器的选择器或 DOM，方法渲染方式必填          | "#demo"                                                      |
| cols           | Array              | 设置表头。值是一个二维数组。方法渲染方式必填                 | [详见表头参数](https://layuiweb.com/doc/modules/table.html#cols) |
| url（等）      | -                  | 异步数据接口相关参数。其中 url 参数为必填项                  | [详见异步参数](https://layuiweb.com/doc/modules/table.html#async) |
| toolbar        | String/DOM/Boolean | 开启表格头部工具栏区域，该参数支持四种类型值：toolbar: '#toolbarDemo' *//指向自定义工具栏模板选择器*toolbar: '<div>xxx</div>' *//直接传入工具栏模板字符*toolbar: true *//仅开启工具栏，不显示左侧模板*toolbar: 'default' *//让工具栏左侧显示默认的内置模板*注意： 1. 该参数为 layui 2.4.0 开始新增。 2. 若需要“列显示隐藏”、“导出”、“打印”等功能，则必须开启该参数 | false                                                        |
| defaultToolbar | Array              | 该参数可自由配置头部工具栏右侧的图标按钮                     | [详见头工具栏图标](https://layuiweb.com/doc/modules/table.html#defaultToolbar) |
| width          | Number             | 设定容器宽度。table容器的默认宽度是跟随它的父元素铺满，你也可以设定一个固定值，当容器中的内容超出了该宽度时，会自动出现横向滚动条。 | 1000                                                         |
| height         | Number/String      | 设定容器高度                                                 | [详见height](https://layuiweb.com/doc/modules/table.html#height) |
| cellMinWidth   | Number             | （layui 2.2.1 新增）全局定义所有常规单元格的最小宽度（默认：60），一般用于列宽自动分配的情况。其优先级低于表头参数中的 minWidth | 100                                                          |
| done           | Function           | 数据渲染完的回调。你可以借此做一些其它的操作                 | [详见 done 回调](https://layuiweb.com/doc/modules/table.html#done) |
| error          | Function           | 数据请求失败的回调，返回两个参数：错误对象、内容 layui 2.6.0 新增 | -                                                            |
| data           | Array              | 直接赋值数据。既适用于只展示一页数据，也非常适用于对一段已知数据进行多页展示。 | [{}, {}, {}, {}, …]                                          |
| escape         | Boolean            | 是否开启 xss 字符过滤（默认 false）layui 2.6.8 新增          | true                                                         |
| totalRow       | Boolean/String     | 是否开启合计行区域                                           | false                                                        |
| page           | Boolean/Object     | 开启分页（默认：false）。支持传入一个对象，里面可包含 [laypage](https://layuiweb.com/doc/modules/laypage.html#options) 组件所有支持的参数（jump、elem除外） | {theme: '#c00'}                                              |
| limit          | Number             | 每页显示的条数（默认 10）。值需对应 limits 参数的选项。 注意：*优先级低于 page 参数中的 limit 参数* | 30                                                           |
| limits         | Array              | 每页条数的选择项，默认：[10,20,30,40,50,60,70,80,90]。 注意：*优先级低于 page 参数中的 limits 参数* | [30,60,90]                                                   |
| loading        | Boolean            | 是否显示加载条（默认 true）。若为 false，则在切换分页时，不会出现加载条。该参数只适用于 url 参数开启的方式 | false                                                        |
| title          | String             | 定义 table 的大标题（在文件导出等地方会用到）                | "用户表"                                                     |
| text           | Object             | 自定义文本，如空数据时的异常提示等。                         | [详见自定义文本](https://layuiweb.com/doc/modules/table.html#text) |
| autoSort       | Boolean            | 默认 true，即直接由 table 组件在前端自动处理排序。 若为 false，则需自主排序，即由服务端返回排序好的数据 | [详见事件排序](https://layuiweb.com/doc/modules/table.html#onsort) |
| initSort       | Object             | 初始排序状态。 用于在数据表格渲染完毕时，默认按某个字段排序。 | [详见初始排序](https://layuiweb.com/doc/modules/table.html#initSort) |
| id             | String             | 设定容器唯一 id。id 是对表格的数据操作方法上是必要的传递条件，它是表格容器的索引，你在下文诸多地方都将会见识它的存在。  另外，若该参数未设置，则默认从 *<table id="test"></table>* 中的 id 属性值中获取。 | test                                                         |
| skin（等）     | -                  | 设定表格各种外观、尺寸等                                     | [详见表格风格](https://layuiweb.com/doc/modules/table.html#skin) |

cols - 表头参数一览表

相信我，在你还尚无法驾驭 layui table 的时候，你的所有焦点都应放在这里，它带引领你完成许多可见和不可见甚至你无法想象的工作。如果你采用的是方法渲染，cols 是一个二维数组，表头参数设定在数组内；如果你采用的自动渲染，表头参数的设定应放在 *<th>* 标签上

| 参数         | 类型           | 说明                                                         | 示例值                                                       |
| :----------- | :------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| field        | String         | 设定字段名。非常重要，且是表格数据列的唯一标识               | username                                                     |
| title        | String         | 设定标题名称                                                 | 用户名                                                       |
| width        | Number/String  | 设定列宽，若不填写，则自动分配；若填写，则支持值为：数字、百分比。 请结合实际情况，对不同列做不同设定。 | 200 30%                                                      |
| minWidth     | Number         | 局部定义当前常规单元格的最小宽度（默认：60），一般用于列宽自动分配的情况。其优先级高于基础参数中的 cellMinWidth | 100                                                          |
| type         | String         | 设定列类型。可选值有：normal（常规列，无需设定）checkbox（复选框列）radio（单选框列，layui 2.4.0 新增）numbers（序号列）space（空列） | 任意一个可选值                                               |
| LAY_CHECKED  | Boolean        | 是否全选状态（默认：false）。必须复选框列开启后才有效，如果设置 true，则表示复选框默认全部选中。 | true                                                         |
| fixed        | String         | 固定列。可选值有：*left*（固定在左）、*right*（固定在右）。一旦设定，对应的列将会被固定在左或右，不随滚动条而滚动。 注意：*如果是固定在左，该列必须放在表头最前面；如果是固定在右，该列必须放在表头最后面。* | left（同 true） right                                        |
| hide         | Boolean        | 是否初始隐藏列，默认：false。layui 2.4.0 新增                | true                                                         |
|              |                |                                                              |                                                              |
| totalRow     | Boolean/String | 是否开启该列的自动合计功能，默认：false。当开启时，则默认由前端自动合计当前行数据。从 layui 2.5.6 开始： 若接口直接返回了合计行数据，则优先读取接口合计行数据，格式如下：`</>code{  "code": 0,  "totalRow": {    "score": "666"    ,"experience": "999"  },  "data": [{}, {}],  "msg": "",  "count": 1000}              `如上，在 totalRow 中返回所需统计的列字段名和值即可。 另外，totalRow 字段同样可以通过 parseData 回调来解析成为 table 组件所规定的数据格式。从 layui 2.6.3 开始，如果 totalRow 为一个 string 类型，则可解析为合计行的动态模板，如：`</>codetotalRow: '{{ d.TOTAL_NUMS }} 单位'//还比如只取整：'{{ parseInt(d.TOTAL_NUMS) }}'              ` | true                                                         |
| totalRowText | String         | 用于显示自定义的合计文本。layui 2.4.0 新增                   | "合计："                                                     |
|              |                |                                                              |                                                              |
| sort         | Boolean        | 是否允许排序（默认：false）。如果设置 true，则在对应的表头显示排序icon，从而对列开启排序功能。注意：*不推荐对值同时存在“数字和普通字符”的列开启排序，因为会进入字典序比对*。比如：*'贤心' > '2' > '100'*，这可能并不是你想要的结果，但字典序排列算法（ASCII码比对）就是如此。 | true                                                         |
| unresize     | Boolean        | 是否禁用拖拽列宽（默认：false）。默认情况下会根据列类型（type）来决定是否禁用，如复选框列，会自动禁用。而其它普通列，默认允许拖拽列宽，当然你也可以设置 true 来禁用该功能。 | false                                                        |
| edit         | String         | 单元格编辑类型（默认不开启）目前只支持：*text*（输入框）     | text                                                         |
| event        | String         | 自定义单元格点击事件名，以便在 [tool](https://layuiweb.com/doc/modules/table.html#ontool) 事件中完成对该单元格的业务处理 | 任意字符                                                     |
| style        | String         | 自定义单元格样式。即传入 CSS 样式                            | background-color: #5FB878; color: #fff;                      |
| align        | String         | 单元格排列方式。可选值有：*left*（默认）、*center*（居中）、*right*（居右） | center                                                       |
| colspan      | Number         | 单元格所占列数（默认：1）。一般用于多级表头                  | 3                                                            |
| rowspan      | Number         | 单元格所占行数（默认：1）。一般用于多级表头                  | 2                                                            |
| templet      | String         | 自定义列模板，模板遵循 [laytpl](https://layuiweb.com/doc/modules/laytpl.html) 语法。这是一个非常实用的功能，你可借助它实现逻辑处理，以及将原始数据转化成其它格式，如时间戳转化为日期字符等 | [详见自定义模板](https://layuiweb.com/doc/modules/table.html#templet) |
| toolbar      | String         | 绑定工具条模板。可在每行对应的列中出现一些自定义的操作性按钮 | [详见行工具事件](https://layuiweb.com/doc/modules/table.html#onrowtool) |

# Layui 表单

> 在一个容器中设定 *class="layui-form"* 来标识一个表单元素块，通过规范好的HTML结构及CSS类，来组装成各式各样的表单元素，并通过内置的 *form模块* 来完成各种交互。

> 依赖加载模块：[form](https://layui.gitee.io/v2/docs/modules/form.html) （请注意：如果不加载form模块，select、checkbox、radio等将无法显示，并且无法使用form相关功能）

UI的最终呈现得益于 Form模块 的全自动渲染，她将原本普通的诸如select、checkbox、radio等元素重置为你所看到的模样。

## 渲染

尽管 form 会对表单进行自动渲染，但当元素动态插入时，需通过核心方法 *form.render(type, filter)* 来进行渲染。
其中参数 `type`为表单的元素类型，可选。默认对全部类型的表单进行一次渲染。也可指向 type 进行渲染：

| type     | 描述                           |
| :------- | :----------------------------- |
| select   | 渲染 select 选择框             |
| checkbox | 渲染 checkbox 复选框（含开关） |
| radio    | 渲染 radio 单选框框            |

```javascript
// 示例
var form = layui.form;
 
// 一般当表单存在动态生成时，进行渲染
form.render(); // 渲染全部
form.render('select'); //渲染 select 选择框
```

第二个参数 `filter` 为 *class="layui-form"* 所在元素的 *lay-filter=""* 的值。你可以借助该参数，对表单完成区域渲染。

```html
<div class="layui-form" lay-filter="test1">
  …
</div>
      
<script>
layui.use('form', function(){
  var form = layui.form;
 
  // 一般当表单存在动态生成时，进行渲染
  form.render(null, 'test1'); // 渲染所在容器内的全部表单
  form.render('select', 'test1'); // 渲染所在容器内的 select 元素
});
</script>
```

### **定向渲染** - 注：v2.7.0 新增

```html
<div class="layui-form">
  <select id="select-id">
    <option value="a">A</option>
  </select>
</div>
 
<script> 
layui.use('form', function(){
  var $ = layui.$;
  var form = layui.form;
  
  // 定向渲染（一般当表单存在动态生成时，进行渲染）
  form.render($('#select-id')); // 传入需要渲染的相应表单元素的 jQuery 对象 
});
</script>
```

## 属性

事实上在使用表单时，你的一半精力可能会在元素本身上。所以我们把一些基础属性的配置恰恰安放在了标签本身上。如：

```html
<input type="text" lay-verify="email">
<input type="checkbox" checked lay-skin="switch" lay-filter="encrypt" title="是否加密">
<button lay-submit>提交</button>
```

上述 `lay-` 前缀的属性即是表单所能识别的元素属性，他们可以使得一些交互操作交由 form 模块内部处理，或者借助 form 提供的 api 精确操作。目前我们可支持的属性如下表所示：

| 属性名      | 属性值                                                       | 说明                                                         |
| :---------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| title       | 任意字符                                                     | 设定元素名称，一般用于 checkbox、radio 框                    |
| lay-filter  | 任意字符                                                     | 过滤器，主要用于事件匹配                                     |
| lay-search  | default （等同空字符） cs （区分字母大小写）                 | 用于给 select 开启搜索功能。默认不区分字母大小写（注：v2.7.0 新增） |
| lay-skin    | switch（开关风格） primary（原始风格）                       | 定义元素的风格，目前只对 *checkbox* 元素有效，可将其转变为开关样式 |
| lay-ignore  | 任意字符或不设值                                             | 是否忽略元素美化处理。设置后，将不会对该元素进行初始化渲染，即保留系统风格 |
| lay-verify  | required（必填项） phone（手机号） email（邮箱） url（网址） number（数字） date（日期） identity（身份证） 自定义值 | 同时支持多条规则的验证，格式：`lay-verify="验证A|验证B"` 如：`lay-verify="required|phone|number"`  另外，除了我们内置的校验规则，你还可以给他设定任意的值，比如lay-verify="pass"，那么你就需要借助form.verify()方法对pass进行一个校验规则的定义。[详见表单验证](https://layui.gitee.io/v2/docs/modules/form.html#verify) |
| lay-verType | tips（吸附层） alert（对话框） msg（默认）                   | 用于定义异常提示层模式。                                     |
| lay-reqText | 任意字符                                                     | 用于自定义必填项（即设定了 lay-verify="required" 的表单）的提示文本 |
| lay-submit  | 无需填写值                                                   | 绑定触发提交的元素，如button                                 |

## API

```javascript
var form = layui.form; // 获得 form 模块对象
 
form.render(type, filter); // 渲染 - 核心方法
form.validate(elem); // 执行验证，elem 为需要验证的区域选择器或 DOM 对象  注：v2.7.0 新增
form.verify(obj); // 定义表单验证的规则（详见下文）
form.on('event(filter)', callback); // 事件
form.val(filter, object); // 表单赋值或取值。 如果 object 参数存在，则为赋值，否则为取值。
form.submit(filter, callback); // 用于执行指定表单的提交 注：v2.7.0 新增
form.config; // 获取 form 模块的配置信息
form.set(options); // 设置 form 的配置信息
```

## 事件

语法：`form.on('event(filter)', callback);`

| event    | 描述                       |
| :------- | :------------------------- |
| select   | 触发select下拉选择事件     |
| checkbox | 触发checkbox复选框勾选事件 |
| switch   | 触发checkbox复选框开关事件 |
| radio    | 触发radio单选框事件        |
| submit   | 触发表单提交事件           |

默认情况下，事件所触发的是全部的 form 模块元素，但如果你只想触发某一个元素，使用事件过滤器即可。
如：`<select lay-filter="test"></select>`

```javascript
form.on('select(test)', function(data){
  console.log(data);
});
```

### select 事件

下拉选择框被选中时触发，回调函数返回一个object参数，携带两个成员：

```javascript
form.on('select(filter)', function(data){
  console.log(data.elem); //得到select原始DOM对象
  console.log(data.value); //得到被选中的值
  console.log(data.othis); //得到美化后的DOM对象
});
```

请注意：如果你想触发所有的select，去掉过滤器*(filter)*即可。下面将不再对此进行备注。

### checkbox 事件

复选框点击勾选时触发，回调函数返回一个object参数，携带两个成员：

```javascript
form.on('checkbox(filter)', function(data){
  console.log(data.elem); //得到checkbox原始DOM对象
  console.log(data.elem.checked); //是否被选中，true或者false
  console.log(data.value); //复选框value值，也可以通过data.elem.value得到
  console.log(data.othis); //得到美化后的DOM对象
});
```

### switch 事件

开关被点击时触发，回调函数返回一个object参数，携带两个成员：

```javascript
form.on('switch(filter)', function(data){
  console.log(data.elem); //得到checkbox原始DOM对象
  console.log(data.elem.checked); //开关是否开启，true或者false
  console.log(data.value); //开关value值，也可以通过data.elem.value得到
  console.log(data.othis); //得到美化后的DOM对象
});
```

### radio 事件

radio单选框被点击时触发，回调函数返回一个object参数，携带两个成员：

```javascript
form.on('radio(filter)', function(data){
  console.log(data.elem); //得到radio原始DOM对象
  console.log(data.value); //被点击的radio的value值
});
```

### submit 事件

按钮点击或者表单被执行提交时触发，其中回调函数只有在验证全部通过后才会进入，回调返回三个成员：

```javascript
form.on('submit(*)', function(data){
  console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
  console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
  console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
});
```

再次温馨提示：上述的*submit(\*)*中的 *** 号为事件过滤器的值，是在你绑定执行提交的元素时设定的，如：

```html
<button lay-submit lay-filter="*">提交</button>
```

你可以把*号换成任意的值，如：*lay-filter="go"*，但触发事件时也要改成 *form.on('submit(go)', callback);*

### **执行提交方法：**

有时我们未必要通过点击表单内的按钮来进行提交，这时需要用到提交方法：`form.submit(filter, callback);`

```javascript
<div class="layui-form" lay-filter="test1">
  <!-- 表单内部 -->
</div>
 
<button id="testSubmitBtn">任意位置按钮</button>
 
<script>
layui.use('form', function(){ 
  var form = layui.form;
  
  //方法提交
  $('#testSubmitBtn').on('click', function(data){
    form.submit('test1', function(data){ // 注：v2.7.0 新增
      // 回调函数返回结果跟上述 submit 事件完全一致
      var field = data.field;
      // do something
    });
    return false;
  });
});
</script>
```

## 表单赋值 / 取值

语法：*form.val('filter', object);*

用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
注：其中「取值」功能为 layui 2.5.5 开始新增

```javascript
//给表单赋值
form.val("formTest", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
  "username": "贤心" // "name": "value"
  ,"sex": "女"
  ,"auth": 3
  ,"check[write]": true
  ,"open": false
  ,"desc": "我爱layui"
});
 
//获取表单区域所有值
var data1 = form.val("formTest");
```

第二个参数中的键值是表单元素对应的 *name* 和 *value*。

## 表单验证

我们对表单的验证进行了非常巧妙的支持，大多数时候你只需要在表单元素上加上 *lay-verify=""* 属性值即可。如：

```html
<input type="text" lay-verify="email"> 
 
还同时支持多条规则的验证，如下：
<input type="text" lay-verify="required|phone|number">
```

上述对输入框定义了一个邮箱规则的校验，它会在 form 模块内部完成。目前我们内置的校验支持见上文的：[预设元素属性](https://layui.gitee.io/v2/docs/modules/form.html#attr)

### **定义验证规则**

除了内置的校验规则外，你还可以自定义验证规则，通常对于比较复杂的校验，这是非常有必要的。

```javascript
form.verify({
  username: function(value, item){ //value：表单的值、item：表单的DOM对象
    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
      return '用户名不能有特殊字符';
    }
    if(/(^\_)|(\__)|(\_+$)/.test(value)){
      return '用户名首尾不能出现下划线\'_\'';
    }
    if(/^\d+\d+\d$/.test(value)){
      return '用户名不能全为数字';
    }
    
    //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
    if(value === 'xxx'){
      alert('用户名不能为敏感词');
      return true;
    }
  }
  
  //我们既支持上述函数式的方式，也支持下述数组的形式
  //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
  ,pass: [
    /^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'
  ] 
});
```

当你自定义了类似上面的验证规则后，你只需要把 key 赋值给输入框的 *lay-verify* 属性即可：

```html
</>code<input type="text" name="username" lay-verify="username"><input type="password" name="pass" lay-verify="pass"><input type="ch<input type="text" name="username" lay-verify="username">
<input type="password" name="pass" lay-verify="pass">
<input type="checkbox" name="agreement" lay-verify="required" title="同意">eckbox" name="agreement" lay-verify="required" title="同意">
```

当表单提交时，**自动触发验证**

```javascript
var layer = layui.layer;
var form = layui.form;
 
// 提交事件
form.on('submit(*)', function(data){
  var field = data.field;
  
  // 若需验证 checkbox 是否勾选，则需判断其值是否存在，如：
  if(!field.agreement){
    layer.msg('请同意');
    return false;
  }
  
  // 验证均通过后的操作（如 Ajax 提交）
  // …
  
  return false;
});
```

### **主动触发验证**

方法：`form.validate(elem);` 若验证通过返回 true，否则 false

```html
<div class="layui-form">  
  <div class="layui-form-item">
    <label class="layui-form-label">手机</label>
    <div class="layui-input-block">
      <input type="tel" name="phone" lay-verify="required|phone" class="layui-input demo-phone">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">验证码</label>
    <div class="layui-input-inline">
      <input type="text" name="vercode" lay-verify="required" class="layui-input">
    </div>
    <div class="layui-inline"> 
      <button type="button" class="layui-btn layui-btn-primary" lay-on="get-vercode">获取验证码</button>
    </div>
  </div>
</div>
 
<script>
layui.use(['form', 'util'], function(){
  var form = layui.form;
  var layer = layui.layer;
  var util = layui.util;
  
  // 自定义普通事件
  util.on('lay-on', {
    "get-vercode": function(othis){
      var isValid = form.validate('.demo-phone');  // 注：v2.7.0 新增
  
      // 验证通过
      if(isValid){
        layer.msg('手机号验证通过，执行发送验证码的操作');
      }
    }
  });
});
</script>
```

# Layui 日期与时间选择

```javascript
<script>
layui.use('laydate', function(){
  var laydate = layui.laydate;
  
  //常规用法
  laydate.render({
    elem: '#test1'
  });
  
  //国际版
  laydate.render({
    elem: '#test1-1'
    ,lang: 'en'
  });
  
  //年选择器
  laydate.render({
    elem: '#test2'
    ,type: 'year'
  });
  
  //年月选择器
  laydate.render({
    elem: '#test3'
    ,type: 'month'
  });
  
  //时间选择器
  laydate.render({
    elem: '#test4'
    ,type: 'time'
  });
  
  //日期时间选择器
  laydate.render({
    elem: '#test5'
    ,type: 'datetime'
  });
  
  //日期范围
  laydate.render({
    elem: '#test6'
    //设置开始日期、日期日期的 input 选择器
    //数组格式为 2.6.6 开始新增，之前版本直接配置 true 或任意分割字符即可
    ,range: ['#test-startDate-1', '#test-endDate-1']
  });
  
  //年范围
  laydate.render({
    elem: '#test7'
    ,type: 'year'
    ,range: true
  });
  
  //年月范围
  laydate.render({
    elem: '#test8'
    ,type: 'month'
    ,range: true
  });
  
  //时间范围
  laydate.render({
    elem: '#test9'
    ,type: 'time'
    ,range: true
  });
  
  //日期时间范围
  laydate.render({
    elem: '#test10'
    ,type: 'datetime'
    ,range: true
  });
  
  //自定义格式
  laydate.render({
    elem: '#test11'
    ,format: 'yyyy年MM月dd日'
  });
  laydate.render({
    elem: '#test12'
    ,format: 'dd/MM/yyyy'
  });
  laydate.render({
    elem: '#test13'
    ,format: 'yyyyMMdd'
  });
  laydate.render({
    elem: '#test14'
    ,type: 'time'
    ,format: 'H点m分'
  });
  laydate.render({
    elem: '#test15'
    ,type: 'month'
    ,range: '~'
    ,format: 'yyyy-MM'
  });
  laydate.render({
    elem: '#test16'
    ,type: 'datetime'
    ,range: '到'
    ,format: 'yyyy年M月d日H时m分s秒'
  });
  
  //开启公历节日
  laydate.render({
    elem: '#test17'
    ,calendar: true
  });
  
  //自定义重要日
  laydate.render({
    elem: '#test18'
    ,mark: {
      '0-10-14': '生日'
      ,'0-12-31': '跨年' //每年的日期
      ,'0-0-10': '工资' //每月某天
      ,'0-0-15': '月中'
      ,'2017-8-15': '' //如果为空字符，则默认显示数字+徽章
      ,'2099-10-14': '呵呵'
    }
    ,done: function(value, date){
      if(date.year === 2017 && date.month === 8 && date.date === 15){ //点击2017年8月15日，弹出提示语
        layer.msg('这一天是：中国人民抗日战争胜利72周年');
      }
    }
  });
  
  //限定可选日期
  var ins22 = laydate.render({
    elem: '#test-limit1'
    ,min: '2016-10-14'
    ,max: '2080-10-14'
    ,ready: function(){
      ins22.hint('日期可选值设定在 <br> 2016-10-14 到 2080-10-14');
    }
  });
  
  //前后若干天可选，这里以7天为例
  laydate.render({
    elem: '#test-limit2'
    ,min: -7
    ,max: 7
  });
  
  //限定可选时间
  laydate.render({
    elem: '#test-limit3'
    ,type: 'time'
    ,min: '09:30:00'
    ,max: '17:30:00'
    ,btns: ['clear', 'confirm']
  });
  
  //同时绑定多个
  lay('.test-item').each(function(){
    laydate.render({
      elem: this
      ,trigger: 'click'
    });
  });
  
  //初始赋值
  laydate.render({
    elem: '#test19'
    ,value: '2016-10-14'
    ,isInitValue: true
  });
  
  //选中后的回调
  laydate.render({
    elem: '#test20'
    ,done: function(value, date){
      layer.alert('你选择的日期是：' + value + '<br>获得的对象是' + JSON.stringify(date));
    }
  });
  
  //日期切换的回调
  laydate.render({
    elem: '#test21'
    ,change: function(value, date){
      layer.msg('你选择的日期是：' + value + '<br><br>获得的对象是' + JSON.stringify(date));
    }
  });
  //不出现底部栏
  laydate.render({
    elem: '#test22'
    ,showBottom: false
  });
  
  //只出现确定按钮
  laydate.render({
    elem: '#test23'
    ,btns: ['confirm']
  });
  
  //自定义事件
  laydate.render({
    elem: '#test24'
    ,trigger: 'mousedown'
  });
  
  //点我触发
  laydate.render({
    elem: '#test25'
    ,eventElem: '#test25-1'
    ,trigger: 'click'
  });
  
  //双击我触发
  lay('#test26-1').on('dblclick', function(){
    laydate.render({
      elem: '#test26'
      ,show: true
      ,closeStop: '#test26-1'
    });
  });
  
  //日期只读
  laydate.render({
    elem: '#test27'
    ,trigger: 'click'
  });
  
  //非input元素
  laydate.render({
    elem: '#test28'
  });
  
  //墨绿主题
  laydate.render({
    elem: '#test29'
    ,theme: 'molv'
  });
  
  //自定义颜色
  laydate.render({
    elem: '#test30'
    ,theme: '#393D49'
  });
  
  //格子主题
  laydate.render({
    elem: '#test31'
    ,theme: 'grid'
  });
  
  
  //直接嵌套显示
  laydate.render({
    elem: '#test-n1'
    ,position: 'static'
  });
  laydate.render({
    elem: '#test-n2'
    ,position: 'static'
    ,lang: 'en'
  });
  laydate.render({
    elem: '#test-n3'
    ,type: 'month'
    ,position: 'static'
  });
  laydate.render({
    elem: '#test-n4'
    ,type: 'time'
    ,position: 'static'
  });
});
</script>
```

# Layui 上传文件
```javascript
<script>
layui.use(['upload', 'element', 'layer'], function(){
  var $ = layui.jquery
  ,upload = layui.upload
  ,element = layui.element
  ,layer = layui.layer;
  
  //常规使用 - 普通图片上传
  var uploadInst = upload.render({
    elem: '#test1'
    ,url: 'https://httpbin.org/post' //此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
    ,before: function(obj){
      //预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result){
        $('#demo1').attr('src', result); //图片链接（base64）
      });
      
      element.progress('demo', '0%'); //进度条复位
      layer.msg('上传中', {icon: 16, time: 0});
    }
    ,done: function(res){
      //如果上传失败
      if(res.code > 0){
        return layer.msg('上传失败');
      }
      //上传成功的一些操作
      //……
      $('#demoText').html(''); //置空上传失败的状态
    }
    ,error: function(){
      //演示失败状态，并实现重传
      var demoText = $('#demoText');
      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
      demoText.find('.demo-reload').on('click', function(){
        uploadInst.upload();
      });
    }
    //进度条
    ,progress: function(n, elem, e){
      element.progress('demo', n + '%'); //可配合 layui 进度条元素使用
      if(n == 100){
        layer.msg('上传完毕', {icon: 1});
      }
    }
  });
  
  //演示多文件列表
  var uploadListIns = upload.render({
    elem: '#testList'
    ,elemList: $('#demoList') //列表元素对象
    ,url: 'https://httpbin.org/post' //此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
    ,accept: 'file'
    ,multiple: true
    ,number: 3
    ,auto: false
    ,bindAction: '#testListAction'
    ,choose: function(obj){   
      var that = this;
      var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
      //读取本地文件
      obj.preview(function(index, file, result){
        var tr = $(['<tr id="upload-'+ index +'">'
          ,'<td>'+ file.name +'</td>'
          ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
          ,'<td><div class="layui-progress" lay-filter="progress-demo-'+ index +'"><div class="layui-progress-bar" lay-percent=""></div></div></td>'
          ,'<td>'
            ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
            ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
          ,'</td>'
        ,'</tr>'].join(''));
        
        //单个重传
        tr.find('.demo-reload').on('click', function(){
          obj.upload(index, file);
        });
        
        //删除
        tr.find('.demo-delete').on('click', function(){
          delete files[index]; //删除对应的文件
          tr.remove();
          uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
        });
        
        that.elemList.append(tr);
        element.render('progress'); //渲染新加的进度条组件
      });
    }
    ,done: function(res, index, upload){ //成功的回调
      var that = this;
      //if(res.code == 0){ //上传成功
        var tr = that.elemList.find('tr#upload-'+ index)
        ,tds = tr.children();
        tds.eq(3).html(''); //清空操作
        delete this.files[index]; //删除文件队列已经上传成功的文件
        return;
      //}
      this.error(index, upload);
    }
    ,allDone: function(obj){ //多文件上传完毕后的状态回调
      console.log(obj)
    }
    ,error: function(index, upload){ //错误回调
      var that = this;
      var tr = that.elemList.find('tr#upload-'+ index)
      ,tds = tr.children();
      tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
    }
    ,progress: function(n, elem, e, index){ //注意：index 参数为 layui 2.6.6 新增
      element.progress('progress-demo-'+ index, n + '%'); //执行进度条。n 即为返回的进度百分比
    }
  });
  
  //多图片上传
  upload.render({
    elem: '#test2'
    ,url: '' //此处配置你自己的上传接口即可
    ,multiple: true
    ,before: function(obj){
      //预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result){
        $('#demo2').append('<img src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img">')
      });
    }
    ,done: function(res){
      //上传完毕
    }
  });
  
  //指定允许上传的文件类型
  upload.render({
    elem: '#test3'
    ,url: '' //此处配置你自己的上传接口即可
    ,accept: 'file' //普通文件
    ,done: function(res){
      layer.msg('上传成功');
      console.log(res);
    }
  });
  upload.render({ //允许上传的文件后缀
    elem: '#test4'
    ,url: '' //此处配置你自己的上传接口即可
    ,accept: 'file' //普通文件
    ,exts: 'zip|rar|7z' //只允许上传压缩文件
    ,done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
  upload.render({
    elem: '#test5'
    ,url: '' //此处配置你自己的上传接口即可
    ,accept: 'video' //视频
    ,done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
  upload.render({
    elem: '#test6'
    ,url: '' //此处配置你自己的上传接口即可
    ,accept: 'audio' //音频
    ,done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
  
  //设定文件大小限制
  upload.render({
    elem: '#test7'
    ,url: '' //此处配置你自己的上传接口即可
    ,size: 60 //限制文件大小，单位 KB
    ,done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
  
  //同时绑定多个元素，并将属性设定在元素上
  upload.render({
    elem: '.demoMore'
    ,before: function(){
      layer.tips('接口地址：'+ this.url, this.item, {tips: 1});
    }
    ,done: function(res, index, upload){
      var item = this.item;
      console.log(item); //获取当前触发上传的元素，layui 2.1.0 新增
    }
  })
  
  //选完文件后不自动上传
  upload.render({
    elem: '#test8'
    ,url: '' //此处配置你自己的上传接口即可
    ,auto: false
    //,multiple: true
    ,bindAction: '#test9'
    ,done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
  
  //拖拽上传
  upload.render({
    elem: '#test10'
    ,url: 'https://httpbin.org/post' //此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
    ,done: function(res){
      layer.msg('上传成功');
      layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.files.file);
      console.log(res)
    }
  });
  
  //绑定原始文件域
  upload.render({
    elem: '#test20'
    ,url: '' //此处配置你自己的上传接口即可
    ,done: function(res){
      layer.msg('上传成功');
      console.log(res)
    }
  });
  
});
</script>

```

更多支持的参数详见下表，合理的配置它们，应对各式各样的业务需求。



| 参数选项   | 说明                                                         | 类型          | 默认值                   |
| :--------- | :----------------------------------------------------------- | :------------ | :----------------------- |
| elem       | 指向容器选择器，如：elem: '#id'。也可以是DOM对象             | string/object | -                        |
| url        | 服务端上传接口，返回的数据规范请详见下文                     | string        | -                        |
| data       | 请求上传接口的额外参数。如：data: {id: 'xxx'} 从 layui 2.2.6 开始，支持动态值，如:`</>codedata: {  id: function(){    return $('#id').val();  }}` | object        | -                        |
| headers    | 接口的请求头。如：*headers: {token: 'sasasas'}*。注：该参数为 layui 2.2.6 开始新增 |               |                          |
| accept     | 指定允许上传时校验的文件类型，可选值有：*images*（图片）、*file*（所有文件）、*video*（视频）、*audio*（音频） | string        | images                   |
| acceptMime | 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表。如： *acceptMime: 'image/\*'*（只显示图片文件） *acceptMime: 'image/jpg, image/png'*（只显示 jpg 和 png 文件） 注：layui 2.2.6 新增 | string        | images                   |
| exts       | 允许上传的文件后缀。一般结合 *accept* 参数类设定。假设 accept 为 file 类型时，那么你设置 *exts: 'zip\|rar\|7z'* 即代表只允许上传压缩格式的文件。如果 accept 未设定，那么限制的就是图片的文件格式 | string        | jpg\|png\|gif\|bmp\|jpeg |
| auto       | 是否选完文件后自动上传。如果设定 *false*，那么需要设置 *bindAction* 参数来指向一个其它按钮提交上传 | boolean       | true                     |
| bindAction | 指向一个按钮触发上传，一般配合 auto: false 来使用。值为选择器或DOM对象，如：bindAction: '#btn' | string/object | -                        |
| force      | 规定强制返回的数据格式，默认不强制。 若值为 'json'，则强制为 JSON 数据格式 注：layui 2.6.9 新增 | string        | null                     |
| field      | 设定文件域的字段名                                           | string        | file                     |
| size       | 设置文件最大可允许上传的大小，单位 KB。不支持ie8/9           | number        | 0（即不限制）            |
| multiple   | 是否允许多文件上传。设置 *true*即可开启。不支持ie8/9         | boolean       | false                    |
| number     | 设置同时可上传的文件数量，一般配合 multiple 参数出现。 注意：*该参数为 layui 2.2.3 开始新增* | number        | 0（即不限制）            |
| drag       | 是否接受拖拽的文件上传，设置 *false* 可禁用。不支持ie8/9     | boolean       | true                     |
| 回调       |                                                              |               |                          |
| choose     | 选择文件后的回调函数。返回一个object参数，详见下文           | function      | -                        |
| before     | 文件提交上传前的回调。返回一个object参数（同上），详见下文   | function      | -                        |
| done       | 执行上传请求后的回调。返回三个参数，分别为：*res*（服务端响应信息）、*index*（当前文件的索引）、*upload*（重新上传的方法，一般在文件上传失败后使用）。详见下文 | function      | -                        |
| error      | 执行上传请求出现异常的回调（一般为网络异常、URL 404等）。返回两个参数，分别为：*index*（当前文件的索引）、*upload*（重新上传的方法）。详见下文 | function      | -                        |


# 如何判断 JavaScript 对象是否为空

## Object.keys()

```javascript
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
```

## for...in...

```javascript
for (var i in obj) { // 如果不为空，则会执行到这一步，返回true
    return true
}
return false // 如果为空,返回false
```



## JSON.stringify()

```javascript
if (JSON.stringify(data) === '{}') {
    return false // 如果为空,返回false
}
return true // 如果不为空，则会执行到这一步，返回true
```


# Json 数据解析

### JSON.parse()

JSON 通常用于与服务端交换数据。

在接收服务器数据时一般是字符串。

我们可以使用 JSON.parse() 方法将数据转换为 JavaScript 对象。

### 语法

```javascript
JSON.parse(text[, reviver])
```

**参数说明：**

- **text:** 必需， 一个有效的 JSON 字符串。
- **reviver:** 可选，一个转换结果的函数， 将为对象的每个成员调用此函数。

------

## JSON 解析实例

例如我们从服务器接收了以下数据：

```json
{ "name":"runoob", "alexa":10000, "site":"www.runoob.com" }
```

我们使用 JSON.parse() 方法处理以上数据，将其转换为 JavaScript 对象：

```javascript
var obj = JSON.parse('{ "name":"runoob", "alexa":10000, "site":"www.runoob.com" }');
```

## JSON.stringify()

JSON 通常用于与服务端交换数据。

在向服务器发送数据时一般是字符串。

我们可以使用 JSON.stringify() 方法将 JavaScript 对象转换为字符串。

### 语法

```javascript
JSON.stringify(value[, replacer[, space]])
```

**参数说明：**

- value:

  必需， 要转换的 JavaScript 值（通常为对象或数组）。

- replacer:

  可选。用于转换结果的函数或数组。

  如果 replacer 为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：""。

  如果 replacer 是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。当 value 参数也为数组时，将忽略 replacer 数组。

- space:

  可选，文本添加缩进、空格和换行符，如果 space 是一个数字，则返回值文本在每个级别缩进指定数目的空格，如果 space 大于 10，则文本缩进 10 个空格。space 也可以使用非数字，如：\t。

------

## JavaScript 对象转换

例如我们向服务器发送以下数据：

```javascript
var obj = { "name":"runoob", "alexa":10000, "site":"www.runoob.com"};
```

我们使用 JSON.stringify() 方法处理以上数据，将其转换为字符串：

```javascript
var myJSON = JSON.stringify(obj);
```


# JavaScript 删除数组元素

## splice() 方法

```javascript
const array = [2, 5, 9];

console.log(array);

const index = array.indexOf(5);
if (index > -1) {
  array.splice(index, 1); // 第二个参数为删除的次数，设置只删除一次
}

// array = [2, 9]
console.log(array);
```

## delete 关键字

```javascript
var colors = ["red", "blue", "grey", "green"];

delete colors[0];

console.log(colors); // [undefined, "blue", "grey", "green"]
```

