---
title: linux虚拟机
permalink: '/2026/03/15/Capture_The_Flag_夺旗赛/CTF解题妙具/linux虚拟机/'
date: "2026-03-15 13:28:16"
categories:
  - 工具进阶使用
  - 环境与自动化
tags:
  - CTF
  - CTF工具
  - Linux
  - 工具进阶
created: "2026-03-15T16:49"
updated: "2026-08-02T23:40"
---

虚拟机（Virtual Machine）指通过软件模拟的具有完整硬件系统功能的、运行在一个完全隔离环境中的完整计算机系统。在实体计算机中能够完成的工作在虚拟机中都能够实现。在计算机中创建虚拟机时，需要将实体机的部分硬盘和内存容量作为虚拟机的硬盘和内存容量。每个虚拟机都有独立的CMOS、硬盘和操作系统，可以像使用实体机一样对虚拟机进行操作。



需要隔离 Python 工具依赖时，优先在虚拟环境中执行 `pip install`，避免污染系统 Python。

以后每次使用前运行：**<u>source ~/pwn-env/bin/activate</u>**

1. 给文件添加可执行权限：`chmod +x 文件`
2. 运行程序：`./文件`

常用 Linux 取证工具和安装方式见 [linux工具](/2026/03/15/Forensic_电子取证/Forensic解题妙具/linux工具/)。
