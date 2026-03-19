---
title: 《CTF安全竞赛入门》
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
created: 2026-03-15T16:49
updated: 2026-03-18T14:10
---
# Web
## 信息收集
### 题目2-2 where is the logo
### 考察点：robots.txt文件
附件："C:\Users\glj07\Desktop\题目2-2-Where is logo\index.html"

![](1769499679184-2eebd148-0e9f-40c2-833b-ef9e6026d97a.png)

**第一步：搭建本地Web服务器**

启动一个Web服务器来运行index.html。有几个方法：

`cd "C:\Users\glj07\Desktop\题目2-2-Where is logo"`

**方法1：使用Python内置服务器**

`python -m http.server 80`

**方法2：使用PHP内置服务器**

`php -S 127.0.0.1:80`

**方法3：使用Node.js的http-server**

`npx http-server -p 80`

![](1769567977060-ad057bf3-ef00-4731-9000-48cf19527a81.png)

**第二步：服务器地址**

启动后，服务器地址就是：http://127.0.0.1

**第三步：使用御剑扫描**

![](1769568021383-b66f2669-f81f-48f4-aabb-3b5bf19cc1ee.png)

![](1769568067408-3b56054a-b4bd-4cf8-91bd-9a2ea4ea9fc7.png)

发现下面还有内容。下滑缩放：

![](1769568123798-859035aa-d460-4d36-bd4d-6d2b1c959bf0.png)

看到logo主要以@、#、+字符为主。

编写脚本提取flag

```python
with open(r"C:\Users\glj07\Desktop\题目2-2-Where is logo\robots.txt", 'r') as f:
    char_set = "{}abcdefghijklmnopqrstuvwxyz_0123456789-"
    flag = ""
    for line in f: # 外层循环：逐行读取文件
        for c in line: # 内层循环：逐个字符检查
            if c in char_set: # 判断：字符是否在允许的集合中
                flag += c # 累加：将有效字符添加到flag
    print(flag)
```

venusctf{haha_-_-}

tips：

![](1769581524341-b7e65e22-2bd6-4e3b-9653-b0ce477e3d05.png)

![](1769581573898-127a541a-a304-4753-9550-4807029cf1dd.png)

### 题目2-4 Discuz 3.2
### 考察点：.git文件泄露
通常在使用Git开发项目后会在默认目录中产生一个.git文件夹。Git中有仓库的设置信息，包括电子邮件、用户名等。

题目链接：https://192.168.0.100:802/upload/forum.php

tips：工具脚本GitHack可以利用泄露的.git文件信息将源代码文件下载下来，重建并还原项目代码。

通过御剑等工具扫描，访问得到.git目录。

利用脚本下载源代码 `python GitHack.py http://192.168.0.100.802/.git/`

Discuz3.2版本被披露可以利用UC_KEY泄露从而获取webshell的一个代码注入漏洞。通过该漏洞的利用脚本往192.168.0.100.802这个Discuz站点中写入webshell。UC_KEY值可以在/config/config_ucenter.php目录获取。

返回webshell信息后，使用中国蚁剑连接。查看flag。

## HTTP
### 题目2-5 Careful
### 考察点：HTTP的Response字段
Burpsuite的Proxy Listeners要与浏览器配置的主机地址和端口保持一致，否则流量不会被监听和转发。

记得调至Intercept is on。

打开题目链接，sent to the Repeater。查看响应信息获取flag。

### 题目2-6 你的语言不是阿凡达
### 考察点：Request请求中的language字段
打开题目链接得到提示：Your language are not 阿凡达

这说明需要修改Language字段值。通过抓包对HTTP的Request和Response


