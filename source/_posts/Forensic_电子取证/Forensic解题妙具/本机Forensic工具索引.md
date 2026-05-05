---
title: 本机Forensic工具索引
date: 2026-05-05
permalink: /2026/05/05/Forensic_电子取证/Forensic解题妙具/本机Forensic工具索引/
categories:
  - Forensic_电子取证
  - Forensic解题妙具
tags:
  - 电子取证
  - Forensic
  - 取证工具
  - 工具索引
created: 2026-05-05T09:20
updated: 2026-05-05T09:20
---

# 本机 Forensic 工具索引

这篇索引用来快速判断“遇到什么证据先用什么工具”。正式案件分析仍要保留路径、哈希、命令、截图和结论，不能只写工具名。

本机工具清单来源：

```text
C:\Users\glj07\AppData\Roaming\Codex_Assistant\Usable_Tools_List.txt
C:\Users\glj07\AppData\Roaming\Codex_Assistant\WSL_CTF工具清单.txt
C:\Users\glj07\.codex\skills\ctf-memory-playbook\references\local-tool-index.md
```

新增或升级取证工具后，要同步更新这篇索引、本机工具清单和 CTF/Forensic skill 的工具索引。

## 快速选择

| 证据类型 | 优先工具 | 什么时候用 |
| --- | --- | --- |
| 压缩包、套娃、伪加密 | 7-Zip、bkcrack、ZipCenOp、Python、foremost、binwalk | 先列目录和测试完整性，再判断伪加密、明文攻击或雕刻 |
| 磁盘镜像、分区、文件系统 | X-Ways Forensics、DiskGenius、WinHex/X-Ways、FTK/DFIR 工具箱 | 镜像挂载、文件恢复、时间线、分区和文件系统结构 |
| 内存镜像 | Volatility 3、strings、YARA、Elcomsoft Disk Decryptor | 进程、网络、命令行、文件扫描、BitLocker 密钥线索 |
| 手机取证 | UFED、DataFindx、iBackup Viewer Pro、AndroidKiller、JADX、DB Browser/SQLite Expert | Android/iOS 备份、聊天记录、App 数据库、APK 逆向 |
| 数据库和日志 | SQLite Expert、DB Browser for SQLite、Navicat Premium 17、NTFS Log Tracker | SQLite、SQLCipher、MySQL dump、NTFS `$LogFile`、应用日志 |
| 网络流量 | Wireshark、TShark、Fiddler Everywhere、Scapy | pcap、HTTP/HTTPS、导出对象、DNS、TLS、移动 App 抓包 |
| 密码恢复 | hashcat 7.1.2、john、Passware Kit、Elcomsoft | Office、压缩包、BitLocker、系统账户、哈希爆破 |
| 文件修复与雕刻 | foremost、binwalk、PuzzleSolver、010 Editor、WinHex/X-Ways | 损坏图片、碎片文件、文件头错乱、拼接恢复 |
| 逆向辅助 | IDA、JADX、AndroidKiller、OllyDbg、x64dbg、CFF Explorer | 恶意样本、APK、壳、配置提取、简单动态调试 |
| 自动化与 AI 辅助 | Python、pa_script、DFIR 工具箱、DeepSeek-Coder GGUF | 批量解析、辅助脚本、代码阅读和规则生成 |

## 磁盘与文件系统

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| X-Ways Forensics | `D:\Forensic\ForensicTool\Mirror\X-Ways Forensics-顶级的综合磁盘取证平台，以速度快、资源占用低著称\` | 启动主程序导入镜像 | 磁盘镜像、文件系统、文件恢复、时间线分析 |
| WinHex/X-Ways 19.8 | `D:\CaptureTheFlag\CTFTool\Xways Winhex 19.8 Professional License` | GUI | 原始扇区、十六进制、文件系统结构 |
| DiskGenius | `D:\CaptureTheFlag\CTFTool\diskgenius吾爱专业破解版 v5` | GUI | 分区恢复、文件恢复、镜像浏览 |
| 010 Editor | `D:\CaptureTheFlag\CTFTool\010Editor\010Editor.exe` | `010Editor.exe image.bin` | 文件头、结构模板、手工修复 |
| FTK/DFIR 工具箱 | `D:\Forensic\ForensicTool\Others\DFIR蘇小沐取证工具箱\` | 启动对应子工具 | 综合取证、Windows 逆向、Android 辅助工具 |
| 龙信天眼 LX-A300 | `D:\Forensic\ForensicTool\Others\龙信杯工具\龙信天眼介质取证系统LX-A300 (5)\` | GUI | 比赛介质取证、存储介质快速分析 |

优先策略：镜像先只读挂载或在工具中打开，先记录哈希和证据路径，再做恢复和导出。

## 内存取证

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| Volatility 3 2.26.2 | WSL `/usr/local/bin/vol` | `vol -f mem.raw windows.pslist` | Windows/Linux/macOS 内存分析 |
| Windows Volatility 3 源码 | `D:\Forensic\ForensicTool\Decrypt\volatility3-develop\volatility3-develop\vol.py` | `python vol.py -f mem.raw windows.pslist` | Windows 侧复核或离线分析 |
| strings | WSL `/usr/bin/strings` | `strings -el mem.raw | grep keyword` | 快速搜索口令、路径、URL、flag |
| Elcomsoft Forensic Disk Decryptor 2.20.1011 | `D:\Forensic\ForensicTool\Decrypt\Elcomsoft.Forensic.Disk.Decryptor\Elcomsoft.Forensic.Disk.Decryptor.2.20.1011\` | GUI | 从内存或休眠文件找 BitLocker/加密卷密钥 |
| LovelyMem | `D:\Forensic\ForensicTool\Others\Lovelymem\` | GUI/脚本 | 内存题快速辅助分析 |

常用命令：

```bash
vol -f mem.raw windows.info
vol -f mem.raw windows.pslist
vol -f mem.raw windows.netscan
vol -f mem.raw windows.cmdline
vol -f mem.raw windows.filescan
```

## 手机与 App 取证

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| UFED | `D:\Forensic\ForensicTool\Mobile\UFED-全球顶尖的手机物理取证工具，能破解锁屏、深度提取数据\UFED` | GUI | 手机物理/逻辑提取、设备镜像 |
| DataFindx 4 | `D:\Forensic\ForensicTool\Mobile\DataFindx_4\` | GUI | 手机备份、聊天记录、应用数据解析 |
| iBackup Viewer Pro | `D:\Forensic\ForensicTool\Mobile\iBackup Viewer Pro-专门用于解析和查看苹果iTunes备份文件的内容\iBackup Viewer.exe` | GUI | iTunes 备份、iOS 数据查看 |
| AndroidKiller | `D:\Forensic\ForensicTool\Mobile\AndroidKiller-master\AndroidKiller.exe` | GUI | APK 反编译、Smali、资源文件 |
| JADX 1.5.3 | `D:\Forensic\ForensicTool\Reverse\jadx-gui-1\jadx-gui-1.5.3.exe` | GUI 打开 APK | Android Java/Kotlin 代码阅读 |
| plist Editor/iBackupBot | `D:\Forensic\ForensicTool\Mobile\plist Editor Pro\iBackupBot.app` | GUI | iOS plist、备份数据辅助查看 |
| sqlite3 | `D:\CaptureTheFlag\CTFTool\platform-tools\sqlite3.exe` | `sqlite3 app.db ".tables"` | App SQLite 数据库快速查询 |

优先策略：手机题先识别 Android/iOS 和备份类型，再找聊天、浏览器、定位、媒体、账号、数据库和时间戳。

## 数据库、日志与时间线

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| SQLite Expert Professional 5.5.7.618 | `D:\Forensic\ForensicTool\Database\SQLite Expert Professional-专门用于查看、编辑和分析SQLite数据库文件（常见于手机App）\SQLite Expert Professional v5.5.7.618\` | GUI | App SQLite、索引、视图、表结构分析 |
| DB Browser for SQLite/SQLCipher | `D:\Forensic\ForensicTool\Database\DB\DB Browser for SQLite.exe` | GUI | 普通 SQLite、SQLCipher 相关库辅助 |
| Navicat Premium 17 | `D:\Forensic\ForensicTool\Database\Navicat Premium 17\navicat.exe` | GUI | MySQL、PostgreSQL、SQLite 等数据库取证 |
| NTFS Log Tracker 1.8 | `D:\Forensic\ForensicTool\Database\NTFS Log Tracker-分析NTFS文件系统的日志（$LogFile），追踪文件操作历史\NTFS Log Tracker v1.8\` | GUI 导入 `$LogFile` | NTFS 文件操作记录、删除/重命名时间线 |
| DCode | 博客已有 `Dcode时间戳转换.md` | GUI/在线同类 | Windows FILETIME、Unix、Chrome、iOS 时间转换 |
| Python pandas/sqlite3 | 本机 Python/WSL Python | 脚本查询和导出 | 大表筛选、批量时间转换、重复查询复现 |

查询要在 WP 中保留 SQL 原文、关键行、时间戳原值和转换结果。

## 网络与 Web 取证

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| Wireshark 4.6.2 | `D:\CaptureTheFlag\CTFTool\Wireshark\Wireshark.exe` | GUI 打开 pcap | 协议还原、追踪流、对象导出 |
| TShark 4.6.2 | `D:\CaptureTheFlag\CTFTool\Wireshark\tshark.exe` | `tshark -r a.pcapng -Y http` | 批量提取字段和对象 |
| Fiddler Everywhere | `D:\Forensic\ForensicTool\Web\fiddler-everywhere-Web调试代理工具，捕获和分析HTTPHTTPS流量\Fiddler Everywhere\` | GUI | HTTP/HTTPS 调试、移动 App 代理抓包 |
| Fiddler Classic | `D:\Forensic\ForensicTool\Database\Fiddler-classic5.0.20253.3311-latest.exe` | 安装/启动 | HTTP 调试、证书代理 |
| Scapy 2.7.0 | WSL Python 包 | `from scapy.all import *` | 自定义协议解析、包重组 |
| CTF-NetA | `D:\CaptureTheFlag\CTFTool\CTF-NetA-V2.11.15\` | GUI/插件 | CTF 流量分析辅助 |

常用 TShark：

```powershell
tshark -r capture.pcapng -q -z io,phs
tshark -r capture.pcapng -Y "http.request" -T fields -e frame.number -e http.host -e http.request.uri
tshark -r capture.pcapng --export-objects http,exported_http
```

## 密码恢复与解密

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| hashcat 7.1.2 | `D:\Forensic\ForensicTool\Decrypt\hashcat-7.1.2\hashcat.exe` | 在目录内运行 `hashcat.exe -m 模式 hash.txt dict.txt` | GPU 哈希破解、Office/压缩包/系统哈希 |
| john | WSL `/usr/sbin/john` | `john hash.txt --wordlist=dict.txt` | hashcat 不方便时、格式转换后的口令破解 |
| Passware Kit Forensic 2022 | `D:\Forensic\ForensicTool\Decrypt\Passware Kit 2022绿色版(汉化修正)\PasswareKitForensic.exe` | GUI | Office、PDF、压缩包、磁盘密码恢复 |
| Elcomsoft Disk Decryptor | `D:\Forensic\ForensicTool\Decrypt\Elcomsoft.Forensic.Disk.Decryptor\` | GUI | BitLocker、加密卷、内存密钥 |
| Ciphey | `D:\Forensic\ForensicTool\Decrypt\Ciphey\Python38\test_venv\Scripts\ciphey.exe` | `ciphey -t "cipher"` | 常见编码和古典密码自动识别 |
| Cryptodictionary | `D:\CaptureTheFlag\CTFTool\Cryptodictionary\` | 配合 hashcat/john | 弱口令、设备默认密码、用户名字典 |

hashcat 默认注意显卡设备选择；本机清单记录 RTX 5090 常用 `-d 2`。

## 文件恢复、修复与雕刻

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| foremost | WSL `/usr/bin/foremost` | `foremost -i image.bin -o out` | 文件雕刻、图片/压缩包恢复 |
| binwalk | WSL `/usr/bin/binwalk` | `binwalk -e file` | 固件、套娃、嵌入数据 |
| PuzzleSolver 2.1.8 | `D:\Forensic\ForensicTool\FileDataRecovery\PuzzleSolver-2\PuzzleSolver-2.1.8\` | Python/GUI 视具体脚本 | 拼图、损坏图像、结构修复 |
| FinalData/Fatbeans | `D:\Forensic\ForensicTool\FileDataRecovery\Fatbeans-likely 是 FinalData，经典的数据恢复软件\` | GUI | 经典文件恢复 |
| 7-Zip | `D:\CaptureTheFlag\CTFTool\7-Zip\7z.exe` | `7z t file`、`7z x file` | 压缩包测试、解压、查看文件树 |
| 010 Editor | `D:\CaptureTheFlag\CTFTool\010Editor\010Editor.exe` | GUI | 文件头、chunk、offset、手工修复 |

## 逆向与样本分析

| 工具 | 当前推荐路径 | 用法 | 适合场景 |
| --- | --- | --- | --- |
| JADX 1.5.3 | `D:\Forensic\ForensicTool\Reverse\jadx-gui-1\jadx-gui-1.5.3.exe` | GUI | APK 反编译 |
| AndroidKiller | `D:\Forensic\ForensicTool\Mobile\AndroidKiller-master\AndroidKiller.exe` | GUI | Smali、资源、签名和打包 |
| IDA Pro | `D:\CaptureTheFlag\CTFTool\IDA Pro 8.3\` / `D:\CaptureTheFlag\CTFTool\idapro93\` | GUI | 二进制样本分析 |
| OllyDbg | `D:\Forensic\ForensicTool\Others\DFIR蘇小沐取证工具箱\Tools\Windows逆向\OllyDbg\` | GUI | 32 位 Windows 动态调试 |
| x64dbg | `D:\CaptureTheFlag\CTFTool\snapshot\release\x64\x64dbg.exe` | GUI | 64 位 Windows 动态调试 |
| CFF Explorer | `D:\Forensic\ForensicTool\Reverse\CFF_Explorer-强大的PE文件（Windows可执行文件）编辑器，用于逆向分析\` | GUI | PE 结构、导入导出、资源 |
| 自动脱壳工具合辑 | `D:\Forensic\ForensicTool\Reverse\35款最新自动脱壳工具合辑\` | 选择对应壳工具 | UPX、Aspack、Armadillo 等脱壳 |

## WSL 取证命令速查

| 工具 | 命令 | 版本线索 |
| --- | --- | --- |
| Volatility 3 | `vol`、`volshell` | 2.26.2 |
| ExifTool | `exiftool` | 12.76 |
| binwalk | `binwalk` | 已安装 |
| foremost | `foremost` | 已安装 |
| strings/file | `strings`、`file` | 系统命令 |
| hashcat/john | `hashcat`、`john` | hashcat 可用，john 6.2.6 |
| tshark/scapy | Windows TShark 或 WSL Scapy | Scapy 2.7.0 |

进入环境：

```powershell
wsl -d Ubuntu-CTF -u glj07
cd ~/CTF/Forensics
```

## WP 记录要求

使用这些工具做取证题时，WP 至少记录：

```text
证据来源路径
原始文件哈希
使用工具与版本
关键命令或 GUI 操作
关键截图
SQL/代码/命令输出原文
时间戳原值和转换结果
结论与答案
```

路径不能替代证据。重要值必须以表格、代码块、截图或摘录形式放进 WP。

## 维护规则

新增或升级 Forensic 工具后，同步更新：

```text
C:\Users\glj07\AppData\Roaming\Codex_Assistant\Usable_Tools_List.txt
C:\Users\glj07\AppData\Roaming\Codex_Assistant\WSL_CTF工具清单.txt
C:\Users\glj07\.codex\skills\ctf-memory-playbook\references\local-tool-index.md
D:\TheBlogs\source\_posts\Forensic_电子取证\Forensic解题妙具\本机Forensic工具索引.md
```

如果某个工具同时用于 CTF 和 Forensic，例如 Wireshark、hashcat、Volatility、JADX，也要同步检查 CTF 工具索引是否需要更新。
