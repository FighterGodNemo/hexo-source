---
title: BitLocker 内存取证与 DMA 抓取排错笔记
date: 2026-04-27 16:36:00
permalink: /2026/04/27/博览知识/BitLocker-内存取证与-DMA-抓取排错笔记/
categories:
  - 博览知识
tags:
  - 博览知识
  - 电子取证
  - BitLocker
created: 2026-04-27T16:36
updated: 2026-04-27T16:53
---

## 技术经验总览

这次排查的核心经验是：先判断当前阶段到底是在处理内存、密钥，还是磁盘。三者混在一起时，很容易把错误归因到工具本身。

PCILeech 阶段只负责把目标机物理内存抓成 raw。EFDD 的 `Extract keys` 阶段只负责从内存 raw 里找 BitLocker 密钥材料。EFDD 的 `Decrypt or mount disk` 阶段才需要目标 BitLocker 硬盘或磁盘镜像。

一句话流程：

```text
目标机内存状态正确
-> PCILeech 抓内存 raw
-> EFDD 从 raw 里 Extract keys
-> EFDD 用候选 key 挂载或解密目标 BitLocker 磁盘
```

合规前提仍然要放在最前面：只用于自有设备、明确授权维修、企业应急响应、司法取证或实验室学习。

## 关键概念

BitLocker 的 48 位恢复密钥、VMK、FVEK 不是同一种东西。

48 位恢复密钥是用户或管理员用于恢复解锁的数字密码，常见格式类似多组短数字。它通常保存在 Microsoft 账户、企业管理系统、恢复密钥文件、打印件或 U 盘中。

VMK 是 Volume Master Key，FVEK 是 Full Volume Encryption Key，属于 BitLocker 实际解密链路里的二进制密钥材料。EFDD 从内存里搜索到的结果通常会显示为十六进制 key data，而不是 48 位恢复密钥格式。

锁屏、Windows 登录密码、BIOS/UEFI 密码、BitLocker PIN、硬盘密码也不是一回事。

Windows 登录密码只控制用户会话。很多 TPM 自动解锁的机器启动到 Windows 登录界面时，系统盘可能已经解锁，此时内存里可能存在 BitLocker 相关密钥。

BIOS/UEFI 开机密码只控制机器能否继续启动或进入固件设置，和 BitLocker 解锁没有直接等价关系。

BitLocker 开机 PIN 和 BitLocker 直接相关。输入 PIN 后系统盘才会解锁，之后抓取内存才更可能找到对应密钥。

硬盘密码是硬盘固件层面的锁，和 BitLocker 是另一套机制。

## 工具链分工经验

PCILeech/LeechCore 一类工具用于通过 DMA 方式读取目标机器物理内存，输出内存镜像，例如 `memdump.raw` 或 `mem_dump.raw`。这个文件是 RAM dump，不是硬盘镜像。

Elcomsoft Forensic Disk Decryptor 可以从内存镜像中搜索 BitLocker 相关密钥，也可以在已经有密钥、密码或恢复密钥时挂载或解密 BitLocker 磁盘。

Arsenal Image Mounter 主要用于挂载磁盘镜像，例如 raw/dd/E01/VHD/VHDX。它不适合把 PCILeech 生成的内存 raw 当成磁盘挂载。内存 raw 应交给 EFDD 的 `Extract keys` 流程处理。

外接的“像硬盘一样的设备”不一定是普通移动硬盘。若它配合 PCILeech 让 `Current Action: Dumping Memory` 跑起来，更可能是 DMA 采集设备，作用是读取内存，不是直接读取 BitLocker 磁盘数据。

## 操作流程判断

合规实验里的逻辑链是：

先确认目标 BitLocker 卷已经处于已解锁或已挂载状态。只锁屏通常不等于重新锁住 BitLocker，但关机、重启、休眠或还停在 BitLocker 解锁前界面时，内存里可能没有可用的解密材料。

然后抓取物理内存，生成内存镜像。抓取完成后检查输出文件是否存在、大小是否接近目标机器物理内存范围、最终 `Pages failed` 比例是否可接受。

接着在 EFDD 里选择 `Extract keys`，导入内存镜像，扫描 BitLocker 相关密钥。如果结果中出现 `BitLocker Volume Master Key` 和十六进制 `Key data`，说明已经找到了候选 VMK，而不是 48 位恢复密钥。

最后把目标 BitLocker 磁盘或磁盘镜像交给 EFDD 的 `Decrypt or mount disk`。如果只是验证密钥是否可用，优先选择挂载；如果要完整导出解密后的镜像，再考虑解密输出。正式取证场景应优先对原盘做镜像，并避免直接修改原盘。

## PCILeech 参数经验

不同版本的 PCILeech 参数可能不同，应先查看当前版本帮助。一次排错中，帮助信息显示 `dump` 子命令支持的输出参数是 `-out`，不是 `-o`。

因此不能凭印象写 `-o`。应先运行当前版本帮助：

```text
.\pcileech.exe dump -help
```

本次截图中帮助显示：

```text
OPTIONS : -min, -max, -out, -force
```

因此输出文件应使用 `-out` 指定，例如：

```text
.\pcileech.exe dump -out "C:\dump\memdump.raw"
```

经验上建议使用英文短路径保存输出。中文目录、空格路径、批处理封装和文件名前后不一致都可能造成误判。

如果控制台最后出现类似 `mem_dump.raw is not recognized as an internal or external command`，不一定代表 dump 失败。它更可能是批处理脚本最后误把输出文件名当命令执行。真正要检查的是 raw 文件是否生成、大小是否正常，以及抓取过程最终状态是否成功。

还有一个容易混淆的点：`memdump.raw` 和 `mem_dump.raw` 只是文件名差异，但如果脚本前后不一致，就会出现后续步骤找不到文件。经验上全程统一一个文件名。

## Pages failed 的含义

`Pages failed` 表示物理内存页读取失败的数量和比例。内存镜像大小接近完整内存容量，不代表每一页内容都成功读取；不可读页可能被零填充或保留为空洞。

一次抓取中 `Pages failed` 约 17%，说明失败比例偏高，EFDD 仍可能扫到候选 key，但关键页缺失会降低成功率。另一轮抓取降到约 7%，质量明显改善，应优先使用失败率更低的 dump。

控制台出现 `Should not happen`、`not happen`、`did not happen` 一类提示时，不一定马上代表抓取失败。若统计仍显示 `Pages failed: 0 (0%)`，可以先让它跑完；最终以完成状态、raw 文件大小和最终失败比例为准。

失败页可能来自 DMA 防护、IOMMU、Thunderbolt 安全策略、受保护内存区域、设备映射区域、连接不稳定或目标机状态变化。重新抓取时应避免休眠、重启、断电，减少移动设备和线缆，并优先使用失败率最低的一次镜像。

## EFDD 结果判断经验

EFDD `Extract keys` 出现如下结果时，说明不是“没有密钥”，而是找到了 BitLocker 的二进制密钥材料：

```text
Algorithm: BitLocker (incl. To Go) Volume Master Key
Key data (hex): ...
```

这类结果不会显示成 48 位恢复密钥格式。它通常是 VMK/FVEK 链路里的候选密钥。下一步应保存候选 key，然后回到 `Decrypt or mount disk`，选择目标 BitLocker 磁盘或磁盘镜像进行验证。

如果 EFDD 列出多条 BitLocker Volume Master Key，可能来自多个卷、历史残留或误匹配。经验上不要只看第一条，应逐条验证。

如果 `Decrypt or mount disk` 里只看到 `Physical0`，要先确认那是不是分析机自己的系统盘。目标硬盘接入后可能显示为 `Physical1` 或更高编号。不要把 `memdump.raw` 当目标磁盘选进去。

## Mount 与 Decrypt 的选择

`mount` 是临时挂载，适合先验证 key 是否能打开目标卷。成功后可以浏览和复制文件，适合作为第一步验证。

`decrypt` 是导出完整解密后的磁盘或分区镜像，耗时更久、占用空间更大，更适合已经确认 key 正确后再做。

这次经验中，如果只是验证 PCILeech 和 EFDD 提取到的 key 是否有效，优先建议 mount，而不是直接 decrypt。

## 常见误区

不要把内存镜像当磁盘镜像挂载。`memdump.raw` 是 RAM dump，不会像硬盘那样有正常分区表和文件系统。

不要在还没取得目标磁盘或磁盘镜像时期待 EFDD 直接显示文件。EFDD 从内存里提取出来的是候选密钥，后续还需要用对应的目标 BitLocker 盘验证。

不要把 BIOS 密码、Windows 登录密码、BitLocker PIN、硬盘密码混为一谈。内存提取能否成功，关键不是“有没有开机密码”，而是抓取内存时 BitLocker 卷是否已经解锁并挂载。

不要随意运行工具目录里的 `unlock`、`stickykeys`、脚本补丁或系统改动类文件。若目标只是授权内存取证，应只围绕内存 dump、密钥提取和只读验证开展。

## 排错检查清单

抓取阶段优先检查：

```text
是否在 pcileech.exe 所在目录运行
是否管理员命令行
是否先查看当前版本 dump -help
输出参数是否为当前版本支持的 -out
输出路径是否为英文短路径
raw 文件是否生成
raw 文件大小是否接近物理内存范围
最终 Pages failed 是否偏高
```

EFDD 阶段优先检查：

```text
Extract keys 导入的是内存 raw
Decrypt or mount disk 选择的是目标 BitLocker 磁盘或磁盘镜像
没有把 memdump.raw 当磁盘镜像挂载
候选 VMK 已保存并逐条验证
目标硬盘编号没有选错
```

目标状态优先检查：

```text
BitLocker 卷是否已经解锁并挂载
机器是否关机、重启或休眠过
所谓开机密码到底是 Windows 登录密码、BIOS 密码、BitLocker PIN 还是硬盘密码
内存 dump 是否来自同一台目标机、同一轮已解锁状态
```

## 回复模板

如果别人咨询这类问题，可以先要求确认授权：

```text
可以研究，但只能限定在自有设备、授权维修或司法/企业取证场景。BitLocker、Windows 用户凭据、BIOS/UEFI 密码都属于敏感访问控制。可以聊原理、取证流程和官方恢复方式，不提供未授权绕过操作。
```

如果对方把恢复密钥和 VMK 混淆，可以这样解释：

```text
EFDD 从内存里扫到的十六进制 Key data 通常是 BitLocker VMK/FVEK 一类密钥材料，不是 48 位恢复密钥。下一步应保存候选 key，再用目标 BitLocker 磁盘或磁盘镜像验证能否挂载。
```

如果对方问是否要拔目标硬盘：

```text
可以接到分析机，但不是为了直接读取文件。BitLocker 盘接到别的电脑上仍然是加密状态。更稳妥的方式是先做磁盘镜像，再用 EFDD 和已提取的 key 去挂载或解密镜像；不要初始化、格式化或修复原盘。
```

## 官方恢复思路

官方恢复方式不是提取或破解原密码，而是证明设备归属后，通过账户体系、企业管理系统或厂商流程恢复访问权。

Windows 用户密码优先走 Microsoft 账户重置、其他管理员账户、域管理员、Entra ID、Intune 或 AD 管理后台。

BitLocker 优先查 Microsoft 账户、AD DS、Entra ID、Intune、MBAM、恢复密钥文件、打印件或 U 盘备份。没有恢复密钥、密码、合法密钥材料或已解锁状态下的内存证据，厂商和微软也不能帮忙直接解密数据。

BIOS/UEFI 或主板密码优先走品牌官方售后、序列号、购买凭证和资产归属证明。不要默认短接、刷 BIOS 或拆芯片，这类操作容易损坏设备，也容易越过授权边界。
