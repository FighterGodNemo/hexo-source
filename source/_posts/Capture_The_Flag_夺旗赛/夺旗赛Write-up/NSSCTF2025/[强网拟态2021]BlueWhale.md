---
title: "[强网拟态2021]BlueWhale"
date: 2026-03-15 13:28:20
categories:
- Capture_The_Flag_夺旗赛
- 夺旗赛Write-up
- NSSCTF2025
---

附件：![](1764461291358-9fc44604-8a90-43e5-913e-9d21ad1a2fc9.png)

先分析外层流量包，追踪TCP流![](1764461505246-140d7750-34ba-4df1-a7fe-351b0fe0713c.png)

获取密码：**th1sIsThEpassw0rD**

但似乎不是内层压缩包解压密码。

暴力破解：


