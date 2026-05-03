---
title: Base64编码隐藏
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/CTFshow/Web应用安全与防护/
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - CTFshow
tags:
  - CTF
  - WriteUp
  - CTFshow
  - Base64
  - 编码
created: 2026-03-15T16:49
updated: 2026-05-03T09:53
---

## Base64编码隐藏
![](Web应用安全与防护/file-20260331130229528.png)![](Web应用安全与防护/file-20260331130229538.png)![](Web应用安全与防护/file-20260331130229549.png)![](Web应用安全与防护/file-20260331130229558.png)
平时只知道解码，不知道base怎么来的。这里找了一个base64的具体过程：
![](Web应用安全与防护/file-20260503085909217.png)
CTF{easy_base64}
## HTTP头注入
![](Web应用安全与防护/file-20260503085433586.png)
![](Web应用安全与防护/file-20260503085457877.png)
![](Web应用安全与防护/file-20260503095205581.png)![](Web应用安全与防护/file-20260503095232605.png)密码：CTF{easy_base64}
![](Web应用安全与防护/file-20260503095326907.png)

修改UA为ctf-show-brower



