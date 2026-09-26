---
title: 本机CTF工具索引
date: 2026-09-21
categories:
  - Capture_The_Flag_夺旗赛
tags:
  - CTF
  - 工具索引
  - 速查手册
---

> 本页由 ctf-toolbook skill 自动生成于 2026-09-21。可交互版（搜索/按分类筛选/考点互跳/一键复制命令）请打开本机手册：`D:/CaptureTheFlag/CTFTool/工具速查手册.html`。
> 手册支持 URL 深链（如 `工具速查手册.html#cat-crypto&q=RSA`），可直接引用；有新工具时对任意 AI 说「收录新工具 XXX」即可自动重建本页。

## 环境速览

| 环境 | 位置 | 说明 |
| --- | --- | --- |
| WSL Ubuntu-CTF | `wsl -d Ubuntu-CTF` | 默认 CTF 主力环境 Ubuntu 24.04 (noble)，直接运行 wsl 即进入；完整 CTF 工具链：pwntools/z3/pwndbg/GEF/pwninit/angr/RsaCtfTool/stegseek/bulk_extractor/YARA/sqlite3/SageMath 等 |
| WSL Ubuntu-22.04 | `wsl -d Ubuntu-22.04` | 备用 Ubuntu 22.04；不作为直接 wsl 入口，工具不完整；已有系统 SageMath 9.5 仅供兼容旧题，主力请用默认 Ubuntu-CTF 的 SageMath 10.2 |
| Windows Python 3.10 | `C:/Users/glj07/AppData/Local/Programs/Python/Python310/python.exe` | pwntools/pycryptodome/z3/gmpy2/sympy/binwalk/scapy 已装，pip 已配清华源 |
| 爆破字典库 | `D:/CaptureTheFlag/CTFTool/Cryptodictionary` | 46 项：rockyou、SecLists、中文字典、SSTI/JNDI/Webshell 专题、28GB超大字典.7z（按需解压）；Ubuntu-CTF 已软链 /usr/share/wordlists；比赛禁止联网重下 |
| 工具根目录 | `D:/CaptureTheFlag/CTFTool/` | Windows 侧 CTF 工具约 172 项；取证工具在 D:/Forensic/ForensicTool |
| CTF 工作区 | `C:/Users/glj07/Desktop/Codex工作区/Writeup/CTF` | 解题过程目录 Writeup/CTF/来源/分类/题目名；WSL 内资源包 /opt/security-tools（SecLists、PayloadsAllTheThings、theHarvester） |
| 网络与镜像 | `` | 默认无 VPN 国内直连；pip/apt/gem 已配清华源；GitHub 下载可试 mirror.ghproxy.com 前缀；比赛现场避免临时下载工具 |
| IDA/JADX MCP | `记忆 ida-jadx-mcp` | AI 远程操控逆向 GUI：IDA 打开后 Ctrl+Alt+M 启动插件；JADX-GUI 需开着且 8650 端口插件在线；能查反编译/函数/字符串，不能执行脚本 |
| NSSCTF Agent Arena | `skill: nssctf-agent-arena` | agent 自动领题/提交 flag 接口（nssctf-agent-arena skill，Token 在环境变量 NSSCTF_AGENT_TOKEN） |
| LM Studio 本地模型 | `http://localhost:1234` | 离线大模型 27B q4_0，6 并发但每请求仅 13.3K 上下文，超长材料会 context_exceeded，长文本分析优先云端 |

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
| **Burp Suite** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Burpsuite/BurpSuiteV2026.8` | HTTP 抓包改包/Intruder 爆破，Web 题核心 GUI；本机 2026.8 目录 ⚠️路径已由旧版 BurpSuite V2025.9.4 修正为实际 Burpsuite/BurpSuiteV2026.8。 | `启动后浏览器代理 127.0.0.1:8080` <br> `Intruder 爆破时字典用 D:/CaptureTheFlag/CTFTool/Cryptodictionary` |
| **HackBar** | ❌ 未装 | — | Chrome 扩展，快速发 POST/编码请求 ⚠️2026-09-19 目录审计未找到，已移除；需要时重装 Chrome 扩展 | `浏览器加载 HackBar-chrome 目录` |
| **中国蚁剑 AntSword** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/AntSword-Loader-v4` | WebShell 管理器（一句话连接） | `上传一句话后添加数据，连接密码=POST参数名` |
| **冰蝎 Behinder** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Behinder` | 加密流量 WebShell 管理 | `配合 webshell.jsp/php 使用` |
| **GitHack** | 🪟 Win | Win: `C:/Users/glj07/bin/githack.cmd` | .git 目录泄露还原源码 | `githack.cmd <url>/.git/` |
| **git-dumper** | 🪟 Win | Win: `C:/Users/glj07/AppData/Roaming/Python/Python310/Scripts/git-dumper.exe` | .git 泄露还原（GitHack 失败时用，支持 index 缺失） | `git-dumper <url>/.git/ outdir` |
| **Xray** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Xray_1` | 自动化 Web 漏洞扫描器 | `xray webscan --url <url> --html-out out.html` |
| **DirBuster** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/DirBuster` | Java 目录爆破（自带字典，界面直观） | `java -jar DirBuster.jar -u <url> -l 目录字典` |
| **scan4all** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/scan4all_2.9.1_windows_amd64.zip` | 集成 27 种漏洞扫描的一体化扫描器（补 nuclei 盲区） ⚠️压缩包，用时先解压 | `scan4all -t <target>` |

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
| **RsaCtfTool** | 🐧 WSL | WSL: `/opt/security-tools/RsaCtfTool + /opt/ctf-venvs/rsactftool` | RSA 攻击集合；隔离在 rsactftool venv，覆盖分解、低指数、共模、Wiener、格攻击等 ⚠️已安装现代 src 布局版本；入口 /usr/local/bin/rsacrack，运行时使用 /opt/ctf-venvs/rsactftool；Sage 可选后端在 Ubuntu-22.04。 | `rsacrack --publickey key.pub --attack all` <br> `wsl -d Ubuntu-CTF -- rsacrack --publickey key.pub --attack wiener` |
| **fastcoll** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/fastcoll_v1.0.0.5.exe.zip` | MD5 快速碰撞生成（前缀相同后缀碰撞） ⚠️压缩包，用时先解压 | `fastcoll -p prefix.txt -o a.txt b.txt` |
| **hashid** | 🐧 WSL | WSL: `/usr/bin/hashid` | 识别哈希/密文类型 | `hashid 'e10adc3949ba...'` |
| **hashcat** | ✅ 双端 | Win: `D:/Forensic/ForensicTool/Decrypt/hashcat-7.1.2/` <br> WSL: `/usr/bin/hashcat` | GPU 口令破解；本机 RTX 5090 走 Windows 版才有 GPU 加速 ⚠️GPU 爆破用 Windows 版（WSL 无 GPU 直通）；必须在 hashcat.exe 所在目录内运行（OpenCL 内核相对路径）。RTX 5090 实测 2026-09-20: MD5 ~91 GH/s、NTLM ~154 GH/s(全机 162 含核显)——rockyou 字典秒级，8位纯数字掩码分钟级，长随机口令直接换思路 | `hashcat -m 0 -a 0 hash.txt D:/CaptureTheFlag/CTFTool/Cryptodictionary/rockyou` <br> `hashcat -m 1000 nt.txt -a 3 ?u?d?d?d?d?d?d` |
| **john** | 🐧 WSL | WSL: `/usr/sbin/john` | 经典口令破解（zip/ssh2john 转换链好用） | `zip2john flag.zip > hash; john hash --wordlist=/usr/share/wordlists/rockyou` |
| **SageMath** | 🐧 WSL | WSL: `/usr/local/bin/sage -> /root/miniconda3/envs/sage/bin/sage` | 数论全功能（格/椭圆曲线/多项式环）；默认 Ubuntu-CTF 已装隔离 conda 环境 ⚠️SageMath 10.2 安装在 Ubuntu-CTF /root/miniconda3/envs/sage；Ubuntu-22.04 的 9.5 作为旧备用，不是默认入口。 | `wsl -- sage -c "print(factor(123456789))"` <br> `wsl -- sage script.sage` |
| **HashCalc** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/HashCalc.exe` | 图形化哈希计算（MD5/SHA/CRC/base64 一键） | `拖入文件或粘贴文本选算法` |
| **CTFReBox** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/CTFReBox_52` | CTF 编码/加密集成箱（键盘码/敲击码等冷门编码也有） | `GUI 按分类试` |

### 💥 二进制利用 Pwn

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **pwntools** | ✅ 双端 | Win: `pip (Python310)` <br> WSL: `/usr/local/bin/pwn (pip3)` | Pwn 全能框架：连接/payload/shellcode/ELF 解析 | `from pwn import *; p=remote('ip',port)` <br> `cyclic(200) / cyclic_find(0x61616162)` <br> `asm(shellcraft.sh())` |
| **GEF (gdb 插件)** | 🐧 WSL | WSL: `/opt/security-tools/gef/gef.py + /usr/local/bin/gdb-gef` | gdb 增强调试器备用；与 pwndbg 分离，通过 gdb-gef 独立入口切换 ⚠️已安装官方 GEF；独立入口加载 90 个命令，不修改全局 ~/.gdbinit，不与 pwndbg 同时加载。 | `gdb-gef ./pwn` <br> `gdb-gef ./pwn 后: context / heap bins / vmmap / got` |
| **pwndbg** | 🐧 WSL | WSL: `~/.pwndbg + /usr/local/bin/gdb-pwndbg` | gdb 增强调试器；已完成私有 venv 初始化，使用独立 wrapper 不改全局 ~/.gdbinit ⚠️已验证加载 194 个 pwndbg 命令；wrapper 以 gdb -ex source ~/.pwndbg/gdbinit.py 启动。 | `gdb-pwndbg ./pwn` <br> `gdb-pwndbg ./pwn 后: cyclic / heap / search -s flag` |
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
| **exp 模板库 ~/CTF** | 🐧 WSL | WSL: `~/CTF/templates` | WSL 预置 exp 模板：ret2libc/格式化字符串/shellcode/RSA攻击函数库/one-liner速查，cp 下来改参数就用 ⚠️2026-09-19 重建（原 ~/CTF 工作区已丢失，模板+速查恢复） | `cp ~/CTF/templates/pwn_ret2libc.py exp.py 后改 OFFSET/POP_RDI/IP/PORT` <br> `python3 -c "from crypto_rsa_box import *" 或直接跑函数` <br> `cat ~/CTF/templates/cheatsheet.md 查杂项 one-liner` |
| **pwninit** | 🐧 WSL | WSL: `/usr/local/bin/pwninit` | 按题目 libc/ld 自动 patch Pwn 二进制并生成调试模板 ⚠️官方 release 3.3.3，SHA-256 已核验；适合题目目录内运行。 | `pwninit` <br> `pwninit --bin ./pwn --libc ./libc.so.6` |

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
| **dex-tools** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/dex-tools-v2.4` | dex2jar（APK dex 转 jar 再配 jd-gui） | `d2j-dex2jar.bat app.apk 再 jd-gui 打开 jar` |
| **Resource Hacker** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Resource Hacker -5.2.6425简体中文-色汉化版` | exe 资源提取/替换（图标/对话框/字符串表里藏 flag） | `打开 exe 展开 RC 数据/字符串表` |
| **zipalign** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/zipalign.exe` | APK 对齐校验（Android 逆向配套） | `zipalign -c 4 app.apk` |
| **angr** | 🐧 WSL | WSL: `/opt/ctf-venvs/angr/bin/python` | 隔离虚拟环境中的符号执行/CFG 分析框架（含 Unicorn 后端） ⚠️angr 10.0.0 + Unicorn 2.1.4；不改系统 Python，入口 angr-python。 | `/opt/ctf-venvs/angr/bin/python solve.py` <br> `angr-python solve.py` |

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
| **bulk_extractor** | 🐧 WSL | WSL: `/opt/security-tools/bulk_extractor/bin/bulk_extractor` | 批量提取文件中的邮箱/URL/密钥等特征；官方 v2.2.0 源码编译版 ⚠️已用 Ubuntu 官方开发库 + RE2 编译安装；版本 2.2.0。 | `bulk_extractor -o outdir image.raw` <br> `bulk_extractor -o outdir evidence_dir/` |
| **untrunc** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/untrunc_x64` | 损坏 MP4 视频修复 | `untrunc 参考完整.mp4 损坏.mp4` |
| **lads** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/lads.exe` | NTFS ADS 交换数据流检测 | `lads /s D:\` |
| **LastActivityView** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/LastActivityView.exe` | Windows 主机活动痕迹一键查看 | `运行即出报告` |
| **sqlcipher** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/sqlcipher-3.0.1` | 加密 SQLite 数据库读取 | `PRAGMA key='pass'; 后正常查询` |
| **TrueCrypt** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/TrueCrypt Setup 7.1a.exe` | 老牌加密容器（挂载 tc 卷取证） | `Select File 选 .tc 输密码挂载` |
| **WeFlow** | 🪟 Win | Win: `C:/Users/glj07/Desktop/Codex工作区/工具/WeFlow` | 微信 4.0+ 聊天记录本地查看/导出/朋友圈解密，含本地 HTTP API | `运行 exe 自动读取本地微信数据；导出记录写进取证报告` |
| **SQLite Expert** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Database/SQLite Expert Professional-专门用于查看、编辑和分析SQLite数据库文件（常见于手机App）` | SQLite 图形化浏览（Chrome历史/聊天库/取证库直接开） | `打开 .db/.sqlite 看表；损坏库试 Recover` |
| **R-Studio** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/R-Studio` | 专业数据恢复（删除文件/RAID/签名扫描） | `打开磁盘/镜像 -> Scan -> 按签名恢复` |
| **DiskGenius** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/diskgenius吾爱专业破解版 v5` | 磁盘分区/恢复/镜像挂载 | `打开磁盘恢复文件；镜像可挂载浏览` |
| **Python-dsstore** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Python-dsstore` | .DS_Store 文件解析（苹果目录泄露文件名） | `python main.py <.DS_Store> 列出隐藏文件名` |
| **VBCABLE** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/VBCABLE_Driver_Pack43` | 虚拟声卡驱动（把音频环路录给 SSTV 等解码器） | `装驱动后播放设备设为 CABLE Input 再录制` |
| **YARA** | 🐧 WSL | WSL: `/usr/bin/yara` | 恶意样本/取证特征规则匹配 ⚠️Ubuntu 24.04 官方包 4.5.0；适合本地样本和 CTF 附件。 | `yara -w rules.yar sample.bin` <br> `yara -r rules.yar evidence_dir/` |
| **sqlite3 CLI** | 🐧 WSL | WSL: `/usr/bin/sqlite3` | SQLite 数据库命令行检查、导出与损坏库初筛 ⚠️Ubuntu 24.04 官方包 3.45.1；加密库仍用 SQLite Expert/sqlcipher。 | `sqlite3 evidence.db ".tables"` <br> `sqlite3 evidence.db "select * from sqlite_master;"` |

### 🖼️ 隐写与杂项

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **Stegsolve** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/Stegsolve` <br> WSL: `/usr/local/bin/stegsolve.jar` | 图片像素级分析：LSB 通道/分离/叠加 | `java -jar stegsolve.jar → Analyse>Data Extract 逐通道试` <br> `Data Extract: Bit Order LSB First` |
| **steghide** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/steghide` <br> WSL: `/usr/bin/steghide` | jpg/bmp/wav 密码隐写（DCT 频域） | `steghide info img.jpg` <br> `steghide extract -sf img.jpg -p <pass> -xf flag.txt` <br> `无密码试空密码` |
| **zsteg** | 🐧 WSL | WSL: `/usr/local/bin/zsteg` | PNG/BMP LSB 全自动检测（ruby gem） | `zsteg flag.png 逐条看 b1,rgb,lsb,xy 等` |
| **outguess** | 🐧 WSL | WSL: `/usr/bin/outguess` | jpg 统计隐写（steghide 失败后试） | `outguess -r img.jpg out.txt` <br> `有 key: outguess -k key -r img.jpg out.txt` |
| **stegseek** | 🐧 WSL | WSL: `/usr/bin/stegseek` | steghide 密码爆破（跑 rockyou 秒级） ⚠️已安装 Ubuntu 24.04 官方包 0.6；已用合成 JPEG + 合成字典验证提取成功。 | `stegseek img.jpg /usr/share/wordlists/rockyou` <br> `stegseek img.jpg words.txt recovered.txt` |
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
| **MidiEditor** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/MidiEditor-3.3.0-Setup.exe` | MIDI 音轨编辑查看（音符/力度/通道隐写） | `打开 .mid 逐轨看音符排布规律` |
| **RXSSTV** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Setup_RXSSTV.exe` | SSTV 慢扫描电视音频解码成图片 | `播放音频给 RX 模式自动出图（Robot36/Martin1 常见）` |
| **海龟画图** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/海龟画图` | Logo 海龟语言解释器（logo 指令画出 flag 图） | `粘贴 logo 代码运行看绘图` |
| **速查资源图集** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool` | 摩斯密码表.png / 010editor文件头汇总.jpg / 二维码定位点.png / 各厂商网络通讯协议图.png 散在 CTFTool 根目录，解题直接对照 ⚠️CTFTool 根目录已确认包含摩斯密码表、010 Editor 文件头、二维码定位点等图集。 | `看图对照；文件头修复配 010 Editor` |
| **隐形水印工具** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/隐形水印工具.exe` | 图片空域隐形水印加解（盲水印题常见配套）；WaterMark.exe 是同类替代 | `GUI 提取水印图层` |

### 📚 字典与资源包

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **字典库 Cryptodictionary** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/Cryptodictionary` <br> WSL: `/usr/share/wordlists (软链)` | 46 项统一字典库：rockyou、SecLists、中文用户名/密码、SSTI/JNDI/Webshell 专题、28GB 超大字典 7z | `hashcat/john/ffuf 直接传具体文件路径` <br> `28GB 7z 按需解压勿常驻` |
| **/opt/security-tools** | 🐧 WSL | WSL: `/opt/security-tools` | SecLists 完整版 + PayloadsAllTheThings（SSTI/反序列化等 Payload 库）+ theHarvester + sqlmap 源码 | `find /opt/security-tools/SecLists -name '*.txt' 挑字典` <br> `查 Payload 直接 grep` |
| **后台常用密码** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/后台常用密码.txt` | 小而精的中文后台弱口令字典 | `后台登录爆破首选小字典` |
| **GTFOBins 离线库** | 🐧 WSL | WSL: `/opt/security-tools/GTFOBins` | Linux 提权/逃逸命令用法离线库（sudo/suid/capabilities/docker 等 2.6MB） ⚠️已确认 /opt/security-tools/GTFOBins/_gtfobins，约 2.6MB；只查离线资料，不自动执行其中命令。 | `ls /opt/security-tools/GTFOBins/_gtfobins/<命令> 查该命令的提权用法` <br> `grep -rl 'sudo' /opt/security-tools/GTFOBins/_gtfobins \| head` |

### 🧰 桌面辅助

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **7-Zip / Bandizip / WinRAR** | ✅ 双端 | Win: `D:/CaptureTheFlag/CTFTool/7-Zip/7z.exe` <br> WSL: `/usr/bin/7z` | 压缩包处理（伪加密排查/多格式解压） ⚠️Windows 7z.exe 已确认；不在 Windows PATH 时用完整路径 D:/CaptureTheFlag/CTFTool/7-Zip/7z.exe。 | `7z l -slt flag.zip 看详细头信息` <br> `7z x file.7z` |
| **cmder** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/cmder` | Windows 便携终端（内置 ImageStrike 等工具） | `cmder.exe` |
| **VMware** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/VMware` | 虚拟机（跑靶机/内核题环境） | `加载比赛提供 OVA/VMX` |
| **frp** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/frp_0.39.0_windows_amd64.zip` | 内网穿透（线上赛端口转发） | `按赛方 frpc.toml 启动` |
| **Proxifier** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Proxifier_setup_v3.31.exe` | 强制进程走代理 | `配 Burp/Clash 上游` |
| **QtScrcpy / platform-tools** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/QtScrcpy-win-x64-v1.4.5` | 安卓投屏与 adb（Android 题配套） | `adb devices → scrcpy 投屏` |
| **Docker** | 🪟 Win | Win: `docker CLI 29.2.1 (docker-desktop 发行版)` | 起靶场/漏洞环境镜像 | `docker run -d -p 80:80 vulhub/xxx` <br> `docker-desktop 平时停止状态，用时启动` |
| **Notepad++** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Notepad++` | 文本编辑（大文件/HEX 插件） | `HEX-Editor 插件看二进制` |
| **Netcat-win32** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/Netcat-win32-1` | Windows 原生 nc（不想进 WSL 时快速连靶机） | `nc.exe <ip> <port>` |

### 🧱 证据采集与镜像

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **X-Ways Forensics** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mirror/X-Ways Forensics` | 专业磁盘/镜像取证平台：分区、文件系统、时间线、书签与报告 | `打` <br> `开` <br> `案` <br> `件` <br> `→` <br> `添` <br> `加` <br> `镜` <br> `像` <br> `→` <br> `只` <br> `读` <br> `分` <br> `析` <br> `→` <br> `书` <br> `签` <br> `/` <br> `导` <br> `出` <br> `报` <br> `告` |
| **Autopsy** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mirror/Autopsy` | 开源数字取证平台，适合镜像、文件系统、关键字和时间线综合分析 | `新` <br> `建` <br> ` ` <br> `C` <br> `a` <br> `s` <br> `e` <br> `→` <br> `A` <br> `d` <br> `d` <br> ` ` <br> `D` <br> `a` <br> `t` <br> `a` <br> ` ` <br> `S` <br> `o` <br> `u` <br> `r` <br> `c` <br> `e` <br> `→` <br> `I` <br> `n` <br> `g` <br> `e` <br> `s` <br> `t` <br> ` ` <br> `M` <br> `o` <br> `d` <br> `u` <br> `l` <br> `e` <br> `s` <br> `→` <br> `查` <br> `看` <br> `结` <br> `果` |
| **Arsenal Image Mounter** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mirror/Arsenal Image Mounter Professional-将磁盘镜像文件（如.E01, .dd）挂载为Windows虚拟磁盘，便于只读访问` | 将 E01/DD 只读挂载为 Windows 磁盘，供取证工具访问 | `选` <br> `择` <br> ` ` <br> `I` <br> `m` <br> `a` <br> `g` <br> `e` <br> `→` <br> `R` <br> `e` <br> `a` <br> `d` <br> `-` <br> `o` <br> `n` <br> `l` <br> `y` <br> ` ` <br> `M` <br> `o` <br> `u` <br> `n` <br> `t` <br> `→` <br> `记` <br> `录` <br> `盘` <br> `符` <br> `与` <br> `哈` <br> `希` |
| **Mount Image Pro** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mirror/Mount Image Pro-镜像文件挂载工具` | 多格式磁盘镜像挂载 | `选` <br> `择` <br> `镜` <br> `像` <br> `→` <br> `只` <br> `读` <br> `挂` <br> `载` <br> `→` <br> `在` <br> ` ` <br> `X` <br> `-` <br> `W` <br> `a` <br> `y` <br> `s` <br> `/` <br> `A` <br> `u` <br> `t` <br> `o` <br> `p` <br> `s` <br> `y` <br> ` ` <br> `中` <br> `分` <br> `析` |
| **Virtual Forensic Computing** | 🪟 Win | Win: `D:/Forensic/ForensicTool/HelperKit/Virtual Forensic Computing-证据仿真工具，可直接启动嫌疑人的磁盘镜像` | 在隔离虚拟机中启动镜像观察系统行为 | `复` <br> `制` <br> `证` <br> `据` <br> `镜` <br> `像` <br> `→` <br> `隔` <br> `离` <br> `启` <br> `动` <br> `→` <br> `记` <br> `录` <br> `行` <br> `为` <br> `与` <br> `截` <br> `图` |

### ♻️ 恢复与解密

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **UFS Explorer** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mirror/UFS Explorer Professional Recovery-数据恢复和镜像挂载工具，支持复杂RAID重组` | 复杂文件系统、RAID 和镜像恢复 | `打` <br> `开` <br> `镜` <br> `像` <br> `→` <br> `S` <br> `c` <br> `a` <br> `n` <br> `/` <br> `R` <br> `A` <br> `I` <br> `D` <br> ` ` <br> `重` <br> `组` <br> `→` <br> `恢` <br> `复` <br> `到` <br> `另` <br> `一` <br> `块` <br> `盘` |
| **R-Studio/RDS** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Decrypt/RDS_2024-likely 是 R-Studio 网络版，强大的数据恢复工具，也用于破解简单密码` | 删除文件、分区、RAID 与镜像数据恢复 | `选` <br> `择` <br> `源` <br> `盘` <br> `/` <br> `镜` <br> `像` <br> `→` <br> `S` <br> `c` <br> `a` <br> `n` <br> `→` <br> `预` <br> `览` <br> `→` <br> `恢` <br> `复` <br> `到` <br> `独` <br> `立` <br> `输` <br> `出` <br> `盘` |
| **FinalData/Fatbeans** | 🪟 Win | Win: `D:/Forensic/ForensicTool/FileDataRecovery/Fatbeans-likely 是 FinalData，经典的数据恢复软件` | 文件删除恢复和签名扫描 | `选` <br> `择` <br> `镜` <br> `像` <br> `→` <br> `扫` <br> `描` <br> `已` <br> `删` <br> `除` <br> `文` <br> `件` <br> `→` <br> `导` <br> `出` <br> `到` <br> `工` <br> `作` <br> `副` <br> `本` |
| **PuzzleSolver** | 🪟 Win | Win: `D:/Forensic/ForensicTool/FileDataRecovery/PuzzleSolver-main` | 特定文件/密码恢复辅助工具集合 | `先` <br> `阅` <br> `读` <br> ` ` <br> `R` <br> `E` <br> `A` <br> `D` <br> `M` <br> `E` <br> `，` <br> `再` <br> `对` <br> `副` <br> `本` <br> `执` <br> `行` <br> `恢` <br> `复` |
| **Passware Kit Forensic** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Decrypt/Passware Kit Forensic 2022（汉化版）` | 文件、容器和凭据密码恢复套件 | `选` <br> `择` <br> `案` <br> `件` <br> `文` <br> `件` <br> `→` <br> `选` <br> `择` <br> `攻` <br> `击` <br> `方` <br> `式` <br> `→` <br> `恢` <br> `复` <br> `到` <br> `工` <br> `作` <br> `副` <br> `本` |
| **Elcomsoft Forensic Disk Decryptor** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Decrypt/Elcomsoft.Forensic.Disk.Decryptor` | 加密磁盘/容器取证辅助 | `导` <br> `入` <br> `密` <br> `钥` <br> `材` <br> `料` <br> `/` <br> `镜` <br> `像` <br> `→` <br> `只` <br> `读` <br> `解` <br> `密` <br> `分` <br> `析` |
| **Ciphey** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Decrypt/Ciphey` | 自动识别与解码常见编码/密码文本 | `c` <br> `i` <br> `p` <br> `h` <br> `e` <br> `y` <br> ` ` <br> `-` <br> `t` <br> ` ` <br> `"` <br> `密` <br> `文` <br> `"` |

### 🧠 内存取证

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **Volatility 3** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Decrypt/volatility3-develop/volatility3-develop/vol.py` | 内存镜像进程、网络、文件、注册表和凭据分析 | `v` <br> `o` <br> `l` <br> ` ` <br> `-` <br> `f` <br> ` ` <br> `m` <br> `e` <br> `m` <br> `.` <br> `r` <br> `a` <br> `w` <br> ` ` <br> `w` <br> `i` <br> `n` <br> `d` <br> `o` <br> `w` <br> `s` <br> `.` <br> `i` <br> `n` <br> `f` <br> `o` <br> `;` <br> ` ` <br> `v` <br> `o` <br> `l` <br> ` ` <br> `-` <br> `f` <br> ` ` <br> `m` <br> `e` <br> `m` <br> `.` <br> `r` <br> `a` <br> `w` <br> ` ` <br> `w` <br> `i` <br> `n` <br> `d` <br> `o` <br> `w` <br> `s` <br> `.` <br> `p` <br> `s` <br> `l` <br> `i` <br> `s` <br> `t` <br> `;` <br> ` ` <br> `v` <br> `o` <br> `l` <br> ` ` <br> `-` <br> `f` <br> ` ` <br> `m` <br> `e` <br> `m` <br> `.` <br> `r` <br> `a` <br> `w` <br> ` ` <br> `w` <br> `i` <br> `n` <br> `d` <br> `o` <br> `w` <br> `s` <br> `.` <br> `f` <br> `i` <br> `l` <br> `e` <br> `s` <br> `c` <br> `a` <br> `n` |

### 📡 网络流量取证

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **Fiddler Everywhere** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Web/fiddler-everywhere-Web调试代理工具，捕获和分析HTTPHTTPS流量` | HTTP/HTTPS 调试代理与请求重放 | `启` <br> `动` <br> `代` <br> `理` <br> `→` <br> `导` <br> `入` <br> `会` <br> `话` <br> `→` <br> `保` <br> `存` <br> ` ` <br> `H` <br> `A` <br> `R` <br> `/` <br> `请` <br> `求` <br> `证` <br> `据` |

### 🗃️ 数据库取证

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **DB Browser for SQLite** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Database/DB/DB Browser for SQLite.exe` | SQLite 数据库初筛、表浏览和 CSV 导出 | `打` <br> `开` <br> `副` <br> `本` <br> `→` <br> `B` <br> `r` <br> `o` <br> `w` <br> `s` <br> `e` <br> ` ` <br> `D` <br> `a` <br> `t` <br> `a` <br> `→` <br> `导` <br> `出` <br> `关` <br> `键` <br> `表` |
| **DB Browser for SQLCipher** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Database/DB/DB Browser for SQLCipher.exe` | 加密 SQLite/SQLCipher 数据库查看 | `打` <br> `开` <br> `数` <br> `据` <br> `库` <br> `→` <br> `输` <br> `入` <br> ` ` <br> `k` <br> `e` <br> `y` <br> `→` <br> `导` <br> `出` <br> `查` <br> `询` <br> `结` <br> `果` |
| **SQLCipher** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/sqlcipher-3.0.1` | 加密 SQLite 命令行读取 | `s` <br> `q` <br> `l` <br> `c` <br> `i` <br> `p` <br> `h` <br> `e` <br> `r` <br> ` ` <br> `d` <br> `b` <br> `.` <br> `s` <br> `q` <br> `l` <br> `i` <br> `t` <br> `e` <br> `;` <br> ` ` <br> `P` <br> `R` <br> `A` <br> `G` <br> `M` <br> `A` <br> ` ` <br> `k` <br> `e` <br> `y` <br> `=` <br> `"` <br> `p` <br> `a` <br> `s` <br> `s` <br> `"` <br> `;` <br> ` ` <br> `.` <br> `t` <br> `a` <br> `b` <br> `l` <br> `e` <br> `s` <br> `;` |
| **HexHub** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Database/HexHub` | 数据库/十六进制相关本地分析工具 | `打` <br> `开` <br> `副` <br> `本` <br> `→` <br> `按` <br> `项` <br> `目` <br> `功` <br> `能` <br> `查` <br> `看` <br> `结` <br> `构` <br> `与` <br> `字` <br> `段` |
| **NTFS Log Tracker** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Database/NTFS Log Tracker-分析NTFS文件系统的日志（$LogFile），追踪文件操作历史` | NTFS $LogFile 操作记录和文件活动分析 | `导` <br> `入` <br> ` ` <br> `$` <br> `L` <br> `o` <br> `g` <br> `F` <br> `i` <br> `l` <br> `e` <br> `→` <br> `按` <br> `时` <br> `间` <br> `/` <br> `路` <br> `径` <br> `筛` <br> `选` <br> `→` <br> `导` <br> `出` <br> `报` <br> `告` |

### 📱 手机取证

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **Magnet AXIOM** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mobile/magnetaxiom.all.to.9.9.0.46675` | 综合电脑/手机/云取证分析平台，自动解析应用与时间线 | `创` <br> `建` <br> ` ` <br> `C` <br> `a` <br> `s` <br> `e` <br> `→` <br> `添` <br> `加` <br> `镜` <br> `像` <br> `/` <br> `备` <br> `份` <br> `→` <br> `P` <br> `r` <br> `o` <br> `c` <br> `e` <br> `s` <br> `s` <br> `→` <br> `A` <br> `n` <br> `a` <br> `l` <br> `y` <br> `z` <br> `e` <br> `→` <br> `导` <br> `出` <br> `报` <br> `告` |
| **UFED** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mobile/UFED-全球顶尖的手机物理取证工具` | 手机物理提取与移动设备取证平台 | `按` <br> `设` <br> `备` <br> `型` <br> `号` <br> `选` <br> `择` <br> ` ` <br> `e` <br> `x` <br> `t` <br> `r` <br> `a` <br> `c` <br> `t` <br> `i` <br> `o` <br> `n` <br> ` ` <br> `p` <br> `r` <br> `o` <br> `f` <br> `i` <br> `l` <br> `e` <br> `→` <br> `保` <br> `存` <br> `原` <br> `始` <br> `提` <br> `取` <br> `物` <br> `→` <br> `在` <br> `分` <br> `析` <br> `工` <br> `具` <br> `中` <br> `解` <br> `析` |
| **iBackup Viewer** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mobile/iBackup Viewer Pro-专门用于解析和查看苹果iTunes备份文件的内容` | Apple iTunes 备份解析 | `打` <br> `开` <br> `备` <br> `份` <br> `→` <br> `查` <br> `看` <br> `消` <br> `息` <br> `/` <br> `照` <br> `片` <br> `/` <br> `联` <br> `系` <br> `人` <br> `→` <br> `导` <br> `出` <br> `证` <br> `据` |
| **plist Editor Pro** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mobile/plist Editor Pro` | Apple plist 配置与取证字段查看 | `打` <br> `开` <br> ` ` <br> `p` <br> `l` <br> `i` <br> `s` <br> `t` <br> ` ` <br> `副` <br> `本` <br> `→` <br> `查` <br> `看` <br> `键` <br> `值` <br> `/` <br> `时` <br> `间` <br> `字` <br> `段` |
| **AndroidKiller** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mobile/AndroidKiller-master` | Android APK 反编译与资源分析 | `导` <br> `入` <br> ` ` <br> `A` <br> `P` <br> `K` <br> `→` <br> `查` <br> `看` <br> ` ` <br> `M` <br> `a` <br> `n` <br> `i` <br> `f` <br> `e` <br> `s` <br> `t` <br> `/` <br> `代` <br> `码` <br> `/` <br> `资` <br> `源` <br> `→` <br> `导` <br> `出` <br> `证` <br> `据` |
| **PH-PhoneForensics** | 🪟 Win | Win: `D:/Forensic/ForensicTool/pinghang/PH-PhoneForensics` | 平航移动取证工具，手机数据提取/解析辅助 | `按` <br> `设` <br> `备` <br> `/` <br> `备` <br> `份` <br> `类` <br> `型` <br> `导` <br> `入` <br> `→` <br> `生` <br> `成` <br> `案` <br> `件` <br> `报` <br> `告` |
| **JADX GUI AI (Forensic)** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Others/jadx-gui-ai-master` | Android 应用取证/逆向查看，含 AI MCP 连接能力 | `启` <br> `动` <br> ` ` <br> `G` <br> `U` <br> `I` <br> `→` <br> `导` <br> `入` <br> ` ` <br> `A` <br> `P` <br> `K` <br> `→` <br> `搜` <br> `索` <br> `数` <br> `据` <br> `库` <br> `/` <br> `A` <br> `P` <br> `I` <br> `/` <br> `密` <br> `钥` |

### 🕒 时间线与主机活动

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **DCode** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Others/DCode v5` | Windows 时间戳、FILETIME、Unix 时间转换 | `输` <br> `入` <br> `十` <br> `六` <br> `进` <br> `制` <br> `/` <br> `十` <br> `进` <br> `制` <br> `时` <br> `间` <br> `戳` <br> `→` <br> `核` <br> `对` <br> ` ` <br> `U` <br> `T` <br> `C` <br> `/` <br> `本` <br> `地` <br> `时` <br> `间` |
| **Autopsy/时间线模块** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Mirror/Autopsy` | 从文件系统和日志构建统一时间线 | `I` <br> `n` <br> `g` <br> `e` <br> `s` <br> `t` <br> ` ` <br> `后` <br> `打` <br> `开` <br> ` ` <br> `T` <br> `i` <br> `m` <br> `e` <br> `l` <br> `i` <br> `n` <br> `e` <br> `→` <br> `按` <br> `来` <br> `源` <br> `/` <br> `时` <br> `间` <br> `/` <br> `关` <br> `键` <br> `字` <br> `筛` <br> `选` |

### 🖥️ 主机与系统取证

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **Lads ADS** | 🪟 Win | Win: `D:/CaptureTheFlag/CTFTool/lads.exe` | NTFS Alternate Data Streams 检测 | `l` <br> `a` <br> `d` <br> `s` <br> ` ` <br> `/` <br> `s` <br> ` ` <br> `D` <br> `:` <br> `\` <br> `；` <br> `P` <br> `o` <br> `w` <br> `e` <br> `r` <br> `S` <br> `h` <br> `e` <br> `l` <br> `l` <br> ` ` <br> `G` <br> `e` <br> `t` <br> `-` <br> `I` <br> `t` <br> `e` <br> `m` <br> ` ` <br> `-` <br> `S` <br> `t` <br> `r` <br> `e` <br> `a` <br> `m` <br> ` ` <br> `*` |
| **regipy** | 🐧 WSL | WSL: `pip install regipy` | Python 注册表解析库 ⚠️按需安装，使用证据副本 | `p` <br> `y` <br> `t` <br> `h` <br> `o` <br> `n` <br> `3` <br> ` ` <br> `-` <br> `c` <br> ` ` <br> `"` <br> `f` <br> `r` <br> `o` <br> `m` <br> ` ` <br> `r` <br> `e` <br> `g` <br> `i` <br> `p` <br> `y` <br> `.` <br> `r` <br> `e` <br> `g` <br> `i` <br> `s` <br> `t` <br> `r` <br> `y` <br> ` ` <br> `i` <br> `m` <br> `p` <br> `o` <br> `r` <br> `t` <br> ` ` <br> `R` <br> `e` <br> `g` <br> `i` <br> `s` <br> `t` <br> `r` <br> `y` <br> `"` |
| **python-evtx** | 🐧 WSL | WSL: `pip install python-evtx` | Windows EVTX 事件日志解析库 ⚠️按需安装，清华源 | `p` <br> `i` <br> `p` <br> ` ` <br> `i` <br> `n` <br> `s` <br> `t` <br> `a` <br> `l` <br> `l` <br> ` ` <br> `p` <br> `y` <br> `t` <br> `h` <br> `o` <br> `n` <br> `-` <br> `e` <br> `v` <br> `t` <br> `x` <br> `;` <br> ` ` <br> `p` <br> `y` <br> `t` <br> `h` <br> `o` <br> `n` <br> ` ` <br> `p` <br> `a` <br> `r` <br> `s` <br> `e` <br> `_` <br> `e` <br> `v` <br> `t` <br> `x` <br> `.` <br> `p` <br> `y` <br> ` ` <br> `S` <br> `e` <br> `c` <br> `u` <br> `r` <br> `i` <br> `t` <br> `y` <br> `.` <br> `e` <br> `v` <br> `t` <br> `x` |
| **FileLocator Pro** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Database/FileLocator Pro-强大的文件内容搜索工具，可快速在全盘搜索关键词` | 案件目录内全文/正则/文件名搜索 | `限` <br> `定` <br> `证` <br> `据` <br> `目` <br> `录` <br> `→` <br> `搜` <br> `索` <br> `关` <br> `键` <br> `字` <br> `→` <br> `导` <br> `出` <br> `命` <br> `中` <br> `路` <br> `径` |

### 🧬 恶意样本与规则

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **strings / file / sha256sum** | 🐧 WSL | WSL: `/usr/bin/strings` | 样本初筛：文件类型、字符串和证据哈希 | `f` <br> `i` <br> `l` <br> `e` <br> ` ` <br> `s` <br> `a` <br> `m` <br> `p` <br> `l` <br> `e` <br> `;` <br> ` ` <br> `s` <br> `h` <br> `a` <br> `2` <br> `5` <br> `6` <br> `s` <br> `u` <br> `m` <br> ` ` <br> `s` <br> `a` <br> `m` <br> `p` <br> `l` <br> `e` <br> `;` <br> ` ` <br> `s` <br> `t` <br> `r` <br> `i` <br> `n` <br> `g` <br> `s` <br> ` ` <br> `-` <br> `a` <br> ` ` <br> `s` <br> `a` <br> `m` <br> `p` <br> `l` <br> `e` <br> ` ` <br> `\|` <br> ` ` <br> `l` <br> `e` <br> `s` <br> `s` |

### 🧩 固件与文件结构

| 工具 | 状态 | 位置 | 用途 | 常用命令 |
| --- | --- | --- | --- | --- |
| **UEFITool** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Others/UEFITool_NE_A72_win64` | UEFI 固件结构查看与模块提取 | `打` <br> `开` <br> ` ` <br> `R` <br> `O` <br> `M` <br> `→` <br> `树` <br> `状` <br> `查` <br> `看` <br> ` ` <br> `F` <br> `V` <br> `/` <br> `P` <br> `E` <br> `I` <br> `/` <br> `D` <br> `X` <br> `E` <br> `→` <br> `导` <br> `出` <br> `模` <br> `块` |
| **CFF Explorer** | 🪟 Win | Win: `D:/Forensic/ForensicTool/Reverse/CFF_Explorer-强大的PE文件（Windows可执行文件）编辑器` | PE 结构、节、导入导出表分析 | `打` <br> `开` <br> ` ` <br> `P` <br> `E` <br> `→` <br> `查` <br> `看` <br> ` ` <br> `H` <br> `e` <br> `a` <br> `d` <br> `e` <br> `r` <br> `s` <br> `/` <br> `S` <br> `e` <br> `c` <br> `t` <br> `i` <br> `o` <br> `n` <br> `s` <br> `/` <br> `I` <br> `m` <br> `p` <br> `o` <br> `r` <br> `t` <br> `s` |

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
| Crypto | **RSA 低私钥指数 Wiener（d 很小）** | python3 手写连分数 | `对 e/n 做连分数展开求 k/d，验证 d < n^0.25/3` | RsaCtfTool --attack wiener |
| Crypto | **RSA p q 相近（费马分解）** | python3 + gmpy2 | `a=gmpy2.iroot(n,2)[0]; 向上枚举检查 a^2-n 是否完全平方得 p,q` | yafu |
| Crypto | **RSA Rabin（e=2）** | python3 手写 | `m^2=c mod n：mod p 与 mod q 各开平方，CRT 组合四种结果逐个试` | RsaCtfTool --attack rabin |
| Crypto | **n 含小因子/素数试除** | python3 + sympy.factorint | `sympy.factorint(n, limit=10**7)；或先查 factordb.com` | yafu |
| Crypto | **ECC 椭圆曲线（点乘/小阶离散对数）** | python3 手写/sagecell | `点加/倍点手写；小曲线 BSGS；sagecell 直接 EllipticCurve` | sympy discrete_log（有限域） |
| Crypto | **仿射/希尔密码** | python3 手写解方程 | `两对明密文解 a,b（逆元 gmpy2.invert）；希尔矩阵求逆 mod 26` | 随波逐流 |
| Crypto | **rot47/rotN 全旋转枚举** | CyberChef | `ROT13 Brute Force 看全部偏移；rot47 选 ROT47` | CaptfEncoder |
| Crypto | **jsfuck/颜文字编码** | 浏览器控制台/Node | `粘贴到 console 回车 eval；WSL node -e 亦可` | CyberChef |
| Crypto | **与佛论禅/熊曰/新佛曰** | 随波逐流 | `随波逐流 中文加密分类一键解；无 GUI 时在线与佛论禅` | CTFReBox |
| Crypto | **键盘码/敲击码/九键** | CTFReBox + 人工 | `敲击码按行列对照；九键按 数字*次数 映射九宫格字母` | 随波逐流 |
| Crypto | **A1Z26/当铺/拼音首字母** | 随波逐流 | `A1Z26 数字转字母序号；当铺按汉字出头笔画数对照` | CyberChef |
| Crypto | **CRC32 校验/碰撞** | python3 zlib | `zlib.crc32(data)；伪造碰撞用 CRC 反算脚本` | HashCalc |
| Crypto | **MD5 假盐/fake_salt 变体** | 本机 fake_salt 工具目录 | `D:/CaptureTheFlag/CTFTool/密码学fake_salt_md5 目录内脚本` | python3 手写 |
| Pwn | **栈迁移 stack pivot（栈不够长）** | ROPgadget + pwntools | `找 leave;ret gadget，先写 bss 假栈再 pivot 执行第二段 ROP` | one_gadget 配合 |
| Pwn | **SROP（rt_sigreturn）** | pwntools SigreturnFrame | `frame=SigreturnFrame(); frame.rax=59... 构造 execve('/bin/sh')` | 手写字节 |
| Pwn | **ret2csu（64位 gadget 不足）** | objdump 找 __libc_csu_init | `objdump -d ./pwn \| grep -A20 csu_init；csu gadget 控制 rdi/rsi/rdx` | ropper --search pop |
| Pwn | **ret2shellcode（栈/bss 可执行）** | pwntools shellcraft | `checksec 看 NX 关；shellcraft.amd64.linux.sh() 后跳转执行` | shellcraft.orw |
| Pwn | **FSOP / _IO_FILE 劫持（glibc 2.35+）** | 手写伪造 FILE 结构 | `伪造 _IO_wfile_jump 链走 wide_data；exit 触发 _IO_flush_all` | house of apple 思路 |
| Pwn | **canary 泄露绕过** | 格式化字符串/pwntools | `%N$p 泄漏 canary 尾字节，溢出时原样回填；fork 题可逐字节爆破` | GEF 泄漏 |
| Pwn | **partial overwrite 部分覆盖** | pwntools | `只覆盖返回地址低 1-2 字节跳附近后门（爆破 4/12 bit）` | 堆 partial unlink |
| Pwn | **tcache poisoning / off-by-null** | GEF heap 调试 | `gdb 里 heap bins 观察；改 fd 指向目标（2.34 前 __free_hook）` | house of botcake |
| Reverse | **APK native 层（lib/*.so）** | IDA + jadx 配合 | `jadx 找 JNI 函数名，IDA 打开对应 .so F5 静态分析` | JEB 混合视图 |
| Reverse | **Flutter 应用逆向** | IDA + snapshot 特征 | `libapp.so 是 Dart snapshot；字符串硬编码在 snapshot 里先 strings 试` | blutter（未装，GitHub） |
| Reverse | **Go/Rust 二进制** | IDA + 符号恢复 | `Go: 加载 gopclntab 恢复函数名；Rust: strings 找 panic 路径定位逻辑` | Ghidra |
| Reverse | **控制流平坦化（OLLVM）** | IDA 脚本 deflat | `识别 dispatcher 主循环；符号执行去平坦化` | Unicorn 模拟 |
| Reverse | **VMP/Themida 重壳** | x64dbg 动态跟踪 | `DiE 确认壳类型，运行到 ODP（原始入口）后 dump 修复 IAT` | 沙箱行为观察 |
| Reverse | **易语言程序** | IDA + E-code 分析 | `识别 krnln.fnr 引用；表结构用易语言专用解析器` | 字符串+窗口事件跟踪 |
| Reverse | **NSIS/Inno/自解压打包** | 7z 直接解 | `7z x setup.exe 常直接出原始文件` | binwalk |
| Web | **SSRF + gopher 打内网** | Burp 构造 | `gopher://127.0.0.1:6379/_*1... 打 redis/fastcgi；dict:// 探端口` | curl gopher |
| Web | **XXE 注入** | Burp 改包 | `DOCTYPE 实体读 file:///etc/passwd；参数实体+php://filter 外带` | 外部 DTD |
| Web | **LFI 文件包含 php://filter chain** | Burp/curl 构造 | `php://filter/convert.iconv... 长 chain 触发 RCE（在线生成器辅助）` | data:// 伪协议 |
| Web | **日志包含/条件竞争** | Burp Intruder | `UA 写马后包含 access.log；竞争用 Intruder 20 线程 Null payload` | python 多线程 |
| Web | **NodeJS 原型链污染** | 审计 JS 源码 | `__proto__ 污染后 merge/clone 触发；配 child_process/eval RCE` | ejs/handlebars gadget |
| Web | **Shiro/Log4j 反序列化** | Burp + 特征检测 | `Shiro: rememberMe 弱密钥（默认 kPH+Ix1g...）；Log4j: ${jndi:ldap://dnslog} 试探` | JNDI 字典（Cryptodictionary/JNDI.txt） |
| Web | **文件上传绕过（黑名单/魔术头）** | Burp 改包 | `.htaccess/.user.ini 绕过；GIF89a 头+.php；::$DATA/双写后缀` | 蚁剑连接 |
| Web | **Tomcat/Nginx 解析漏洞** | Burp | `Tomcat PUT: OPTIONS 后 PUT /shell.jsp/；Nginx: 1.jpg/.php 配 fix_pathinfo` | IIS .asa 解析 |
| Web | **XSS 打 Cookie/后台** | Burp 构造 | `img onerror 外带；后台存储型 XSS 偷管理员会话` | CSP 绕过 jsonp |
| Forensics | **E01/RAW 磁盘镜像取证** | DiskGenius/R-Studio | `DiskGenius 增载镜像浏览分区；R-Studio 按签名恢复删除文件` | FTK Imager（未装） |
| Forensics | **Windows 注册表取证** | regedit 导出 + python | `重点 NTUSER.dat/SYSTEM/SAM：Run 启动项、USBSTOR、MountPoints2、ShimCache` | regipy（WSL pip） |
| Forensics | **evtx 事件日志分析** | WSL python-evtx | `pip install python-evtx 解析 Security.evtx 看 4624/4672 事件` | EventLogExplorer（未装） |
| Forensics | **回收站 $I/$R 文件** | python 手写解析 | `$I 头：版本+64位 FILETIME+原路径；$R 是原内容` | R-Studio 图形化 |
| Forensics | **浏览器历史/密码提取** | SQLite Expert + python | `History.db 查 urls/visits；Login Data 用 DPAPI 解密` | WeFlow（微信场景） |
| Forensics | **微信/QQ 聊天记录取证** | WeFlow | `WeFlow 4.5.1 读本地微信 4.0+ 数据库导出 HTML/CSV` | SQLite Expert + 密钥解密 |
| Forensics | **BitLocker/VeraCrypt/TC 加密卷** | PasswareKit | `选容器类型后字典/GPU 恢复口令；TC 卷用 TrueCrypt 7.1a 挂载` | hashcat 提取后爆破 |
| Forensics | **WiFi 握手包破解** | WSL hashcat | `aircrack-ng 转 hc22000 后 hashcat -m 22000；GPU 用 Windows hashcat` | john --wordlist |
| Forensics | **PDF 流对象/隐藏文字** | qpdf/mutool | `mutool show in.pdf objects；qpdf --qdf 拆流对象找 JS/隐藏内容` | pdftotext + 010 Editor |
| Forensics | **Office 隐藏内容（docx/xlsx）** | 7z 解包 + grep | `docx 即 zip：unzip 后看 word/document.xml 的 vanish 隐藏文本` | 010 Editor 模板 |
| Misc | **SSTV 音频还原图片** | RXSSTV | `播放 wav 给 RXSSTV（Robot36/Martin1 常见）；VBCABLE 虚拟声卡内录` | 在线 SSTV 解码 |
| Misc | **DTMF 拨号音** | Audacity 频谱 | `频谱看双频组合对照 DTMF 表拼号码；或 python Goertzel 手写` | dtmf2num（未装） |
| Misc | **汉信码/条形码/残缺码** | 随波逐流 + QR_Research | `随波逐流识别多码制；残缺二维码 PS 补三个定位角再识别` | ZXing 在线 |
| Misc | **MIDI 音符隐写** | MidiEditor | `逐轨看音符：音高=A1Z26、力度/通道藏比特、音符拼写字母` | python mido（pip） |
| Misc | **Logo 海龟画图指令** | 海龟画图工具 | `粘贴 logo 指令运行，轨迹画出 flag；可 python turtle 重放` | python turtle |
| Misc | **二维码碎片拼接/反色** | PS + QR_Research | `碎片拼完整图（对齐定位角）后反色/补静区再识别` | python PIL 拼接 |
| Misc | **Linux 提权/sudo 逃逸/docker 逃逸** | GTFOBins 离线库 | `拿到低权 shell 后先 sudo -l；按可执行命令查 /opt/security-tools/GTFOBins/_gtfobins 对应用法` | linpeas（未装，可 GitHub 拉） |
| Reverse | **符号执行/复杂输入约束** | angr | `angr-python solve.py；先 CFGFast 再按约束找 stdin/path` | z3-solver 手写约束 |
| Pwn | **题目附带 libc/ld 本地复现** | pwninit | `pwninit 后检查生成的 patch/solve.py，再用 gdb-pwndbg 调试` | patchelf 手工设置 interpreter/rpath |
| Forensics | **文件特征规则匹配** | YARA | `yara -r rules.yar evidence_dir/` | strings + grep |
| Forensics | **SQLite 数据库快速初筛** | sqlite3 CLI | `sqlite3 evidence.db ".tables"；再查 sqlite_master 和关键表` | SQLite Expert |
| Forensics | **磁盘镜像案件标准流程** | X-Ways Forensics / Autopsy | `保留原件→计算 SHA256→只读挂载→Ingest→时间线/关键字→书签→导出报告` | Arsenal Image Mounter + SQLite Expert |
| Forensics | **E01/RAW 镜像只读挂载** | Arsenal Image Mounter | `选择 E01/DD→Read-only Mount→记录盘符、镜像哈希和挂载时间` | Mount Image Pro / X-Ways |
| Forensics | **Windows 主机时间线** | Autopsy Timeline + LastActivityView | `导入镜像→Run Ingest→Timeline 按时间/来源/用户筛选→交叉验证事件` | X-Ways / NTFS Log Tracker |
| Forensics | **NTFS $LogFile/$UsnJrnl 活动分析** | NTFS Log Tracker + X-Ways | `导出 $LogFile/$UsnJrnl→按路径/时间筛选→关联文件系统时间戳` | Autopsy |
| Forensics | **Windows 注册表 Run/USBSTOR/MountPoints2** | regipy + Registry Explorer（如有） | `提取 NTUSER.dat/SYSTEM/SAM→解析 Run、USBSTOR、MountPoints2、ShimCache→记录时间线` | regedit/Autopsy |
| Forensics | **EVTX 安全日志 4624/4672/4688** | python-evtx + Windows Event Viewer | `解析 Security.evtx→筛 4624 登录、4672 特权、4688 进程创建→按时间核对` | Autopsy |
| Forensics | **浏览器历史/下载/登录库** | SQLite Expert / DB Browser for SQLite | `复制 History/Login Data→查 urls、visits、downloads、logins→导出 CSV` | sqlite3 CLI |
| Forensics | **SQLite/SQLCipher 应用数据库** | DB Browser for SQLite/SQLCipher | `对副本打开→.tables/Schema→按时间和关键字查询→导出结果` | SQLite Expert / sqlite3 CLI |
| Forensics | **微信聊天记录与媒体** | WeFlow | `读取微信 4.0+ 数据→按联系人/时间/关键词筛选→导出 HTML/CSV 和媒体证据` | SQLite Expert |
| Forensics | **手机备份/iOS plist/Android APK** | UFED / iBackup Viewer / PH-PhoneForensics | `保存原始备份→解析数据库/plist→Android APK 交给 JADX→生成案件报告` | AndroidKiller / JADX |
| Forensics | **内存镜像进程/文件/网络** | Volatility 3 | `vol -f mem.raw windows.info→pslist/pstree→filescan→netscan→dumpfiles` | bulk_extractor |
| Forensics | **内存镜像凭据/BitLocker 密钥** | Volatility 3 + Passware/Elcomsoft | `先识别 profile→提取进程/注册表/密钥材料→在工作副本解密分析` | strings + YARA |
| Forensics | **PCAP HTTP/DNS/TLS 流量** | Wireshark/tshark | `Follow TCP/HTTP Stream→Export Objects→DNS 查询筛选→保存过滤器和截图` | CTF-NetA/tcpdump |
| Forensics | **USB HID 键盘鼠标流量** | Wireshark + CTF-NetA | `过滤 usb.capdata→按 HID 报告解析→还原按键/鼠标→与时间线核对` | tshark + Python |
| Forensics | **恶意样本初筛与规则匹配** | file/sha256sum/strings + YARA | `计算哈希→file→strings→yara -r rules.yar→隔离沙箱动态观察` | CFF Explorer / Volatility |
| Forensics | **文件特征/邮箱/URL 批量提取** | bulk_extractor | `bulk_extractor -o outdir image.raw→查看 feature-files→回到原证据定位上下文` | strings/grep |
| Forensics | **删除文件/分区/RAID 恢复** | R-Studio/UFS Explorer | `镜像副本→Scan→预览→恢复到不同磁盘→计算恢复文件哈希` | FinalData/R-Studio |
| Forensics | **加密卷/BitLocker/TrueCrypt 密码恢复** | Passware/Elcomsoft/TrueCrypt | `确认容器类型→保留密钥材料→字典/GPU 恢复→只读挂载分析` | Windows hashcat |
| Forensics | **时间戳转换与时间线核对** | DCode | `识别 FILETIME/Unix/浏览器时间格式→转换 UTC/本地→记录时区` | Python datetime |
| Forensics | **UEFI/固件结构提取** | UEFITool + binwalk | `计算固件哈希→UEFITool 查看 FV/模块→导出→binwalk 辅助提取` | strings |
| Forensics | **PE 样本结构/导入导出分析** | CFF Explorer + Detect It Easy | `确认 PE 架构/节/导入表→查壳和编译器→再交给 IDA/x64dbg` | IDA/DiE |

## 更新记录

- 2026-09-21 手册升级：命令一键复制、考点↔工具双向互跳、URL 深链（#cat-x&q=y）、多词 AND 搜索+高亮、收藏置顶、打印导出、内嵌 JSON 数据。
- 2026-09-21 首次生成：工具 185 项，考点映射 130 条；WSL 已补装 gdb-multiarch/strace/ltrace/patchelf/qemu-user/upx/tshark/tcpdump/steghide/outguess/fcrackzip/zip/qpdf/mutool/socat/ncat/hashid/masscan/musl-tools + seccomp-tools + z3 + one_gadget。
