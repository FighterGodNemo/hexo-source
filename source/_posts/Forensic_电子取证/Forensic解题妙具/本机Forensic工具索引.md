---
title: 本机Forensic工具索引
date: 2026-09-26
categories:
  - Forensic_电子取证
tags:
  - Forensic
  - 工具索引
created: 2026-09-21T21:09
updated: 2026-09-26T10:52
---

> 本页由 ctf-toolbook 自动生成。交互版手册的「🧪 Forensic 取证中心」独立于 CTF 比赛和日常练习中心。
> Forensic 根目录：`D:/Forensic/ForensicTool`；取证原则：原始证据只读、先哈希、输出写工作副本。

## Forensic 工具清单

| 工具 | 位置 | 用途 | 常用调用 |
| --- | --- | --- | --- |
| **binwalk** | Win: `pip (Python310)` <br> WSL: `/usr/bin/binwalk` | 固件/文件内嵌数据扫描与提取 | `binwalk -Me file` |
| **foremost** | Win: `D:/CaptureTheFlag/CTFTool/CTF-NetA-V2.11.15/plugins/foremostlrb/foremost.exe` <br> WSL: `/usr/bin/foremost` | 按文件头 carving 恢复文件 | `foremost -i img.png -o out/` |
| **exiftool** | WSL: `/usr/bin/exiftool` | 读/写文件元数据（EXIF 隐藏信息） | `exiftool img.jpg` |
| **volatility3** | Win: `D:/Forensic/ForensicTool/Decrypt/volatility3-develop/volatility3-develop/vol.py` <br> WSL: `/usr/local/bin/vol` | 内存取证标准工具 | `vol -f mem.raw windows.info` <br> `vol -f mem.raw windows.filescan \| grep flag` <br> `vol -f mem.raw windows.pslist` |
| **Wireshark** | Win: `D:/CaptureTheFlag/CTFTool/Wireshark/Wireshark.exe` | 流量分析 GUI（协议层级/流追踪） | `右键 Follow TCP Stream；导出对象 File>Export Objects>HTTP` |
| **tshark** | Win: `D:/CaptureTheFlag/CTFTool/Wireshark/tshark.exe` <br> WSL: `/usr/bin/tshark` | Wireshark 命令行版，脚本化流量提取 | `tshark -r a.pcapng --export-objects http,outdir` <br> `tshark -r a.pcapng -Y 'http.request' -T fields -e http.request.uri` |
| **tcpdump** | WSL: `/usr/bin/tcpdump` | 命令行抓包 | `tcpdump -i eth0 -w out.pcap` |
| **CTF-NetA** | Win: `D:/CaptureTheFlag/CTFTool/CTF-NetA-V2.11.15` | CTF 流量题一键分析工具（含 USB 键鼠流量） | `拖入 pcap 自动出报告` |
| **USBPcap** | Win: `D:/CaptureTheFlag/CTFTool/USBPcap` | Windows USB 抓包驱动 | `配合 Wireshark 抓 USB 键盘流量` |
| **bulk_extractor** | WSL: `/opt/security-tools/bulk_extractor/bin/bulk_extractor` | 批量提取文件中的邮箱/URL/密钥等特征；官方 v2.2.0 源码编译版 | `bulk_extractor -o outdir image.raw` <br> `bulk_extractor -o outdir evidence_dir/` |
| **untrunc** | Win: `D:/CaptureTheFlag/CTFTool/untrunc_x64` | 损坏 MP4 视频修复 | `untrunc 参考完整.mp4 损坏.mp4` |
| **lads** | Win: `D:/CaptureTheFlag/CTFTool/lads.exe` | NTFS ADS 交换数据流检测 | `lads /s D:\` |
| **LastActivityView** | Win: `D:/CaptureTheFlag/CTFTool/LastActivityView.exe` | Windows 主机活动痕迹一键查看 | `运行即出报告` |
| **sqlcipher** | Win: `D:/CaptureTheFlag/CTFTool/sqlcipher-3.0.1` | 加密 SQLite 数据库读取 | `PRAGMA key='pass'; 后正常查询` |
| **TrueCrypt** | Win: `D:/CaptureTheFlag/CTFTool/TrueCrypt Setup 7.1a.exe` | 老牌加密容器（挂载 tc 卷取证） | `Select File 选 .tc 输密码挂载` |
| **WeFlow** | Win: `C:/Users/glj07/Desktop/Codex工作区/工具/WeFlow` | 微信 4.0+ 聊天记录本地查看/导出/朋友圈解密，含本地 HTTP API | `运行 exe 自动读取本地微信数据；导出记录写进取证报告` |
| **SQLite Expert** | Win: `D:/Forensic/ForensicTool/Database/SQLite Expert Professional-专门用于查看、编辑和分析SQLite数据库文件（常见于手机App）` | SQLite 图形化浏览（Chrome历史/聊天库/取证库直接开） | `打开 .db/.sqlite 看表；损坏库试 Recover` |
| **R-Studio** | Win: `D:/CaptureTheFlag/CTFTool/R-Studio` | 专业数据恢复（删除文件/RAID/签名扫描） | `打开磁盘/镜像 -> Scan -> 按签名恢复` |
| **DiskGenius** | Win: `D:/CaptureTheFlag/CTFTool/diskgenius吾爱专业破解版 v5` | 磁盘分区/恢复/镜像挂载 | `打开磁盘恢复文件；镜像可挂载浏览` |
| **Python-dsstore** | Win: `D:/CaptureTheFlag/CTFTool/Python-dsstore` | .DS_Store 文件解析（苹果目录泄露文件名） | `python main.py <.DS_Store> 列出隐藏文件名` |
| **VBCABLE** | Win: `D:/CaptureTheFlag/CTFTool/VBCABLE_Driver_Pack43` | 虚拟声卡驱动（把音频环路录给 SSTV 等解码器） | `装驱动后播放设备设为 CABLE Input 再录制` |
| **YARA** | WSL: `/usr/bin/yara` | 恶意样本/取证特征规则匹配 | `yara -w rules.yar sample.bin` <br> `yara -r rules.yar evidence_dir/` |
| **sqlite3 CLI** | WSL: `/usr/bin/sqlite3` | SQLite 数据库命令行检查、导出与损坏库初筛 | `sqlite3 evidence.db ".tables"` <br> `sqlite3 evidence.db "select * from sqlite_master;"` |
| **X-Ways Forensics** | Win: `D:/Forensic/ForensicTool/Mirror/X-Ways Forensics` | 专业磁盘/镜像取证平台：分区、文件系统、时间线、书签与报告 | `打` <br> `开` <br> `案` <br> `件` <br> `→` <br> `添` <br> `加` <br> `镜` <br> `像` <br> `→` <br> `只` <br> `读` <br> `分` <br> `析` <br> `→` <br> `书` <br> `签` <br> `/` <br> `导` <br> `出` <br> `报` <br> `告` |
| **Autopsy** | Win: `D:/Forensic/ForensicTool/Mirror/Autopsy` | 开源数字取证平台，适合镜像、文件系统、关键字和时间线综合分析 | `新` <br> `建` <br> ` ` <br> `C` <br> `a` <br> `s` <br> `e` <br> `→` <br> `A` <br> `d` <br> `d` <br> ` ` <br> `D` <br> `a` <br> `t` <br> `a` <br> ` ` <br> `S` <br> `o` <br> `u` <br> `r` <br> `c` <br> `e` <br> `→` <br> `I` <br> `n` <br> `g` <br> `e` <br> `s` <br> `t` <br> ` ` <br> `M` <br> `o` <br> `d` <br> `u` <br> `l` <br> `e` <br> `s` <br> `→` <br> `查` <br> `看` <br> `结` <br> `果` |
| **Arsenal Image Mounter** | Win: `D:/Forensic/ForensicTool/Mirror/Arsenal Image Mounter Professional-将磁盘镜像文件（如.E01, .dd）挂载为Windows虚拟磁盘，便于只读访问` | 将 E01/DD 只读挂载为 Windows 磁盘，供取证工具访问 | `选` <br> `择` <br> ` ` <br> `I` <br> `m` <br> `a` <br> `g` <br> `e` <br> `→` <br> `R` <br> `e` <br> `a` <br> `d` <br> `-` <br> `o` <br> `n` <br> `l` <br> `y` <br> ` ` <br> `M` <br> `o` <br> `u` <br> `n` <br> `t` <br> `→` <br> `记` <br> `录` <br> `盘` <br> `符` <br> `与` <br> `哈` <br> `希` |
| **Mount Image Pro** | Win: `D:/Forensic/ForensicTool/Mirror/Mount Image Pro-镜像文件挂载工具` | 多格式磁盘镜像挂载 | `选` <br> `择` <br> `镜` <br> `像` <br> `→` <br> `只` <br> `读` <br> `挂` <br> `载` <br> `→` <br> `在` <br> ` ` <br> `X` <br> `-` <br> `W` <br> `a` <br> `y` <br> `s` <br> `/` <br> `A` <br> `u` <br> `t` <br> `o` <br> `p` <br> `s` <br> `y` <br> ` ` <br> `中` <br> `分` <br> `析` |
| **Virtual Forensic Computing** | Win: `D:/Forensic/ForensicTool/HelperKit/Virtual Forensic Computing-证据仿真工具，可直接启动嫌疑人的磁盘镜像` | 在隔离虚拟机中启动镜像观察系统行为 | `复` <br> `制` <br> `证` <br> `据` <br> `镜` <br> `像` <br> `→` <br> `隔` <br> `离` <br> `启` <br> `动` <br> `→` <br> `记` <br> `录` <br> `行` <br> `为` <br> `与` <br> `截` <br> `图` |
| **UFS Explorer** | Win: `D:/Forensic/ForensicTool/Mirror/UFS Explorer Professional Recovery-数据恢复和镜像挂载工具，支持复杂RAID重组` | 复杂文件系统、RAID 和镜像恢复 | `打` <br> `开` <br> `镜` <br> `像` <br> `→` <br> `S` <br> `c` <br> `a` <br> `n` <br> `/` <br> `R` <br> `A` <br> `I` <br> `D` <br> ` ` <br> `重` <br> `组` <br> `→` <br> `恢` <br> `复` <br> `到` <br> `另` <br> `一` <br> `块` <br> `盘` |
| **R-Studio/RDS** | Win: `D:/Forensic/ForensicTool/Decrypt/RDS_2024-likely 是 R-Studio 网络版，强大的数据恢复工具，也用于破解简单密码` | 删除文件、分区、RAID 与镜像数据恢复 | `选` <br> `择` <br> `源` <br> `盘` <br> `/` <br> `镜` <br> `像` <br> `→` <br> `S` <br> `c` <br> `a` <br> `n` <br> `→` <br> `预` <br> `览` <br> `→` <br> `恢` <br> `复` <br> `到` <br> `独` <br> `立` <br> `输` <br> `出` <br> `盘` |
| **FinalData/Fatbeans** | Win: `D:/Forensic/ForensicTool/FileDataRecovery/Fatbeans-likely 是 FinalData，经典的数据恢复软件` | 文件删除恢复和签名扫描 | `选` <br> `择` <br> `镜` <br> `像` <br> `→` <br> `扫` <br> `描` <br> `已` <br> `删` <br> `除` <br> `文` <br> `件` <br> `→` <br> `导` <br> `出` <br> `到` <br> `工` <br> `作` <br> `副` <br> `本` |
| **PuzzleSolver** | Win: `D:/Forensic/ForensicTool/FileDataRecovery/PuzzleSolver-main` | 特定文件/密码恢复辅助工具集合 | `先` <br> `阅` <br> `读` <br> ` ` <br> `R` <br> `E` <br> `A` <br> `D` <br> `M` <br> `E` <br> `，` <br> `再` <br> `对` <br> `副` <br> `本` <br> `执` <br> `行` <br> `恢` <br> `复` |
| **Volatility 3** | Win: `D:/Forensic/ForensicTool/Decrypt/volatility3-develop/volatility3-develop/vol.py` | 内存镜像进程、网络、文件、注册表和凭据分析 | `v` <br> `o` <br> `l` <br> ` ` <br> `-` <br> `f` <br> ` ` <br> `m` <br> `e` <br> `m` <br> `.` <br> `r` <br> `a` <br> `w` <br> ` ` <br> `w` <br> `i` <br> `n` <br> `d` <br> `o` <br> `w` <br> `s` <br> `.` <br> `i` <br> `n` <br> `f` <br> `o` <br> `;` <br> ` ` <br> `v` <br> `o` <br> `l` <br> ` ` <br> `-` <br> `f` <br> ` ` <br> `m` <br> `e` <br> `m` <br> `.` <br> `r` <br> `a` <br> `w` <br> ` ` <br> `w` <br> `i` <br> `n` <br> `d` <br> `o` <br> `w` <br> `s` <br> `.` <br> `p` <br> `s` <br> `l` <br> `i` <br> `s` <br> `t` <br> `;` <br> ` ` <br> `v` <br> `o` <br> `l` <br> ` ` <br> `-` <br> `f` <br> ` ` <br> `m` <br> `e` <br> `m` <br> `.` <br> `r` <br> `a` <br> `w` <br> ` ` <br> `w` <br> `i` <br> `n` <br> `d` <br> `o` <br> `w` <br> `s` <br> `.` <br> `f` <br> `i` <br> `l` <br> `e` <br> `s` <br> `c` <br> `a` <br> `n` |
| **strings / file / sha256sum** | WSL: `/usr/bin/strings` | 样本初筛：文件类型、字符串和证据哈希 | `f` <br> `i` <br> `l` <br> `e` <br> ` ` <br> `s` <br> `a` <br> `m` <br> `p` <br> `l` <br> `e` <br> `;` <br> ` ` <br> `s` <br> `h` <br> `a` <br> `2` <br> `5` <br> `6` <br> `s` <br> `u` <br> `m` <br> ` ` <br> `s` <br> `a` <br> `m` <br> `p` <br> `l` <br> `e` <br> `;` <br> ` ` <br> `s` <br> `t` <br> `r` <br> `i` <br> `n` <br> `g` <br> `s` <br> ` ` <br> `-` <br> `a` <br> ` ` <br> `s` <br> `a` <br> `m` <br> `p` <br> `l` <br> `e` <br> ` ` <br> `\|` <br> ` ` <br> `l` <br> `e` <br> `s` <br> `s` |
| **Fiddler Everywhere** | Win: `D:/Forensic/ForensicTool/Web/fiddler-everywhere-Web调试代理工具，捕获和分析HTTPHTTPS流量` | HTTP/HTTPS 调试代理与请求重放 | `启` <br> `动` <br> `代` <br> `理` <br> `→` <br> `导` <br> `入` <br> `会` <br> `话` <br> `→` <br> `保` <br> `存` <br> ` ` <br> `H` <br> `A` <br> `R` <br> `/` <br> `请` <br> `求` <br> `证` <br> `据` |
| **DB Browser for SQLite** | Win: `D:/Forensic/ForensicTool/Database/DB/DB Browser for SQLite.exe` | SQLite 数据库初筛、表浏览和 CSV 导出 | `打` <br> `开` <br> `副` <br> `本` <br> `→` <br> `B` <br> `r` <br> `o` <br> `w` <br> `s` <br> `e` <br> ` ` <br> `D` <br> `a` <br> `t` <br> `a` <br> `→` <br> `导` <br> `出` <br> `关` <br> `键` <br> `表` |
| **DB Browser for SQLCipher** | Win: `D:/Forensic/ForensicTool/Database/DB/DB Browser for SQLCipher.exe` | 加密 SQLite/SQLCipher 数据库查看 | `打` <br> `开` <br> `数` <br> `据` <br> `库` <br> `→` <br> `输` <br> `入` <br> ` ` <br> `k` <br> `e` <br> `y` <br> `→` <br> `导` <br> `出` <br> `查` <br> `询` <br> `结` <br> `果` |
| **SQLCipher** | Win: `D:/CaptureTheFlag/CTFTool/sqlcipher-3.0.1` | 加密 SQLite 命令行读取 | `s` <br> `q` <br> `l` <br> `c` <br> `i` <br> `p` <br> `h` <br> `e` <br> `r` <br> ` ` <br> `d` <br> `b` <br> `.` <br> `s` <br> `q` <br> `l` <br> `i` <br> `t` <br> `e` <br> `;` <br> ` ` <br> `P` <br> `R` <br> `A` <br> `G` <br> `M` <br> `A` <br> ` ` <br> `k` <br> `e` <br> `y` <br> `=` <br> `"` <br> `p` <br> `a` <br> `s` <br> `s` <br> `"` <br> `;` <br> ` ` <br> `.` <br> `t` <br> `a` <br> `b` <br> `l` <br> `e` <br> `s` <br> `;` |
| **HexHub** | Win: `D:/Forensic/ForensicTool/Database/HexHub` | 数据库/十六进制相关本地分析工具 | `打` <br> `开` <br> `副` <br> `本` <br> `→` <br> `按` <br> `项` <br> `目` <br> `功` <br> `能` <br> `查` <br> `看` <br> `结` <br> `构` <br> `与` <br> `字` <br> `段` |
| **NTFS Log Tracker** | Win: `D:/Forensic/ForensicTool/Database/NTFS Log Tracker-分析NTFS文件系统的日志（$LogFile），追踪文件操作历史` | NTFS $LogFile 操作记录和文件活动分析 | `导` <br> `入` <br> ` ` <br> `$` <br> `L` <br> `o` <br> `g` <br> `F` <br> `i` <br> `l` <br> `e` <br> `→` <br> `按` <br> `时` <br> `间` <br> `/` <br> `路` <br> `径` <br> `筛` <br> `选` <br> `→` <br> `导` <br> `出` <br> `报` <br> `告` |
| **Magnet AXIOM** | Win: `D:/Forensic/ForensicTool/Mobile/magnetaxiom.all.to.9.9.0.46675` | 综合电脑/手机/云取证分析平台，自动解析应用与时间线 | `创` <br> `建` <br> ` ` <br> `C` <br> `a` <br> `s` <br> `e` <br> `→` <br> `添` <br> `加` <br> `镜` <br> `像` <br> `/` <br> `备` <br> `份` <br> `→` <br> `P` <br> `r` <br> `o` <br> `c` <br> `e` <br> `s` <br> `s` <br> `→` <br> `A` <br> `n` <br> `a` <br> `l` <br> `y` <br> `z` <br> `e` <br> `→` <br> `导` <br> `出` <br> `报` <br> `告` |
| **UFED** | Win: `D:/Forensic/ForensicTool/Mobile/UFED-全球顶尖的手机物理取证工具` | 手机物理提取与移动设备取证平台 | `按` <br> `设` <br> `备` <br> `型` <br> `号` <br> `选` <br> `择` <br> ` ` <br> `e` <br> `x` <br> `t` <br> `r` <br> `a` <br> `c` <br> `t` <br> `i` <br> `o` <br> `n` <br> ` ` <br> `p` <br> `r` <br> `o` <br> `f` <br> `i` <br> `l` <br> `e` <br> `→` <br> `保` <br> `存` <br> `原` <br> `始` <br> `提` <br> `取` <br> `物` <br> `→` <br> `在` <br> `分` <br> `析` <br> `工` <br> `具` <br> `中` <br> `解` <br> `析` |
| **iBackup Viewer** | Win: `D:/Forensic/ForensicTool/Mobile/iBackup Viewer Pro-专门用于解析和查看苹果iTunes备份文件的内容` | Apple iTunes 备份解析 | `打` <br> `开` <br> `备` <br> `份` <br> `→` <br> `查` <br> `看` <br> `消` <br> `息` <br> `/` <br> `照` <br> `片` <br> `/` <br> `联` <br> `系` <br> `人` <br> `→` <br> `导` <br> `出` <br> `证` <br> `据` |
| **plist Editor Pro** | Win: `D:/Forensic/ForensicTool/Mobile/plist Editor Pro` | Apple plist 配置与取证字段查看 | `打` <br> `开` <br> ` ` <br> `p` <br> `l` <br> `i` <br> `s` <br> `t` <br> ` ` <br> `副` <br> `本` <br> `→` <br> `查` <br> `看` <br> `键` <br> `值` <br> `/` <br> `时` <br> `间` <br> `字` <br> `段` |
| **AndroidKiller** | Win: `D:/Forensic/ForensicTool/Mobile/AndroidKiller-master` | Android APK 反编译与资源分析 | `导` <br> `入` <br> ` ` <br> `A` <br> `P` <br> `K` <br> `→` <br> `查` <br> `看` <br> ` ` <br> `M` <br> `a` <br> `n` <br> `i` <br> `f` <br> `e` <br> `s` <br> `t` <br> `/` <br> `代` <br> `码` <br> `/` <br> `资` <br> `源` <br> `→` <br> `导` <br> `出` <br> `证` <br> `据` |
| **PH-PhoneForensics** | Win: `D:/Forensic/ForensicTool/pinghang/PH-PhoneForensics` | 平航移动取证工具，手机数据提取/解析辅助 | `按` <br> `设` <br> `备` <br> `/` <br> `备` <br> `份` <br> `类` <br> `型` <br> `导` <br> `入` <br> `→` <br> `生` <br> `成` <br> `案` <br> `件` <br> `报` <br> `告` |
| **DCode** | Win: `D:/Forensic/ForensicTool/Others/DCode v5` | Windows 时间戳、FILETIME、Unix 时间转换 | `输` <br> `入` <br> `十` <br> `六` <br> `进` <br> `制` <br> `/` <br> `十` <br> `进` <br> `制` <br> `时` <br> `间` <br> `戳` <br> `→` <br> `核` <br> `对` <br> ` ` <br> `U` <br> `T` <br> `C` <br> `/` <br> `本` <br> `地` <br> `时` <br> `间` |
| **Autopsy/时间线模块** | Win: `D:/Forensic/ForensicTool/Mirror/Autopsy` | 从文件系统和日志构建统一时间线 | `I` <br> `n` <br> `g` <br> `e` <br> `s` <br> `t` <br> ` ` <br> `后` <br> `打` <br> `开` <br> ` ` <br> `T` <br> `i` <br> `m` <br> `e` <br> `l` <br> `i` <br> `n` <br> `e` <br> `→` <br> `按` <br> `来` <br> `源` <br> `/` <br> `时` <br> `间` <br> `/` <br> `关` <br> `键` <br> `字` <br> `筛` <br> `选` |
| **Lads ADS** | Win: `D:/CaptureTheFlag/CTFTool/lads.exe` | NTFS Alternate Data Streams 检测 | `l` <br> `a` <br> `d` <br> `s` <br> ` ` <br> `/` <br> `s` <br> ` ` <br> `D` <br> `:` <br> `\` <br> `；` <br> `P` <br> `o` <br> `w` <br> `e` <br> `r` <br> `S` <br> `h` <br> `e` <br> `l` <br> `l` <br> ` ` <br> `G` <br> `e` <br> `t` <br> `-` <br> `I` <br> `t` <br> `e` <br> `m` <br> ` ` <br> `-` <br> `S` <br> `t` <br> `r` <br> `e` <br> `a` <br> `m` <br> ` ` <br> `*` |
| **regipy** | WSL: `pip install regipy` | Python 注册表解析库 | `p` <br> `y` <br> `t` <br> `h` <br> `o` <br> `n` <br> `3` <br> ` ` <br> `-` <br> `c` <br> ` ` <br> `"` <br> `f` <br> `r` <br> `o` <br> `m` <br> ` ` <br> `r` <br> `e` <br> `g` <br> `i` <br> `p` <br> `y` <br> `.` <br> `r` <br> `e` <br> `g` <br> `i` <br> `s` <br> `t` <br> `r` <br> `y` <br> ` ` <br> `i` <br> `m` <br> `p` <br> `o` <br> `r` <br> `t` <br> ` ` <br> `R` <br> `e` <br> `g` <br> `i` <br> `s` <br> `t` <br> `r` <br> `y` <br> `"` |
| **python-evtx** | WSL: `pip install python-evtx` | Windows EVTX 事件日志解析库 | `p` <br> `i` <br> `p` <br> ` ` <br> `i` <br> `n` <br> `s` <br> `t` <br> `a` <br> `l` <br> `l` <br> ` ` <br> `p` <br> `y` <br> `t` <br> `h` <br> `o` <br> `n` <br> `-` <br> `e` <br> `v` <br> `t` <br> `x` <br> `;` <br> ` ` <br> `p` <br> `y` <br> `t` <br> `h` <br> `o` <br> `n` <br> ` ` <br> `p` <br> `a` <br> `r` <br> `s` <br> `e` <br> `_` <br> `e` <br> `v` <br> `t` <br> `x` <br> `.` <br> `p` <br> `y` <br> ` ` <br> `S` <br> `e` <br> `c` <br> `u` <br> `r` <br> `i` <br> `t` <br> `y` <br> `.` <br> `e` <br> `v` <br> `t` <br> `x` |
| **Passware Kit Forensic** | Win: `D:/Forensic/ForensicTool/Decrypt/Passware Kit Forensic 2022（汉化版）` | 文件、容器和凭据密码恢复套件 | `选` <br> `择` <br> `案` <br> `件` <br> `文` <br> `件` <br> `→` <br> `选` <br> `择` <br> `攻` <br> `击` <br> `方` <br> `式` <br> `→` <br> `恢` <br> `复` <br> `到` <br> `工` <br> `作` <br> `副` <br> `本` |
| **Elcomsoft Forensic Disk Decryptor** | Win: `D:/Forensic/ForensicTool/Decrypt/Elcomsoft.Forensic.Disk.Decryptor` | 加密磁盘/容器取证辅助 | `导` <br> `入` <br> `密` <br> `钥` <br> `材` <br> `料` <br> `/` <br> `镜` <br> `像` <br> `→` <br> `只` <br> `读` <br> `解` <br> `密` <br> `分` <br> `析` |
| **Ciphey** | Win: `D:/Forensic/ForensicTool/Decrypt/Ciphey` | 自动识别与解码常见编码/密码文本 | `c` <br> `i` <br> `p` <br> `h` <br> `e` <br> `y` <br> ` ` <br> `-` <br> `t` <br> ` ` <br> `"` <br> `密` <br> `文` <br> `"` |
| **FileLocator Pro** | Win: `D:/Forensic/ForensicTool/Database/FileLocator Pro-强大的文件内容搜索工具，可快速在全盘搜索关键词` | 案件目录内全文/正则/文件名搜索 | `限` <br> `定` <br> `证` <br> `据` <br> `目` <br> `录` <br> `→` <br> `搜` <br> `索` <br> `关` <br> `键` <br> `字` <br> `→` <br> `导` <br> `出` <br> `命` <br> `中` <br> `路` <br> `径` |
| **UEFITool** | Win: `D:/Forensic/ForensicTool/Others/UEFITool_NE_A72_win64` | UEFI 固件结构查看与模块提取 | `打` <br> `开` <br> ` ` <br> `R` <br> `O` <br> `M` <br> `→` <br> `树` <br> `状` <br> `查` <br> `看` <br> ` ` <br> `F` <br> `V` <br> `/` <br> `P` <br> `E` <br> `I` <br> `/` <br> `D` <br> `X` <br> `E` <br> `→` <br> `导` <br> `出` <br> `模` <br> `块` |
| **CFF Explorer** | Win: `D:/Forensic/ForensicTool/Reverse/CFF_Explorer-强大的PE文件（Windows可执行文件）编辑器` | PE 结构、节、导入导出表分析 | `打` <br> `开` <br> ` ` <br> `P` <br> `E` <br> `→` <br> `查` <br> `看` <br> ` ` <br> `H` <br> `e` <br> `a` <br> `d` <br> `e` <br> `r` <br> `s` <br> `/` <br> `S` <br> `e` <br> `c` <br> `t` <br> `i` <br> `o` <br> `n` <br> `s` <br> `/` <br> `I` <br> `m` <br> `p` <br> `o` <br> `r` <br> `t` <br> `s` |
| **JADX GUI AI (Forensic)** | Win: `D:/Forensic/ForensicTool/Others/jadx-gui-ai-master` | Android 应用取证/逆向查看，含 AI MCP 连接能力 | `启` <br> `动` <br> ` ` <br> `G` <br> `U` <br> `I` <br> `→` <br> `导` <br> `入` <br> ` ` <br> `A` <br> `P` <br> `K` <br> `→` <br> `搜` <br> `索` <br> `数` <br> `据` <br> `库` <br> `/` <br> `A` <br> `P` <br> `I` <br> `/` <br> `密` <br> `钥` |
| **MySQL MCP 只读工具集** | Win: `C:/Users/glj07/.mcp-toolbox/v1.12.0/run-mysql-toolbox.cmd` | Google MCP Toolbox v1.12.0 统一入口（非 Oracle/MySQL 官方）：只读列出数据库/表/列结构与 EXPLAIN，七端共用 launcher | `工具：mysql_list_databases / mysql_list_tables / mysql_table_columns / mysql_explain_select` <br> `launcher：cmd.exe /c C:/Users/glj07/.mcp-toolbox/v1.12.0/run-mysql-toolbox.cmd（已登记 ZCode/Codex/Claude/CodeBuddy/Trae/LM Studio）` <br> `凭据：只读账号 mcp_readonly，SELECT-only，密码仅在 .mcp-toolbox/v1.12.0/mysql.env` |

## Forensic 考点与流程

| 考点 | 首选 | 流程/命令 | 备选 |
| --- | --- | --- | --- |
| **图片宽高/文件头损坏** | 010 Editor + tweakpng | `010 模板改 IHDR 宽高；tweakpng 提示 CRC 错即宽高错` | python 手算 CRC 爆破宽高 |
| **PNG/BMP LSB 隐写** | zsteg → Stegsolve | `zsteg flag.png 自动出；手动用 Stegsolve Data Extract 逐通道` | python PIL 手写 |
| **JPG 密码隐写** | stegseek 爆破 → steghide | `stegseek img.jpg /usr/share/wordlists/rockyou；有密码 steghide extract -sf` | outguess -r |
| **盲水印** | BlindWaterMark | `python bwm.py decode 原图 密文图 out（频域需原图）` | 频域脚本/图片异或工具 |
| **音频：摩斯/频谱/倒放** | Audacity | `频谱模式看图案；波形看摩斯长短；倒放/变速` | MP3Stego (MP3) |
| **流量：HTTP 对象提取** | tshark / Wireshark | `tshark -r a.pcapng --export-objects http,outdir` | Wireshark Export Objects |
| **流量：USB 键盘/鼠标** | CTF-NetA | `拖入 pcap 自动解析；或手写 HID 数据位映射脚本` | python 脚本 |
| **内存镜像取证** | volatility3 | `vol -f mem.raw windows.info → filescan → dumpfiles` | PasswareKit 找密钥 |
| **zip 伪加密/明文攻击/爆破** | ZipCenOp (伪加密) / bkcrack (明文) / fcrackzip (爆破) | `7z l -slt 看 flags；bkcrack -C f.zip -c k.txt -p plain.txt；fcrackzip -D -p rockyou -u f.zip` | ARPR (GUI) |
| **PDF 加密/隐藏文本** | qpdf + mutool | `qpdf --decrypt in.pdf out.pdf；mutool draw -F txt in.pdf` | PDF批量解密 |
| **NTFS 交换数据流 (ADS)** | lads / WinHex | `lads /s 目录 找隐藏流；notepad file.txt:stream 查看` | PowerShell Get-Item -Stream |
| **残缺二维码** | QR_Research | `定位角补全后识别；PS 手补` | zbar 思路脚本 |
| **E01/RAW 磁盘镜像取证** | DiskGenius/R-Studio | `DiskGenius 增载镜像浏览分区；R-Studio 按签名恢复删除文件` | FTK Imager（未装） |
| **Windows 注册表取证** | regedit 导出 + python | `重点 NTUSER.dat/SYSTEM/SAM：Run 启动项、USBSTOR、MountPoints2、ShimCache` | regipy（WSL pip） |
| **evtx 事件日志分析** | WSL python-evtx | `pip install python-evtx 解析 Security.evtx 看 4624/4672 事件` | EventLogExplorer（未装） |
| **回收站 $I/$R 文件** | python 手写解析 | `$I 头：版本+64位 FILETIME+原路径；$R 是原内容` | R-Studio 图形化 |
| **浏览器历史/密码提取** | SQLite Expert + python | `History.db 查 urls/visits；Login Data 用 DPAPI 解密` | WeFlow（微信场景） |
| **微信/QQ 聊天记录取证** | WeFlow | `WeFlow 4.5.1 读本地微信 4.0+ 数据库导出 HTML/CSV` | SQLite Expert + 密钥解密 |
| **BitLocker/VeraCrypt/TC 加密卷** | PasswareKit | `选容器类型后字典/GPU 恢复口令；TC 卷用 TrueCrypt 7.1a 挂载` | hashcat 提取后爆破 |
| **WiFi 握手包破解** | WSL hashcat | `aircrack-ng 转 hc22000 后 hashcat -m 22000；GPU 用 Windows hashcat` | john --wordlist |
| **PDF 流对象/隐藏文字** | qpdf/mutool | `mutool show in.pdf objects；qpdf --qdf 拆流对象找 JS/隐藏内容` | pdftotext + 010 Editor |
| **Office 隐藏内容（docx/xlsx）** | 7z 解包 + grep | `docx 即 zip：unzip 后看 word/document.xml 的 vanish 隐藏文本` | 010 Editor 模板 |
| **文件特征规则匹配** | YARA | `yara -r rules.yar evidence_dir/` | strings + grep |
| **SQLite 数据库快速初筛** | sqlite3 CLI | `sqlite3 evidence.db ".tables"；再查 sqlite_master 和关键表` | SQLite Expert |
| **磁盘镜像案件标准流程** | X-Ways Forensics / Autopsy | `保留原件→计算 SHA256→只读挂载→Ingest→时间线/关键字→书签→导出报告` | Arsenal Image Mounter + SQLite Expert |
| **E01/RAW 镜像只读挂载** | Arsenal Image Mounter | `选择 E01/DD→Read-only Mount→记录盘符、镜像哈希和挂载时间` | Mount Image Pro / X-Ways |
| **Windows 主机时间线** | Autopsy Timeline + LastActivityView | `导入镜像→Run Ingest→Timeline 按时间/来源/用户筛选→交叉验证事件` | X-Ways / NTFS Log Tracker |
| **NTFS $LogFile/$UsnJrnl 活动分析** | NTFS Log Tracker + X-Ways | `导出 $LogFile/$UsnJrnl→按路径/时间筛选→关联文件系统时间戳` | Autopsy |
| **Windows 注册表 Run/USBSTOR/MountPoints2** | regipy + Registry Explorer（如有） | `提取 NTUSER.dat/SYSTEM/SAM→解析 Run、USBSTOR、MountPoints2、ShimCache→记录时间线` | regedit/Autopsy |
| **EVTX 安全日志 4624/4672/4688** | python-evtx + Windows Event Viewer | `解析 Security.evtx→筛 4624 登录、4672 特权、4688 进程创建→按时间核对` | Autopsy |
| **浏览器历史/下载/登录库** | SQLite Expert / DB Browser for SQLite | `复制 History/Login Data→查 urls、visits、downloads、logins→导出 CSV` | sqlite3 CLI |
| **SQLite/SQLCipher 应用数据库** | DB Browser for SQLite/SQLCipher | `对副本打开→.tables/Schema→按时间和关键字查询→导出结果` | SQLite Expert / sqlite3 CLI |
| **微信聊天记录与媒体** | WeFlow | `读取微信 4.0+ 数据→按联系人/时间/关键词筛选→导出 HTML/CSV 和媒体证据` | SQLite Expert |
| **手机备份/iOS plist/Android APK** | UFED / iBackup Viewer / PH-PhoneForensics | `保存原始备份→解析数据库/plist→Android APK 交给 JADX→生成案件报告` | AndroidKiller / JADX |
| **内存镜像进程/文件/网络** | Volatility 3 | `vol -f mem.raw windows.info→pslist/pstree→filescan→netscan→dumpfiles` | bulk_extractor |
| **内存镜像凭据/BitLocker 密钥** | Volatility 3 + Passware/Elcomsoft | `先识别 profile→提取进程/注册表/密钥材料→在工作副本解密分析` | strings + YARA |
| **PCAP HTTP/DNS/TLS 流量** | Wireshark/tshark | `Follow TCP/HTTP Stream→Export Objects→DNS 查询筛选→保存过滤器和截图` | CTF-NetA/tcpdump |
| **USB HID 键盘鼠标流量** | Wireshark + CTF-NetA | `过滤 usb.capdata→按 HID 报告解析→还原按键/鼠标→与时间线核对` | tshark + Python |
| **恶意样本初筛与规则匹配** | file/sha256sum/strings + YARA | `计算哈希→file→strings→yara -r rules.yar→隔离沙箱动态观察` | CFF Explorer / Volatility |
| **文件特征/邮箱/URL 批量提取** | bulk_extractor | `bulk_extractor -o outdir image.raw→查看 feature-files→回到原证据定位上下文` | strings/grep |
| **删除文件/分区/RAID 恢复** | R-Studio/UFS Explorer | `镜像副本→Scan→预览→恢复到不同磁盘→计算恢复文件哈希` | FinalData/R-Studio |
| **加密卷/BitLocker/TrueCrypt 密码恢复** | Passware/Elcomsoft/TrueCrypt | `确认容器类型→保留密钥材料→字典/GPU 恢复→只读挂载分析` | Windows hashcat |
| **时间戳转换与时间线核对** | DCode | `识别 FILETIME/Unix/浏览器时间格式→转换 UTC/本地→记录时区` | Python datetime |
| **UEFI/固件结构提取** | UEFITool + binwalk | `计算固件哈希→UEFITool 查看 FV/模块→导出→binwalk 辅助提取` | strings |
| **PE 样本结构/导入导出分析** | CFF Explorer + Detect It Easy | `确认 PE 架构/节/导入表→查壳和编译器→再交给 IDA/x64dbg` | IDA/DiE |

## 来源与范围

- `D:/Forensic/ForensicTool` 本机工具根目录
- `D:/TheBlogs/source/_posts/Forensic_电子取证/Forensic知识` 取证知识笔记
- `D:/TheBlogs/source/_posts/Forensic_电子取证/取证write-up` 历届取证题与案件复盘
- `C:/Users/glj07/AppData/Roaming/Codex_Assistant/WSL_CTF工具清单.txt` WSL 工具状态
