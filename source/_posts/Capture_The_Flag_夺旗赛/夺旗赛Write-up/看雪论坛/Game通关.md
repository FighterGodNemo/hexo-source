---
title: Game通关
permalink: '/2026/03/15/Capture_The_Flag_夺旗赛/夺旗赛Write-up/看雪论坛/Game通关/'
date: 2026-03-15 13:28:20
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - 看雪论坛
tags:
  - CTF
  - WriteUp
  - 看雪论坛
  - Game通关
created: 2026-03-15T16:49
updated: 2026-04-13T20:08
---

## 第一关
![](Game通关/file-20260331130227809.png)

摩斯密码，去掉斜杠

![](Game通关/file-20260331130227839.png)

YOUWIN

## 第二关
![](Game通关/file-20260331130227829.png)![](Game通关/file-20260331130227849.png)

flag{62d0cbb2c69133b52f386701726f29c1}

## 第三关
![](Game通关/file-20260331130227819.png)

看到= 想到base64编码

![](Game通关/file-20260331130227799.png)

这里SRK一把梭

flag{b9768a37b47beb2d88e2dboe76a39bb3}

然而答案不对。

继续处理b9768a37b47beb2d88e2dboe76a39bb3

这看起来像一个 **MD5 哈希**（32 位十六进制数），但 MD5 哈希字符范围是 `0-9a-f`，而这里有一个字符 `o`不符合 MD5 格式。

其实不要想复杂，把o改成0，答案正确：

flag{b9768a37b47beb2d88e2db0e76a39bb3}

## 第四关
![](Game通关/file-20260331130227789.png)

先猜一波：011010111110101000000100000100100010111100，没啥用

搜索棋盘解密，不太对

涨芝士了，原来是**<u>盲文</u>**

![](Game通关/file-20260331130227780.png)

○● ●○ ●○ ●● ●● ●○ ●○

●○ ○○ ○○ ○● ○○ ○○ ○●

○○ ●○ ○○ ●○ ●● ●● ○○

 i    k    a   n   x   u    e 

答案：ikanxue

## 第五关
![](Game通关/file-20260331130227771.png)

![](Game通关/file-20260331130227752.png)大概率是文本[隐写术加密](https://tool.bfw.wiki/tool/1695021695027599.html)![](Game通关/file-20260331130227743.png)

零宽隐写

flag{6af971a42782115a594ba2318c0417ad}

## 第六关
![](Game通关/file-20260331130227732.png)

![](Game通关/file-20260331130227762.png)

iodj{7115i261eig7i42d5fg7412fh86ded7h}

明显凯撒密码

flag偏移3位![](Game通关/file-20260331130227711.png)

或者随波逐流：

![](Game通关/file-20260331130227722.png)

flag{7115f261bfd7f42a5cd7412ce86aba7e}

## 第七关
![](Game通关/file-20260331130227701.png)



