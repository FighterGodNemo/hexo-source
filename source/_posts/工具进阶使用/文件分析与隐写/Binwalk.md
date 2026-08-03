---
title: Binwalk
permalink: /2026/03/15/Capture_The_Flag_夺旗赛/CTF解题妙具/Binwalk/
date: 2026-03-15 13:28:16
categories:
  - 工具进阶使用
  - 文件分析与隐写
tags:
  - CTF
  - CTF工具
  - Binwalk
  - 工具进阶
created: 2026-03-15T16:49
updated: 2026-08-02T23:40
---
# Binwalk 文件分析与提取

Binwalk 用于识别二进制文件、固件镜像或可疑载体中的文件签名、压缩数据和嵌入式文件系统。它适合先判断“文件里还藏着什么”，再决定是否自动提取或改用文件雕刻工具。

## 快速流程

```bash
# 扫描文件签名和偏移
binwalk target.bin

# 扫描并提取可识别内容
binwalk -e target.bin

# 递归提取多层嵌套内容
binwalk -Me target.bin
```

默认提取结果通常会进入以目标文件命名的目录。遇到多层压缩、固件文件系统或文件套娃时，先查看扫描偏移和类型，再检查提取目录，避免只看命令是否退出成功。

## 与 Foremost 的分工

Binwalk 更擅长识别嵌入结构、压缩数据和固件内容；Foremost 更侧重根据文件头尾从原始数据中雕刻文件。Binwalk 未能直接提取时，可继续参考 [foremost使用指南](/2026/03/15/Forensic_电子取证/Forensic解题妙具/foremost使用指南/)。
