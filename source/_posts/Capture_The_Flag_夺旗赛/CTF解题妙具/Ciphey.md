---
title: Ciphey
date: "2026-03-15 13:28:16"
categories:
  - Capture_The_Flag_夺旗赛
  - CTF解题妙具
tags:
  - CTF
  - CTF工具
  - Ciphey
created: "2026-03-15T16:49"
updated: "2026-03-18T09:41"
---

[在Windows上 ciphey安装（详细版）-CSDN博客](https://blog.csdn.net/BG1230521/article/details/134127716)

**D：**

**cd D:\Forensic\ForensicTool\Decrypt\Ciphey\Python38\test_venv\Scripts**

**使用 Ciphey**

**基本用法**

1. 解密文本： _ciphey -t "密文"_
2. 解密文件： _ciphey -f encrypted.txt_

**参数列表**

运行 _ciphey --help_ 可以查看完整的参数列表。常用参数包括：

+ _-t, --text TEXT_：要解密的密文。
+ _-q, --quiet_：减少冗长的显示，直接给结果。
+ _-f, --file FILENAME_：要解密的文件名。

**示例**

1. 解密文本示例： _ciphey -t "aGVsbG8gbXkgbmFtZSBpcyBiZWU="_
2. 解密文件示例： _ciphey -f encrypted.txt_

**安静模式**

如果想要去除进度条、概率表和所有噪音，可以使用安静模式：

ciphey -t "encrypted text here" -q

