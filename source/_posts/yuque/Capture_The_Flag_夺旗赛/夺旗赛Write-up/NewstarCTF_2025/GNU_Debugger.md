---
title: "GNU_Debugger"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- NewstarCTF_2025
---

题目内容：

进入pwn的世界之后的第一关，了解你的好伙伴gdb

题目的流程为：

1. 启动靶机获得端口和ip

2. 启动程序： ./gdb_challenge (假设你已经在这个程序所在的目录)

3. 进行一系列的gdb挑战

4. 完成所有挑战，得到flag

ps: 这题暂时用不到ida哦，推荐直接执行程序，跟着流程来就好啦。不过也可以通过逆向工程来得到flag ^^

解答：

