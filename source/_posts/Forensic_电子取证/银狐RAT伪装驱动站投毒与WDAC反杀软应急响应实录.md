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
  - CoinMiner
description: 从伪造驱动下载站 eweadndriver.com.cn 投毒的一次银狐(Silver Fox)RAT 感染完整复盘。攻击者把真微软代码签名证书嫁接到 29MB 恶意外壳(实测验签 HashMismatch)，落地四个后门并写入含 141 条拒绝规则的恶意 WDAC 策略(SiPolicy.p7b)封杀火绒等杀软，强制重启激活。文中给出完整杀伤链、IOC、逐步处置命令与验证日志。续集(09-19)复盘同链挖矿模块借三个伪装名计划任务潜伏五天的"杀了又生"机制、火绒 SQLite 日志取证与家族级全量清除。
keywords: 银狐, Silver Fox, WDAC, App Control for Business, SiPolicy.p7b, 反杀软, 火绒, AM_Delta_Patch, 伪造驱动站, 应急响应, Windows取证, RAT, CoinMiner, 计划任务持久化
cover: https://cdn.jsdelivr.net/gh/FighterGodNemo/CDN/img/forensic-analysis.jpg
created: 2026-09-14T20:50
updated: 2026-09-19T03:00
---

> 一次真实的家用 Windows 11 感染事件复盘。用户在搜索某硬件驱动时误入仿冒站点，下载并运行了伪装成"驱动安装器"的样本，结果 PC 被强制重启、火绒安全软件被系统级策略封杀，弹出"你的组织使用适用于企业的应用控制阻止此应用"。经排查确认为**银狐(Silver Fox / WinOS)RAT**，本文记录从入口、杀伤链、持久化到清除处置的全过程，并给出可复用的 IOC 与检测/处置命令。
>
> 全文基于本机进程、文件时间戳、注册表、计划任务、WDAC 策略文件与样本静态特征取证，未依赖厂商云查杀结论。

## 0. 事件时间线（TL;DR）

| 时间(2026-09-14) | 事件 |
| --- | --- |
| — | 用户搜索驱动，进入仿冒站 `eweadndriver.com.cn`（官方为 `eweadn.cn`） |
| — | 下载 `install_s.8.13.exe`（伪装成微软 `AM_Delta_Patch`，嫁接微软证书但验签 `HashMismatch`） |
| 19:42–19:55 | 运行后落地 4 个后门 + 写入注册表 Run 项 + 4 个计划任务 |
| 19:54:12 | 写入恶意 `C:\Windows\System32\CodeIntegrity\SiPolicy.p7b`（141 条拒绝规则） |
| — | 样本**强制重启系统**以激活 WDAC 策略 |
| 重启后 | 火绒 `HipsMain.exe` 被拦，报"适用于企业的应用控制阻止此应用"，杀软失效 |
| 20:44 | 应急处置：结束进程、禁用恶意策略、清持久化、隔离载荷 |

一句话结论：这是一次**"嫁接微软证书的外壳（验签 HashMismatch）+ 加密载荷 + WDAC 反杀软"**的现代化投毒，杀软在"看得见马"之前就已经被系统策略按死。

## 1. 入口：仿冒驱动站与 `.com.cn` 抢注

- **仿冒域名**：`eweadndriver.com.cn`
- **官方域名**：`eweadn.cn`

攻击者利用**域名抢注(cybersquatting / typosquatting)**：在官方主体名后拼接 `driver` 关键词，再套一个 `.com.cn` 后缀。用户搜索"XX 驱动下载"时，这类站点靠 SEO/竞价很容易排到前面，页面几乎 1:1 克隆官方视觉，下载按钮却指向木马。

> `.cn` 与 `.com.cn` 是**两个独立可注册的命名空间**。真官方持有 `.cn` 不代表 `.com.cn` 被保护，攻击者花几十块就能把"看起来更像国际站"的 `.com.cn` 抢注下来做钓鱼。**认准官方主域、不要凭'看着像'下载驱动**是第一道防线。

## 2. 投放器：嫁接微软证书的外壳（验签 HashMismatch）

落地样本：

| 项 | 值 |
| --- | --- |
| 文件名 | `install_s.8.13.exe` |
| 伪装身份 | `AM_Delta_Patch_1.435.743.0.exe`（Microsoft Malware Protection 定义更新桩） |
| 数字签名 | 携带 `CN=Microsoft Corporation` 证书，但校验为 **`HashMismatch`（签名无效/对不上）** |
| 证书颁发者 | `CN=Microsoft Windows Code Signing PCA 2024` |
| 证书指纹 | `599822D3972D7E3DBF68B47959806C61A2436333` |
| 大小 | 29,522,384 字节（~28MB） |
| SHA256 | `74e3145d4d33dc1143046f0561324a6d6e02f3196c203d68bafa4e43ef8bffcb` |
| MD5 | `e5d6d733c8c1a56014468f3ecc073cb4` |

**关键手法——证书嫁接（signature grafting），不是 overlay 走私**

很多人会以为这类"带微软签名的木马"用的是 overlay 走私（把载荷追加在签名块**之后**，因为 Authenticode 不哈希签名后面的数据，所以签名能保持有效）。但对本样本实测验签，结果是 **`HashMismatch`**——签名根本对不上。PE 结构分析给出了原因：

| 字段 | 值 |
| --- | --- |
| 文件总大小 | 29,522,384 |
| 证书表(Security Directory)偏移 | 29,511,680 |
| 证书表大小 | 10,704 字节 |
| 证书表结束位置 | 29,522,384（= 文件末尾，占比 100%） |
| 签名之后是否有追加数据 | **否**（overlay 未放在签名之后） |

也就是说，那 10,704 字节的**真·微软签名块被贴在文件最末尾**，而 **~29MB 的恶意载荷全部落在证书表之前、即被 Authenticode 哈希覆盖的区域内**。于是：

1. 攻击者从某个真正被微软签名的 EXE 上**扒下整个签名块**（证书 + PKCS#7）；
2. 原样**嫁接到自己那 29MB 恶意文件的尾部**；
3. 证书主体确实是 `Microsoft Corporation`、证书链是真微软 PCA 2024——**但文件实际哈希 ≠ 签名里签的哈希**，WinVerifyTrust 返回 `HashMismatch`。

所以"微软签名"在这里只是**证书主体字样好看**：

```powershell
Get-AuthenticodeSignature .\install_s.8.13.exe
# Status         : HashMismatch
# StatusMessage  : 文件的哈希与签名中存储的哈希不匹配（文件内容可能被更改）
# SignerCertificate.Subject : CN=Microsoft Corporation, O=Microsoft Corporation, ...
```

> **要害对比**：
> - **overlay 走私**（载荷在签名之后）→ 签名仍**有效**，最难识别；
> - **证书嫁接**（本样本，载荷在哈希区内）→ 签名 `HashMismatch`，**只要真去验签就能识破**。
>
> 本样本属于后者，是"看着像、验不过"的糙活。它能骗到用户，纯粹因为**资源管理器双击不校验签名有效性**——图标 + 版本信息"Microsoft Malware Protection"唬人，而不是签名真的通过。右键属性→数字签名，或 `Get-AuthenticodeSignature`，都会立刻暴露 `HashMismatch`。**"看着是微软签名"永远不能作为放行依据，必须看验签结果。**

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
- **"看着是微软签名" ≠ 安全，必须验签**：本样本证书主体确实是 `Microsoft Corporation`，但 `Get-AuthenticodeSignature` 直接返回 `HashMismatch`——证书被嫁接、文件哈希对不上。资源管理器双击并不校验签名有效性，右键属性→数字签名或 `Get-AuthenticodeSignature` 才会暴露。**放行依据永远是验签结果，不是证书里的名字。** 另外若签名有效但文件体积异常、或签名块之后还挂着巨大 overlay，同样要警惕 overlay 走私这类"签名仍有效"的更隐蔽变体。
- 家用主机可开启 **Windows 攻击面削减(ASR)** 与 SmartScreen；企业侧对 WDAC 策略文件目录做**完整性监控**：`SiPolicy.p7b` 与 `CiPolicies\Active\*.cip` 的非预期变更即告警。
- 出现"**你的组织使用适用于企业的应用控制阻止此应用**"却并无组织管控时，第一时间怀疑**恶意 WDAC 策略**，而非软件本身损坏。
- 检测银狐常见特征：`C:\Users\Public\` 或 `Program Files (x86)` 下**随机名文件夹 + 随机名 EXE**、伪装成"腾讯/阿里/微软 Edge 更新"的 Run 项与计划任务、指向这些随机路径的多重冗余自启。

## 9. 续集（2026-09-19）：挖矿模块的"五天潜伏与无限再生"

> 原文处置当晚火绒恢复正常、全盘扫描 2258 个威胁全部清除，看似收尾完成。**五天后（9-19 凌晨），矿马回来了**——`G3SxoQwc.exe` 疯狂吃 CPU，火绒杀掉后立刻"再生"。本章复盘这个"查杀成功 ≠ 清除完整"的典型案例：同一条银狐投毒链里的**挖矿模块**，靠三个伪装名计划任务加一个 SYSTEM 看门狗，把"杀一个换一个名字"的循环玩了五天。

### 9.1 五天时间线（火绒 SQLite 日志还原）

| 时间 | 事件 |
| --- | --- |
| 09-14 19:55:22–28 | 挖矿链落地：`C:\ProgramData\h432BNRU\`（ReadOnly+Hidden+System 三属性）写入 `SZsqmE6X.exe/.dat/.png`——与 RAT 后门同一分钟 |
| 09-14 21:05 | 第一次快速查杀命中 5 威胁（`i4Zs0P8b\9xwKUO6X.exe` CoinMiner、`C:\Windows\Temp\ranchserv.jpg`、投放器本体等），**但母体 `SZsqmE6X.exe` 未被判定**，计划任务全部漏网 |
| 09-15 | 全盘扫描 2258 威胁（绝大多数为回收站残留与自有渗透工具误报），挖矿链依旧存活 |
| 09-16~17 | 看门狗持续重投：矿马每被杀一次就换一个**随机目录+随机名**（`ZlLbRw0o\yHDc9ZDz.exe` → `Lji63SXj\G3SxoQwc.exe`），且同名文件两次哈希不同——每次重新打包 |
| 09-18 18:58:52 | 系统重启。开机 25 秒内 Task Scheduler 按三个计划任务拉起 `2XHGmaur.exe`(ShellLoader)、`9xwKUO6X.exe`(矿马)、`SZsqmE6X.exe`(看门狗)，全部 SYSTEM 权限 |
| 09-18 19:00 起 | 矿马持续吃 CPU（仅 `2XHGmaur.exe` 一个进程就累计 3741 秒 CPU 时间），看门狗同时与 C2 `cinskw.net` 保持心跳 |
| 09-19 00:43 | 用户手动打开火绒——它并没有开机自启，这是潜伏五天的大前提 |
| 09-19 00:46 / 01:05 | 实时防护分别拦截 `G3SxoQwc.exe`(CoinMiner) 与 `2XHGmaur.exe`(ShellLoader)，但用户看到的是"杀了又生" |

### 9.2 关键取证数据源：杀软日志是 SQLite，直接解码

火绒的查杀记录存放在 `C:\ProgramData\Huorong\Sysdiag\` 下的 SQLite 库里，GUI 只展示部分。直接 python sqlite3 读取，能还原完整攻击时间线：

| 文件 → 表 | 内容 |
| --- | --- |
| `QuarantineEx.db` → `FilesV3_60` | 隔离区：原始落地路径 + SHA1 + 原文件大小/时间戳 |
| `applog.db` → `AppRunInfoList_60` | 全机进程运行记录（路径 + FILETIME），可还原任意时刻"谁在跑" |
| `log.db` → `HrLogV3_60` | 扫描/实时防护/网络检测事件：威胁名、父子进程、命令行、C2 域名 |

```python
import sqlite3, json
con = sqlite3.connect("log.db")
con.text_factory = lambda b: b.decode("utf-8", "replace")
for id, fname, ts, detail in con.execute("select id, fname, ts, detail from HrLogV3_60"):
    d = json.loads(detail).get("detail", {})
    # filemon 事件里有 pathname/procname/p_procname/cmdline
    # malsite 事件里有 url（C2）与 proc_sha1
    print(fname, d.get("recname"), d.get("pathname"), d.get("url"))
```

决定性证据全部出自这里：`SZsqmE6X.exe` 的完整命令行、其父进程 `svchost.exe -k netsvcs -p -s Schedule`（→ 任务计划程序拉起）、以及它对 `cinskw.net` 的反复外联（`malsite` 事件，分类 spy）。

> **教训：杀软 GUI 日志 ≠ 全部日志。** 遇到"杀了又生"，先把引擎数据库整个读出来，比反复翻界面高效得多。

### 9.3 家族图谱与"再生"真相

被杀后"重生"的矿马不是同一个文件复活，而是看门狗按需重投 + 每次随机化：

```
计划任务(开机) ──► SZsqmE6X.exe (SYSTEM 看门狗/投放器, ProgramData\h432BNRU)
                     │  与 C2 cinskw.net 心跳
                     ├─► 随机目录+随机名矿马 (Trojan/W64.CoinMiner.f, 679,424 B)
                     │    i4Zs0P8b\9xwKUO6X.exe → ZlLbRw0o\yHDc9ZDz.exe → Lji63SXj\G3SxoQwc.exe
                     └─► 2XHGmaur.exe (Trojan/ShellLoader.cv, 2.6 MB, ProgramData 根)
                          └─ C:\Windows\Temp\ranchserv.jpg (伪装成图片的负载)
```

目录与文件名均为 8 位随机串，配 `ReadOnly,Hidden,System` 属性，资源管理器默认不可见；矿马同名文件两次哈希不同，意味着**按哈希黑名单追杀永远追不上轮换速度**。

真正的再生源头是三个计划任务：

```
\Features Interface Track Prioritization          -> 2XHGmaur.exe
\Implementation Analysis Outcome Achieve Stay     -> 9xwKUO6X.exe  (参数 1776)
\Scheduling Software Governance Contingency Stay  -> SZsqmE6X.exe
```

两个反直觉的点：

1. **任务名不是乱码，而是"正常英文短语"**。`aK6VA` 这种随机名一眼假（原文 9-14 的 RAT 任务就是这种），但 `Features Interface Track Prioritization` 混在 214 个系统任务里毫无违和感——家族已经从"随机名任务"进化到"正常语义名任务"，靠 `^[A-Za-z0-9]{8}$` 之类的名字正则筛**不出来**。
2. **非提权枚举存在盲区**。以普通权限跑 `Schedule.Service` COM 枚举（含 hidden 参数）、`schtasks /query /v`，这三个任务一个都看不到，结论"自启项全干净"是**假的**；同理，普通权限查 SYSTEM 进程时 `ExecutablePath/CommandLine` 一律为空。**任何持久化排查结论，必须以提权复查为准。**

### 9.4 处置（提权一次完成）

顺序：**杀看门狗 → 立刻枚举任务（趁重注册者已死）→ 删任务 → 去属性删文件 → 封 C2 → 开审计**：

```powershell
# 1) 按名+路径双条件杀家族进程（SYSTEM 进程路径为空，必须按名兜底）
$names = "SZsqmE6X","2XHGmaur","G3SxoQwc","9xwKUO6X","yHDc9ZDz"
Get-CimInstance Win32_Process | ? { $n = $_.Name -replace '\.exe$','';
    ($names -contains $n) -or ($_.ExecutablePath -match 'h432BNRU|2XHGmaur|Lji63SXj') } |
  % { taskkill /F /PID $_.ProcessId }

# 2) 提权枚举全部任务 XML，按内容命中（覆盖 ComHandler 型动作）
$sch = New-Object -ComObject Schedule.Service; $sch.Connect()
# 递归遍历所有文件夹；$t.Xml -match 'h432BNRU|SZsqmE6X|2XHGmaur|...' 命中即：
#   先导出 $t.Xml 留证，再 folder.DeleteTask($name, 0)

# 3) 去属性后删目录（否则 Hidden+System 直接删会失败）
attrib -r -h -s "C:\ProgramData\h432BNRU"
attrib -r -h -s "C:\ProgramData\h432BNRU\*" /s /d
Remove-Item "C:\ProgramData\h432BNRU","C:\ProgramData\Lji63SXj" -Recurse -Force

# 4) hosts 封 C2 + 开启任务审计（之后再有任务偷偷注册，事件查看器直接可见）
Add-Content C:\Windows\System32\drivers\etc\hosts "`r`n0.0.0.0 cinskw.net"
wevtutil sl Microsoft-Windows-TaskScheduler/Operational /e:true
```

处置后 0 秒 / 8 秒双时点复验：家族进程 0、恶意任务 0、落地目录 0。

### 9.5 深度终验：把"应该没了"变成"确认没了"

1. **杀软威胁库全量核对**：从 `log.db` 解出 2266 条唯一威胁路径，逐条做存在性检查——仍在盘上的 183 条**全部**是误报（自有渗透/取证工具：sqlmap、impacket、pypykatz、MITRE 攻防笔记、博客"一句话木马"文章等，其中还包括 9-14 晚被顺手隔离的用户取证文件）。**引擎报告要逐条核对，而不是看总数。**
2. **漏网之鱼补刀**：`Program Files (x86)\{5tUMMt,Kj4fBT,yCocIg}\XPSPLOG.dll`——9-14 就落地的**另外三个随机目录**（当晚只处理了 `rnNc4x/Zjb9Rw/pdZ777/1T11K` 四个）。三目录内的 dropper（`pUXLap/uAo7Uo/eqtbxa.exe`）同哈希，且**大小 149,320 字节与原文后门 B 完全一致** → 同一银狐工具链的第二批投放。确认注册表与打印系统零引用后删除。
3. **执行历史交叉验证**：`esentutl /y` 复制活体 `Amcache.hve` → `reg load` 离线挂载 → 按家族路径检索，执行记录为 0——确认没有"执行过就自删"的漏网组件。
4. **孤儿文件甄别**：`C:\Windows\SunnyFilter64.dll`（未签名）+ `SunnyFilter2.sys`（有签名）为 9-17 23:17 落地（与用户当晚自装 Proxifier 同一窗口），**无服务注册、无宿主程序、全注册表 0 引用** → 判定为抓包工具遗留孤儿，移入证据区归档；`C:\Windows\installPrxer64.exe`（Proxifier 安装器）则早已自删。**甄别标准：有签名 + 有注册 + 有宿主 = 用户软件；三者缺一，就要顺着时间窗继续追。**

### 9.6 续集 IOC 汇总

| 类型 | 值 |
| --- | --- |
| C2 / 矿池域名 | `cinskw.net`（已 hosts 封禁 0.0.0.0） |
| 看门狗/投放器 | `C:\ProgramData\h432BNRU\SZsqmE6X.exe`（486,832 B，SHA1 `E0D6B85E682863BBE40237830D1E39B082672F02`，伴生 .dat/.png） |
| ShellLoader | `C:\ProgramData\2XHGmaur.exe`（2,660,352 B，SHA1 `C5F2A359FA79F39D12DA18EA249FA77A0F95715F`） |
| 矿马（每次重编译，679,424 B） | SHA1：`03445BF75BAA30794A3A31C138DBF7A23B96A128`、`A04DC4C56AF2E99517BB34244AB0DA1E45818F4D`、`E3FA1F1764002215C8BC2CF2E51BBF45D854F6CC`、`71E408F1B781420063505FB75A2FF398A35135F7`、`E994172DC398E6AAA5C5D24FAE1BB3948E272F4D` |
| 伪装图片负载 | `C:\Windows\Temp\ranchserv.jpg`（28,272 B，SHA1 `B2FB8FCADFE09C16CBF7F7A90FBA0AEF8020BDC0`） |
| 第二批投放点 | `Program Files (x86)\{5tUMMt,Kj4fBT,yCocIg}\`，dropper SHA1 `C80ED6716E89D486F28EBBC150EC5AA362DB963`（149,320 B，与后门 B 同尺寸） |
| 伪装名计划任务 | `Features Interface Track Prioritization` / `Implementation Analysis Outcome Achieve Stay` / `Scheduling Software Governance Contingency Stay` |
| 火绒检测名 | `Trojan/W64.CoinMiner.f!crit`、`Trojan/ShellLoader.cv!crit`、malsite(spy) → `cinskw.net` |

### 9.7 补充到防御清单的教训

1. **"查杀成功" ≠ "清除完整"**：多模块家族（RAT + WDAC + 挖矿）要按**家族**清，而不是按**当次告警**清——当晚引擎没报的模块（母体、计划任务、第二批投放点），五天后全部还魂。
2. **持久化排查必须提权**：非提权下计划任务枚举有 ACL 盲区、SYSTEM 进程路径/命令行为空。哪怕只是"复查一遍"，也要开管理员 PowerShell。
3. **随机名危险，语义伪装名更危险**：任务审计应以**动作路径**为主（Execute/Arguments 指向 `ProgramData\随机目录`、Temp、Public），任务名只能当辅助线索。
4. **把杀软数据库当取证数据源**：SQLite 直读隔离区、进程运行记录与网络检测，能完整还原攻击者每次"重生"的时间线——这是本次定案的决定性证据。
5. **威胁列表逐条核对**而非看计数：2258 条里 2000+ 是回收站与自有工具误报，逐条做存在性检查才能确认真残留。
6. **善后三件套**：hosts 封 C2、`wevtutil sl Microsoft-Windows-TaskScheduler/Operational /e:true` 开任务审计、杀软设为开机自启并保持运行——本次潜伏五天的大前提就是 9-14 晚杀软没在运行。

---

*本文为真实事件脱敏复盘，样本哈希与 IOC 供防御与研究使用。请勿在缺乏授权与隔离环境的情况下运行任何样本。*
