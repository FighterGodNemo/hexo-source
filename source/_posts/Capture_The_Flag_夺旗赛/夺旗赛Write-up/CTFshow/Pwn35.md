---
title: "Pwn35"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- CTFshow
---

![](Pwn35/1762254414703-b94ad4ec-db20-4af3-9bdf-85c3eabc4436.png)

<font style="color:#000000;">主机cmder看：</font>

![](Pwn35/1762251197358-24bbc507-f26a-4f0e-8963-d0a51452572d.png)

<font style="color:#000000;">或者把</font>[<font style="color:#000000;">pwn</font>](https://so.csdn.net/so/search?q=pwn&spm=1001.2101.3001.7020)<font style="color:#000000;">文件拖进虚拟机加上可执行权限，使用checksec命令查看文件的信息。</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">1.cd "/home/nemo/桌面/CTFshow Pwn"</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">2.chmod +x pwn35</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">3.ls (即 list directory contents，列出目前工作目录所含的文件及子目录)</font>

<font style="color:#000000;background-color:rgba(255, 255, 255, 0);">4. pwn checksec pwn35</font>

![](Pwn35/1762250913998-61008fc8-2140-4663-920c-925c3a2760cd.png)

发现是32位的，并且RELRO 与 NX保护开启。

放入ida-32位

![](Pwn35/1762252237280-8802238e-5f75-44eb-95ad-4b2614ecd75c.png)

<font style="color:rgb(33, 37, 41);">ssh ctfshow@pwn.challenge.ctf.show -p28217</font>

<font style="color:#000000;"></font>

<font style="color:#000000;"></font>

<font style="color:#000000;"></font>

<font style="color:#000000;"></font>

<font style="color:#000000;"></font>

<font style="color:#000000;"></font>

