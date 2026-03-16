---
title: "Ciphey"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- CTF解题妙具
---

[在Windows上 ciphey安装（详细版）-CSDN博客](https://blog.csdn.net/BG1230521/article/details/134127716)

**<font style="color:rgb(0, 0, 0);background-color:rgb(235, 246, 255);">D：</font>**

**<font style="color:rgb(0, 0, 0);background-color:rgb(235, 246, 255);">cd D:\Forensic\ForensicTool\Decrypt\Ciphey\Python38\test_venv\Scripts</font>**

**<font style="color:rgb(0, 0, 0);background-color:rgb(235, 246, 255);">使用 Ciphey</font>**

**<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">基本用法</font>**

1. <font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">解密文本： </font>_<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">ciphey -t "密文"</font>_
2. <font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">解密文件：</font><font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);"> </font>_<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">ciphey -f encrypted.txt</font>_

**<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">参数列表</font>**

<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">运行</font><font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);"> </font>_<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">ciphey --help</font>_<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);"> </font><font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">可以查看完整的参数列表。常用参数包括：</font>

+ _<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">-t, --text TEXT</font>_<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">：要解密的密文。</font>
+ _<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">-q, --quiet</font>_<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">：减少冗长的显示，直接给结果。</font>
+ _<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">-f, --file FILENAME</font>_<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">：要解密的文件名。</font>

**<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">示例</font>**

1. <font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">解密文本示例：</font><font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);"> </font>_<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">ciphey -t "aGVsbG8gbXkgbmFtZSBpcyBiZWU="</font>_
2. <font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">解密文件示例：</font><font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);"> </font>_<font style="color:rgba(0, 0, 0, 0.75);background-color:rgb(235, 246, 255);">ciphey -f encrypted.txt</font>_

**<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">安静模式</font>**

<font style="color:rgba(0, 0, 0, 0.8);background-color:rgb(235, 246, 255);">如果想要去除进度条、概率表和所有噪音，可以使用安静模式：</font>

<font style="color:rgb(0, 0, 0);">ciphey -t </font><font style="color:rgb(126, 11, 11);">"encrypted text here"</font><font style="color:rgb(0, 0, 0);"> -q</font>

