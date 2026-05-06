---
title: 本机CTF工具索引
date: 2026-05-05
permalink: /2026/05/05/Capture_The_Flag_夺旗赛/CTF解题妙具/本机CTF工具索引/
categories:
  - Capture_The_Flag_夺旗赛
  - CTF解题妙具
tags:
  - CTF
  - CTF工具
  - 工具索引
  - 本机环境
created: 2026-05-05T09:20
updated: 2026-05-06T13:53
---

# 本机 CTF 工具索引

这篇索引用来快速判断“遇到什么题先用什么工具”。详细工具清单仍以本机记忆库为准：

```text
C:\Users\glj07\AppData\Roaming\Codex_Assistant\Usable_Tools_List.txt
C:\Users\glj07\AppData\Roaming\Codex_Assistant\CTF_Tools_Complete_List.txt
C:\Users\glj07\AppData\Roaming\Codex_Assistant\WSL_CTF工具清单.txt
C:\Users\glj07\.codex\skills\ctf-memory-playbook\references\local-tool-index.md
```

安装新工具后要同步更新这篇文章、上面的本机工具清单和 `local-tool-index.md`，避免后续解题时重复安装或忘记已有工具。

## 快速选择

| 场景 | 优先工具 | 什么时候用 |
| --- | --- | --- |
| 编码、压缩、哈希、常见转换 | CyberChef、CaptfEncoder、HashCalc、Python | 题目像 Base、Hex、URL、Unicode、哈希、JWT、简单密码时先用 |
| RSA、ECC、大整数、脚本化密码题 | Python + PyCryptodome、gmpy2、sympy、Sage/WSL 数学环境 | 需要模逆、CRT、Coppersmith、格、分解、批量尝试时用 |
| Web 抓包、改包、认证绕过 | Burp Suite、HackBar、浏览器 DevTools、Python requests | 需要观察请求、改 Header/Cookie/POST、构造 payload 时用 |
| Web 扫描、目录爆破、SQL 注入 | sqlmap、dirsearch、ffuf、gobuster、御剑、nuclei | 已确认授权或 CTF 靶机，需要快速枚举入口和验证注入时用 |
| `.git` 泄露 | GitHack、git-dumper | `/.git/index` 可访问用 GitHack；`HEAD/refs/objects` 可访问但 `index` 404 用 git-dumper |
| 流量包 | Wireshark、TShark、Scapy | `.pcap/.pcapng`、HTTP 对象、TCP 流、DNS、TLS SNI、USB 流量分析 |
| 隐写和 Misc 文件 | binwalk、foremost、ExifTool、StegSolve、steghide、010 Editor、Audacity | 文件套娃、图片/音频隐写、文件头修复、LSB、附加数据、频谱分析 |
| 逆向 | IDA Pro、Ghidra、JEB、JADX、dnSpy、x64dbg、Detect It Easy、UPX | PE/ELF/APK/.NET/Java/Python 打包程序逆向 |
| Pwn | WSL pwntools、gdb、checksec、ROPgadget、ropper、one_gadget、IDA/Ghidra | Linux ELF、本地调试、远程交互、ROP、ret2libc、栈迁移 |
| 字典爆破 | hashcat、john、Hydra、Cryptodictionary | hash、压缩包、弱口令、Web 登录、SSH/FTP 等口令场景 |

## Windows 主工具

| 工具                  | 当前推荐路径                                                                   | 用法                                                          | 适合场景                                |
| ------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------- |
| 7-Zip 25.01         | `D:\CaptureTheFlag\CTFTool\7-Zip\7z.exe`                                 | `7z l file.zip`、`7z x file.zip -oout`                       | 压缩包查看、解压、嵌套包、伪加密前置检查                |
| CyberChef           | `D:\CaptureTheFlag\CTFTool\CyberChef\CyberChef_v9.28.0.html`             | 浏览器打开 HTML                                                  | 编码解码、异或、哈希、JWT、数据清洗                 |
| CaptfEncoder 3.1.2  | `D:\CaptureTheFlag\CTFTool\CaptfEncoder-win-x64-3.1.2.exe`               | 直接启动 GUI                                                    | 常见 CTF 编码、古典密码、批量转换                 |
| HashCalc            | `D:\CaptureTheFlag\CTFTool\HashCalc.exe`                                 | 直接启动 GUI                                                    | 快速核对 MD5、SHA1、CRC 等                 |
| 010 Editor          | `D:\CaptureTheFlag\CTFTool\010Editor\010Editor.exe`                      | `010Editor.exe file.bin`                                    | 十六进制查看、文件头修复、结构模板分析                 |
| Notepad++           | `D:\CaptureTheFlag\CTFTool\Notepad++\notepad++.exe`                      | `notepad++.exe file.txt`                                    | 多文件文本查看、日志和脚本轻编辑                    |
| bkcrack 1.7.1       | `D:\CaptureTheFlag\CTFTool\bkcrack-1.7.1-win64\bkcrack.exe`              | `bkcrack -C enc.zip -c known.txt -P known.zip -p known.txt` | ZipCrypto 明文攻击，不适合 AES ZIP          |
| Wireshark 4.6.2     | `D:\CaptureTheFlag\CTFTool\Wireshark\Wireshark.exe`                      | 直接打开 pcap                                                   | 图形化协议分析、追踪流、导出对象                    |
| TShark 4.6.2        | `D:\CaptureTheFlag\CTFTool\Wireshark\tshark.exe`                         | `tshark -r a.pcapng -Y http`                                | 批量过滤、导出字段、脚本化流量分析                   |
| Burp Suite 2025.9.4 | `D:\CaptureTheFlag\CTFTool\BurpSuite V2025.9.4\`                         | 运行目录内启动脚本                                                   | Web 抓包、重放、Intruder、Repeater         |
| SQLMap 1.9.12.3 dev | `D:\CaptureTheFlag\CTFTool\SQL注入工具包\SQL注入\sqlmap-master\sqlmap.py`       | `python sqlmap.py -u "URL" --batch`                         | SQL 注入验证、库表枚举、dump                  |
| dirsearch 0.4.3     | `D:\CaptureTheFlag\CTFTool\dirsearch-0.4.3\dirsearch.py`                 | `python dirsearch.py -u URL -e php,txt,bak`                 | Web 目录和敏感文件枚举                       |
| GitHack             | `C:\Users\glj07\bin\githack.cmd`                                         | `githack http://target/.git/`                               | `.git/index` 可访问时恢复源码               |
| git-dumper 1.0.9    | `C:\Users\glj07\AppData\Roaming\Python\Python310\Scripts\git-dumper.exe` | `git-dumper URL/.git/ outdir`                               | `index` 不可访问但 refs/objects 可访问时恢复源码 |
| 御剑目录扫描              | `D:\CaptureTheFlag\CTFTool\御剑WEB目录扫描优化版\御剑WEB目录扫描优化版.Patched.exe`        | GUI 输入目标                                                    | Windows GUI 扫后台、备份、敏感路径             |

## Crypto

| 工具 | 路径/命令 | 使用方法 | 适合场景 |
| --- | --- | --- | --- |
| PyCryptodome | `C:\Users\glj07\Desktop\ctftools-all-in-one\Crypto\` | 在脚本中 `from Crypto.Util.number import *` | RSA、AES、DES、字节与整数转换 |
| gmpy2 | `C:\Users\glj07\Desktop\ctftools-all-in-one\gmpy2\` | `import gmpy2` | 大整数、开方、模逆、快速数论计算 |
| sympy | WSL Python 包或本机环境 | `from sympy import factorint` | 小规模分解、方程、数学验证 |
| 轩禹 CTF RSA 工具 3.6 | `D:\CaptureTheFlag\CTFTool\轩禹CTF_RSA工具3.6` | GUI | 常见 RSA 参数组合的快速尝试 |
| fastcoll | `D:\CaptureTheFlag\CTFTool\fastcoll_v1.0.0.5.exe.zip` | 解压后命令行使用 | MD5 碰撞类题目 |
| Cryptodictionary | `D:\CaptureTheFlag\CTFTool\Cryptodictionary\` | 配合 hashcat/john/Burp | 弱口令、目录、用户名、设备默认密码爆破 |

优先策略：能用脚本复现的 Crypto 题，优先写 Python；GUI 工具只作为试探和交叉验证。

## Web

| 工具 | 路径/命令 | 使用方法 | 适合场景 |
| --- | --- | --- | --- |
| Burp Suite | `D:\CaptureTheFlag\CTFTool\BurpSuite V2025.9.4\` | Repeater 改包，Intruder 爆破 | 登录、Cookie、JWT、权限绕过、反序列化入口 |
| HackBar | `D:\CaptureTheFlag\CTFTool\HackBar-v2.3.1` / Chrome 扩展 | 浏览器插件 | 快速构造 GET/POST、URL 编码、SQL payload |
| sqlmap | `D:\CaptureTheFlag\CTFTool\SQL注入工具包\SQL注入\sqlmap-master\sqlmap.py` | `python sqlmap.py -r request.txt --batch` | 已有请求包时的注入验证 |
| ffuf | WSL `/usr/local/bin/ffuf` | `ffuf -u http://host/FUZZ -w wordlist` | 快速目录、参数、子域 fuzz |
| gobuster | WSL `/usr/bin/gobuster` | `gobuster dir -u URL -w wordlist` | 目录枚举 |
| nuclei | WSL `/usr/local/bin/nuclei` | `nuclei -u URL -t templates` | 模板化漏洞探测 |
| nmap | WSL `/usr/bin/nmap` 或 Windows 安装包 | `nmap -sV -A host` | 端口、服务、版本指纹 |
| GitHack/git-dumper | 见上表 | 从 `.git` 泄露恢复源码 | 源码泄露、历史 commit 线索、配置泄露 |
| AntSword/Behinder | `D:\CaptureTheFlag\CTFTool\AntSword-Loader-v4\`、`D:\CaptureTheFlag\CTFTool\Behinder\` | GUI | CTF 中已经拿到 Webshell 后连接验证 |

优先策略：先手工观察和 Burp 抓包，再决定是否上扫描器。CTF 靶机可快速枚举，真实环境只在授权范围内使用。

## Misc 与隐写

| 工具 | 路径/命令 | 使用方法 | 适合场景 |
| --- | --- | --- | --- |
| binwalk | WSL `/usr/bin/binwalk` | `binwalk -e file` | 固件、图片套娃、嵌入压缩包 |
| foremost | WSL `/usr/bin/foremost` 或 Windows foremost | `foremost -i file -o out` | 文件雕刻、拼接数据恢复 |
| ExifTool | WSL `/usr/bin/exiftool` | `exiftool file` | 图片、音频、视频、文档元数据 |
| StegSolve | `D:\CaptureTheFlag\CTFTool\Stegsolve\StegSolve.jar` | `java -jar StegSolve.jar` | 图片 bit plane、颜色通道、LSB 观察 |
| steghide | `D:\CaptureTheFlag\CTFTool\cmder\ImageStrike\tools\steghide\steghide.exe` | `steghide extract -sf image.jpg` | JPG/WAV 隐写，常伴随密码 |
| Audacity | `D:\CaptureTheFlag\CTFTool\Audacity\` | GUI 打开音频 | 频谱、波形、摩斯、音频隐藏信息 |
| MP3Stego | `D:\CaptureTheFlag\CTFTool\MP3Stego_1_1_19` | 命令行 | MP3 隐写 |
| tweakpng 1.4.6 | `D:\CaptureTheFlag\CTFTool\tweakpng-1.4.6\x64\tweakpng.exe` | GUI | PNG chunk 修复和查看 |
| QR_Research | `D:\CaptureTheFlag\CTFTool\QR_Research` | 脚本/资料 | 二维码定位点、损坏二维码修复 |

优先策略：先 `file`、`strings`、`exiftool`、`binwalk`，再按格式进入 StegSolve、Audacity、010 Editor。

## Reverse

| 工具 | 路径/命令 | 使用方法 | 适合场景 |
| --- | --- | --- | --- |
| IDA Pro 9.3 安装包 | `D:\CaptureTheFlag\CTFTool\idapro93\ida-pro_93_x64win.exe` | 安装后使用 IDA | 新项目优先考虑；当前目录是安装包 |
| IDA Pro 8.3 | `D:\CaptureTheFlag\CTFTool\IDA Pro 8.3\` | 启动 `ida64.exe`/快捷方式 | PE/ELF 静态分析、反编译 |
| Ghidra 11.2 | `D:\CaptureTheFlag\CTFTool\ghidra_11.2_PUBLIC_20240926.zip` | 解压后运行 `ghidraRun.bat` | 免费反编译、固件/ELF/复杂结构 |
| JEB 5.0 | `D:\CaptureTheFlag\CTFTool\JEB_5_0_0_202308071454搭配400M+的7Z使用\jeb_wincon.bat` | 运行 bat | Android、Dex、混淆代码 |
| JADX 1.5.3 | `D:\Forensic\ForensicTool\Reverse\jadx-gui-1\jadx-gui-1.5.3.exe` | GUI 打开 APK | APK Java/Kotlin 反编译 |
| dnSpy | `D:\CaptureTheFlag\CTFTool\dnSpy-net-win64\dnSpy.exe` | GUI 打开 .NET 程序 | .NET 反编译、调试、补丁 |
| ILDASM | `C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.8 Tools\ildasm.exe` | `ildasm /text app.exe > out.il` | .NET IL 文本输出 |
| x64dbg/x32dbg | `D:\CaptureTheFlag\CTFTool\snapshot\release\x64\x64dbg.exe` | GUI 调试 | Windows 动态调试、patch、反调试绕过 |
| Detect It Easy | `D:\CaptureTheFlag\CTFTool\DiE查壳工具` | GUI | 查壳、编译器、文件类型 |
| UPX 5.0 | `D:\CaptureTheFlag\CTFTool\upx5.0加壳脱壳工具` | `upx -d file.exe` | UPX 脱壳、壳识别后第一步 |
| pyinstxtractor | `D:\CaptureTheFlag\CTFTool\pyinstxtractor-2023.12` | `python pyinstxtractor.py app.exe` | PyInstaller 打包程序提取 |

优先策略：先 DiE/file/strings 判型，Windows GUI 程序用 IDA/x64dbg，APK 用 JADX/JEB，.NET 用 dnSpy/ILDASM。

## Pwn

| 工具 | 路径/命令 | 使用方法 | 适合场景 |
| --- | --- | --- | --- |
| WSL Ubuntu-CTF | `wsl -d Ubuntu-CTF -u glj07` | 进入后 `cd ~/CTF` | Linux ELF、pwntools、gdb、ROP |
| pwntools 4.15.0 | WSL Python 包 | `from pwn import *` | 远程交互、payload 生成、ELF 解析 |
| gdb 15.0.50 | WSL `/usr/bin/gdb` | `gdb ./pwn` | 本地调试 |
| checksec | WSL `/usr/local/bin/checksec` | `checksec --file=./pwn` | 保护检查 |
| ROPGadget 7.7 | WSL `/usr/local/bin/ROPgadget` | `ROPgadget --binary ./pwn` | ROP gadget 搜索 |
| ropper | WSL `/usr/local/bin/ropper` | `ropper --file ./pwn` | ROP 搜索 |
| objdump/readelf/strings | WSL 系统命令 | `readelf -a ./pwn` | ELF 基础信息 |
| netcat/nc | WSL `/usr/bin/nc` | `nc host port` | 远程服务连通性测试 |

优先策略：Pwn 默认进 WSL；过程脚本保存在题目目录，最终脚本保留可复现命令。

## WSL 工具速查

| 类别 | 命令 | 版本线索 |
| --- | --- | --- |
| 基础 | `python3`、`pip`、`gcc`、`gdb`、`make`、`git`、`curl`、`wget` | Python 3.12.3、GDB 15.0.50 |
| Web | `sqlmap`、`ffuf`、`gobuster`、`wfuzz`、`nikto`、`whatweb` | sqlmap 1.10.3.5 dev、ffuf 2.1.0-dev、gobuster 3.6 |
| 资产发现 | `nmap`、`amass`、`subfinder`、`httpx`、`nuclei`、`naabu`、`katana`、`gau`、`waybackurls`、`dnsx` | Nmap 7.94SVN |
| 密码爆破 | `john`、`hashcat`、`hydra` | john 6.2.6、hashcat 可用 |
| 逆向/Pwn | `file`、`strings`、`objdump`、`readelf`、`radare2`、`checksec`、`ROPgadget`、`ropper` | ROPgadget 7.7 |
| 取证/Misc | `binwalk`、`foremost`、`exiftool`、`vol`、`volshell`、`scapy` | Volatility 3 Framework 2.26.2、ExifTool 12.76 |

进入方式：

```powershell
wsl -d Ubuntu-CTF -u glj07
cd ~/CTF
```

## 维护规则

新增或升级 CTF 工具后，同步更新：

```text
C:\Users\glj07\AppData\Roaming\Codex_Assistant\Usable_Tools_List.txt
C:\Users\glj07\AppData\Roaming\Codex_Assistant\CTF_Tools_Complete_List.txt
C:\Users\glj07\AppData\Roaming\Codex_Assistant\WSL_CTF工具清单.txt
C:\Users\glj07\.codex\skills\ctf-memory-playbook\references\local-tool-index.md
D:\TheBlogs\source\_posts\Capture_The_Flag_夺旗赛\CTF解题妙具\本机CTF工具索引.md
```

写入时至少记录工具名、版本或目录版本、路径、调用方式、适用场景、Windows/WSL 位置和验证日期。
