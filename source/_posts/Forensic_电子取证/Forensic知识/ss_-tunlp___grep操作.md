---
title: ss_-tunlp___grep操作
date: 2026-03-15 13:28:28
categories:
  - Forensic_电子取证
  - Forensic知识
created: 2026-03-15T16:49
updated: 2026-03-18T09:46
---

1. `**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">ss -tunlp</font>**`
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">ss</font>`<font style="color:rgb(15, 17, 21);">： 是</font><font style="color:rgb(15, 17, 21);"> </font>**<font style="color:rgb(15, 17, 21);">Socket Statistics</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">的缩写，一个功能强大的工具，用于转储套接字统计信息。它旨在取代旧的、性能较差的</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">netstat</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">命令。</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-t</font>`<font style="color:rgb(15, 17, 21);">： 显示</font><font style="color:rgb(15, 17, 21);"> </font>**<font style="color:rgb(15, 17, 21);">TCP</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">连接。</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-u</font>`<font style="color:rgb(15, 17, 21);">： 显示</font><font style="color:rgb(15, 17, 21);"> </font>**<font style="color:rgb(15, 17, 21);">UDP</font>**<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">连接。</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-n</font>`<font style="color:rgb(15, 17, 21);">： 以</font>**<font style="color:rgb(15, 17, 21);">数字形式</font>**<font style="color:rgb(15, 17, 21);">显示地址和端口号，而不是尝试解析主机名、服务名（例如，显示</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">80</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">而不是</font><font style="color:rgb(15, 17, 21);"> </font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">http</font>`<font style="color:rgb(15, 17, 21);">）。这能加快输出速度。</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-l</font>`<font style="color:rgb(15, 17, 21);">： 仅显示</font>**<font style="color:rgb(15, 17, 21);">监听</font>**<font style="color:rgb(15, 17, 21);">状态的套接字。</font>
    - `<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">-p</font>`<font style="color:rgb(15, 17, 21);">： 显示</font>**<font style="color:rgb(15, 17, 21);">使用该套接字的进程信息</font>**<font style="color:rgb(15, 17, 21);">。</font>

<font style="color:rgb(15, 17, 21);">所以，</font>`<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">ss -tunlp</font>`<font style="color:rgb(15, 17, 21);"> </font><font style="color:rgb(15, 17, 21);">本身的含义是：</font>**<font style="color:rgb(15, 17, 21);">“列出所有正在监听的 TCP 和 UDP 端口，并显示端口号和对应的进程信息。”</font>**

2. `**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">|</font>**`<font style="color:rgb(15, 17, 21);"> </font><font style="color:#DF2A3F;">（管道符）</font>
    - <font style="color:#DF2A3F;">这是 Linux Shell 的一个核心功能。它将前一个命令（</font>`<font style="color:#DF2A3F;background-color:rgb(235, 238, 242);">ss -tunlp</font>`<font style="color:#DF2A3F;">）的</font>**<font style="color:#DF2A3F;">标准输出</font>**<font style="color:#DF2A3F;">作为后一个命令（</font>`<font style="color:#DF2A3F;background-color:rgb(235, 238, 242);">grep</font>`<font style="color:#DF2A3F;">）的</font>**<font style="color:#DF2A3F;">标准输入</font>**<font style="color:#DF2A3F;">。</font>
3. `**<font style="color:rgb(15, 17, 21);background-color:rgb(235, 238, 242);">grep</font>**`
    - <font style="color:rgb(15, 17, 21);">一个强大的文本搜索工具。它会在它接收到的文本中搜索指定的模式</font>

