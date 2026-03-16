---
title: "PNG_Master"
date: 2026-03-15 13:28:18
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- SPCCTF
---

![](1760702192665-801e8676-05a6-453e-9d00-c84bf19d3600.png)

+ 让你难过的事情，有一天，你一定会笑着说出来flag1:4c494c4354467b
+ 第二段，LSB隐写，RGB最低位,打开Stegsolve：![](1760702239912-e2bdc76a-9e16-4d15-af06-69ed8298c083.png)

放入SRK，使用magic

在我们心里，有一块地方是无法锁住的，那块地方叫做希望flag2:5930755f3472335f4d

+ 第三段，pngcheck

pngcheck -v 150041_misc-PNG_M@st3r.png

chunk IDAT at offset 0x6f7bb, length 270

这一块异常，提取出来，然后zlib解压，得到压缩包

![](1760702352606-a831624a-8d45-4ed8-9139-17b68dc0102c.png)

hint是零宽隐写，提示secret与文件名异或

![](1760702369582-54274288-cd0f-41d7-bfa4-43424a40c7a2.png)

![](1760702394036-76c0bbb1-c4dd-4995-a356-0e15be999e6e.png)

得到flag3:61733765725f696e5f504e477d

<font style="color:#000000;">三段值十六进制解码得到最终flag</font>

<font style="color:#000000;">LILCTF{Y0u_4r3_Mas7er_in_PNG}</font>



