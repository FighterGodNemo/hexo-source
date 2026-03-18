---
title: 《C程序设计（第五版）》
date: 2026-03-15 13:28:20
categories:
  - 博览知识
created: 2026-03-15T16:49
updated: 2026-03-18T14:08
tags:
  - C语言
---
AX是寄存器

0:0000 1:0001 2:0010 3:0011 。。。7:0111 8:1000 9:1001 A:1010 B:1011 C:1100
AX:000 BX:011
大端
小端
（windows：小端模式）

### Visual Studio Code C语言运行报错

cl.exe 默认把源文件当作当前系统代码页（CP936）来读。我文件源码是 UTF‑8，里面有中文注释/字符串，cl.exe用 CP936 去解码就会把字节读乱，进而出现“缺少 ; / }”这类假语法错误。
BOM（Byte Order Mark） 是文件开头的一段标记（UTF‑8 的 BOM 是 3 个字节）。
cl.exe 看到 BOM 后，就能识别“这是 UTF‑8”，正确解码。

右下角选择UTF-8 with BOM即可
