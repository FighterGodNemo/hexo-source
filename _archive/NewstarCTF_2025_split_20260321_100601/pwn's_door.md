---
title: "pwn's_door"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- NewstarCTF_2025
---

题目内容：

Key 已经为进入 pwn 的世界做好了充分准备。他找到了可靠的伙伴，猫猫 NetCat 和蟒蛇 Python，还为 Python 配备了强大的工具 pwntools。有了这些，他相信自己一定能顺利通过考验。

容器地址： nc 47.94.87.199 29217

附件：![](1759192277511-53808fdd-3abd-459e-865a-8e85f6319a4b.png)

解答：这是一个典型的 **pwn 签到题**，通常需要你通过 `netcat` 连接给定的服务器，然后与程序交互来获取 flag。

1.连接

+ python

```python
from pwn import *
r = remote('47.94.87.199', 29217)
#IP地址: 47.94.87.199
#端口号: 29217
r.interactive()
```

或![](1759193732815-e6f93818-12c2-42b0-9d5e-6baf15785386.png)

二者均可

![](1759193818681-84f6fb78-8103-464c-87f2-445754228511.png)

+ 随意输入，enter：

![](1759193863038-c9ccb675-90a0-4fa9-a6de-c7bf7746496e.png)

+ 用IDA打开door文件，按F5
+ ![](1759193893913-ae9f3e60-77da-42a7-a86b-9b17d3d330a5.png)
+ 发现密码7038329。输入：![](1759193940337-43f9d328-5e6a-4e06-88ab-3e69306a7b48.png)
+ 执行cat flag命令得flag：![](1759193978276-2177bc22-5bfb-48f3-814a-99121ddced89.png)




