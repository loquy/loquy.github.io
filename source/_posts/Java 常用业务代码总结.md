---
title: Java 常用业务代码总结
category_bar: [Java]
index_img: 'https://www.loquy.cn/images/Java.png'
abbrlink: 3b0faab3
date: 2022-06-10 11:13:27
updated: 2022-06-30 09:30:27
tags: Java
categories: 
- [编程, Java]
description: 整理记录常用 Java 业务代码，以此备忘，持续更新中...
---
# 遍历文件夹下的所有文件
```java
    public static ArrayList<File> readFiles(File file){
        ArrayList<File> list = new ArrayList<>();
        File[] fs = file.listFiles();
        assert fs != null;
        for (File f : fs) {
            // 若是目录，则递归读取
            if (f.isDirectory()) {
                readFiles(f);
            }
            // 若是文件，添加到集合
            if (f.isFile()) {
                list.add(f);
            }
        }
        return list;
    }
```

# 导出Excel
```java
public void exportData(List<Map<String, Object>> data, Map<String, String> headerMap, String title, HttpServletResponse response) {
    // 通过工具类创建writer，默认创建xls格式
    ExcelWriter writer = ExcelUtil.getWriter();
    writer.merge(headerMap.size() - 1, title);
    for (Map<String, Object> stringObjectMap : data) {
        List<String> removeKeys = new LinkedList<>();
        for (String stringObjectKey : stringObjectMap.keySet()) {
            if (!headerMap.containsKey(stringObjectKey)) {
                removeKeys.add(stringObjectKey);
            }
        }
        for (String removeKey : removeKeys) {
            stringObjectMap.remove(removeKey);
        }
    }
    writer.setHeaderAlias(headerMap);
    // 一次性写出内容，使用默认样式，强制输出标题
    writer.write(data, true);
    int i = 0;
    while (i < data.size()) {
        //自动宽度
        writer.autoSizeColumn(i);
        i++;
    }
    //out为OutputStream，需要写出到的目标流
    //response为HttpServletResponse对象
    response.setContentType("application/vnd.ms-excel;charset=utf-8");
    //devices.xls是弹出下载对话框的文件名，不能为中文，中文请自行编码
    try {
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(title + ".xls", "utf-8"));
    } catch (Exception e) {
        e.printStackTrace();
    }
    ServletOutputStream out = null;
    try {
        out = response.getOutputStream();
    } catch (IOException e) {
        e.printStackTrace();
    }
    writer.flush(out);
    // 关闭writer，释放内存
    writer.close();
    //此处记得关闭输出Servlet流
    IoUtil.close(out);
}
```

# 接口接收 Json 数组对象
```java
    @PostMapping("example")
    public void example(@RequestBody List<exampleDto> exampleDtoList) {
    }
```

# 接口通用返回泛型数据的格式
```java
@ApiModel(value = "通用返回格式")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultModel<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "返回状态码（0成功，-1失败）")
    public int code;

    @ApiModelProperty(value = "返回消息")
    public String message;

    @ApiModelProperty(value = "返回数据")
    public T data;

    public static<T> ResultModel<T> success() {
        return new ResultModel<>(ResultEnums.SUCCESS.getCode(), ResultEnums.SUCCESS.getMessage(), null);
    }

 
    public static<T> ResultModel<T> success(T data) {
        return new ResultModel<>(ResultEnums.SUCCESS.getCode(), ResultEnums.SUCCESS.getMessage(), data);
    }


    public static<T> ResultModel<T> success(T data, String message) {
        return new ResultModel<>(ResultEnums.SUCCESS.getCode(), message, data);
    }


    public static<T> ResultModel<T> fail(String message) {
        return new ResultModel<>(ResultEnums.FAIL.getCode(), message, null);
    }


    public static<T> ResultModel<T> fail(int code, String message) {
        return new ResultModel<>(code, message, null);
    }


    public static<T> ResultModel<T> fail(int code, String message, T data) {
        return new ResultModel<>(code, message, data);
    }
}
```

# 开启定时任务
```java
package com.example.cron;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class exampleCron {

    /**
     * 每天凌晨执行一次
     */
    @Scheduled(cron = "1 * * * * ?")
    public void example() {
    }
}

```

# 开启事务
```java
@Transactional(rollbackFor = Exception.class)
```

# 判断多个线程结束
```java
public static void threadIsOver(ArrayList<SearchByTime> threads, long start){
    int size = threads.size();
    HashSet<Object> died = new HashSet<>();
    do {
        for (SearchByTime thread : threads) {
            if (!thread.isAlive()) {
                died.add(thread.getId());
            }
        }
    } while (size != died.size());
    long end = System.currentTimeMillis();
    System.out.println("\033[42m所有线程执行完毕" +
                       "，线程数："+ size +
                       "，用时: " + (end - start) / 1000 + "s" + "\033[0m"
                      );
}
```

```java
package com.example.thread;

public class SearchByTime extends Thread {
    
    @Override
    public void run() {
    }
}

```

# 请求接口
```java
public static JSONArray get(String apiFrom, String startTime, String endTime, String timeType) {
    String baseUrl = "";
    String url = baseUrl + apiFrom
        + "?start_time=" + startTime + "&"
        + "end_time=" + endTime + "&"
        + "time_type=" + timeType;
    url = url.replaceAll(" ", "%20");
    HttpResponse response = HttpRequest.get(url)
        .header("charset", "UTF-8")
        .timeout(60000 * 5)
        .execute();
    JSONObject jsonObject = JSONObject.parseObject(response.body());
    Object code = jsonObject.get("code");
    String msg = (String) jsonObject.get("msg");
    JSONArray data = jsonObject.getJSONArray("result");
    Integer successCode = 2000;
    if (!successCode.equals(code)) {
        logger.info(msg + "\n获取接口数据失败，接口地址：" + url);
        return new JSONArray();
    }
    return data;
}
```

```java
private JSONArray post(String token) {
    JSONObject params = new JSONObject();
    params.put("pageSize", 1000);
    params.put("currentPage", currentPage);
    HttpResponse response = HttpRequest.post(baseUrl + "xx")
        .header("Content-Type", "application/json")
        .header("charset", "UTF-8")
        .header("Authorization", token)
        .body(params.toJSONString())
        .execute();

    JSONObject JsonObject = JSONObject.parseObject(response.body());
    Object code = JsonObject.get("code");
    JSONArray data = JsonObject.getJSONArray("data");
    if (!successCode.equals(code)) {
        logger.info("获取接口数据失败");
    }
    return data;
}
```

# 文件上传下载
```java
package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;

@Controller
public class FileController {

    //@RequestParam("file") 将name=file控件得到的文件封装成CommonsMultipartFile 对象
    //批量上传CommonsMultipartFile则为数组即可
    @RequestMapping("/upload")
    public String fileUpload(@RequestParam("file") CommonsMultipartFile file , HttpServletRequest request) throws IOException {

        //获取文件名 : file.getOriginalFilename();
        String uploadFileName = file.getOriginalFilename();

        //如果文件名为空，直接回到首页！
        if ("".equals(uploadFileName)){
            return "redirect:/index.jsp";
        }
        System.out.println("上传文件名 : "+uploadFileName);

        //上传路径保存设置
        String path = request.getServletContext().getRealPath("/upload");
        //如果路径不存在，创建一个
        File realPath = new File(path);
        if (!realPath.exists()){
            realPath.mkdir();
        }
        System.out.println("上传文件保存地址："+realPath);

        InputStream is = file.getInputStream(); //文件输入流
        OutputStream os = new FileOutputStream(new File(realPath,uploadFileName)); //文件输出流

        //读取写出
        int len=0;
        byte[] buffer = new byte[1024];
        while ((len=is.read(buffer))!=-1){
            os.write(buffer,0,len);
            os.flush();
        }
        os.close();
        is.close();
        return "redirect:/index.jsp";
    }

    /*
     * 采用file.Transto 来保存上传的文件
     */
    @RequestMapping("/upload2")
    public String  fileUpload2(@RequestParam("file") CommonsMultipartFile file, HttpServletRequest request) throws IOException {

        //上传路径保存设置
        String path = request.getServletContext().getRealPath("/upload");
        File realPath = new File(path);
        if (!realPath.exists()){
            realPath.mkdir();
        }
        //上传文件地址
        System.out.println("上传文件保存地址："+realPath);

        //通过CommonsMultipartFile的方法直接写文件（注意这个时候）
        file.transferTo(new File(realPath +"/"+ file.getOriginalFilename()));

        return "redirect:/index.jsp";
    }

    @RequestMapping(value="/download")
    public String downloads(HttpServletResponse response , HttpServletRequest request) throws Exception{
        //要下载的图片地址
        String  path = request.getServletContext().getRealPath("/static");
        String  fileName = "1.jpg";
        System.out.println(path);
        //1、设置response 响应头
        response.reset(); //设置页面不缓存,清空buffer
        response.setCharacterEncoding("UTF-8"); //字符编码
        response.setContentType("multipart/form-data"); //二进制传输数据
        //设置响应头
        response.setHeader("Content-Disposition",
                "attachment;fileName="+ URLEncoder.encode(fileName, "UTF-8"));

        File file = new File(path,fileName);
        //2、 读取文件--输入流
        InputStream input=new FileInputStream(file);
        //3、 写出文件--输出流
        OutputStream out = response.getOutputStream();

        byte[] buff =new byte[1024];
        int index=0;
        //4、执行 写出操作
        while((index= input.read(buff))!= -1){
            out.write(buff, 0, index);
            out.flush();
        }
        out.close();
        input.close();
        return null;
    }
}

```

# 自动生成接口文档
```java
/**
 * Swagger2的接口配置
 * @author loquy
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig
{
    /**
     * 创建API
     */
    @Bean
    public Docket createRestApi()
    {
        return new Docket(DocumentationType.SWAGGER_2)
                // 详细定制
                .apiInfo(apiInfo())
                .select()
                // 指定当前包路径
                .apis(RequestHandlerSelectors.basePackage("com.example.app.api"))
                // 扫描所有 .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build();
    }

    /**
     * 添加摘要信息
     */
    private ApiInfo apiInfo()
    {
        // 用ApiInfoBuilder进行定制
        return new ApiInfoBuilder()
                .title("标题")
                .description("描述")
                .version("版本号:1.01")
                .build();
    }
}
```

# Bean 和 Map 的转换
```java
package com.fjzxdz.ams.module.wryzl.utils;

import org.springframework.cglib.beans.BeanMap;

import java.util.HashMap;
import java.util.Map;

public class HashMapUtils {

    public static int calculateInitialCapacity(int expectedSize) {
        return (int) ((expectedSize / 0.75) + 1);
    }

    public static <T> Map<String, Object> beanToMap(T bean) {
        Map<String, Object> map = new HashMap<>(16);
        if (bean != null) {
            BeanMap beanMap = BeanMap.create(bean);
            for (Object key : beanMap.keySet()) {
                map.put(key + "", beanMap.get(key));
            }
        }
        return map;
    }

    public static <T> T mapToBean(Map<String, Object> map, Class<T> clazz) throws Exception {
        T bean = clazz.newInstance();
        BeanMap beanMap = BeanMap.create(bean);
        beanMap.putAll(map);
        return bean;
    }
}

```

# Oracle中分页查询语句
```java
    public HashMap<String, Object> getPageList(String listSql, String page, String pageSize) {
        List<HashMap<String, Object>> list = simpleDao.getNativeQueryList("SELECT\n" +
                "\t* \n" +
                "FROM\n" +
                "\t(\n" +
                "SELECT\n" +
                "\ta.*,\n" +
                "\tROWNUM rn \n" +
                "FROM\n" +
                "\t(\n" + listSql +
                "\t) a \n" +
                "\t) \n" +
                "WHERE\n" +
                "\trn > ( " + page + " - 1 ) * " + pageSize + " \n" +
                "\tAND rn <= ( " + page + " ) * " + pageSize + "");

        List<HashMap<String, Object>> countList = simpleDao.getNativeQueryList("SELECT\n" +
                "\tcount( * ) total\n" +
                "FROM\n" +
                "\t(\n" + listSql +
                "\t)");

        HashMap<String, Object> map = new HashMap<>(HashMapUtils.calculateInitialCapacity(4));
        map.put("list", list);
        map.put("total", countList.size() > 0 ? countList.get(0).get("total") : 0);
        map.put("page", Integer.valueOf(page));
        map.put("pageSize", Integer.valueOf(pageSize));

        return map;
    }
```

# 构造树形结构

```java
/**
 * Menu list list.
 *
 * @param menu the menu
 * @return the list
 */
public List<Object> menuList(List<TreeEntity> menu) {
    List<Object> list = new ArrayList<>();
    for (TreeEntity treeEntity : menu) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (treeEntity.getPid() == null) {
            menuItem(menu, list, treeEntity, map);
        }
    }
    return list;
}

/**
 * Menu child list.
 *
 * @param menu the menu
 * @param id   the id
 * @return the list
 */
public List<Object> menuChild(List<TreeEntity> menu, String id) {
    List<Object> list = new ArrayList<>();
    for (TreeEntity treeEntity : menu) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (treeEntity.getPid() != null && treeEntity.getPid().equals(id)) {
            menuItem(menu, list, treeEntity, map);
        }
    }
    return list;
}

private void menuItem(
        List<TreeEntity> menu,
        List<Object> list,
        TreeEntity treeEntity,
        Map<String, Object> map
) {
    map.put("uuid", treeEntity.getUuid());
    map.put("name", treeEntity.getName());
    map.put("pid", treeEntity.getPid());
    map.put("open", true);
    List<Object> children = menuChild(menu, treeEntity.getUuid());
    map.put("children", children);
    map.put("isLast", false);
    if (children.size() == 0) {
        map.put("isLast", true);
    }
    map.put("isClick", treeEntity.isClick());
    map.put("remind", treeEntity.getRemind());
    list.add(map);
}
```
