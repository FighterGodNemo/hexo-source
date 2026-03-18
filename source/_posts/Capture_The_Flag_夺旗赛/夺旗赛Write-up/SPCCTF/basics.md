---
title: "basics"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- SPCCTF
---

基础，答案用utflag{}包裹[binary.txt](basics/1763080711015-a6595b2e-cc67-4734-8140-49a1cfd054c7.txt)

排除零宽隐写![](1763080767375-42282028-a6b2-45fe-9366-f65a3c5fef96.png)

![](1763080734705-0226acc4-abe1-4db0-8e9c-286c84ab4579.png)

<font style="color:rgb(15, 17, 21);">只有 A-Z, a-z, 0-9, 以及 </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">/</font>`<font style="color:rgb(15, 17, 21);"> 和 </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">+</font>`<font style="color:rgb(15, 17, 21);"> 出现</font>

<font style="color:rgb(15, 17, 21);">猜测base64编码方式</font>![](1763080946586-4898fc2b-2747-45c8-ab1a-65ace6f742a5.png)

罗马人。明显是凯撒密码

![](1763081151837-769197a7-5ac3-47ca-aeda-6352cd2c1ae1.png)

<font style="color:#000000;">信息中的每一个字母都被另一个独特的字母替换了</font>

工具：[https://quipqiup.com/](https://quipqiup.com/)

![](1763081773062-b51b543b-38e9-4a34-b063-6f6b44497970.png)

<font style="color:rgb(0, 0, 0);background-color:rgb(248, 248, 255);">utflag{n0w_th4ts_wh4t_i_c4ll_crypt0}</font>


