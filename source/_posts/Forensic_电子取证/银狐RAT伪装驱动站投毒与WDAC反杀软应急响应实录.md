---
title: 银狐RAT伪装驱动站投毒与WDAC反杀软应急响应实录
permalink: /2026/09/14/Forensic_电子取证/SilverFox-RAT-WDAC-Incident/
date: 2026-09-14 20:50:00
categories:
  - Forensic_电子取证
tags:
  - 电子取证
  - Forensic
  - 应急响应
  - 银狐
  - WDAC
  - Windows安全
  - 恶意软件分析
description: 从伪造驱动下载站 eweadndriver.com.cn 投毒的一次银狐(Silver Fox)RAT 感染完整复盘。攻击者滥用微软签名的 AM_Delta_Patch 外壳携带 29MB 加密载荷，落地四个后门并写入含 141 条拒绝规则的恶意 WDAC 策略(SiPolicy.p7b)封杀火绒等杀软，强制重启激活。文中给出完整杀伤链、IOC、逐步处置命令与验证日志。
keywords: 银狐, Silver Fox, WDAC, App Control for Business, SiPolicy.p7b, 反杀软, 火绒, AM_Delta_Patch, 伪造驱动站, 应急响应, Windows取证, RAT
cover: https://cdn.jsdelivr.net/gh/FighterGodNemo/CDN/img/forensic-analysis.jpg
created: 2026-09-14T20:50
updated: 2026-09-14T20:50
---

> 一次真实的家用 Windows 11 感染事件复盘。用户在搜索某硬件驱动时误入仿冒站点，下载并运行了伪装成"驱动安装器"的样本，结果 PC 被强制重启、火绒安全软件被系统级策略封杀，弹出"你的组织使用适用于企业的应用控制阻止此应用"。经排查确认为**银狐(Silver Fox / WinOS)RAT**，本文记录从入口、杀伤链、持久化到清除处置的全过程，并给出可复用的 IOC 与检测/处置命令。
>
> 全文基于本机进程、文件时间戳、注册表、计划任务、WDAC 策略文件与样本静态特征取证，未依赖厂商云查杀结论。

## 0. 事件时间线（TL;DR）

| 时间(2026-09-14) | 事件 |
| --- | --- |
| — | 用户搜索驱动，进入仿冒站 `eweadndriver.com.cn`（官方为 `eweadn.cn`） |
| — | 下载 `install_s.8.13.exe`（伪装成微软 `AM_Delta_Patch`，带微软签名） |
| 19:42–19:55 | 运行后落地 4 个后门 + 写入注册表 Run 项 + 4 个计划任务 |
| 19:54:12 | 写入恶意 `C:\Windows\System32\CodeIntegrity\SiPolicy.p7b`（141 条拒绝规则） |
| — | 样本**强制重启系统**以激活 WDAC 策略 |
| 重启后 | 火绒 `HipsMain.exe` 被拦，报"适用于企业的应用控制阻止此应用"，杀软失效 |
| 20:44 | 应急处置：结束进程、禁用恶意策略、清持久化、隔离载荷 |

一句话结论：这是一次**"合法签名外壳 + 附加加密载荷 + WDAC 反杀软"**的现代化投毒，杀软在"看得见马"之前就已经被系统策略按死。

## 1. 入口：仿冒驱动站与 `.com.cn` 抢注

- **仿冒域名**：`eweadndriver.com.cn`
- **官方域名**：`eweadn.cn`

攻击者利用**域名抢注(cybersquatting / typosquatting)**：在官方主体名后拼接 `driver` 关键词，再套一个 `.com.cn` 后缀。用户搜索"XX 驱动下载"时，这类站点靠 SEO/竞价很容易排到前面，页面几乎 1:1 克隆官方视觉，下载按钮却指向木马。

> `.cn` 与 `.com.cn` 是**两个独立可注册的命名空间**。真官方持有 `.cn` 不代表 `.com.cn` 被保护，攻击者花几十块就能把"看起来更像国际站"的 `.com.cn` 抢注下来做钓鱼。**认准官方主域、不要凭'看着像'下载驱动**是第一道防线。

## 2. 投放器：微软签名外壳 + 29MB 附加载荷

落地样本：

| 项 | 值 |
| --- | --- |
| 文件名 | `install_s.8.13.exe` |
| 伪装身份 | `AM_Delta_Patch_1.435.743.0.exe`（Microsoft Malware Protection 定义更新桩） |
| 数字签名 | Microsoft Corporation（**合法有效**） |
| 大小 | 29,522,384 字节（~28MB） |
| SHA256 | `74e3145d4d33dc1143046f0561324a6d6e02f3196c203d68bafa4e43ef8bffcb` |
| MD5 | `e5d6d733c8c1a56014468f3ecc073cb4` |

**关键手法——Authenticode overlay 走私**：

微软正版 Defender 定义更新桩 `AM_Delta_Patch.exe` 本体只有几百 KB。样本却有 28MB，多出来的 ~29MB 是**附加在 PE 尾部的 overlay 数据**（加密载荷）。

Authenticode（PE 数字签名）**只覆盖到签名表指定的映像范围，不校验追加在文件末尾的 overlay**。因此攻击者可以：

1. 拿一个真正被微软签名的合法 EXE；
2. 在其尾部**追加**一大段加密的恶意载荷；
3. 签名依旧显示"Microsoft Corporation，有效"——因为被篡改的部分不在签名覆盖区内。

外壳运行后自解密 overlay，在内存里拉起真正的木马。这就是为什么"看数字签名是微软"完全不能作为放行依据。

> 沙箱侧佐证：CAPE 报告评分 0.8，命中 PsExec 相关 Sigma 规则，但样本在沙箱内**未完全引爆**（检测到分析环境后蛰伏），这也是这类样本对抗动态分析的常见表现。

## 3. 落地物与持久化

样本落地**两个不同的后门本体**，各自复制两份、分散在公共目录与 `Program Files (x86)`，全部于 19:42–19:55 生成：

| 载荷文件 | 路径 | 大小 | SHA256 |
| --- | --- | --- | --- |
| `Sw5XI8.exe` | `C:\Users\Public\rnNc4x\` | 139,088 | `676A2A7B94CA2F8EC76352EE656E4D075BB342BD7AD6EFBC7C19C060001EACE7` |
| `xxLav9.exe` | `C:\Users\Public\Zjb9Rw\` | 139,088 | `676A2A7B…`（同上） |
| `wUmXOz.exe` | `C:\Program Files (x86)\pdZ777\` | 149,320 | `6D6BA2BC9AD414837826F7278BC3E0116F1AEDA02D0C2284ED65819F5D9180A8` |
| `tl1hI.exe` | `C:\Program Files (x86)\1T11K\` | 149,320 | `6D6BA2BC…`（同上） |

**随机文件夹/文件名**（`rnNc4x`、`Zjb9Rw`、`pdZ777`、`1T11K`）是银狐的典型特征，用于对抗基于固定路径的检测。

**持久化——注册表 Run 项**（伪装成腾讯/阿里安全组件）：

```
HKLM\...\CurrentVersion\Run
  "Tencent SecurityHealth"   = C:\Users\Public\rnNc4x\Sw5XI8.exe
  "Alibaba SecurityHealtha"  = C:\Program Files (x86)\pdZ777\wUmXOz.exe
```

**持久化——计划任务**（其中两个冒充 Edge 更新任务）：

```
aK6VA                                          -> ...\rnNc4x\Sw5XI8.exe
tUEIW                                          -> ...\Zjb9Rw\xxLav9.exe
MicrosoftEdgeUpdateTaskUA Task-S-1-5-18 jXoH8  -> ...\1T11K\tl1hI.exe
MicrosoftEdgeUpdateTaskUA Task-S-1-5-18 tc4WB  -> ...\pdZ777\wUmXOz.exe
```

多份副本 + 多种自启（Run + 计划任务）互为冗余：删一处，其余仍能把自己拉回来——这是清除时**必须一次性全清**的原因。

## 4. 核心杀招：用 WDAC 策略反向封杀杀软

### 4.1 什么是 WDAC

**WDAC（Windows Defender Application Control）**，在新版 Windows 里也叫 **App Control for Business（适用于企业的应用控制）**，是微软面向企业的应用白/黑名单机制。它工作在**内核代码完整性(CI)层**，比普通杀软更底层：策略里"拒绝"的程序，**在加载阶段就被系统直接拦死**，杀软自身也管不了它——因为 WDAC 比杀软更靠近内核。

策略以 `.p7b`/`.cip` 形式存放在：

- 传统单策略路径：`C:\Windows\System32\CodeIntegrity\SiPolicy.p7b`
- 多策略路径：`C:\Windows\System32\CodeIntegrity\CiPolicies\Active\*.cip`

策略变更**需要重启才能生效**——这正解释了样本为何要强制重启。

### 4.2 恶意策略详情

| 项 | 值 |
| --- | --- |
| 文件 | `C:\Windows\System32\CodeIntegrity\SiPolicy.p7b` |
| 大小 | 24,972 字节 |
| 修改时间 | 2026-09-14 19:54:12（与投毒同一分钟） |
| 基础策略 | `AllowMicrosoft_2023-05-04` |
| 拒绝规则 | **141 条**，覆盖 40+ 安全产品 |

被列入黑名单的杀软/EDR（节选）：

- **火绒**：`%OSDRIVE%\Program Files (x86)\Huorong\*`（`HipsMain.exe`、`Sysdiag`）
- 360、腾讯电脑管家(QQPCMgr)、卡巴斯基、ESET、Bitdefender
- 奇安信天擎、深信服(Sangfor)、SentinelOne、Cylance …

逻辑很阴险：基础策略是 `AllowMicrosoft`（放行一切微软签名的东西，保证系统能开机、木马外壳这类"微软签名"的也能跑），再叠加一份**专打国内外主流杀软**的拒绝清单。重启后，火绒的核心进程一加载就被 CI 层拒绝，于是用户看到：

> **你的组织使用适用于企业的应用控制阻止此应用**
> `C:\Program Files\Huorong\Sysdiag\bin\HipsMain.exe`

用户既没有加入任何"组织"，也没配过策略——这条提示本身就是**被植入恶意 WDAC 策略**的强信号。

## 5. 处置：解封 → 清持久化 → 隔离载荷

处置顺序很关键：**先结束进程，再动文件/策略/持久化**，否则运行中的木马会锁文件或即时重写。以下动作需在**管理员 PowerShell**中执行。

### 5.1 禁用恶意 WDAC 策略（救回杀软的关键一步）

直接删可能因权限被拒，用重命名 + 必要时夺权：

```powershell
$sp = 'C:\Windows\System32\CodeIntegrity\SiPolicy.p7b'
try {
    Rename-Item $sp "$sp.malbak" -Force -EA Stop
} catch {
    takeown /f $sp | Out-Null
    icacls $sp /grant "*S-1-5-32-544:F" | Out-Null
    Rename-Item $sp "$sp.malbak" -Force
}
```

> 若系统已经无法进入桌面，可在 **WinRE（恢复环境）命令提示符**里离线改名：
> `ren C:\Windows\System32\CodeIntegrity\SiPolicy.p7b SiPolicy.p7b.malbak`
> 注意：只动这份恶意 `SiPolicy.p7b`，**不要碰** `CiPolicies\Active\` 下正常的 `.cip` 文件。

### 5.2 一体化清除脚本

结束进程、禁策略、清 Run 项、删计划任务、隔离载荷目录（移动到桌面隔离区，**可逆**，非硬删），全程写日志：

```powershell
$ts=Get-Date -Format 'yyyyMMdd_HHmmss'; $desk=[Environment]::GetFolderPath('Desktop')
$q=Join-Path $desk "QUARANTINE_$ts"; New-Item -ItemType Directory -Force $q|Out-Null
$log=Join-Path $desk "cleanup_log_$ts.txt"; function L($m){$m|Tee-Object $log -Append}
$bad='rnNc4x','Zjb9Rw','pdZ777','1T11K'
# 1 结束后门进程
Get-Process|?{$_.Path}|%{foreach($d in $bad){if($_.Path -match $d){Stop-Process $_.Id -Force -EA SilentlyContinue;L "杀进程 $($_.Path)";break}}}
# 2 禁用杀软黑名单 WDAC 策略
$sp='C:\Windows\System32\CodeIntegrity\SiPolicy.p7b'
if(Test-Path $sp){try{Rename-Item $sp "$sp.malbak_$ts" -Force -EA Stop}catch{takeown /f $sp|Out-Null;icacls $sp /grant "*S-1-5-32-544:F"|Out-Null;Rename-Item $sp "$sp.malbak_$ts" -Force};L "已禁用 SiPolicy.p7b"}
# 3 清 Run 自启
foreach($h in 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run','HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run','HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run'){if(Test-Path $h){(Get-ItemProperty $h).PSObject.Properties|?{$_.Name -notmatch '^PS'}|%{foreach($d in $bad){if($_.Value -match $d){Remove-ItemProperty $h $_.Name -Force -EA SilentlyContinue;L "删Run $($_.Name)";break}}}}}
# 4 删恶意计划任务
Get-ScheduledTask|?{$_.TaskPath -notlike '\Microsoft\*'}|%{$e=($_.Actions.Execute -join ';');foreach($d in $bad){if($e -match $d){Unregister-ScheduledTask -TaskName $_.TaskName -TaskPath $_.TaskPath -Confirm:$false -EA SilentlyContinue;L "删任务 $($_.TaskName)";break}}}
# 5 隔离马文件夹
$dl=@();Get-ChildItem "C:\Users\*\rnNc4x","C:\Users\*\Zjb9Rw" -Directory -Force -EA SilentlyContinue|%{$dl+=$_.FullName};'C:\Program Files (x86)\pdZ777','C:\Program Files (x86)\1T11K'|%{if(Test-Path $_){$dl+=$_}}
foreach($d in $dl){try{Move-Item $d (Join-Path $q (Split-Path $d -Leaf)) -Force -EA Stop;L "隔离 $d"}catch{L "隔离失败(重启后再删) $d"}}
L "== 完成 $log =="
```

### 5.3 处置结果（实测日志摘录）

```
杀进程 PID 13228  C:\Users\Public\rnNc4x\Sw5XI8.exe
杀进程 PID 30436  C:\Program Files (x86)\pdZ777\wUmXOz.exe
杀进程 PID 17328  C:\Users\Public\Zjb9Rw\xxLav9.exe
已禁用 SiPolicy.p7b
删Run  Tencent SecurityHealth
删Run  Alibaba SecurityHealtha
删任务 aK6VA / tUEIW / MicrosoftEdgeUpdateTaskUA...jXoH8 / ...tc4WB
隔离  rnNc4x / Zjb9Rw / pdZ777 / 1T11K
```

复验：

```
SiPolicy.p7b            -> 仅剩 SiPolicy.p7b.malbak_20260914_204425（已禁用）
rnNc4x/Zjb9Rw/pdZ777/1T11K  -> Test-Path 全部 False（已隔离）
计划任务 aK6VA / tUEIW  -> 全部 False（已删除）
```

**重启后火绒恢复正常**，随即执行全盘扫描。

## 6. IOC 汇总

**网络**
- 仿冒站：`eweadndriver.com.cn`

**文件哈希(SHA256)**
- 投放器：`74e3145d4d33dc1143046f0561324a6d6e02f3196c203d68bafa4e43ef8bffcb`
- 后门 A：`676A2A7B94CA2F8EC76352EE656E4D075BB342BD7AD6EFBC7C19C060001EACE7`
- 后门 B：`6D6BA2BC9AD414837826F7278BC3E0116F1AEDA02D0C2284ED65819F5D9180A8`

**落地路径**
- `C:\Users\Public\rnNc4x\Sw5XI8.exe`、`C:\Users\Public\Zjb9Rw\xxLav9.exe`
- `C:\Program Files (x86)\pdZ777\wUmXOz.exe`、`C:\Program Files (x86)\1T11K\tl1hI.exe`

**注册表**
- `HKLM\...\Run\Tencent SecurityHealth`
- `HKLM\...\Run\Alibaba SecurityHealtha`

**计划任务**
- `aK6VA`、`tUEIW`、`MicrosoftEdgeUpdateTaskUA Task-S-1-5-18 jXoH8`、`... tc4WB`

**系统策略**
- `C:\Windows\System32\CodeIntegrity\SiPolicy.p7b`（24,972 字节，基础策略 AllowMicrosoft，141 条杀软拒绝规则）

## 7. 根治：为什么"清干净"还不够

本次样本是**银狐(Silver Fox)RAT**——具备远程控制能力、以管理员权限运行过。上面的处置能救回杀软、铲掉**已知**持久化，但：

> **凡是跑过 RAT 且提权成功的机器，就不能再当作"可信"。** RAT 在驻留期间很可能已窃取浏览器 Cookie、保存的密码、聊天记录与凭据。

因此完整收尾必须做到：

1. **换一台干净设备**，立即修改所有重要账号密码（邮箱、微信/QQ、网银、支付、Steam、网盘…），能开 2FA 的全开——**这是最高优先级**，因为凭据可能已外泄。
2. 本机**重装系统**（格盘净装，非"恢复"），从可信介质安装。
3. 重装前保留样本/日志到隔离介质，供后续分析或报案。

清除脚本 = 止血；**改密码 + 重装 = 根治**。

## 8. 防御与检测建议

- **驱动/软件只从官方主域下载**，警惕 `官方名+关键词` 拼接的 `.com.cn`/`.top` 等抢注域名。
- **数字签名 ≠ 安全**：签名合法但文件体积异常（远大于正版桩程序）、或 overlay 巨大，应高度怀疑 overlay 走私。
- 家用主机可开启 **Windows 攻击面削减(ASR)** 与 SmartScreen；企业侧对 WDAC 策略文件目录做**完整性监控**：`SiPolicy.p7b` 与 `CiPolicies\Active\*.cip` 的非预期变更即告警。
- 出现"**你的组织使用适用于企业的应用控制阻止此应用**"却并无组织管控时，第一时间怀疑**恶意 WDAC 策略**，而非软件本身损坏。
- 检测银狐常见特征：`C:\Users\Public\` 或 `Program Files (x86)` 下**随机名文件夹 + 随机名 EXE**、伪装成"腾讯/阿里/微软 Edge 更新"的 Run 项与计划任务、指向这些随机路径的多重冗余自启。

---

*本文为真实事件脱敏复盘，样本哈希与 IOC 供防御与研究使用。请勿在缺乏授权与隔离环境的情况下运行任何样本。*
