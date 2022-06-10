---
title: JavaScript 常用业务代码总结
category_bar: true
index_img: 'https://www.loquy.cn/images/JavaScript.png'
abbrlink: 9296f96c
date: 2022-06-10 11:13:52
updated: 2022-06-10 11:13:52
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

# ajax 执行异步的 http 请求方法
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

# layer 弹出层组件
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

# layui 表格
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
