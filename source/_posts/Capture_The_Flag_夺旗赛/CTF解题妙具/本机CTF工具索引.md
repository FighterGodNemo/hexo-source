---
title: 本机CTF工具索引
date: 2026-09-19
categories:
  - Capture_The_Flag_夺旗赛
tags:
  - CTF
  - 工具索引
  - 速查手册
created: 2026-09-19T01:01
updated: 2026-09-19T08:35
---

> 本页由 ctf-toolbook skill 自动生成于 2026-09-19。可交互版（搜索/按分类筛选/考点互跳/一键复制命令）请打开本机手册：`D:/CaptureTheFlag/CTFTool/工具速查手册.html`。
> 手册支持 URL 深链（如 `工具速查手册.html#cat-crypto&q=RSA`），可直接引用；有新工具时对任意 AI 说「收录新工具 XXX」即可自动重建本页。

## 环境速览

| 环境 | 位置 | 说明 |
| --- | --- | --- |
| WSL Ubuntu-CTF | `wsl -d Ubuntu-CTF` | CTF 主力环境 Ubuntu 24.04 (noble)，python3.12 + pwntools 4.15 + GEF/pwndbg 双调试器；apt/pip/gem 均已配清华源 |
| WSL Ubuntu-22.04 | `wsl -d Ubuntu-22.04` | 备用发行版，已配 pip 清华源与 wordlists 软链，工具不全，比赛优先用 Ubuntu-CTF |
| Windows Python 3.10 | `C:/Users/glj07/AppData/Local/Programs/Python/Python310/python.exe` | pwntools/pycryptodome/z3/gmpy2/sympy/binwalk/scapy 已装，pip 已配清华源 |
| 爆破字典库 | `D:/CaptureTheFlag/CTFTool/Cryptodictionary` | 46 项：rockyou、SecLists、中文字典、SSTI/JNDI/Webshell 专题、28GB超大字典.7z（按需解压）；Ubuntu-CTF 已软链 /usr/share/wordlists；比赛禁止联网重下 |
| 工具根目录 | `D:/CaptureTheFlag/CTFTool/` | Windows 侧 CTF 工具约 172 项；取证工具在 D:/Forensic/ForensicTool |
| CTF 工作区 | `C:/Users/glj07/Desktop/Codex工作区/Writeup/CTF` | 解题过程目录 Writeup/CTF/来源/分类/题目名；WSL 内资源包 /opt/security-tools（SecLists、PayloadsAllTheThings、theHarvester） |
| 网络与镜像 | `` | 默认无 VPN 国内直连；pip/apt/gem 已配清华源；GitHub 下载可试 mirror.ghproxy.com 前缀；比赛现场避免临时下载工具 |

## 工具清单（按分类）

### 🛰️ 侦察与资产收集

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **nmap** | 🐧 WSL | WSL: `/usr/bin/nmap` | 端口扫描与服务识别，Web/Pwn 开题第一件事 | `nmap -sV -A <target>` <br> `nmap -p- --min-rate 5000 <target>` |
| **masscan** | 🐧 WSL | WSL: `/usr/bin/masscan` | 超高速全端口扫描，nmap 全端口太慢时用 ⚠️需要 root | `masscan -p1-65535 --rate 10000 <target>` |
| **amass** | 🐧 WSL | WSL: `/usr/local/bin/amass` | 子域名深度枚举 | `amass enum -d <domain>` |
| **subfinder** | 🐧 WSL | WSL: `/usr/local/bin/subfinder` | 被动子域名发现，快 | `subfinder -d <domain>` |
| **httpx** | 🐧 WSL | WSL: `/usr/local/bin/httpx` | 批量 HTTP 存活探测与标题/状态码 | `cat hosts.txt \| httpx -title -tech-detect` |
| **nuclei** | 🐧 WSL | WSL: `/usr/local/bin/nuclei` | PoC 模板批量漏洞扫描 | `nuclei -u <url> -severity medium,high,critical` |
| **naabu** | 🐧 WSL | WSL: `/usr/local/bin/naabu` | Go 版快速端口扫描 | `naabu -host <target> -p -` |
| **katana** | 🐧 WSL | WSL: `/usr/local/bin/katana` | 网页爬取/链接发现 | `katana -u <url> -d 3` |
| **gau** | 🐧 WSL | WSL: `/usr/local/bin/gau` | 聚合历史 URL（Wayback/Common Crawl） | `gau <domain>` |
| **waybackurls** | 🐧 WSL | WSL: `/usr/local/bin/waybackurls` | Wayback Machine 历史 URL | `waybackurls <domain>` |
| **dnsx** | 🐧 WSL | WSL: `/usr/local/bin/dnsx` | DNS 解析/枚举探测 | `dnsx -d <domain> -a -mx` |
| **whatweb** | 🐧 WSL | WSL: `/usr/bin/whatweb` | Web 指纹识别（框架/CMS/语言） | `whatweb <url>` |
| **theHarvester** | 🐧 WSL | WSL: `/opt/security-tools/theHarvester` | 邮箱/主机名 OSINT 收集 | `theHarvester -d <domain> -b bing` |

### 🌐 Web 渗透

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **sqlmap** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/SQL注入工具包/SQL注入/sqlmap-master/sqlmap.py` <br> WSL: `/usr/local/bin/sqlmap` | 自动化 SQL 注入 | `sqlmap -u "<url>?id=1" --batch --dbs` <br> `sqlmap -r req.txt --batch --dump` |
| **nikto** | 🐧 WSL | WSL: `/usr/bin/nikto` | Web 服务器漏洞扫描器 | `nikto -h <url>` |
| **gobuster** | 🐧 WSL | WSL: `/usr/bin/gobuster` | 目录/子域名/虚拟主机爆破 | `gobuster dir -u <url> -w /usr/share/wordlists/Seclists/Discovery/Web-Content/common.txt` |
| **ffuf** | 🐧 WSL | WSL: `/usr/local/bin/ffuf` | 快速 Web fuzzer（目录/参数/Header） | `ffuf -u <url>/FUZZ -w /usr/share/wordlists/Seclists/Discovery/Web-Content/raft-medium-words.txt -mc all -fc 404` |
| **wfuzz** | 🐧 WSL | WSL: `/usr/local/bin/wfuzz` | Web 模糊测试（参数/字典替换） | `wfuzz -c -z file,<wordlist> <url>/FUZZ` |
| **dirsearch** | 🐧 WSL | WSL: `/usr/bin/dirsearch` | Python 目录扫描器 | `dirsearch -u <url>` |
| **Burp Suite** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/BurpSuite V2025.9.4/` | HTTP 抓包改包/Intruder 爆破，Web 题核心 GUI | `启动后浏览器代理 127.0.0.1:8080` <br> `Intruder 爆破时字典用 D:/CaptureTheFlag/CTFTool/Cryptodictionary` |
| **HackBar** | ❌ 未装 | — | Chrome 扩展，快速发 POST/编码请求 ⚠️2026-09-19 目录审计未找到，已移除；需要时重装 Chrome 扩展 | `浏览器加载 HackBar-chrome 目录` |
| **中国蚁剑 AntSword** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/AntSword-Loader-v4` | WebShell 管理器（一句话连接） | `上传一句话后添加数据，连接密码=POST参数名` |
| **冰蝎 Behinder** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Behinder` | 加密流量 WebShell 管理 | `配合 webshell.jsp/php 使用` |
| **GitHack** | 🪟 Win | Win: `C:/Users/glj07/bin/githack.cmd` | .git 目录泄露还原源码 | `githack.cmd <url>/.git/` |
| **git-dumper** | 🪟 Win | Win: `C:/Users/glj07/AppData/Roaming/Python/Python310/Scripts/git-dumper.exe` | .git 泄露还原（GitHack 失败时用，支持 index 缺失） | `git-dumper <url>/.git/ outdir` |
| **Xray** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Xray_1` | 自动化 Web 漏洞扫描器 | `xray webscan --url <url> --html-out out.html` |

### 🔐 密码学

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **openssl** | 🐧 WSL | WSL: `/usr/bin/openssl` | 证书/RSA/对称加密万能 CLI | `openssl rsa -in key.pem -text -noout` <br> `openssl rsautl -decrypt -inkey key.pem -in flag.enc` |
| **pycryptodome** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `pip3` | Python 密码学库（AES/DES/RSA 全套） | `from Crypto.Cipher import AES; from Crypto.Util.number import long_to_bytes` |
| **gmpy2** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `pip3` | 大数运算库，RSA 开方/求解必备 | `gmpy2.iroot(c, 3)` <br> `gmpy2.invert(e, phi)` |
| **sympy** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `pip3` | 符号计算（解方程/离散对数/逆元） | `sympy.discrete_log(p, h, g)` <br> `sympy.solve(...)` |
| **z3-solver** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `pip3` | 约束求解器，逆向/密码学约束题神器 | `x=Int('x'); s=Solver(); s.add(x*3==21); print(s.check(), s.model())` |
| **CyberChef** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/CyberChef/CyberChef_v9.28.0.html` | 编码/加密/压缩瑞士军刀，离线打开即用 | `浏览器打开 html；汉化版 SRK_Toolbox 也在 CTFTool` |
| **CaptfEncoder** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/CaptfEncoder-win-x64-3.1.2.exe` | CTF 编码转换集合工具 | `图形界面，适合快速试遍各种编码` |
| **轩禹CTF_RSA工具** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/轩禹CTF_RSA工具3.6` | 图形化 RSA 各类攻击一键尝试 | `填 n/e/c 或 p/q 自动算` |
| **RsaCtfTool** | ❌ 未装 | — | RSA 攻击全自动集合（本机未装，GitHub 克隆 RsaCtfTool/RsaCtfTool 后 python3 运行） ⚠️未安装；需要时 git clone https://mirror.ghproxy.com/https://github.com/RsaCtfTool/RsaCtfTool | `python3 RsaCtfTool.py --publickey key.pub --uncipherfile flag.enc --attack all` |
| **fastcoll** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/fastcoll_v1.0.0.5.exe.zip` | MD5 快速碰撞生成（前缀相同后缀碰撞） ⚠️压缩包，用时先解压 | `fastcoll -p prefix.txt -o a.txt b.txt` |
| **hashid** | 🐧 WSL | WSL: `/usr/bin/hashid` | 识别哈希/密文类型 | `hashid 'e10adc3949ba...'` |
| **hashcat** | ✅ 双端 | Win: `D:/Forensic/ForensicTool/Decrypt/hashcat-7.1.2/` <br> WSL: `/usr/bin/hashcat` | GPU 口令破解；本机 RTX 5090 走 Windows 版才有 GPU 加速 ⚠️GPU 爆破用 Windows 版；WSL 版无 GPU 直通 | `hashcat -m 0 -a 0 hash.txt D:/CaptureTheFlag/CTFTool/Cryptodictionary/rockyou` <br> `hashcat -m 1000 nt.txt -a 3 ?u?d?d?d?d?d?d` |
| **john** | 🐧 WSL | WSL: `/usr/sbin/john` | 经典口令破解（zip/ssh2john 转换链好用） | `zip2john flag.zip > hash; john hash --wordlist=/usr/share/wordlists/rockyou` |
| **SageMath** | ❌ 未装 | — | 数论全功能（格/椭圆曲线/多项式环），本机未装（体积 2GB+） ⚠️未安装；格密码题建议在线 sagecell 或 Docker 镜像 sagemath/sagemath | `在线用 sagecell.sagemath.org；轻量场景用 sympy/gmpy2 替代` |

### 💥 二进制利用 Pwn

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **pwntools** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `/usr/local/bin/pwn (pip3)` | Pwn 全能框架：连接/payload/shellcode/ELF 解析 | `from pwn import *; p=remote('ip',port)` <br> `cyclic(200) / cyclic_find(0x61616162)` <br> `asm(shellcraft.sh())` |
| **GEF (gdb 插件)** | 🐧 WSL | WSL: `~/.gdbinit-gef.py` | gdb 增强：堆/栈/上下文可视化 | `gdb ./pwn 后: pattern create / heap bins / vmmap / got` |
| **pwndbg** | 🐧 WSL | WSL: `~/.pwndbg` | gdb 增强备选（与 GEF 二选一，改 ~/.gdbinit 切换） | `gdb ./pwn 后: cyclic / heap / search -s flag` |
| **gdb-multiarch** | 🐧 WSL | WSL: `/usr/bin/gdb-multiarch` | 跨架构调试（配合 qemu-user 调 ARM/MIPS 题） | `gdb-multiarch ./elf 后: set architecture arm; target remote :1234` |
| **ROPgadget** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `/usr/local/bin/ROPgadget` | 搜索 ROP gadget | `ROPgadget --binary ./pwn \| grep 'pop rdi'` |
| **ropper** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `/usr/local/bin/ropper` | ROP gadget 搜索备选（支持更多架构） | `ropper --file ./pwn --search 'pop rdi'` |
| **one_gadget** | 🐧 WSL | WSL: `/usr/local/bin/one_gadget` | libc 中一键 execve('/bin/sh') 的 magic gadget | `one_gadget ./libc.so.6` |
| **seccomp-tools** | 🐧 WSL | WSL: `/usr/local/bin/seccomp-tools` | dump 沙箱规则，看哪些 syscall 被禁 | `seccomp-tools dump ./pwn` |
| **checksec** | ✅ 双端 | Win: `pip scripts` <br> WSL: `/usr/local/bin/checksec` | 查看 ELF 保护（NX/PIE/Canary/RELRO） | `checksec --file=./pwn` |
| **libcdb** | 🐧 WSL | WSL: `/usr/local/bin/libcdb` | pwntools 自带 libc 数据库查询，泄漏 libc 版本 | `libcdb search printf 6?0 3?0` <br> `libcdb download libc6 2.35-0ubuntu3.4 amd64` |
| **patchelf** | 🐧 WSL | WSL: `/usr/bin/patchelf` | 改 ELF 解释器/rpath，本地挂指定 libc | `patchelf --set-interpreter ./ld-2.35.so --set-rpath . ./pwn` |
| **qemu-user** | 🐧 WSL | WSL: `/usr/bin/qemu-x86_64 等` | 用户态模拟跑跨架构二进制（ARM/MIPS pwn） | `qemu-arm -L /usr/arm-linux-gnueabihf ./elf` <br> `qemu-arm -g 1234 ./elf 后 gdb-multiarch 远程连` |
| **strace/ltrace** | 🐧 WSL | WSL: `/usr/bin/strace` | 系统调用/库函数动态追踪，看程序行为 | `strace ./pwn` <br> `ltrace ./pwn` |
| **socat** | 🐧 WSL | WSL: `/usr/bin/socat` | 把本地 binary 起成网络服务模拟远程 | `socat TCP-LISTEN:9999,reuseaddr,fork EXEC:./pwn,stderr` |
| **nc** | 🐧 WSL | WSL: `/usr/bin/nc` | 连接远程靶机/手测服务 | `nc <ip> <port>` |
| **musl-gcc** | 🐧 WSL | WSL: `/usr/bin/musl-gcc` | 编译 musl libc 环境的题目配套程序 | `musl-gcc main.c -o pwn` |
| **gcc/g++** | 🐧 WSL | WSL: `/usr/bin/gcc` | 编译利用代码与本地复现 | `gcc exp.c -o exp` <br> `gcc vuln.c -o vuln -fno-stack-protector -no-pie -z execstack` |
| **PWN 模板 ~/CTF** | ❌ 未装 | WSL: `~/CTF/PWN/tools/pwn_template.py` | 预置 PWN/Web/Crypto 分类工作区与 toolkit 脚本 ⚠️2026-09-19 审计 ~/CTF 目录疑似已不存在，如缺失按 WSL_CTF工具清单.txt 结构重建 | `cd ~/CTF/PWN && cp tools/pwn_template.py exp.py` |

### 🔍 逆向工程

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **IDA Pro 8.3** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/IDA Pro 8.3` | 最强静态反汇编/反编译，主逆向工具 | `F5 反编译；MCP 插件按 Ctrl+Alt+M 启动后 AI 可远程操作` <br> `Shift+F12 看字符串` |
| **Ghidra 11.2** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/ghidra_11.2_PUBLIC_20240926.zip` | NSA 免费反编译器，IDA 备选，支持多架构 | `解压后 analysisHeadless 或 GUI` |
| **JEB 5.0** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/JEB_5_0_0_202308071454搭配400M+的7Z使用` | Android/原生混合逆向利器 | `GUI 加载 apk；解压密码注意配套 7z 说明` |
| **dnSpy** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/dnSpy-net-win64` | .NET 程序反编译/动态调试 | `打开 exe/dll 直接看 C# 源码，可改 IL` |
| **jadx-gui-ai** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Others/jadx-gui-ai-master/` | Android 反编译 GUI + AI MCP 插件（8650 端口） | `先启动 GUI 再让 AI 通过 MCP 查询` |
| **jd-gui** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/jd-gui.exe` | Java class/jar 反编译 | `拖入 jar 看 java 源码` |
| **radare2/rabin2** | 🐧 WSL | WSL: `/usr/bin/r2` | 命令行逆向框架；rabin2 快速看 ELF 信息 | `r2 -A ./elf 后: afl/izz/pdf @main` <br> `rabin2 -I ./elf` |
| **upx** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/UPX/upx-5.0.2-win64/upx.exe` <br> WSL: `/usr/bin/upx-ucl` | UPX 加壳/脱壳 | `upx -d file -o unpacked` |
| **DiE 查壳** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/DiE查壳工具` | Detect It Easy 识别壳/编译器/打包器 | `GUI 拖入文件` |
| **pyinstxtractor** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/pyinstxtractor-2023.12` | PyInstaller 打包的 exe 还原出 pyc | `python pyinstxtractor.py target.exe 后用 pycdc/uncompyle 反编译主文件` |
| **x64dbg** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/x64dbg.lnk` | Windows 用户态调试器（破解题/动态分析） | `F2 下断，F8 步过，F7 步入` |
| **WinDbg** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/WinDbg.lnk` | Windows 内核/高级调试 | `内核题/驱动题使用` |
| **OllyICE** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/OllyICE_1.10` | 经典 OllyDbg 中文修改版，32 位破解题 | `F2 断点 + 字符串搜索` |
| **010 Editor** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/010Editor` | 十六进制编辑 + 文件模板解析（改宽高/修文件头神器） | `用模板解析 PNG/ZIP 结构直接改字节` |
| **WinHex / X-Ways** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Xways Winhex 19.8 Professional License` | 专业十六进制/磁盘编辑，NTFS 流与恢复 | `打开磁盘/文件做底层数据恢复` |
| **wabt** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/wabt-1.0.35-windows.tar.gz` | WebAssembly 工具集（wasm2wat/wat2wasm） ⚠️压缩包，用时先解压 | `wasm2wat main.wasm -o main.wat` |

### 🕵️ 取证与流量

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **binwalk** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `/usr/bin/binwalk` | 固件/文件内嵌数据扫描与提取 | `binwalk -Me file` |
| **foremost** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/CTF-NetA-V2.11.15/plugins/foremostlrb/foremost.exe` <br> WSL: `/usr/bin/foremost` | 按文件头 carving 恢复文件 | `foremost -i img.png -o out/` |
| **exiftool** | 🐧 WSL | WSL: `/usr/bin/exiftool` | 读/写文件元数据（EXIF 隐藏信息） | `exiftool img.jpg` |
| **volatility3** | ✅ 双端 | Win: `D:/Forensic/ForensicTool/Decrypt/volatility3-develop/volatility3-develop/vol.py` <br> WSL: `/usr/local/bin/vol` | 内存取证标准工具 | `vol -f mem.raw windows.info` <br> `vol -f mem.raw windows.filescan \| grep flag` <br> `vol -f mem.raw windows.pslist` |
| **Wireshark** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Wireshark/Wireshark.exe` | 流量分析 GUI（协议层级/流追踪） | `右键 Follow TCP Stream；导出对象 File>Export Objects>HTTP` |
| **tshark** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/Wireshark/tshark.exe` <br> WSL: `/usr/bin/tshark` | Wireshark 命令行版，脚本化流量提取 | `tshark -r a.pcapng --export-objects http,outdir` <br> `tshark -r a.pcapng -Y 'http.request' -T fields -e http.request.uri` |
| **tcpdump** | 🐧 WSL | WSL: `/usr/bin/tcpdump` | 命令行抓包 | `tcpdump -i eth0 -w out.pcap` |
| **CTF-NetA** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/CTF-NetA-V2.11.15` | CTF 流量题一键分析工具（含 USB 键鼠流量） | `拖入 pcap 自动出报告` |
| **USBPcap** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/USBPcap` | Windows USB 抓包驱动 | `配合 Wireshark 抓 USB 键盘流量` |
| **bulk_extractor** | ❌ 未装 | — | 批量提取文件中的邮箱/URL/密钥等特征 ⚠️Ubuntu 24.04 源无此包，暂缺；类似需求用 strings + grep 代替 | `bulk_extractor -o outdir image.raw` |
| **untrunc** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/untrunc_x64` | 损坏 MP4 视频修复 | `untrunc 参考完整.mp4 损坏.mp4` |
| **lads** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/lads.exe` | NTFS ADS 交换数据流检测 | `lads /s D:\` |
| **LastActivityView** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/LastActivityView.exe` | Windows 主机活动痕迹一键查看 | `运行即出报告` |
| **sqlcipher** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/sqlcipher-3.0.1` | 加密 SQLite 数据库读取 | `PRAGMA key='pass'; 后正常查询` |

### 🖼️ 隐写与杂项

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **Stegsolve** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/Stegsolve` <br> WSL: `/usr/local/bin/stegsolve.jar` | 图片像素级分析：LSB 通道/分离/叠加 | `java -jar stegsolve.jar → Analyse>Data Extract 逐通道试` <br> `Data Extract: Bit Order LSB First` |
| **steghide** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/steghide` <br> WSL: `/usr/bin/steghide` | jpg/bmp/wav 密码隐写（DCT 频域） | `steghide info img.jpg` <br> `steghide extract -sf img.jpg -p <pass> -xf flag.txt` <br> `无密码试空密码` |
| **zsteg** | 🐧 WSL | WSL: `/usr/local/bin/zsteg` | PNG/BMP LSB 全自动检测（ruby gem） | `zsteg flag.png 逐条看 b1,rgb,lsb,xy 等` |
| **outguess** | 🐧 WSL | WSL: `/usr/bin/outguess` | jpg 统计隐写（steghide 失败后试） | `outguess -r img.jpg out.txt` <br> `有 key: outguess -k key -r img.jpg out.txt` |
| **stegseek** | ❌ 未装 | — | steghide 密码爆破（跑 rockyou 秒级） ⚠️2026-09-19 ghproxy 下载失败未装成；可换 gh-proxy.com 前缀重试或暂用 steghide+hashcat | `stegseek img.jpg /usr/share/wordlists/rockyou` |
| **SNOW** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/SNOW` | 文本尾随空格/Tab 隐写 | `SNOW -C -p pass flag.txt` |
| **F5-steganography** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/F5-steganography-master.zip` | F5 JPG 隐写提取 ⚠️压缩包，用时先解压 | `java Extract img.jpg -p pass` |
| **MP3Stego** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/MP3Stego_1_1_19` | MP3 音频隐写 | `MP3StegoDecrypt -P pass file.mp3 out.txt` |
| **SilentEye** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/silenteye-0.4.1-win32.exe` | 图形化图片/音频隐写 | `GUI 打开 decode` |
| **BlindWaterMark** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/BlindWaterMark` | 频域盲水印提取（需要原图思路） | `python bwm.py decode watermark.png beWatermarked.png out.png` |
| **零宽字符隐写** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/零宽隐写src` | 零宽字符 U+200B 等隐藏信息解码 | `把文本贴入解码页/脚本` |
| **QR_Research** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/QR_Research` | 二维码识别/修复（残缺二维码定位） | `导入图片识别；配合 PS 手补定位角` |
| **Npiet** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Npiet.zip` | Piet 图形语言解释器 | `npiet hello.png` |
| **tweakpng** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/tweakpng-1.4.6` | PNG chunk 编辑器（改 IDAT/删 CRC 报错块/宽高） | `打开 png 右键编辑 chunk；CRC 错误提示即线索` |
| **图片异或/图像恢复** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/图片异或` | 像素异或/畸形图像修复脚本集（Deformed-Image-Restorer-main 在同级目录） | `按 README 跑脚本` |
| **随波逐流** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/随波逐流原创软件` | 国产 CTF 杂项大集合（编码/图片/音频/二维码全家桶） | `GUI 各功能区逐个试` |
| **Audacity** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Audacity` | 音频波形/频谱查看（摩斯/频谱隐写/倒放） | `切换频谱图看莫斯/文字图案；效果>反转倒放` |
| **bftools** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/bftools` | Brainfuck 编解码 | `bfdecode brainfuck.txt` |
| **qpdf** | 🐧 WSL | WSL: `/usr/bin/qpdf` | PDF 解密/结构修复 | `qpdf --decrypt in.pdf out.pdf` <br> `qpdf --show-object=trailer in.pdf` |
| **mutool** | 🐧 WSL | WSL: `/usr/bin/mutool` | MuPDF 工具：提取/转换 PDF 内容 | `mutool draw -F txt in.pdf > out.txt` <br> `mutool clean -d in.pdf` |
| **fcrackzip** | 🐧 WSL | WSL: `/usr/bin/fcrackzip` | zip 密码爆破（轻量快速） | `fcrackzip -b -c aA1! -l 1-8 -u flag.zip` <br> `字典: fcrackzip -D -p rockyou -u flag.zip` |
| **ARPR 压缩包破解** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Advanced Archive Password Recovery 带激活码` | 图形化 zip/rar 密码恢复（带 GPU） | `选字典/掩码爆破` |
| **bkcrack** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/bkcrack-1.7.1-win64` | zip 明文攻击（已知部分明文恢复全密码） | `bkcrack -C flag.zip -c known.txt -p known_plain.txt` |
| **ZipCenOp** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/ZipCenOp.jar` | zip 伪加密一键修复 | `java -jar ZipCenOp.jar r flag.zip` |
| **PasswareKit Forensic** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/PasswareKitForensic_2022汉化破解版` | 全类型文件口令恢复套件 | `选文件类型→字典/GPU` |
| **PDF批量解密** | ❌ 未装 | — | PDF 口令移除 ⚠️2026-09-19 目录审计未找到，已移除；用 WSL 的 qpdf --decrypt 替代 | `拖入 PDF` |

### 📚 字典与资源包

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **字典库 Cryptodictionary** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/Cryptodictionary` <br> WSL: `/usr/share/wordlists (软链)` | 46 项统一字典库：rockyou、SecLists、中文用户名/密码、SSTI/JNDI/Webshell 专题、28GB 超大字典 7z | `hashcat/john/ffuf 直接传具体文件路径` <br> `28GB 7z 按需解压勿常驻` |
| **/opt/security-tools** | 🐧 WSL | WSL: `/opt/security-tools` | SecLists 完整版 + PayloadsAllTheThings（SSTI/反序列化等 Payload 库）+ theHarvester + sqlmap 源码 | `find /opt/security-tools/SecLists -name '*.txt' 挑字典` <br> `查 Payload 直接 grep` |
| **后台常用密码** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/后台常用密码.txt` | 小而精的中文后台弱口令字典 | `后台登录爆破首选小字典` |

### 🧰 桌面辅助

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **7-Zip / Bandizip / WinRAR** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/7-Zip/7z.exe` <br> WSL: `/usr/bin/7z` | 压缩包处理（伪加密排查/多格式解压） | `7z l -slt flag.zip 看详细头信息` <br> `7z x file.7z` |
| **cmder** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/cmder` | Windows 便携终端（内置 ImageStrike 等工具） | `cmder.exe` |
| **VMware** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/VMware` | 虚拟机（跑靶机/内核题环境） | `加载比赛提供 OVA/VMX` |
| **frp** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/frp_0.39.0_windows_amd64.zip` | 内网穿透（线上赛端口转发） | `按赛方 frpc.toml 启动` |
| **Proxifier** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Proxifier_setup_v3.31.exe` | 强制进程走代理 | `配 Burp/Clash 上游` |
| **QtScrcpy / platform-tools** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/QtScrcpy-win-x64-v1.4.5` | 安卓投屏与 adb（Android 题配套） | `adb devices → scrcpy 投屏` |
| **Docker** | 🪟 Win | Win: `docker CLI 29.2.1 (docker-desktop 发行版)` | 起靶场/漏洞环境镜像 | `docker run -d -p 80:80 vulhub/xxx` <br> `docker-desktop 平时停止状态，用时启动` |
| **Notepad++** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Notepad++` | 文本编辑（大文件/HEX 插件） | `HEX-Editor 插件看二进制` |

## 考点速查：遇到什么题用什么工具

| 分类 | 考点 | 首选 | 关键命令/思路 | 备选 |
| --- | --- | --- | --- | --- |
| Crypto | **Base16/32/58/64/85 及变体编码** | CyberChef | `拖入密文自动试 Magic 咖啡壶配方；或 CaptfEncoder` | 随波逐流 |
| Crypto | **凯撒/栅栏/维吉尼亚/培根/摩斯** | CyberChef + 随波逐流 | `CyberChef ROT/Brute Force；摩斯用摩斯密码表.png 对照或 CyberChef Morse` | CaptfEncoder |
| Crypto | **RSA 小指数 e（e=3 且明文小）** | python3 + gmpy2 | `gmpy2.iroot(c, 3) 直接开三次方；不行则模 n 开方+CRT` | RsaCtfTool --attack small_e |
| Crypto | **RSA 共模攻击（同 n 不同 e）** | python3 手写 | `g=(e1*x+e2*y) 用扩展欧里得求 x,y；m=(c1^x*c2^y)%n` | 轩禹CTF_RSA工具 |
| Crypto | **RSA n 可分解（小素数/费马/已知库）** | factordb 在线查询 | `n 粘到 factordb.com；无果再 yafu/sympy.factorint` | RsaCtfTool --attack factordb |
| Crypto | **RSA dp/dq 泄露** | python3 标准公式 | `m = pow(c, dp, n) 变体；参照 dp 泄露模板脚本` | RsaCtfTool --attack dp_leak |
| Crypto | **RSA 格攻击（Boneh-Durfee/低加密指数广播 Hastad）** | SageMath (在线 sagecell) | `sagecell.sagemath.org 在线跑格脚本` | 多组同 e 用 CRT 直接合 |
| Crypto | **MD5 碰撞（要求两串相同 md5）** | fastcoll | `fastcoll -p prefix -o a.txt b.txt 生成同前缀碰撞对` | 在线 fastcoll 服务 |
| Crypto | **哈希长度扩展攻击** | hash_extender 思路手写 | `python 实现 md5 padding 追加；或装 hash_extender` | 脚本库 PayloadsAllTheThings |
| Crypto | **AES ECB/CBC（密钥在题目/ padding oracle）** | pycryptodome | `from Crypto.Cipher import AES; AES.new(key, AES.MODE_ECB).decrypt(ct)` | pycryptodome CBC+unpad |
| Crypto | **异或加密（ repeating-key XOR）** | python3 手写 | `已知前缀推 key；未知用 xortool 思路/频率分析` | CyberChef XOR Brute |
| Crypto | **哈希类型识别后爆破** | hashid 识别 → hashcat (Windows 版吃 5090) | `hashcat -m <mode> -a 0 hash.txt D:/CaptureTheFlag/CTFTool/Cryptodictionary/rockyou` | john（WSL） |
| Pwn | **ret2text（程序自带后门函数）** | pwntools + ROPgadget | `checksec 看保护 → objdump/IDA 找 backdoor 地址 → p64(addr)+偏移` | cyclic 定位偏移 |
| Pwn | **ret2libc（无后门，有 libc）** | libcdb + one_gadget | `泄漏 puts@got → libcdb search 定版本 → patchelf 挂 libc → ROP system('/bin/sh')` | one_gadget 直接跳 |
| Pwn | **格式化字符串漏洞** | pwntools fmtstr | `%6$p 泄漏栈；fmtstr_payload(6, {addr: value}) 任意写` | 手动 %n 构造 |
| Pwn | **栈溢出偏移定位** | cyclic | `cyclic(200) 填充 → 报错地址 cyclic_find() 算偏移` | GEF pattern |
| Pwn | **堆题（tcache/fastbin/unlink）** | GEF 堆可视化 | `gdb 里 heap bins / chunks 看布局；按版本(2.27/2.31/2.35)选攻击手法` | pwndbg heap 命令 |
| Pwn | **seccomp 沙箱题（禁 execve）** | seccomp-tools | `seccomp-tools dump ./pwn 看白名单 → ORW shellcode (open/read/write)` | pwntools shellcraft.orw |
| Pwn | **跨架构 ARM/MIPS pwn** | qemu-user + gdb-multiarch | `qemu-arm -g 1234 -L /usr/arm-linux-gnueabihf ./elf；gdb-multiarch target remote :1234` | 静态分析为主 |
| Pwn | **本地指定 libc 复现** | patchelf | `patchelf --set-interpreter ./ld-2.35.so --set-rpath . ./pwn` | LD_PRELOAD / docker |
| Reverse | **ELF 静态分析入门** | IDA Pro 8.3 (F5) | `看 main→关键函数；Shift+F12 字符串定位` | Ghidra / r2 izz |
| Reverse | **UPX 壳** | upx -d | `upx -d packed.exe -o unpacked.exe 后再静态分析` | DiE 确认壳类型 |
| Reverse | **Python 打包 exe (PyInstaller)** | pyinstxtractor | `python pyinstxtractor.py exe → 主 pyc 用 pycdc/uncompyle 还原` | pycdc 直接反编译 |
| Reverse | **.NET 程序** | dnSpy | `直接打开看 C# 源码，可断点可改 IL` | ILSpy |
| Reverse | **Android APK** | jadx-gui-ai | `GUI 打开 apk 搜字符串/关键 API；NATIVE 层再上 IDA` | JEB 5.0 |
| Reverse | **Java jar/class** | jd-gui | `拖入 jar；混淆则先 deobfuscator` | jadx |
| Reverse | **wasm 逆向** | wabt | `wasm2wat main.wasm -o main.wat 阅读 wat` | 浏览器 devtools 调试 |
| Reverse | **Windows 动态调试/破解题** | x64dbg | `字符串搜索→关键跳 nop/改寄存器` | OllyICE (32位) |
| Web | **目录/后台扫描** | gobuster 或 ffuf | `ffuf -u url/FUZZ -w /usr/share/wordlists/Seclists/Discovery/Web-Content/common.txt -mc all -fc 404` | dirsearch / DirBuster |
| Web | **SQL 注入** | sqlmap | `sqlmap -u "url?id=1" --batch --dbs；POST 用 -r req.txt` | 手注 union/报错/盲注 |
| Web | **SSTI 模板注入** | PayloadsAllTheThings 模板 | `{{7*7}} 试探 → 对应引擎 payload；paylaod 库在 /opt/security-tools/PayloadsAllTheThings` | tplmap 思路 |
| Web | **文件上传拿 WebShell** | 中国蚁剑/冰蝎 | `上传一句话（绕过检测）→ 蚁剑连接` | 哥斯拉思路 |
| Web | **PHP/Java 反序列化** | 手写 POP 链 + PayloadsAllTheThings | `phpggc 思路生成 payload` | ysoserial (Java) |
| Web | **git 源码泄露** | GitHack | `githack.cmd url/.git/；失败用 git-dumper` | 手动 curl refs |
| Web | **JWT 伪造** | python3 pyjwt 手改 | `none 算法/弱密钥字典爆破/算法混淆` | jwt_tool (未装可 pip) |
| Web | **弱口令爆破后台** | hydra + 后台常用密码.txt | `hydra -L users -P D:/.../后台常用密码.txt target http-post-form` | Burp Intruder |
| Forensics | **图片宽高/文件头损坏** | 010 Editor + tweakpng | `010 模板改 IHDR 宽高；tweakpng 提示 CRC 错即宽高错` | python 手算 CRC 爆破宽高 |
| Forensics | **PNG/BMP LSB 隐写** | zsteg → Stegsolve | `zsteg flag.png 自动出；手动用 Stegsolve Data Extract 逐通道` | python PIL 手写 |
| Forensics | **JPG 密码隐写** | stegseek 爆破 → steghide | `stegseek img.jpg /usr/share/wordlists/rockyou；有密码 steghide extract -sf` | outguess -r |
| Forensics | **盲水印** | BlindWaterMark | `python bwm.py decode 原图 密文图 out（频域需原图）` | 频域脚本/图片异或工具 |
| Forensics | **音频：摩斯/频谱/倒放** | Audacity | `频谱模式看图案；波形看摩斯长短；倒放/变速` | MP3Stego (MP3) |
| Forensics | **流量：HTTP 对象提取** | tshark / Wireshark | `tshark -r a.pcapng --export-objects http,outdir` | Wireshark Export Objects |
| Forensics | **流量：USB 键盘/鼠标** | CTF-NetA | `拖入 pcap 自动解析；或手写 HID 数据位映射脚本` | python 脚本 |
| Forensics | **内存镜像取证** | volatility3 | `vol -f mem.raw windows.info → filescan → dumpfiles` | PasswareKit 找密钥 |
| Forensics | **zip 伪加密/明文攻击/爆破** | ZipCenOp (伪加密) / bkcrack (明文) / fcrackzip (爆破) | `7z l -slt 看 flags；bkcrack -C f.zip -c k.txt -p plain.txt；fcrackzip -D -p rockyou -u f.zip` | ARPR (GUI) |
| Forensics | **PDF 加密/隐藏文本** | qpdf + mutool | `qpdf --decrypt in.pdf out.pdf；mutool draw -F txt in.pdf` | PDF批量解密 |
| Forensics | **NTFS 交换数据流 (ADS)** | lads / WinHex | `lads /s 目录 找隐藏流；notepad file.txt:stream 查看` | PowerShell Get-Item -Stream |
| Forensics | **残缺二维码** | QR_Research | `定位角补全后识别；PS 手补` | zbar 思路脚本 |
| Misc | **零宽字符/雪花文本** | 零宽隐写src | `文本贴入解码器` | 在线 zwsp 工具 |
| Misc | **Brainfuck/Ook/Piet 编程语言** | bftools / Npiet | `bfdecode file；npiet img.png` | 在线解释器 |
| Misc | ** OSINT 图片/域名情报** | subfinder/amass + theHarvester | `theHarvester -d domain -b bing；看 exiftool 定位信息` | 在线 OSINT 平台 |

## 更新记录

- 2026-09-19 手册升级：命令一键复制、考点↔工具双向互跳、URL 深链（#cat-x&q=y）、多词 AND 搜索+高亮、收藏置顶、打印导出、内嵌 JSON 数据。
- 2026-09-19 首次生成：工具 125 项，考点映射 51 条；WSL 已补装 gdb-multiarch/strace/ltrace/patchelf/qemu-user/upx/tshark/tcpdump/steghide/outguess/fcrackzip/zip/qpdf/mutool/socat/ncat/hashid/masscan/musl-tools + seccomp-tools + z3 + one_gadget。
