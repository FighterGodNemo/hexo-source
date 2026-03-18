---
title: "2048_master"
date: 2026-03-15 13:28:16
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- MoeCTF_2025
---

+ 解压得2048_master.exe
+ 运行后显示：![](1758343712710-babaf592-cb6c-4d2d-9a47-bb7cc086e8fa.png)
+ 退出，发现layout.dat，内含程序数据
+ 用010editor分别打开2048_master.exe和layout.dat得到：
+ ![](1758343862688-51627706-1681-4ad2-b082-91b9f7fee666.png)
+ ![](1758343892513-bc22f244-aadd-4c6a-9e6e-01d361ac95e9.png)
+ 修改layout数据如下：![](1758343978405-31807aa8-47f4-46a1-a6fc-2d4a318bd462.png)
+ 运行得flag：![](1758344041411-03726efa-6a25-44b5-970d-aa133eb5dbf6.png)


