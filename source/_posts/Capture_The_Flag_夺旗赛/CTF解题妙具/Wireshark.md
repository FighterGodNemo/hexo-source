---
title: Wireshark
date: "2026-03-15 13:28:16"
categories:
  - Capture_The_Flag_夺旗赛
  - CTF解题妙具
tags:
  - CTF
  - CTF工具
  - Wireshark
created: "2026-03-15T16:49"
updated: "2026-04-01T13:15"
---

网络协议分析工具，用于捕获和分析网络流量。网络流量分析是指捕捉网络中流动的数据包，并通过查看包内部数据以及进行相关的协议、流量分析、统计等来发现网络运行过程中出现的问题。

在应急响应与日常运维中都是至关重要的步骤。

对于取证分析，在CTF中的流量包分析(该在线资源已失效)中有一些简单的介绍。二者基本上类似，不过在CTF中对数据包的分析比较注重细节和较高难度的处理；在美亚杯的比赛中更注重流量包的行为和结果，从而对其他镜像的分析结果进行佐证。

## Wireshark使用[¶](https://forensics.xidian.edu.cn/wiki/pac/#wireshark)
pcap流量包的分析通常都是通过图形化的网络嗅探器——Wireshark进行的，这款嗅探器经过众多开发者的不断完善，现在已经成为了使用最为广泛的安全工具之一。

Wireshark的基本使用分为数据包筛选、数据包搜索、数据包还原、数据提取四个部分。

#### 数据包筛选[¶](https://forensics.xidian.edu.cn/wiki/pac/#_1)
数据包筛选功能是Wireshark的核心功能，比如需要筛选出特定的协议如HTTP，Telnet等，也可能需要筛选出ip地址，端口等。

#### 数据包搜索[¶](https://forensics.xidian.edu.cn/wiki/pac/#_2)
在Wireshark界面按“Ctrl+F”，可以进行关键字搜索。Wireshark的搜索功能支持正则表达式、字符串、十六进制等方式进行搜索，通常情况下直接使用字符串方式进行搜索。

#### 数据包还原[¶](https://forensics.xidian.edu.cn/wiki/pac/#_3)
在Wireshark中，存在一个交追踪流的功能，可以将HTTP或TCP流量集合在一起并还原成原始数据，具体操作方式：选中想要还原的流量包，右键选中，选择追踪流 – TCP流/UPD流/SSL流/HTTP流。

#### 数据提取[¶](https://forensics.xidian.edu.cn/wiki/pac/#_4)
Wireshark支持提取通过http传输（上传/下载）的文件内容，方法：选中http文件传输流量包，在分组详情中找到data或者Line-based text data:text/html层，鼠标右键点击 – 选中 导出分组字节流。

