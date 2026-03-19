---
title: Pwn35
date: 2026-03-15 13:28:16
categories:
  - Capture_The_Flag_夺旗赛
  - 夺旗赛Write-up
  - CTFshow
created: 2026-03-15T16:49
updated: 2026-03-19T15:07
---

![](1762254414703-b94ad4ec-db20-4af3-9bdf-85c3eabc4436.png)

主机cmder看：

![](1762251197358-24bbc507-f26a-4f0e-8963-d0a51452572d.png)

或者把[pwn](https://so.csdn.net/so/search?q=pwn&spm=1001.2101.3001.7020)文件拖进虚拟机加上可执行权限，使用checksec命令查看文件的信息。

1.cd "/home/nemo/桌面/CTFshow Pwn"

2.chmod +x pwn35

3.ls (即 list directory contents，列出目前工作目录所含的文件及子目录)

4. pwn checksec pwn35

![](1762250913998-61008fc8-2140-4663-920c-925c3a2760cd.png)

发现是32位的，并且RELRO 与 NX保护开启。

放入ida-32位

![](1762252237280-8802238e-5f75-44eb-95ad-4b2614ecd75c.png)

ssh ctfshow@pwn.challenge.ctf.show -p28217














