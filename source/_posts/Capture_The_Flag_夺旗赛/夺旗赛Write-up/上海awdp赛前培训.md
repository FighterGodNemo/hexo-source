---
title: 上海awdp赛前培训
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
created: 2026-03-15T16:49
updated: 2026-03-18T09:39
---
AWDP赛制：（Attack,Defense,Web and Pwn）

一般来说，修复比利用更快。

# AWDP Web攻防实战课程讲义
## 一、AWDP赛制介绍
### 1.1 什么是AWDP？
**AWDP**（Attack, Defense, Web and Pwn）是一种综合考核参赛团队攻击、防御技术能力的攻防兼备比赛模式。

简单来说，AWDP与传统CTF的区别在于：

+ **传统CTF**：只有攻击（Break）环节
+ **AWDP**：同时有攻击（Break）和防御（Fix）两个环节

### 1.2 比赛规则
| 环节 | 说明 | 得分方式 |
| --- | --- | --- |
| **Break（攻击）** | 攻击其他队伍的靶机，提交正确的Flag | 证明攻击能力，获得攻击分 |
| **Fix（防御）** | 修复自身靶机的漏洞，提交修复包 | 通过裁判机检查，获得防御分 |


### 1.3 比赛流程
**重要**：Break 和 Fix **没有先后顺序**，可以并行进行，也可以先 Fix 后 Break！

```plain
比赛开始 → 获取题目附件（源代码）
      ↓
分析代码 → 寻找漏洞点
      ↓
┌─────────────────────────────────────┐
│                                     │
↓                                     ↓
Break                          Fix
(构造Payload攻击)              (修复漏洞并打包)
      ↓                             ↓
提交Flag                       提交修复包
      │                             │
└──────────────┬──────────────────┘
               ↓
        裁判机检查
        - Break: 验证Flag正确性
        - Fix: 检查服务正常+漏洞已修复
               ↓
          获得积分
               ↓
        循环进行下一轮
```

**策略建议**：

| 情况 | 建议策略 |
| --- | --- |
| 漏洞明显，修复简单 | **先Fix**，确保防御分到手 |
| 漏洞复杂，攻击困难 | 先尝试Fix，再研究Break |
| 时间紧迫 | 优先Fix，防御分更稳定 |
| 多人团队 | 分工并行，一人Break一人Fix |


### 1.4 重要注意事项
> **警告**：提交次数有限制！
>

+ 假如限制5次提交机会，5次都没check通过，就不允许继续提交了
+ 所以要**谨慎修复**，确保修复包正确再提交
+ **速度很重要**：越早Break/Fix，获得的轮次分数越多

---

## 二、赛前准备
### 2.1 语言环境准备
比赛中常见五种语言的赛题，需要提前准备好环境：

| 语言 | 常用框架 | 准备工作 |
| --- | --- | --- |
| **PHP** | 原生、ThinkPHP、Laravel | 安装PHP环境 |
| **Python** | Flask、Django | 安装Python、pip |
| **Java** | Spring Boot | 安装JDK（多版本8、17等等）   Maven |
| **NodeJS** | Express、Koa | 安装Node.js、npm |
| **Golang** | Gin、Echo | 安装Go环境 |


**建议**：

+ 提前熟悉各语言的打包方式（jar、war、tar.gz等）
+ 了解各框架的build方法

### 2.2 代码片段准备
赛前收集各语言的过滤规则代码，比赛时直接调用，节省时间。

#### PHP过滤代码
```php
<?php
// RCE过滤函数
function wafrce($str){
    return !preg_match("/openlog|syslog|readlink|symlink|popepassthru|stream_socket_server|scandir|assert|pcntl_exec|fwrite|curl|system|eval|assert|flag|passthru|exec|chroot|chgrp|chown|shell_exec|proc_open|proc_get_status|popen|ini_alter|ini_restore/i", $str);
}

// SQL注入过滤函数
function wafsqli($str){
    return !preg_match("/select|and|\*|\x09|\x0a|\x0b|\x0c|\x0d|\xa0|\x00|\x26|\x7c|or|into|from|where|join|sleexml|extractvalue|+|regex|copy|read|file|create|grand|dir|insert|link|server|drop|=|>|<|;|\"|'|^|\|/i", $str);
}

// XSS过滤函数
function wafxss($str){
    return !preg_match("/'|http|\"|`|cookie|<|>|script/i", $str);
}

// 请求URL过滤
if (preg_match('/system|tail|flag|exec|base64/i', $_SERVER['REQUEST_URI'])) {
    die('no!');
}
?>
```

#### Python过滤代码
```python
filter_list = ["&#123;&#123;", "&#125;&#125;", "&#123;%", "%&#125;", "os", "eval", "exec", "system"]
user_input = "用户输入的值"

for keyword in filter_list:
    if keyword in user_input:
        print("Hacker!")
        break
```

#### NodeJS过滤代码
```javascript
const keywords = ["flag", "exec", "read", "open", "ls", "cat", "child_process"];

for (const i of keywords) {
    if (code.includes(i)) {
        console.log("Hacker!");
        break;
    }
}
```

#### Java过滤代码
```java
String[] filterList = {"Runtime", "exec", "ProcessBuilder", "getRuntime"};
String str = "用户输入的值";

for (String s : filterList) {
    if (str.contains(s)) {
        System.out.println("Hacker!");
        break;
    }
}
```

#### Golang过滤代码
```go
filterList := []string{"exec", "Command", "Run", "Start"}
str := "用户输入的值"
for _, s := range filterList {
    if strings.Contains(str, s) {
        fmt.Println("Hacker!")
        break
    }
}
```

### 2.3 通防脚本
> 通防脚本可以在不修改源码的情况下提供一层防护
>

推荐的开源WAF项目：

| 项目名称 | 链接 | 说明 |
| --- | --- | --- |
| awd-watchbird | [https://github.com/leohearts/awd-watchbird](https://github.com/leohearts/awd-watchbird) | PHP通用WAF |
| CTF-WAF | [https://github.com/sharpleung/CTF-WAF](https://github.com/sharpleung/CTF-WAF) | PHP WAF |
| AWD_PHP_WAF | [https://github.com/NonupleBroken/AWD_PHP_WAF](https://github.com/NonupleBroken/AWD_PHP_WAF) | PHP WAF |
| AoiAWD | [https://github.com/DasSecurity-HatLab/AoiAWD](https://github.com/DasSecurity-HatLab/AoiAWD) | 综合AWD平台 |
| k4l0ng_WAF | [https://github.com/dr0op/k4l0ng_WAF](https://github.com/dr0op/k4l0ng_WAF) | ThinkPHP专用 |


### 2.4 Fix包打包方法
比赛通常要求提交`.tar.gz`格式的修复包：

```bash
# Linux打包命令
tar -zcvf fix.tar.gz *
```

#### 各语言重启服务命令
**Python (Flask/Django)**

```bash
#!/bin/sh
cp ./app.py /app/app.py
ps -ef | grep python | grep -v grep | awk '{print $2}' | xargs kill -9
cd /app && nohup python app.py &
```

**PHP**

```bash
#!/bin/sh
cp ./index.php /var/www/html/index.php
# PHP通常由nginx/apache管理，重启web服务即可
service nginx restart
# 或
service apache2 restart
# 或使用php-fpm
service php-fpm restart
```

**Java (Spring Boot)**

```bash
#!/bin/sh
cp ./app.jar /app/app.jar
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9
cd /app && nohup java -jar app.jar &
```

**NodeJS (Express)**

```bash
#!/bin/sh
cp ./app.js /app/app.js
ps -ef | grep node | grep -v grep | awk '{print $2}' | xargs kill -9
cd /app && nohup node app.js &
```

**Golang**

```bash
#!/bin/sh
cp ./main /app/main
ps -ef | grep "./main" | grep -v grep | awk '{print $2}' | xargs kill -9
cd /app && nohup ./main &
```

> **提示**：实际路径和进程名需要根据题目描述调整，比赛时注意查看题目给出的`patch.sh`示例
>

---

## 三、PHP漏洞防御
### 3.1 漏洞扫描工具
#### Seay源代码审计系统
+ **优点**：自动扫描，给出漏洞结果
+ **缺点**：基于正则表达式，存在误报；无法扫描较新的漏洞函数和反序列化

#### D盾
+ **优点**：准确率较高
+ **缺点**：扫描结果不全
+ **建议**：先用D盾扫描，再用Seay补充

### 3.2 Watchbird 通防WAF（推荐）
> **Watchbird** 是一款功能强大的 PHP WAF，支持多种漏洞类型的防御，适合AWDP比赛使用。
>

**项目位置**：`watchbird-x64/watchbird.php`

#### 功能特性
| 防御模块 | 说明 | 配置项 |
| --- | --- | --- |
| **waf_headers** | Headers攻击防御 | 检测恶意Header |
| **waf_ddos** | DDoS防御 | 限制每秒访问次数 |
| **waf_upload** | 文件上传防御 | 白名单后缀检测 |
| **waf_sql** | SQL注入防御 | 黑名单关键字检测 |
| **waf_rce** | 命令执行防御 | 黑名单危险函数检测 |
| **waf_lfi** | 文件包含防御 | 路径遍历检测 |
| **waf_unserialize** | 反序列化防御 | phar/zip协议检测 |
| **waf_flag** | Flag保护 | 拦截flag关键字 |
| **response_content_match** | 响应检测 | 检测响应中的flag特征 |


#### 安装使用
**方法1：自动安装（推荐）**

```bash
# 进入watchbird目录
cd watchbird-x64

# 运行安装脚本（需要root权限）
php watchbird.php --install /var/www/html

# 这会在所有PHP文件头部自动添加:
# <?php include('/tmp/watchbird/watchbird.php');?>
```

**方法2：手动安装**

```php
// 在目标PHP文件最开头添加:
<?php include('/path/to/watchbird.php');?>

// 或者使用auto_prepend_file（php.ini）
auto_prepend_file = /tmp/watchbird/watchbird.php
```

#### 核心配置说明
```php
class configmanager
{
    // Flag路径
    public $flag_path = '/flag';

    // 功能开关 (0=关闭, 1=开启)
    public $waf_headers = 1;      // Headers防御
    public $waf_ddos = 1;         // DDoS防御
    public $waf_upload = 1;       // 上传防御
    public $waf_sql = 1;          // SQL防御
    public $waf_rce = 1;          // RCE防御
    public $waf_lfi = 1;          // 文件包含防御
    public $waf_unserialize = 1;  // 反序列化防御
    public $waf_flag = 1;         // Flag保护

    // DDoS限制
    public $allow_ddos_time = 5;  // 每秒最多5次访问

    // 白名单配置
    public $upload_whitelist = "/jpg|png|gif|txt/i";

    // 黑名单配置
    public $sql_blacklist = "/drop |dumpfile\b|INTO FILE|union select|outfile\b|load_file\b/i";

    public $rce_blacklist = "/`|var_dump|str_rot13|serialize|base64_encode|base64_decode|strrev|eval\(|assert|file_put_contents|fwrite|curl_exec\(|dl\(|readlink|popepassthru|preg_replace|preg_filter|mb_ereg_replace|register_shutdown_function|register_tick_function|create_function|array_map|array_reduce|uasort|uksort|array_udiff|array_walk|call_user_func|array_filter|usort|stream_socket_server|pcntl_exec|passthru|exec\(|system\(|chroot\(|scandir\(|chgrp\(|chown|shell_exec|proc_open|proc_get_status|popen\(|ini_alter|ini_restore|ini_set|LD_PRELOAD|base64 -d/i";
}
```

#### 管理后台使用
```plain
访问地址: http://target/watchbird.php?password=你的密码

功能:
- 查看攻击日志
- 动态开关防御模块
- 修改黑白名单
- 查看flag访问记录
```

#### 关键防御规则详解
**1. SQL注入黑名单**

```php
$sql_blacklist = "/drop |dumpfile\b|INTO FILE|union select|outfile\b|load_file\b|multipoint\(/i";
```

**2. RCE黑名单（核心）**

```php
// 包含所有常见的命令执行和代码执行函数
$rce_blacklist = "/`|var_dump|str_rot13|serialize|base64_encode|base64_decode|strrev|" .
    "eval\(|assert|file_put_contents|fwrite|curl_exec\(|dl\(|readlink|popepassthru|" .
    "preg_replace|preg_filter|mb_ereg_replace|register_shutdown_function|" .
    "register_tick_function|create_function|array_map|array_reduce|uasort|uksort|" .
    "array_udiff|array_walk|call_user_func|array_filter|usort|stream_socket_server|" .
    "pcntl_exec|passthru|exec\(|system\(|chroot\(|scandir\(|chgrp\(|chown|shell_exec|" .
    "proc_open|proc_get_status|popen\(|ini_alter|ini_restore|ini_set|LD_PRELOAD|base64 -d/i";
```

**3. 文件包含防御**

```php
// 检测路径遍历和敏感后缀
if(preg_match("/\.\.|.*\.php[2357]{0,1}|\.phtml/i", $str)){
    // 拦截
}
```

**4. 反序列化防御**

```php
// 检测phar和其他压缩协议
if(preg_match("/phar|zip|compress.bzip2|compress.zlib/i", $str)){
    // 拦截
}
```

**5. Flag保护**

```php
// 检测请求中的flag关键字
if(preg_match("/flag/i", $str)){
    // 返回假flag
    die($config->waf_fake_flag);
}

// 检测响应中的flag特征（需要开启response_content_match）
// 匹配到则返回假flag
```

#### 日志文件说明
| 日志文件 | 说明 |
| --- | --- |
| `all_requests.txt` | 所有访问记录 |
| `web_log.txt` | 详细请求头记录 |
| `under_attack_log.txt` | 攻击记录 |
| `flag_log.txt` | Flag泄露记录 |
| `flag_eye_to_eye.txt` | 直接获取flag的记录 |


#### 比赛中的使用建议
```bash
# 1. 比赛开始后立即安装
php watchbird.php --install /var/www/html

# 2. 检查是否安装成功
grep -r "watchbird" /var/www/html/*.php

# 3. 访问管理后台确认WAF运行正常
curl "http://target/watchbird.php?password=xxx"

# 4. 测试防御效果
curl "http://target/?id=1' union select"  # 应被拦截

# 5. 监控攻击日志
tail -f /tmp/watchbird/log/under_attack_log.txt
```

### 3.3 SQL注入
#### 漏洞代码示例
```php
<?php
if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 危险：直接拼接SQL语句
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);
}
?>
```

#### 修复方法
```php
<?php
// 方法1：使用预处理语句（推荐）
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();

// 方法2：过滤特殊字符
$password = mysqli_real_escape_string($conn, $password);
$username = mysqli_real_escape_string($conn, $username);
?>
```

### 3.3 文件上传
#### 漏洞代码示例
```php
<?php
$uploadDirectory = 'uploads/';
$uploadFile = $uploadDirectory . basename($_FILES['file']['name']);

// 危险：未限制后缀名，可直接上传PHP木马
if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
    echo "文件已成功上传。";
}
?>
```

#### 修复方法
```php
<?php
// 白名单限制后缀名
$allowedExts = array("jpg", "jpeg", "gif", "png", "txt", "pdf");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

if (!in_array($extension, $allowedExts)) {
    die("不允许上传该类型文件！");
}

// 检查MIME类型
$allowedMimes = array("image/jpeg", "image/gif", "image/png");
if (!in_array($_FILES["file"]["type"], $allowedMimes)) {
    die("不允许的文件类型！");
}
?>
```

### 3.4 文件包含
#### 漏洞代码示例
```php
<?php
if (isset($_GET['page'])) {
    $page = $_GET['page'];
    // 危险：用户可控的文件包含
    include($page . '.php');
}
?>
```

#### 修复方法
```php
<?php
// 方法1：白名单限制
$allowedPages = array('home', 'about', 'contact');
if (in_array($page, $allowedPages)) {
    include($page . '.php');
} else {
    die("非法页面！");
}

// 方法2：直接删除include语句（最简单）
// 注释掉或删除整行
?>
```

#### 常见文件包含函数
```php
include()       // 包含并执行文件
include_once()  // 只包含一次
require()       // 必须包含，失败报错
require_once()  // 只包含一次，失败报错
```

### 3.5 命令执行（RCE）
#### 常见危险函数
```php
eval()          // 执行PHP代码
system()        // 执行系统命令
exec()          // 执行外部程序
shell_exec()    // 通过shell执行命令
passthru()      // 执行外部程序并显示输出
`` ` ``         // 反引号也可以执行命令
assert()        // 断言函数，可执行代码
preg_replace()  // /e模式下可执行代码
```

#### 修复方法
```php
<?php
// 最简单的方法：直接删除或注释掉危险函数
// 如果必须保留，添加严格的过滤

$blacklist = ['system', 'exec', 'shell_exec', 'passthru', 'eval', 'assert'];
foreach ($blacklist as $func) {
    if (stripos($code, $func) !== false) {
        die("Hacker!");
    }
}
?>
```

### 3.6 反序列化
#### 漏洞代码
```php
<?php
// unserialize函数是主要漏洞点
$data = unserialize($_GET['data']);
?>
```

#### 修复方法
```php
<?php
// 方法1：直接删除unserialize
// 方法2：使用json代替
$data = json_decode($_GET['data'], true);

// 方法3：添加白名单
class SafeUnserializer {
    private $allowedClasses = ['User', 'Product'];

    public function unserialize($data) {
        return unserialize($data, ['allowed_classes' => $this->allowedClasses]);
    }
}
?>
```

---

## 四、Java漏洞防御
### 4.1 Java项目修复流程
Java题目通常有两种形式：**JAR包**（Spring Boot）和 **WAR包**（传统Web应用）

#### 4.1.1 Spring Boot JAR修复流程（使用JarEditor插件）
**推荐使用IDEA插件 JarEditor**，可以直接在IDEA中编辑JAR包，无需手动解压和重新打包。

**步骤1：安装JarEditor插件**

```plain
IDEA -> Settings -> Plugins -> 搜索 "JarEditor" -> Install -> 重启IDEA
```

**步骤2：用IDEA打开JAR包**

```plain
1. File -> Open -> 选择 app.jar
2. IDEA会自动以项目形式打开jar包
3. 左侧项目结构可以看到jar包内的所有文件
```

**步骤3：反编译并修改代码**

```plain
JAR包结构：
app.jar
├── META-INF/
│   └── MANIFEST.MF
├── BOOT-INF/
│   ├── classes/          # 应用的class文件
│   │   └── com/example/
│   │       └── Controller.class
│   └── lib/              # 依赖的jar包
└── org/                  # Spring Boot启动器

修改步骤：
1. 双击class文件，IDEA会自动反编译显示Java代码
2. 右键class文件 -> "Decompile to Java"（需要安装jadx或其他反编译插件）
3. 创建对应的.java文件，复制反编译代码
4. 修改漏洞代码，添加防御逻辑
5. 编译java文件得到新的class文件
```

**步骤4：使用JarEditor替换class文件**

```plain
方法1：直接替换
1. 在项目视图中右键要替换的class文件
2. 选择 "JarEditor" -> "Replace File"
3. 选择编译后的新class文件
4. 保存jar包

方法2：拖拽替换
1. 直接将新class文件拖拽到jar包对应位置
2. JarEditor会自动处理替换

方法3：使用JarEditor面板
1. 双击jar文件，打开JarEditor面板
2. 找到要修改的class文件
3. 点击 "Add" 或 "Update" 按钮
4. 选择新的class文件
```

**步骤5：保存并验证**

```plain
1. Ctrl+S 或 File -> Save All 保存修改
2. JarEditor会自动更新jar包
3. 运行测试：java -jar app.jar
4. 验证漏洞是否已修复
```

**完整操作示例**

```bash
# 1. IDEA打开jar包
File -> Open -> app.jar

# 2. 查看漏洞代码
# 双击 BOOT-INF/classes/com/example/VulnController.class
# IDEA自动反编译显示代码

# 3. 创建修复代码
# 在项目中创建 src/com/example/VulnController.java
# 复制反编译代码并修改

# 4. 编译
# Build -> Build Project (Ctrl+F9)
# 生成 out/production/.../VulnController.class

# 5. 替换
# 右键原class文件 -> JarEditor -> Replace File
# 选择编译后的新class文件

# 6. 保存jar包
# Ctrl+S 保存
```

**JarEditor常用功能**

| 功能 | 操作 | 说明 |
| --- | --- | --- |
| 查看文件 | 双击文件 | 查看jar包内的文件内容 |
| 替换文件 | 右键 -> JarEditor -> Replace | 用新文件替换jar内的文件 |
| 添加文件 | 右键目录 -> JarEditor -> Add | 向jar包添加新文件 |
| 删除文件 | 右键 -> JarEditor -> Delete | 删除jar包内的文件 |
| 导出文件 | 右键 -> JarEditor -> Export | 导出jar包内的文件 |
| 重新打包 | 右键jar根目录 -> JarEditor -> Save | 保存所有修改 |


**备选方法：命令行操作**

```bash
# 如果没有JarEditor，可以使用传统方法

# 1. 解压jar包
unzip app.jar -d app_jar

# 2. 反编译
jadx -d src BOOT-INF/classes/

# 3. 修改代码并编译
# ...

# 4. 替换class文件
cp target/classes/com/example/Xxx.class app_jar/BOOT-INF/classes/com/example/

# 5. 重新打包
cd app_jar && jar -cf ../app_fixed.jar *
```

#### 4.1.2 使用 java-patch-master 工具修复（推荐）
**java-patch-master** 是一个基于 Javassist 的 AWDP patch 工具，支持：

+ JAR 包修复（Spring Boot）
+ Tomcat classes 文件修复
+ JAR 包内依赖库修复

##### 工具原理
```plain
使用 jar xf 解压 jar 包获取 class 文件
    ↓
使用 Javassist API 修改字节码
    ↓
使用 jar uf 更新原 jar 包
```

##### 快速使用
**步骤1：用IDEA打开项目**

```plain
1. IDEA -> File -> Open -> 选择 java-patch-master 目录
2. 等待Maven自动下载依赖（javassist）
```

**步骤2：修改Main.java编写修复逻辑**

```java
package dev.silente.patch;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;

class ExamplePatch extends PatchCore {

    public ExamplePatch(String jarFilePath) {
        super(jarFilePath);
    }

    @Override
    public void patch(ClassPool pool) {
        try {
            // ===== 修复 JAR 包内的 class =====
            // 语法: new PatchClass("类全名", "class文件前缀")
            // Spring Boot: 前缀为 "BOOT-INF/classes/"
            CtClass c1 = new PatchClass("org.example.controller.VulnController", "BOOT-INF/classes/").getCtClass();
            CtMethod method1 = c1.getDeclaredMethod("vulnMethod");
            // 在方法开头插入过滤代码
            method1.insertBefore("if(input.contains(\"flag\")){throw new Exception(\"Hacker!\");}");


            // ===== 修复 JAR 包内的依赖库 =====
            // 语法: new PatchLibrary("jar包名", "jar包前缀")
            PatchLibrary lib = new PatchLibrary("hessian-4.0.4.jar", "BOOT-INF/lib/");
            CtClass c2 = lib.getCtClass("com.alipay.hessian.NameBlackListFilter");
            CtMethod method2 = c2.getDeclaredMethod("resolve");
            method2.insertBefore("System.out.println(\"patched\");");


            // ===== 修复 Tomcat classes 文件 =====
            // 添加 classes 目录路径（prefix为空字符串）
            // addClassRootPath("/usr/local/tomcat/webapps/ROOT/WEB-INF/classes/");
            // CtClass c3 = new PatchClass("com.ctf.BoardServlet", "").getCtClass();
            // CtMethod method3 = c3.getDeclaredMethod("index");
            // method3.insertBefore("System.out.println(\"patched\");");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        // 创建 patch 实例，传入要修复的 jar 包路径
        PatchCore patch = new ExamplePatch("example/vulnspringboot-1.0-SNAPSHOT.jar");

        // 如果是 Tomcat classes，添加 classRootPath
        // patch.addClassRootPath("/usr/local/tomcat/webapps/ROOT/WEB-INF/classes/");
        // patch.setCleanAfterPatch(false);  // Tomcat模式需要设置为false

        patch.run();
    }
}
```

**步骤3：运行修复**

```plain
1. 修改 Main.java 中的 jar 包路径
2. 编写修复逻辑（在 patch 方法中）
3. 运行 Main.java
4. 生成 xxx_patch.jar 文件
```

##### Javassist 常用API
```java
// 获取类
CtClass cc = pool.get("com.example.TargetClass");

// 获取方法
CtMethod method = cc.getDeclaredMethod("methodName");
CtMethod[] methods = cc.getDeclaredMethods();

// 在方法开头插入代码
method.insertBefore("System.out.println(\"before\");");

// 在方法结尾插入代码
method.insertAfter("System.out.println(\"after\");");

// 替换方法体
method.setBody("System.out.println(\"new body\");");

// 在指定行号插入代码
method.insertAt(10, "System.out.println(\"line 10\");");

// 添加新方法
CtMethod newMethod = CtNewMethod.make(
    "public void newMethod(){System.out.println(\"new\");}",
    cc
);
cc.addMethod(newMethod);

// 获取字段
CtField field = cc.getDeclaredField("fieldName");

// 添加字段
CtField newField = new CtField(CtClass.intType, "newField", cc);
cc.addField(newField);
```

##### 常见修复场景示例
**场景1：修复命令执行漏洞**

```java
@Override
public void patch(ClassPool pool) {
    try {
        CtClass cc = new PatchClass("com.example.CmdController", "BOOT-INF/classes/").getCtClass();
        CtMethod method = cc.getDeclaredMethod("execute");
        // 直接替换方法体，禁止命令执行
        method.setBody("throw new RuntimeException(\"Command execution disabled\");");
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

**场景2：修复反序列化漏洞**

```java
@Override
public void patch(ClassPool pool) {
    try {
        CtClass cc = new PatchClass("com.example.DeserializeController", "BOOT-INF/classes/").getCtClass();
        CtMethod method = cc.getDeclaredMethod("deserialize");

        // 在方法开头添加黑名单检查
        method.insertBefore(
            "String[] blacklist = {\"Runtime\", \"ProcessBuilder\", \"getRuntime\"};" +
            "for(String s : blacklist){" +
            "    if(data.contains(s)) throw new Exception(\"Hacker!\");" +
            "}"
        );
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

**场景3：修复SQL注入**

```java
@Override
public void patch(ClassPool pool) {
    try {
        CtClass cc = new PatchClass("com.example.UserController", "BOOT-INF/classes/").getCtClass();
        CtMethod method = cc.getDeclaredMethod("query");

        // 在方法开头添加参数过滤
        method.insertBefore(
            "if(username.contains(\"'\") || username.contains(\"--\") || username.contains(\"or\")){" +
            "    throw new Exception(\"SQL Injection detected!\");" +
            "}"
        );
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

**场景4：修复Tomcat classes**

```java
public class Main {
    public static void main(String[] args) throws Exception {
        // Tomcat classes 不需要传入 jar 路径，传空字符串或任意路径
        PatchCore patch = new ExamplePatch("");

        // 添加 Tomcat classes 路径
        patch.addClassRootPath("/usr/local/tomcat/webapps/ROOT/WEB-INF/classes/");

        // 必须设置为 false，否则会删除生成的 patch 文件
        patch.setCleanAfterPatch(false);

        patch.run();

        // 修复后的 class 文件在 patch/ 目录下
        // 手动复制到 Tomcat 对应目录即可
    }
}
```

##### 常用反编译工具
| 工具 | 链接 | 说明 |
| --- | --- | --- |
| **jadx** | [https://github.com/skylot/jadx](https://github.com/skylot/jadx) | 推荐，支持apk/jar/war，有GUI |
| **jd-gui** | [http://java-decompiler.github.io/](http://java-decompiler.github.io/) | 经典工具，简单易用 |
| **cfr** | [https://github.com/leibnitz27/cfr](https://github.com/leibnitz27/cfr) | 支持最新Java特性 |
| **fernflower** | IDEA内置反编译器 | 命令行工具 |
| **jclasslib** | [https://github.com/ingokegel/jclasslib](https://github.com/ingokegel/jclasslib) | 字节码编辑器 |


#### 4.1.4 修复后验证
```bash
# 1. 本地测试
# JAR包
java -jar app.jar

# WAR包（需要Tomcat）
cp app.war /path/to/tomcat/webapps/
/path/to/tomcat/bin/startup.sh

# 2. 检查服务是否正常启动
curl http://localhost:8080/

# 3. 测试漏洞是否已修复
# 尝试原来的攻击payload，确认无法利用
```

### 4.2 反序列化漏洞
#### 漏洞代码示例
```java
@PostMapping("/deserialize")
public DataObject deserializeBase64(@RequestBody String base64Data) {
    try {
        byte[] data = Base64.getDecoder().decode(base64Data);

        // 危险：直接使用ObjectInputStream反序列化
        try (ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data))) {
            return (DataObject) ois.readObject();
        }
    } catch (IOException | ClassNotFoundException e) {
        throw new RuntimeException("Failed to deserialize object", e);
    }
}
```

#### 漏洞原理
反序列化时会执行目标类的`readObject()`方法，如果该方法含有高危代码，或者可以构造出高危漏洞利用链，就会导致RCE。

#### 修复方法
**步骤1：创建MyObjectInputStream.java（黑名单过滤类）**

```java
import java.io.*;
import java.util.ArrayList;

public class MyObjectInputStream extends ObjectInputStream {
    private static ArrayList<String> blackList = new ArrayList();

    public MyObjectInputStream(InputStream inputStream) throws Exception {
        super(inputStream);
    }

    protected ObjectStreamClass readClassDescriptor() throws IOException, ClassNotFoundException {
        ObjectStreamClass readDesc = super.readClassDescriptor();

        for(String className : blackList) {
            if (readDesc.getName().contains(className)) {
                throw new InvalidClassException("bad hacker!");
            }
        }
        return readDesc;
    }

    static {
        // 常见反序列化利用链黑名单
        blackList.add("javax.management.BadAttributeValueExpException");
        blackList.add("com.sun.syndication.feed.impl.ToStringBean");
        blackList.add("java.security.SignedObject");
        blackList.add("com.sun.rowset.JdbcRowSetImpl");

        // Apache Commons Collections
        blackList.add("org.apache.commons.collections.functors.InvokerTransformer");
        blackList.add("org.apache.commons.collections.functors.InstantiateTransformer");
        blackList.add("org.apache.commons.collections4.functors.InvokerTransformer");

        // Apache Commons Beanutils
        blackList.add("org.apache.commons.beanutils.BeanComparator");

        // Spring Framework
        blackList.add("org.springframework.aop.framework.JdkDynamicAopProxy");
        blackList.add("org.springframework.transaction.jta.JtaTransactionManager");

        // 其他危险类
        blackList.add("sun.reflect.annotation.AnnotationInvocationHandler");
        blackList.add("java.rmi.MarshalledObject");
        blackList.add("com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet");
        blackList.add("com.alibaba.fastjson");
        blackList.add("POJONode");
    }
}
```

**步骤2：修改业务代码使用安全的ObjectInputStream**

```java
@PostMapping("/deserialize")
public DataObject deserializeBase64(@RequestBody String base64Data) {
    try {
        byte[] data = Base64.getDecoder().decode(base64Data);

        // 修复：使用自定义的安全反序列化器
        try (ObjectInputStream ois = new MyObjectInputStream(new ByteArrayInputStream(data))) {
            return (DataObject) ois.readObject();
        }
    } catch (IOException | ClassNotFoundException e) {
        throw new RuntimeException("Failed to deserialize object", e);
    }
}
```

### 4.3 命令执行（RCE）
#### 常见危险函数
```java
Runtime.getRuntime().exec(var);           // 执行系统命令
java.lang.ProcessBuilder("xxx").start();  // 进程构建器
new java.lang.UNIXProcess("xxx");         // UNIX进程
```

#### 反射调用（特殊）
```java
clazz.getDeclaredMethod   // 获取方法
method.invoke             // 调用方法
```

#### 修复方法
```java
// 最简单的方法：直接删除或注释掉危险代码
// 如果必须保留，添加严格的输入验证
```

### 4.4 使用 AWD-AWDP_SecFilters 快速修复（推荐）
**AWD-AWDP_SecFilters** 是一套现成的 Java/PHP 安全过滤器集合，开箱即用。

**项目位置**：`AWD-AWDP_SecFilters-main/`

#### 支持的漏洞类型
| 漏洞类型 | Java | PHP |
| --- | --- | --- |
| SQL注入 | ✅ | ✅ |
| XSS | ✅ | - |
| 文件上传 | ✅ | ✅ |
| Log4j2 | ✅ | - |
| Fastjson | ✅ | - |
| SSRF | ✅ | - |
| 路径遍历 | ✅ | ✅ |
| XXE | - | ✅ |
| RCE | - | ✅ |
| 文件包含 | - | ✅ |


#### 4.5.1 Java Filter 使用方法
**步骤1：将Filter文件复制到项目中**

```plain
项目目录/
├── src/main/java/
│   └── com/example/
│       ├── controller/
│       └── filter/        # 创建filter目录
│           ├── SqliFilter.java
│           ├── XSSFilter.java
│           ├── SSRFilter.java
│           └── Log4j2Filter.java
```

**步骤2：注册Filter（Spring Boot）**

```java
// 方法1：使用注解方式
@Component
@WebFilter(urlPatterns = "/*", filterName = "sqlInjectFilter")
public class SqliFilter implements Filter {
    // Filter实现
}

// 方法2：在启动类中注册
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public FilterRegistrationBean<SqliFilter> sqlFilter() {
        FilterRegistrationBean<SqliFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new SqliFilter());
        registration.addUrlPatterns("/*");
        registration.setName("sqlFilter");
        return registration;
    }
}
```

**步骤3：使用JarEditor将编译后的Filter加入JAR包**

```plain
1. 编译项目，生成filter的class文件
2. 使用JarEditor将filter目录添加到JAR包
3. 确保Spring能扫描到Filter（检查@ComponentScan配置）
```

#### 4.5.2 各类Filter详解
**SQL注入过滤器**

```java
@Component
@WebFilter(urlPatterns = "/*", filterName = "sqlInjectFilter")
public class SqliFilter implements Filter {

    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        Enumeration params = request.getParameterNames();
        String sql = "";
        while (params.hasMoreElements()) {
            String name = params.nextElement().toString();
            String[] value = request.getParameterValues(name);
            for (int i = 0; i < value.length; i++) {
                sql = sql + value[i];
            }
        }
        if (sqlValidate(sql)) {
            throw new IOException("您发送请求中的参数中含有非法字符");
        } else {
            chain.doFilter(request, response);
        }
    }

    public static boolean sqlValidate(String str) {
        str = str.toLowerCase();
        String badStr = "select|update|and|or|delete|insert|truncate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute|table|union|extractvalue|updatexml|floor|sleep";
        String[] badStrs = badStr.split("\\|");
        for (int i = 0; i < badStrs.length; i++) {
            if (str.indexOf(badStrs[i]) >= 0) {
                return true;
            }
        }
        return false;
    }
}
```

**XSS过滤器**

```java
public class XSSFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        chain.doFilter(new XssHttpServletRequestWrapper(httpServletRequest), response);
    }
}

class XssHttpServletRequestWrapper extends HttpServletRequestWrapper {

    private String cleanXSS(String value) {
        value = value.replaceAll("\\(", "& #40;").replaceAll("\\)", "& #41;");
        value = value.replaceAll("'", "& #39;");
        value = value.replaceAll("eval\\((.*)\\)", "");
        value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
        value = value.replaceAll("script", "");
        value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        return value;
    }
}
```

**SSRF过滤器**

```java
public class SSRFilter implements Filter {

    public static boolean ssrfValidate(String str) {
        str = str.toLowerCase();
        // 禁止危险协议
        String badStr = "file|http|jar|gopher|tar|war|netdoc|ldap|rmi|dict";
        String[] badStrs = badStr.split("\\|");
        for (int i = 0; i < badStrs.length; i++) {
            if (str.indexOf(badStrs[i]) >= 0) {
                return true;
            }
        }
        return false;
    }
}
```

**Log4j2过滤器**

```java
public class Log4j2Filter implements Filter {

    public static boolean log4jValidate(String str) {
        str = str.toLowerCase();
        String badStr = "$|$$|jndi|rmi|ldap|{|}|\\$\\{";
        String[] badStrs = badStr.split("\\|");
        for (int i = 0; i < badStrs.length; i++) {
            if (str.indexOf(badStrs[i]) >= 0) {
                return true;
            }
        }
        return false;
    }
}
```

**路径遍历过滤器**

```java
public class PathFilter {

    private static Pattern FilePattern = Pattern.compile("[\\s\\.:?<>|]");

    public static String filenameFilter(String str) {
        return str == null ? null : FilePattern.matcher(str).replaceAll("");
    }

    private static String fileNameValidate(String str) {
        String strInjectListStr = "../|./|/..| |<|>|:|?";
        if (null != strInjectListStr && !"".equals(strInjectListStr)) {
            str = str.toLowerCase();
            String[] badStrs = strInjectListStr.split("\\|");
            for (int i = 0; i < badStrs.length; i++) {
                if (str.indexOf(badStrs[i]) >= 0) {
                    str = str.replace(badStrs[i], "");
                }
            }
        }
        return str;
    }
}
```

**Fastjson过滤器**

```java
public class FastjsonFilter {

    public static boolean fastjsonValidate(String input) {
        String pattern = ".*rmi.*|.*jndi.*|.*ldap.*|.*\\\\x.*";
        Pattern p = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE);
        return p.matcher(input).matches();
    }

    // 或直接关闭AutoType
    // ParserConfig.getGlobalInstance().setAutoTypeSupport(false);
}
```

#### 4.5.3 PHP Filter 使用方法
**项目位置**：`AWD-AWDP_SecFilters-main/PHP/`

**通用过滤规则（推荐在入口文件引入）**

```php
<?php
// filters.php - 通用过滤函数集合

// SQL注入 + XSS + RCE 综合过滤
function waf($s) {
    if (preg_match("/select|sleep|extractvalue|updatexml|floor|sleep|table|flag|union|update|and|or|delete|insert|truncate|char|substr|ascii|declare|exec|count|master|into|drop|execute|table|\\\$|'|\"|--|#|\\\\0|into|alert|img|prompt|set/is", $s) || strlen($s) > 1000) {
        return false;
    }
    return true;
}

// 检查所有输入
foreach ($_GET as $key => $value) {
    if (!waf($value)) {
        die('Hacker!');
    }
}

foreach ($_POST as $key => $value) {
    if (!waf($value)) {
        die('Hacker!');
    }
}
```

**SQL注入过滤**

```php
<?php
// 检查URL参数
if (preg_match('/system|tail|flag|exec|base64|select|union|and|or/i', $_SERVER['REQUEST_URI'])) {
    die('no!');
}

// 检查POST参数
$str = "";
foreach ($_POST as $key => $value) {
    $str .= $key . $value;
}
if (preg_match("/system|tail|flag|exec|base64|select|union|and|or|sleep|extractvalue|updatexml/i", $str)) {
    die('no!');
}
```

**RCE过滤**

```php
<?php
// 白名单：仅允许字母和数字
$username = $_POST['username'];
$password = $_POST['password'];

$pattern = '/^[a-zA-Z0-9]+$/';

if (!preg_match($pattern, $username) || !preg_match($pattern, $password)) {
    echo "用户名和密码只允许包含字母和数字。";
    exit;
}
```

**文件上传过滤**

```php
<?php
// 允许上传的文件类型（白名单）
$allowedExtensions = array("jpg", "jpeg", "png", "gif");

// 获取文件的扩展名
$extension = pathinfo($file["name"], PATHINFO_EXTENSION);

// 检查文件类型是否允许上传
if (!in_array(strtolower($extension), $allowedExtensions)) {
    die("只允许上传以下类型的文件: " . implode(", ", $allowedExtensions));
}

// 检查上传文件是否为真实的图像文件
if (getimagesize($file["tmp_name"]) === false) {
    die("上传文件不是有效的图像文件。");
}

// 生成唯一的文件名
$uniqueFileName = uniqid() . "." . $extension;
```

**文件包含过滤**

```php
<?php
// 白名单方式
$allowedPages = array("about", "contact", "home");

$page = $_GET['page'];

if (in_array($page, $allowedPages)) {
    include($page . ".php");
} else {
    echo "无效的页面。";
}
```

**路径遍历过滤**

```php
<?php
$file = $_GET['file'];

$rootDirectory = '/var/www/html/';

// 检查路径是否在允许的目录内
if (strpos(realpath($file), $rootDirectory) === false) {
    echo "访问被拒绝。";
    exit;
}

// 或使用字符串替换
$file = str_replace(array("../", "./", "..\\", ".\\"), "", $file);
```

**XXE过滤**

```php
<?php
$xmlData = file_get_contents('php://input');

// 禁用外部实体加载
libxml_disable_entity_loader(true);

// 安全解析XML
$xml = simplexml_load_string($xmlData);
```

#### 4.5.4 快速使用清单
**Java项目**

```plain
1. 复制需要的Filter到项目
2. 修改 @WebFilter urlPatterns 指向漏洞路由
3. 编译项目
4. 使用JarEditor将Filter加入JAR包
5. 重启服务测试
```

**PHP项目**

```plain
1. 在入口文件（index.php）最开头引入过滤文件
   include 'filters.php';

2. 或在漏洞文件开头添加过滤代码

3. 测试确保正常功能不受影响
```

---

## 五、Python漏洞防御
### 5.1 SSTI（服务端模板注入）
#### 漏洞代码示例
```python
from flask import Flask, request
app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        word = request.form.get("word")

    # 危险：用户输入直接传入模板渲染
    result = render_template_string(content % (str(ip), str(port), str(word)))
    return result
```

#### 识别特征
看到以下函数，且参数用户可控：

+ `render_template_string()`
+ `render_template()`
+ `Template()`

#### 修复方法
```python
# 方法1：过滤模板语法
if '&#123;&#123;' in word or '&#125;&#125;' in word or '&#123;%' in word or '%&#125;' in word:
    word = "Hacker!"

# 方法2：使用沙箱模式
from jinja2 import sandbox
```

> **说明**：过滤掉 `&#123;&#123;`、`&#125;&#125;`、`&#123;%`、`%&#125;` 可以很大程度上防止SSTI
>

### 5.2 反序列化漏洞
#### 漏洞代码示例
```python
from flask import Flask, request, jsonify
import base64
import pickle

app = Flask(__name__)

@app.route('/deserialize', methods=['POST'])
def deserialize():
    data_base64 = request.get_json().get('data')

    data_bytes = base64.b64decode(data_base64)

    # 危险：pickle.loads反序列化用户输入
    data = pickle.loads(data_bytes)

    return jsonify({'data': data}), 200
```

#### 修复方法
```python
import pickle
import io
import builtins

# 定义安全的类白名单
safe_builtins = {'range', 'complex', 'set', 'frozenset', 'slice'}

class RestrictedUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        # 只允许白名单中的类
        if module == "builtins" and name in safe_builtins:
            return getattr(builtins, name)
        raise pickle.UnpicklingError("global '%s.%s' is forbidden" % (module, name))

def restricted_loads(s):
    return RestrictedUnpickler(io.BytesIO(s)).load()

# 使用安全的反序列化函数
data = restricted_loads(data_bytes)
```

### 5.3 命令执行（RCE）
#### 常见危险函数
```python
os.system()      # 执行系统命令
os.popen()       # 打开管道
subprocess.*     # 子进程模块
eval()           # 执行Python表达式
exec()           # 执行Python代码
__import__()     # 导入模块
```

#### 漏洞代码示例
```python
from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/execute', methods=['POST'])
def execute_command():
    command = request.get_json().get('command')

    # 危险：直接执行用户输入的命令
    result = os.system(command)

    return jsonify({'result': result}), 200
```

#### 修复方法
```python
# 最简单的方法：直接删除危险函数调用
# 如果必须保留，添加严格的白名单验证

import shlex

def safe_command(cmd):
    # 只允许特定命令
    allowed_commands = ['ls', 'pwd', 'whoami']
    parts = shlex.split(cmd)
    if parts[0] not in allowed_commands:
        raise ValueError("Command not allowed")
    return subprocess.run(parts, capture_output=True)
```

---

## 六、NodeJS漏洞防御
### 6.1 原型链污染
#### 漏洞代码示例
```javascript
const merge = (a, b) => {
  for (var attr in b) {
    if (isObject(a[attr]) && isObject(b[attr])) {
      merge(a[attr], b[attr]);
    } else {
      a[attr] = b[attr];  // 危险：递归合并，可能污染原型链
    }
  }
  return a
}

const clone = (a) => {
  return merge({}, a);
}
```

#### 漏洞原理
当用户可以控制`__proto__`、`constructor`、`prototype`等属性时，可以通过递归合并函数污染Object的原型，影响整个应用。

#### 修复方法
```javascript
function containsPrototypePollution(obj) {
    for (let key in obj) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            return true;
        }
    }
    return false;
}

// 在合并前检查
if (containsPrototypePollution(userInput)) {
    throw new Error("Prototype pollution detected!");
}
```

### 6.2 vm沙箱逃逸
#### 漏洞代码示例
```javascript
const { VM } = require('vm2');
const vm = new VM();

app.all('/sandbox', (req, res) => {
    const code = req.query.code || '';

    // 危险：直接执行用户代码
    result = vm.run(code);
    res.render('sandbox', { result });
})
```

#### 修复方法
```javascript
const keywords = ["flag", "exec", "read", "open", "ls", "cat", "child_process", "constructor", "prototype"];

for (const i of keywords) {
    if (code.includes(i)) {
        result = "Hacker!";
        return res.render('sandbox', { result });
    }
}

result = vm.run(code);
```

---

## 七、实战案例复盘
### 7.1 案例1：rceIt（NodeJS）
#### 题目信息
+ **题目类型**：NodeJS沙箱逃逸
+ **漏洞点**：`/sandbox` 路由直接执行用户代码

#### 漏洞代码
```javascript
app.all('/sandbox', (req, res) => {
    if (req.session.userInfo.logined != true || req.session.userInfo.username != "admin") {
        return res.redirect("/login")
    }

    const code = req.query.code || '';
    result = vm.run((code));  // 危险点
    res.render('sandbox', { result });
})
```

#### 修复方案
```javascript
app.all('/sandbox', (req, res) => {
    if (req.session.userInfo.logined != true || req.session.userInfo.username != "admin") {
        return res.redirect("/login")
    }

    const code = req.query.code || '';
    const keywords = ["flag", "exec", "read", "open", "ls", "cat"];

    for (const i of keywords) {
        if (code.includes(i)) {
            result = "Hacker!";
            return res.render('sandbox', { result });
        }
    }

    result = vm.run((code));
    res.render('sandbox', { result });
})
```

### 7.2 案例2：search_engine（Python SSTI）
#### 题目信息
+ **题目类型**：Python Flask SSTI
+ **漏洞点**：`render_template_string` 直接渲染用户输入

#### 漏洞代码
```python
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'POST' and request.form.get("word"):
        word = request.form.get("word")
        if not waf(word):
            word = "Hacker!"
    else:
        word = ""

    # 危险：用户输入直接渲染
    return render_template_string(content % (str(ip), str(port), str(word)))
```

#### 原始WAF
```python
def waf(data):
    blackwords=['message','listdir','self','url_for','_','"',"os","read","cat","more","`","[","]","class","config","+","eval","exec","join","import","popen","system","header","arg","form","os","read","write","flag","ls","ll","sort","nl","",";",":","\\"]
    for blackword in blackwords:
        if blackword in data:
            return False
    return True
```

#### 修复方案
```python
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == 'POST' and request.form.get("word"):
        word = request.form.get("word")

        # 添加额外的过滤层
        filter_list = ["{", "(", "lipsum", "attr", "cycler", "joiner", "namespace"]
        for i in filter_list:
            if i in word:
                word = "Hacker!"
                break

        if not waf(word):
            word = "Hacker!"
    else:
        word = ""

    return render_template_string(content % (str(ip), str(port), str(word)))
```

---

## 八、通用防御技巧与总结
### 8.1 防御优先级
```plain
1. 找到漏洞点 → 定位危险函数
2. 分析漏洞类型 → 确定修复方案
3. 最简单修复 → 删除/注释危险代码
4. 复杂修复 → 添加过滤/使用安全函数
5. 测试验证 → 确保服务正常运行
```

### 8.2 常见危险函数速查表
| 语言 | 漏洞类型 | 危险函数 |
| --- | --- | --- |
| PHP | RCE | `eval`, `system`, `exec`, `shell_exec`, `passthru`, `assert` |
| PHP | 文件包含 | `include`, `require`, `include_once`, `require_once` |
| PHP | 反序列化 | `unserialize` |
| Java | RCE | `Runtime.exec()`, `ProcessBuilder`, `UNIXProcess` |
| Java | 反序列化 | `ObjectInputStream.readObject()` |
| Python | RCE | `os.system`, `eval`, `exec`, `subprocess` |
| Python | SSTI | `render_template_string`, `Template` |
| Python | 反序列化 | `pickle.loads`, `yaml.load` |
| NodeJS | 原型链污染 | `__proto__`, `constructor`, `prototype` |
| NodeJS | RCE | `vm.run`, `eval`, `Function` |


### 8.3 修复原则
1. **最小改动原则**：只修复漏洞，不改动其他功能
2. **保持服务正常**：修复后服务必须能正常运行
3. **不要过度防御**：可能导致正常功能异常，Check失败
4. **快速迭代**：先提交一个简单修复，后续再优化

### 8.4 比赛策略
```plain
1. 团队分工
   - Web手负责Web题
   - Pwn手负责Pwn题
   - 有人专门负责防御

2. 时间分配
   - 前期：快速分析，尽早Break/Fix
   - 中期：优化防御，稳定拿分
   - 后期：冲击难题，拉开差距

3. 风险控制
   - 提交前测试修复包
   - 保留原始代码备份
   - 关注公告和提示

4. 心态调整
   - 能防不代表能打，反之亦然
   - 修复通常比攻击容易
   - 不要一直纠结攻击，多看看防御
```

### 8.5 常用工具清单
| 工具 | 用途 | 链接 |
| --- | --- | --- |
| Seay | PHP代码审计 | - |
| D盾 | PHP代码审计 | - |
| Watchbird | PHP通防 | [https://github.com/leohearts/awd-watchbird](https://github.com/leohearts/awd-watchbird) |
| jadx | Java反编译 | [https://github.com/skylot/jadx](https://github.com/skylot/jadx) |
| jd-gui | Java反编译 | [http://java-decompiler.github.io/](http://java-decompiler.github.io/) |
| cfr | Java反编译 | [https://github.com/leibnitz27/cfr](https://github.com/leibnitz27/cfr) |


### 8.6 总结
> **核心要点**：
>
> 1. AWDP比赛要同时关注攻击和防御
> 2. 赛前准备好各语言的过滤代码和工具
> 3. 找到漏洞点后，最简单的修复就是删除危险代码
> 4. 复杂的漏洞可以使用通防脚本
> 5. 提交次数有限，谨慎修复
> 6. 速度很重要，越早Break/Fix分数越高
>

---

## 参考资料
1. [CTF线下赛AWDP总结 - 5ime](https://5ime.cn/awdp.html)
2. [awdp-web-小白 - kaikaix](https://kaikaix.github.io/2024/06/12/awdp-web-%E5%B0%8F%E7%99%BD/)
3. [AWD攻防赛之各类漏洞FIX方案 - Qftm](https://qftm.github.io/2019/08/03/AWD-Bugs-Fix/)
4. [从零学习AWD比赛指导手册 - AabyssZG](https://blog.zgsec.cn/archives/484.html)
