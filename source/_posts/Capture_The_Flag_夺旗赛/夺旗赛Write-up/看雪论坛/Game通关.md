---
title: "Game通关"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- 看雪论坛
---

## 第一关
![](Game通关/1762217172032-afd31003-424a-4801-bd32-5331af37fa68.png)

摩斯密码，去掉斜杠

![](Game通关/1762217200862-0af908d6-57a0-497a-968c-8261f24ebf90.png)

YOUWIN

## 第二关
![](Game通关/1762217237173-2d5aba29-2af4-4be8-abf5-bff4ca51c771.png)![](Game通关/1762217101764-531144d0-b2c3-40ec-a378-4f2bf20c70a1.png)

flag{62d0cbb2c69133b52f386701726f29c1}

## 第三关
![](Game通关/1762218127881-d943fd67-e0e8-48b9-b400-50722f4d478a.png)

看到= 想到base64编码

![](Game通关/1762218257174-4f35673b-6b9c-4d97-8fb0-9b0a034f71d2.png)

这里SRK一把梭

<font style="color:#000000;">flag{b9768a37b47beb2d88e2db</font><font style="color:#DF2A3F;">o</font><font style="color:#000000;">e76a39bb3}</font>

<font style="color:#000000;">然而答案不对。</font>

<font style="color:#000000;">继续处理b9768a37b47beb2d88e2db</font><font style="color:#DF2A3F;">o</font><font style="color:#000000;">e76a39bb3</font>

<font style="color:rgb(15, 17, 21);">这看起来像一个 </font>**<font style="color:rgb(15, 17, 21);">MD5 哈希</font>**<font style="color:rgb(15, 17, 21);">（32 位十六进制数），但 MD5 哈希字符范围是 </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">0-9a-f</font>`<font style="color:rgb(15, 17, 21);">，而这里有一个字符 </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">o</font>`<font style="color:rgb(15, 17, 21);">不符合 MD5 格式。</font>

<font style="color:rgb(15, 17, 21);">其实不要想复杂，把o改成0，答案正确：</font>

<font style="color:#000000;">flag{b9768a37b47beb2d88e2db0e76a39bb3}</font>

## <font style="color:#000000;">第四关</font>
![](Game通关/1762218714504-f072b215-64b9-443e-9e60-9edfff9131ef.png)

先猜一波：011010111110101000000100000100100010111100，没啥用

搜索棋盘解密，不太对

涨芝士了，原来是**<u>盲文</u>**

![](Game通关/1762220266237-00bcd7cb-ab6c-46c9-a11f-7d68624d619b.png)

○● ●○ ●○ ●● ●● ●○ ●○

●○ ○○ ○○ ○● ○○ ○○ ○●

○○ ●○ ○○ ●○ ●● ●● ○○

 i    k    a   n   x   u    e 

答案：ikanxue

## 第五关
![](Game通关/1762220597577-605e877c-9167-41c6-bd70-6bc22dc57f5c.png)

![](Game通关/1762220781675-0a3fd684-94b2-4a7a-ad66-fac2288dbc72.png)<font style="color:rgb(77, 77, 77);">大概率是文本</font>[<font style="color:rgb(77, 77, 77);">隐写术加密</font>](https://tool.bfw.wiki/tool/1695021695027599.html)![](Game通关/1762220951755-6b01be38-2984-4923-8e6f-a7b0d2421fac.png)

零宽隐写

flag{6af971a42782115a594ba2318c0417ad}

## 第六关
![](Game通关/1762221946364-0205eaf6-8aee-422b-8518-9d9cebf5a14e.png)

![](Game通关/1762221932234-1fbd4140-90a4-46bf-92bc-538ccf026a3f.png)

<font style="color:rgb(51, 51, 51);background-color:rgba(0, 0, 0, 0.075);">iodj{7115i261eig7i42d5fg7412fh86ded7h}</font>

<font style="color:rgb(51, 51, 51);background-color:rgba(0, 0, 0, 0.075);">明显凯撒密码</font>

<font style="color:rgb(51, 51, 51);background-color:rgba(0, 0, 0, 0.075);">flag偏移3位</font>![](Game通关/1762222347049-2fab7f98-ec6c-4978-b40c-e8fca8ba2ce3.png)

或者随波逐流：

![](Game通关/1762222270942-8926f633-a832-4706-b35a-a89ec4621c16.png)

flag{7115f261bfd7f42a5cd7412ce86aba7e}

## 第七关
![](Game通关/1762222416608-8202c526-d602-4d75-a976-7dfc89c64513.png)

