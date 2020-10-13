---
title: Vue 基础知识总结
tags: Vue
categories: Vue
index_img: https://cdn.jsdelivr.net/gh/loquy/loquy.github.io/img/vue.png
abbrlink: 1cd82901
date: 2020-05-23 10:33:22
---
###### 一、常用指令

- v-on 绑定一个事件 缩写 @ 在 methods 类方法里面操作绑定的方法
- v-bind 绑定一个属性 缩写 : 在 data 数据对象里面操作绑定的数据
- v-model 双向绑定通常用于获取 input 框输入的内容，无论那边更改都会同步值
- v-for 基于数组或对象来循环渲染一个列表，语法：
 1.循环数组，index 是数组的索引
   ```javascript
   v-for="(item,index) in items" :key="index"
   ```
   2.循环对象，name 是对象的键值 
   ```javascript
   v-for="(value, name, index) in object" :key="index"
   ```
   3.为什么使用 v-for 时必须添加唯一的 key?
      使用 v-for 更新已渲染的元素列表时，默认用就地复用策略;
      列表数据修改的时候，他会根据 key 值去判断某个值是否修改，如果修改，则重新渲染这一项，否则复用之前的元素
- v-if v-else v-else-if 动态添加或删除元素
- v-show 添加元素的 display 样式控制显示或隐藏
- v-html 输出 html 代码

###### 二、常用属性

属性写法 | 名称 | 作用
:---|:---|:---
data: {}       |数据属性      |  用来存放需要绑定的数据
methods: {}    |事件操作属性  |  用来放定义的事件方法
components: {} |组件属性      |  自定义组件声明
props: {}      |获取父组件数据 |  单向绑定
computed: {}   |计算属性      |  提供相对简单的数据计算
watch: {}      |侦听器        |  观察某一特定question的值  
directives: {} |自定义指令属性 |  注册内部自定义指令
filters: {}    |过滤器        |  自定义过滤器
...

###### 三、文件结构

 ```javascript
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
import otherComponent from './OtherComponent.vue'
export default {
    // 常用属性
    components: {
      // 组件注册
      otherComponent
    },
    data () { 
      return {
        // 自定义数据
        msg: 'Hello world!'
      }
    },    
    create () {
      // 初始化
    },
    mounted () {
      // 挂载
      this.getData()
    },
    methods: {
      // 自定义方法
      getData(){
          console.log('success')
      }
    }
}
</script>

<style>
  .example {
    color: red;
  }
</style>

 ```

 ###### 四、生命周期

![avatar](https://cn.vuejs.org/images/lifecycle.png)