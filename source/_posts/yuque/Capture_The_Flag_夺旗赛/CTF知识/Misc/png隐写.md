---
title: "png隐写"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- CTF知识
- Misc
---

png特点：是无损压缩，将图片源码通过zlib压缩编码后以IDAT块的形式组成的

是一块块的，存满65524才会开下一个，所以如果一个没满，又有一个，很有可能是认为添加进去的

四个关键块如下

IDHR：文件头数据块

PLTE：调色板数据块

IDAT：图像数据块

IEND：文件尾数据块

