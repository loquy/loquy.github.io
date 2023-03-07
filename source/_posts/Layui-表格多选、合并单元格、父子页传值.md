---
title: Layui 表格多选、合并单元格、父子页传值
abbrlink: daa035a1
category_bar:
  - JavaScript
tags:
  - JQuery
  - Layui
  - JavaScript
categories:
  - [编程, JavaScript]
index_img: /images/layui.jpg
description: Layui 表格自定义多选和合并单元格以及 layer 弹窗父子页相互传值。
date: 2022-11-18 17:43:00
updated: 2022-11-18 17:43:00
---

Layui 表格多选、合并单元格、父子页传值的页面效果如下：

<iframe  
height=500
width=100%
src="html/layui-demo-2.html"  
frameborder=0  
allowfullscreen>
</iframe>

# 表格多选

使用 templet 自定义列模板，实现表格中添加下拉多选。

- 方式一：模板中用原生 select 标签进行渲染，以及用 Laytpl 模板引擎处理逻辑进行回显数据。

```javascript
    function initTable() {
        layui.use('table', function () {
            selectHtml = '<select name="sign" lay-filter="sign" sign="{{d.sign}}"">' +
                '<option selected="selected" disabled="disabled"  style="display: none" value=""></option>';
            selectData.forEach(function (item, index) {
                // 回显数据
                selectHtml += '{{# if(d.sign==\'' + item.name + '\'){}}';
                selectHtml += '<option value="' + item.value + '" selected>' + item.name + '</option>';
                selectHtml += '{{#  } else { }}';
                selectHtml += '<option value="' + item.value + '">' + item.name + '</option>';
                selectHtml += '{{#  } }}';
            })
            selectHtml += '</select>';

            layui.table.render({
                elem: '#demo',
                page: true, //开启分页
                cols: [
                    [ //表头
                        {field: 'id', title: 'ID', align: "center"},
                        {field: 'username', title: '用户名', align: "center"},
                        {field: 'sex', title: '性别', align: "center"},
                        {
                            field: 'sign', title: '爱好', minWidth: 150, align: "center", templet: stringToHTML(selectHtml)
                        },
                        {field: 'classify', title: '职业', align: "center"},
                        { title: '操作', minWidth: 100, align: "center", toolbar: '#barDemo'}
                    ]
                ],
                data: init ? initData : tableData,
                done: function (res) {
                    //修改一些css样式, 这里虽然能够使用, 但是还是不太友好, 努力中...
                    var cells = document.querySelectorAll('div[lay-id="demo"] .layui-table-cell');
                    for (var i = 0; i < cells.length; i++) {
                        cells[i].style.overflow = 'unset';
                        cells[i].style.height = 'auto';
                    }
                    //合并单元格
                    merge(res);
                }
            });

        });
    }

```

- 方式二：模板中用 xmSelect.js 下拉组件进行渲染。

```javascript
    function initTable() {
        layui.use('table', function () {
            layui.table.render({
                elem: '#demo',
                page: true, //开启分页
                cols: cols,
                data: init ? initData : tableData,
                done: function (res) {
                    //修改一些css样式, 这里虽然能够使用, 但是还是不太友好, 努力中...
                    var cells = document.querySelectorAll('div[lay-id="demo"] .layui-table-cell');
                    for (var i = 0; i < cells.length; i++) {
                        cells[i].style.overflow = 'unset';
                        cells[i].style.height = 'auto';
                    }
                    //渲染多选
                    res.data.forEach(item => {
                        var xm = xmSelect.render({
                            el: '#XM-' + item.id,
                            autoRow: true,
                            model: {type: 'fixed'},
                            data: [
                                {name: '张三', value: 1},
                                {name: '李四', value: 2},
                                {name: '王五', value: 3},
                            ]
                        })

                        item.__xm = xm;
                    })
                }
            });

        });
    }
```

# 合并单元格

- 具体思路就是, 通过循环判断每一行的每一列的返回值与上一行的相同列是否相同, 
- 如果相同就进行行合并 rowspan: mark, 然后把当前行的当前列进行隐藏, 
- 如果不相同就就记下当前行的行号, 并把标记 mark 重置为1。

```javascript
    // 合并单元格
    function merge(res) {
        var data = res.data;
        var mergeIndex = 0;//定位需要添加合并属性的行数
        var mark = 1; //这里涉及到简单的运算，mark是计算每次需要合并的格子数
        var columsName = ['sex', 'classify'];// 需要合并的列名称
        var columsIndex = [2, 4];//需要合并的列索引值
        for (var k = 0; k < columsName.length; k++) { //这里循环所有要合并的列
            var trArr = $(".layui-table-body>.layui-table").find("tr");//所有行
            for (var i = 1; i < res.data.length; i++) { //这里循环表格当前的数据
                var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]);//获取当前行的当前列
                var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]);//获取相同列的第一列
                if (data[i][columsName[k]] === data[i - 1][columsName[k]]) { //后一行的值与前一行的值做比较，相同就需要合并
                    mark += 1;
                    tdPreArr.each(function () {//相同列的第一列增加rowspan属性
                        $(this).attr("rowspan", mark);
                    });
                    tdCurArr.each(function () {//当前行隐藏
                        $(this).css("display", "none");
                    });
                } else {
                    mergeIndex = i;
                    mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
                }
            }
            mergeIndex = 0;
            mark = 1;
        }
    }

```

# 父子页传值

- 获取子页面的 window 对象，从而对子页面进行赋值变量和调用方法。

```javascript
    //触发单元格工具事件
    layui.table.on('tool(demo)', function (obj) {
        if (obj.event === 'open') {
            layer.open({
                type: 2,
                area: ['80%', '80%'],
                content: 'layui-demo-1.html',
                btn: ['更换子数据', '重置子数据'],
                btnAlign: 'c',
                success: function (layero, index) {
                    var w = $(layero).find("iframe")[0].contentWindow;
                    w.cols[0].push({fixed: 'right', title: '操作', minWidth: 180, align: "center", toolbar: '#barDemo'});
                    w.init = false;
                    w.initTable();
                },
                yes: function (index, layero) {
                    var w = $(layero).find("iframe")[0].contentWindow;
                    w.init = false;
                    w.tableData = [
                        {
                            "id": 10000,
                            "username": "user-0",
                            "sex": "女",
                            "sign": "签名-0",
                            "experience": 255,
                            "classify": "作家",
                        }
                    ];
                    w.initTable();
                }, btn2: function (index, layero) {
                    var w = $(layero).find("iframe")[0].contentWindow;
                    w.init = true;
                    w.initTable();
                    return false;
                }
            });
        }
    });

```

- 在子页面获取 parent 父级对象，从而对父页面进行赋值变量和调用方法。

```javascript
    //触发单元格工具事件
    layui.table.on('tool(demo)', function (obj) {
        if (obj.event === 'edit') {
            parent.tableData = [
                {
                    "id": 10000,
                    "username": "user-0",
                    "sex": "女",
                    "sign": "签名-0",
                    "experience": 255,
                    "classify": "作家",
                }
            ];
            parent.init = false;
            parent.initTable();
        } else if (obj.event === 'reset') {
            parent.init = true;
            parent.initTable();
        }
    })
```

# 完整代码

<details>
  <summary>点击查看父页面代码</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>demo</title>
    <!-- 引入 layui.css -->
    <link href="../js/layui-v2.7.6/layui/css/layui.css" rel="stylesheet">
</head>
<body>
<table id="demo" lay-filter="demo"></table>
</body>
<!-- 引入 layui.js -->
<script src="../js/layui-v2.7.6/layui/layui.js"></script>
<script src="../js/jquery-3.6.1.min.js"></script>
<script id="barDemo" type="text/html">
    <a class="layui-btn layui-btn-xs" lay-event="open">打开子页面</a>
</script>
</html>
```

```javascript
<script>
    var selectHtml = '';
    var stringToHTML = function (str) {
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    }
    var init = false;
    var initData = [
        {
            "id": 10000,
            "username": "user-0",
            "sex": "女",
            "sign": "张三",
            "experience": 255,
            "classify": "作家",
        },
        {
            "id": 10001,
            "username": "user-1",
            "sex": "男",
            "sign": "李四",
            "experience": 884,
            "classify": "词人",
        },
        {
            "id": 10002,
            "username": "user-2",
            "sex": "女",
            "sign": "王五",
            "experience": 650,
            "classify": "酱油",
        },
        {
            "id": 10003,
            "username": "user-3",
            "sex": "女",
            "sign": "张三",
            "experience": 362,
            "classify": "诗人",
        },
        {
            "id": 10004,
            "username": "user-4",
            "sex": "男",
            "sign": "张三",
            "experience": 807,
            "classify": "作家",
        },
        {
            "id": 10005,
            "username": "user-5",
            "sex": "女",
            "sign": "张三",
            "experience": 173,
            "classify": "作家",
        },
        {
            "id": 10006,
            "username": "user-6",
            "sex": "女",
            "sign": "张三",
            "experience": 982,
            "classify": "作家",
        },
        {
            "id": 10007,
            "username": "user-7",
            "sex": "男",
            "sign": "张三",
            "experience": 727,
            "classify": "作家",
        },
        {
            "id": 10008,
            "username": "user-8",
            "sex": "男",
            "sign": "张三",
            "experience": 951,
            "classify": "词人",
        },
        {
            "id": 10009,
            "username": "user-9",
            "sex": "女",
            "sign": "张三",
            "experience": 484,
            "classify": "词人",
        }
    ];
    var tableData = initData;
    var selectData = [
        {name: '张三', value: 1},
        {name: '李四', value: 2},
        {name: '王五', value: 3},
    ]

    initTable();

    function initTable() {
        layui.use('table', function () {
            selectHtml = '<select name="sign" lay-filter="sign" sign="{{d.sign}}"">' +
                '<option selected="selected" disabled="disabled"  style="display: none" value=""></option>';
            selectData.forEach(function (item, index) {
                // 回显数据
                selectHtml += '{{# if(d.sign==\'' + item.name + '\'){}}';
                selectHtml += '<option value="' + item.value + '" selected>' + item.name + '</option>';
                selectHtml += '{{#  } else { }}';
                selectHtml += '<option value="' + item.value + '">' + item.name + '</option>';
                selectHtml += '{{#  } }}';
            })
            selectHtml += '</select>';

            layui.table.render({
                elem: '#demo',
                page: true, //开启分页
                cols: [
                    [ //表头
                        {field: 'id', title: 'ID', align: "center"},
                        {field: 'username', title: '用户名', align: "center"},
                        {field: 'sex', title: '性别', align: "center"},
                        {
                            field: 'sign', title: '爱好', minWidth: 150, align: "center", templet: stringToHTML(selectHtml)
                        },
                        {field: 'classify', title: '职业', align: "center"},
                        { title: '操作', minWidth: 100, align: "center", toolbar: '#barDemo'}
                    ]
                ],
                data: init ? initData : tableData,
                done: function (res) {
                    //修改一些css样式, 这里虽然能够使用, 但是还是不太友好, 努力中...
                    var cells = document.querySelectorAll('div[lay-id="demo"] .layui-table-cell');
                    for (var i = 0; i < cells.length; i++) {
                        cells[i].style.overflow = 'unset';
                        cells[i].style.height = 'auto';
                    }
                    //合并单元格
                    merge(res);
                }
            });

        });
    }

    layui.use('form', function () {
        // 监听下拉框编辑
        layui.form.on('select(sign)', function (data) {
            var sign = data.elem.getAttribute("sign");
            layui.layer.alert(sign + '：' + data.value)
        })
    });

    //触发单元格工具事件
    layui.table.on('tool(demo)', function (obj) {
        if (obj.event === 'open') {
            layer.open({
                type: 2,
                area: ['80%', '80%'],
                content: 'layui-demo-1.html',
                btn: ['更换子数据', '重置子数据'],
                btnAlign: 'c',
                success: function (layero, index) {
                    var w = $(layero).find("iframe")[0].contentWindow;
                    w.cols[0].push({fixed: 'right', title: '操作', minWidth: 180, align: "center", toolbar: '#barDemo'});
                    w.init = false;
                    w.initTable();
                },
                yes: function (index, layero) {
                    var w = $(layero).find("iframe")[0].contentWindow;
                    w.init = false;
                    w.tableData = [
                        {
                            "id": 10000,
                            "username": "user-0",
                            "sex": "女",
                            "sign": "签名-0",
                            "experience": 255,
                            "classify": "作家",
                        }
                    ];
                    w.initTable();
                }, btn2: function (index, layero) {
                    var w = $(layero).find("iframe")[0].contentWindow;
                    w.init = true;
                    w.initTable();
                    return false;
                }
            });
        }
    });
    // 合并单元格
    function merge(res) {
        var data = res.data;
        var mergeIndex = 0;//定位需要添加合并属性的行数
        var mark = 1; //这里涉及到简单的运算，mark是计算每次需要合并的格子数
        var columsName = ['sex', 'classify'];// 需要合并的列名称
        var columsIndex = [2, 4];//需要合并的列索引值
        for (var k = 0; k < columsName.length; k++) { //这里循环所有要合并的列
            var trArr = $(".layui-table-body>.layui-table").find("tr");//所有行
            for (var i = 1; i < res.data.length; i++) { //这里循环表格当前的数据
                var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]);//获取当前行的当前列
                var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]);//获取相同列的第一列
                if (data[i][columsName[k]] === data[i - 1][columsName[k]]) { //后一行的值与前一行的值做比较，相同就需要合并
                    mark += 1;
                    tdPreArr.each(function () {//相同列的第一列增加rowspan属性
                        $(this).attr("rowspan", mark);
                    });
                    tdCurArr.each(function () {//当前行隐藏
                        $(this).css("display", "none");
                    });
                } else {
                    mergeIndex = i;
                    mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
                }
            }
            mergeIndex = 0;
            mark = 1;
        }
    }
</script>
```
</details>


<details>
  <summary>点击查看子页面页面代码</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>demo</title>
    <!-- 引入 layui.css -->
    <link href="../js/layui-v2.7.6/layui/css/layui.css" rel="stylesheet">
</head>
<body>
<table id="demo" lay-filter="demo"></table>
</body>
<!-- 引入 layui.js -->
<script src="../js/layui-v2.7.6/layui/layui.js"></script>
<script src="../js/xm-select-v1.2.4/dist/xm-select.js"></script>
<script src="../js/jquery-3.6.1.min.js"></script>
<script id="barDemo" type="text/html">
    <a class="layui-btn layui-btn-xs" lay-event="edit">更换父数据</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="reset">重置父数据</a>
</script>

</html>
```

```javascript
<script>
    var init = false;
    var initData = [
        {
            "id": 10000,
            "username": "user-0",
            "sex": "女",
            "sign": "签名-0",
            "experience": 255,
            "classify": "作家",
        },
        {
            "id": 10001,
            "username": "user-1",
            "sex": "男",
            "sign": "签名-1",
            "experience": 884,
            "classify": "词人",
        },
        {
            "id": 10002,
            "username": "user-2",
            "sex": "女",
            "sign": "签名-2",
            "experience": 650,
            "classify": "酱油",
        },
        {
            "id": 10003,
            "username": "user-3",
            "sex": "女",
            "sign": "签名-3",
            "experience": 362,
            "classify": "诗人",
        },
        {
            "id": 10004,
            "username": "user-4",
            "sex": "男",
            "sign": "签名-4",
            "experience": 807,
            "classify": "作家",
        },
        {
            "id": 10005,
            "username": "user-5",
            "sex": "女",
            "sign": "签名-5",
            "experience": 173,
            "classify": "作家",
        },
        {
            "id": 10006,
            "username": "user-6",
            "sex": "女",
            "sign": "签名-6",
            "experience": 982,
            "classify": "作家",
        },
        {
            "id": 10007,
            "username": "user-7",
            "sex": "男",
            "sign": "签名-7",
            "experience": 727,
            "classify": "作家",
        },
        {
            "id": 10008,
            "username": "user-8",
            "sex": "男",
            "sign": "签名-8",
            "experience": 951,
            "classify": "词人",
        },
        {
            "id": 10009,
            "username": "user-9",
            "sex": "女",
            "sign": "签名-9",
            "experience": 484,
            "classify": "词人",
        }
    ];
    var tableData = initData;
    var cols = [
        [ //表头
            {field: 'id', title: 'ID', align: "center"},
            {field: 'username', title: '用户名', align: "center"},
            {field: 'sex', title: '性别', align: "center"},
            {
                field: 'sign', title: '爱好', minWidth: 150, align: "center", templet: function (d) {
                    return '<div id="XM-' + d.id + '" ></div>'
                }
            },
            {field: 'classify', title: '职业', align: "center"},
        ]
    ];

    initTable();

    function initTable() {
        layui.use('table', function () {
            layui.table.render({
                elem: '#demo',
                page: true, //开启分页
                cols: cols,
                data: init ? initData : tableData,
                done: function (res) {
                    //修改一些css样式, 这里虽然能够使用, 但是还是不太友好, 努力中...
                    var cells = document.querySelectorAll('div[lay-id="demo"] .layui-table-cell');
                    for (var i = 0; i < cells.length; i++) {
                        cells[i].style.overflow = 'unset';
                        cells[i].style.height = 'auto';
                    }
                    //渲染多选
                    res.data.forEach(item => {
                        var xm = xmSelect.render({
                            el: '#XM-' + item.id,
                            autoRow: true,
                            model: {type: 'fixed'},
                            data: [
                                {name: '张三', value: 1},
                                {name: '李四', value: 2},
                                {name: '王五', value: 3},
                            ]
                        })

                        item.__xm = xm;
                    })
                }
            });

        });
    }

    //触发单元格工具事件
    layui.table.on('tool(demo)', function (obj) {
        if (obj.event === 'edit') {
            parent.tableData = [
                {
                    "id": 10000,
                    "username": "user-0",
                    "sex": "女",
                    "sign": "签名-0",
                    "experience": 255,
                    "classify": "作家",
                }
            ];
            parent.init = false;
            parent.initTable();
        } else if (obj.event === 'reset') {
            parent.init = true;
            parent.initTable();
        }
    })

    $(function () {
        //表格滚动时 重新计算位置
        document.querySelector('.layui-table-body').addEventListener('scroll', () => {
            xmSelect.get().forEach(function (item) {
                item.calcPosition();
            })
        })
    })
</script>
```
</details>
