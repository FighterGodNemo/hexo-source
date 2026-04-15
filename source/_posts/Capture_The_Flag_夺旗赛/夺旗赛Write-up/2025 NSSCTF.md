---
title: 2025 NSSCTF
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/2025 NSSCTF/
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - NSSCTF
tags:
  - CTF
  - WriteUp
  - NSSCTF
created: 2026-03-15T16:49
updated: 2026-04-15T13:54
---

## [BJDCTF_2020]Easy

附件：easy.exe

无壳程序，直接分析即可

![](2025 NSSCTF/file-20260331130230842.png)

## [CryptoCTF_2020]One_Line_Crypto

![](2025 NSSCTF/file-20260331130230861.png)

```python
from Crypto.Util.number import *
from secret import m, n, x, y, flag

p, q = x**(m+1) - (x+1)**m, y**(n+1) - (y+1)**n
assert isPrime(p) and isPrime(q) and p < q < p << 3 and len(bin(p*q)[2:]) == 2048
enc = bytes_to_long(flag)
print(pow(enc, 0x10001, p*q))
```

enc文件：14608474132952352328897080717325464308438322623319847428447933943202421270837793998477083014291941466731019653023483491235062655934244065705032549531016125948268383108879698723118735440224501070612559381488973867339949208410120554358243554988690125725017934324313420395669218392736333195595568629468510362825066512708008360268113724800748727389663826686526781051838485024304995256341660882888351454147057956887890382690983135114799585596506505555357140161761871724188274546128208872045878153092716215744912986603891814964771125466939491888724521626291403272010814738087901173244711311698792435222513388474103420001421

## [M1r4n]冰蝎的秘密

#### #流量分析 #Webshell流量
##### 题目描述：在一次网络安全的挑战中，你截获了一段神秘的冰蝎流量。据说这段流量中隐藏着重要的信息。你能解开这个谜团，找出隐藏在流量中的秘密吗？
解答：

![](2025 NSSCTF/file-20260331130230820.png)

流量包损坏。需要修复

 法一：CTFNetA修复

法二：使用pcapfix修复

法三：使用010 editor，与正常流量对照手动修复

## [SWPUCTF_2021_新生赛]easy_sql

[http://node4.anna.nssctf.cn:28049/](http://node4.anna.nssctf.cn:28049/)

## [SWPUCTF_2021_新生赛]ez_caesar

#凯撒密码 #Base家族 #古典密码

```python
import base64
def caesar(plaintext):
    str_list = list(plaintext)
    i = 0
    while i < len(plaintext):
        if not str_list[i].isalpha():
            str_list[i] = str_list[i]
        else:
            a = "A" if str_list[i].isupper() else "a"
            str_list[i] = chr((ord(str_list[i]) - ord(a) + 5) % 26 + ord(a) or 5)
        i = i + 1

    return ''.join(str_list)

flag = "*************************"
str = caesar(flag)
print(str)

#str="U1hYSFlLe2R0em1mYWpwc3RiaGZqeGZ3fQ=="
```

NSSCTF{youhaveknowcaesar}
![](2025 NSSCTF/file-20260331130230871.png)

## [SWPUCTF_2021_新生赛]jicao

```php
<?php
  highlight_file('index.php');
include("flag.php");
$id=$_POST['id'];// 从 POST 请求中获取 id 参数
$json=json_decode($_GET['json'],true);// 从 GET 请求的 json 参数中解析 JSON 数据为数组
// 判断条件：
if ($id=="wllmNB"&&$json['x']=="wllm")
{echo $flag;}
  ?>
```

要让程序输出 `$flag`，必须同时满足：

1. **POST 参数**** **`**id**`** ****的值为**** **`**"wllmNB"**`
2. **GET 参数 **`**json**`** 是一个合法的 JSON 字符串，且解析后是一个数组，其中键 **`**'x'**`** 的值为 **`**"wllm"**`
3. **使用 URL 编码，避免任何歧义**

```php
curl -X POST "http://node7.anna.nssctf.cn:27541/index.php?json=%7B%22x%22%3A%22wllm%22%7D" -d "id=wllmNB"
```

NSSCTF{5e3b5793-b1f6-488a-bac4-53e9c4889ed7}
![](2025 NSSCTF/file-20260331130230800.png)

## [陇剑杯_2021]jwt（问1）

追踪http流

![](2025 NSSCTF/file-20260331130230881.png)

> token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwODYsIk1hcENsYWltcyI6eyJhdWQiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4ifX0.dJArtwXjas3_Cg9a3tr8COXF7DRsuX8UjmbC1nKf8fc
>

![](2025 NSSCTF/file-20260331130230890.png)

NSSCTF{jwt}

## [陇剑杯_2021]webshell（问1）

#流量分析 #Webshell #流量日志审计

## [陇剑杯_2021]签到

> 题目描述：
>
> 此时正在进行的可能是__________协议的网络攻击。（如有字母请全部使用小写，填写样例：http、dns、ftp）。得到的flag请使用NSSCTF{}格式提交。
>

![](2025 NSSCTF/file-20260331130230769.png)

NSSCTF{http}

## [强网拟态_2021]拟态签到题

ZmxhZ3tHYXFZN0t0RXRyVklYMVE1b1A1aUVCUkNZWEVBeThyVH0=

flag{GaqY7KtEtrVIX1Q5oP5iEBRCYXEAy8rT}
![](2025 NSSCTF/file-20260331130230831.png)

## [强网拟态2021]BlueWhale

附件：
![](2025 NSSCTF/file-20260331130230810.png)

先分析外层流量包，追踪TCP流
![](2025 NSSCTF/file-20260331130230852.png)

获取密码：**th1sIsThEpassw0rD**

但似乎不是内层压缩包解压密码。

暴力破解：

## [羊城杯_2022]签个到

附件：231.txt

> ZMJTPM33TL4TRMYRZD3JXAGOZVMJRLWEZMFGFAEIZV2GVMOMZZ3JTZ3RUR2U2===
>

法一：ciphey一把梭

NSSCTF{68bedd7e6ab3ba1fe965b54d9c7c3d94}
![](2025 NSSCTF/file-20260331130230747.png)

法二：脑筋急转弯

+ 文末三个“=”显然不是base64编码。
+ 文件名提示：倒着看13和32
+ rot13和base32解密即可

NSSCTF{68bedd7e6ab3ba1fe965b54d9c7c3d94}
![](2025 NSSCTF/file-20260331130230779.png)
![](2025 NSSCTF/file-20260331130230789.png)

## Do_you_know_http

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

## gift_F12

![](2025 NSSCTF/file-20260331130230715.png)
![](2025 NSSCTF/file-20260331130230702.png)

+ Ctrl+U查看网页源代码
+ Ctrl+F查找flag
+ 获得flag
![](2025 NSSCTF/file-20260331130230690.png)

## 无标题文档

![](2025 NSSCTF/file-20260331130230758.png)
![](2025 NSSCTF/file-20260331130230727.png)

## 喜欢我的压缩包么__初级_

题目：可恶，学习资料的密码忘了！！！  
几位数来着，哦哦，6位

1. 使用Hashcat暴力破解。















2. 使用Advanced Archive Password Recovery暴力破解。
![](2025 NSSCTF/file-20260331130230628.jpeg)

得到口令114514，解出压缩包中的flag。

## 这羽毛球怎么只有一半啊（恼__初级_

题目：所以下半身是什么呢（ww

+ 解压得可爱的小草神.png
![](2025 NSSCTF/file-20260331130228827.png)
+ 题目提示图片缺少下半部分，故使用[随波逐流]CTF编码工具修复高宽
+ 拖入得羽毛球-修复高宽.png，得到flag。
![](2025 NSSCTF/file-20260331130228817.png)

